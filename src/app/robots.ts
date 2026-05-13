import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mimoo.id';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/id/', '/en/'],
        disallow: [
          '/api/',
          '/auth/',
          '/dashboard/',
          '/found/', // Recovery URLs harus privat, gak boleh ke-index
          '/*.json$',
          '/*.xml$',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
