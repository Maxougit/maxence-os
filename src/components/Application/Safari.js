'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Safari.module.css';
import { useSiteData } from '@/data/SiteDataProvider';

/* eslint-disable @next/next/no-img-element */

const MAXADEV_URL = 'https://www.maxadev.fr';
// Origines depuis lesquelles on accepte le beacon « prêt » de maxadev
// (prod + www + dev local sur 3001).
const MAXADEV_ORIGINS = [
  'https://www.maxadev.fr',
  'https://maxadev.fr',
  'http://localhost:3001',
];
const REIMS_MAP =
  'https://www.openstreetmap.org/export/embed.html?bbox=3.98%2C49.22%2C4.09%2C49.28&layer=mapnik&marker=49.2583%2C4.0317';
// Domaines connus pour autoriser l'affichage en iframe : pas de bandeau d'avertissement.
const EMBEDDABLE = ['openstreetmap.org'];

// --- petites icônes ---------------------------------------------------------
const Back = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 5.5L8 12l6.5 6.5" />
  </svg>
);
const Forward = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 5.5L16 12l-6.5 6.5" />
  </svg>
);
const Home = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.5 10.5 12 3l8.5 7.5" />
    <path d="M5.5 9v11h13V9M9.5 20v-6h5v6" />
  </svg>
);
const Reload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 11a8 8 0 1 0-.6 4" />
    <path d="M20 5v6h-6" strokeLinejoin="round" />
  </svg>
);
const OpenExt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </svg>
);
const Lock = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 10V8a6 6 0 0 1 12 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h8V8a4 4 0 0 0-8 0z" />
  </svg>
);

// --- favoris de la page de démarrage ----------------------------------------
// Apparence figée (indépendante de la langue) ; libellés et URL sont assemblés
// au rendu depuis le catalogue i18n et les données du CV.
const FAVORITE_VISUALS = [
  {
    id: 'maxadev',
    bg: 'linear-gradient(135deg,#bf5af2,#7b3fe4)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.5 12h17M12 3.5c2.4 2.4 3.7 5.3 3.7 8.5s-1.3 6.1-3.7 8.5c-2.4-2.4-3.7-5.3-3.7-8.5s1.3-6.1 3.7-8.5z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    bg: 'linear-gradient(135deg,#0a78d0,#0a66c2)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h3v1.7A3.7 3.7 0 0 1 15.3 9C18 9 19 10.8 19 13.6V21h-3v-6.7c0-1.6-.6-2.7-2-2.7-1.5 0-2 1.1-2 2.7V21H9z" />
      </svg>
    ),
  },
  {
    id: 'reims',
    bg: 'linear-gradient(135deg,#34c759,#0f9d58)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'cv',
    bg: 'linear-gradient(135deg,#ff6b5e,#d63a30)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 2v5h5" />
      </svg>
    ),
  },
];

// `home` et `cvPdf` dépendent de la langue : ils sont passés par l'appelant
// plutôt que lus depuis une constante de module.
const kindOf = (url, home) => {
  if (!url || url === home) return 'home';
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('maxadev')) return 'maxadev';
  return 'iframe';
};

const prettyUrl = (url, home, cvPdfPath, cvPdfLabel) => {
  if (!url || url === home) return '';
  if (url === cvPdfPath) return cvPdfLabel;
  if (url.includes('openstreetmap')) return 'openstreetmap.org › Reims';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/**
 * Safari : chrome de navigateur (adresse, historique, reload), page de
 * démarrage avec favoris, embed réel des sites (Maxadev, OpenStreetMap, PDF)
 * et carte LinkedIn intégrée (LinkedIn interdit le framing).
 */
const Safari = ({ initialUrl, navRef, openExternal }) => {
  const t = useTranslations('safari');
  const { fs } = useSiteData();
  // URL interne de la page de démarrage : traduite (« about:accueil » /
  // « about:start ») pour rester saisissable dans la barre d'adresse. Toutes
  // les comparaisons passent par cette même valeur.
  const HOME = t('homeUrl');
  const CV_PDF = fs.FILES.cvPdf.path;

  const [history, setHistory] = useState([initialUrl || HOME]);
  const [pointer, setPointer] = useState(0);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const current = history[pointer];

  const go = useCallback(
    (url) => {
      setHistory((prev) => [...prev.slice(0, pointer + 1), url]);
      setPointer((p) => p + 1);
      setEditing(false);
    },
    [pointer]
  );

  // Navigation impérative depuis le Dock / Spotlight quand Safari est déjà ouvert.
  useEffect(() => {
    if (!navRef) return undefined;
    navRef.current = (url) => go(url || HOME);
    return () => {
      if (navRef.current) navRef.current = null;
    };
  }, [navRef, go, HOME]);

  const back = () => pointer > 0 && setPointer((p) => p - 1);
  const forward = () => pointer < history.length - 1 && setPointer((p) => p + 1);
  const reload = () => setReloadKey((k) => k + 1);

  const submitAddress = (e) => {
    e.preventDefault();
    let value = draft.trim();
    if (!value) return;
    if (!/^https?:\/\//i.test(value) && !value.startsWith('about:')) {
      value = `https://${value}`;
    }
    go(value);
  };

  const kind = kindOf(current, HOME);
  const address = prettyUrl(current, HOME, CV_PDF, t('urlCvPdf'));

  return (
    <div className={styles.safari}>
      <div className={styles.toolbar}>
        <div className={styles.navGroup}>
          <button className={styles.iconBtn} onClick={back} disabled={pointer === 0} aria-label={t('ariaBack')}>
            <Back />
          </button>
          <button
            className={styles.iconBtn}
            onClick={forward}
            disabled={pointer >= history.length - 1}
            aria-label={t('ariaForward')}
          >
            <Forward />
          </button>
        </div>

        <button
          className={`${styles.iconBtn} ${styles.homeBtn}`}
          onClick={() => go(HOME)}
          disabled={kind === 'home'}
          aria-label={t('ariaHome')}
          title={t('ariaHome')}
        >
          <Home />
          <span>Home</span>
        </button>

        <form className={styles.addressBar} onSubmit={submitAddress}>
          {kind !== 'home' && (
            <span className={styles.lock}>
              <Lock />
            </span>
          )}
          <input
            className={styles.addressInput}
            value={editing ? draft : address}
            placeholder={t('addressPlaceholder')}
            onFocus={() => {}}
            onFocusCapture={() => {
              setEditing(true);
              setDraft(current === HOME ? '' : current);
            }}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => setEditing(false)}
            spellCheck={false}
          />
        </form>

        <button className={styles.iconBtn} onClick={reload} aria-label={t('ariaReload')}>
          <Reload />
        </button>
        {kind !== 'home' && (
          <button
            className={styles.iconBtn}
            onClick={() => openExternal?.(current === CV_PDF ? CV_PDF : current)}
            aria-label={t('ariaOpenInTab')}
          >
            <OpenExt />
          </button>
        )}
      </div>

      <div className={styles.viewport}>
        {kind === 'home' && <StartPage onOpen={go} />}

        {kind === 'linkedin' && <LinkedInView openExternal={openExternal} />}

        {kind === 'maxadev' && (
          <MaxadevFrame key={reloadKey} url={current} openExternal={openExternal} />
        )}

        {kind === 'iframe' && (
          <>
            <iframe
              key={reloadKey}
              className={styles.frame}
              src={current}
              title={address}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
            />
            {!current.startsWith('/') &&
              !EMBEDDABLE.some((domain) => current.includes(domain)) && (
                <div className={styles.blockedHint}>
                  <span>{t('blockedHint')}</span>
                  <button onClick={() => openExternal?.(current)}>{t('blockedOpen')}</button>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

const StartPage = ({ onOpen }) => {
  const t = useTranslations('safari');
  const { cv, fs } = useSiteData();

  // Libellés/URL par identifiant de favori, fusionnés avec l'apparence figée.
  const content = {
    maxadev: { label: 'Maxadev', url: MAXADEV_URL },
    linkedin: { label: 'LinkedIn', url: cv.profile.linkedin },
    reims: { label: t('favReims'), url: REIMS_MAP },
    cv: { label: t('favCv'), url: fs.FILES.cvPdf.path },
  };

  return (
    <div className={styles.startPage}>
      <p className={styles.startTitle}>{t('startFavorites')}</p>
      <div className={styles.favorites}>
        {FAVORITE_VISUALS.map((fav) => (
          <button
            key={fav.id}
            type="button"
            className={styles.favorite}
            onClick={() => onOpen(content[fav.id].url)}
          >
            <span className={styles.favIcon} style={{ background: fav.bg }}>
              {fav.icon}
            </span>
            <span className={styles.favLabel}>{content[fav.id].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const LinkedInView = ({ openExternal }) => {
  const t = useTranslations('safari');
  const { cv } = useSiteData();
  const { profile, skillsData } = cv;
  const experiences = skillsData.Experiences.slice(0, 3);
  const skills = [
    ...skillsData.Technologies.slice(0, 5).map((s) => s.Name),
    ...skillsData.Programation.slice(0, 3).map((s) => s.Name),
  ];
  return (
    <div className={styles.linkedin}>
      <div className={styles.liBanner} />
      <div className={styles.liCard}>
        <div className={styles.liAvatarWrap}>
          <img className={styles.liAvatar} src={profile.photo} alt={profile.name} />
        </div>
        <h2 className={styles.liName}>{profile.name}</h2>
        <p className={styles.liHeadline}>{profile.jobTitle}</p>
        <p className={styles.liMeta}>
          {profile.location} · ArcelorMittal Distribution Solutions · CESI
        </p>
        <div className={styles.liActions}>
          <button className={styles.liPrimary} onClick={() => openExternal?.(profile.linkedin)}>
            {t('liViewProfile')}
          </button>
          <button className={styles.liSecondary} onClick={() => openExternal?.(`mailto:${profile.email}`)}>
            {t('liMessage')}
          </button>
        </div>

        <div className={styles.liSection}>
          <h3 className={styles.liSectionTitle}>{t('liExperience')}</h3>
          {experiences.map((exp) => (
            <div key={exp.Name} className={styles.liExp}>
              <span className={styles.liExpLogo}>{exp.Name.charAt(0)}</span>
              <div>
                <p className={styles.liExpName}>{exp.Name}</p>
                <p className={styles.liExpDetail}>{exp.Details[0]}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.liSection}>
          <h3 className={styles.liSectionTitle}>{t('liSkills')}</h3>
          <div className={styles.liChips}>
            {skills.map((skill) => (
              <span key={skill} className={styles.liChip}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Aperçu de maxadev.fr. Comme une iframe cross-origin bloquée déclenche quand
 * même `load` (impossible de détecter l'échec par les moyens classiques), on
 * s'appuie sur un « beacon » : la page maxadev poste un message quand elle
 * s'affiche vraiment. Sans message dans le délai → le framing a échoué → repli.
 */
const MaxadevFrame = ({ url, openExternal }) => {
  const t = useTranslations('safari');
  const [status, setStatus] = useState('loading'); // loading | ready | failed
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const onMessage = (event) => {
      if (MAXADEV_ORIGINS.includes(event.origin) && event.data?.type === 'maxadev:ready') {
        setStatus('ready');
      }
    };
    window.addEventListener('message', onMessage);
    const timer = setTimeout(() => {
      setStatus((current) => (current === 'ready' ? current : 'failed'));
    }, 4500);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(timer);
    };
  }, [retry]);

  return (
    <>
      <iframe
        key={retry}
        className={styles.frame}
        src={url}
        title="Maxadev"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />

      {status === 'loading' && (
        <div className={styles.frameOverlay}>
          <span className={styles.spinner} />
          <p>{t('frameLoading')}</p>
        </div>
      )}

      {status === 'failed' && (
        <div className={styles.frameFallback}>
          <span className={styles.siteMonogram}>M</span>
          <p className={styles.fallbackTitle}>{t('frameFailedTitle')}</p>
          <p className={styles.fallbackText}>{t('frameFailedText')}</p>
          <div className={styles.fallbackActions}>
            <button className={styles.fallbackPrimary} onClick={() => openExternal?.(MAXADEV_URL)}>
              {t('frameOpenExternal')}
            </button>
            <button
              className={styles.fallbackGhost}
              onClick={() => {
                setStatus('loading');
                setRetry((n) => n + 1);
              }}
            >
              {t('frameRetry')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Safari;
