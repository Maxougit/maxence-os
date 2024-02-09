"use client";
import React, { useState } from "react";
import WindowsNavBar from "@/components/NavBar/WindowsNavBar";
import StartMenu from "@/components/StartMenu/StartMenu"; // Assure-toi d'importer le composant StartMenu
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
      setWindows(windows => windows.filter((_, index) => index !== existingWindowIndex));
    }

    setWindows(windows => [...windows, { contentId, title, content }]);
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
