import React, { useState } from "react";
import styles from "./Explorer.module.css";

const initialData = {
  type: "folder",
  name: "/",
  children: {
    Documents: {
      type: "folder",
      name: "Documents",
      children: {
        "CV.pdf": {
          id: 101,
          type: "file",
          extension: "pdf",
          name: "CV Leroux Maxence.pdf",
          path: "/files/CV Leroux Maxence FR.pdf",
        },
      },
    },
    Images: {
      type: "folder",
      name: "Images",
      children: {
        "profile.jpg": {
          id: 102,
          type: "file",
          extension: "jpg",
          name: "profil.jpg",
          path: "/images/profil.jpg",
        },
      },
    },
    "Todo.txt": {
      id: 103,
      type: "file",
      extension: "txt",
      name: "Todo.txt",
      path: "/files/Todo.txt",
    },
  },
};

const Item = ({ item, onNavigate, level = 0 }) => {
  const handleClick = () => {
    onNavigate(item);
  };

  return (
    <div
      className={`${styles.item} ${
        item.type === "folder" ? styles.folder : styles.file
      }`}
      style={{ paddingLeft: `${level * 20}px` }}
      onClick={handleClick}
    >
      {item.name}
    </div>
  );
};

const Explorer = ({ openFile }) => {
  const [currentItem, setCurrentItem] = useState(initialData);
  const [history, setHistory] = useState([initialData]);

  const navigateTo = (item) => {
    if (item.type === "file") {
      openFile(item);
    } else {
      setCurrentItem(item);
      setHistory((prev) => [...prev, item]);
    }
  };

  const goBack = () => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, prev.length - 1);
      setCurrentItem(newHistory[newHistory.length - 1] || initialData);
      return newHistory;
    });
  };

  const renderItems = (item, level = 0) => {
    return Object.values(item.children || {}).map((child) => (
      <Item
        key={child.name}
        item={child}
        onNavigate={navigateTo}
        level={level}
      />
    ));
  };

  return (
    <div className={styles.explorer}>
      <div className={styles.toolbar}>
        <button onClick={goBack} disabled={history.length <= 1}>
          Retour
        </button>
        <span>{currentItem.name}</span>
      </div>
      <div className={styles.content}>{renderItems(currentItem)}</div>
    </div>
  );
};

export default Explorer;
