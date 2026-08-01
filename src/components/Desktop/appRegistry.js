import React from 'react';
import dynamic from 'next/dynamic';
import {
  FinderIcon,
  LaunchpadIcon,
  TerminalAppIcon,
  PreviewIcon,
  NotesIcon,
  DatabaseIcon,
  GameIcon,
  MailIcon,
  LinkedInIcon,
  SafariIcon,
  TrashIcon,
} from '@/components/Icons/AppIcons';

// Chargement à la demande : chaque app devient un chunk séparé, chargé quand
// sa fenêtre s'ouvre. Ça sort notamment Three.js (SkillsUniverse → Database)
// du bundle initial de la landing. Ces fenêtres n'apparaissent qu'après une
// interaction client, donc pas de rendu serveur (ssr: false).
const AppLoading = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }}
  >
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: '2.5px solid var(--mac-border)',
        borderTopColor: 'var(--mac-accent)',
        animation: 'mac-spin 0.8s linear infinite',
      }}
    />
  </div>
);

const lazyApp = (loader) => dynamic(loader, { ssr: false, loading: AppLoading });

const Terminal = lazyApp(() => import('@/components/Application/Terminal'));
const Finder = lazyApp(() => import('@/components/Application/Finder'));
const Viewer = lazyApp(() => import('@/components/Application/Viewer'));
const Database = lazyApp(() => import('@/components/Application/Database'));
const ServerRescue = lazyApp(() => import('@/components/Application/ServerRescue'));
const AboutMac = lazyApp(() => import('@/components/Application/AboutMac'));
const Trash = lazyApp(() => import('@/components/Application/Trash'));
const Safari = lazyApp(() => import('@/components/Application/Safari'));

// ---------------------------------------------------------------------------
// Applications : une entrée par « app » au sens macOS (nom dans la barre de
// menus, fenêtre, indicateur dans le Dock).
//
// Ce module n'est pas un composant React : il ne peut pas appeler de hook.
// Les libellés traduits arrivent donc par une fabrique, à qui l'appelant passe
// le traducteur RACINE de next-intl (`useTranslations()`, clés complètes) et le
// système de fichiers déjà localisé. L'API `render(api, options)` est inchangée.
// ---------------------------------------------------------------------------

export const buildApps = ({ t, fs }) => ({
  finder: {
    name: 'Finder',
    defaultSize: { width: 780, height: 500 },
    // Le nom de la racine (« MacBook de Maxence ») vient du système de fichiers.
    title: (options) => options?.folder || fs.FILE_TREE.name,
    render: (api, options) => <Finder openFile={api.openFile} initialFolder={options?.folder} />,
  },
  terminal: {
    name: 'Terminal',
    defaultSize: { width: 660, height: 430 },
    darkChrome: true,
    title: () => t('app.terminalWindowTitle'),
    render: () => <Terminal />,
  },
  preview: {
    name: t('app.previewName'),
    defaultSize: { width: 540, height: 720 },
    title: (options) => options.file.name,
    render: (api, options) => <Viewer file={options.file} />,
  },
  notes: {
    name: 'Notes',
    defaultSize: { width: 500, height: 440 },
    title: (options) => options.file.name,
    render: (api, options) => <Viewer file={options.file} />,
  },
  database: {
    name: t('app.databaseName'),
    defaultSize: { width: 700, height: 580 },
    darkChrome: true,
    title: () => 'MAXENCE.DB — Neural Skill Core',
    render: () => <Database />,
  },
  rescue: {
    name: 'Server Rescue',
    defaultSize: { width: 640, height: 560 },
    title: () => 'Server Rescue',
    render: () => <ServerRescue />,
  },
  safari: {
    name: 'Safari',
    defaultSize: { width: 900, height: 620 },
    title: () => 'Safari',
    render: (api, options) => (
      <Safari initialUrl={options?.url} navRef={api.safariNav} openExternal={api.openLink} />
    ),
  },
  about: {
    name: t('app.aboutName'),
    defaultSize: { width: 470, height: 480 },
    title: () => t('app.aboutWindowTitle'),
    render: (api) => <AboutMac onOpenCv={() => api.openFile(fs.FILES.cvPdf)} />,
  },
  trash: {
    name: t('app.trashName'),
    defaultSize: { width: 480, height: 380 },
    title: () => t('app.trashWindowTitle'),
    render: () => <Trash />,
  },
});

export const appIdForFile = (file) =>
  ['txt', 'md'].includes(file.extension) ? 'notes' : 'preview';

export const sizeForFile = (file) => {
  if (file.extension === 'pdf') return { width: 540, height: 720 };
  if (file.extension === 'md') return { width: 920, height: 660 };
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(file.extension)) {
    return { width: 760, height: 560 };
  }
  if (file.extension === 'mp4') return { width: 900, height: 600 };
  return { width: 500, height: 440 };
};

// ---------------------------------------------------------------------------
// Dock
// ---------------------------------------------------------------------------

// Même contrat que buildApps : `t` est le traducteur racine, `fs` et `profile`
// viennent du contexte de données localisées.
export const buildDockItems = (api, { t, fs, profile }) => [
  {
    id: 'finder',
    name: 'Finder',
    icon: <FinderIcon />,
    appId: 'finder',
    onClick: () => api.openApp('finder'),
  },
  {
    id: 'launchpad',
    name: 'Launchpad',
    icon: <LaunchpadIcon />,
    onClick: () => api.openSpotlight(),
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: <TerminalAppIcon />,
    appId: 'terminal',
    onClick: () => api.openApp('terminal'),
  },
  {
    id: 'cv',
    name: t('dock.cv'),
    icon: <PreviewIcon />,
    windowId: `file-${fs.FILES.cvPdf.id}`,
    onClick: () => api.openFile(fs.FILES.cvPdf),
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: <NotesIcon />,
    appId: 'notes',
    onClick: () => api.openFile(fs.FILES.about),
  },
  {
    id: 'database',
    name: t('dock.database'),
    icon: <DatabaseIcon />,
    appId: 'database',
    onClick: () => api.openApp('database'),
  },
  {
    id: 'rescue',
    name: 'Server Rescue',
    icon: <GameIcon />,
    appId: 'rescue',
    onClick: () => api.openApp('rescue'),
  },
  { type: 'separator' },
  {
    id: 'mail',
    name: t('common.contactMe'),
    icon: <MailIcon />,
    badge: '1',
    onClick: () => api.openLink(`mailto:${profile.email}`),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <LinkedInIcon />,
    onClick: () => api.openSafari(profile.linkedin),
  },
  {
    id: 'safari',
    name: 'Safari',
    icon: <SafariIcon />,
    appId: 'safari',
    onClick: () => api.openSafari(),
  },
  { type: 'separator' },
  {
    id: 'trash',
    name: t('dock.trash'),
    icon: <TrashIcon full />,
    appId: 'trash',
    onClick: () => api.openApp('trash'),
  },
];
