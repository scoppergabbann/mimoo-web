import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
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

/**
 * Public recovery page layout.
 *
 * Independent dari `[locale]/layout.tsx` karena:
 * - URL bersih (tanpa /id atau /en prefix)
 * - Tidak butuh NextIntlClientProvider (komponennya pure)
 * - Tidak butuh Navbar/Footer global (ada own header inline)
 * - Bahasa default Indonesia (target audience)
 *
 * Catatan: /found/* di-bypass oleh middleware (lihat src/middleware.ts).
 */
export const metadata: Metadata = {
  title: 'Mimoo Recovery',
  description: 'Bantu kembalikan barang yang hilang via Mimoo.',
  robots: { index: false, follow: false }, // Don't index recovery URLs
};

export default function FoundLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
