'use client';
import { createContext, useContext, useMemo } from 'react';
import { buildFileSystem } from './filesystem';

// Données localisées de l'OS simulé : le CV (sérialisé depuis le serveur, donc
// une seule langue dans le bundle) et l'arborescence du Finder qui en dérive.
// Les chaînes d'interface, elles, passent par next-intl (useTranslations).
const SiteDataContext = createContext(null);

export function SiteDataProvider({ locale, cv, children }) {
  const value = useMemo(
    () => ({ locale, cv, fs: buildFileSystem(cv, locale) }),
    [locale, cv]
  );
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export const useSiteData = () => useContext(SiteDataContext);
