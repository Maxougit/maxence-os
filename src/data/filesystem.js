import { projects, publications, aboutText } from './cv';

// Ajoute une section « Liens » homogène aux fiches projet qui en déclarent.
const withProjectLinks = (project) => {
  const links = [
    project.repository && `- [Dépôt GitHub ↗](${project.repository})`,
    project.website && `- [Site en ligne ↗](${project.website})`,
  ].filter(Boolean);
  return links.length ? `${project.content}\n\n## Liens\n${links.join('\n')}` : project.content;
};

// Fiche Markdown d'une publication, générée depuis les données structurées.
const publicationMarkdown = (publication) => `# ${publication.title}

*${publication.titleFr}*

## Référence
- **Auteurs** : ${publication.authors.join(', ')}
- **Conférence** : ${publication.venueLong} — ${publication.venue}
- **Lieu / date** : ${publication.location}, ${new Date(publication.date).toLocaleDateString(
  'fr-FR',
  { day: 'numeric', month: 'long', year: 'numeric' }
)}
- **Laboratoire** : ${publication.lab}
- **HAL** : [${publication.halId}](${publication.url}) — ${publication.licence}

## Ma contribution
${publication.contribution}
→ [${publication.repository}](${publication.repository})

## Résumé
${publication.abstract}

## Mots-clés
${publication.keywords.join(' · ')}

[Consulter l'article sur HAL ↗](${publication.url})`;

// Arborescence virtuelle affichée dans le Finder, le Bureau et Spotlight.
// Un fichier a soit un `path` (fichier réel dans /public), soit un `content` inline.

export const FILES = {
  cvPdf: {
    id: 101,
    type: 'file',
    extension: 'pdf',
    name: 'CV Leroux Maxence.pdf',
    path: '/files/CV-Leroux-Maxence-FR.pdf',
    size: '184 Ko',
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
    name: 'Todo.txt',
    path: '/files/Todo.txt',
    size: '1 Ko',
  },
  about: {
    id: 105,
    type: 'file',
    extension: 'txt',
    name: 'À propos de moi.txt',
    content: aboutText,
    size: '2 Ko',
  },
  posterPa1llama: {
    id: 107,
    type: 'file',
    extension: 'pdf',
    name: 'Poster scientifique — Pa1Llama.pdf',
    title: 'Poster scientifique — Pa1Llama',
    description:
      'Poster A0 : grands modèles de langages locaux pour la confidentialité des données.',
    path: '/files/poster-pa1llama.pdf',
    size: '898 Ko',
  },
  chatbotCommercialVideo: {
    id: 106,
    type: 'file',
    extension: 'mp4',
    featured: true,
    name: 'Octopus — démo.mp4',
    title: 'Octopus — démonstration',
    description: "Démonstration vidéo d'Octopus, l'agent commercial IA de Maxadev.",
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
        content: withProjectLinks(project),
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
          name: `${publication.venue} — Référence.md`,
          content: publicationMarkdown(publication),
          size: '4 Ko',
        },
      ],
      [
        `${publication.id}-fulltext`,
        {
          id: 141 + index * 2,
          type: 'file',
          extension: 'md',
          name: `${publication.title.split(':')[0].trim()} — article complet.md`,
          path: publication.fullTextPath,
          size: '26 Ko',
        },
      ],
    ])
  ),
};

export const FILE_TREE = {
  type: 'folder',
  name: 'MacBook de Maxence',
  children: [
    {
      type: 'folder',
      name: 'Documents',
      children: [FILES.cvPdf, FILES.todo],
    },
    {
      type: 'folder',
      name: 'Images',
      children: [FILES.portrait],
    },
    {
      type: 'folder',
      name: 'Projets',
      children: [
        ...projects.map((p) => FILES[p.slug]),
        FILES.posterPa1llama,
        FILES.chatbotCommercialVideo,
      ],
    },
    {
      type: 'folder',
      name: 'Publications',
      children: publications.flatMap((p) => [FILES[p.id], FILES[`${p.id}-fulltext`]]),
    },
    FILES.about,
  ],
};

export const DESKTOP_FILES = [FILES.cvPdf, FILES.about];

export const TRASH_FILES = [
  { id: 901, type: 'file', extension: 'zip', name: 'php4_legacy.zip', size: '666 Ko' },
  { id: 902, type: 'file', extension: 'css', name: 'ie11_support.css', size: '13 Ko' },
  {
    id: 903,
    type: 'file',
    extension: 'txt',
    name: 'mots_de_passe.txt (vide, promis)',
    size: '0 Ko',
  },
];

export const findFolder = (name) => {
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

export const allFiles = () => {
  const files = [];
  const walk = (node) => {
    if (node.type === 'file') files.push(node);
    else node.children.forEach(walk);
  };
  walk(FILE_TREE);
  return files;
};
