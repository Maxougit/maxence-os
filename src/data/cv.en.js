// Miroir anglais de cv.js — mêmes exports, mêmes structures ; seul le texte visible est traduit.

import { SITE_URL } from './cv';

export { SITE_URL };

export const profile = {
  name: 'Maxence Leroux',
  jobTitle: 'Software Engineer — Freelance (Maxadev)',
  description:
    'Software engineer, CESI graduate (2025), freelancing through Maxadev. Specialized in generative AI, micro-services architecture and DevOps (Kubernetes, CI/CD). Currently AI & DevOps LeadDev engineer at ArcelorMittal Distribution Solutions.',
  email: 'contact@maxenceleroux.fr',
  linkedin: 'https://www.linkedin.com/in/maxence-leroux123/',
  website: 'https://maxadev.fr',
  location: 'Reims, France',
  photo: '/images/portrait.jpg',
};

export const education = [
  {
    year: '2025',
    title: 'Engineering degree in computer science (MSc level)',
    school: 'CESI — Reims (51)',
  },
  {
    year: '2020',
    title: 'Baccalauréat, science track — with honors',
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
      'Proof of concept of the certification system (reference [6] in the paper)',
    repository: 'https://github.com/Maxougit/POC-AI-Detection-structure',
    fullTextPath: '/files/confere-2024-establishing-digital-trust.md',
    licence: 'Licence Ouverte ETALAB',
    venue: 'CONFERE 2024',
    venueLong: '30e colloque des Sciences de la Conception et de l’Innovation (CONFERE)',
    location: 'Porto, Portugal',
    date: '2024-07-04',
    year: '2024',
    type: 'Conference paper',
    lab: 'CESI École d’ingénieurs — LINEACT laboratory',
    url: 'https://hal.science/hal-05587060v1',
    pdf: 'https://hal.science/hal-05587060/document',
    halId: 'hal-05587060',
    keywords: ['Certificate', 'Trust Authority', 'Differentiation', 'Generative AI'],
    abstract:
      'An authentication system that verifies where a piece of digital content comes from and tells AI-generated content apart from human-created content, together with a proof of concept and an analysis of the scalability, adaptability and accuracy challenges involved.',
  },
];

export const languages = [
  { name: 'French', level: 'Native' },
  { name: 'English', level: 'TOEIC 850 (B2)' },
];

export const projects = [
  {
    slug: 'quotes-automation',
    name: 'Quotes Automation.md',
    title: 'Quotes Automation — ArcelorMittal',
    featured: true,
    content: `# Quotes Automation — ArcelorMittal

Quote request automation platform at ArcelorMittal Distribution
Solutions: a customer sends a request by e-mail, a chain of
micro-services processes it end to end and the quote is created
in SAP — with no manual re-entry.

![Quotes Automation pipeline: eight micro-services chained by a message bus, from receiving the e-mail to replying to the customer, on a Kubernetes foundation](/images/projects/quotes-automation-architecture.en.svg)

_Event-driven pipeline: each stage publishes its result, the next one consumes it._

## The pipeline
A **linear chain** of micro-services connected by a message
bus: each stage enriches the request, then hands over.

1. **Reception** — e-mails are fetched from Office 365,
   filtered then archived
2. **Customer identification** — matching against the account
   and the sales branch
3. **Attachments** — text extraction from PDFs and documents (OCR)
4. **Product search** — index engine and generative AI to find
   the right reference from a free-text description
5. **Process assessment** — applicable transformation rules
   (cutting, drilling, finishing)
6. **Stock check** — availability, source site, lead time
7. **Quote creation** — written into SAP through the business APIs
8. **Reply** — the quote goes back out by e-mail

Decoupling the stages with a message bus makes it possible to
replay a failed stage without reprocessing the whole request,
and to scale each service independently.

## Technical foundation
- Micro-services containerized on **Kubernetes (AKS)**
- **RabbitMQ** between each stage, **MongoDB** and **Redis**, **Solr** index
- **Azure OpenAI** behind a **multi-LLM load balancer**
- Centralized logging, dashboards and **Power BI**
- **GitLab CI/CD**

## Impact
−70% processing time per quote, higher reliability and fewer
human errors.

The same business foundation is exposed as MCP tools and driven
by conversation in **Octopus** (see the dedicated page).

## My role
Lead for application architecture, GenAI and industrialization —
AI & DevOps LeadDev as a freelancer since Sept. 2025, after
working there on a master's-level apprenticeship and then a
fixed-term contract (2024 – 2025).`,
  },
  {
    slug: 'maxence-os',
    name: 'Maxence OS.md',
    title: 'Maxence OS — this site',
    repository: 'https://github.com/Maxougit/maxence-os',
    website: SITE_URL,
    content: `# Maxence OS

The site you are using right now:
an interactive CV that recreates macOS in the browser.

## Stack
- Next.js (App Router) + React
- Tailwind CSS, custom CSS animations
- Three.js (skills universe)
- Docker + CI/CD, self-hosted

## Details
Draggable windows, Dock with magnification, Spotlight,
Control Center, terminal with easter eggs (try "snake").`,
  },
  {
    slug: 'maxadev',
    name: 'Maxadev — website & technical blog.md',
    title: 'Maxadev — my freelance business website',
    website: 'https://maxadev.fr',
    content: `# Maxadev — my freelance business website

The showcase site and technical blog of Maxadev, my freelance brand:
services, in-depth articles and a direct way to get in touch.
It is also the site displayed inside the Safari app of this resume.

## What it does
- Showcases the services offered and past projects
- **Technical blog**: articles are written and published from a built-in
  editor, with no external CMS involved
- Contact form and scoping questionnaire, with an instant notification
  whenever a request comes in
- **Bilingual site**, French / English, with a language switcher
- Consent banner for audience measurement (GDPR)

## Technical choices
Articles live in an **embedded SQLite database**: no database service to
host or maintain for a site this size, and backups come down to a single
file. Article Markdown is converted and **sanitised server-side** before
rendering.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Embedded SQLite, sanitised Markdown rendering
- Self-hosted and containerised, behind a reverse proxy`,
  },
  {
    slug: 'octopus',
    name: 'Octopus — sales chatbot.md',
    title: 'Octopus — AI sales agent (Maxadev)',
    featured: true,
    content: `# Octopus — AI sales agent (Maxadev)

Conversational sales cockpit built on the **Quotes Automation**
foundation: where the pipeline handles requests received by e-mail
end to end, Octopus makes those same business services drivable
through conversation, in self-service.

![Octopus architecture: the cockpit calls an MCP server that exposes the Quotes Automation business services as tools, with interfaces generated inside the chat](/images/projects/octopus-mcp-architecture.en.svg)

_The MCP server exposes the pipeline services as tools; the model picks which ones to call._

## The principle
The pipeline and the agent share the **same business foundation** —
customer identification, product search, transformation rules,
stock, pricing, quotes. What changes is the way it is triggered:

- **Quotes Automation**: a linear chain started by an e-mail
- **Octopus**: the language model decides for itself which tools
  to call, in the order the conversation dictates

The tools are exposed through **MCP** and called server-side:
access tokens never pass through the browser.

## The AI understands the request
"A 6 m IPE 200 beam with a 45° cut on the right": the agent
identifies the exact reference through tool calls (product search)
and configures the cut, in 3D, inside the conversation.

![Octopus understands the request: the customer describes an IPE 200 beam with a 45° cut, the agent looks the product up through a tool call](/images/projects/octopus-comprehension.jpg)

_The self-service cockpit tracks the items detected as the conversation goes on._

## An AI-generated interface (MCP-UI)
For a steel sheet, the agent displays an interactive interface in
the chat — steel grade, dimensions, finish — generated through
MCP-UI. The customer clicks, the agent carries on with those choices.

![AI-generated interface inside the chat: selectable steel grades, dimensions and finishes, 19 matching products](/images/projects/octopus-mcp-ui.jpg)

_Steel grades, dimensions, finish: the UI is born inside the conversation, wired to the catalog._

## The cart stays the source of truth
Detected items build up in a cart kept in sync throughout the
exchange. Sensitive calculations — stock, lead time, price — are
triggered by the code from that cart, never left to the model's
judgment.

## Outcome
The foundation industrialized at ArcelorMittal cut quote processing
time by 70% (see the Quotes Automation page).

[Watch the video demo ↗](/videos/maxadev-promo.mp4)
Also available in Finder: Projects → Octopus — demo.mp4.

## Stack
- Next.js web app, streaming responses
- **MCP** server exposing the pipeline's business tools
- **MCP-UI**: interactive interfaces rendered in an isolated frame
- Azure OpenAI models, 3D visualization of the cuts`,
  },
  {
    slug: 'maxa-scale',
    name: 'Maxa-Scale — CRM, AI & MCP.md',
    title: 'Maxa-Scale — prospecting CRM with LLM triage and agent access (MCP)',
    featured: true,
    content: `# Maxa-Scale — prospecting CRM with LLM triage and agent access (MCP)

Self-hosted multi-channel CRM I designed to run my freelance
prospecting: contacts, exchanges and follow-ups centralized on my
own server, an LLM that sorts incoming e-mails and an MCP server
that makes the tool drivable by an AI agent (private repository).

![How Maxa-Scale works: PWA, MCP agent and e-mails feed the Docker server (Next.js, worker, LLM router), which relies on MongoDB, the LLM providers and notifications](/images/projects/maxa-scale-architecture.en.svg)

_The flow: e-mails and agents come in on the left, the server sorts and follows up, the data stays with me._

## Key features
- Lead pipeline (Kanban + list), history per channel
  (e-mail, LinkedIn, phone, trade show)
- Catch-all e-mail intake: every incoming message is classified
  by the LLM — new lead, attached to an existing one, or discarded
- Scheduled automatic follow-ups, canceled as soon as the lead replies
- AI assistance: profile summary, follow-up draft,
  natural-language search

## Agent access (MCP)
MCP server protected by OAuth 2.1: an AI agent (Claude, ChatGPT…)
can look up profiles, log an exchange or schedule a follow-up
straight from a conversation.

![OAuth 2.1 flow of the MCP server: discovery, dynamic PKCE registration, authorization with 2FA, token, then tool calls](/images/projects/maxa-scale-mcp-oauth.en.svg)

_Figure taken from the specification: an agent's full OAuth 2.1 journey, from the initial 401 to running a tool._

## Stack
- Next.js (App Router) + TypeScript
- MongoDB / Mongoose, Node worker (IMAP, cron scheduling)
- Interchangeable LLM: cloud API or Ollama running locally
- 2FA authentication (TOTP), Web Push notifications
- Docker, self-hosted — lead data stays with me`,
  },
  {
    slug: 'homelab-self-hosting',
    name: 'Homelab — self-hosting & local AI.md',
    title: 'Homelab — self-hosting and local AI',
    content: `# Homelab — self-hosting and local AI

Personal project maintained on an Unraid server to experiment,
host my own data and run services without systematically
depending on third-party cloud platforms.

![Architecture of the self-hosted homelab](/images/projects/homelab-architecture.en.svg)

_Simplified overview — internal addresses and ports are not exposed._

## Self-hosted services
- Nextcloud, MariaDB and Collabora CODE for the collaborative cloud
- Vaultwarden for secrets management
- Jellyfin and Homebridge for media and home-automation uses
- Nginx Proxy Manager as reverse proxy
- WireGuard with WG-Easy for secure remote access
- Uptime Kuma for availability and Duplicati for backups

## Local AI
Ollama deployed in a container to run and test language models
locally, with model persistence and without depending on an
external API for every experiment.

## Operations
Docker containers, dedicated networks, persistent volumes,
monitoring, updates and service lifecycle management.`,
  },
  {
    slug: 'kubernetes-vm-lab',
    name: 'Kubernetes test cluster on VMs.md',
    title: 'Kubernetes test cluster on virtual machines',
    content: `# Kubernetes test cluster on virtual machines

Personal project run alongside my work at ArcelorMittal:
deploying a fully isolated multi-node Kubernetes environment
on my Unraid homelab.

![Architecture of the Kubernetes test cluster](/images/projects/kubernetes-lab.en.svg)

_An isolated Kubernetes lab, virtualized on the personal server._

## Infrastructure
- Test cluster made of three dedicated Ubuntu VMs
- 4 vCPUs and 3 GB of memory allocated to each node
- Virtualization and resource allocation driven by Unraid
- Separate Ubuntu VM for Docker experiments
- Debian VMs dedicated to GitLab and GitLab Runner trials

## Goals of the lab
- Reproduce a multi-node Kubernetes architecture at home
- Test deployments, configuration and workload lifecycle
- Experiment with failure, recovery and cluster growth scenarios
- Validate CI/CD and Linux administration practices outside production

Stack: Unraid / KVM, Ubuntu, Kubernetes, Docker,
GitLab Runner, virtual networks and Linux administration.`,
  },
  {
    slug: 'pa1llama',
    name: 'Pa1Llama — local LLM & privacy.md',
    title: 'Pa1Llama — 100% local LLM and data privacy',
    repository: 'https://github.com/Maxougit/Pa1Llama',
    content: `# Pa1Llama — 100% local LLM and data privacy

Proof of concept built for my research work at CESI:
"Local large language models for data privacy in personal
and professional applications".

## Principle
A conversational AI application that queries your own documents
**without a single request to the Internet**: the models run locally
through Ollama, and the data never leaves the machine.

## Stack
- **Local LLM**: llama3 + snowflake-arctic-embed (Ollama)
- **RAG**: ChromaDB (vector database) and PDF ingestion via PyPDF2
- **Backend**: Flask, JWT (authentication), encryption (cryptography)
- **Frontend**: Next.js
- **Deployment**: Docker Compose (Flask + Next.js)

## Goal
Make modern LLMs widely accessible while guaranteeing privacy,
security and transparency — an open source alternative to cloud
services for sensitive uses.

## Measured results
Comparison of proprietary solutions (Google AI, Anthropic, OpenAI —
data processed at the provider, closed source, expensive) against
the open ecosystem (Hugging Face, Mistral, Meta Llama, Ollama).

| Stage | Average response time |
| --- | --- |
| RAG | 0.845 s |
| LLM | 4.45 s |
| **Total** | **5.295 s** |

**Conclusion**: a local solution matches online services for speed,
while offering more security and accessibility.
Hardware requirement: 8 GB of RAM minimum, whatever the system.
User feedback was mostly positive, the interface remaining the
main area for improvement.

## Scientific poster

![Scientific poster — Local large language models for data privacy](/images/projects/poster-pa1llama.jpg)

_A0 poster presented at CESI._
[Download the poster (PDF) ↗](/files/poster-pa1llama.pdf)

## Next steps
- Built-in toolbox: predictive analysis and image processing
- User interface improvements
- Collaboration with the open source community`,
  },
  {
    slug: 'yolo-object-detection',
    name: 'YOLO object detection.md',
    title: 'YOLO object detection — custom training',
    repository: 'https://github.com/Maxougit/Objects-detection-Yolo',
    content: `# YOLO object detection — custom training

Computer vision work around YOLO: training models on custom
datasets, then running inference on images and videos.

## Highlights
- Custom training **locally on an NVIDIA GPU** (CUDA, cuDNN, PyTorch)
- A training variant **on Google Colab** to remove the hardware constraint
- Detection applied to video streams
- Dataset annotation with **Label Studio**
- Management of model weights and of the inference chain

## Stack
Python, Jupyter Notebook, Ultralytics YOLO, PyTorch, OpenCV,
CUDA / cuDNN, Label Studio.

This work extends the computer vision implemented at Stellantis
(AI-based quality monitoring, YOLOv8, OpenCV).`,
  },
  {
    slug: 'reefboxos',
    name: 'Reefbox OS — Freebox monitoring.md',
    title: 'Reefbox OS — Freebox monitoring dashboard',
    repository: 'https://github.com/Maxougit/reefboxos',
    content: `# Reefbox OS — Freebox monitoring dashboard

Personal web application that queries the Freebox API to monitor
the connection and the home network from a single interface.

## Features
- Consumption of the **Freebox API** (app-token authentication)
- Connection tracking and latency tests (ping)
- Data visualization: charts and tables
- Server-side management of user data

## Stack
- **Frontend**: React, Material UI (MUI X Charts, MUI X Data Grid), Axios
- **Backend**: Node.js / Express, token encryption (crypto-js)

A project in line with my interest in self-hosting and in staying
in control of my own infrastructure.`,
  },
  {
    slug: 'axocare',
    name: 'AxoCare e-health.md',
    title: 'AxoCare — e-health software',
    content: `# AxoCare — Axon'Cable (e-health)

Medical software development (2023).

## Highlights
- INSi interoperability (Carte Vitale / CPS)
- Medical database migration
- Encryption of sensitive data (ISO 27001)
- Modernization of WPF applications — C#, .NET, SQL, LINQ`,
  },
  {
    slug: 'hand-esport',
    name: 'Hand E-Sport — inclusive gaming.md',
    title: 'Hand E-Sport — inclusive gaming',
    repository: 'https://github.com/Maxougit/Hand-E-Sport',
    website: 'https://handesport.fr/',
    content: `# Hand E-Sport — inclusive gaming

CESI project run from 2023 to 2025 around accessibility in video
games and disability awareness.

## Role
Head of development within the project team.

## Highlights
- Events at Game In Reims, then at CESI in Reims
- Multi-game tournament and accessible discovery stands
- PlayAbility, Xbox Adaptive Controller and accessibility options
- Live streaming with OBS, NDI, Mixline and Restream
- Control room setup: 10 tournament PCs and 2 streaming PCs
- Management of network, encoding and fallback plan risks

Around 500 GB of video traffic went through the network
during the day of the event.`,
  },
  {
    slug: 'killer-bee-cybersecurity',
    name: 'Killer Bee — cybersecurity.md',
    title: 'Killer Bee — IT systems architecture and cybersecurity',
    content: `# Killer Bee — IT systems architecture and cybersecurity

CESI project 2024–2025: designing, deploying then cross-auditing
a corporate information system in a lab environment.

## Infrastructure
- WAN, LAN and DMZ segmentation with VLANs and inter-VLAN routing
- Stormshield firewall, NAT/PAT rules and isolated Wi-Fi network
- Active Directory, DNS, DHCP, Exchange and IIS
- Hyper-V virtualization and Zabbix / MariaDB monitoring
- Configuration of Cisco routers, switches and access points

## Security audit
- Offensive audit run from **Kali Linux**, in an isolated environment
- Network mapping, traffic analysis and service scans
- Web/API testing based on the OWASP risks
- Verification of segmentation and of system configurations
- Risk matrix and CIS, ANSSI and OWASP recommendations

Tooling from the Kali distribution and beyond: Nmap, Wireshark,
Burp Suite, OWASP ZAP, Metasploit, Ettercap, as well as Nessus.`,
  },
  {
    slug: 'human-for-you',
    name: 'HumanForYou — turnover prediction.md',
    title: 'HumanForYou — AI-based turnover prediction',
    content: `# HumanForYou — AI-based turnover prediction

CESI project 2024, carried out as a team to analyze and predict
employee attrition at a pharmaceutical company.

## Data pipeline
- Merging four datasets covering 4,410 employees
- Cleaning, handling of missing values and feature engineering
- Extraction of attendance times, average working hours and absences
- Exploratory analysis and correlation matrix
- Train / test split preserving the distribution

## Machine Learning
Comparison of five approaches: logistic regression, decision
tree, random forest, SGD Classifier and SVC, then generation
of individual probabilities and of HR improvement leads.

Stack: Python, Jupyter, Pandas, NumPy, scikit-learn,
Matplotlib and Seaborn, with an ethical analysis of the model.`,
  },
  {
    slug: 'easysave',
    name: 'EasySave — encrypted backup.md',
    title: 'EasySave — encrypted backup software',
    content: `# EasySave — encrypted backup software

CESI project 2023 carried out as a team: a desktop application
for full or differential backups for the company ProSoft.

## Features
- Creation, launch and tracking of backup jobs
- Encryption and decryption with CryptoSoft
- Multithreaded execution and transfer status tracking
- Detection of business applications before a backup
- Single-instance application and remote control interface
- Logging, state files and multilingual interface

## Architecture
C# / .NET, MVVM architecture, Model–View–ViewModel separation,
design patterns and concurrency management.`,
  },
  {
    slug: 'worldwide-weather-watcher',
    name: 'Worldwide Weather Watcher.md',
    title: 'Worldwide Weather Watcher — embedded weather station',
    content: `# Worldwide Weather Watcher — embedded weather station

CESI project 2021–2022: prototype of a weather station meant to
equip ocean-monitoring vessels.

## Role
Project manager of a three-student team.

## What was built
- UML / SysML functional modeling and component architecture
- Modular C++ firmware with Arduino and PlatformIO
- Temperature, humidity, pressure and light measurement
- RTC timestamping and logging of readings to an SD card
- Standard, economy, maintenance and configuration modes
- EEPROM settings and handling of sensor / storage errors

Stack: C++, Arduino, PlatformIO, BME280, RTC, EEPROM and SD.`,
  },
];

export const aboutText = `Hi, I'm ${profile.name} 👋

${profile.description}

— Based in Reims, France
— Freelance through Maxadev: https://maxadev.fr
— Contact: ${profile.email}
— LinkedIn: ${profile.linkedin}

Tip: open the Terminal and type "help"
to discover a few easter eggs.`;

export const skillsData = {
  Programation: [
    {
      Name: 'C#',
      Details: ['.NET', 'WPF', 'WCF', 'REST API', 'ORM / LINQ'],
    },
    {
      Name: 'Python',
      Details: ['AI / Machine Learning', 'Data Analysis', 'OpenCV', 'Scripting'],
    },
    {
      Name: 'JavaScript / TypeScript',
      Details: ['React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express'],
    },
    {
      Name: 'C / C++',
      Details: ['App Development', 'Arduino / Embedded'],
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
      Name: 'Generative AI / LLM',
      Details: [
        'Azure OpenAI',
        'Claude',
        'AI agents',
        'Model Context Protocol (MCP)',
        'Multi-LLM load balancing',
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
      Details: ['GitLab CI/CD', 'Infrastructure as Code', 'Regression testing'],
    },
    {
      Name: 'Messaging & Data',
      Details: ['RabbitMQ', 'MongoDB', 'Solr', 'Elasticsearch'],
    },
    {
      Name: 'Observability',
      Details: ['ELK stack', 'Kibana', 'Monitoring & alerting', 'Centreon'],
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
      Name: 'Application architecture',
      Details: ['Micro-services', 'Messaging', 'Resilience', 'Fault tolerance'],
    },
    {
      Name: 'Cybersecurity',
      Details: ['Encryption of sensitive data', 'ISO 27001', 'CNIL / GDPR'],
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
        'Unraid homelab',
        'Docker & Kubernetes on VMs',
        'Nextcloud',
        'Local Ollama',
        'Reverse proxy & WireGuard',
        'Monitoring & backups',
      ],
    },
    {
      Name: 'Project management',
      Details: ['Agile methodology', 'Technical leadership'],
    },
  ],
  Experiences: [
    {
      Name: 'ArcelorMittal Distribution Solutions',
      Details: [
        'AI & DevOps LeadDev engineer — freelance (since Sept. 2025)',
        'Lead for application architecture, GenAI and industrialization of the Quotes Automation platform: conversational AI agents, MCP orchestration, Kubernetes AKS, CI/CD, observability',
        "Master's-level apprenticeship then fixed-term contract — development & application architecture (Jul. 2024 – Sept. 2025)",
        'Quotes Automation: AI-driven SAP quote automation — Docker micro-services, RabbitMQ, MongoDB, Solr, Azure OpenAI, multi-LLM load balancer, ELK stack',
      ],
    },
    {
      Name: 'Maxadev — Freelance & consultant',
      Details: [
        'Sole trader (auto-entrepreneur) — software engineer (since Aug. 2025)',
        'Software consulting and development — maxadev.fr',
      ],
    },
    {
      Name: 'STELLANTIS — Innolab Trnava (Slovakia)',
      Details: [
        'Fourth-year engineering internship — web development, AI & industrial process optimization (Sept. 2023 – Feb. 2024)',
        'Computer vision (YOLOv8, OpenCV), AI-based quality monitoring, Power BI, internal platforms (Portal GD, eKaizen)',
      ],
    },
    {
      Name: "AXON'CABLE — AxoCare (e-health)",
      Details: [
        'Third-year internship then fixed-term contract — software developer (Jan. – Jul. 2023)',
        'INSi interoperability (Carte Vitale / CPS), medical database migration, encryption of sensitive data (ISO 27001), WPF modernization — C#, .NET, SQL, LINQ',
      ],
    },
    {
      Name: "E.P.S.M.D de l'Aisne",
      Details: [
        'Second-year internship & fixed-term contract — IT department / DSIO (2021 – 2022)',
        'Centreon network monitoring, Moodle e-learning platform on Docker, deployment and renewal of the IT hardware fleet',
      ],
    },
    {
      Name: 'Decathlon logistics',
      Details: ['Logistics operative — fixed-term contract (summer 2020), order picking and flow management'],
    },
  ],
};
