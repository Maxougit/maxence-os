import Script from 'next/script'
import { Poppins } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { localeHref } from '@/i18n/config'
import { SITE_URL } from '@/data/cv'
import { getCvData } from '@/data/getCv'
import '../globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const { profile } = getCvData(locale)

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: '%s | Maxence OS',
    },
    description: t('description'),
    alternates: {
      canonical: localeHref(locale),
      languages: {
        fr: '/',
        en: '/en',
        'x-default': '/',
      },
    },
    keywords: [
      'Maxence Leroux',
      locale === 'fr' ? 'ingénieur logiciel' : 'software engineer',
      locale === 'fr' ? 'développeur' : 'developer',
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
      locale: t('ogLocale'),
      url: localeHref(locale),
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
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} className={poppins.variable}>
      <body>
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
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
