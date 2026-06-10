import Script from 'next/script'
import { Poppins } from 'next/font/google'
import './globals.css'
import { profile, SITE_URL } from '@/data/cv'

const poppins = Poppins({ subsets: ['latin'], weight: ['300'] })

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.jobTitle} | Maxence OS`,
    template: '%s | Maxence OS',
  },
  description: `CV interactif de ${profile.name}, ${profile.jobTitle.toLowerCase()} : expériences chez ArcelorMittal et Stellantis, compétences en développement, GenAI, DevOps et réseaux.`,
  alternates: {
    canonical: '/',
  },
  keywords: [
    'Maxence Leroux',
    'ingénieur logiciel',
    'développeur',
    'CV',
    'portfolio',
    'CESI',
    'GenAI',
    'DevOps',
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  openGraph: {
    type: 'profile',
    locale: 'fr_FR',
    url: '/',
    siteName: 'Maxence OS',
    title: `${profile.name} — ${profile.jobTitle}`,
    description: profile.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.jobTitle}`,
    description: profile.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={poppins.className}>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0PT1GT03VC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0PT1GT03VC');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
