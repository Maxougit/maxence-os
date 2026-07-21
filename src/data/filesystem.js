import { projects, aboutText } from './cv';

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
  chatbotCommercialVideo: {
    id: 106,
    type: 'file',
    extension: 'mp4',
    name: 'Chatbot commercial — Maxadev.mp4',
    title: 'Chatbot commercial — Maxadev',
    description: 'Vidéo de démonstration du projet de chatbot commercial.',
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
        name: project.name,
        content: project.content,
        size: '3 Ko',
      },
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
      children: [...projects.map((p) => FILES[p.slug]), FILES.chatbotCommercialVideo],
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
