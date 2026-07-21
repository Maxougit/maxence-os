'use client';
import React, { useState, useMemo } from 'react';
import styles from './Finder.module.css';
import { FILE_TREE, DESKTOP_FILES, allFiles, findFolder } from '@/data/filesystem';
import { FolderIcon, FileIcon } from '@/components/Icons/AppIcons';

/* eslint-disable @next/next/no-img-element */

const ClockGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" strokeLinecap="round" />
  </svg>
);

const AirdropGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    <path d="M12 3a9 9 0 0 1 9 9M12 7a5 5 0 0 1 5 5M3 12a9 9 0 0 1 9-9M7 12a5 5 0 0 1 5-5" />
  </svg>
);

const DesktopGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M9 20h6M12 16v4" strokeLinecap="round" />
  </svg>
);

const FolderGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const CloudGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 18a4.5 4.5 0 0 1-.5-8.97A6 6 0 0 1 18.2 10.6 4 4 0 0 1 17.5 18z" />
  </svg>
);

const BackGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 5.5L8 12l6.5 6.5" />
  </svg>
);

const ForwardGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 5.5L16 12l-6.5 6.5" />
  </svg>
);

const GridGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6" />
    <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.6" />
    <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.6" />
    <rect x="13" y="13" width="7.5" height="7.5" rx="1.6" />
  </svg>
);

const ListGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M8 6h12M8 12h12M8 18h12" />
    <circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const SearchGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" />
  </svg>
);

const SPECIAL_VIEWS = {
  recents: { name: 'Récents', items: () => allFiles() },
  desktop: { name: 'Bureau', items: () => DESKTOP_FILES },
};

const TYPE_LABELS = {
  pdf: 'Document PDF',
  txt: 'Texte',
  md: 'Document Markdown',
  jpg: 'Image JPEG',
  mp4: 'Vidéo MPEG-4',
  folder: 'Dossier',
};

/**
 * Finder : sidebar Favoris, navigation avec historique, vues grille/liste,
 * recherche dans le dossier courant, barre d'état.
 */
const Finder = ({ openFile, initialFolder }) => {
  const initialView = initialFolder
    ? { type: 'folder', name: initialFolder }
    : { type: 'folder', name: FILE_TREE.name };
  const [history, setHistory] = useState([initialView]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');

  const current = history[historyIndex];

  const navigate = (view) => {
    const nextHistory = [...history.slice(0, historyIndex + 1), view];
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setSelected(null);
    setQuery('');
  };

  const items = useMemo(() => {
    let list;
    if (current.type === 'special') {
      list = SPECIAL_VIEWS[current.id].items();
    } else {
      list = findFolder(current.name).children;
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((item) => item.name.toLowerCase().includes(q));
    }
    return list;
  }, [current, query]);

  const currentName = current.type === 'special' ? SPECIAL_VIEWS[current.id].name : current.name;

  const openItem = (item) => {
    if (item.type === 'folder') navigate({ type: 'folder', name: item.name });
    else openFile(item);
  };

  const handleItemClick = (item) => {
    // Mobile / tactile : un seul tap ouvre, comme iOS.
    if (window.matchMedia('(hover: none)').matches) openItem(item);
    else setSelected(item.name);
  };

  const renderIcon = (item, size) =>
    item.type === 'folder' ? (
      <FolderIcon />
    ) : item.extension === 'jpg' && item.path ? (
      <img src={item.path} alt="" className={styles.gridThumb} style={size ? { maxWidth: size, maxHeight: size } : undefined} />
    ) : (
      <FileIcon extension={item.extension} />
    );

  const sidebarFavorites = [
    { id: 'recents', label: 'Récents', glyph: <ClockGlyph />, view: { type: 'special', id: 'recents' } },
    { id: 'airdrop', label: 'AirDrop', glyph: <AirdropGlyph />, disabled: true },
    { id: 'desktop', label: 'Bureau', glyph: <DesktopGlyph />, view: { type: 'special', id: 'desktop' } },
    { id: 'documents', label: 'Documents', glyph: <FolderGlyph />, view: { type: 'folder', name: 'Documents' } },
    { id: 'images', label: 'Images', glyph: <FolderGlyph />, view: { type: 'folder', name: 'Images' } },
    { id: 'projets', label: 'Projets', glyph: <FolderGlyph />, view: { type: 'folder', name: 'Projets' } },
  ];

  const isActive = (entry) =>
    entry.view &&
    ((entry.view.type === 'special' && current.type === 'special' && current.id === entry.view.id) ||
      (entry.view.type === 'folder' && current.type === 'folder' && current.name === entry.view.name));

  return (
    <div className={styles.finder}>
      <aside className={styles.sidebar}>
        <p className={styles.sidebarSection}>Favoris</p>
        {sidebarFavorites.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`${styles.sidebarItem} ${isActive(entry) ? styles.active : ''}`}
            disabled={entry.disabled}
            onClick={() => entry.view && navigate(entry.view)}
          >
            {entry.glyph}
            {entry.label}
          </button>
        ))}
        <p className={styles.sidebarSection}>Emplacements</p>
        <button
          type="button"
          className={`${styles.sidebarItem} ${
            current.type === 'folder' && current.name === FILE_TREE.name ? styles.active : ''
          }`}
          onClick={() => navigate({ type: 'folder', name: FILE_TREE.name })}
        >
          <DesktopGlyph />
          MacBook de Maxence
        </button>
        <button type="button" className={styles.sidebarItem} disabled>
          <CloudGlyph />
          iCloud Drive
        </button>
        <p className={styles.sidebarSection}>Tags</p>
        {[
          ['#ff453a', 'Urgent'],
          ['#ff9f0a', 'Freelance'],
          ['#30d158', 'Perso'],
          ['#0a84ff', 'CV'],
        ].map(([color, label]) => (
          <button key={label} type="button" className={styles.sidebarItem} disabled>
            <span className={styles.tagDot} style={{ background: color }} />
            {label}
          </button>
        ))}
      </aside>

      <div className={styles.main}>
        <div className={styles.toolbar}>
          <div className={styles.navButtons}>
            <button
              type="button"
              className={styles.toolButton}
              aria-label="Précédent"
              disabled={historyIndex === 0}
              onClick={() => {
                setHistoryIndex(historyIndex - 1);
                setSelected(null);
              }}
            >
              <BackGlyph />
            </button>
            <button
              type="button"
              className={styles.toolButton}
              aria-label="Suivant"
              disabled={historyIndex >= history.length - 1}
              onClick={() => {
                setHistoryIndex(historyIndex + 1);
                setSelected(null);
              }}
            >
              <ForwardGlyph />
            </button>
          </div>
          <span className={styles.folderTitle}>{currentName}</span>
          <button
            type="button"
            className={`${styles.toolButton} ${viewMode === 'grid' ? styles.activeView : ''}`}
            aria-label="Vue en icônes"
            onClick={() => setViewMode('grid')}
          >
            <GridGlyph />
          </button>
          <button
            type="button"
            className={`${styles.toolButton} ${viewMode === 'list' ? styles.activeView : ''}`}
            aria-label="Vue en liste"
            onClick={() => setViewMode('list')}
          >
            <ListGlyph />
          </button>
          <label className={styles.search}>
            <SearchGlyph />
            <input
              placeholder="Rechercher"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck={false}
            />
          </label>
        </div>

        <div className={styles.content} onClick={() => setSelected(null)}>
          {items.length === 0 ? (
            <p className={styles.empty}>Aucun élément</p>
          ) : viewMode === 'grid' ? (
            <div className={styles.grid}>
              {items.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`${styles.gridItem} ${selected === item.name ? styles.selected : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(item);
                  }}
                  onDoubleClick={() => openItem(item)}
                >
                  <span className={styles.gridIcon}>{renderIcon(item)}</span>
                  <span className={styles.gridLabel}>{item.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <table className={styles.list}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Taille</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.name}
                    className={`${styles.listRow} ${selected === item.name ? styles.selected : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    onDoubleClick={() => openItem(item)}
                  >
                    <td>
                      <span className={styles.listIcon}>{renderIcon(item, 17)}</span>
                      {item.name}
                    </td>
                    <td>{item.size || '--'}</td>
                    <td>{TYPE_LABELS[item.type === 'folder' ? 'folder' : item.extension] || 'Document'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.statusBar}>
          <span>
            {items.length} élément{items.length > 1 ? 's' : ''}
            {selected ? `, 1 sélectionné` : ''}
          </span>
          <span>214,3 Go disponibles</span>
        </div>
      </div>
    </div>
  );
};

export default Finder;
