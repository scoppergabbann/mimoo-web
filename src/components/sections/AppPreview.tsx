import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { CheckIcon, BellIcon, QrCodeIcon, HeartIcon } from '@/components/ui/Icons';

export function AppPreview() {
  const t = useTranslations('AppPreview');

  const features = [
    { icon: <CheckIcon className="w-4 h-4" />, text: t('feature1') },
    { icon: <BellIcon className="w-4 h-4" />, text: t('feature2') },
    { icon: <HeartIcon className="w-4 h-4" />, text: t('feature3') },
    { icon: <QrCodeIcon className="w-4 h-4" />, text: t('feature4') },
  ];

  return (
    <section
      className="py-16 lg:py-24 bg-mimoo-purple-50 overflow-hidden"
      aria-labelledby="app-preview-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-6 order-2 lg:order-1">
            <Badge variant="pink">{t('comingSoon')} ✨</Badge>

            <h2
              id="app-preview-title"
              className="font-display text-display-md lg:text-display-lg font-extrabold text-mimoo-ink-900 leading-tight"
            >
              <span className="block">{t('title')}</span>
              <span className="block text-mimoo-purple-500">{t('subtitle')}</span>
            </h2>

            <ul className="space-y-3">
              {features.map((feat, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 bg-white rounded-cozy p-3 shadow-soft"
                >
                  <span
                    className="w-8 h-8 rounded-full bg-mimoo-purple-100 text-mimoo-purple-500 flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    {feat.icon}
                  </span>
                  <span className="text-mimoo-ink-700 text-sm">{feat.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Phone Mockup */}
          <div className="relative h-[560px] flex items-center justify-center order-1 lg:order-2">
            {/* Phone frame */}
            <div className="relative w-[280px] h-[560px] bg-mimoo-ink-900 rounded-[42px] p-3 shadow-soft-xl">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-mimoo-ink-900 rounded-b-2xl z-10" />

              {/* Screen */}
              <div className="w-full h-full bg-gradient-to-br from-mimoo-purple-50 to-mimoo-cream-100 rounded-[32px] overflow-hidden relative">
                {/* App content mockup */}
                <div className="p-5 pt-10 space-y-4">
                  {/* Top bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-mimoo-ink-500">Hi, halo!</p>
                      <p className="text-base font-display font-bold text-mimoo-ink-900">
                        Fawwaz 👋
                      </p>
                    </div>
                    <MimooAvatar
                      config={{
                        character: 'denpa',
                        skinTone: 'medium',
                        outfit: 'purple',
                        accent: 'purple',
                      }}
                      size="sm"
                      withFrame
                    />
                  </div>

                  {/* My Mimoo card */}
                  <div className="bg-gradient-to-br from-mimoo-purple-400 to-mimoo-purple-600 rounded-cozy-lg p-4 text-white">
                    <p className="text-[10px] uppercase tracking-wider opacity-80 mb-1">My Mimoo</p>
                    <p className="text-lg font-display font-bold">Active</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-mimoo-mint-200 rounded-full animate-pulse" />
                      <span className="text-xs">3 items protected</span>
                    </div>
                  </div>

                  {/* Activity */}
                  <div>
                    <p className="text-xs font-semibold text-mimoo-ink-700 mb-2">Recent Activity</p>
                    <div className="bg-white rounded-cozy p-3 flex items-center gap-3 shadow-soft">
                      <div className="w-8 h-8 bg-mimoo-mint-100 rounded-full flex items-center justify-center text-mimoo-mint-300">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-mimoo-ink-900">KTM ditemukan!</p>
                        <p className="text-[10px] text-mimoo-ink-500">2 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-cozy p-3 flex items-center gap-3 shadow-soft mt-2">
                      <div className="w-8 h-8 bg-mimoo-purple-100 rounded-full flex items-center justify-center text-mimoo-purple-500">
                        <BellIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-mimoo-ink-900">Pesan baru</p>
                        <p className="text-[10px] text-mimoo-ink-500">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom nav */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur p-3 flex justify-around">
                  <div className="w-10 h-10 rounded-full bg-mimoo-purple-100 grid place-items-center text-mimoo-purple-500">
                    <HeartIcon className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-full grid place-items-center text-mimoo-ink-500">
                    <QrCodeIcon className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-full grid place-items-center text-mimoo-ink-500">
                    <BellIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating mascot */}
            <div className="absolute -top-4 -right-4 lg:-right-12">
              <MimooBlob size="lg" expression="happy" />
            </div>

            {/* Decorative sparkles */}
            <div className="absolute top-20 -left-4 w-3 h-3 bg-mimoo-pink-300 rounded-full animate-sparkle" aria-hidden="true" />
            <div className="absolute bottom-20 -right-2 w-2 h-2 bg-mimoo-purple-400 rounded-full animate-sparkle" style={{ animationDelay: '1.5s' }} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
