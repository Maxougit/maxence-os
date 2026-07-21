'use client';
import React, { useState } from 'react';
import styles from './ControlCenter.module.css';

const WifiSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M3 9.5a13.5 13.5 0 0 1 18 0M6 13a9 9 0 0 1 12 0M9 16.4a4.6 4.6 0 0 1 6 0" />
    <circle cx="12" cy="19.4" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const BluetoothSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7l10 10-5 5V2l5 5L7 17" />
  </svg>
);

const AirdropSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    <path d="M12 2a10 10 0 0 1 10 10M12 6a6 6 0 0 1 6 6M2 12A10 10 0 0 1 12 2M6 12a6 6 0 0 1 6-6" />
  </svg>
);

const MoonSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
  </svg>
);

const SunSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
    <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
  </svg>
);

/**
 * Centre de contrôle macOS. Le mode sombre/clair et la luminosité
 * sont réellement fonctionnels ; le reste est décoratif mais interactif.
 */
const ControlCenter = ({ theme, onThemeChange, brightness, onBrightnessChange }) => {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airdrop, setAirdrop] = useState(false);
  const [focus, setFocus] = useState(false);
  const [volume, setVolume] = useState(65);

  const toggles = [
    {
      id: 'wifi',
      name: 'Wi-Fi',
      state: wifi ? 'Maxadev_5G' : 'Désactivé',
      active: wifi,
      icon: <WifiSvg />,
      toggle: () => setWifi(!wifi),
    },
    {
      id: 'bluetooth',
      name: 'Bluetooth',
      state: bluetooth ? 'Activé' : 'Désactivé',
      active: bluetooth,
      icon: <BluetoothSvg />,
      toggle: () => setBluetooth(!bluetooth),
    },
    {
      id: 'airdrop',
      name: 'AirDrop',
      state: airdrop ? 'Contacts uniquement' : 'Réception désactivée',
      active: airdrop,
      icon: <AirdropSvg />,
      toggle: () => setAirdrop(!airdrop),
    },
    {
      id: 'focus',
      name: 'Concentration',
      state: focus ? 'Ne pas déranger' : 'Désactivé',
      active: focus,
      icon: <MoonSvg />,
      toggle: () => setFocus(!focus),
    },
  ];

  return (
    <div className={styles.panel} role="dialog" aria-label="Centre de contrôle">
      <div className={styles.card}>
        <div className={styles.togglesGrid}>
          {toggles.map((item) => (
            <button key={item.id} type="button" className={styles.toggleRow} onClick={item.toggle}>
              <span className={`${styles.toggleIcon} ${item.active ? styles.active : ''}`}>
                {item.icon}
              </span>
              <span>
                <span className={styles.toggleName}>{item.name}</span>
                <br />
                <span className={styles.toggleState}>{item.state}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Apparence</p>
        <div className={styles.appearanceRow}>
          <button
            type="button"
            className={`${styles.appearanceButton} ${theme === 'light' ? styles.selected : ''}`}
            onClick={() => onThemeChange('light')}
          >
            <SunSvg />
            Clair
          </button>
          <button
            type="button"
            className={`${styles.appearanceButton} ${theme === 'dark' ? styles.selected : ''}`}
            onClick={() => onThemeChange('dark')}
          >
            <MoonSvg />
            Sombre
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Luminosité</p>
        <div className={styles.sliderRow}>
          <input
            type="range"
            className={styles.slider}
            min="30"
            max="100"
            value={brightness}
            onChange={(e) => onBrightnessChange(Number(e.target.value))}
            aria-label="Luminosité"
          />
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Son</p>
        <div className={styles.sliderRow}>
          <input
            type="range"
            className={styles.slider}
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>
      </div>

      <div className={`${styles.card} ${styles.batteryRow}`}>
        <span>
          Batterie <span className={styles.batteryDetail}>87 %</span>
        </span>
        <span className={styles.batteryDetail}>Alimenté par le café ☕</span>
      </div>
    </div>
  );
};

export default ControlCenter;
