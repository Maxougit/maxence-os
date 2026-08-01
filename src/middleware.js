import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Tout sauf les routes internes, l'API et les fichiers (tout ce qui contient
  // un point : /files/*.pdf, /images/*.svg, sitemap.xml, robots.txt…).
  // NB : un matcher listant « / » explicitement provoquait une boucle de
  // redirection sur la racine en build standalone.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
