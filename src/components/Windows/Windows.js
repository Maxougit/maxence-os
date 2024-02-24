import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Window.module.css";

const Window = ({ title, children, onClose, onFocus }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [size, setSize] = useState({ width: "auto", height: "auto" });
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const startDrag = (x, y) => {
    setIsDragging(true);
    setStartCoords({ x, y });
    onFocus();
  };

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

  useEffect(() => {
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
  }, [handleMouseMove, handleMouseUp, isDragging, isResizing]);

  return (
    <div
      ref={windowRef}
      className={styles.window}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      <div
        className={styles.titleBar}
        onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
      >
        <span>{title}</span>
        <button onClick={onClose} className={styles.closeButton}></button>
      </div>
      <div className={styles.resizableHandle} onMouseDown={startResize}></div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Window;
