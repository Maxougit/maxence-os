'use client';
import React, { useRef, useCallback, useEffect } from 'react';
import styles from './Dock.module.css';

// Magnification façon macOS. Réglages : amplitude, rayon d'influence,
// écartement des voisins et hauteur de « pop » au-dessus de la barre.
const EXTRA = 0.38; // scale max = 1,38 : plus proche de la magnification macOS
const RADIUS = 82; // px : influence légèrement plus large et progressive
const SPREAD = 26; // px : écartement horizontal discret des voisins
const LIFT = 3; // px : le scale depuis la base assure déjà l'essentiel de la levée

/**
 * Dock macOS : magnification stable (centres mesurés hors transform → aucun
 * wobble), les icônes débordent au-dessus de la barre, tooltips + indicateurs.
 */
const Dock = ({ items, bouncingId }) => {
  const dockRef = useRef(null);
  const itemRefs = useRef(new Map());
  const baseCenters = useRef(null);
  const rafId = useRef(null);

  const canHover = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  // Mesure les centres au repos (transforms remis à zéro) : référentiel stable.
  const captureBase = useCallback(() => {
    const centers = new Map();
    itemRefs.current.forEach((el, id) => {
      if (!el) return;
      el.style.transform = '';
      const rect = el.getBoundingClientRect();
      centers.set(id, rect.left + rect.width / 2);
    });
    baseCenters.current = centers;
  }, []);

  const applyMagnification = useCallback((mouseX) => {
    if (!baseCenters.current) captureBase();
    const centers = baseCenters.current;
    itemRefs.current.forEach((el, id) => {
      if (!el) return;
      const center = centers.get(id);
      if (center == null) return;
      const distance = mouseX - center;
      const factor = Math.exp(-((distance / RADIUS) ** 2));
      const scale = 1 + EXTRA * factor;
      const translateX = -SPREAD * (distance / RADIUS) * factor;
      const translateY = -LIFT * factor;
      el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    });
  }, [captureBase]);

  const resetMagnification = useCallback(() => {
    dockRef.current?.classList.remove(styles.magnifying);
    itemRefs.current.forEach((el) => {
      if (el) el.style.transform = '';
    });
    baseCenters.current = null;
  }, []);

  // Un changement de taille invalide les centres mémorisés.
  useEffect(() => {
    const invalidate = () => {
      baseCenters.current = null;
    };
    window.addEventListener('resize', invalidate);
    return () => {
      window.removeEventListener('resize', invalidate);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!canHover()) return;
    dockRef.current?.classList.add(styles.magnifying);
    captureBase();
  };

  const handleMouseMove = (e) => {
    if (!canHover()) return;
    const { clientX } = e;
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      applyMagnification(clientX);
    });
  };

  return (
    <div className={styles.dockWrapper}>
      <div
        ref={dockRef}
        className={styles.dock}
        role="toolbar"
        aria-label="Dock"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetMagnification}
      >
        {items.map((item, index) => {
          if (item.type === 'separator') {
            return <div key={`sep-${index}`} className={styles.separator} />;
          }
          return (
            <div key={item.id} className={styles.item}>
              <div className={styles.tooltip}>{item.name}</div>
              <button
                type="button"
                ref={(el) => {
                  if (el) itemRefs.current.set(item.id, el);
                  else itemRefs.current.delete(item.id);
                }}
                className={`${styles.iconButton} ${
                  bouncingId === item.id ? styles.bouncing : ''
                }`}
                aria-label={item.name}
                onClick={item.onClick}
              >
                {item.icon}
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
              </button>
              <span className={`${styles.dot} ${item.running ? styles.running : ''}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
