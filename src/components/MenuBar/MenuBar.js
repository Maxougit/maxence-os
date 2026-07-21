'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './MenuBar.module.css';
import useNow from '@/utils/useNow';

const AppleLogo = () => (
  <svg className={styles.appleLogo} viewBox="0 0 814 1000" fill="currentColor" aria-hidden>
    <path d="M788 341c-6 4-105 61-105 184 0 143 125 194 129 195-1 3-20 69-66 137-41 60-84 119-149 119s-82-38-157-38c-73 0-99 39-159 39s-102-55-149-123C77 775 34 662 34 555c0-172 112-263 222-263 59 0 108 39 145 39 35 0 90-41 156-41 25 0 115 2 174 88zM559 187c30-35 51-84 51-133 0-7-1-14-2-19-49 2-107 32-142 73-27 31-53 80-53 129 0 8 1 15 2 18 3 1 8 1 13 1 44 0 99-29 131-69z" />
  </svg>
);

const WifiGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M2.5 9.5a14.5 14.5 0 0 1 19 0" />
    <path d="M5.7 13a10 10 0 0 1 12.6 0" />
    <path d="M9 16.4a5.4 5.4 0 0 1 6 0" />
    <circle cx="12" cy="19.5" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

const SearchGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" aria-hidden>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" />
  </svg>
);

const ControlCenterGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="2.5" y="4.5" width="19" height="6" rx="3" />
    <circle cx="8" cy="7.5" r="2.1" fill="currentColor" stroke="none" />
    <rect x="2.5" y="13.5" width="19" height="6" rx="3" />
    <circle cx="16" cy="16.5" r="2.1" fill="currentColor" stroke="none" />
  </svg>
);

const BatteryGlyph = ({ level = 0.87 }) => (
  <svg viewBox="0 0 30 14" width="26" height="13" aria-hidden>
    <rect x="0.7" y="0.7" width="24.6" height="12.6" rx="3.6" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.55" />
    <rect x="2.4" y="2.4" width={21.2 * level} height="9.2" rx="2.2" fill="currentColor" />
    <path d="M27.2 4.6v4.8c1.5-.35 2.3-1.2 2.3-2.4s-.8-2.05-2.3-2.4z" fill="currentColor" opacity="0.55" />
  </svg>
);

const formatClock = (date) => {
  const day = date
    .toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
    .replace('.', '');
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${day}  ${time.replace(':', ':')}`;
};

/**
 * Barre de menus macOS : menu Apple + menus de l'app active (data-driven),
 * zone de statut (Wi-Fi, batterie, Spotlight, Control Center, horloge).
 */
const MenuBar = ({ menus, onOpenSpotlight, onToggleControlCenter, controlCenterOpen }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const now = useNow(10000);
  const barRef = useRef(null);

  const closeMenus = useCallback(() => setOpenMenu(null), []);

  useEffect(() => {
    if (openMenu === null) return;
    const handleClick = (e) => {
      if (!barRef.current?.contains(e.target)) closeMenus();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') closeMenus();
    };
    window.addEventListener('pointerdown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('pointerdown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [openMenu, closeMenus]);

  const handleSelect = (item) => {
    closeMenus();
    item.onSelect?.();
  };

  const renderDropdown = (menu) => (
    <div className={styles.dropdown} role="menu">
      {menu.items.map((item, i) =>
        item.divider ? (
          <div key={`div-${i}`} className={styles.divider} role="separator" />
        ) : (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className={styles.menuItem}
            disabled={item.disabled}
            onClick={() => handleSelect(item)}
          >
            <span className={styles.itemLabel}>
              {menu.showChecks && (
                <span className={styles.check}>{item.checked ? '✓' : ''}</span>
              )}
              {item.label}
            </span>
            {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
          </button>
        )
      )}
    </div>
  );

  return (
    <nav className={styles.menuBar} ref={barRef} aria-label="Barre de menus">
      <div className={styles.left}>
        {menus.map((menu, index) => {
          const isApple = menu.id === 'apple';
          const isAppName = menu.id === 'app';
          const hidden = !isApple && !isAppName ? styles.desktopOnly : '';
          return (
            <div key={menu.id} style={{ position: 'relative' }} className={hidden}>
              <button
                type="button"
                className={`${styles.menuTitle} ${isAppName ? styles.appName : ''} ${
                  openMenu === index ? styles.open : ''
                }`}
                aria-haspopup="menu"
                aria-expanded={openMenu === index}
                onClick={() => setOpenMenu(openMenu === index ? null : index)}
                onMouseEnter={() => {
                  if (openMenu !== null && openMenu !== index) setOpenMenu(index);
                }}
              >
                {isApple ? <AppleLogo /> : menu.label}
              </button>
              {openMenu === index && renderDropdown(menu)}
            </div>
          );
        })}
      </div>

      <div className={styles.right}>
        <div className={`${styles.statusButton} ${styles.hideOnMobile}`} title="Wi-Fi : Maxadev_5G">
          <WifiGlyph />
        </div>
        <div className={`${styles.battery} ${styles.statusButton} ${styles.hideOnMobile}`} title="Batterie : 87 %">
          <span>87 %</span>
          <BatteryGlyph level={0.87} />
        </div>
        <button
          type="button"
          className={styles.statusButton}
          aria-label="Spotlight (⌘K)"
          title="Spotlight (⌘K)"
          onClick={() => {
            closeMenus();
            onOpenSpotlight();
          }}
        >
          <SearchGlyph />
        </button>
        <button
          type="button"
          className={`${styles.statusButton} ${controlCenterOpen ? styles.open : ''}`}
          aria-label="Centre de contrôle"
          title="Centre de contrôle"
          onClick={() => {
            closeMenus();
            onToggleControlCenter();
          }}
        >
          <ControlCenterGlyph />
        </button>
        <span className={styles.clock} suppressHydrationWarning>
          {now ? formatClock(now) : ''}
        </span>
      </div>
    </nav>
  );
};

export default MenuBar;
