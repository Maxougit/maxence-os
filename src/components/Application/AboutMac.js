'use client';
import React from 'react';
import Image from 'next/image';
import { profile } from '@/data/cv';
import styles from './AboutMac.module.css';

/**
 * « À propos de ce Mac », version CV.
 */
const AboutMac = ({ onOpenCv }) => (
  <div className={styles.about}>
    <Image
      src={profile.photo}
      alt={`Photo de ${profile.name}`}
      width={88}
      height={88}
      className={styles.avatar}
    />
    <h2 className={styles.title}>Maxence OS</h2>
    <p className={styles.version}>
      Version 26.0 « Reims » (build CESI-2025)
    </p>

    <div className={styles.specs}>
      <div className={styles.row}>
        <span className={styles.key}>Puce</span>
        <span>{profile.name} — Ingénieur informatique</span>
      </div>
      <div className={styles.row}>
        <span className={styles.key}>Cœurs</span>
        <span>GenAI · Micro-services · DevOps</span>
      </div>
      <div className={styles.row}>
        <span className={styles.key}>Mémoire</span>
        <span>C# · Python · JavaScript · SQL</span>
      </div>
      <div className={styles.row}>
        <span className={styles.key}>Localisation</span>
        <span>{profile.location}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.key}>N° de série</span>
        <span>TOEIC-850 · CCNAv7</span>
      </div>
    </div>

    <div className={styles.actions}>
      <button type="button" className={styles.button} onClick={onOpenCv}>
        CV complet…
      </button>
      <a href={`mailto:${profile.email}`} className={styles.button}>
        Me contacter…
      </a>
    </div>
  </div>
);

export default AboutMac;
