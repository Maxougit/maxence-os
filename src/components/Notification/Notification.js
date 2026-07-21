'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './Notification.module.css';

/**
 * Notification macOS (coin supérieur droit) avec fermeture auto,
 * bouton de fermeture au survol et action au clic.
 */
const Notification = ({ appName, title, body, icon, duration = 8000, onAction, onDismiss }) => {
  const [leaving, setLeaving] = useState(false);
  const dismissTimer = useRef(null);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onDismiss, 350);
  };

  useEffect(() => {
    dismissTimer.current = setTimeout(dismiss, duration);
    return () => clearTimeout(dismissTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${styles.notification} ${leaving ? styles.leaving : ''}`}
      role="status"
      onClick={() => {
        onAction?.();
        dismiss();
      }}
    >
      <button
        type="button"
        className={styles.close}
        aria-label="Fermer la notification"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
      >
        ✕
      </button>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.texts}>
        <p className={styles.appName}>{appName}</p>
        <p className={styles.title}>{title}</p>
        <p className={styles.body}>{body}</p>
      </div>
    </div>
  );
};

export default Notification;
