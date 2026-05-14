import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SimplePageHeader } from '@/components/sections/SimplePageHeader';
import { ArrowRightIcon } from '@/components/ui/Icons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Donate' });
  return { title: t('title'), description: t('subtitle') };
}

interface DonateOption {
  emoji: string;
  amount: string;
  description: string;
}

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Donate');

  // Donate amounts with what they fund
  const tiers: DonateOption[] = [
    { emoji: '☕', amount: '20.000', description: t('tiers.coffee') },
    { emoji: '🍜', amount: '50.000', description: t('tiers.noodle') },
    { emoji: '🌸', amount: '100.000', description: t('tiers.flower') },
    { emoji: '🎁', amount: '500.000', description: t('tiers.gift') },
  ];

  return (
    <>
      <SimplePageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={t('badge')}
        blobExpression="love"
      />

      {/* Why donate */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="cozy" className="p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-mimoo-ink-900 mb-3 text-center">
              {t('why.title')}
            </h2>
            <p className="text-mimoo-ink-700 leading-relaxed text-center mb-6">
              {t('why.description')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2" aria-hidden="true">
                  🆓
                </div>
                <h3 className="font-semibold text-mimoo-ink-900 text-sm mb-1">
                  {t('why.points.free.title')}
                </h3>
                <p className="text-xs text-mimoo-ink-500 leading-relaxed">
                  {t('why.points.free.desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2" aria-hidden="true">
                  🇮🇩
                </div>
                <h3 className="font-semibold text-mimoo-ink-900 text-sm mb-1">
                  {t('why.points.local.title')}
                </h3>
                <p className="text-xs text-mimoo-ink-500 leading-relaxed">
                  {t('why.points.local.desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2" aria-hidden="true">
                  💜
                </div>
                <h3 className="font-semibold text-mimoo-ink-900 text-sm mb-1">
                  {t('why.points.community.title')}
                </h3>
                <p className="text-xs text-mimoo-ink-500 leading-relaxed">
                  {t('why.points.community.desc')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Donate tiers */}
      <section className="py-12 lg:py-16 bg-mimoo-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-extrabold text-mimoo-ink-900 mb-2 text-center">
            {t('tiers.title')}
          </h2>
          <p className="text-mimoo-ink-500 text-center mb-8 max-w-xl mx-auto">
            {t('tiers.subtitle')}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {tiers.map((tier, i) => (
              <Card key={i} variant="default" className="text-center">
                <div className="text-4xl mb-2" aria-hidden="true">
                  {tier.emoji}
                </div>
                <p className="font-display text-lg font-bold text-mimoo-purple-700 mb-1">
                  Rp {tier.amount}
                </p>
                <p className="text-xs text-mimoo-ink-500 leading-relaxed">
                  {tier.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Donation platforms */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Trakteer */}
            <Card variant="elevated" className="p-6">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-cozy bg-red-50 flex items-center justify-center text-2xl shrink-0"
                  aria-hidden="true"
                >
                  🍱
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-base font-bold text-mimoo-ink-900">
                    Trakteer
                  </h3>
                  <p className="text-xs text-mimoo-ink-500">
                    {t('platforms.trakteer.desc')}
                  </p>
                </div>
                <Badge variant="cream" size="sm">
                  {t('comingSoon')}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="md"
                disabled
                className="w-full opacity-50 cursor-not-allowed"
              >
                {t('platforms.trakteer.cta')}
              </Button>
            </Card>

            {/* Saweria */}
            <Card variant="elevated" className="p-6">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-cozy bg-yellow-50 flex items-center justify-center text-2xl shrink-0"
                  aria-hidden="true"
                >
                  💛
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-base font-bold text-mimoo-ink-900">
                    Saweria
                  </h3>
                  <p className="text-xs text-mimoo-ink-500">
                    {t('platforms.saweria.desc')}
                  </p>
                </div>
                <Badge variant="cream" size="sm">
                  {t('comingSoon')}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="md"
                disabled
                className="w-full opacity-50 cursor-not-allowed"
              >
                {t('platforms.saweria.cta')}
              </Button>
            </Card>
          </div>

          {/* Alternative */}
          <Card variant="cozy" className="mt-6 p-5 text-center">
            <p className="text-sm text-mimoo-ink-700 mb-3">
              {t('alternative.text')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-mimoo-purple-700 hover:text-mimoo-purple-900 font-semibold hover:underline text-sm"
            >
              {t('alternative.cta')} <ArrowRightIcon />
            </Link>
          </Card>
        </div>
      </section>

      {/* Other ways to support */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-extrabold text-mimoo-ink-900 mb-2 text-center">
            {t('otherWays.title')}
          </h2>
          <p className="text-mimoo-ink-500 text-center mb-8">
            {t('otherWays.subtitle')}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card variant="default">
              <div className="text-3xl mb-2" aria-hidden="true">
                🗣️
              </div>
              <h3 className="font-display text-base font-bold text-mimoo-ink-900 mb-1">
                {t('otherWays.share.title')}
              </h3>
              <p className="text-sm text-mimoo-ink-500">
                {t('otherWays.share.desc')}
              </p>
            </Card>

            <Card variant="default">
              <div className="text-3xl mb-2" aria-hidden="true">
                💌
              </div>
              <h3 className="font-display text-base font-bold text-mimoo-ink-900 mb-1">
                {t('otherWays.feedback.title')}
              </h3>
              <p className="text-sm text-mimoo-ink-500">
                {t('otherWays.feedback.desc')}
              </p>
            </Card>

            <Card variant="default">
              <div className="text-3xl mb-2" aria-hidden="true">
                ⭐
              </div>
              <h3 className="font-display text-base font-bold text-mimoo-ink-900 mb-1">
                {t('otherWays.review.title')}
              </h3>
              <p className="text-sm text-mimoo-ink-500">
                {t('otherWays.review.desc')}
              </p>
            </Card>

            <Card variant="default">
              <div className="text-3xl mb-2" aria-hidden="true">
                💼
              </div>
              <h3 className="font-display text-base font-bold text-mimoo-ink-900 mb-1">
                {t('otherWays.b2b.title')}
              </h3>
              <p className="text-sm text-mimoo-ink-500">
                {t('otherWays.b2b.desc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Thank you footer */}
      <section className="py-12 bg-gradient-cozy">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4" aria-hidden="true">
            💜
          </div>
          <p className="font-display text-xl text-mimoo-ink-900 font-bold mb-2">
            {t('thankYou.title')}
          </p>
          <p className="text-mimoo-ink-500 italic">
            "{t('thankYou.quote')}"
          </p>
        </div>
      </section>
    </>
  );
}
