import { Link } from '@/i18n/navigation';
import { MimooLogo } from '@/components/layout/MimooLogo';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRightIcon, HeartIcon } from '@/components/ui/Icons';
import { getCategoryMeta } from '@/lib/items/types';
import { EmergencyContactReveal } from './EmergencyContactReveal';
import type { PublicItem, EmergencyContactDecrypted } from '@/lib/items/types';
import type { CharacterId, SkinTone, OutfitColor, AccentColor } from '@/lib/avatar/types';
import { cn } from '@/lib/utils';

interface RecoveryPageProps {
  item: PublicItem;
  emergencyContact: EmergencyContactDecrypted | null;
  labels: {
    // Normal mode
    badge: string;
    thankYou: string;
    belongsTo: string;
    foundButton: string;
    // Lost mode
    lostBadge: string;
    lostUrgentTitle: string;
    lostUrgentDesc: string;
    rewardBadge: string;
    rewardLabel: string;
    contactTitle: string;
    contactDesc: string;
    // Footer
    poweredBy: string;
    learnMoreAboutMimoo: string;
  };
}

export function RecoveryPage({ item, emergencyContact, labels }: RecoveryPageProps) {
  const category = getCategoryMeta(item.category);
  const ownerName = item.owner_name || 'Sahabat Mimoo';

  const avatarConfig = item.owner_avatar
    ? {
        character: item.owner_avatar.character as CharacterId,
        skinTone: item.owner_avatar.skinTone as SkinTone,
        outfit: item.owner_avatar.outfit as OutfitColor,
        accent: item.owner_avatar.accent as AccentColor,
      }
    : null;

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col',
        item.is_lost
          ? 'bg-gradient-to-br from-mimoo-pink-50 via-mimoo-cream-100 to-mimoo-purple-50'
          : 'bg-gradient-cozy'
      )}
    >
      {/* Top bar */}
      <header className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto w-full">
        <Link href="/" className="inline-block">
          <MimooLogo size="md" />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Lost mode urgent banner */}
          {item.is_lost && (
            <div className="mb-6 rounded-cozy-lg p-5 bg-gradient-to-br from-mimoo-pink-100 to-mimoo-pink-200 border-2 border-mimoo-pink-300 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0 motion-safe:animate-pulse" aria-hidden="true">
                  ⚠️
                </span>
                <div>
                  <Badge variant="pink" className="mb-2 bg-white">
                    {labels.lostBadge}
                  </Badge>
                  <h2 className="font-display text-lg font-bold text-mimoo-ink-900 mb-1">
                    {labels.lostUrgentTitle}
                  </h2>
                  <p className="text-sm text-mimoo-ink-700 leading-relaxed">
                    {labels.lostUrgentDesc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hero card */}
          <Card variant="elevated" className="text-center mb-6 overflow-visible">
            <div className="flex justify-center mb-4">
              {avatarConfig ? (
                <MimooAvatar config={avatarConfig} size="xl" withFrame />
              ) : (
                <MimooBlob size="xl" expression="happy" />
              )}
            </div>

            {!item.is_lost && (
              <Badge variant="purple" className="mb-3">
                ✨ {labels.badge}
              </Badge>
            )}

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-mimoo-ink-900 mb-2">
              {item.name}
            </h1>

            {category && (
              <p className="text-sm text-mimoo-ink-500 mb-2 inline-flex items-center gap-1">
                <span aria-hidden="true">{category.emoji}</span>
                <span>{category.labelId}</span>
              </p>
            )}

            <p className="text-sm text-mimoo-ink-700 mb-4">
              {labels.belongsTo}{' '}
              <span className="font-display font-bold text-mimoo-purple-700">
                {ownerName}
              </span>
            </p>

            {item.custom_message && (
              <div className="bg-mimoo-cream-100 rounded-cozy-lg p-4 mb-4 text-left">
                <p className="text-sm text-mimoo-ink-900 leading-relaxed whitespace-pre-wrap break-words">
                  &ldquo;{item.custom_message}&rdquo;
                </p>
              </div>
            )}

            {/* Emergency contact (lost mode only) */}
            {item.is_lost && emergencyContact && (
              <EmergencyContactReveal
                recoveryCode={item.recovery_code}
                contact={emergencyContact}
                labels={{
                  title: labels.contactTitle,
                  description: labels.contactDesc,
                  rewardBadge: labels.rewardBadge,
                  rewardLabel: labels.rewardLabel,
                }}
              />
            )}

            <p className="text-xs sm:text-sm text-mimoo-ink-500 mt-6 mb-4 leading-relaxed">
              <HeartIcon className="inline w-4 h-4 text-mimoo-pink-400 mr-1 mb-0.5" />
              {labels.thankYou}
            </p>

            <Link href={`/found/${item.recovery_code}/report` as never}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRightIcon />}
                className="w-full sm:w-auto"
              >
                💌 {labels.foundButton}
              </Button>
            </Link>
          </Card>

          {/* Footer */}
          <footer className="text-center pt-6">
            <p className="text-xs text-mimoo-ink-300 mb-2">{labels.poweredBy}</p>
            <Link
              href="/"
              className="text-sm text-mimoo-purple-700 hover:text-mimoo-purple-900 font-semibold hover:underline"
            >
              {labels.learnMoreAboutMimoo}
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}
