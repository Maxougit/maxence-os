// Utilitaires de langue partagés, volontairement sans dépendance à next-intl :
// ce module est importé par la couche données (filesystem) et par les tests.
// Le routage, lui, vit dans routing.js.
export const LOCALES = ['fr', 'en'];
export const DEFAULT_LOCALE = 'fr';

export const LOCALE_LABELS = {
  fr: 'Français',
  en: 'English',
};

// Chemin racine d'une langue (chaque langue a son préfixe).
export const localeHref = (locale) => `/${locale}`;

// Code BCP 47 utilisé pour les formats de date/heure.
export const localeTag = (locale) => (locale === 'fr' ? 'fr-FR' : 'en-US');
