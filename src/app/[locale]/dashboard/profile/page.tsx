import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { requireAuth, getUserDisplayName, getUserAvatarConfig } from '@/lib/auth/helpers';
import { getMyItems } from '@/lib/items/queries';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { ProfileForm } from '@/components/profile/ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await requireAuth(locale as 'id' | 'en');
  const t = await getTranslations('Profile');

  const displayName = getUserDisplayName(user);
  const avatarConfig = getUserAvatarConfig(user);

  // Fetch profile data from DB (for locale preference)
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('locale, created_at')
    .eq('id', user.id)
    .maybeSingle();

  const userLocale = (profile?.locale === 'en' ? 'en' : 'id') as 'id' | 'en';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(
        locale === 'id' ? 'id-ID' : 'en-US',
        { year: 'numeric', month: 'long' }
      )
    : '';

  // Fetch stats
  const items = await getMyItems();
  const totalScans = items.reduce((sum, i) => sum + i.scan_count, 0);
  const totalReports = items.reduce((sum, i) => sum + i.report_count, 0);
  const lostItems = items.filter((i) => i.is_lost).length;

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 lg:py-12 bg-gradient-cozy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back link */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-mimoo-purple-700 hover:text-mimoo-purple-900 font-medium hover:underline focus:outline-none focus-visible:underline"
          >
            ← {t('back')}
          </Link>
        </div>

        {/* Header card */}
        <Card variant="elevated" className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Link
              href="/dashboard/avatar"
              className="shrink-0 group focus:outline-none focus-visible:ring-4 focus-visible:ring-mimoo-purple-100 rounded-full transition-transform motion-safe:hover:scale-105"
              aria-label={t('editAvatar')}
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
                {displayName}
              </h1>
              <p className="text-mimoo-ink-500 mb-2">{user.email}</p>
              {memberSince && (
                <p className="text-xs text-mimoo-ink-300">
                  {t('memberSince')}: {memberSince}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Mimoo Stats */}
        <div>
          <h2 className="font-display text-lg font-bold text-mimoo-ink-900 mb-3">
            {t('stats.title')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card variant="default" className="text-center">
              <div className="font-display text-3xl font-extrabold text-mimoo-purple-500 mb-1">
                {items.length}
              </div>
              <p className="text-xs text-mimoo-ink-500">{t('stats.items')}</p>
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
              <p className="text-xs text-mimoo-ink-500">{t('stats.reports')}</p>
            </Card>
            <Card
              variant="default"
              className={
                lostItems > 0
                  ? 'text-center ring-2 ring-mimoo-pink-300 bg-mimoo-pink-50'
                  : 'text-center'
              }
            >
              <div className="font-display text-3xl font-extrabold text-mimoo-pink-400 mb-1">
                {lostItems}
              </div>
              <p className="text-xs text-mimoo-ink-500">{t('stats.lost')}</p>
            </Card>
          </div>
        </div>

        {/* Edit profile form */}
        <Card variant="elevated" className="p-6 lg:p-8">
          <h2 className="font-display text-xl font-bold text-mimoo-ink-900 mb-1">
            {t('form.title')}
          </h2>
          <p className="text-sm text-mimoo-ink-500 mb-6">{t('form.subtitle')}</p>

          <ProfileForm
            initialName={displayName}
            initialLocale={userLocale}
            labels={{
              name: t('form.name'),
              nameHelper: t('form.nameHelper'),
              namePlaceholder: t('form.namePlaceholder'),
              locale: t('form.locale'),
              localeHelper: t('form.localeHelper'),
              localeId: t('form.localeIdLabel'),
              localeEn: t('form.localeEnLabel'),
              save: t('form.save'),
              savedToast: t('form.savedToast'),
              errorToast: t('form.errorToast'),
            }}
          />
        </Card>

        {/* Account info card */}
        <Card variant="default">
          <h2 className="font-display text-xl font-bold text-mimoo-ink-900 mb-3">
            {t('account.title')}
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <dt className="font-medium text-mimoo-ink-500">{t('account.email')}</dt>
              <dd className="text-mimoo-ink-900 font-semibold">{user.email}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="font-medium text-mimoo-ink-500">{t('account.signedInWith')}</dt>
              <dd>
                <Badge variant="purple" size="sm">
                  {user.app_metadata?.provider === 'google' ? '🔵 Google' : '📧 Email'}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="font-medium text-mimoo-ink-500">{t('account.userId')}</dt>
              <dd>
                <code className="text-xs text-mimoo-ink-300 font-mono">
                  {user.id.substring(0, 8)}...
                </code>
              </dd>
            </div>
          </dl>
        </Card>

        {/* Danger zone */}
        <Card variant="default" className="border-2 border-mimoo-pink-200">
          <h2 className="font-display text-lg font-bold text-mimoo-pink-400 mb-2">
            ⚠️ {t('danger.title')}
          </h2>
          <p className="text-sm text-mimoo-ink-500 leading-relaxed mb-4">
            {t('danger.deleteDescription')}
          </p>
          <a
            href={`mailto:hello@mimoo.id?subject=${encodeURIComponent(
              '[Request Hapus Akun] ' + user.email
            )}&body=${encodeURIComponent(
              'Halo tim Mimoo,\n\nSaya ingin menghapus akun saya beserta semua data terkait.\n\nUser ID: ' +
                user.id +
                '\n\nTerima kasih.'
            )}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-semibold text-mimoo-pink-400 hover:bg-mimoo-pink-50 border-2 border-mimoo-pink-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-pink-400"
          >
            {t('danger.deleteButton')}
          </a>
        </Card>
      </div>
    </div>
  );
}
