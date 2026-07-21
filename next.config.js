/** @type {import('next').NextConfig} */

const securityHeaders = [
  // SAMEORIGIN (et non DENY) : le viewer interne affiche le PDF dans une iframe
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-inline' requis : scripts inline injectés par Next.js (RSC) + snippet GA
      // 'unsafe-eval' en dev uniquement : requis par React pour le debugging (jamais utilisé en prod)
      `script-src 'self' 'unsafe-inline'${
        process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''
      } https://www.googletagmanager.com`,
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
      "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      // 'self' : viewer PDF ; openstreetmap : plan embarqué dans Safari ;
      // maxadev : aperçu du site perso (nécessite aussi que maxadev.fr autorise le framing)
      "frame-src 'self' https://www.openstreetmap.org https://maxadev.fr https://www.maxadev.fr",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  poweredByHeader: false,
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/offres',
        destination: 'https://www.maxadev.fr/offres',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
