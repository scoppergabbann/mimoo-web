import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SimplePageHeader } from '@/components/sections/SimplePageHeader';
import { ArrowRightIcon } from '@/components/ui/Icons';

interface HelpCategory {
  title: string;
  description: string;
  emoji: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HelpPage' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('HelpPage');
  const categoriesData = t.raw('categories') as Record<string, HelpCategory>;
  const categories = Object.entries(categoriesData);

  return (
    <>
      <SimplePageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={t('badge')}
        blobExpression="happy"
      />

      {/* Categories grid */}
      <section className="py-12 lg:py-16 bg-mimoo-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {categories.map(([key, cat]) => (
              <Link key={key} href="/faq" className="group block">
                <Card
                  variant="default"
                  className="h-full transition-all duration-200 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:shadow-soft-lg"
                >
                  <div
                    className="w-12 h-12 rounded-cozy bg-mimoo-purple-50 flex items-center justify-center text-2xl mb-3"
                    aria-hidden="true"
                  >
                    {cat.emoji}
                  </div>
                  <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-mimoo-ink-500 leading-relaxed">
                    {cat.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" className="text-center p-8 lg:p-12">
            <div className="text-4xl mb-4" aria-hidden="true">
              🫶
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-mimoo-ink-900 mb-2">
              {t('contactCta.title')}
            </h2>
            <p className="text-mimoo-ink-500 leading-relaxed mb-6 max-w-md mx-auto">
              {t('contactCta.description')}
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRightIcon />}>
                {t('contactCta.button')}
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </>
  );
}
