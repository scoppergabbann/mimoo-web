import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SimplePageHeader } from '@/components/sections/SimplePageHeader';
import { MimooBlob } from '@/lib/avatar/MimooBlob';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('BlogPage');

  // Categories for future use (when posts exist)
  const categories = t.raw('categories') as Record<string, string>;

  return (
    <>
      <SimplePageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={t('badge')}
        blobExpression="sparkle"
      />

      {/* Category chips (preview for future) */}
      <section className="py-8 bg-mimoo-cream-100 border-b border-mimoo-purple-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(categories).map(([key, label]) => (
              <span
                key={key}
                className="px-4 py-2 text-sm font-semibold bg-white text-mimoo-ink-500 rounded-pill border-2 border-mimoo-purple-100"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Empty state — no posts yet for MVP */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="cozy" className="text-center p-8 lg:p-12">
            <div className="flex justify-center mb-4">
              <MimooBlob size="xl" expression="thoughtful" />
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-mimoo-ink-900 mb-3">
              {t('noPostsTitle')}
            </h2>
            <p className="text-mimoo-ink-500 leading-relaxed mb-8 max-w-md mx-auto">
              {t('noPostsDesc')}
            </p>

            <div className="bg-white rounded-cozy p-6 border-2 border-mimoo-purple-100">
              <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-2">
                {t('subscribeTitle')}
              </h3>
              <p className="text-sm text-mimoo-ink-500 mb-4">{t('subscribeDesc')}</p>
              <Link href="/contact">
                <Button variant="outline" size="md">
                  Hubungi Tim Mimoo →
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
