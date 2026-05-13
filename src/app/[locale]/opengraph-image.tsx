import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Mimoo - Identitasmu, barangmu, jalannya pulang';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * Dynamic OG image untuk shared landing page.
 * Generated saat first request, cached after.
 */
export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F2FF 100%)',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Mimoo logo text */}
        <div
          style={{
            fontSize: '120px',
            fontWeight: 800,
            color: '#8B7FD9',
            letterSpacing: '-4px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          Mimoo
          <span style={{ fontSize: '64px' }}>✦</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '40px',
            fontWeight: 700,
            color: '#1A1A2E',
            marginTop: '32px',
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          Identitasmu, barangmu, jalannya pulang.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            color: '#5A5A75',
            marginTop: '24px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Cozy QR ecosystem untuk lindungi barang berharga. Gratis selamanya 💜
        </div>

        {/* Made in Indonesia badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '48px',
            padding: '12px 24px',
            background: 'white',
            borderRadius: '9999px',
            border: '2px solid #EBE5FF',
            fontSize: '18px',
            color: '#1A1A2E',
            fontWeight: 600,
          }}
        >
          Made with 💜 in Indonesia 🇮🇩
        </div>
      </div>
    ),
    { ...size }
  );
}
