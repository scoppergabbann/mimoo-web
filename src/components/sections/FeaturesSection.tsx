import { useTranslations } from 'next-intl';
import { QrCodeIcon, ChatIcon, ShieldIcon, LockIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

export function FeaturesSection() {
  const t = useTranslations('Features');

  const features = [
    {
      icon: <QrCodeIcon className="w-7 h-7" />,
      title: t('scan.title'),
      desc: t('scan.desc'),
      color: 'bg-mimoo-purple-100 text-mimoo-purple-500',
    },
    {
      icon: <ChatIcon className="w-7 h-7" />,
      title: t('connect.title'),
      desc: t('connect.desc'),
      color: 'bg-mimoo-sky-100 text-mimoo-sky-500',
    },
    {
      icon: <ShieldIcon className="w-7 h-7" />,
      title: t('return.title'),
      desc: t('return.desc'),
      color: 'bg-mimoo-mint-100 text-mimoo-mint-300',
    },
    {
      icon: <LockIcon className="w-7 h-7" />,
      title: t('private.title'),
      desc: t('private.desc'),
      color: 'bg-mimoo-pink-100 text-mimoo-pink-400',
    },
  ];

  return (
    <section
      className="py-16 lg:py-24 bg-mimoo-cream-100"
      aria-labelledby="features-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2
            id="features-title"
            className="font-display text-display-md lg:text-display-lg font-extrabold text-mimoo-ink-900 mb-4"
          >
            {t('title')}
          </h2>
          <p className="text-lg text-mimoo-ink-500">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-cozy-lg p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={cn(
                  'w-14 h-14 rounded-cozy flex items-center justify-center mb-4',
                  feature.color
                )}
                aria-hidden="true"
              >
                {feature.icon}
              </div>
              <h3 className="font-display text-xl font-bold text-mimoo-ink-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-mimoo-ink-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
