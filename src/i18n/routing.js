import { defineRouting } from 'next-intl/routing';
import { LOCALES, DEFAULT_LOCALE } from './config';

// Routage linguistique : chaque langue a son préfixe (`/fr`, `/en`) et la
// racine redirige vers le français.
// NB : le mode « as-needed » (français servi à la racine sans préfixe) produit
// une boucle de redirection en build standalone avec Next 16 — vérifié en
// exécutant le serveur de production. On reste donc sur des préfixes explicites.
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
  localeDetection: false,
});
