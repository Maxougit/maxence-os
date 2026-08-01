import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Uniquement la racine et les chemins localisés : les assets (/files,
  // /images, /videos, /_next…), sitemap, robots et la redirection /offres
  // ne passent pas par le middleware.
  matcher: ['/', '/(fr|en)/:path*'],
};
