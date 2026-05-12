import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/Card';
import { SimplePageHeader } from '@/components/sections/SimplePageHeader';
import { FaqAccordion } from '@/components/faq/FaqAccordion';

interface FaqItem {
  q: string;
  a: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FaqPage' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('FaqPage');
  const itemsData = t.raw('items') as Record<string, FaqItem>;
  const items = Object.values(itemsData).map((item) => ({
    question: item.q,
    answer: item.a,
  }));

  return (
    <>
      <SimplePageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={t('badge')}
        blobExpression="thoughtful"
      />

      <section className="py-12 lg:py-16 bg-mimoo-cream-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqAccordion items={items} />

          {/* Still need help */}
          <Card variant="cozy" className="mt-10 text-center p-6">
            <p className="text-mimoo-ink-700 mb-3">
              <Link
                href="/contact"
                className="text-mimoo-purple-700 hover:text-mimoo-purple-900 font-semibold hover:underline"
              >
                {t('stillNeedHelp')}
              </Link>
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
