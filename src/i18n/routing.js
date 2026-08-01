import { defineRouting } from 'next-intl/routing';
import { LOCALES, DEFAULT_LOCALE } from './config';

// Source de vérité du routage linguistique : `/` sert le français,
// `/en` l'anglais. Pas de détection automatique (URL = état, cache CDN sain).
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeDetection: false,
});
