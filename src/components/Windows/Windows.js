import React, { useState, useEffect, useRef } from "react";
import styles from "./Window.module.css";

const Window = ({ title, children, onClose, onFocus }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const dragStartPos = useRef({ startX: 0, startY: 0 }); // Stocke les positions de départ du drag
  const windowRef = useRef(null);

  const startDrag = (x, y) => {
    setIsDragging(true);
    dragStartPos.current = { startX: x - position.x, startY: y - position.y }; // Mémorise la position initiale de la souris par rapport à l'élément
    onFocus();
  };

  const moveDrag = (x, y) => {
    if (isDragging) {
      // Calcule le nouveau positionnement en soustrayant la position de départ
      setPosition({
        x: x - dragStartPos.current.startX,
        y: y - dragStartPos.current.startY,
      });
    }
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (isDragging) {
        const touch = e.touches[0];
        moveDrag(touch.clientX, touch.clientY);
        e.preventDefault();
      }
    };

    const element = windowRef.current;
    if (element) {
      element.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    return () => {
      if (element) {
        element.removeEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
      }
    };
  }, [isDragging]);

  return (
    <div
      ref={windowRef}
      className={styles.window}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
      }}
      onMouseMove={(e) => {
        if (isDragging) {
          moveDrag(e.clientX, e.clientY);
        }
      }}
      onTouchMove={(e) => {
        if (isDragging) {
          const touch = e.touches[0];
          moveDrag(touch.clientX, touch.clientY);
        }
      }}
      onMouseUp={stopDrag}
      onTouchEnd={stopDrag}
    >
      <div className={styles.titleBar}>
        <span>{title}</span>
        <button onClick={onClose} className={styles.closeButton}></button>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Window;
