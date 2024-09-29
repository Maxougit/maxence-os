import React, { useEffect } from "react";
import { mdiConsole, mdiFolder, mdiDatabase } from "@mdi/js";
import Terminal from "../Application/Terminal";
import Explorer from "../Application/Explorer";
import Viewer from "../Application/Viewer";
import Database from "../Application/Database";
import { isMobileDevice } from "@/utils/device";
import PacManGame from "../Application/PacManGame";

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

const WindowsNavBar = ({ onToggleStartMenu, openWindow, windows }) => {
  const isOpen = (tab) => {
    return windows?.some((w) => w.contentId === tab);
  };
  return (
    <ul className="menu menu-horizontal bg-base-200/50 rounded-box p-2 mb-1 w-auto center place-content-center place-self-center border border-base-100 backdrop-blur-lg z-50">
      {/* <li>
        <a onClick={onToggleStartMenu}>
          <StreamlineLayoutWindow1Solid className="h-5 w-5 text-white" />
        </a>
      </li> */}
      <li>
        <a
          className={isOpen(1) ? "active" : ""}
          onClick={() => openWindow(1, "Terminal", <Terminal />)}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d={mdiConsole} />
          </svg>
        </a>
      </li>
      <li>
        <a
          className={isOpen(2) ? "active" : ""}
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
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d={mdiFolder} />
          </svg>
        </a>
      </li>
      <li>
        <a
          className={isOpen(3) ? "active" : ""}
          onClick={() => openWindow(3, "Base de Données", <Database />)}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d={mdiDatabase} />
          </svg>
        </a>
      </li>
      <li>
        <a
          className={isOpen(4) ? "active" : ""}
          onClick={() => openWindow(4, "Jeu PAC-MAN", <PacManGame />)}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            {/* Icône du jeu */}
            <path d="M13 2C8.58 2 5 5.58 5 10s3.58 8 8 8c1.85 0 3.55-.63 4.9-1.69l-4.9-6.31V2z" />
          </svg>
        </a>
      </li>
    </ul>
  );
};

export default WindowsNavBar;
