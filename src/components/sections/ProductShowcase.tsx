import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { ArrowRightIcon, CheckIcon, QrCodeIcon } from '@/components/ui/Icons';

export function ProductShowcase() {
  const t = useTranslations('ProductShowcase');

  const features = [t('feature1'), t('feature2'), t('feature3')];

  return (
    <section
      className="py-16 lg:py-24 bg-white"
      aria-labelledby="product-showcase-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Card visual */}
          <div className="relative h-[420px] sm:h-[480px] flex items-center justify-center">
            {/* Background blob */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-mimoo-purple-100 via-mimoo-pink-50 to-mimoo-sky-50 rounded-cozy-xl"
              aria-hidden="true"
            />

            {/* Card stack — 3 cards layered */}
            <div className="relative">
              {/* Background card 2 */}
              <div className="absolute -bottom-6 -right-6 w-[260px] h-[160px] bg-mimoo-sky-200 rounded-cozy-lg shadow-soft rotate-[8deg]" />
              {/* Background card 1 */}
              <div className="absolute -top-4 -left-4 w-[260px] h-[160px] bg-mimoo-pink-200 rounded-cozy-lg shadow-soft -rotate-[6deg]" />

              {/* Main card */}
              <div className="relative w-[280px] h-[170px] bg-gradient-to-br from-mimoo-purple-400 to-mimoo-purple-600 rounded-cozy-lg shadow-soft-xl p-5 text-white overflow-hidden">
                {/* Decorative pattern */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-white/5 rounded-full" />

                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="font-display font-bold text-lg tracking-tight">Mimoo</span>
                    <div className="w-8 h-8">
                      <MimooAvatar
                        config={{
                          character: 'denpa',
                          skinTone: 'medium',
                          outfit: 'cream',
                          accent: 'purple',
                        }}
                        size="xs"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-white/70 uppercase tracking-wider">Belongs to</p>
                      <p className="text-sm font-semibold">Fawwaz A.</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-md p-1 grid place-items-center">
                      <QrCodeIcon className="w-full h-full text-mimoo-ink-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating sparkles */}
            <div className="absolute top-8 right-8 w-3 h-3 bg-mimoo-purple-300 rounded-full animate-sparkle" />
            <div className="absolute bottom-12 left-12 w-2 h-2 bg-mimoo-pink-400 rounded-full animate-sparkle" style={{ animationDelay: '1s' }} />
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            <Badge variant="purple">{t('badge')}</Badge>

            <h2
              id="product-showcase-title"
              className="font-display text-display-md lg:text-display-lg font-extrabold text-mimoo-ink-900 leading-tight"
            >
              {t('title')}
            </h2>

            <p className="text-lg text-mimoo-ink-500 leading-relaxed">{t('subtitle')}</p>

            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full bg-mimoo-mint-100 text-mimoo-mint-300 flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </span>
                  <span className="text-mimoo-ink-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/products">
              <Button variant="primary" size="lg" rightIcon={<ArrowRightIcon />}>
                {t('shopNow')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
