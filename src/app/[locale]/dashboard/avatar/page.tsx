import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { requireAuth, getUserAvatarConfig } from '@/lib/auth/helpers';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { AvatarCustomizer } from '@/components/avatar/AvatarCustomizer';

export const dynamic = 'force-dynamic';

export default async function AvatarCustomizerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await requireAuth(locale as 'id' | 'en');
  const t = await getTranslations('AvatarCustomizer');

  const initialConfig = getUserAvatarConfig(user);

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 lg:py-12 bg-gradient-cozy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-mimoo-purple-700 hover:text-mimoo-purple-900 font-medium hover:underline focus:outline-none focus-visible:underline"
          >
            ← {t('back')}
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MimooBlob size="lg" expression="sparkle" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-display-md font-extrabold text-mimoo-ink-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-mimoo-ink-500 leading-relaxed max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <AvatarCustomizer
          initialConfig={initialConfig}
          labels={{
            title: t('title'),
            subtitle: t('subtitle'),
            pickCharacter: t('pickCharacter'),
            pickCharacterHelper: t('pickCharacterHelper'),
            comingSoon: t('comingSoon'),
            skinTone: t('skinTone'),
            outfitColor: t('outfitColor'),
            accentColor: t('accentColor'),
            preview: t('preview'),
            save: t('save'),
            cancel: t('cancel'),
            saved: t('saved'),
            saveError: t('saveError'),
          }}
        />
      </div>
    </div>
  );
}
