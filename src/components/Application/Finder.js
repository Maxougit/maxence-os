'use client';
import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Finder.module.css';
import { useSiteData } from '@/data/SiteDataProvider';
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

// Vues spéciales : libellé traduit + source des éléments dans l'arborescence.
const SPECIAL_VIEWS = {
  recents: { labelKey: 'sidebarRecents', items: (fs) => fs.allFiles() },
  desktop: { labelKey: 'sidebarDesktop', items: (fs) => fs.DESKTOP_FILES },
};

// Clés de traduction de la colonne « Type », indexées par extension.
const KIND_KEYS = {
  pdf: 'kindPdf',
  txt: 'kindTxt',
  md: 'kindMd',
  jpg: 'kindJpg',
  mp4: 'kindMp4',
  folder: 'kindFolder',
};

// Les dossiers racine sont désignés par leur nom, qui change selon la langue :
// on les résout par position dans FILE_TREE.children plutôt qu'en dur.
const ROOT_FOLDER_INDEX = { documents: 0, images: 1, projects: 2, publications: 3 };
const rootFolderName = (fs, key) => fs.FILE_TREE.children[ROOT_FOLDER_INDEX[key]].name;

// Alias acceptés pour `initialFolder` : les identifiants neutres, mais aussi les
// noms de dossiers (FR comme EN) que les appelants historiques passent encore.
const FOLDER_ALIASES = {
  documents: 'documents',
  images: 'images',
  pictures: 'images',
  projets: 'projects',
  projects: 'projects',
  publications: 'publications',
};

// Résout `initialFolder` en un nom présent dans l'arborescence courante ; ce qui
// n'est pas reconnu passe tel quel (findFolder retombe alors sur la racine).
const resolveFolderName = (fs, value) => {
  if (!value) return undefined;
  const key = FOLDER_ALIASES[String(value).toLowerCase()];
  return typeof ROOT_FOLDER_INDEX[key] === 'number' ? rootFolderName(fs, key) : value;
};

/**
 * Finder : sidebar Favoris, navigation avec historique, vues grille/liste,
 * recherche dans le dossier courant, barre d'état.
 */
const Finder = ({ openFile, initialFolder }) => {
  const t = useTranslations('finder');
  const { fs } = useSiteData();
  // `initialFolder` accepte un identifiant neutre ('projects'…) ou un nom de
  // dossier localisé ; findFolder retombe sur la racine si le nom est inconnu.
  const initialFolderName = resolveFolderName(fs, initialFolder);
  const initialView = initialFolderName
    ? { type: 'folder', name: initialFolderName }
    : { type: 'folder', name: fs.FILE_TREE.name };
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
      list = SPECIAL_VIEWS[current.id].items(fs);
    } else {
      list = fs.findFolder(current.name).children;
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((item) => item.name.toLowerCase().includes(q));
    }
    // Projets phares (étoile) en tête ; tri stable, le reste garde son ordre.
    return [...list].sort(
      (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    );
  }, [current, query, fs]);

  const currentName =
    current.type === 'special' ? t(SPECIAL_VIEWS[current.id].labelKey) : current.name;

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

  // Étoile dorée signalant les projets phares dans les vues du Finder.
  const featuredStar = (className) => (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1.1 5.8L12 16.5l-5.3 2.8 1.1-5.8-4.3-4.1 5.9-.8z"
        fill="#ffd60a"
        stroke="#8a6d00"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Les entrées « dossier » portent le nom localisé issu de l'arborescence :
  // c'est ce nom qui sert de clé de navigation.
  const folderEntry = (key) => ({
    id: key,
    label: rootFolderName(fs, key),
    glyph: <FolderGlyph />,
    view: { type: 'folder', name: rootFolderName(fs, key) },
  });

  const sidebarFavorites = [
    {
      id: 'recents',
      label: t('sidebarRecents'),
      glyph: <ClockGlyph />,
      view: { type: 'special', id: 'recents' },
    },
    { id: 'airdrop', label: t('sidebarAirdrop'), glyph: <AirdropGlyph />, disabled: true },
    {
      id: 'desktop',
      label: t('sidebarDesktop'),
      glyph: <DesktopGlyph />,
      view: { type: 'special', id: 'desktop' },
    },
    folderEntry('documents'),
    folderEntry('images'),
    folderEntry('projects'),
    folderEntry('publications'),
  ];

  const isActive = (entry) =>
    entry.view &&
    ((entry.view.type === 'special' && current.type === 'special' && current.id === entry.view.id) ||
      (entry.view.type === 'folder' && current.type === 'folder' && current.name === entry.view.name));

  return (
    <div className={styles.finder}>
      <aside className={styles.sidebar}>
        <p className={styles.sidebarSection}>{t('sidebarFavorites')}</p>
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
        <p className={styles.sidebarSection}>{t('sidebarLocations')}</p>
        <button
          type="button"
          className={`${styles.sidebarItem} ${
            current.type === 'folder' && current.name === fs.FILE_TREE.name ? styles.active : ''
          }`}
          onClick={() => navigate({ type: 'folder', name: fs.FILE_TREE.name })}
        >
          <DesktopGlyph />
          {fs.FILE_TREE.name}
        </button>
        <button type="button" className={styles.sidebarItem} disabled>
          <CloudGlyph />
          {t('sidebarIcloud')}
        </button>
        <p className={styles.sidebarSection}>{t('sidebarTags')}</p>
        {[
          ['#ff453a', 'tagUrgent'],
          ['#ff9f0a', 'tagFreelance'],
          ['#30d158', 'tagPersonal'],
          ['#0a84ff', 'tagCv'],
        ].map(([color, key]) => (
          <button key={key} type="button" className={styles.sidebarItem} disabled>
            <span className={styles.tagDot} style={{ background: color }} />
            {t(key)}
          </button>
        ))}
      </aside>

      <div className={styles.main}>
        <div className={styles.toolbar}>
          <div className={styles.navButtons}>
            <button
              type="button"
              className={styles.toolButton}
              aria-label={t('ariaBack')}
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
              aria-label={t('ariaForward')}
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
            aria-label={t('ariaIconView')}
            onClick={() => setViewMode('grid')}
          >
            <GridGlyph />
          </button>
          <button
            type="button"
            className={`${styles.toolButton} ${viewMode === 'list' ? styles.activeView : ''}`}
            aria-label={t('ariaListView')}
            onClick={() => setViewMode('list')}
          >
            <ListGlyph />
          </button>
          <label className={styles.search}>
            <SearchGlyph />
            <input
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck={false}
            />
          </label>
        </div>

        <div className={styles.content} onClick={() => setSelected(null)}>
          {items.length === 0 ? (
            <p className={styles.empty}>{t('empty')}</p>
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
                  <span className={styles.gridIcon} title={item.featured ? t('featured') : undefined}>
                    {renderIcon(item)}
                    {item.featured && featuredStar(styles.gridStar)}
                  </span>
                  <span className={styles.gridLabel}>{item.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <table className={styles.list}>
              <thead>
                <tr>
                  <th>{t('columnName')}</th>
                  <th>{t('columnSize')}</th>
                  <th>{t('columnKind')}</th>
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
                      {item.featured && featuredStar(styles.listStar)}
                    </td>
                    <td>{item.size || '--'}</td>
                    <td>{t(KIND_KEYS[item.type === 'folder' ? 'folder' : item.extension] || 'kindDefault')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.statusBar}>
          <span>
            {t('statusItems', { n: items.length })}
            {selected ? t('statusSelected') : ''}
          </span>
          <span>{t('statusAvailable')}</span>
        </div>
      </div>
    </div>
  );
};

export default Finder;
