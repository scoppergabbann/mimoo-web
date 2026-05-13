import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mimoo.id';

  const publicPages = [
    '',
    '/how-it-works',
    '/products',
    '/pricing',
    '/about',
    '/help',
    '/faq',
    '/contact',
    '/blog',
    '/careers',
    '/legal/privacy',
    '/legal/terms',
    '/login',
    '/register',
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  for (const path of publicPages) {
    // Indonesian version (default)
    sitemap.push({
      url: `${baseUrl}/id${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'daily' : 'weekly',
      priority: path === '' ? 1.0 : 0.7,
      alternates: {
        languages: {
          id: `${baseUrl}/id${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    });
    // English version
    sitemap.push({
      url: `${baseUrl}/en${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'daily' : 'weekly',
      priority: path === '' ? 1.0 : 0.7,
    });
  }

  return sitemap;
}
