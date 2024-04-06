"use client";
import React, { useEffect, useState } from "react";
import WindowsNavBar from "@/components/NavBar/WindowsNavBar";
import StartMenu from "@/components/StartMenu/StartMenu";
import styles from "./Page.module.css";
import Window from "@/components/Windows/Windows";
import { FaRegFilePdf } from "react-icons/fa6";
import Viewer from "@/components/Application/Viewer";
import { isMobileDevice } from "@/utils/device";

const file = {
  id: 101,
  type: "file",
  extension: "pdf",
  name: "CV Leroux Maxence.pdf",
  path: "/files/CV Leroux Maxence FR.pdf",
};

export default function Home() {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [windows, setWindows] = useState([]);

  const toggleStartMenu = () => {
    setShowStartMenu(!showStartMenu);
  };

  const openWindow = (contentId, title, content, size) => {
    const existingWindowIndex = windows.findIndex(
      (w) => w.contentId === contentId
    );

    if (existingWindowIndex >= 0) {
      // Si la fenêtre est déjà ouverte, on la retire pour la réouvrir au premier plan

      setWindows((windows) =>
        windows.filter((_, index) => index !== existingWindowIndex)
      );
    }

    // On ajoute la nouvelle fenêtre à la fin du tableau
    setWindows((windows) => [...windows, { contentId, title, content, size }]);
  };

  const bringToFront = (contentId) => {
    const windowIndex = windows.findIndex((w) => w.contentId === contentId);
    const newWindows = [...windows];
    const [window] = newWindows.splice(windowIndex, 1);
    setWindows([...newWindows, window]); // On déplace la fenêtre au dernier indice pour la mettre au premier plan
  };

  return (
    <div
      className={styles.mainContainer}
      style={{ backgroundImage: "url(/wp.webp)" }}
    >
      <main className={styles.content}>
        <h1 className="text-4xl font-bold text-center">Maxence OS</h1>
        <p className="text-center">Site en construction</p>
        <div
          className={styles.iconContainer}
          onClick={() => {
            const sizeProps = isMobileDevice()
              ? null
              : { width: "500px", height: "800px" };
            openWindow(
              101,
              "CV Leroux Maxence.pdf",
              <Viewer file={file} />,
              sizeProps
            );
          }}
        >
          <div className={styles.icon}>
            <FaRegFilePdf size={48} />
            <p>CV L.Maxence FR</p>
          </div>
        </div>
      </main>
      {windows.map((window, index) => (
        <Window
          key={window.contentId}
          title={window.title}
          onClose={() => {
            setWindows((windows) =>
              windows.filter((w) => w.contentId !== window.contentId)
            );
          }}
          onFocus={() => bringToFront(window.contentId)}
          forceDefaultSize={window.size}
        >
          {window.content}
        </Window>
      ))}
      <WindowsNavBar
        windows={windows}
        onToggleStartMenu={toggleStartMenu}
        openWindow={openWindow}
      />
      {showStartMenu && <StartMenu />}
    </div>
  );
}
