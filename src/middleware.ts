import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/config';

export default createMiddleware(routing);

export const config = {
  // Match:
  // - The root path "/"
  // - All locale paths (/id/*, /en/*)
  // - Other unprefixed paths (will be redirected to default locale)
  // Excludes API routes, Next.js internals, and files with extensions.
  matcher: [
    '/',
    '/(id|en)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
