"use client"
import React, { useState } from 'react';
import WindowsNavBar from '@/components/NavBar/WindowsNavBar';
import StartMenu from '@/components/StartMenu/StartMenu'; // Assure-toi d'importer le composant StartMenu
import styles from './Page.module.css';
import Window from '@/components/Windows/Windows';

export default function Home() {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [windows, setWindows] = useState([]); 

  const toggleStartMenu = () => {
    setShowStartMenu(!showStartMenu);
  };

  const openWindow = (title, content) => {
    const newWindow = {
      id: Math.random().toString(), // Donne un ID unique à chaque fenêtre
      title: title,
      content: content,
    };
    setWindows([...windows, newWindow]);
  };

  return (
    <div className={styles.mainContainer}>
      <main className={styles.content}>
        <h1 className="text-4xl font-bold text-center">
          Maxence OS
        </h1>
      </main>
      {windows.map((window) => (
        <Window
          key={window.id}
          title={window.title}
          onClose={() => {
            setWindows(windows.filter((w) => w.id !== window.id));
          }}
        >
          {window.content}
        </Window>
      ))}
      <WindowsNavBar onToggleStartMenu={toggleStartMenu} openWindow={openWindow} />
      {showStartMenu && <StartMenu />}
    </div>
  );
}
