import * as fr from './cv';
import * as en from './cv.en';

// Sélecteur des données CV par langue (cv.js reste la source de vérité,
// cv.en.js son miroir traduit — mêmes exports, mêmes structures).
// On renvoie un objet simple : un namespace de module ne traverse pas la
// frontière serveur → client.
const toPlain = (mod) => ({
  profile: mod.profile,
  education: mod.education,
  certifications: mod.certifications,
  publications: mod.publications,
  languages: mod.languages,
  projects: mod.projects,
  aboutText: mod.aboutText,
  skillsData: mod.skillsData,
});

const CV = { fr: toPlain(fr), en: toPlain(en) };

export const getCvData = (locale) => CV[locale] || CV.fr;
