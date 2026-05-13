'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function FoundErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Recovery page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-cozy">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl mb-4" aria-hidden="true">
          🥺
        </div>

        <h1 className="font-display text-3xl font-extrabold text-mimoo-ink-900 mb-3">
          Oops, something went wrong
        </h1>

        <p className="text-mimoo-ink-500 leading-relaxed mb-8">
          Maaf, halaman recovery sedang bermasalah. Tim Mimoo sudah notify.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="primary" size="lg">
            🔄 Coba Lagi
          </Button>
          <a href="/id" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Kembali ke Beranda
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
