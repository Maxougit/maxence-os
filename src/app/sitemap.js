import { SITE_URL } from '@/data/cv'

export default function sitemap() {
  const lastModified = new Date()
  const languages = {
    fr: `${SITE_URL}/fr`,
    en: `${SITE_URL}/en`,
  }
  return [
    {
      url: `${SITE_URL}/fr`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/files/CV-Leroux-Maxence-FR.pdf`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/files/CV-Maxence-Leroux-EN.pdf`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ]
}
