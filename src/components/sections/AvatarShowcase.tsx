import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { Link } from '@/i18n/navigation';
import { ArrowRightIcon } from '@/components/ui/Icons';

export function AvatarShowcase() {
  const t = useTranslations('Avatars');

  const featuredCharacters = [
    {
      id: 'denpa' as const,
      key: 'denpa' as const,
      outfit: 'purple' as const,
      skin: 'medium' as const,
      bgColor: 'bg-mimoo-purple-50',
    },
    {
      id: 'jaya' as const,
      key: 'jaya' as const,
      outfit: 'cream' as const,
      skin: 'deep' as const,
      bgColor: 'bg-mimoo-cream-200',
    },
    {
      id: 'salma' as const,
      key: 'salma' as const,
      outfit: 'pink' as const,
      skin: 'light' as const,
      bgColor: 'bg-mimoo-pink-50',
    },
    {
      id: 'kupa' as const,
      key: 'kupa' as const,
      outfit: 'blue' as const,
      skin: 'tan' as const,
      bgColor: 'bg-mimoo-sky-50',
    },
  ];

  // Coming soon characters
  const comingSoon = ['gadhing', 'tarra', 'minang', 'toraja', 'lombo', 'manda', 'batak', 'banda'] as const;

  return (
    <section
      className="py-16 lg:py-24 bg-gradient-cozy"
      aria-labelledby="avatars-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <Badge variant="cream" className="mb-4">
            {t('badge')}
          </Badge>
          <h2
            id="avatars-title"
            className="font-display text-display-md lg:text-display-lg font-extrabold text-mimoo-ink-900 mb-4"
          >
            {t('title').split(' ').map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-mimoo-purple-500">
                  {word}
                </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h2>
          <p className="text-lg text-mimoo-ink-500 leading-relaxed">{t('subtitle')}</p>
        </div>

        {/* Featured characters - 4 detailed cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {featuredCharacters.map((char) => (
            <Card
              key={char.id}
              variant="default"
              className={`${char.bgColor} text-center hover:scale-105 transition-transform duration-300 cursor-pointer group`}
            >
              <div className="flex justify-center mb-4">
                <MimooAvatar
                  config={{
                    character: char.id,
                    skinTone: char.skin,
                    outfit: char.outfit,
                    accent: 'purple',
                  }}
                  size="lg"
                  className="motion-safe:group-hover:animate-float"
                />
              </div>
              <h3 className="font-display text-xl font-bold text-mimoo-ink-900 mb-1">
                {t(`characters.${char.key}.name`)}
              </h3>
              <p className="text-xs text-mimoo-ink-500 mb-2">
                {t(`characters.${char.key}.origin`)}
              </p>
              <Badge variant="purple" size="sm">
                {t(`characters.${char.key}.vibe`)}
              </Badge>
            </Card>
          ))}
        </div>

        {/* Coming soon characters - small placeholders */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 lg:gap-3 max-w-3xl mx-auto opacity-70">
          {comingSoon.map((charId) => (
            <div
              key={charId}
              className="aspect-square bg-white rounded-cozy p-2 flex items-center justify-center shadow-soft"
              title={t('characters.comingSoon')}
            >
              <MimooAvatar
                config={{
                  character: charId,
                  skinTone: 'medium',
                  outfit: 'purple',
                  accent: 'purple',
                }}
                size="sm"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-mimoo-purple-700 hover:text-mimoo-purple-900 font-semibold text-sm group focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400 rounded-pill px-3 py-1"
          >
            <span>{t('exploreAll')}</span>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
