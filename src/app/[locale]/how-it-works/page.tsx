import { useTranslations } from 'next-intl';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { CTA } from '@/components/sections/CTA';
import { Badge } from '@/components/ui/Badge';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { CheckIcon } from '@/components/ui/Icons';

export default function HowItWorksPage() {
  const t = useTranslations('HowItWorksPage');

  const finderSteps = [
    t('finderStep1'),
    t('finderStep2'),
    t('finderStep3'),
    t('finderStep4'),
  ];

  return (
    <>
      {/* Page hero */}
      <section className="bg-gradient-cozy py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <MimooBlob size="lg" expression="happy" />
          </div>
          <h1 className="font-display text-display-md lg:text-display-lg font-extrabold text-mimoo-ink-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-mimoo-ink-500">{t('subtitle')}</p>
        </div>
      </section>

      <HowItWorksSection />

      {/* Finder journey */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="pink" className="mb-4">
            {t('finderJourneyTitle')}
          </Badge>
          <h2 className="font-display text-display-sm lg:text-display-md font-extrabold text-mimoo-ink-900 mb-8">
            {t('section1Title')}
          </h2>
          <p className="text-lg text-mimoo-ink-500 mb-8 leading-relaxed">
            {t('section1Desc')}
          </p>
          <ol className="space-y-4">
            {finderSteps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-4 bg-mimoo-cream-100 rounded-cozy-lg p-5"
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-mimoo-purple-500 text-white flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <p className="text-mimoo-ink-700 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTA />
    </>
  );
}
