import React, { useState, useEffect } from 'react';
import styles from './Window.module.css';

const Window = ({ title, children, onClose, onFocus }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    onFocus(); // Déplacer cette fenêtre au premier plan lorsqu'elle est focus
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: position.x + e.movementX,
        y: position.y + e.movementY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
    }

    // Nettoie l'événement lorsque le composant est démonté ou le dragging est terminé
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={styles.window}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className={styles.titleBar} onMouseDown={handleMouseDown}>
        <span>{title}</span>
        <button onClick={onClose}>X</button>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Window;
