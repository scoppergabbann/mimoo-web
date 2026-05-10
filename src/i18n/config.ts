import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  // 'always' = semua route harus pakai prefix (/id/..., /en/...)
  // Root path / akan auto-redirect ke /id (default locale)
  // Ini paling reliable dan predictable untuk routing.
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  id: '🇮🇩',
  en: '🇬🇧',
};

// Keep backward-compatible exports
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
