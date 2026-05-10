import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FloatingCard } from '@/components/ui/FloatingCard';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import {
  ShieldIcon,
  BellIcon,
  HeartIcon,
  ArrowRightIcon,
  PlayIcon,
  QrCodeIcon,
} from '@/components/ui/Icons';

export function Hero() {
  const t = useTranslations('Hero');

  const worksFor = [
    { label: t('worksForKtp'), emoji: '🪪' },
    { label: t('worksForSim'), emoji: '🚗' },
    { label: t('worksForKtm'), emoji: '🎓' },
    { label: t('worksForKantor'), emoji: '🏢' },
    { label: t('worksForAtm'), emoji: '💳' },
    { label: t('worksForMore'), emoji: '✨' },
  ];

  return (
    <section
      className="relative overflow-hidden bg-gradient-cozy pt-8 pb-12 lg:pt-16 lg:pb-20"
      aria-labelledby="hero-title"
    >
      {/* Decorative background sparkles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-3 h-3 bg-mimoo-purple-300 rounded-full animate-sparkle opacity-60" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-mimoo-pink-300 rounded-full animate-sparkle opacity-50" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-mimoo-sky-300 rounded-full animate-sparkle opacity-60" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6 lg:space-y-8 motion-safe:animate-fade-up">
            <Badge variant="purple" size="md" className="inline-flex items-center gap-1.5">
              <span>{t('badge')}</span>
              <span className="motion-safe:animate-wave inline-block origin-bottom-right">👋</span>
            </Badge>

            <h1
              id="hero-title"
              className="font-display text-4xl sm:text-5xl lg:text-display-xl font-extrabold text-mimoo-ink-900 leading-[1.05] tracking-tight"
            >
              <span className="block">{t('titlePart1')}</span>
              <span className="block text-mimoo-purple-500">{t('titlePart2')}</span>
              <span className="block">
                {t('titlePart3')}{' '}
                <span className="inline-block motion-safe:animate-float text-mimoo-purple-400">💜</span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-mimoo-ink-500 max-w-xl leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link href="/get-started">
                <Button variant="primary" size="lg" rightIcon={<ArrowRightIcon />}>
                  {t('createMimoo')}
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg" rightIcon={<PlayIcon className="w-4 h-4" />}>
                  {t('howItWorks')}
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {(['denpa', 'jaya', 'salma', 'kupa'] as const).map((char, i) => (
                  <div
                    key={char}
                    className="w-10 h-10 rounded-full bg-mimoo-purple-100 ring-2 ring-mimoo-cream-100 overflow-hidden"
                    style={{ zIndex: 4 - i }}
                  >
                    <MimooAvatar
                      config={{
                        character: char,
                        skinTone: 'medium',
                        outfit: 'purple',
                        accent: 'purple',
                      }}
                      size="xs"
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-mimoo-ink-900">
                  {t('trustText')}
                </p>
                <p className="text-xs text-mimoo-ink-500">{t('trustSubtext')}</p>
              </div>
            </div>
          </div>

          {/* Right: Visual Composition */}
          <div className="relative h-[420px] sm:h-[500px] lg:h-[560px]">
            {/* Main QR Card with avatar */}
            <div
              className="absolute top-12 left-1/2 lg:left-8 -translate-x-1/2 lg:translate-x-0 w-[280px] sm:w-[320px] motion-safe:animate-fade-up"
              style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
            >
              <div className="bg-gradient-to-br from-mimoo-purple-100 to-mimoo-purple-200 rounded-cozy-xl p-6 shadow-soft-xl rotate-[-4deg] hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-cozy-lg p-5 space-y-3">
                  <div className="text-xs font-semibold text-mimoo-purple-500 uppercase tracking-wider">
                    Mimoo
                  </div>
                  <div className="flex justify-center py-2">
                    <MimooAvatar
                      config={{
                        character: 'denpa',
                        skinTone: 'medium',
                        outfit: 'purple',
                        accent: 'purple',
                      }}
                      size="lg"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-mimoo-ink-500">This card belongs to</p>
                    <p className="text-lg font-display font-bold text-mimoo-ink-900">
                      Fawwaz A.
                    </p>
                  </div>
                  <div className="bg-mimoo-cream-100 rounded-cozy p-3 flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-md p-1 grid place-items-center">
                      <QrCodeIcon className="w-full h-full text-mimoo-ink-900" />
                    </div>
                    <p className="text-xs text-mimoo-ink-700">
                      Scan to <br />
                      return me{' '}
                      <span className="text-mimoo-purple-500" aria-hidden="true">
                        💜
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Mimoo Blob */}
            <div className="absolute bottom-20 left-4 lg:bottom-32 lg:-left-4">
              <MimooBlob size="lg" expression="wink" />
            </div>

            {/* Floating Cards (right side) */}
            <div className="hidden lg:block absolute top-4 right-0">
              <FloatingCard
                icon={<ShieldIcon />}
                title={t('floatingCard1Title')}
                description={t('floatingCard1Desc')}
                iconBgColor="purple"
                delay={400}
              />
            </div>
            <div className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2">
              <FloatingCard
                icon={<BellIcon />}
                title={t('floatingCard2Title')}
                description={t('floatingCard2Desc')}
                iconBgColor="blue"
                delay={600}
              />
            </div>
            <div className="hidden lg:block absolute bottom-8 right-0">
              <FloatingCard
                icon={<HeartIcon />}
                title={t('floatingCard3Title')}
                description={t('floatingCard3Desc')}
                iconBgColor="pink"
                delay={800}
              />
            </div>
          </div>
        </div>

        {/* Works for ribbon */}
        <div className="mt-12 lg:mt-16 bg-white rounded-cozy-lg shadow-soft p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
            <p className="text-sm font-semibold text-mimoo-ink-700 shrink-0">
              {t('worksFor')}
            </p>
            <ul className="flex flex-wrap gap-2 sm:gap-3">
              {worksFor.map((item) => (
                <li
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mimoo-purple-50 rounded-pill text-sm text-mimoo-ink-700"
                >
                  <span aria-hidden="true">{item.emoji}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
