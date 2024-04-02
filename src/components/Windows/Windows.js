import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Window.module.css";

const Window = ({ title, children, onClose, onFocus, forceDefaultSize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [size, setSize] = useState({ width: "auto", height: "auto" });
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const startDrag = (x, y, isTitleBar) => {
    if (isTitleBar) {
      setIsDragging(true);
      setStartCoords({ x, y });
      onFocus();
    }
  };

  useEffect(() => {
    if (forceDefaultSize) {
      setSize({
        width: forceDefaultSize.width || "auto",
        height: forceDefaultSize.height || "auto",
      });
    }
  }, [forceDefaultSize]);

  const startResize = (e) => {
    setIsResizing(true);
    setStartCoords({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const dx = e.clientX - startCoords.x;
        const dy = e.clientY - startCoords.y;
        setPosition({ x: position.x + dx, y: position.y + dy });
        setStartCoords({ x: e.clientX, y: e.clientY });
      } else if (isResizing) {
        const dx = e.clientX - startCoords.x;
        const dy = e.clientY - startCoords.y;
        setSize({ width: size.width + dx, height: size.height + dy });
        setStartCoords({ x: e.clientX, y: e.clientY });
      }

      if (isDragging || isResizing) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    },
    [handleMouseUp, isDragging, isResizing, position, size, startCoords]
  );

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const isTitleBar =
      e.target.classList.contains(styles.titleBar) ||
      e.target.classList.contains(styles.closeButton) ||
      e.target.classList.contains("span");
    startDrag(touch.clientX, touch.clientY, isTitleBar);
  };

  const handleTouchMove = useCallback(
    (e) => {
      const touch = e.touches[0];
      if (isDragging) {
        const dx = touch.clientX - startCoords.x;
        const dy = touch.clientY - startCoords.y;
        setPosition({ x: position.x + dx, y: position.y + dy });
        setStartCoords({ x: touch.clientX, y: touch.clientY });
      }
    },
    [isDragging, position, startCoords]
  );

  const handleTitleBarMouseDown = (e) => {
    startDrag(e.clientX, e.clientY, true);
  };

  const preventTouchStartPropagation = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, isDragging, isResizing]);

  return (
    <div
      ref={windowRef}
      className={styles.window}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: typeof size.width === "number" ? `${size.width}px` : size.width,
        height:
          typeof size.height === "number" ? `${size.height}px` : size.height,
      }}
      onTouchStart={handleTouchStart}
    >
      <div
        className={styles.titleBar}
        onMouseDown={handleTitleBarMouseDown}
        onTouchStart={handleTouchStart} // Événement de démarrage du toucher spécifique à la barre de titre
      >
        <span className="span">{title}</span>
        <button onClick={onClose} className={styles.closeButton}></button>
      </div>
      <div
        className={styles.resizableHandle}
        onMouseDown={startResize}
        onTouchStart={startResize}
      ></div>
      <div
        className={styles.content}
        onTouchStart={preventTouchStartPropagation} // Empêcher la propagation pour le contenu
      >
        {children}
      </div>
    </div>
  );
};

export default Window;
