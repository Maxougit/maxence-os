'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Window.module.css';

const MENUBAR_HEIGHT = 30;

const CloseGlyph = () => (
  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M2 2l6 6M8 2l-6 6" />
  </svg>
);

const MinGlyph = () => (
  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M2 5h6" />
  </svg>
);

const MaxGlyph = () => (
  <svg viewBox="0 0 10 10" fill="currentColor">
    <path d="M2.2 5.8L5.8 2.2H2.2zM7.8 4.2L4.2 7.8h3.6z" />
  </svg>
);

/**
 * Fenêtre macOS : drag, resize, réduire (animation vers le Dock),
 * zoom (plein écran sous la barre de menus), focus, animations d'ouverture.
 */
const Window = ({
  title,
  children,
  index = 0,
  isFocused = true,
  status = 'open', // 'opening' | 'open' | 'closing'
  minimized = false,
  darkChrome = false,
  defaultSize,
  isMobile = false,
  onClose,
  onMinimize,
  onFocus,
}) => {
  const windowRef = useRef(null);
  const dragState = useRef(null);
  const rafId = useRef(null);
  const firstRender = useRef(true);

  // Cette fenêtre n'est montée que côté client (après interaction) :
  // l'initialiseur peut lire le viewport directement.
  const [geometry, setGeometry] = useState(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(defaultSize?.width || 680, vw - 24);
    const height = Math.min(defaultSize?.height || 460, vh - MENUBAR_HEIGHT - 110);
    const step = index % 6;
    const x = Math.max(12, Math.round((vw - width) / 2 - 90 + step * 44));
    const y = Math.max(
      MENUBAR_HEIGHT + 14,
      Math.round((vh - MENUBAR_HEIGHT - 100 - height) / 2 + MENUBAR_HEIGHT + step * 30)
    );
    return { position: { x, y }, size: { width, height } };
  });
  const { position, size } = geometry;
  const setPosition = useCallback(
    (position) => setGeometry((g) => ({ ...g, position })),
    []
  );
  const setSize = useCallback((size) => setGeometry((g) => ({ ...g, size })), []);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [minimizePhase, setMinimizePhase] = useState(minimized ? 'hidden' : 'none');

  // Animation réduire / restaurer pilotée par la prop `minimized`.
  // Les setState passent par rAF/timeout (callbacks asynchrones).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    let raf;
    let timer;
    if (minimized) {
      const el = windowRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const targetX = window.innerWidth / 2 - (rect.left + rect.width / 2);
        const targetY = window.innerHeight - rect.top;
        el.style.setProperty('--min-tx', `${targetX}px`);
        el.style.setProperty('--min-ty', `${targetY}px`);
      }
      raf = requestAnimationFrame(() => setMinimizePhase('minimizing'));
      timer = setTimeout(() => setMinimizePhase('hidden'), 400);
    } else {
      raf = requestAnimationFrame(() => setMinimizePhase('restoring'));
      timer = setTimeout(() => setMinimizePhase('none'), 360);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [minimized]);

  const stopInteractions = useCallback(() => {
    dragState.current = null;
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handlePointerMove = useCallback((e) => {
    const state = dragState.current;
    if (!state) return;
    e.preventDefault();
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (state.type === 'drag') {
        setPosition({
          x: state.origin.x + dx,
          y: Math.max(MENUBAR_HEIGHT, state.origin.y + dy),
        });
      } else {
        setSize({
          width: Math.max(340, state.origin.width + dx),
          height: Math.max(220, state.origin.height + dy),
        });
      }
    });
  }, [setPosition, setSize]);

  useEffect(() => {
    if (!isDragging && !isResizing) return;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopInteractions);
    window.addEventListener('pointercancel', stopInteractions);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopInteractions);
      window.removeEventListener('pointercancel', stopInteractions);
    };
  }, [isDragging, isResizing, handlePointerMove, stopInteractions]);

  const startDrag = (e) => {
    onFocus?.();
    if (maximized || isMobile) return;
    if (e.target.closest('button')) return;
    dragState.current = {
      type: 'drag',
      startX: e.clientX,
      startY: e.clientY,
      origin: { ...position },
    };
    setIsDragging(true);
  };

  const startResize = (e) => {
    if (isMobile) return;
    e.stopPropagation();
    onFocus?.();
    dragState.current = {
      type: 'resize',
      startX: e.clientX,
      startY: e.clientY,
      origin: { ...size },
    };
    setIsResizing(true);
  };

  const toggleMaximize = () => {
    onFocus?.();
    setMaximized((value) => !value);
  };

  const handleTitleBarDoubleClick = (e) => {
    if (e.target.closest('button')) return;
    toggleMaximize();
  };

  if (!position || !size) return null;

  const classes = [
    styles.window,
    !isFocused && styles.unfocused,
    status === 'opening' && styles.opening,
    status === 'closing' && styles.closing,
    isDragging && styles.dragging,
    isResizing && styles.resizing,
    maximized && styles.maximized,
    isMobile && styles.mobileWindow,
    darkChrome && styles.darkChrome,
    minimizePhase === 'minimizing' && styles.minimizing,
    minimizePhase === 'restoring' && styles.restoring,
    minimizePhase === 'hidden' && styles.hidden,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      ref={windowRef}
      className={classes}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 10 + index,
      }}
      aria-label={title}
      onPointerDown={() => onFocus?.()}
    >
      <header
        className={styles.titleBar}
        onPointerDown={startDrag}
        onDoubleClick={handleTitleBarDoubleClick}
      >
        <div className={styles.lights}>
          <button
            type="button"
            className={`${styles.light} ${styles.lightClose}`}
            aria-label="Fermer la fenêtre"
            onClick={onClose}
          >
            <CloseGlyph />
          </button>
          <button
            type="button"
            className={`${styles.light} ${styles.lightMin}`}
            aria-label="Réduire la fenêtre"
            onClick={onMinimize}
          >
            <MinGlyph />
          </button>
          <button
            type="button"
            className={`${styles.light} ${styles.lightMax}`}
            aria-label="Agrandir la fenêtre"
            onClick={toggleMaximize}
          >
            <MaxGlyph />
          </button>
        </div>
        <span className={styles.title}>{title}</span>
      </header>
      <div className={styles.content}>{children}</div>
      <div className={styles.resizeHandle} onPointerDown={startResize} />
    </section>
  );
};

export default Window;
