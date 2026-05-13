'use client';

import { useEffect } from 'react';

/**
 * Global error boundary — last resort fallback when even the layout fails.
 * Must have own html/body since it replaces the root layout entirely.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F2FF 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }} aria-hidden="true">
            🥺
          </div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#1A1A2E',
              marginBottom: '12px',
            }}
          >
            Aduh, ada error besar nih
          </h1>
          <p
            style={{
              color: '#5A5A75',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            Sesuatu yang fundamental error. Coba refresh halaman atau hubungi kami.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                padding: '14px 28px',
                background: '#8B7FD9',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              🔄 Coba Lagi
            </button>
            <a
              href="/id"
              style={{
                padding: '14px 28px',
                background: 'white',
                color: '#1A1A2E',
                border: '2px solid #EBE5FF',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Kembali ke Beranda
            </a>
          </div>
          <p
            style={{
              fontSize: '12px',
              color: '#9999B0',
              marginTop: '32px',
            }}
          >
            Masih bermasalah? Email{' '}
            <a
              href="mailto:hello@mimoo.id"
              style={{ color: '#8B7FD9', fontWeight: 600 }}
            >
              hello@mimoo.id
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
