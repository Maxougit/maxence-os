'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './Widgets.module.css';
import { useSiteData } from '@/data/SiteDataProvider';
import { localeTag } from '@/i18n/config';
import useNow from '@/utils/useNow';

// Les libellés/variations traduisibles sont résolus au rendu (cf. stockLabels).
const SKILL_STOCKS = [
  { ticker: 'GENAI', points: [2, 3, 3, 5, 6, 9, 14] },
  { ticker: 'K8S', points: [4, 5, 7, 6, 8, 9, 11] },
  { ticker: 'CSHARP', points: [6, 7, 6, 8, 9, 9, 10] },
  { ticker: 'PY', points: [5, 6, 7, 7, 8, 8, 9] },
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
  const t = useTranslations('widgets');
  const { locale } = useSiteData();
  const weekdays = t('weekdays').split(',');
  // Premier jour de la semaine selon la langue (1 = lundi en FR, 0 = dimanche en EN).
  const weekStartsOn = Number(t('weekStartsOn'));
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);

  return (
    <div className={styles.widget}>
      <p className={styles.calendarMonth}>
        {now.toLocaleDateString(localeTag(locale), { month: 'long', year: 'numeric' })}
      </p>
      <div className={styles.calendarGrid}>
        {weekdays.map((w, i) => (
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
    background: 'linear-gradient(135deg,#ff6b5e,#d63a30)',
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 2v5h5" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    background: 'linear-gradient(135deg,#1f8ae0,#0a66c2)',
    glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h3v1.7A3.7 3.7 0 0 1 15.3 9C18 9 19 10.8 19 13.6V21h-3v-6.7c0-1.6-.6-2.7-2-2.7-1.5 0-2 1.1-2 2.7V21H9z" />
      </svg>
    ),
  },
  {
    id: 'mail',
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
  const t = useTranslations('widgets');
  const tCommon = useTranslations('common');
  const now = useNow(60000);

  // Seuls les libellés « parlants » sont traduits ; tickers et noms propres non.
  const stockLabels = {
    GENAI: t('stockGenai'),
    K8S: 'Kubernetes',
    CSHARP: 'C# / .NET',
    PY: 'Python',
  };
  const stockDeltas = {
    GENAI: t('stockGenaiDelta'),
    K8S: t('stockK8sDelta'),
    CSHARP: t('stockCsharpDelta'),
    PY: t('stockPyDelta'),
  };
  const shortcutLabels = {
    cv: t('shortcutCv'),
    linkedin: 'LinkedIn',
    mail: tCommon('contactMe'),
    maxadev: 'maxadev.fr',
  };

  if (!now) return null;

  return (
    <aside className={styles.widgets} aria-label={t('aria')}>
      <CalendarWidget now={now} />

      <div className={styles.widget}>
        <div className={styles.weatherTop}>
          <div>
            <p className={styles.weatherCity}>Reims</p>
            <p className={styles.weatherTemp}>21°</p>
          </div>
          <WeatherIcon />
        </div>
        <p className={styles.weatherDesc}>{t('weatherCondition')}</p>
        <p className={styles.weatherRange}>{t('weatherRange')}</p>
      </div>

      <div className={styles.widget}>
        <p className={styles.widgetTitle}>{t('skillsTitle')}</p>
        {SKILL_STOCKS.map((stock) => (
          <div key={stock.ticker} className={styles.stockRow}>
            <div className={styles.stockName}>
              <p className={styles.stockTicker}>{stock.ticker}</p>
              <p className={styles.stockLabel}>{stockLabels[stock.ticker]}</p>
            </div>
            <Sparkline points={stock.points} />
            <span className={styles.stockDelta}>{stockDeltas[stock.ticker]}</span>
          </div>
        ))}
      </div>

      <div className={styles.widget}>
        <p className={styles.widgetTitle}>{t('shortcutsTitle')}</p>
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
              {shortcutLabels[shortcut.id]}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Widgets;
