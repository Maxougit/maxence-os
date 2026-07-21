'use client';
import React from 'react';
import Image from 'next/image';
import { profile } from '@/data/cv';

const rowStyle = {
  display: 'flex',
  gap: '14px',
  fontSize: '13px',
  lineHeight: 1.8,
};

const keyStyle = {
  width: '110px',
  textAlign: 'right',
  color: 'var(--mac-text-secondary)',
  flexShrink: 0,
};

const buttonStyle = {
  padding: '5px 14px',
  borderRadius: '7px',
  border: '1px solid var(--mac-border-strong)',
  background: 'var(--mac-hover)',
  color: 'var(--mac-text)',
  fontSize: '13px',
  fontFamily: 'inherit',
  cursor: 'default',
};

/**
 * « À propos de ce Mac », version CV.
 */
const AboutMac = ({ onOpenCv }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '28px 24px',
      textAlign: 'center',
      userSelect: 'none',
    }}
  >
    <Image
      src={profile.photo}
      alt={`Photo de ${profile.name}`}
      width={88}
      height={88}
      style={{
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
      }}
    />
    <h2 style={{ fontSize: '26px', fontWeight: 700, marginTop: '14px' }}>Maxence OS</h2>
    <p style={{ fontSize: '13px', color: 'var(--mac-text-secondary)', marginBottom: '18px' }}>
      Version 26.0 « Reims » (build CESI-2025)
    </p>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={rowStyle}>
        <span style={keyStyle}>Puce</span>
        <span>{profile.name} — Ingénieur informatique</span>
      </div>
      <div style={rowStyle}>
        <span style={keyStyle}>Cœurs</span>
        <span>GenAI · Micro-services · DevOps</span>
      </div>
      <div style={rowStyle}>
        <span style={keyStyle}>Mémoire</span>
        <span>C# · Python · JavaScript · SQL</span>
      </div>
      <div style={rowStyle}>
        <span style={keyStyle}>Localisation</span>
        <span>{profile.location}</span>
      </div>
      <div style={rowStyle}>
        <span style={keyStyle}>N° de série</span>
        <span>TOEIC-850 · CCNAv7</span>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
      <button type="button" style={buttonStyle} onClick={onOpenCv}>
        CV complet…
      </button>
      <a href={`mailto:${profile.email}`} style={{ ...buttonStyle, textDecoration: 'none' }}>
        Me contacter…
      </a>
    </div>
  </div>
);

export default AboutMac;
