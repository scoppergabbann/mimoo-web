import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckIcon, HeartIcon, ArrowRightIcon } from '@/components/ui/Icons';
import { MimooBlob } from '@/lib/avatar/MimooBlob';

interface WhyFreeItem {
  emoji: string;
  title: string;
  desc: string;
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('PricingPage');
  const features = t.raw('free.features') as string[];
  const whyFreeItems = t.raw('whyFree.items') as WhyFreeItem[];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-cozy py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <MimooBlob size="lg" expression="love" />
          </div>
          <h1 className="font-display text-display-md lg:text-display-lg font-extrabold text-mimoo-ink-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-mimoo-ink-500 leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      {/* Free plan card */}
      <section className="py-12 lg:py-16 bg-mimoo-cream-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card
            variant="elevated"
            className="bg-gradient-to-br from-mimoo-purple-500 to-mimoo-purple-700 text-white border-2 border-mimoo-purple-300 p-6 lg:p-10"
          >
            <div className="text-center mb-6">
              <Badge variant="cream" className="bg-white/20 text-white mb-3">
                💜 Everything free, forever
              </Badge>
              <h2 className="font-display text-3xl font-extrabold mb-2">
                {t('free.name')}
              </h2>
              <p className="text-mimoo-purple-100">{t('free.desc')}</p>
              <div className="mt-4">
                <span className="font-display text-5xl font-extrabold">
                  {t('free.price')}
                </span>
                <span className="text-mimoo-purple-100 ml-2 text-lg">
                  / {t('free.period')}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 max-w-md mx-auto">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5"
                    aria-hidden="true"
                  >
                    <CheckIcon className="w-4 h-4 text-white" />
                  </span>
                  <span className="text-mimoo-purple-50">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/register" className="block">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRightIcon />}
                className="w-full bg-white text-mimoo-purple-700 hover:bg-mimoo-cream-100"
              >
                {t('choosePlan')}
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Why free section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-display-sm lg:text-display-md font-extrabold text-mimoo-ink-900 mb-8 text-center">
            {t('whyFree.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {whyFreeItems.map((item) => (
              <Card key={item.title} variant="cozy" className="text-center p-6">
                <div className="text-5xl mb-3" aria-hidden="true">
                  {item.emoji}
                </div>
                <h3 className="font-display text-xl font-bold text-mimoo-ink-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-mimoo-ink-500 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation section */}
      <section className="py-16 lg:py-20 bg-mimoo-purple-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" className="text-center p-8 lg:p-12">
            <div className="flex justify-center mb-4">
              <HeartIcon className="w-12 h-12 text-mimoo-pink-400" />
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-mimoo-ink-900 mb-2">
              {t('donation.name')}
            </h2>
            <p className="font-display text-lg text-mimoo-purple-700 mb-4">
              {t('donation.subtitle')}
            </p>
            <p className="text-mimoo-ink-500 leading-relaxed mb-8 max-w-xl mx-auto">
              {t('donation.desc')}
            </p>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<HeartIcon className="w-4 h-4" />}
              disabled
            >
              {t('donation.cta')} (Segera)
            </Button>
            <p className="text-xs text-mimoo-ink-300 mt-6 italic">
              {t('donation.thankYou')}
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
