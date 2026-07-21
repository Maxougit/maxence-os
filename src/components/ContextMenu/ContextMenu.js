'use client';
import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import menuStyles from '@/components/MenuBar/MenuBar.module.css';

/**
 * Menu contextuel (clic droit sur le bureau), même design que les
 * menus déroulants de la barre de menus.
 */
const ContextMenu = ({ x, y, items, onClose }) => {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ x, y });

  useLayoutEffect(() => {
    const rect = menuRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      x: Math.min(x, window.innerWidth - rect.width - 8),
      y: Math.min(y, window.innerHeight - rect.height - 8),
    });
  }, [x, y]);

  useEffect(() => {
    const handleClose = (e) => {
      if (!menuRef.current?.contains(e.target)) onClose();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('pointerdown', handleClose);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('pointerdown', handleClose);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={menuStyles.dropdown}
      style={{ position: 'fixed', top: position.y, left: position.x, zIndex: 90 }}
      role="menu"
    >
      {items.map((item, index) =>
        item.divider ? (
          <div key={`divider-${index}`} className={menuStyles.divider} role="separator" />
        ) : (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className={menuStyles.menuItem}
            disabled={item.disabled}
            onClick={() => {
              onClose();
              item.onSelect?.();
            }}
          >
            <span className={menuStyles.itemLabel}>{item.label}</span>
          </button>
        )
      )}
    </div>
  );
};

export default ContextMenu;
