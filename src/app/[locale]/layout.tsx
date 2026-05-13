import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { routing } from '@/i18n/config';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';
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

// Layout pakai cookies untuk auth (via Navbar) — harus dynamic
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    title: {
      default: t('title'),
      template: '%s · Mimoo',
    },
    description: t('description'),
    keywords: [
      'Mimoo',
      'lost and found',
      'barang hilang',
      'recovery',
      'QR code',
      'Indonesia',
      'identity protection',
      'KTP hilang',
      'dompet hilang',
      'cozy tech',
    ],
    authors: [{ name: 'Mimoo Team', url: appUrl }],
    creator: 'Mimoo',
    publisher: 'Mimoo',
    metadataBase: new URL(appUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'id-ID': '/id',
        'en-US': '/en',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      url: `${appUrl}/${locale}`,
      siteName: 'Mimoo',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Mimoo - Identitasmu, barangmu, jalannya pulang',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og-image.png'],
      creator: '@mimoo_id',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
    manifest: '/manifest.json',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    },
    category: 'productivity',
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
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${plusJakarta.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <a href="#main-content" className="skip-to-content">
              {t('skipToContent')}
            </a>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
