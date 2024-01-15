"use client";
import React, { useState } from "react";
import WindowsNavBar from "@/components/NavBar/WindowsNavBar";
import StartMenu from "@/components/StartMenu/StartMenu"; // Assure-toi d'importer le composant StartMenu
import styles from "./Page.module.css";
import Window from "@/components/Windows/Windows";

export default function Home() {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [windows, setWindows] = useState([]);
  const [nextId, setNextId] = useState(0); // Ajout d'un compteur pour les identifiants

  const toggleStartMenu = () => {
    setShowStartMenu(!showStartMenu);
  };

  const openWindow = (title, content) => {
    setWindows([...windows, { id: `window-${nextId}`, title, content }]);
    setNextId(nextId + 1);
  };

  return (
    <div className={styles.mainContainer}>
      <main className={styles.content}>
        <h1 className="text-4xl font-bold text-center">Maxence OS</h1>
        <p className="text-center">Site en construction</p>
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
      <WindowsNavBar
        onToggleStartMenu={toggleStartMenu}
        openWindow={openWindow}
      />
      {showStartMenu && <StartMenu />}
    </div>
  );
}
