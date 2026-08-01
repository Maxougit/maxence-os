import * as cvFr from './cv';
import { localeTag } from '@/i18n/config';

// Chaînes propres au système de fichiers (dossiers, fichiers statiques,
// gabarit des fiches de publication). Les contenus venant de cv.js sont
// déjà localisés en amont via getCvData(locale).
const FS_STRINGS = {
  fr: {
    computerName: 'MacBook de Maxence',
    folderDocuments: 'Documents',
    folderImages: 'Images',
    folderProjects: 'Projets',
    folderPublications: 'Publications',
    cvPdfName: 'CV Leroux Maxence.pdf',
    cvPdfPath: '/files/CV-Leroux-Maxence-FR.pdf',
    cvPdfSize: '275 Ko',
    todoName: 'Todo.txt',
    todoPath: '/files/Todo.txt',
    aboutName: 'À propos de moi.txt',
    posterName: 'Poster scientifique — Pa1Llama.pdf',
    posterTitle: 'Poster scientifique — Pa1Llama',
    posterDescription:
      'Poster A0 : grands modèles de langages locaux pour la confidentialité des données.',
    videoName: 'Octopus — démo.mp4',
    videoTitle: 'Octopus — démonstration',
    videoDescription: "Démonstration vidéo d'Octopus, l'agent commercial IA de Maxadev.",
    referenceSuffix: 'Référence',
    fullTextSuffix: 'article complet',
    linksHeading: 'Liens',
    repoLink: 'Dépôt GitHub ↗',
    siteLink: 'Site en ligne ↗',
    pubReference: 'Référence',
    pubAuthors: 'Auteurs',
    pubConference: 'Conférence',
    pubPlaceDate: 'Lieu / date',
    pubLab: 'Laboratoire',
    pubContribution: 'Ma contribution',
    pubAbstract: 'Résumé',
    pubKeywords: 'Mots-clés',
    pubReadOnHal: "Consulter l'article sur HAL ↗",
    trashPasswords: 'mots_de_passe.txt (vide, promis)',
  },
  en: {
    computerName: "Maxence's MacBook",
    folderDocuments: 'Documents',
    folderImages: 'Pictures',
    folderProjects: 'Projects',
    folderPublications: 'Publications',
    cvPdfName: 'CV Maxence Leroux.pdf',
    cvPdfPath: '/files/CV-Maxence-Leroux-EN.pdf',
    cvPdfSize: '332 KB',
    todoName: 'Todo.txt',
    todoPath: '/files/Todo.en.txt',
    aboutName: 'About me.txt',
    posterName: 'Scientific poster — Pa1Llama.pdf',
    posterTitle: 'Scientific poster — Pa1Llama',
    posterDescription: 'A0 poster: local large language models for data privacy.',
    videoName: 'Octopus — demo.mp4',
    videoTitle: 'Octopus — demonstration',
    videoDescription: "Video demonstration of Octopus, Maxadev's AI sales agent.",
    referenceSuffix: 'Reference',
    fullTextSuffix: 'full paper',
    linksHeading: 'Links',
    repoLink: 'GitHub repository ↗',
    siteLink: 'Live site ↗',
    pubReference: 'Reference',
    pubAuthors: 'Authors',
    pubConference: 'Conference',
    pubPlaceDate: 'Place / date',
    pubLab: 'Laboratory',
    pubContribution: 'My contribution',
    pubAbstract: 'Abstract',
    pubKeywords: 'Keywords',
    pubReadOnHal: 'Read the paper on HAL ↗',
    trashPasswords: 'passwords.txt (empty, promise)',
  },
};

// Ajoute une section « Liens » homogène aux fiches projet qui en déclarent.
const withProjectLinks = (project, s) => {
  const links = [
    project.repository && `- [${s.repoLink}](${project.repository})`,
    project.website && `- [${s.siteLink}](${project.website})`,
  ].filter(Boolean);
  return links.length
    ? `${project.content}\n\n## ${s.linksHeading}\n${links.join('\n')}`
    : project.content;
};

// Fiche Markdown d'une publication, générée depuis les données structurées.
const publicationMarkdown = (publication, s, tag) => `# ${publication.title}

*${publication.titleFr}*

## ${s.pubReference}
- **${s.pubAuthors}** : ${publication.authors.join(', ')}
- **${s.pubConference}** : ${publication.venueLong} — ${publication.venue}
- **${s.pubPlaceDate}** : ${publication.location}, ${new Date(publication.date).toLocaleDateString(
  tag,
  { day: 'numeric', month: 'long', year: 'numeric' }
)}
- **${s.pubLab}** : ${publication.lab}
- **HAL** : [${publication.halId}](${publication.url}) — ${publication.licence}

## ${s.pubContribution}
${publication.contribution}
→ [${publication.repository}](${publication.repository})

## ${s.pubAbstract}
${publication.abstract}

## ${s.pubKeywords}
${publication.keywords.join(' · ')}

[${s.pubReadOnHal}](${publication.url})`;

// Arborescence virtuelle affichée dans le Finder, le Bureau et Spotlight.
// Un fichier a soit un `path` (fichier réel dans /public), soit un `content`
// inline. La fabrique produit l'arborescence dans la langue demandée.
export const buildFileSystem = (cv, locale = 'fr') => {
  const s = FS_STRINGS[locale] || FS_STRINGS.fr;
  const tag = localeTag(locale);
  const { projects, publications, aboutText } = cv;

  const FILES = {
    cvPdf: {
      id: 101,
      type: 'file',
      extension: 'pdf',
      name: s.cvPdfName,
      path: s.cvPdfPath,
      size: s.cvPdfSize,
    },
    portrait: {
      id: 104,
      type: 'file',
      extension: 'jpg',
      name: 'portrait.jpg',
      path: '/images/portrait.jpg',
      size: '112 Ko',
    },
    todo: {
      id: 103,
      type: 'file',
      extension: 'txt',
      name: s.todoName,
      path: s.todoPath,
      size: '1 Ko',
    },
    about: {
      id: 105,
      type: 'file',
      extension: 'txt',
      name: s.aboutName,
      content: aboutText,
      size: '2 Ko',
    },
    posterPa1llama: {
      id: 107,
      type: 'file',
      extension: 'pdf',
      name: s.posterName,
      title: s.posterTitle,
      description: s.posterDescription,
      path: '/files/poster-pa1llama.pdf',
      size: '898 Ko',
    },
    chatbotCommercialVideo: {
      id: 106,
      type: 'file',
      extension: 'mp4',
      featured: true,
      name: s.videoName,
      title: s.videoTitle,
      description: s.videoDescription,
      path: '/videos/maxadev-promo.mp4',
      size: '14,8 Mo',
    },
    ...Object.fromEntries(
      projects.map((project, index) => [
        project.slug,
        {
          id: 110 + index,
          type: 'file',
          extension: 'md',
          featured: Boolean(project.featured),
          name: project.name,
          content: withProjectLinks(project, s),
          size: '3 Ko',
        },
      ])
    ),
    // Deux fichiers par publication : la fiche de référence (générée) et le
    // texte intégral (fichier statique, chargé à la demande — hors bundle JS).
    ...Object.fromEntries(
      publications.flatMap((publication, index) => [
        [
          publication.id,
          {
            id: 140 + index * 2,
            type: 'file',
            extension: 'md',
            name: `${publication.venue} — ${s.referenceSuffix}.md`,
            content: publicationMarkdown(publication, s, tag),
            size: '4 Ko',
          },
        ],
        [
          `${publication.id}-fulltext`,
          {
            id: 141 + index * 2,
            type: 'file',
            extension: 'md',
            name: `${publication.title.split(':')[0].trim()} — ${s.fullTextSuffix}.md`,
            path: publication.fullTextPath,
            size: '26 Ko',
          },
        ],
      ])
    ),
  };

  const FILE_TREE = {
    type: 'folder',
    name: s.computerName,
    children: [
      {
        type: 'folder',
        name: s.folderDocuments,
        children: [FILES.cvPdf, FILES.todo],
      },
      {
        type: 'folder',
        name: s.folderImages,
        children: [FILES.portrait],
      },
      {
        type: 'folder',
        name: s.folderProjects,
        children: [
          ...projects.map((p) => FILES[p.slug]),
          FILES.posterPa1llama,
          FILES.chatbotCommercialVideo,
        ],
      },
      {
        type: 'folder',
        name: s.folderPublications,
        children: publications.flatMap((p) => [FILES[p.id], FILES[`${p.id}-fulltext`]]),
      },
      FILES.about,
    ],
  };

  const DESKTOP_FILES = [FILES.cvPdf, FILES.about];

  const TRASH_FILES = [
    { id: 901, type: 'file', extension: 'zip', name: 'php4_legacy.zip', size: '666 Ko' },
    { id: 902, type: 'file', extension: 'css', name: 'ie11_support.css', size: '13 Ko' },
    {
      id: 903,
      type: 'file',
      extension: 'txt',
      name: s.trashPasswords,
      size: '0 Ko',
    },
  ];

  const findFolder = (name) => {
    if (!name || name === FILE_TREE.name) return FILE_TREE;
    const stack = [FILE_TREE];
    while (stack.length) {
      const node = stack.pop();
      if (node.type === 'folder') {
        if (node.name === name) return node;
        stack.push(...node.children.filter((c) => c.type === 'folder'));
      }
    }
    return FILE_TREE;
  };

  const allFiles = () => {
    const files = [];
    const walk = (node) => {
      if (node.type === 'file') files.push(node);
      else node.children.forEach(walk);
    };
    walk(FILE_TREE);
    return files;
  };

  return { FILES, FILE_TREE, DESKTOP_FILES, TRASH_FILES, findFolder, allFiles };
};

// Exports historiques (français) : conservés pour les consommateurs non
// encore branchés sur le contexte i18n.
const frFs = buildFileSystem(cvFr, 'fr');
export const FILES = frFs.FILES;
export const FILE_TREE = frFs.FILE_TREE;
export const DESKTOP_FILES = frFs.DESKTOP_FILES;
export const TRASH_FILES = frFs.TRASH_FILES;
export const findFolder = frFs.findFolder;
export const allFiles = frFs.allFiles;
