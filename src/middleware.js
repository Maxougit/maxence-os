import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Routes de métadonnées générées par Next (src/app/icon.js, opengraph-image.js,
// robots.js, sitemap.js) et fichiers servis depuis public/ (un dossier = préfixe).
const METADATA_ROUTES = new Set(['icon', 'opengraph-image', 'robots.txt', 'sitemap.xml']);
const PUBLIC_FILES = new Set(['sw.js', 'wp.webp']);
const PUBLIC_DIRS = new Set(['files', 'images', 'videos']);

// Chemin qui ne correspond à aucune route : Next sert sa page 404 prérendue, sans
// passer par le layout [locale] ni par le cache de prérendu.
const NOT_FOUND_PATH = '/__not-found__/__/__';

function isKnownFirstSegment(segment, isLeaf) {
  if (isLeaf && METADATA_ROUTES.has(segment)) return true;
  if (isLeaf && PUBLIC_FILES.has(segment)) return true;
  if (!isLeaf && PUBLIC_DIRS.has(segment)) return true;
  return false;
}

export default function middleware(request) {
  // Le site n'utilise AUCUNE Server Action : une requête portant un en-tête
  // `Next-Action` provient forcément d'un bot qui sonde les sites Next.js. On la
  // rejette avant que Next ne tente de résoudre l'action, ce qui supprime les logs
  // « Failed to find Server Action » (même protection que sur maxadev).
  if (request.headers.has('next-action')) {
    return new NextResponse(null, { status: 400 });
  }

  const segments = request.nextUrl.pathname.split('/').filter(Boolean);

  // Racine et chemins préfixés par une langue : routage next-intl habituel.
  if (segments.length === 0 || routing.locales.includes(segments[0])) {
    return intlMiddleware(request);
  }

  // Fichiers statiques et routes de métadonnées : servis tels quels.
  if (isKnownFirstSegment(segments[0], segments.length === 1)) {
    return NextResponse.next();
  }

  // Tout le reste (/x.php, /.env, /admin… sondés par les scanners) répond 404 ici,
  // avant le routeur. Laissées passer, ces URL atteignaient le layout [locale] avec
  // un faux locale : Next les rendait puis tentait d'écrire le cache de prérendu
  // (« Failed to update prerender cache »), et avec `dynamicParams = false` il
  // journalise encore un « NoFallbackError » par requête (promesse de revalidation
  // rejetée, remontée par waitUntil — bug Next 15/16).
  return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url), { status: 404 });
}

export const config = {
  // Tout sauf les routes internes et l'API. Les fichiers (chemins contenant un
  // point) passent désormais aussi par ici : c'est précisément la forme des URL
  // sondées par les scanners (/x.php, /.env), et le middleware les reconnaît.
  // NB : un matcher listant « / » explicitement provoquait une boucle de
  // redirection sur la racine en build standalone.
  matcher: '/((?!api|_next|_vercel).*)',
};
