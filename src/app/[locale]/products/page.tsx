import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CTA } from '@/components/sections/CTA';
import { ArrowRightIcon, QrCodeIcon } from '@/components/ui/Icons';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';

export default function ProductsPage() {
  const t = useTranslations('ProductsPage');

  const products = [
    {
      key: 'card' as const,
      gradient: 'from-mimoo-purple-300 to-mimoo-purple-500',
      icon: '💳',
    },
    {
      key: 'tag' as const,
      gradient: 'from-mimoo-pink-200 to-mimoo-pink-400',
      icon: '🔑',
    },
    {
      key: 'sticker' as const,
      gradient: 'from-mimoo-sky-200 to-mimoo-sky-500',
      icon: '✨',
    },
  ];

  return (
    <>
      <section className="bg-gradient-cozy py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="purple" className="mb-4">
            {t('title')}
          </Badge>
          <h1 className="font-display text-display-md lg:text-display-lg font-extrabold text-mimoo-ink-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-mimoo-ink-500">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mimoo-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => (
              <Card
                key={product.key}
                variant="elevated"
                className="overflow-hidden hover:-translate-y-1 transition-transform"
              >
                <div
                  className={`relative h-48 -mx-6 -mt-6 mb-6 bg-gradient-to-br ${product.gradient} flex items-center justify-center text-7xl`}
                >
                  <span aria-hidden="true">{product.icon}</span>
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-white/90 rounded-cozy p-1.5 grid place-items-center">
                    <QrCodeIcon className="w-full h-full text-mimoo-ink-900" />
                  </div>
                </div>
                <h2 className="font-display text-2xl font-bold text-mimoo-ink-900 mb-2">
                  {t(`${product.key}.name`)}
                </h2>
                <p className="text-mimoo-ink-500 mb-4 leading-relaxed">
                  {t(`${product.key}.desc`)}
                </p>
                <p className="text-mimoo-purple-700 font-semibold mb-6">
                  {t(`${product.key}.price`)}
                </p>
                <Button variant="primary" rightIcon={<ArrowRightIcon />} className="w-full">
                  {t('buyNow')}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
