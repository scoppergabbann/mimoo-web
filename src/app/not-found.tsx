'use client';

import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          background: '#FFF9F0',
          color: '#2D2D45',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: '1rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#8B7FD9', margin: 0 }}>
            404
          </h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>
            Halaman ini juga ikut hilang 🥲
          </h2>
          <p style={{ marginTop: '1rem', color: '#5A5A75' }}>
            Tapi tenang, kita bisa bantu kamu kembali ke jalan yang benar.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: '#8B7FD9',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '9999px',
              fontWeight: 600,
            }}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </body>
    </html>
  );
}
