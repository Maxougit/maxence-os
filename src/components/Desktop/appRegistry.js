import React from 'react';
import dynamic from 'next/dynamic';
import { FILES } from '@/data/filesystem';
import { profile } from '@/data/cv';
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
// ---------------------------------------------------------------------------

export const APPS = {
  finder: {
    name: 'Finder',
    defaultSize: { width: 780, height: 500 },
    title: (options) => options?.folder || 'MacBook de Maxence',
    render: (api, options) => <Finder openFile={api.openFile} initialFolder={options?.folder} />,
  },
  terminal: {
    name: 'Terminal',
    defaultSize: { width: 660, height: 430 },
    darkChrome: true,
    title: () => 'maxence — -zsh — 96×24',
    render: () => <Terminal />,
  },
  preview: {
    name: 'Aperçu',
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
    name: 'Base de données',
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
    name: 'À propos',
    defaultSize: { width: 470, height: 480 },
    title: () => 'À propos de ce Mac',
    render: (api) => <AboutMac onOpenCv={() => api.openFile(FILES.cvPdf)} />,
  },
  trash: {
    name: 'Corbeille',
    defaultSize: { width: 480, height: 380 },
    title: () => 'Corbeille',
    render: () => <Trash />,
  },
};

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

export const buildDockItems = (api) => [
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
    name: 'CV — Aperçu',
    icon: <PreviewIcon />,
    windowId: `file-${FILES.cvPdf.id}`,
    onClick: () => api.openFile(FILES.cvPdf),
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: <NotesIcon />,
    appId: 'notes',
    onClick: () => api.openFile(FILES.about),
  },
  {
    id: 'database',
    name: 'Base de données',
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
    name: 'Me contacter',
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
    name: 'Corbeille',
    icon: <TrashIcon full />,
    appId: 'trash',
    onClick: () => api.openApp('trash'),
  },
];
