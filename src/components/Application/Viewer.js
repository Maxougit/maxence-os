'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Viewer.module.css';

const textStyle = {
  whiteSpace: 'pre-wrap',
  fontFamily: 'var(--mac-font-mono)',
  fontSize: '13px',
  lineHeight: 1.6,
  padding: '18px 22px',
  margin: 0,
  color: 'var(--mac-text)',
};

/**
 * PDF : l'iframe intégrée fonctionne sur desktop ET sur iOS/Safari mobile
 * (moteur WebKit). En revanche Chrome/Android (Blink) refuse d'afficher un PDF
 * en iframe (« contenu bloqué ») → on n'y bascule le repli (ouverture /
 * téléchargement natif) que là. Viewer est chargé côté client (ssr:false), donc
 * window est disponible dès l'initialisation du state.
 */
const PdfViewer = ({ file }) => {
  const [inlineBlocked] = useState(
    () =>
      typeof navigator !== 'undefined' &&
      /Android/i.test(navigator.userAgent) &&
      !/Firefox|FxiOS/i.test(navigator.userAgent)
  );

  if (inlineBlocked) {
    return (
      <div className={styles.pdfFallback}>
        <span className={styles.pdfBadge}>PDF</span>
        <p className={styles.pdfName}>{file.name}</p>
        <p className={styles.pdfHint}>
          Ce navigateur n’affiche pas les PDF intégrés. Ouvrez-le dans un onglet ou téléchargez-le.
        </p>
        <div className={styles.pdfActions}>
          <a
            className={styles.pdfPrimary}
            href={file.path}
            target="_blank"
            rel="noreferrer"
          >
            Ouvrir le PDF ↗
          </a>
          <a className={styles.pdfGhost} href={file.path} download>
            Télécharger
          </a>
        </div>
      </div>
    );
  }

  // Ailleurs (iOS Safari, desktop) : aperçu inline. On garde une échappatoire
  // « Ouvrir ↗ » sur tactile au cas où un navigateur rendrait l'iframe vide.
  return (
    <div className={styles.pdfFrameWrap}>
      <iframe className={styles.pdfFrame} src={file.path} title={file.name} />
      <a className={styles.pdfOpenFloat} href={file.path} target="_blank" rel="noreferrer">
        Ouvrir ↗
      </a>
    </div>
  );
};

/**
 * Aperçu : PDF, images, vidéos et texte/markdown.
 */
const FileViewer = ({ file }) => {
  const [loadedDocument, setLoadedDocument] = useState({ path: null, content: '' });
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    if (!file.content && file.path && ['txt', 'md'].includes(file.extension)) {
      let cancelled = false;

      fetch(file.path)
        .then((response) => {
          if (!response.ok) throw new Error(`Impossible de charger ${file.path}`);
          return response.text();
        })
        .then((text) => {
          if (!cancelled) setLoadedDocument({ path: file.path, content: text });
        })
        .catch(() => {
          if (!cancelled) {
            setLoadedDocument({
              path: file.path,
              content: 'Impossible de charger ce document.',
            });
          }
        });

      return () => {
        cancelled = true;
      };
    }
  }, [file]);

  useEffect(() => {
    if (!zoomedImage) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setZoomedImage(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [zoomedImage]);

  const textContent =
    file.content ||
    (loadedDocument.path === file.path ? loadedDocument.content : 'Chargement…');

  if (file.extension === 'pdf') {
    return <PdfViewer file={file} />;
  }

  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(file.extension)) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '16px',
          background:
            'repeating-conic-gradient(var(--mac-hover) 0% 25%, transparent 0% 50%) 50% / 22px 22px',
        }}
      >
        <Image
          src={file.path}
          alt={file.name}
          height={420}
          width={420}
          unoptimized={file.extension === 'svg'}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '6px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          }}
        />
      </div>
    );
  }

  if (file.extension === 'mp4') {
    return (
      <div className={styles.videoViewer}>
        <div className={styles.videoStage}>
          <video
            className={styles.video}
            controls
            playsInline
            preload="metadata"
            aria-label={`Lecteur vidéo — ${file.title || file.name}`}
          >
            <source src={file.path} type="video/mp4" />
            Votre navigateur ne prend pas en charge la lecture de cette vidéo.
          </video>
        </div>
        <div className={styles.videoMeta}>
          <p className={styles.videoTitle}>{file.title || file.name}</p>
          {file.description && <p className={styles.videoDescription}>{file.description}</p>}
        </div>
      </div>
    );
  }

  if (file.extension === 'md') {
    return (
      <div className={styles.markdownShell}>
        <article className={styles.markdownViewer}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => {
                const external = href?.startsWith('http://') || href?.startsWith('https://');

                return (
                  <a
                    {...props}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                  >
                    {children}
                  </a>
                );
              },
              img: ({ alt, src, title }) => (
                <button
                  type="button"
                  className={styles.markdownImageButton}
                  onClick={() => setZoomedImage({ src, alt: alt || '', title })}
                  aria-label={`Agrandir l’illustration : ${alt || 'image'}`}
                >
                  {/* Les dimensions des illustrations Markdown sont définies par leur fichier. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.markdownImage}
                    src={src}
                    alt={alt || ''}
                    title={title}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={styles.zoomHint} aria-hidden="true">
                    Agrandir
                  </span>
                </button>
              ),
            }}
          >
            {textContent}
          </ReactMarkdown>
        </article>

        {zoomedImage && (
          <div
            className={styles.imageLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={zoomedImage.alt || 'Illustration agrandie'}
            onClick={() => setZoomedImage(null)}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setZoomedImage(null)}
              aria-label="Fermer l’illustration"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.lightboxImage}
              src={zoomedImage.src}
              alt={zoomedImage.alt}
              title={zoomedImage.title}
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        )}
      </div>
    );
  }

  if (file.extension === 'txt') {
    return <pre style={textStyle}>{textContent}</pre>;
  }

  return <div style={{ padding: 24 }}>Type de fichier non pris en charge</div>;
};

export default FileViewer;
