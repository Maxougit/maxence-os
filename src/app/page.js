"use client";
import React, { useState } from "react";
import WindowsNavBar from "@/components/NavBar/WindowsNavBar";
import StartMenu from "@/components/StartMenu/StartMenu";
import styles from "./Page.module.css";
import Window from "@/components/Windows/Windows";

export default function Home() {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [windows, setWindows] = useState([]);

  const toggleStartMenu = () => {
    setShowStartMenu(!showStartMenu);
  };

  const openWindow = (contentId, title, content) => {
    const existingWindowIndex = windows.findIndex(w => w.contentId === contentId);

    if (existingWindowIndex >= 0) {
      // Si la fenêtre est déjà ouverte, on la retire pour la réouvrir au premier plan
      setWindows(windows => windows.filter((_, index) => index !== existingWindowIndex));
    }

    // On ajoute la nouvelle fenêtre à la fin du tableau
    setWindows(windows => [...windows, { contentId, title, content }]);
  };

  const bringToFront = (contentId) => {
    const windowIndex = windows.findIndex(w => w.contentId === contentId);
    const newWindows = [...windows];
    const [window] = newWindows.splice(windowIndex, 1);
    setWindows([...newWindows, window]); // On déplace la fenêtre au dernier indice pour la mettre au premier plan
  };

  return (
    <div className={styles.mainContainer}>
      <main className={styles.content}>
        <h1 className="text-4xl font-bold text-center">Maxence OS</h1>
        <p className="text-center">Site en construction</p>
      </main>
      {windows.map((window, index) => (
        <Window
          key={window.contentId}
          title={window.title}
          onClose={() => {
            setWindows(windows => windows.filter((w) => w.contentId !== window.contentId));
          }}
          onFocus={() => bringToFront(window.contentId)}
        >
          {window.content}
        </Window>
      ))}
      <WindowsNavBar
        onToggleStartMenu={toggleStartMenu}
        openWindow={openWindow}
      />
      {showStartMenu && <StartMenu />}
    </div>
  );
}
