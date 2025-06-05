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
    },
    [isDragging, isResizing, position, size, startCoords]
  );

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const isTitleBar =
      e.target.classList.contains("title-bar") || e.target.nodeName === "SPAN";

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

  const [showIcon, setShowIcon] = useState({
    close: false,
    minimize: false,
    expand: false,
  });

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
        onTouchStart={handleTouchStart}
      >
        <div className="w-full bg-base-200 flex justify-between items-center py-3 px-3">
          <div className="flex flex-1 gap-2">
            {/* Bouton rouge - Fermer */}
            <div
              onMouseEnter={() => setShowIcon({ ...showIcon, close: true })}
              onMouseLeave={() => setShowIcon({ ...showIcon, close: false })}
              onClick={onClose}
              className="cursor-pointer w-3 h-3 rounded-full duration-100 bg-red-500 hover:bg-red-700 relative flex justify-center items-center"
            >
              {showIcon.close && (
                <span className="absolute inset-0 flex justify-center items-center font-bold text-xs text-black">
                  x
                </span>
              )}
            </div>
            {/* Bouton jaune - Minimiser */}
            <div
              onMouseEnter={() => setShowIcon({ ...showIcon, minimize: true })}
              onMouseLeave={() => setShowIcon({ ...showIcon, minimize: false })}
              className="cursor-pointer w-3 h-3 rounded-full duration-100 bg-yellow-500 hover:bg-yellow-700 relative flex justify-center items-center"
            >
              {showIcon.minimize && (
                <span className="absolute inset-0 flex justify-center items-center font-bold text-xs text-black">
                  -
                </span>
              )}
            </div>
            {/* Bouton vert - Agrandir */}
            <div
              onMouseEnter={() => setShowIcon({ ...showIcon, expand: true })}
              onMouseLeave={() => setShowIcon({ ...showIcon, expand: false })}
              className="cursor-pointer w-3 h-3 rounded-full duration-100 bg-green-500 hover:bg-green-700 relative flex justify-center items-center"
            >
              {showIcon.expand && (
                <span className="absolute inset-0 flex justify-center items-center font-bold text-xs text-black">
                  +
                </span>
              )}
            </div>
          </div>
          <span className="flex-1 text-center text-nowrap">{title}</span>
          <div className="flex-1"></div>
        </div>
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
