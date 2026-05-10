import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale: Locale =
    requested && (routing.locales as readonly string[]).includes(requested)
      ? (requested as Locale)
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
