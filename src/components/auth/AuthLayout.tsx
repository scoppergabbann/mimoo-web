import type { ReactNode } from 'react';
import { MimooBlob } from '@/lib/avatar/MimooBlob';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  blobExpression?: 'happy' | 'sparkle' | 'love' | 'thoughtful' | 'wink';
  footer?: ReactNode;
}

/**
 * Layout untuk halaman auth (login, register, forgot, reset).
 *
 * Catatan: TIDAK ada header dengan logo di sini.
 * Navbar global (dari [locale]/layout.tsx) sudah menampilkan logo Mimoo.
 */
export function AuthLayout({
  children,
  title,
  subtitle,
  blobExpression = 'happy',
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-cozy flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-8 lg:py-12">
        <div className="w-full max-w-md">
          {/* Decorative blob mascot */}
          <div className="flex justify-center mb-4">
            <MimooBlob size="lg" expression={blobExpression} />
          </div>

          {/* Title + subtitle */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-mimoo-ink-900 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-mimoo-ink-500 leading-relaxed">{subtitle}</p>
            )}
          </div>

          {/* Form card */}
          <div className="bg-white rounded-cozy-lg shadow-soft p-6 sm:p-8">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="text-center mt-6">{footer}</div>
          )}
        </div>
      </main>
    </div>
  );
}
