import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('PricingPage');

  const freeFeatures = t.raw('free.features') as string[];
  const premiumFeatures = t.raw('premium.features') as string[];

  return (
    <>
      <section className="bg-gradient-cozy py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-display-md lg:text-display-lg font-extrabold text-mimoo-ink-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-mimoo-ink-500">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mimoo-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Free */}
            <Card variant="default" className="relative">
              <h2 className="font-display text-2xl font-bold text-mimoo-ink-900 mb-1">
                {t('free.name')}
              </h2>
              <p className="text-mimoo-ink-500 mb-6 text-sm">{t('free.desc')}</p>
              <div className="mb-6">
                <span className="font-display text-4xl font-extrabold text-mimoo-ink-900">
                  {t('free.price')}
                </span>
                <span className="text-mimoo-ink-500 ml-2 text-sm">/ {t('free.period')}</span>
              </div>
              <Button variant="outline" className="w-full mb-6">
                {t('choosePlan')}
              </Button>
              <ul className="space-y-3">
                {freeFeatures.map((feature) => (
                  <PricingFeature key={feature}>{feature}</PricingFeature>
                ))}
              </ul>
            </Card>

            {/* Premium */}
            <Card
              variant="elevated"
              className="relative bg-gradient-to-br from-mimoo-purple-500 to-mimoo-purple-700 text-white border-2 border-mimoo-purple-300"
            >
              <Badge
                variant="cream"
                className="absolute -top-3 right-6 bg-mimoo-cream-200 text-mimoo-purple-700"
              >
                ⭐ {t('premium.popular')}
              </Badge>
              <h2 className="font-display text-2xl font-bold mb-1">{t('premium.name')}</h2>
              <p className="text-mimoo-purple-100 mb-6 text-sm">{t('premium.desc')}</p>
              <div className="mb-6">
                <span className="font-display text-4xl font-extrabold">
                  {t('premium.price')}
                </span>
                <span className="text-mimoo-purple-100 ml-2 text-sm">
                  / {t('premium.period')}
                </span>
              </div>
              <Button
                variant="secondary"
                className="w-full mb-6 bg-white text-mimoo-purple-700 hover:bg-mimoo-cream-100"
              >
                {t('choosePlan')}
              </Button>
              <ul className="space-y-3">
                {premiumFeatures.map((feature) => (
                  <PricingFeature key={feature} darkMode>
                    {feature}
                  </PricingFeature>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

function PricingFeature({
  children,
  darkMode,
}: {
  children: React.ReactNode;
  darkMode?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          'shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5',
          darkMode ? 'bg-white/20 text-white' : 'bg-mimoo-mint-100 text-mimoo-mint-300'
        )}
        aria-hidden="true"
      >
        <CheckIcon className="w-3 h-3" />
      </span>
      <span className={cn('text-sm leading-relaxed', darkMode ? 'text-mimoo-purple-50' : 'text-mimoo-ink-700')}>
        {children}
      </span>
    </li>
  );
}
