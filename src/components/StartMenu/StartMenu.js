import React from 'react';
import styles from './StartMenu.module.css';

const StartMenu = () => {
  return (
    <div className={styles.startMenu}>
      <div className={styles.userSection}>
        <h2 className="text-1xl font-bold text-center">Maxence Leroux</h2>
      </div>
      <div className={styles.appSection}>
        <div className={styles.app}>App 1</div>
        <div className={styles.app}>App 2</div>
      </div>
    </div>
  );
};

export default StartMenu;
