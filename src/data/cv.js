export const SITE_URL = 'https://cv.maxenceleroux.fr';

export const profile = {
  name: 'Maxence Leroux',
  jobTitle: 'Ingénieur informatique — Freelance (Maxadev)',
  description:
    "Ingénieur informatique diplômé du CESI (2025), freelance via Maxadev. Spécialisé en IA générative, architecture micro-services et DevOps (Kubernetes, CI/CD). Actuellement ingénieur LeadDev IA & DevOps chez ArcelorMittal Distribution Solutions.",
  email: 'contact@maxenceleroux.fr',
  linkedin: 'https://www.linkedin.com/in/maxence-leroux123/',
  website: 'https://maxadev.fr',
  location: 'Reims, France',
  photo: '/images/profil.jpg',
};

export const education = [
  {
    year: '2025',
    title: "Diplôme d'ingénieur en informatique",
    school: 'CESI — Reims (51)',
  },
  {
    year: '2020',
    title: 'BAC S — mention bien',
    school: 'Lycée Paul Claudel — Laon (02)',
  },
];

export const certifications = ['CCNAv7 (Cisco)'];

export const languages = [
  { name: 'Français', level: 'Langue natale' },
  { name: 'Anglais', level: 'TOEIC 850 (B2)' },
];

export const skillsData = {
  Programation: [
    {
      Name: 'C#',
      Details: ['.NET', 'WPF', 'WCF', 'API REST', 'ORM / LINQ'],
    },
    {
      Name: 'Python',
      Details: ['IA / Machine Learning', 'Data Analysis', 'OpenCV', 'Scripting'],
    },
    {
      Name: 'JavaScript / TypeScript',
      Details: ['React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express'],
    },
    {
      Name: 'C / C++',
      Details: ['App Development', 'Arduino / Embarqué'],
    },
    {
      Name: 'SQL',
      Details: ['SQL Server', 'Database Design', 'Optimization', 'Migration'],
    },
    {
      Name: 'PHP',
      Details: ['Symfony'],
    },
    {
      Name: 'HTML/CSS',
      Details: ['Web Design', 'Responsive Layouts', 'Tailwind'],
    },
  ],
  Technologies: [
    {
      Name: 'IA générative / LLM',
      Details: [
        'Azure OpenAI',
        'Claude',
        'Agents IA',
        'Model Context Protocol (MCP)',
        'Load balancing multi-LLM',
      ],
    },
    {
      Name: 'Kubernetes',
      Details: ['Azure Kubernetes Service (AKS)', 'Helm', 'Kustomize', 'Scalability'],
    },
    {
      Name: 'Docker',
      Details: ['Containerization', 'Microservices', 'Docker Compose'],
    },
    {
      Name: 'CI/CD & DevOps',
      Details: ['GitLab CI/CD', 'Infrastructure as Code', 'Tests de non-régression'],
    },
    {
      Name: 'Messaging & Data',
      Details: ['RabbitMQ', 'MongoDB', 'Solr', 'Elasticsearch'],
    },
    {
      Name: 'Observabilité',
      Details: ['Stack ELK', 'Kibana', 'Monitoring & alerting', 'Centreon'],
    },
    {
      Name: 'Linux & Sysadmin',
      Details: ['Ubuntu Server', 'Debian', 'Shell Scripting', 'Active Directory'],
    },
    {
      Name: 'Computer Vision',
      Details: ['YOLOv8', 'OpenCV', 'Label Studio', 'OCR'],
    },
    {
      Name: 'Git',
      Details: ['Version Control', 'Collaboration'],
    },
  ],
  Concepts: [
    {
      Name: 'Architecture applicative',
      Details: ['Micro-services', 'Messaging', 'Résilience', 'Tolérance aux pannes'],
    },
    {
      Name: 'Cybersécurité',
      Details: ['Chiffrement de données sensibles', 'ISO 27001', 'CNIL / RGPD'],
    },
    {
      Name: 'Networking',
      Details: ['LAN/WAN', 'Cisco Devices', 'CCNAv7'],
    },
    {
      Name: 'Big Data & BI',
      Details: ['Data Analysis', 'ETL Processes', 'Power BI'],
    },
    {
      Name: 'Self-Hosting & décentralisation',
      Details: ['Auto-hébergement', 'Blockchain', 'Web 3.0'],
    },
    {
      Name: 'Gestion de projet',
      Details: ['Méthode Agile', 'Encadrement technique'],
    },
  ],
  Experiences: [
    {
      Name: 'ArcelorMittal Distribution Solutions',
      Details: [
        'Ingénieur LeadDev IA & DevOps — freelance (depuis sept. 2025)',
        'Référent architecture applicative, GenAI et industrialisation de la plateforme Quotes Automation : agents IA conversationnels, orchestration MCP, Kubernetes AKS, CI/CD, observabilité',
        'Alternance BAC+5 puis CDD — développement & architecture applicative (juil. 2024 – sept. 2025)',
        "Quotes Automation : automatisation de devis SAP par IA — micro-services Docker, RabbitMQ, MongoDB, Solr, Azure OpenAI, load balancer multi-LLM, stack ELK",
      ],
    },
    {
      Name: 'Maxadev — Freelance & consultant',
      Details: [
        'Auto-entrepreneur — ingénieur informatique (depuis août 2025)',
        'Conseil et développement de logiciels — maxadev.fr',
      ],
    },
    {
      Name: 'STELLANTIS — Innolab Trnava (Slovaquie)',
      Details: [
        'Stage BAC+4 — développement web, IA & optimisation des processus industriels (sept. 2023 – févr. 2024)',
        'Computer vision (YOLOv8, OpenCV), monitoring IA qualité, Power BI, plateformes internes (Portal GD, eKaizen)',
      ],
    },
    {
      Name: "AXON'CABLE — AxoCare (e-santé)",
      Details: [
        'Stage BAC+3 puis CDD — développeur logiciels (janv. – juil. 2023)',
        "Interopérabilité INSi (carte Vitale / CPS), migration de base médicale, chiffrement de données sensibles (ISO 27001), modernisation WPF — C#, .NET, SQL, LINQ",
      ],
    },
    {
      Name: "E.P.S.M.D de l'Aisne",
      Details: [
        'Stage BAC+2 & CDD — pôle informatique / DSIO (2021 – 2022)',
        'Supervision réseau Centreon, plateforme e-learning Moodle sous Docker, déploiement et renouvellement du parc informatique',
      ],
    },
    {
      Name: 'Décathlon logistique',
      Details: ['Agent logistique — CDD (été 2020), préparation et gestion des flux'],
    },
  ],
};
