import { setRequestLocale, getTranslations } from 'next-intl/server';
import { requireAuth, getUserDisplayName, getUserAvatarConfig } from '@/lib/auth/helpers';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LogoutButton } from '@/components/auth/LogoutButton';

// Dashboard pakai cookies untuk auth — harus dynamic
export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Require auth — middleware also protects, but this is a double-check
  const user = await requireAuth(locale as 'id' | 'en');
  const t = await getTranslations('Dashboard');

  const displayName = getUserDisplayName(user);
  const avatarConfig = getUserAvatarConfig(user);

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 lg:py-12 bg-gradient-cozy">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header card */}
        <div className="bg-white rounded-cozy-lg shadow-soft p-6 lg:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="shrink-0">
              <MimooAvatar config={avatarConfig} size="lg" withFrame />
            </div>
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

        {/* Stats placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card variant="default" className="text-center">
            <div className="font-display text-3xl font-extrabold text-mimoo-purple-500 mb-1">
              0
            </div>
            <p className="text-sm text-mimoo-ink-500">{t('stats.itemsProtected')}</p>
          </Card>
          <Card variant="default" className="text-center">
            <div className="font-display text-3xl font-extrabold text-mimoo-sky-500 mb-1">
              0
            </div>
            <p className="text-sm text-mimoo-ink-500">{t('stats.scans')}</p>
          </Card>
          <Card variant="default" className="text-center">
            <div className="font-display text-3xl font-extrabold text-mimoo-pink-400 mb-1">
              0
            </div>
            <p className="text-sm text-mimoo-ink-500">{t('stats.reunions')}</p>
          </Card>
        </div>

        {/* Coming soon block */}
        <Card variant="cozy" className="text-center py-12">
          <div className="flex justify-center mb-4">
            <MimooBlob size="lg" expression="sparkle" />
          </div>
          <Badge variant="purple" className="mb-3">
            🚀 In Progress
          </Badge>
          <h2 className="font-display text-2xl font-bold text-mimoo-ink-900 mb-2">
            {t('comingSoonTitle')}
          </h2>
          <p className="text-mimoo-ink-500 max-w-md mx-auto leading-relaxed">
            {t('comingSoonDesc')}
          </p>
        </Card>
      </div>
    </div>
  );
}
