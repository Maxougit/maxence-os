'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Spotlight.module.css';

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/**
 * Spotlight : recherche globale (apps, fichiers, compétences, liens).
 * Navigation clavier : ↑↓ pour choisir, ⏎ pour ouvrir, Échap pour fermer.
 */
const Spotlight = ({ sources, onClose }) => {
  const [query, setQuery] = useState('');
  // La sélection mémorise la requête associée : nouvelle requête → index 0,
  // sans effet de synchronisation.
  const [selection, setSelection] = useState({ query: '', index: 0 });
  const selectedIndex = selection.query === query ? selection.index : 0;
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { groups, flatItems } = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = !q
      ? sources.filter((s) => s.suggested).map((s) => ({ ...s, items: s.items.slice(0, 6) }))
      : sources
          .map((source) => ({
            ...source,
            items: source.items
              .filter((item) => normalize(`${item.title} ${item.subtitle || ''}`).includes(q))
              .slice(0, 5),
          }))
          .filter((source) => source.items.length > 0);

    const withIndices = filtered.reduce(
      (acc, group) => {
        const items = group.items.map((item, j) => ({ ...item, globalIndex: acc.offset + j }));
        return {
          offset: acc.offset + items.length,
          groups: [...acc.groups, { ...group, items }],
        };
      },
      { offset: 0, groups: [] }
    ).groups;
    return { groups: withIndices, flatItems: withIndices.flatMap((g) => g.items) };
  }, [query, sources]);

  const setSelectedIndex = (updater) => {
    setSelection((prev) => {
      const current = prev.query === query ? prev.index : 0;
      const next = typeof updater === 'function' ? updater(current) : updater;
      return { query, index: next };
    });
  };

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const runItem = (item) => {
    onClose();
    item.run();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatItems[selectedIndex]) {
      runItem(flatItems[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onPointerDown={onClose}>
      <div
        className={styles.spotlight}
        role="dialog"
        aria-label="Recherche Spotlight"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className={styles.searchRow}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5L21 21" />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Recherche Spotlight"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />
        </div>

        {flatItems.length > 0 ? (
          <div className={styles.results} ref={listRef}>
            {groups.map((group) => (
              <div key={group.category}>
                <p className={styles.category}>{group.category}</p>
                {group.items.map((item) => {
                  const index = item.globalIndex;
                  const selected = index === selectedIndex;
                  return (
                    <button
                      key={`${group.category}-${item.id}`}
                      type="button"
                      data-selected={selected}
                      className={`${styles.result} ${selected ? styles.selected : ''}`}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => runItem(item)}
                    >
                      <span className={styles.resultIcon}>{item.icon}</span>
                      <span className={styles.resultTexts}>
                        <span className={styles.resultTitle}>{item.title}</span>
                        {item.subtitle && (
                          <br aria-hidden />
                        )}
                        {item.subtitle && (
                          <span className={styles.resultSubtitle}>{item.subtitle}</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>Aucun résultat pour « {query} »</div>
        )}

        <div className={styles.footer}>
          <span>↑↓ naviguer</span>
          <span>⏎ ouvrir</span>
          <span>esc fermer</span>
        </div>
      </div>
    </div>
  );
};

export default Spotlight;
