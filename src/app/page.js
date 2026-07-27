import Image from 'next/image';
import Desktop from '@/components/Desktop/Desktop';
import {
  profile,
  skillsData,
  education,
  certifications,
  languages,
  publications,
  projects,
  SITE_URL,
} from '@/data/cv';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.jobTitle,
    description: profile.description,
    email: `mailto:${profile.email}`,
    image: `${SITE_URL}${profile.photo}`,
    url: SITE_URL,
    sameAs: [profile.linkedin, profile.website],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Reims',
      addressCountry: 'FR',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'CESI',
    },
    worksFor: [
      { '@type': 'Organization', name: 'Maxadev', url: profile.website },
      { '@type': 'Organization', name: 'ArcelorMittal Distribution Solutions' },
    ],
    knowsLanguage: languages.map((l) => l.name),
    knowsAbout: [
      ...skillsData.Programation.map((s) => s.Name),
      ...skillsData.Technologies.map((s) => s.Name),
    ],
  },
};

// Les publications sont modélisées à part : en schema.org, c'est l'article qui
// porte ses auteurs (CreativeWork.author), pas l'inverse.
const publicationsJsonLd = publications.map((publication) => ({
  '@context': 'https://schema.org',
  '@type': 'ScholarlyArticle',
  headline: publication.title,
  name: publication.title,
  inLanguage: 'en',
  datePublished: publication.date,
  abstract: publication.abstract,
  keywords: publication.keywords,
  url: publication.url,
  sameAs: publication.url,
  author: publication.authors.map((name) => ({ '@type': 'Person', name })),
  publisher: { '@type': 'Organization', name: 'HAL — Archives ouvertes' },
  isPartOf: {
    '@type': 'PublicationEvent',
    name: publication.venueLong,
    startDate: publication.date,
    location: { '@type': 'Place', name: publication.location },
  },
}));

// Résumé d'un projet pour la version texte : le premier paragraphe de sa fiche
// Markdown (après le titre), nettoyé de la syntaxe Markdown résiduelle.
const projectSummary = (project) => {
  const lines = project.content.split('\n');
  const paragraph = [];
  for (const line of lines.slice(1)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('![')) continue;
    if (!trimmed) {
      if (paragraph.length) break;
      continue;
    }
    paragraph.push(trimmed);
  }
  return paragraph.join(' ').replace(/\*\*/g, '').replace(/[_`]/g, '');
};

// Projets phares (étoile dans le Finder) en tête, ordre stable pour le reste.
const orderedProjects = [...projects].sort(
  (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
);

const skillSections = [
  { id: 'langages', title: 'Langages de programmation', items: skillsData.Programation },
  { id: 'technologies', title: 'Technologies & outils', items: skillsData.Technologies },
  { id: 'concepts', title: 'Concepts', items: skillsData.Concepts },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {publicationsJsonLd.map((article) => (
        <script
          key={article.url}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
        />
      ))}
      <Desktop />
      <section id="cv" className="select-text bg-neutral-950 text-neutral-100">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <header className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <Image
              src={profile.photo}
              alt={`Photo de ${profile.name}`}
              width={112}
              height={112}
              className="rounded-full object-cover"
              loading="eager"
            />
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="mt-1 text-xl text-neutral-300">{profile.jobTitle}</p>
              <p className="mt-2 text-sm text-neutral-500">{profile.location}</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                {profile.description}
              </p>
            </div>
          </header>

          <h2 className="mt-14 border-b border-neutral-700 pb-2 text-2xl font-semibold">
            Expériences professionnelles
          </h2>
          <ul className="mt-6 space-y-6">
            {skillsData.Experiences.map((exp) => (
              <li key={exp.Name}>
                <h3 className="text-lg font-medium">{exp.Name}</h3>
                {exp.Details.map((detail) => (
                  <p key={detail} className="mt-1 text-sm text-neutral-400">
                    {detail}
                  </p>
                ))}
              </li>
            ))}
          </ul>

          <h2 className="mt-14 border-b border-neutral-700 pb-2 text-2xl font-semibold">
            Formation
          </h2>
          <ul className="mt-6 space-y-4">
            {education.map((diploma) => (
              <li key={diploma.title}>
                <h3 className="font-medium">
                  {diploma.year} — {diploma.title}
                </h3>
                <p className="text-sm text-neutral-400">{diploma.school}</p>
              </li>
            ))}
          </ul>

          <h2 className="mt-14 border-b border-neutral-700 pb-2 text-2xl font-semibold">
            Publications scientifiques
          </h2>
          <ul className="mt-6 space-y-6">
            {publications.map((publication) => (
              <li key={publication.id}>
                <h3 className="text-lg font-medium">
                  <a
                    href={publication.url}
                    rel="noopener"
                    className="text-blue-400 hover:underline"
                  >
                    {publication.title}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-neutral-300">
                  {publication.authors.map((author, index) => (
                    <span key={author}>
                      {index > 0 && ', '}
                      {author === profile.name ? <strong>{author}</strong> : author}
                    </span>
                  ))}
                </p>
                <p className="mt-1 text-sm text-neutral-400">
                  {publication.type} — {publication.venue}, {publication.location} (
                  {publication.year}) · {publication.lab}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {publication.abstract}
                </p>
                <p className="mt-2 text-sm text-neutral-400">
                  Contribution : {publication.contribution} —{' '}
                  <a
                    href={publication.repository}
                    rel="noopener"
                    className="text-blue-400 hover:underline"
                  >
                    dépôt GitHub
                  </a>
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  HAL : {publication.halId} · {publication.licence}
                </p>
              </li>
            ))}
          </ul>

          <h2 className="mt-14 border-b border-neutral-700 pb-2 text-2xl font-semibold">
            Projets
          </h2>
          <ul className="mt-6 space-y-5">
            {orderedProjects.map((project) => (
              <li key={project.slug}>
                <h3 className="text-lg font-medium">{project.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                  {projectSummary(project)}
                </p>
                {(project.repository || project.website) && (
                  <p className="mt-1 text-sm">
                    {project.repository && (
                      <a
                        href={project.repository}
                        rel="noopener"
                        className="text-blue-400 hover:underline"
                      >
                        Code source
                      </a>
                    )}
                    {project.repository && project.website && (
                      <span className="text-neutral-600"> · </span>
                    )}
                    {project.website && (
                      <a
                        href={project.website}
                        rel="noopener"
                        className="text-blue-400 hover:underline"
                      >
                        Site en ligne
                      </a>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {skillSections.map((section) => (
            <div key={section.id}>
              <h2 className="mt-14 border-b border-neutral-700 pb-2 text-2xl font-semibold">
                {section.title}
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {section.items.map((skill) => (
                  <li key={skill.Name}>
                    <h3 className="font-medium">{skill.Name}</h3>
                    <p className="text-sm text-neutral-400">{skill.Details.join(', ')}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <h2 className="mt-14 border-b border-neutral-700 pb-2 text-2xl font-semibold">
            Certifications & langues
          </h2>
          <ul className="mt-6 space-y-2 text-sm">
            {certifications.map((certification) => (
              <li key={certification}>Certification : {certification}</li>
            ))}
            {languages.map((language) => (
              <li key={language.name}>
                {language.name} : <span className="text-neutral-400">{language.level}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-14 border-b border-neutral-700 pb-2 text-2xl font-semibold">
            Contact
          </h2>
          <ul className="mt-6 space-y-2 text-sm">
            <li>
              Email :{' '}
              <a href={`mailto:${profile.email}`} className="text-blue-400 hover:underline">
                {profile.email}
              </a>
            </li>
            <li>
              LinkedIn :{' '}
              <a
                href={profile.linkedin}
                rel="me noopener"
                className="text-blue-400 hover:underline"
              >
                linkedin.com/in/maxence-leroux123
              </a>
            </li>
            <li>
              Freelance :{' '}
              <a href={profile.website} rel="me noopener" className="text-blue-400 hover:underline">
                maxadev.fr
              </a>
            </li>
            <li>
              CV PDF :{' '}
              <a
                href="/files/CV-Leroux-Maxence-FR.pdf"
                className="text-blue-400 hover:underline"
              >
                télécharger le CV (PDF)
              </a>
            </li>
          </ul>

          <footer className="mt-16 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} {profile.name} — {SITE_URL.replace('https://', '')}
          </footer>
        </div>
      </section>
    </>
  );
}
