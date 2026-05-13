import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { requireAuth } from '@/lib/auth/helpers';
import { getMyItem } from '@/lib/items/queries';
import { Card } from '@/components/ui/Card';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { EditItemForm } from '@/components/items/EditItemForm';

export const dynamic = 'force-dynamic';

interface EditItemPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  await requireAuth(locale as 'id' | 'en');

  const item = await getMyItem(id);
  if (!item) notFound();

  const t = await getTranslations('NewItem');
  const tDetail = await getTranslations('ItemDetail');

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 lg:py-12 bg-gradient-cozy">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href={`/dashboard/items/${item.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-mimoo-purple-700 hover:text-mimoo-purple-900 font-medium hover:underline focus:outline-none focus-visible:underline"
          >
            ← {tDetail('back')}
          </Link>
        </div>

        {/* Form card */}
        <Card variant="elevated" className="p-6 sm:p-8">
          <div className="flex justify-center mb-4">
            <MimooBlob size="lg" expression="happy" />
          </div>
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-mimoo-ink-900 mb-2">
              {tDetail('edit')} {item.name}
            </h1>
            <p className="text-mimoo-ink-500 text-sm">
              Recovery code:{' '}
              <code className="font-mono font-semibold text-mimoo-purple-700">
                {item.recovery_code}
              </code>
            </p>
          </div>

          <EditItemForm
            item={item}
            labels={{
              name: t('form.name'),
              nameHelper: t('form.nameHelper'),
              namePlaceholder: t('form.namePlaceholder'),
              category: t('form.category'),
              categoryHelper: t('form.categoryHelper'),
              message: t('form.message'),
              messageHelper: t('form.messageHelper'),
              messagePlaceholder: t('form.messagePlaceholder'),
              save: tDetail('saveChanges'),
              cancel: tDetail('cancel'),
              savedToast: tDetail('savedToast'),
              errorToast: tDetail('errorToast'),
            }}
          />
        </Card>
      </div>
    </div>
  );
}
