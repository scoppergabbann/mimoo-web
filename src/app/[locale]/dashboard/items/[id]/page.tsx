import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { requireAuth } from '@/lib/auth/helpers';
import { getMyItem, getItemReports, getMyEmergencyContact } from '@/lib/items/queries';
import { getCategoryMeta } from '@/lib/items/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { QRCodeDisplay } from '@/components/items/QRCodeDisplay';
import { LostModeToggle } from '@/components/items/LostModeToggle';
import { FinderReportsList } from '@/components/items/FinderReportsList';
import { DeleteItemButton } from '@/components/items/DeleteItemButton';

export const dynamic = 'force-dynamic';

interface ItemDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  await requireAuth(locale as 'id' | 'en');

  const [item, reports, emergencyContact] = await Promise.all([
    getMyItem(id),
    getItemReports(id),
    getMyEmergencyContact(id),
  ]);

  if (!item) notFound();

  const t = await getTranslations('ItemDetail');
  const tLost = await getTranslations('LostMode');
  const tReports = await getTranslations('Reports');

  const category = getCategoryMeta(item.category);

  // Construct public URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const publicUrl = `${appUrl}/found/${item.recovery_code}`;

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 lg:py-12 bg-gradient-cozy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-mimoo-purple-700 hover:text-mimoo-purple-900 font-medium hover:underline focus:outline-none focus-visible:underline"
          >
            ← {t('back')}
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* QR Code section */}
          <Card variant="elevated" className="p-6 lg:p-8">
            <div className="text-center mb-4">
              <h2 className="font-display text-xl font-bold text-mimoo-ink-900">
                {t('qrTitle')}
              </h2>
              <p className="text-sm text-mimoo-ink-500">{t('qrSubtitle')}</p>
            </div>
            <QRCodeDisplay
              url={publicUrl}
              size={240}
              filename={`mimoo-${item.recovery_code}.png`}
            />
          </Card>

          {/* Item details */}
          <Card variant="elevated" className="p-6 lg:p-8">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                {category && (
                  <div
                    className="w-12 h-12 rounded-cozy bg-mimoo-purple-50 flex items-center justify-center text-2xl"
                    aria-hidden="true"
                  >
                    {category.emoji}
                  </div>
                )}
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-mimoo-ink-900">
                    {item.name}
                  </h1>
                  {category && (
                    <p className="text-sm text-mimoo-ink-500">
                      {locale === 'en' ? category.labelEn : category.labelId}
                    </p>
                  )}
                </div>
              </div>
              {item.is_lost && (
                <Badge variant="pink" size="sm">
                  ⚠️ {locale === 'en' ? 'Lost' : 'Hilang'}
                </Badge>
              )}
            </div>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-mimoo-ink-700 mb-1">
                  {t('message')}
                </dt>
                <dd className="text-mimoo-ink-700 leading-relaxed bg-mimoo-cream-100 rounded-cozy p-3">
                  {item.custom_message || (
                    <span className="text-mimoo-ink-300 italic">
                      {t('noMessage')}
                    </span>
                  )}
                </dd>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <dt className="text-xs font-semibold text-mimoo-ink-500 uppercase tracking-wider mb-1">
                    Scans
                  </dt>
                  <dd className="font-display text-2xl font-bold text-mimoo-sky-500">
                    {item.scan_count}
                  </dd>
                  <p className="text-xs text-mimoo-ink-300">
                    {item.scan_count === 0 ? t('noScans') : ''}
                  </p>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-mimoo-ink-500 uppercase tracking-wider mb-1">
                    {tReports('title')}
                  </dt>
                  <dd className="font-display text-2xl font-bold text-mimoo-pink-400">
                    {item.report_count}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 pt-6 border-t border-mimoo-purple-50 flex justify-end">
              <DeleteItemButton
                itemId={item.id}
                labels={{
                  delete: t('delete'),
                  confirm: t('deleteConfirm'),
                  cancel: t('deleteCancel'),
                  confirmYes: t('deleteConfirmYes'),
                  deleting: t('deleting'),
                }}
              />
            </div>
          </Card>
        </div>

        {/* Lost Mode toggle */}
        <div className="mb-6">
          <LostModeToggle
            itemId={item.id}
            itemName={item.name}
            isLost={item.is_lost}
            currentContact={emergencyContact}
            labels={{
              title: tLost('title'),
              description: tLost('description'),
              activate: tLost('activate'),
              deactivate: tLost('deactivate'),
              warningTitle: tLost('warningTitle'),
              warningDesc: tLost('warningDesc'),
              whatsapp: tLost('whatsapp'),
              whatsappPlaceholder: tLost('whatsappPlaceholder'),
              whatsappHelper: tLost('whatsappHelper'),
              rewardCheckbox: tLost('rewardCheckbox'),
              rewardLabel: tLost('rewardLabel'),
              rewardPlaceholder: tLost('rewardPlaceholder'),
              cancel: tLost('cancel'),
              saveAndActivate: tLost('saveAndActivate'),
              confirmDeactivate: tLost('confirmDeactivate'),
              activeTitle: tLost('activeTitle'),
              activeDesc: tLost('activeDesc'),
            }}
          />
        </div>

        {/* Finder Reports */}
        <FinderReportsList
          reports={reports}
          labels={{
            title: tReports('title'),
            empty: tReports('empty'),
            markSeen: tReports('markSeen'),
            markResolved: tReports('markResolved'),
            markSpam: tReports('markSpam'),
            locationLabel: tReports('locationLabel'),
            contactLabel: tReports('contactLabel'),
            statusNew: tReports('statusNew'),
            statusSeen: tReports('statusSeen'),
            statusResolved: tReports('statusResolved'),
            statusSpam: tReports('statusSpam'),
            anonymous: tReports('anonymous'),
            viewOnMap: tReports('viewOnMap'),
          }}
        />
      </div>
    </div>
  );
}
