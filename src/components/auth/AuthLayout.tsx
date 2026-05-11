import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { MimooLogo } from '@/components/layout/MimooLogo';
import { MimooBlob } from '@/lib/avatar/MimooBlob';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  blobExpression?: 'happy' | 'wink' | 'love' | 'sparkle';
}

/**
 * Layout shared antara login, register, forgot-password.
 * Style: card-based centered layout dengan illustration.
 */
export function AuthLayout({
  children,
  title,
  subtitle,
  footer,
  blobExpression = 'happy',
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-cozy flex flex-col">
      {/* Top bar with logo */}
      <header className="px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/"
          className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400 rounded-cozy"
          aria-label="Mimoo - Beranda"
        >
          <MimooLogo size="md" />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
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
          <div className="bg-white rounded-cozy-lg shadow-soft-lg p-6 sm:p-8">
            {children}
          </div>

          {/* Footer */}
          {footer && <div className="mt-6 text-center">{footer}</div>}
        </div>
      </main>

      {/* Decorative sparkles */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-20 left-10 w-3 h-3 bg-mimoo-purple-300 rounded-full animate-sparkle opacity-60" />
        <div
          className="absolute top-40 right-20 w-2 h-2 bg-mimoo-pink-300 rounded-full animate-sparkle opacity-50"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-2 h-2 bg-mimoo-sky-300 rounded-full animate-sparkle opacity-60"
          style={{ animationDelay: '2s' }}
        />
      </div>
    </div>
  );
}
