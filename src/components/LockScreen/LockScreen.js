'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import styles from './LockScreen.module.css';
import { profile } from '@/data/cv';
import useNow from '@/utils/useNow';

/**
 * Écran de verrouillage macOS : fond flouté, horloge géante,
 * avatar + « Cliquez pour ouvrir une session ».
 */
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
      onClick={onUnlock}
      role="button"
      tabIndex={0}
      aria-label="Déverrouiller Maxence OS"
    >
      <div className={styles.background} style={wallpaperStyle} />
      <div className={styles.scrim} />

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

      <div className={styles.userBlock}>
        <Image
          src={profile.photo}
          alt={`Photo de ${profile.name}`}
          width={92}
          height={92}
          className={styles.avatar}
          priority
        />
        <p className={styles.name}>{profile.name}</p>
        <p className={styles.hint}>Cliquez pour ouvrir une session</p>
      </div>
    </div>
  );
};

export default LockScreen;
