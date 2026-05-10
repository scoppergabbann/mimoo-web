import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { QrCodeIcon, BellIcon, HeartIcon } from '@/components/ui/Icons';

export function HowItWorksSection() {
  const t = useTranslations('HowItWorks');

  const steps = [
    {
      number: 1,
      title: t('step1Title'),
      desc: t('step1Desc'),
      visual: (
        <div className="w-20 h-20 grid place-items-center">
          <MimooAvatar
            config={{ character: 'denpa', skinTone: 'medium', outfit: 'purple', accent: 'purple' }}
            size="md"
          />
        </div>
      ),
    },
    {
      number: 2,
      title: t('step2Title'),
      desc: t('step2Desc'),
      visual: (
        <div className="w-20 h-20 grid place-items-center text-5xl">
          🎒
        </div>
      ),
    },
    {
      number: 3,
      title: t('step3Title'),
      desc: t('step3Desc'),
      visual: (
        <div className="w-20 h-20 grid place-items-center bg-mimoo-purple-100 rounded-cozy">
          <QrCodeIcon className="w-12 h-12 text-mimoo-purple-700" />
        </div>
      ),
    },
    {
      number: 4,
      title: t('step4Title'),
      desc: t('step4Desc'),
      visual: (
        <div className="w-20 h-20 grid place-items-center bg-mimoo-sky-100 rounded-cozy">
          <BellIcon className="w-12 h-12 text-mimoo-sky-500" />
        </div>
      ),
    },
    {
      number: 5,
      title: t('step5Title'),
      desc: t('step5Desc'),
      visual: (
        <div className="w-20 h-20 grid place-items-center">
          <MimooBlob size="md" expression="love" animated={false} />
        </div>
      ),
    },
  ];

  return (
    <section
      className="bg-mimoo-purple-50 py-16 lg:py-24"
      aria-labelledby="how-it-works-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <Badge variant="purple" className="mb-4">
            ✦ {t('badge')}
          </Badge>
          <h2
            id="how-it-works-title"
            className="font-display text-display-md lg:text-display-lg font-extrabold text-mimoo-ink-900 mb-4"
          >
            {t('title').split(' ').map((word, i, arr) =>
              i === 1 ? (
                <span key={i} className="text-mimoo-purple-500">
                  {word}{i < arr.length - 1 ? ' ' : ''}
                </span>
              ) : (
                <span key={i}>{word}{i < arr.length - 1 ? ' ' : ''}</span>
              )
            )}
          </h2>
          <p className="text-lg text-mimoo-ink-500">{t('subtitle')}</p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {steps.map((step) => (
            <li
              key={step.number}
              className="bg-white rounded-cozy-lg p-6 shadow-soft hover:shadow-soft-lg transition-shadow text-center relative group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-mimoo-purple-500 text-white font-bold text-sm shadow-soft"
                  aria-label={`Langkah ${step.number}`}
                >
                  {step.number}
                </span>
              </div>
              <div className="flex justify-center mb-4 mt-2">
                {step.visual}
              </div>
              <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-mimoo-ink-500 leading-relaxed">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
