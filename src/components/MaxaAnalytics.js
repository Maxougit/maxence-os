'use client'

import Script from 'next/script'

// Les pages sont pré-rendues au build : l'hôte et l'identifiant du site doivent être connus
// à ce moment-là, d'où des variables NEXT_PUBLIC_* (inlinées par Next), passées en arguments
// de build depuis MAXA_ANALYTICS_HOST / MAXA_ANALYTICS_SITE_ID du .env. Vides = rien n'est rendu.
const HOST = (process.env.NEXT_PUBLIC_MAXA_ANALYTICS_HOST || '').replace(/\/+$/, '')
const SITE_ID = process.env.NEXT_PUBLIC_MAXA_ANALYTICS_SITE_ID || ''

export default function MaxaAnalytics() {
  if (!HOST || !SITE_ID) return null

  return (
    <Script
      src={`${HOST}/m.js`}
      data-site={SITE_ID}
      data-host={HOST}
      strategy="afterInteractive"
    />
  )
}
