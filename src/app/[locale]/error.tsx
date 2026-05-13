'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Per-route error boundary (Next.js convention).
 * Catches errors di [locale] route segment.
 *
 * Cozy fallback dengan retry option dan jalan keluar.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to console + report to monitoring service
    console.error('Route error:', error);

    // Sentry will auto-capture this via window.onerror, but we can also call manually
    if (typeof window !== 'undefined' && 'Sentry' in window) {
      // @ts-expect-error - Sentry will be loaded dynamically
      window.Sentry?.captureException(error);
    }
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 bg-gradient-cozy">
      <div className="max-w-md w-full text-center">
        {/* Mimoo confused face */}
        <div className="text-7xl mb-4" aria-hidden="true">
          🥺
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-mimoo-ink-900 mb-3">
          Aduh, ada error nih
        </h1>

        <p className="text-mimoo-ink-500 leading-relaxed mb-2">
          Maaf banget, ada yang gak beres di sisi kami. Bukan salah kamu!
        </p>

        <p className="text-sm text-mimoo-ink-300 mb-8">
          Tim Mimoo sudah dapat notifikasi dan akan segera memperbaiki.
        </p>

        {/* Error details — only in development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="bg-mimoo-pink-50 border border-mimoo-pink-200 rounded-cozy p-4 mb-6 text-left">
            <summary className="cursor-pointer text-sm font-semibold text-mimoo-pink-400">
              Detail error (dev mode)
            </summary>
            <pre className="mt-2 text-xs text-mimoo-ink-700 overflow-auto whitespace-pre-wrap break-all">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="primary" size="lg">
            🔄 Coba Lagi
          </Button>
          <Link href="/" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        <p className="text-xs text-mimoo-ink-300 mt-8">
          Masih bermasalah? Hubungi kami di{' '}
          <a
            href="mailto:hello@mimoo.id"
            className="text-mimoo-purple-700 hover:text-mimoo-purple-900 font-semibold hover:underline"
          >
            hello@mimoo.id
          </a>
        </p>
      </div>
    </div>
  );
}
