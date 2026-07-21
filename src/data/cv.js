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
  photo: '/images/portrait.jpg',
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

export const projects = [
  {
    slug: 'quotes-automation',
    name: 'Quotes Automation.md',
    title: 'Quotes Automation — ArcelorMittal',
    content: `# Quotes Automation — ArcelorMittal

Plateforme d'automatisation de devis SAP par IA générative.

## Rôle
Référent architecture applicative, GenAI et industrialisation
(LeadDev IA & DevOps, freelance depuis sept. 2025).

## Stack
- Agents IA conversationnels, orchestration MCP
- Azure OpenAI + load balancer multi-LLM
- Micro-services Docker sur Kubernetes (AKS)
- RabbitMQ, MongoDB, Solr
- CI/CD GitLab, stack ELK (observabilité)`,
  },
  {
    slug: 'maxence-os',
    name: 'Maxence OS.md',
    title: 'Maxence OS — ce site',
    content: `# Maxence OS

Le site que vous êtes en train d'utiliser :
un CV interactif qui reproduit macOS dans le navigateur.

## Stack
- Next.js (App Router) + React
- Tailwind CSS, animations CSS sur mesure
- Three.js (univers de compétences)
- Docker + CI/CD, auto-hébergé

## Détails
Fenêtres draggables, Dock avec magnification, Spotlight,
Control Center, terminal avec easter eggs (essayez « snake »).`,
  },
  {
    slug: 'homelab-self-hosting',
    name: 'Homelab — auto-hébergement & IA locale.md',
    title: 'Homelab — auto-hébergement et IA locale',
    content: `# Homelab — auto-hébergement et IA locale

Projet personnel maintenu sur un serveur Unraid pour expérimenter,
héberger mes données et exploiter des services sans dépendre
systématiquement de plateformes cloud tierces.

![Architecture du homelab auto-hébergé](/images/projects/homelab-architecture.svg)

_Vue d'ensemble simplifiée — les adresses et ports internes ne sont pas exposés._

## Services auto-hébergés
- Nextcloud, MariaDB et Collabora CODE pour le cloud collaboratif
- Vaultwarden pour la gestion des secrets
- Jellyfin et Homebridge pour les usages multimédia et domotiques
- Nginx Proxy Manager comme reverse proxy
- WireGuard avec WG-Easy pour l'accès distant sécurisé
- Uptime Kuma pour la disponibilité et Duplicati pour les sauvegardes

## IA locale
Déploiement d'Ollama en conteneur afin d'exécuter et tester des
modèles de langage localement, avec persistance des modèles et
sans dépendre d'une API externe pour chaque expérimentation.

## Exploitation
Conteneurs Docker, réseaux dédiés, volumes persistants,
supervision, mises à jour et gestion du cycle de vie des services.`,
  },
  {
    slug: 'kubernetes-vm-lab',
    name: 'Cluster Kubernetes de test sur VM.md',
    title: 'Cluster Kubernetes de test sur machines virtuelles',
    content: `# Cluster Kubernetes de test sur machines virtuelles

Projet personnel réalisé en complément de mes activités chez
ArcelorMittal : déploiement d'un environnement Kubernetes
multi-nœud entièrement isolé sur mon homelab Unraid.

![Architecture du cluster Kubernetes de test](/images/projects/kubernetes-lab.svg)

_Un laboratoire Kubernetes isolé, virtualisé sur le serveur personnel._

## Infrastructure
- Cluster de test composé de trois VM Ubuntu dédiées
- 4 vCPU et 3 Go de mémoire attribués à chaque nœud
- Virtualisation et allocation des ressources pilotées par Unraid
- VM Ubuntu séparée pour les expérimentations Docker
- VM Debian dédiées aux essais GitLab et GitLab Runner

## Objectifs du lab
- Reproduire une architecture Kubernetes multi-nœud à domicile
- Tester déploiements, configuration et cycle de vie des workloads
- Expérimenter les scénarios de panne, reprise et évolution du cluster
- Valider des pratiques CI/CD et d'administration Linux hors production

Stack : Unraid / KVM, Ubuntu, Kubernetes, Docker,
GitLab Runner, réseaux virtuels et administration Linux.`,
  },
  {
    slug: 'axocare',
    name: 'AxoCare e-santé.md',
    title: 'AxoCare — logiciels e-santé',
    content: `# AxoCare — Axon'Cable (e-santé)

Développement de logiciels médicaux (2023).

## Réalisations
- Interopérabilité INSi (carte Vitale / CPS)
- Migration de base de données médicale
- Chiffrement de données sensibles (ISO 27001)
- Modernisation d'applications WPF — C#, .NET, SQL, LINQ`,
  },
  {
    slug: 'hand-esport',
    name: 'Hand E-Sport — gaming inclusif.md',
    title: 'Hand E-Sport — gaming inclusif',
    content: `# Hand E-Sport — gaming inclusif

Projet CESI mené de 2023 à 2025 autour de l'accessibilité
dans le jeu vidéo et de la sensibilisation au handicap.

## Rôle
Responsable développement au sein de l'équipe projet.

## Réalisations
- Événements à Gaming Reims puis au CESI de Reims
- Tournoi multigaming et stands de découverte accessibles
- PlayAbility, Xbox Adaptive Controller et options d'accessibilité
- Diffusion en direct avec OBS, NDI, Mixline et Restream
- Infrastructure de régie : 10 PC de tournoi et 2 PC de streaming
- Gestion des risques réseau, encodage et plans de repli

Environ 500 Go de flux vidéo ont transité sur le réseau
pendant la journée de l'événement.`,
  },
  {
    slug: 'killer-bee-cybersecurity',
    name: 'Killer Bee — cybersécurité.md',
    title: 'Killer Bee — architecture SI et cybersécurité',
    content: `# Killer Bee — architecture SI et cybersécurité

Projet CESI 2024–2025 : conception, déploiement puis audit
croisé d'un système d'information d'entreprise en laboratoire.

## Infrastructure
- Segmentation WAN, LAN et DMZ avec VLAN et routage inter-VLAN
- Pare-feu Stormshield, règles NAT/PAT et réseau Wi-Fi isolé
- Active Directory, DNS, DHCP, Exchange et IIS
- Virtualisation Hyper-V et supervision Zabbix / MariaDB
- Configuration de routeurs, switches et points d'accès Cisco

## Audit de sécurité
- Cartographie réseau, analyse de trafic et scans de services
- Tests web/API fondés sur les risques OWASP
- Vérification de la segmentation et des configurations système
- Matrice de risques et recommandations CIS, ANSSI et OWASP

Outils : Nmap, Wireshark, Nessus, Burp Suite, OWASP ZAP,
Metasploit et Ettercap, utilisés dans un environnement isolé.`,
  },
  {
    slug: 'human-for-you',
    name: 'HumanForYou — prédiction du turnover.md',
    title: 'HumanForYou — prédiction du turnover par IA',
    content: `# HumanForYou — prédiction du turnover par IA

Projet CESI 2024 réalisé en équipe pour analyser et prédire
l'attrition des salariés d'une entreprise pharmaceutique.

## Pipeline data
- Fusion de quatre jeux de données portant sur 4 410 salariés
- Nettoyage, traitement des valeurs manquantes et feature engineering
- Extraction des temps de présence, horaires moyens et absences
- Analyse exploratoire et matrice de corrélation
- Séparation entraînement / test avec conservation de la distribution

## Machine Learning
Comparaison de cinq approches : régression logistique, arbre de
décision, forêt aléatoire, SGD Classifier et SVC, puis génération
de probabilités individuelles et de pistes d'amélioration RH.

Stack : Python, Jupyter, Pandas, NumPy, scikit-learn,
Matplotlib et Seaborn, avec une analyse éthique du modèle.`,
  },
  {
    slug: 'easysave',
    name: 'EasySave — sauvegarde chiffrée.md',
    title: 'EasySave — logiciel de sauvegarde chiffrée',
    content: `# EasySave — logiciel de sauvegarde chiffrée

Projet CESI 2023 réalisé en équipe : application desktop de
sauvegarde complète ou différentielle pour l'entreprise ProSoft.

## Fonctionnalités
- Création, lancement et suivi de travaux de sauvegarde
- Chiffrement et déchiffrement avec CryptoSoft
- Exécution multithread et suivi de l'état des transferts
- Détection des applications métier avant une sauvegarde
- Application mono-instance et interface de contrôle déportée
- Journalisation, fichiers d'état et interface multilingue

## Architecture
C# / .NET, architecture MVVM, séparation Model–View–ViewModel,
design patterns et gestion de la concurrence.`,
  },
  {
    slug: 'worldwide-weather-watcher',
    name: 'Worldwide Weather Watcher.md',
    title: 'Worldwide Weather Watcher — station météo embarquée',
    content: `# Worldwide Weather Watcher — station météo embarquée

Projet CESI 2021–2022 : prototype de station météorologique
destinée à équiper des navires de surveillance océanique.

## Rôle
Chef de projet d'une équipe de trois étudiants.

## Réalisation
- Modélisation fonctionnelle UML / SysML et architecture composants
- Firmware modulaire en C++ avec Arduino et PlatformIO
- Mesure de température, humidité, pression et luminosité
- Horodatage RTC et journalisation des mesures sur carte SD
- Modes standard, économique, maintenance et configuration
- Paramétrage en EEPROM et gestion des erreurs capteurs / stockage

Stack : C++, Arduino, PlatformIO, BME280, RTC, EEPROM et SD.`,
  },
];

export const aboutText = `Bonjour, je suis ${profile.name} 👋

${profile.description}

— Basé à Reims, France
— Freelance via Maxadev : https://maxadev.fr
— Contact : ${profile.email}
— LinkedIn : ${profile.linkedin}

Astuce : ouvrez le Terminal et tapez « help »
pour découvrir quelques easter eggs.`;

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
      Name: 'Self-Hosting & Homelab',
      Details: [
        'Homelab Unraid',
        'Docker & Kubernetes sur VM',
        'Nextcloud',
        'Ollama local',
        'Reverse proxy & WireGuard',
        'Monitoring & sauvegardes',
      ],
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
