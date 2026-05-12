import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SimplePageHeader } from '@/components/sections/SimplePageHeader';
import { LegalContent } from '@/components/legal/LegalContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TermsPage' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('TermsPage');

  return (
    <>
      <SimplePageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={t('badge')}
        blobExpression="thoughtful"
      />

      <section className="py-12 lg:py-16 bg-white">
        <LegalContent
          intro={t('intro')}
          tldrTitle={t('tldr.title')}
          tldrItems={t.raw('tldr.items') as string[]}
          sections={t.raw('sections') as Record<string, { title: string; content: string }>}
          lastUpdated={t('lastUpdated')}
        />
      </section>
    </>
  );
}
