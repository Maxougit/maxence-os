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

export const publications = [
  {
    id: 'confere-2024-digital-trust',
    title:
      'Establishing Digital Trust: A Certification System for Verifying AI-Generated Content and Ensuring Information Integrity',
    titleFr:
      "Établir la confiance numérique : un système de certification pour vérifier le contenu généré par l'IA et garantir l'intégrité de l'information",
    // Ordre imprimé sur l'article (la notice HAL, elle, omet Maxence Leroux).
    authors: [
      'Benoit Blee',
      'Abdallah Didi',
      'Vincent Leclercq',
      'Maxence Leroux',
      'Ilyass Abouelaziz',
    ],
    // Preuve de concept citée en référence [6] de l'article.
    contribution:
      'Preuve de concept du système de certification (référence [6] de l’article)',
    repository: 'https://github.com/Maxougit/POC-AI-Detection-structure',
    fullTextPath: '/files/confere-2024-establishing-digital-trust.md',
    licence: 'Licence Ouverte ETALAB',
    venue: 'CONFERE 2024',
    venueLong: '30e colloque des Sciences de la Conception et de l’Innovation (CONFERE)',
    location: 'Porto, Portugal',
    date: '2024-07-04',
    year: '2024',
    type: 'Communication en conférence',
    lab: 'CESI École d’ingénieurs — laboratoire LINEACT',
    url: 'https://hal.science/hal-05587060v1',
    pdf: 'https://hal.science/hal-05587060/document',
    halId: 'hal-05587060',
    keywords: ['Certificate', 'Trust Authority', 'Differentiation', 'Generative AI'],
    abstract:
      "Système d'authentification permettant de vérifier la provenance d'un contenu numérique et de distinguer les contenus générés par IA de ceux créés par des humains, accompagné d'une preuve de concept et d'une analyse des enjeux de passage à l'échelle, d'adaptabilité et de précision.",
  },
];

export const languages = [
  { name: 'Français', level: 'Langue natale' },
  { name: 'Anglais', level: 'TOEIC 850 (B2)' },
];

export const projects = [
  {
    slug: 'quotes-automation',
    name: 'Quotes Automation.md',
    title: 'Quotes Automation — ArcelorMittal',
    featured: true,
    content: `# Quotes Automation — ArcelorMittal

Plateforme d'automatisation des demandes de devis chez ArcelorMittal
Distribution Solutions : un client envoie sa demande par e-mail, une
chaîne de micro-services la traite de bout en bout et le devis est
créé dans SAP — sans ressaisie.

![Pipeline de Quotes Automation : huit micro-services enchaînés par un bus de messages, de la réception de l'e-mail à la réponse au client, sur un socle Kubernetes](/images/projects/quotes-automation-architecture.svg)

_Pipeline événementiel : chaque étape publie son résultat, la suivante le consomme._

## Le pipeline
Une **chaîne linéaire** de micro-services, reliés par un bus de
messages : chaque étape enrichit la demande puis passe la main.

1. **Réception** — les e-mails sont récupérés depuis Office 365,
   filtrés puis archivés
2. **Identification du client** — rapprochement avec le compte et
   l'agence commerciale
3. **Pièces jointes** — extraction du texte des PDF et documents (OCR)
4. **Recherche produit** — moteur d'index et IA générative pour
   retrouver la bonne référence à partir d'une description libre
5. **Évaluation des process** — règles de transformation applicables
   (coupe, perçage, finitions)
6. **Vérification du stock** — disponibilité, site source, délai
7. **Création du devis** — écriture dans SAP via les API métier
8. **Réponse** — le devis repart par e-mail

Découpler les étapes par un bus de messages permet de rejouer une
étape en échec sans reprendre toute la demande, et de faire monter
en charge chaque service indépendamment.

## Socle technique
- Micro-services conteneurisés sur **Kubernetes (AKS)**
- **RabbitMQ** entre chaque étape, **MongoDB** et **Redis**, index **Solr**
- **Azure OpenAI** derrière un **load balancer multi-LLM**
- Journalisation centralisée, tableaux de bord et **Power BI**
- **CI/CD GitLab**

## Impact
−70 % de temps de traitement d'un devis, fiabilité accrue et erreurs
humaines réduites.

Le même socle métier est exposé en outils MCP et piloté par la
conversation dans **Octopus** (voir la fiche dédiée).

## Mon rôle
Référent architecture applicative, GenAI et industrialisation —
LeadDev IA & DevOps en freelance depuis sept. 2025, après y avoir
travaillé en alternance BAC+5 puis CDD (2024 – 2025).`,
  },
  {
    slug: 'maxence-os',
    name: 'Maxence OS.md',
    title: 'Maxence OS — ce site',
    repository: 'https://github.com/Maxougit/maxence-os',
    website: SITE_URL,
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
    slug: 'maxadev',
    name: 'Maxadev — site & blog technique.md',
    title: 'Maxadev — le site de mon activité freelance',
    website: 'https://maxadev.fr',
    content: `# Maxadev — le site de mon activité freelance

Le site vitrine et le blog technique de Maxadev, ma marque de freelance :
présentation des offres, articles de fond et prise de contact directe.
C'est aussi le site qui s'affiche dans l'app Safari de ce CV.

## Ce qu'il fait
- Présentation des prestations et des projets réalisés
- **Blog technique** : les articles sont rédigés puis publiés depuis un
  éditeur intégré, sans passer par un CMS externe
- Formulaire de contact et questionnaire de cadrage, avec notification
  instantanée à la réception d'une demande
- **Site bilingue** français / anglais, avec sélecteur de langue
- Bandeau de consentement pour la mesure d'audience (RGPD)

## Choix techniques
Les articles sont stockés dans une **base SQLite embarquée** : pas de
service de base de données à héberger ni à maintenir pour un site de
cette taille, et les sauvegardes se résument à un fichier. Le Markdown
des articles est converti puis **assaini côté serveur** avant rendu.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- SQLite embarqué, rendu Markdown assaini
- Auto-hébergé et conteneurisé, derrière un reverse proxy`,
  },
  {
    slug: 'octopus',
    name: 'Octopus — chatbot commercial.md',
    title: 'Octopus — agent commercial IA (Maxadev)',
    featured: true,
    content: `# Octopus — agent commercial IA (Maxadev)

Cockpit commercial conversationnel bâti sur le socle de
**Quotes Automation** : là où le pipeline traite les demandes reçues
par e-mail de bout en bout, Octopus rend ces mêmes services métier
pilotables en conversation, en self-service.

![Architecture d'Octopus : le cockpit appelle un serveur MCP qui expose les services métier de Quotes Automation en outils, avec des interfaces générées dans le chat](/images/projects/octopus-mcp-architecture.svg)

_Le serveur MCP expose en outils les services du pipeline ; le modèle choisit lesquels appeler._

## Le principe
Le pipeline et l'agent partagent le **même socle métier** —
identification client, recherche produit, règles de transformation,
stock, prix, devis. Ce qui change, c'est la façon de l'actionner :

- **Quotes Automation** : chaîne linéaire déclenchée par un e-mail
- **Octopus** : le modèle de langage choisit lui-même quels outils
  appeler, dans l'ordre dicté par la conversation

Les outils sont exposés via **MCP** et appelés côté serveur : les
jetons d'accès ne transitent jamais par le navigateur.

## L'IA comprend la demande
« Une poutre IPE 200 de 6 m, coupée à 45° à droite » : l'agent
identifie la référence exacte par appels d'outils (recherche produit)
et configure la coupe, en 3D, dans la conversation.

![Octopus comprend la demande : le client décrit une poutre IPE 200 coupée à 45°, l'agent recherche le produit par appel d'outil](/images/projects/octopus-comprehension.jpg)

_Le cockpit self-service suit les articles détectés au fil de la conversation._

## Une interface générée par l'IA (MCP-UI)
Pour une tôle acier, l'agent affiche dans le chat une interface
interactive — nuance, dimensions, finition — générée via MCP-UI.
Le client clique, l'agent continue avec ces choix.

![Interface générée par l'IA dans le chat : nuances, dimensions et finitions sélectionnables, 19 produits correspondants](/images/projects/octopus-mcp-ui.jpg)

_Nuances, dimensions, finition : l'UI naît dans la conversation, reliée au catalogue._

## Le panier reste la source de vérité
Les articles détectés s'accumulent dans un panier synchronisé au fil
de l'échange. Les calculs sensibles — stock, délai, prix — sont
déclenchés par le code à partir de ce panier, jamais laissés à
l'appréciation du modèle.

## Résultat
Le socle industrialisé chez ArcelorMittal a réduit de 70 % le temps
de traitement d'un devis (voir la fiche Quotes Automation).

[Voir la démo vidéo ↗](/videos/maxadev-promo.mp4)
Également disponible dans le Finder : Projets → Octopus — démo.mp4.

## Stack
- Application web Next.js, réponses en streaming
- Serveur **MCP** exposant les outils métier du pipeline
- **MCP-UI** : interfaces interactives rendues en cadre isolé
- Modèles Azure OpenAI, visualisation 3D des découpes`,
  },
  {
    slug: 'maxa-scale',
    name: 'Maxa-Scale — CRM, IA & MCP.md',
    title: 'Maxa-Scale — CRM de prospection avec tri LLM et accès agent (MCP)',
    featured: true,
    content: `# Maxa-Scale — CRM de prospection avec tri LLM et accès agent (MCP)

CRM multi-canal auto-hébergé que j'ai conçu pour piloter ma prospection
freelance : contacts, échanges et relances centralisés sur mon serveur,
un LLM qui trie les e-mails entrants et un serveur MCP qui rend l'outil
pilotable par un agent IA (dépôt privé).

![Fonctionnement de Maxa-Scale : PWA, agent MCP et e-mails alimentent le serveur Docker (Next.js, worker, routeur LLM), qui s'appuie sur MongoDB, les fournisseurs LLM et les notifications](/images/projects/maxa-scale-architecture.svg)

_Le flux : e-mails et agents entrent à gauche, le serveur trie et relance, les données restent chez moi._

## Fonctionnalités clés
- Pipeline de prospects (Kanban + liste), historique par canal
  (e-mail, LinkedIn, téléphone, salon)
- Réception e-mail en catch-all : chaque message entrant est classé
  par le LLM — création de prospect, rattachement ou écartement
- Relances automatiques planifiées, annulées dès que le prospect répond
- Assistance IA : synthèse de fiche, brouillon de relance,
  recherche en langage naturel

## Accès agent (MCP)
Serveur MCP protégé par OAuth 2.1 : un agent IA (Claude, ChatGPT…)
peut consulter les fiches, consigner un échange ou planifier une
relance directement depuis une conversation.

![Flux OAuth 2.1 du serveur MCP : découverte, enregistrement dynamique PKCE, autorisation avec 2FA, jeton, puis appels outillés](/images/projects/maxa-scale-mcp-oauth.svg)

_Figure issue de la spécification : le parcours OAuth 2.1 complet d'un agent, du 401 initial à l'exécution d'un outil._

## Stack
- Next.js (App Router) + TypeScript
- MongoDB / Mongoose, worker Node (IMAP, planification cron)
- LLM interchangeable : API cloud ou Ollama en local
- Authentification 2FA (TOTP), notifications Web Push
- Docker, auto-hébergé — les données de prospects restent chez moi`,
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
    slug: 'pa1llama',
    name: 'Pa1Llama — LLM local & confidentialité.md',
    title: 'Pa1Llama — LLM 100 % local et confidentialité des données',
    repository: 'https://github.com/Maxougit/Pa1Llama',
    content: `# Pa1Llama — LLM 100 % local et confidentialité des données

Preuve de concept réalisée pour mon travail de recherche au CESI :
« Grands modèles de langages locaux pour la
confidentialité des données dans les applications personnelles et
professionnelles ».

## Principe
Une application d'IA conversationnelle qui interroge vos propres documents
**sans aucune requête vers Internet** : les modèles tournent en local via
Ollama, les données ne quittent jamais la machine.

## Stack
- **LLM local** : llama3 + snowflake-arctic-embed (Ollama)
- **RAG** : ChromaDB (base vectorielle) et ingestion PDF via PyPDF2
- **Back-end** : Flask, JWT (authentification), chiffrement (cryptography)
- **Front-end** : Next.js
- **Déploiement** : Docker Compose (Flask + Next.js)

## Objectif
Démocratiser l'accès aux LLM modernes en garantissant confidentialité,
sécurité et transparence — une alternative open source aux services cloud
pour les usages sensibles.

## Résultats mesurés
Comparaison des solutions propriétaires (Google AI, Anthropic, OpenAI —
traitement des données chez le fournisseur, code fermé, coûteux) face à
l'écosystème ouvert (Hugging Face, Mistral, Meta Llama, Ollama).

| Étape | Temps de réponse moyen |
| --- | --- |
| RAG | 0,845 s |
| LLM | 4,45 s |
| **Total** | **5,295 s** |

**Conclusion** : une solution locale rivalise en rapidité avec les services
en ligne, tout en offrant davantage de sécurité et d'accessibilité.
Prérequis matériel : 8 Go de RAM minimum, quel que soit le système.
Retours utilisateurs majoritairement positifs, l'interface restant le
principal axe d'amélioration.

## Poster scientifique

![Poster scientifique — Grands modèles de langages locaux pour la confidentialité des données](/images/projects/poster-pa1llama.jpg)

_Poster A0 présenté au CESI._
[Télécharger le poster (PDF) ↗](/files/poster-pa1llama.pdf)

## Perspectives
- Boîte à outils intégrée : analyse prédictive et traitement d'image
- Amélioration de l'interface utilisateur
- Collaboration avec la communauté open source`,
  },
  {
    slug: 'yolo-object-detection',
    name: 'Détection d’objets YOLO.md',
    title: 'Détection d’objets par YOLO — entraînement personnalisé',
    repository: 'https://github.com/Maxougit/Objects-detection-Yolo',
    content: `# Détection d'objets par YOLO — entraînement personnalisé

Travaux de computer vision autour de YOLO : entraînement de modèles sur
jeux de données personnalisés, puis inférence sur images et vidéos.

## Réalisations
- Entraînement personnalisé **en local sur GPU NVIDIA** (CUDA, cuDNN, PyTorch)
- Variante d'entraînement **sur Google Colab** pour s'affranchir du matériel
- Détection appliquée à des flux vidéo
- Annotation des jeux de données avec **Label Studio**
- Gestion des poids de modèles et de la chaîne d'inférence

## Stack
Python, Jupyter Notebook, Ultralytics YOLO, PyTorch, OpenCV,
CUDA / cuDNN, Label Studio.

Ces travaux prolongent la computer vision mise en œuvre chez Stellantis
(monitoring qualité par IA, YOLOv8, OpenCV).`,
  },
  {
    slug: 'reefboxos',
    name: 'Reefbox OS — supervision Freebox.md',
    title: 'Reefbox OS — tableau de bord de supervision Freebox',
    repository: 'https://github.com/Maxougit/reefboxos',
    content: `# Reefbox OS — tableau de bord de supervision Freebox

Application web personnelle qui interroge l'API de la Freebox pour
superviser la connexion et le réseau domestique depuis une interface unique.

## Fonctionnalités
- Consommation de l'**API Freebox** (authentification par jeton applicatif)
- Suivi de la connexion et tests de latence (ping)
- Visualisation des données : graphiques et tableaux
- Gestion des données utilisateur côté serveur

## Stack
- **Front-end** : React, Material UI (MUI X Charts, MUI X Data Grid), Axios
- **Back-end** : Node.js / Express, chiffrement des jetons (crypto-js)

Un projet dans la continuité de mon intérêt pour l'auto-hébergement et la
maîtrise de mon infrastructure personnelle.`,
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
    repository: 'https://github.com/Maxougit/Hand-E-Sport',
    website: 'https://handesport.fr/',
    content: `# Hand E-Sport — gaming inclusif

Projet CESI mené de 2023 à 2025 autour de l'accessibilité
dans le jeu vidéo et de la sensibilisation au handicap.

## Rôle
Responsable développement au sein de l'équipe projet.

## Réalisations
- Événements à Game In Reims puis au CESI de Reims
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
- Audit offensif mené depuis **Kali Linux**, en environnement isolé
- Cartographie réseau, analyse de trafic et scans de services
- Tests web/API fondés sur les risques OWASP
- Vérification de la segmentation et des configurations système
- Matrice de risques et recommandations CIS, ANSSI et OWASP

Outillage de la distribution Kali et compléments : Nmap, Wireshark,
Burp Suite, OWASP ZAP, Metasploit, Ettercap, ainsi que Nessus.`,
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
