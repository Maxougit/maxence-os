'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslations } from 'next-intl';
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
 * PDF : on détecte la CAPACITÉ réelle du moteur à afficher un PDF en iframe via
 * `navigator.pdfViewerEnabled` (fiable même en mode responsive/DevTools, où le
 * moteur reste desktop) plutôt que de deviner via l'UA. iOS/iPadOS (WebKit)
 * rendent les PDF en iframe même si l'API répond non → on force l'inline là.
 * Sinon (typiquement Chrome/Android sans lecteur PDF) → repli ouverture /
 * téléchargement. Viewer est chargé côté client (ssr:false).
 */
const PdfViewer = ({ file }) => {
  const t = useTranslations('viewer');
  const [inlineBlocked] = useState(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const canInline = navigator.pdfViewerEnabled === true || isIOS;
    return !canInline;
  });

  if (inlineBlocked) {
    return (
      <div className={styles.pdfFallback}>
        <span className={styles.pdfBadge}>PDF</span>
        <p className={styles.pdfName}>{file.name}</p>
        <p className={styles.pdfHint}>{t('pdfHint')}</p>
        <div className={styles.pdfActions}>
          <a
            className={styles.pdfPrimary}
            href={file.path}
            target="_blank"
            rel="noreferrer"
          >
            {t('pdfOpen')}
          </a>
          <a className={styles.pdfGhost} href={file.path} download>
            {t('pdfDownload')}
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
        {t('pdfOpenFloat')}
      </a>
    </div>
  );
};

const ZOOM_MIN = 0.2;
const ZOOM_MAX = 8;
const ZOOM_STEP = 1.4;

/**
 * Visionneuse plein écran avec zoom : indispensable pour les grands documents
 * (poster A0, schémas larges) qu'un simple « ajusté à l'écran » rend illisibles.
 * Le facteur de zoom est relatif à la taille ajustée ; on affiche le rapport
 * réel par rapport à la taille native (100 % = 1:1).
 */
const ImageLightbox = ({ image, onClose }) => {
  const t = useTranslations('viewer');
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const [fitWidth, setFitWidth] = useState(0);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Largeur d'affichage quand l'image est ajustée à la zone (sans agrandir).
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img?.naturalWidth) return;
    const available = { w: stage.clientWidth - 32, h: stage.clientHeight - 32 };
    // Zone pas encore dimensionnée (onglet masqué, premier rendu) : on laisse
    // le CSS gérer l'ajustement plutôt que de calculer une taille aberrante.
    if (available.w <= 0 || available.h <= 0) return;
    const scale = Math.min(
      available.w / img.naturalWidth,
      available.h / img.naturalHeight,
      1
    );
    setNaturalWidth(img.naturalWidth);
    setFitWidth(Math.max(1, Math.round(img.naturalWidth * scale)));
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [measure]);

  // Une image déjà en cache est `complete` dès le montage : `onLoad` ne se
  // déclenchera pas, il faut donc mesurer nous-mêmes (sinon zoom inopérant).
  useEffect(() => {
    if (imgRef.current?.complete) measure();
  }, [measure, image.src]);

  const zoomBy = useCallback((factor) => {
    setZoom((current) =>
      Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number((current * factor).toFixed(3))))
    );
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === '+' || event.key === '=') zoomBy(ZOOM_STEP);
      else if (event.key === '-' || event.key === '_') zoomBy(1 / ZOOM_STEP);
      else if (event.key === '0') setZoom(1);
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, zoomBy]);

  // Molette : défilement normal pour se déplacer, ⌘/Ctrl + molette pour zoomer.
  const onWheel = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP);
  };

  const displayedWidth = fitWidth ? Math.round(fitWidth * zoom) : null;
  const percent = naturalWidth && displayedWidth
    ? Math.round((displayedWidth / naturalWidth) * 100)
    : 100;

  return (
    <div
      className={styles.imageLightbox}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || t('lightboxAria')}
      onClick={onClose}
    >
      <div className={styles.lightboxBar} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={styles.lightboxTool}
          onClick={() => zoomBy(1 / ZOOM_STEP)}
          disabled={zoom <= ZOOM_MIN}
          aria-label={t('lightboxZoomOut')}
        >
          −
        </button>
        <span className={styles.lightboxZoomValue}>{t('lightboxZoomValue', { percent })}</span>
        <button
          type="button"
          className={styles.lightboxTool}
          onClick={() => zoomBy(ZOOM_STEP)}
          disabled={zoom >= ZOOM_MAX}
          aria-label={t('lightboxZoomIn')}
        >
          +
        </button>
        <button type="button" className={styles.lightboxTool} onClick={() => setZoom(1)}>
          {t('lightboxFit')}
        </button>
        <button
          type="button"
          className={styles.lightboxTool}
          onClick={() => fitWidth && setZoom(naturalWidth / fitWidth)}
        >
          {t('lightboxActualSize')}
        </button>
        <button
          type="button"
          className={`${styles.lightboxTool} ${styles.lightboxCloseTool}`}
          onClick={onClose}
          aria-label={t('lightboxClose')}
        >
          ×
        </button>
      </div>

      <div className={styles.lightboxStage} ref={stageRef} onWheel={onWheel}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          className={`${styles.lightboxImage} ${
            displayedWidth ? styles.lightboxImageSized : ''
          }`}
          style={displayedWidth ? { width: displayedWidth } : undefined}
          src={image.src}
          alt={image.alt}
          title={image.title}
          onLoad={measure}
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
        />
      </div>
    </div>
  );
};

/**
 * Aperçu : PDF, images, vidéos et texte/markdown.
 */
const FileViewer = ({ file }) => {
  const t = useTranslations('viewer');
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
          // Le message d'erreur est traduit au rendu : l'effet ne dépend donc
          // pas du catalogue i18n et ne relance pas la requête.
          if (!cancelled) setLoadedDocument({ path: file.path, content: '', failed: true });
        });

      return () => {
        cancelled = true;
      };
    }
  }, [file]);

  const loadedText = loadedDocument.failed ? t('errorLoadDocument') : loadedDocument.content;
  const textContent =
    file.content || (loadedDocument.path === file.path ? loadedText : t('loading'));

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
            aria-label={t('videoAria', { title: file.title || file.name })}
          >
            <source src={file.path} type="video/mp4" />
            {t('videoUnsupported')}
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
                  aria-label={t('imageZoomAria', { alt: alt || t('imageAltFallback') })}
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
                    {t('imageZoomHint')}
                  </span>
                </button>
              ),
            }}
          >
            {textContent}
          </ReactMarkdown>
        </article>

        {zoomedImage && (
          <ImageLightbox image={zoomedImage} onClose={() => setZoomedImage(null)} />
        )}
      </div>
    );
  }

  if (file.extension === 'txt') {
    return <pre style={textStyle}>{textContent}</pre>;
  }

  return <div style={{ padding: 24 }}>{t('unsupportedType')}</div>;
};

export default FileViewer;
