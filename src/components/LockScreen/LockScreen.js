'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import styles from './LockScreen.module.css';
import { profile } from '@/data/cv';
import useNow from '@/utils/useNow';

const WifiGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M3 9.5a13.5 13.5 0 0 1 18 0M6.5 13a8.5 8.5 0 0 1 11 0M10 16.5a3.2 3.2 0 0 1 4 0" />
    <circle cx="12" cy="19.2" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const BatteryGlyph = () => (
  <svg viewBox="0 0 30 14" fill="none" aria-hidden>
    <rect x="1" y="1" width="24" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
    <rect x="3" y="3" width="18" height="8" rx="2" fill="currentColor" />
    <path d="M27 4.5v5c1.3-.3 2-1.2 2-2.5s-.7-2.2-2-2.5Z" fill="currentColor" opacity="0.75" />
  </svg>
);

const ArrowGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h13M13 7l5 5-5 5" />
  </svg>
);

/** Écran de connexion reprenant la composition sobre de macOS. */
const LockScreen = ({ wallpaperStyle, unlocking, onUnlock }) => {
  const now = useNow(1000);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') onUnlock();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onUnlock]);

  return (
    <div
      className={`${styles.lockScreen} ${unlocking ? styles.unlocking : ''}`}
    >
      <div className={styles.background} style={wallpaperStyle} />
      <div className={styles.scrim} />

      <header className={styles.systemBar} aria-label="État du système">
        <span className={styles.systemStatus}>
          <span>FR</span>
          <WifiGlyph />
          <BatteryGlyph />
        </span>
      </header>

      <div className={styles.clockBlock}>
        <p className={styles.date} suppressHydrationWarning>
          {now
            ? now.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })
            : ' '}
        </p>
        <p className={styles.time} suppressHydrationWarning>
          {now
            ? now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            : ' '}
        </p>
      </div>

      <section className={styles.userPanel} aria-labelledby="lock-user-name">
        <div className={styles.avatarFrame}>
          <Image
            src={profile.photo}
            alt={`Photo de ${profile.name}`}
            width={104}
            height={104}
            className={styles.avatar}
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <h1 id="lock-user-name" className={styles.name}>{profile.name}</h1>

        <button
          type="button"
          className={styles.unlockButton}
          onClick={onUnlock}
          aria-label="Déverrouiller Maxence OS"
        >
          <span>Ouvrir la session</span>
          <span className={styles.arrow}>
            <ArrowGlyph />
          </span>
        </button>

        <p className={styles.keyboardHint}>
          Appuyez sur Entrée pour ouvrir la session
        </p>
      </section>
    </div>
  );
};

export default LockScreen;
