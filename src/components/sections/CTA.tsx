import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { ArrowRightIcon, HeartIcon } from '@/components/ui/Icons';

export function CTA() {
  const t = useTranslations('CTA');

  return (
    <section
      className="py-16 lg:py-24 relative overflow-hidden"
      aria-labelledby="cta-title"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-mimoo-purple-400 via-mimoo-purple-500 to-mimoo-purple-700 rounded-cozy-xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden shadow-soft-xl">
          {/* Decorative shapes */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" aria-hidden="true" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-mimoo-pink-300/20 rounded-full" aria-hidden="true" />
          <div className="absolute top-8 left-8 w-3 h-3 bg-white rounded-full animate-sparkle" aria-hidden="true" />
          <div className="absolute bottom-12 right-12 w-2 h-2 bg-mimoo-cream-100 rounded-full animate-sparkle" style={{ animationDelay: '1s' }} aria-hidden="true" />
          <div className="absolute top-1/3 right-16 w-2 h-2 bg-white rounded-full animate-sparkle" style={{ animationDelay: '2s' }} aria-hidden="true" />

          {/* Floating mascot */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <MimooBlob size="md" expression="love" />
          </div>

          {/* Content */}
          <div className="relative pt-12 max-w-3xl mx-auto">
            <HeartIcon className="w-8 h-8 text-mimoo-pink-300 mx-auto mb-4" aria-hidden="true" />
            <blockquote
              id="cta-title"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight"
            >
              &ldquo;{t('title')}&rdquo;
            </blockquote>
            <p className="text-mimoo-purple-100 text-lg mb-8 leading-relaxed">
              {t('subtitle')}
            </p>
            <Link href="/get-started">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRightIcon />}
                className="bg-white text-mimoo-purple-700 hover:bg-mimoo-cream-100"
              >
                {t('button')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
