import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SimplePageHeader } from '@/components/sections/SimplePageHeader';

interface CareerValue {
  emoji: string;
  title: string;
  desc: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CareersPage' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('CareersPage');
  const values = t.raw('values.items') as CareerValue[];
  const perks = t.raw('perks.items') as CareerValue[];
  const tips = t.raw('openApplication.tips') as string[];

  return (
    <>
      <SimplePageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={t('badge')}
        blobExpression="sparkle"
      />

      {/* Intro */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-mimoo-ink-700 leading-relaxed">{t('intro')}</p>
        </div>
      </section>

      {/* Values section */}
      <section className="py-12 lg:py-16 bg-mimoo-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-display-sm font-extrabold text-mimoo-ink-900 mb-8 text-center">
            {t('values.title')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
            {values.map((value, i) => (
              <Card key={i} variant="default" className="h-full">
                <div className="text-4xl mb-3" aria-hidden="true">
                  {value.emoji}
                </div>
                <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-mimoo-ink-500 leading-relaxed">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-display-sm font-extrabold text-mimoo-ink-900 mb-8 text-center">
            {t('openings.title')}
          </h2>
          <Card variant="cozy" className="text-center p-8">
            <p className="text-mimoo-ink-700 leading-relaxed">
              {t('openings.noOpenings')}
            </p>
          </Card>
        </div>
      </section>

      {/* Perks section */}
      <section className="py-12 lg:py-16 bg-mimoo-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-display-sm font-extrabold text-mimoo-ink-900 mb-8 text-center">
            {t('perks.title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {perks.map((perk, i) => (
              <Card key={i} variant="default" className="text-center p-5">
                <div className="text-3xl mb-2" aria-hidden="true">
                  {perk.emoji}
                </div>
                <h3 className="font-display text-base font-bold text-mimoo-ink-900 mb-1">
                  {perk.title}
                </h3>
                <p className="text-sm text-mimoo-ink-500 leading-relaxed">{perk.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open application CTA */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" className="text-center p-8 lg:p-12">
            <div className="text-4xl mb-4" aria-hidden="true">
              💌
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-mimoo-ink-900 mb-3">
              {t('openApplication.title')}
            </h2>
            <p className="text-mimoo-ink-500 leading-relaxed mb-6 max-w-md mx-auto">
              {t('openApplication.description')}
            </p>

            <div className="bg-mimoo-cream-100 rounded-cozy p-4 mb-6">
              <p className="text-xs uppercase tracking-wider font-semibold text-mimoo-ink-500 mb-1">
                {t('openApplication.emailLabel')}
              </p>
              <a
                href={`mailto:${t('openApplication.email')}`}
                className="font-display text-xl font-bold text-mimoo-purple-700 hover:text-mimoo-purple-900 hover:underline"
              >
                {t('openApplication.email')}
              </a>
            </div>

            <div className="text-left bg-mimoo-cream-50 rounded-cozy p-5">
              <p className="font-semibold text-mimoo-ink-900 mb-2 text-sm">
                {t('openApplication.tipTitle')}
              </p>
              <ul className="space-y-1.5">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-mimoo-ink-700">
                    <span className="text-mimoo-purple-500 mt-0.5" aria-hidden="true">
                      ✓
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`mailto:${t('openApplication.email')}`}
              className="inline-block mt-6 w-full sm:w-auto"
            >
              <Button variant="primary" size="lg" className="w-full">
                Kirim Aplikasi via Email
              </Button>
            </a>
          </Card>
        </div>
      </section>
    </>
  );
}
