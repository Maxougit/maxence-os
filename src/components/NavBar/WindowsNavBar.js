import React from "react";
import styles from "./WindowsNavBar.module.css";
import Icon from "@mdi/react";
import {
  mdiMicrosoftWindows,
  mdiConsole,
  mdiFolder,
  mdiDatabase,
} from "@mdi/js";
import Terminal from "../Application/Terminal";
import Explorer from "../Application/Explorer";
import Viewer from "../Application/Viewer";

const isMobileDevice = () => {
  return window.innerWidth <= 768;
};

const WindowsNavBar = ({ onToggleStartMenu, openWindow }) => {
  return (
    <nav className={styles.windowsNavBar}>
      <Icon
        className={styles.startMenuButton}
        onClick={onToggleStartMenu}
        path={mdiMicrosoftWindows}
        size={1.8}
        color="white"
      />
      <Icon
        className={styles.appIcon}
        path={mdiConsole}
        size={1.5}
        color="white"
        onClick={() => openWindow(1, "Terminal", <Terminal />)}
      />
      <Icon
        className={styles.appIcon}
        path={mdiFolder}
        size={1.5}
        color="white"
        onClick={() => {
          // Déterminer la taille de la fenêtre en fonction de l'appareil
          const sizeProps = isMobileDevice()
            ? null
            : { width: "500px", height: "800px" };

          openWindow(
            2,
            "Explorer",
            <Explorer
              openFile={(file) =>
                openWindow(
                  file.id,
                  file.name,
                  <Viewer file={file} />,
                  sizeProps
                )
              }
            />
          );
        }}
      />
      <Icon
        className={styles.appIcon}
        path={mdiDatabase}
        size={1.5}
        color="white"
        onClick={() =>
          openWindow(
            3,
            "Base de Données",
            "Contenu de la base de données ici..."
          )
        }
      />
    </nav>
  );
};

export default WindowsNavBar;
