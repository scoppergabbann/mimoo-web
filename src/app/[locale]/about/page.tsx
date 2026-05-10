import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CTA } from '@/components/sections/CTA';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  const values = [
    { titleKey: 'value1Title' as const, descKey: 'value1Desc' as const, emoji: '🤗' },
    { titleKey: 'value2Title' as const, descKey: 'value2Desc' as const, emoji: '🔒' },
    { titleKey: 'value3Title' as const, descKey: 'value3Desc' as const, emoji: '🇮🇩' },
  ];

  return (
    <>
      <section className="bg-gradient-cozy py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-3 mb-6">
            <MimooAvatar
              config={{ character: 'denpa', skinTone: 'medium', outfit: 'purple', accent: 'purple' }}
              size="md"
            />
            <MimooBlob size="md" expression="love" />
            <MimooAvatar
              config={{ character: 'jaya', skinTone: 'deep', outfit: 'cream', accent: 'purple' }}
              size="md"
            />
          </div>
          <h1 className="font-display text-display-md lg:text-display-lg font-extrabold text-mimoo-ink-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-mimoo-ink-500">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg lg:text-xl text-mimoo-ink-700 leading-relaxed text-center font-display">
            {t('story')}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mimoo-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="purple" className="mb-4">
            {t('missionTitle')}
          </Badge>
          <h2 className="font-display text-display-sm lg:text-display-md font-extrabold text-mimoo-ink-900 mb-4">
            {t('missionDesc')}
          </h2>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-mimoo-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-display-sm lg:text-display-md font-extrabold text-mimoo-ink-900 mb-8 text-center">
            {t('valuesTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => (
              <Card key={v.titleKey} variant="default" className="text-center">
                <div className="text-5xl mb-4" aria-hidden="true">
                  {v.emoji}
                </div>
                <h3 className="font-display text-xl font-bold text-mimoo-ink-900 mb-2">
                  {t(v.titleKey)}
                </h3>
                <p className="text-mimoo-ink-500 text-sm leading-relaxed">{t(v.descKey)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
