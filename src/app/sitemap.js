import { SITE_URL } from '@/data/cv'

export default function sitemap() {
  const lastModified = new Date()
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/files/CV-Leroux-Maxence-FR.pdf`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ]
}
