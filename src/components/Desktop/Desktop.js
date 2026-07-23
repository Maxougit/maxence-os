'use client';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './Desktop.module.css';

import MenuBar from '@/components/MenuBar/MenuBar';
import Dock from '@/components/Dock/Dock';
import Window from '@/components/Windows/Windows';
import LockScreen from '@/components/LockScreen/LockScreen';
import Widgets from '@/components/Widgets/Widgets';
import ControlCenter from '@/components/ControlCenter/ControlCenter';
import Spotlight from '@/components/Spotlight/Spotlight';
import Notification from '@/components/Notification/Notification';
import ContextMenu from '@/components/ContextMenu/ContextMenu';

import { APPS, appIdForFile, sizeForFile, buildDockItems } from './appRegistry';
import { FILES, DESKTOP_FILES, allFiles } from '@/data/filesystem';
import { profile, skillsData } from '@/data/cv';
import {
  FinderIcon,
  TerminalAppIcon,
  PreviewIcon,
  NotesIcon,
  DatabaseIcon,
  GameIcon,
  TrashIcon,
  SettingsIcon,
  FolderIcon,
  FileIcon,
  MailIcon,
  LinkedInIcon,
  SafariIcon,
} from '@/components/Icons/AppIcons';

const WALLPAPERS = [
  { id: 'sonoma', style: { backgroundImage: 'url(/wp.webp)' } },
  {
    id: 'tahoe',
    style: {
      background:
        'radial-gradient(130% 110% at 15% 90%, #1c4d7c 0%, #0d2b4e 45%, #071527 100%)',
    },
  },
  {
    id: 'sunset',
    style: {
      background: 'linear-gradient(150deg, #ff9a56 0%, #d6366c 48%, #4a1d6e 100%)',
    },
  },
  {
    id: 'aurora',
    style: {
      background:
        'linear-gradient(160deg, #003b46 0%, #07575b 35%, #2e8b57 70%, #66a182 100%)',
    },
  },
];

const APP_DOCK_IDS = {
  finder: 'finder',
  terminal: 'terminal',
  database: 'database',
  rescue: 'rescue',
  trash: 'trash',
  notes: 'notes',
  safari: 'safari',
};

const newFinderWindowId = () =>
  `finder-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`}`;

export default function Desktop() {
  const [lockState, setLockState] = useState('locked'); // locked | unlocking | unlocked
  const [windows, setWindows] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [brightness, setBrightness] = useState(100);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [widgetsVisible, setWidgetsVisible] = useState(true);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [bouncingId, setBouncingId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);

  const notificationShown = useRef(false);
  const bounceTimer = useRef(null);
  const bounceSeenRef = useRef(new Set());

  // Rebond dans le Dock à chaque NOUVELLE fenêtre (piloté par effet, jamais
  // pendant le render). Restaurer/réduire ne change pas l'ensemble des ids.
  useEffect(() => {
    const fresh = windows.filter((w) => !bounceSeenRef.current.has(w.id));
    bounceSeenRef.current = new Set(windows.map((w) => w.id));
    if (fresh.length === 0) return undefined;

    const opened = fresh[fresh.length - 1];
    const dockId =
      opened.id === `file-${FILES.cvPdf.id}` ? 'cv' : APP_DOCK_IDS[opened.appId];
    if (!dockId) return undefined;

    clearTimeout(bounceTimer.current);
    const raf = requestAnimationFrame(() => setBouncingId(dockId));
    bounceTimer.current = setTimeout(() => setBouncingId(null), 900);
    return () => cancelAnimationFrame(raf);
  }, [windows]);

  // ------------------------------------------------------------------
  // Thème / responsive
  // ------------------------------------------------------------------

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // ------------------------------------------------------------------
  // API fenêtres / apps (identité stable pour les closures des apps)
  // ------------------------------------------------------------------

  const api = useMemo(() => {
    const self = {};

    // Poignée impérative : permet au Dock/Spotlight de piloter le Safari déjà ouvert.
    self.safariNav = { current: null };

    self.openLink = (href) => {
      if (href.startsWith('mailto:')) window.location.href = href;
      else window.open(href, '_blank', 'noopener');
    };

    self.openSpotlight = () => setSpotlightOpen(true);

    self.openSafari = (url) => self.openApp('safari', { url });

    self.openApp = (appId, options = {}) => {
      const app = APPS[appId];
      if (!app) return;
      const instanceId = options.instanceId || appId;

      // Navigation d'un Safari déjà ouvert (auto-garde : no-op s'il est fermé,
      // la fenêtre neuve reçoit alors l'URL via options). Uniquement si une URL
      // est fournie, pour qu'un simple clic Dock ne réinitialise pas la page.
      if (appId === 'safari' && options.url) self.safariNav.current?.(options.url);

      setWindows((prev) => {
        const existing = prev.find((w) => w.id === instanceId);
        if (existing) {
          const rest = prev.filter((w) => w.id !== instanceId);
          return [
            ...rest,
            { ...existing, minimized: false, status: 'open', closeDeadline: undefined },
          ];
        }
        return [
          ...prev,
          {
            id: instanceId,
            appId,
            title: app.title(options),
            node: app.render(self, options),
            size: options.size || app.defaultSize,
            darkChrome: Boolean(app.darkChrome),
            minimized: false,
            status: 'opening',
          },
        ];
      });

      setTimeout(() => {
        setWindows((current) =>
          current.map((w) =>
            w.id === instanceId && w.status === 'opening' ? { ...w, status: 'open' } : w
          )
        );
      }, 380);
    };

    self.openFile = (file) => {
      self.openApp(appIdForFile(file), {
        instanceId: `file-${file.id}`,
        file,
        size: sizeForFile(file),
      });
    };

    return self;
  }, []);

  const closeWindow = useCallback((id) => {
    const closeDeadline = Date.now() + 210;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'closing', closeDeadline } : w))
    );
  }, []);

  const closingWindows = useMemo(
    () =>
      windows
        .filter((w) => w.status === 'closing' && w.closeDeadline)
        .map((w) => ({ id: w.id, closeDeadline: w.closeDeadline })),
    [windows]
  );

  useEffect(() => {
    const timers = closingWindows.map(({ id, closeDeadline }) =>
      setTimeout(() => {
        setWindows((current) =>
          current.filter(
            (w) =>
              w.id !== id ||
              w.status !== 'closing' ||
              w.closeDeadline !== closeDeadline
          )
        );
      }, Math.max(0, closeDeadline - Date.now()))
    );

    return () => timers.forEach(clearTimeout);
  }, [closingWindows]);

  const minimizeWindow = useCallback((id) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const focusWindow = useCallback((id) => {
    setWindows((prev) => {
      const index = prev.findIndex((w) => w.id === id);
      if (index === -1 || index === prev.length - 1) return prev;
      const next = [...prev];
      const [win] = next.splice(index, 1);
      return [...next, win];
    });
  }, []);

  const restoreWindow = useCallback((id) => {
    setWindows((prev) => {
      const index = prev.findIndex((w) => w.id === id);
      if (index === -1) return prev;
      const next = [...prev];
      const [win] = next.splice(index, 1);
      return [
        ...next,
        { ...win, minimized: false, status: 'open', closeDeadline: undefined },
      ];
    });
  }, []);

  const openNewFinder = useCallback(() => {
    api.openApp('finder', {
      instanceId: newFinderWindowId(),
    });
  }, [api]);

  const focusedWindow = useMemo(
    () => [...windows].reverse().find((w) => !w.minimized && w.status !== 'closing'),
    [windows]
  );

  // ------------------------------------------------------------------
  // Verrouillage / notification de bienvenue
  // ------------------------------------------------------------------

  const lock = useCallback(() => {
    setControlCenterOpen(false);
    setSpotlightOpen(false);
    setContextMenu(null);
    setCvOpen(false);
    setLockState('locked');
  }, []);

  // Scroll autorisé : PC déverrouillé (scroll libre vers le CV) OU mobile après
  // clic sur « Voir le CV ». L'écran verrouillé reste toujours figé.
  useEffect(() => {
    const scrollable = lockState === 'unlocked' && (!isMobile || cvOpen);
    document.documentElement.classList.toggle('scrollable', scrollable);
  }, [lockState, isMobile, cvOpen]);

  // Défile jusqu'au CV à l'ouverture ; remonte au bureau à la fermeture.
  useEffect(() => {
    if (cvOpen) {
      const raf = requestAnimationFrame(() =>
        document.getElementById('cv')?.scrollIntoView({ behavior: 'smooth' })
      );
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [cvOpen]);

  // Referme le CV (et re-fige sur mobile) quand on remonte tout en haut.
  useEffect(() => {
    if (!cvOpen) return undefined;
    let leftTop = false;
    const onScroll = () => {
      if (window.scrollY > 40) leftTop = true;
      else if (leftTop && window.scrollY <= 1) setCvOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [cvOpen]);

  const unlock = useCallback(() => {
    setLockState((state) => (state === 'locked' ? 'unlocking' : state));
  }, []);

  useEffect(() => {
    if (lockState !== 'unlocking') return;
    const timer = setTimeout(() => setLockState('unlocked'), 560);
    return () => clearTimeout(timer);
  }, [lockState]);

  useEffect(() => {
    if (lockState !== 'unlocked' || notificationShown.current) return;
    const timer = setTimeout(() => {
      notificationShown.current = true;
      setNotificationVisible(true);
    }, 1300);
    return () => clearTimeout(timer);
  }, [lockState]);

  // ------------------------------------------------------------------
  // Raccourcis clavier globaux
  // ------------------------------------------------------------------

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (
          lockState === 'unlocked' &&
          (e.metaKey || e.ctrlKey) &&
          e.altKey &&
          focusedWindow
        ) {
          e.preventDefault();
          closeWindow(focusedWindow.id);
          return;
        }
        setControlCenterOpen(false);
        setContextMenu(null);
        setSpotlightOpen(false);
        return;
      }

      if (lockState !== 'unlocked' || (!e.metaKey && !e.ctrlKey)) return;

      const key = e.key.toLowerCase();

      // Les deux raccourcis de session doivent passer avant le Cmd/Ctrl+Q simple.
      if (key === 'q' && (e.shiftKey || (e.metaKey && e.ctrlKey))) {
        e.preventDefault();
        lock();
        return;
      }

      const handledKeys = new Set(['h', 'k', 'm', 'n', 'o', 'q', 'w']);
      if (!handledKeys.has(key)) return;

      e.preventDefault();
      if (e.repeat) return;

      if (key === 'k') setSpotlightOpen((open) => !open);
      if (key === 'n') openNewFinder();
      if (key === 'o') api.openFile(FILES.cvPdf);
      if ((key === 'h' || key === 'm') && focusedWindow) {
        minimizeWindow(focusedWindow.id);
      }
      if (key === 'w' && focusedWindow) closeWindow(focusedWindow.id);
      if (key === 'q' && focusedWindow) {
        windows
          .filter((w) => w.appId === focusedWindow.appId)
          .forEach((w) => closeWindow(w.id));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [api, closeWindow, focusedWindow, lock, lockState, minimizeWindow, openNewFinder, windows]);

  // ------------------------------------------------------------------
  // Menus de la barre de menus
  // ------------------------------------------------------------------

  const appName = focusedWindow ? APPS[focusedWindow.appId].name : 'Finder';

  const menus = useMemo(() => {
    const noWindow = !focusedWindow;
    return [
      {
        id: 'apple',
        label: '',
        items: [
          { label: 'À propos de ce Mac', onSelect: () => api.openApp('about') },
          { divider: true },
          { label: 'Réglages Système…', onSelect: () => setControlCenterOpen(true) },
          { label: 'App Store…', disabled: true },
          { divider: true },
          { label: 'Éléments récents', disabled: true },
          { divider: true },
          {
            label: 'Forcer à quitter…',
            shortcut: '⌥⌘⎋',
            disabled: noWindow,
            onSelect: () => focusedWindow && closeWindow(focusedWindow.id),
          },
          { divider: true },
          { label: 'Suspendre l’activité', disabled: true },
          { label: 'Redémarrer…', onSelect: () => window.location.reload() },
          { label: 'Éteindre…', onSelect: lock },
          { divider: true },
          { label: 'Verrouiller l’écran', shortcut: '⌃⌘Q', onSelect: lock },
          { label: `Fermer la session ${profile.name.split(' ')[0]}…`, shortcut: '⇧⌘Q', onSelect: lock },
        ],
      },
      {
        id: 'app',
        label: appName,
        items: [
          { label: `À propos de ${appName}`, onSelect: () => api.openApp('about') },
          { divider: true },
          {
            label: `Masquer ${appName}`,
            shortcut: '⌘H',
            disabled: noWindow,
            onSelect: () => focusedWindow && minimizeWindow(focusedWindow.id),
          },
          { divider: true },
          {
            label: `Quitter ${appName}`,
            shortcut: '⌘Q',
            disabled: noWindow,
            onSelect: () =>
              focusedWindow &&
              windows
                .filter((w) => w.appId === focusedWindow.appId)
                .forEach((w) => closeWindow(w.id)),
          },
        ],
      },
      {
        id: 'file',
        label: 'Fichier',
        items: [
          { label: 'Nouvelle fenêtre Finder', shortcut: '⌘N', onSelect: openNewFinder },
          { label: 'Ouvrir le CV (PDF)', shortcut: '⌘O', onSelect: () => api.openFile(FILES.cvPdf) },
          { divider: true },
          {
            label: 'Fermer la fenêtre',
            shortcut: '⌘W',
            disabled: noWindow,
            onSelect: () => focusedWindow && closeWindow(focusedWindow.id),
          },
        ],
      },
      {
        id: 'edit',
        label: 'Édition',
        items: [
          { label: 'Annuler', shortcut: '⌘Z', disabled: true },
          { label: 'Rétablir', shortcut: '⇧⌘Z', disabled: true },
          { divider: true },
          { label: 'Couper', shortcut: '⌘X', disabled: true },
          { label: 'Copier', shortcut: '⌘C', disabled: true },
          { label: 'Coller', shortcut: '⌘V', disabled: true },
          { label: 'Tout sélectionner', shortcut: '⌘A', disabled: true },
        ],
      },
      {
        id: 'view',
        label: 'Présentation',
        items: [
          {
            label: widgetsVisible ? 'Masquer les widgets' : 'Afficher les widgets',
            onSelect: () => setWidgetsVisible((v) => !v),
          },
          {
            label: 'Modifier le fond d’écran',
            onSelect: () => setWallpaperIndex((i) => (i + 1) % WALLPAPERS.length),
          },
          { divider: true },
          {
            label: theme === 'dark' ? 'Apparence claire' : 'Apparence sombre',
            onSelect: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
          },
        ],
      },
      {
        id: 'go',
        label: 'Aller',
        items: [
          {
            label: 'Documents',
            onSelect: () => api.openApp('finder', { instanceId: 'finder-Documents', folder: 'Documents' }),
          },
          {
            label: 'Images',
            onSelect: () => api.openApp('finder', { instanceId: 'finder-Images', folder: 'Images' }),
          },
          {
            label: 'Projets',
            onSelect: () => api.openApp('finder', { instanceId: 'finder-Projets', folder: 'Projets' }),
          },
        ],
      },
      {
        id: 'window',
        label: 'Fenêtre',
        showChecks: true,
        items: [
          {
            label: 'Réduire',
            shortcut: '⌘M',
            disabled: noWindow,
            onSelect: () => focusedWindow && minimizeWindow(focusedWindow.id),
          },
          {
            label: 'Tout ramener au premier plan',
            disabled: windows.length === 0,
            onSelect: () =>
              setWindows((prev) => prev.map((w) => ({ ...w, minimized: false }))),
          },
          ...(windows.length > 0 ? [{ divider: true }] : []),
          ...windows.map((w) => ({
            label: w.title,
            checked: focusedWindow?.id === w.id,
            onSelect: () => restoreWindow(w.id),
          })),
        ],
      },
      {
        id: 'help',
        label: 'Aide',
        items: [
          { label: 'Aide Maxence OS', onSelect: () => api.openApp('about') },
          { label: 'Rechercher', shortcut: '⌘K', onSelect: () => setSpotlightOpen(true) },
          { divider: true },
          {
            label: 'Voir le CV en version texte',
            onSelect: () => setCvOpen(true),
          },
          {
            label: 'Télécharger le CV (PDF)',
            onSelect: () => api.openLink('/files/CV-Leroux-Maxence-FR.pdf'),
          },
        ],
      },
    ];
  }, [api, appName, focusedWindow, windows, widgetsVisible, theme, lock, closeWindow, minimizeWindow, openNewFinder, restoreWindow]);

  // ------------------------------------------------------------------
  // Dock
  // ------------------------------------------------------------------

  const dockItems = useMemo(() => {
    const items = buildDockItems(api);
    const enrichedItems = items.map((item) => {
      if (item.type === 'separator') return item;
      const running = item.windowId
        ? windows.some((w) => w.id === item.windowId)
        : item.appId
          ? windows.some((w) => w.appId === item.appId)
          : false;
      return { ...item, running };
    });

    // Sur téléphone, le Dock devient une barre d'accès rapide. Launchpad
    // (Spotlight) donne toujours accès à toutes les autres applications.
    if (isMobile) {
      const mobileDockIds = new Set(['finder', 'launchpad', 'cv', 'mail', 'safari']);
      return enrichedItems.filter(
        (item) => item.type !== 'separator' && mobileDockIds.has(item.id)
      );
    }

    return enrichedItems;
  }, [api, isMobile, windows]);

  // ------------------------------------------------------------------
  // Spotlight
  // ------------------------------------------------------------------

  const spotlightSources = useMemo(() => {
    const iconBox = (node) => <span style={{ width: 28, height: 28, display: 'flex' }}>{node}</span>;
    return [
      {
        category: 'Applications',
        suggested: true,
        items: [
          { id: 'finder', title: 'Finder', icon: iconBox(<FinderIcon />), run: () => api.openApp('finder') },
          { id: 'terminal', title: 'Terminal', icon: iconBox(<TerminalAppIcon />), run: () => api.openApp('terminal') },
          { id: 'cv', title: 'CV Leroux Maxence.pdf', subtitle: 'Aperçu', icon: iconBox(<PreviewIcon />), run: () => api.openFile(FILES.cvPdf) },
          { id: 'notes', title: 'Notes', icon: iconBox(<NotesIcon />), run: () => api.openFile(FILES.about) },
          { id: 'database', title: 'Base de données', subtitle: 'Compétences', icon: iconBox(<DatabaseIcon />), run: () => api.openApp('database') },
          { id: 'safari', title: 'Safari', subtitle: 'Navigateur', icon: iconBox(<SafariIcon />), run: () => api.openSafari() },
          { id: 'rescue', title: 'Server Rescue', subtitle: 'Jeu', icon: iconBox(<GameIcon />), run: () => api.openApp('rescue') },
          { id: 'settings', title: 'Réglages Système', icon: iconBox(<SettingsIcon />), run: () => setControlCenterOpen(true) },
          { id: 'trash', title: 'Corbeille', icon: iconBox(<TrashIcon full />), run: () => api.openApp('trash') },
        ],
      },
      {
        category: 'Fichiers',
        items: allFiles().map((file) => ({
          id: `file-${file.id}`,
          title: file.name,
          subtitle: file.size,
          icon: iconBox(<FileIcon extension={file.extension} />),
          run: () => api.openFile(file),
        })),
      },
      {
        category: 'Compétences',
        items: [
          ...skillsData.Programation,
          ...skillsData.Technologies,
          ...skillsData.Concepts,
        ].map((skill) => ({
          id: `skill-${skill.Name}`,
          title: skill.Name,
          subtitle: skill.Details.join(' · '),
          icon: iconBox(<DatabaseIcon />),
          run: () => api.openApp('database'),
        })),
      },
      {
        category: 'Expériences',
        items: skillsData.Experiences.map((exp) => ({
          id: `exp-${exp.Name}`,
          title: exp.Name,
          subtitle: exp.Details[0],
          icon: iconBox(<FolderIcon />),
          run: () => api.openApp('database'),
        })),
      },
      {
        category: 'Liens',
        items: [
          { id: 'mail', title: 'Me contacter', subtitle: profile.email, icon: iconBox(<MailIcon />), run: () => api.openLink(`mailto:${profile.email}`) },
          { id: 'linkedin', title: 'LinkedIn', subtitle: 'maxence-leroux123', icon: iconBox(<LinkedInIcon />), run: () => api.openSafari(profile.linkedin) },
          { id: 'maxadev', title: 'Maxadev', subtitle: 'maxadev.fr — freelance', icon: iconBox(<SafariIcon />), run: () => api.openSafari(profile.website) },
        ],
      },
    ];
  }, [api]);

  // ------------------------------------------------------------------
  // Bureau (icônes, clic droit, raccourcis widgets)
  // ------------------------------------------------------------------

  const desktopIconEntries = [
    ...DESKTOP_FILES.map((file) => ({
      id: `file-${file.id}`,
      label: file.name,
      icon: <FileIcon extension={file.extension} />,
      open: () => api.openFile(file),
    })),
    {
      id: 'folder-projets',
      label: 'Projets',
      icon: <FolderIcon />,
      open: () => api.openApp('finder', { instanceId: 'finder-Projets', folder: 'Projets' }),
    },
  ];

  const handleIconClick = (entry) => {
    if (isMobile || window.matchMedia('(hover: none)').matches) {
      entry.open();
      return;
    }
    setSelectedIcon(entry.id);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (lockState !== 'unlocked') return;
    const interactive = e.target.closest('section, nav, aside, [data-panel]');
    if (interactive) {
      setContextMenu(null);
      return;
    }
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const contextItems = [
    { label: 'Nouveau dossier', disabled: true },
    { label: 'Lire les informations', disabled: true },
    { divider: true },
    {
      label: 'Modifier le fond d’écran',
      onSelect: () => setWallpaperIndex((i) => (i + 1) % WALLPAPERS.length),
    },
    {
      label: widgetsVisible ? 'Masquer les widgets' : 'Afficher les widgets',
      onSelect: () => setWidgetsVisible((v) => !v),
    },
    { divider: true },
    { label: 'Ouvrir le Terminal', onSelect: () => api.openApp('terminal') },
    { label: 'Ouvrir Safari', onSelect: () => api.openSafari() },
    { label: 'Télécharger le CV (PDF)', onSelect: () => api.openLink('/files/CV-Leroux-Maxence-FR.pdf') },
    { divider: true },
    { label: 'Verrouiller l’écran', onSelect: lock },
  ];

  const handleShortcut = (id) => {
    if (id === 'cv') api.openFile(FILES.cvPdf);
    if (id === 'linkedin') api.openSafari(profile.linkedin);
    if (id === 'mail') api.openLink(`mailto:${profile.email}`);
    if (id === 'maxadev') api.openSafari(profile.website);
  };

  const wallpaper = WALLPAPERS[wallpaperIndex];
  const unlocked = lockState !== 'locked';

  // ------------------------------------------------------------------

  return (
    <div className={styles.shell} onContextMenu={handleContextMenu}>
      <div
        className={styles.wallpaper}
        style={wallpaper.style}
        onClick={() => setSelectedIcon(null)}
      />

      {unlocked && (
        <>
          <MenuBar
            menus={menus}
            onOpenSpotlight={() => setSpotlightOpen(true)}
            onToggleControlCenter={() => setControlCenterOpen((open) => !open)}
            controlCenterOpen={controlCenterOpen}
          />

          <main className={styles.desktopSurface} aria-label="Bureau Maxence OS">
            {widgetsVisible && <Widgets onShortcut={handleShortcut} />}

            <div className={styles.desktopIcons}>
              {desktopIconEntries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={`${styles.desktopIcon} ${
                    selectedIcon === entry.id ? styles.selected : ''
                  }`}
                  onClick={() => handleIconClick(entry)}
                  onDoubleClick={entry.open}
                >
                  <span className={styles.desktopIconImage}>{entry.icon}</span>
                  <span className={styles.desktopIconLabel}>{entry.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className={styles.scrollHint}
              onClick={() => setCvOpen(true)}
            >
              Voir le CV en version texte ↓
            </button>
          </main>
        </>
      )}

      {cvOpen && (
        <button type="button" className={styles.cvBack} onClick={() => setCvOpen(false)}>
          ↑ Retour à Maxence OS
        </button>
      )}

      {windows.map((win, index) => (
        <Window
          key={win.id}
          index={index}
          title={win.title}
          isFocused={focusedWindow?.id === win.id}
          status={win.status}
          minimized={win.minimized}
          darkChrome={win.darkChrome}
          defaultSize={win.size}
          isMobile={isMobile}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
        >
          {win.node}
        </Window>
      ))}

      {unlocked && <Dock items={dockItems} bouncingId={bouncingId} />}

      {controlCenterOpen && (
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 68 }}
          onPointerDown={() => setControlCenterOpen(false)}
        >
          <div data-panel onPointerDown={(e) => e.stopPropagation()}>
            <ControlCenter
              theme={theme}
              onThemeChange={setTheme}
              brightness={brightness}
              onBrightnessChange={setBrightness}
            />
          </div>
        </div>
      )}

      {spotlightOpen && (
        <Spotlight sources={spotlightSources} onClose={() => setSpotlightOpen(false)} />
      )}

      {notificationVisible && (
        <Notification
          appName="Maxence OS"
          title={`Bienvenue sur Maxence OS 👋`}
          body="CV interactif de Maxence Leroux. Explorez le Dock, ou ⌘K pour rechercher."
          icon={
            <Image
              src={profile.photo}
              alt=""
              width={38}
              height={38}
              style={{ width: 38, height: 38, objectFit: 'cover' }}
            />
          }
          onAction={() => api.openFile(FILES.cvPdf)}
          onDismiss={() => setNotificationVisible(false)}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextItems}
          onClose={() => setContextMenu(null)}
        />
      )}

      {brightness < 100 && (
        <div
          className={styles.brightnessOverlay}
          style={{ opacity: ((100 - brightness) / 100) * 0.72 }}
        />
      )}

      {lockState !== 'unlocked' && (
        <LockScreen
          wallpaperStyle={wallpaper.style}
          unlocking={lockState === 'unlocking'}
          onUnlock={unlock}
        />
      )}
    </div>
  );
}
