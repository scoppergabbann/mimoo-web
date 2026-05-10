import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { routing } from '@/i18n/config';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import '../globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    title: {
      default: t('title'),
      template: '%s · Mimoo',
    },
    description: t('description'),
    keywords: ['Mimoo', 'lost and found', 'Indonesia', 'QR code'],
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('Common');

  return (
    <html lang={locale} className={`${plusJakarta.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider>
          <a href="#main-content" className="skip-to-content">
            {t('skipToContent')}
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
