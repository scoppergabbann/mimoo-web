import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  requireAuth,
  getUserDisplayName,
  getUserAvatarConfig,
  needsOnboarding,
} from '@/lib/auth/helpers';
import { getMyItems, getUnreadReports } from '@/lib/items/queries';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { ItemCard } from '@/components/items/ItemCard';
import { ItemsList } from '@/components/items/ItemsList';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await requireAuth(locale as 'id' | 'en');
  const t = await getTranslations('Dashboard');
  const tOnboard = await getTranslations('Onboarding');
  const tList = await getTranslations('ItemsList');

  const [items, unreadReports, shouldOnboard] = await Promise.all([
    getMyItems(),
    getUnreadReports(),
    needsOnboarding(user.id),
  ]);

  const displayName = getUserDisplayName(user);
  const avatarConfig = getUserAvatarConfig(user);

  // Stats
  const totalScans = items.reduce((sum, i) => sum + i.scan_count, 0);
  const totalReports = items.reduce((sum, i) => sum + i.report_count, 0);

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 lg:py-12 bg-gradient-cozy">
      {/* Onboarding modal — shown only for first-time users */}
      {shouldOnboard && (
        <OnboardingModal
          userName={displayName}
          avatarConfig={avatarConfig}
          labels={{
            skipButton: tOnboard('skipButton'),
            nextButton: tOnboard('nextButton'),
            backButton: tOnboard('backButton'),
            finishButton: tOnboard('finishButton'),
            step1: {
              title: tOnboard('step1.title'),
              subtitle: tOnboard('step1.subtitle'),
              welcomeMessage: tOnboard('step1.welcomeMessage'),
            },
            step2: {
              title: tOnboard('step2.title'),
              subtitle: tOnboard('step2.subtitle'),
              steps: tOnboard.raw('step2.steps') as { emoji: string; title: string; desc: string }[],
            },
            step3: {
              title: tOnboard('step3.title'),
              subtitle: tOnboard('step3.subtitle'),
              primaryCta: tOnboard('step3.primaryCta'),
              secondaryCta: tOnboard('step3.secondaryCta'),
            },
          }}
        />
      )}      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header card */}
        <div className="bg-white rounded-cozy-lg shadow-soft p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Link
              href="/dashboard/avatar"
              className="shrink-0 group focus:outline-none focus-visible:ring-4 focus-visible:ring-mimoo-purple-100 rounded-full transition-transform motion-safe:hover:scale-105"
              aria-label="Ubah avatar"
            >
              <div className="relative">
                <MimooAvatar config={avatarConfig} size="lg" withFrame />
                <span
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-mimoo-purple-500 text-white text-sm flex items-center justify-center shadow-soft group-hover:bg-mimoo-purple-700 transition-colors"
                  aria-hidden="true"
                >
                  ✏️
                </span>
              </div>
            </Link>
            <div className="flex-1">
              <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-mimoo-ink-900 mb-1">
                {t('greeting', { name: displayName })}
              </h1>
              <p className="text-mimoo-ink-500">{t('subtitle')}</p>
              <p className="text-xs text-mimoo-ink-300 mt-2">{user.email}</p>
            </div>
            <div className="shrink-0">
              <LogoutButton label={t('logout')} />
            </div>
          </div>
        </div>

        {/* Stats */}
        {items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card variant="default" className="text-center">
              <div className="font-display text-3xl font-extrabold text-mimoo-purple-500 mb-1">
                {items.length}
              </div>
              <p className="text-xs text-mimoo-ink-500">{t('stats.itemsProtected')}</p>
            </Card>
            <Card variant="default" className="text-center">
              <div className="font-display text-3xl font-extrabold text-mimoo-sky-500 mb-1">
                {totalScans}
              </div>
              <p className="text-xs text-mimoo-ink-500">{t('stats.scans')}</p>
            </Card>
            <Card variant="default" className="text-center">
              <div className="font-display text-3xl font-extrabold text-mimoo-pink-400 mb-1">
                {totalReports}
              </div>
              <p className="text-xs text-mimoo-ink-500">{t('stats.reunions')}</p>
            </Card>
            <Card
              variant="default"
              className={
                unreadReports.length > 0
                  ? 'text-center ring-2 ring-mimoo-purple-300 bg-mimoo-purple-50'
                  : 'text-center'
              }
            >
              <div className="font-display text-3xl font-extrabold text-mimoo-purple-700 mb-1">
                {unreadReports.length}
              </div>
              <p className="text-xs text-mimoo-ink-500">{t('stats.newReports')}</p>
            </Card>
          </div>
        )}

        {/* Items section */}
        {items.length === 0 ? (
          // Empty state
          <Card variant="cozy" className="text-center py-12 lg:py-16">
            <div className="flex justify-center mb-4">
              <MimooBlob size="xl" expression="sparkle" />
            </div>
            <h2 className="font-display text-2xl font-bold text-mimoo-ink-900 mb-2">
              {t('emptyState.title')}
            </h2>
            <p className="text-mimoo-ink-500 max-w-md mx-auto leading-relaxed mb-6">
              {t('emptyState.description')}
            </p>
            <Link href="/dashboard/items/new">
              <Button variant="primary" size="lg" rightIcon={<ArrowRightIcon />}>
                ✨ {t('emptyState.cta')}
              </Button>
            </Link>
          </Card>
        ) : (
          // Items list
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-mimoo-ink-900">
                {t('yourItems')}
                <Badge variant="purple" size="sm" className="ml-2">
                  {items.length}
                </Badge>
              </h2>
              <Link href="/dashboard/items/new">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<span aria-hidden="true">＋</span>}
                >
                  {t('addNew')}
                </Button>
              </Link>
            </div>
            <ItemsList
              items={items}
              labels={{
                searchPlaceholder: tList('searchPlaceholder'),
                filterStatus: tList('filterStatus'),
                filterCategory: tList('filterCategory'),
                sortBy: tList('sortBy'),
                statusAll: tList('statusAll'),
                statusActive: tList('statusActive'),
                statusLost: tList('statusLost'),
                sortNewest: tList('sortNewest'),
                sortOldest: tList('sortOldest'),
                sortMostScanned: tList('sortMostScanned'),
                sortMostReported: tList('sortMostReported'),
                noResults: tList('noResults'),
                showing: tList('showing'),
                of: tList('of'),
                items: tList('items'),
                clear: tList('clear'),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
