import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mimoo - Identity & Lost Recovery',
    short_name: 'Mimoo',
    description: 'Identitasmu, barangmu, jalannya pulang. Cozy QR ecosystem untuk lindungi barang berharga.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF9F0',
    theme_color: '#8B7FD9',
    orientation: 'portrait',
    lang: 'id-ID',
    categories: ['productivity', 'utilities', 'lifestyle'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
