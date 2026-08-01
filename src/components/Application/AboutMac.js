'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useSiteData } from '@/data/SiteDataProvider';
import styles from './AboutMac.module.css';

/**
 * « À propos de ce Mac », version CV.
 */
const AboutMac = ({ onOpenCv }) => {
  const t = useTranslations('about');
  const { cv } = useSiteData();
  const { profile } = cv;

  return (
    <div className={styles.about}>
      <Image
        src={profile.photo}
        alt={t('avatarAlt', { name: profile.name })}
        width={88}
        height={88}
        className={styles.avatar}
      />
      <h2 className={styles.title}>Maxence OS</h2>
      <p className={styles.version}>{t('version')}</p>

      <div className={styles.specs}>
        <div className={styles.row}>
          <span className={styles.key}>{t('specChip')}</span>
          <span>{t('specChipValue', { name: profile.name })}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>{t('specCores')}</span>
          <span>{t('specCoresValue')}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>{t('specMemory')}</span>
          <span>C# · Python · JavaScript · SQL</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>{t('specLocation')}</span>
          <span>{profile.location}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>{t('specSerial')}</span>
          <span>TOEIC-850 · CCNAv7</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={onOpenCv}>
          {t('openCv')}
        </button>
        <a href={`mailto:${profile.email}`} className={styles.button}>
          {t('contact')}
        </a>
      </div>
    </div>
  );
};

export default AboutMac;
