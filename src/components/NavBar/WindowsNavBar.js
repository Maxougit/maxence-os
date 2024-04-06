import React from "react";
import styles from "./WindowsNavBar.module.css";
import Icon from "@mdi/react";
import { mdiConsole, mdiFolder, mdiDatabase } from "@mdi/js";
import Terminal from "../Application/Terminal";
import Explorer from "../Application/Explorer";
import Viewer from "../Application/Viewer";
import Database from "../Application/Database";
import { isMobileDevice } from "@/utils/device";

export const StreamlineLayoutWindow1Solid = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M1.5 0h3.375v14H1.5A1.5 1.5 0 0 1 0 12.5v-11A1.5 1.5 0 0 1 1.5 0m4.625 7.625V14H12.5a1.5 1.5 0 0 0 1.5-1.5V7.625zM14 6.375H6.125V0H12.5A1.5 1.5 0 0 1 14 1.5z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const WindowsNavBar = ({ onToggleStartMenu, openWindow }) => {
  return (
    <nav className={styles.windowsNavBar}>
      {/* <Icon
        className={styles.startMenuButton}
        onClick={onToggleStartMenu}
        path={StreamlineLayoutWindow1Solid}
        size={1.8}
        color="white"
      /> */}
      <StreamlineLayoutWindow1Solid
        className={styles.startMenuButton}
        onClick={onToggleStartMenu}
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
          openWindow(
            2,
            "Explorer",
            <Explorer
              openFile={(file) => {
                const sizeProps = isMobileDevice()
                  ? null
                  : file === undefined
                  ? null
                  : file.extension === "pdf"
                  ? { width: "500px", height: "800px" }
                  : null;
                openWindow(
                  file.id,
                  file.name,
                  <Viewer file={file} />,
                  sizeProps
                );
              }}
            />
          );
        }}
      />
      <Icon
        className={styles.appIcon}
        path={mdiDatabase}
        size={1.5}
        color="white"
        onClick={() => openWindow(3, "Base de Données", <Database />)}
      />
    </nav>
  );
};

export default WindowsNavBar;
