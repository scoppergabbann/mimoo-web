import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { requireAuth } from '@/lib/auth/helpers';
import { Card } from '@/components/ui/Card';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { NewItemForm } from '@/components/items/NewItemForm';

export const dynamic = 'force-dynamic';

export default async function NewItemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requireAuth(locale as 'id' | 'en');

  const t = await getTranslations('NewItem');

  const examples = [
    t('examples.wallet'),
    t('examples.ktm'),
    t('examples.sim'),
    t('examples.ktp'),
    t('examples.bag'),
    t('examples.laptop'),
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 lg:py-12 bg-gradient-cozy">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-mimoo-purple-700 hover:text-mimoo-purple-900 font-medium hover:underline focus:outline-none focus-visible:underline"
          >
            ← {t('back')}
          </Link>
        </div>

        {/* Form card */}
        <Card variant="elevated" className="p-6 sm:p-8">
          <div className="flex justify-center mb-4">
            <MimooBlob size="lg" expression="sparkle" />
          </div>
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-mimoo-ink-900 mb-2">
              {t('title')}
            </h1>
            <p className="text-mimoo-ink-500">{t('subtitle')}</p>
          </div>

          <NewItemForm
            examples={examples}
            placeholders={{
              name: t('form.namePlaceholder'),
              message: t('form.messagePlaceholder'),
            }}
            labels={{
              name: t('form.name'),
              nameHelper: t('form.nameHelper'),
              category: t('form.category'),
              categoryHelper: t('form.categoryHelper'),
              message: t('form.message'),
              messageHelper: t('form.messageHelper'),
              examplesTitle: t('form.examplesTitle'),
              submit: t('form.submit'),
              cancel: t('form.cancel'),
            }}
          />
        </Card>
      </div>
    </div>
  );
}
