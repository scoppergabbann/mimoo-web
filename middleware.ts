import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // /id default tanpa prefix, /en eksplisit
});

export const config = {
  // Match semua path kecuali API, _next, _vercel, dan static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
