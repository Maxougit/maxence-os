'use client';
import React from 'react';
import styles from './Widgets.module.css';
import useNow from '@/utils/useNow';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const SKILL_STOCKS = [
  { ticker: 'GENAI', label: 'IA générative', delta: '+42,0 %', points: [2, 3, 3, 5, 6, 9, 14] },
  { ticker: 'K8S', label: 'Kubernetes', delta: '+15,2 %', points: [4, 5, 7, 6, 8, 9, 11] },
  { ticker: 'CSHARP', label: 'C# / .NET', delta: '+12,4 %', points: [6, 7, 6, 8, 9, 9, 10] },
  { ticker: 'PY', label: 'Python', delta: '+8,2 %', points: [5, 6, 7, 7, 8, 8, 9] },
];

const Sparkline = ({ points }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 38 + 1;
      const y = 16 - ((p - min) / (max - min || 1)) * 13 + 1;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg className={styles.sparkline} viewBox="0 0 40 18" aria-hidden>
      <polyline points={coords} fill="none" stroke="#30d158" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
};

const WeatherIcon = () => (
  <svg className={styles.weatherIcon} viewBox="0 0 48 48" aria-hidden>
    <circle cx="18" cy="18" r="9" fill="#ffd60a" />
    <path
      d="M14 34a8 8 0 0 1 8-8 9 9 0 0 1 8.4 5.8A6.5 6.5 0 1 1 33 41H15a7 7 0 0 1-1-7z"
      fill="#fff"
      opacity="0.95"
    />
  </svg>
);

const CalendarWidget = ({ now }) => {
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);

  return (
    <div className={styles.widget}>
      <p className={styles.calendarMonth}>
        {now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
      </p>
      <div className={styles.calendarGrid}>
        {WEEKDAYS.map((w, i) => (
          <span key={`w-${i}`} className={styles.calendarWeekday}>
            {w}
          </span>
        ))}
        {cells.map((day, i) => (
          <span
            key={`d-${i}`}
            className={`${styles.calendarDay} ${day === today ? styles.today : ''}`}
          >
            {day || ''}
          </span>
        ))}
      </div>
    </div>
  );
};

const SHORTCUTS = [
  {
    id: 'cv',
    label: 'CV (PDF)',
    background: 'linear-gradient(135deg,#ff6b5e,#d63a30)',
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 2v5h5" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    background: 'linear-gradient(135deg,#1f8ae0,#0a66c2)',
    glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h3v1.7A3.7 3.7 0 0 1 15.3 9C18 9 19 10.8 19 13.6V21h-3v-6.7c0-1.6-.6-2.7-2-2.7-1.5 0-2 1.1-2 2.7V21H9z" />
      </svg>
    ),
  },
  {
    id: 'mail',
    label: 'Me contacter',
    background: 'linear-gradient(135deg,#34c759,#1d9c40)',
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    ),
  },
  {
    id: 'maxadev',
    label: 'maxadev.fr',
    background: 'linear-gradient(135deg,#bf5af2,#8944ab)',
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.3 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.3-3.8-8.5s1.3-6.1 3.8-8.5z" />
      </svg>
    ),
  },
];

/**
 * Widgets de bureau macOS : calendrier, météo, compétences façon Bourse,
 * raccourcis de contact.
 */
const Widgets = ({ onShortcut }) => {
  const now = useNow(60000);

  if (!now) return null;

  return (
    <aside className={styles.widgets} aria-label="Widgets">
      <CalendarWidget now={now} />

      <div className={styles.widget}>
        <div className={styles.weatherTop}>
          <div>
            <p className={styles.weatherCity}>Reims</p>
            <p className={styles.weatherTemp}>21°</p>
          </div>
          <WeatherIcon />
        </div>
        <p className={styles.weatherDesc}>Partiellement nuageux</p>
        <p className={styles.weatherRange}>Max. 26° · Min. 14°</p>
      </div>

      <div className={styles.widget}>
        <p className={styles.widgetTitle}>Compétences</p>
        {SKILL_STOCKS.map((stock) => (
          <div key={stock.ticker} className={styles.stockRow}>
            <div className={styles.stockName}>
              <p className={styles.stockTicker}>{stock.ticker}</p>
              <p className={styles.stockLabel}>{stock.label}</p>
            </div>
            <Sparkline points={stock.points} />
            <span className={styles.stockDelta}>{stock.delta}</span>
          </div>
        ))}
      </div>

      <div className={styles.widget}>
        <p className={styles.widgetTitle}>Liens rapides</p>
        <div className={styles.shortcutsGrid}>
          {SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut.id}
              type="button"
              className={styles.shortcut}
              style={{ background: shortcut.background }}
              onClick={() => onShortcut(shortcut.id)}
            >
              {shortcut.glyph}
              {shortcut.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Widgets;
