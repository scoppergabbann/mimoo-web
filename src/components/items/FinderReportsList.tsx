'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReunionModal } from '@/components/reunions/ReunionModal';
import { updateReportStatusAction } from '@/lib/items/actions';
import type { FinderReport, ReportStatus } from '@/lib/items/types';

interface FinderReportsListProps {
  reports: FinderReport[];
  itemId: string;
  labels: {
    title: string;
    empty: string;
    markSeen: string;
    markResolved: string;
    markSpam: string;
    locationLabel: string;
    contactLabel: string;
    statusNew: string;
    statusSeen: string;
    statusResolved: string;
    statusSpam: string;
    anonymous: string;
    viewOnMap: string;
  };
  reunionLabels: {
    title: string;
    subtitle: string;
    storyLabel: string;
    storyPlaceholder: string;
    storyHelper: string;
    displayNameLabel: string;
    displayNamePlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    anonymous: string;
    submit: string;
    skip: string;
    successToast: string;
    errorToast: string;
  };
}

function formatRelativeTime(iso: string, locale: string = 'id'): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return locale === 'id' ? 'Baru saja' : 'Just now';
  if (minutes < 60) return locale === 'id' ? `${minutes} menit lalu` : `${minutes}m ago`;
  if (hours < 24) return locale === 'id' ? `${hours} jam lalu` : `${hours}h ago`;
  if (days < 7) return locale === 'id' ? `${days} hari lalu` : `${days}d ago`;
  return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function FinderReportsList({ reports, itemId, labels, reunionLabels }: FinderReportsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [reunionReportId, setReunionReportId] = useState<string | null>(null);

  function handleStatusUpdate(reportId: string, status: 'seen' | 'resolved' | 'spam') {
    if (status === 'resolved') {
      // Open reunion modal instead of immediate update
      setReunionReportId(reportId);
      return;
    }
    startTransition(async () => {
      await updateReportStatusAction(reportId, status);
      router.refresh();
    });
  }

  if (reports.length === 0) {
    return (
      <Card variant="cozy" className="text-center py-12">
        <div className="text-5xl mb-3" aria-hidden="true">
          📭
        </div>
        <p className="text-mimoo-ink-500 text-sm">{labels.empty}</p>
      </Card>
    );
  }

  const statusLabels: Record<ReportStatus, { label: string; variant: 'purple' | 'pink' | 'blue' | 'cream' | 'green' }> = {
    new: { label: labels.statusNew, variant: 'purple' },
    seen: { label: labels.statusSeen, variant: 'blue' },
    resolved: { label: labels.statusResolved, variant: 'green' },
    spam: { label: labels.statusSpam, variant: 'cream' },
  };

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-bold text-mimoo-ink-900 flex items-center gap-2">
        📬 {labels.title}
        <Badge variant="purple" size="sm">
          {reports.length}
        </Badge>
      </h3>

      {reports.map((report) => {
        const status = statusLabels[report.status];
        return (
          <Card
            key={report.id}
            variant="default"
            className={report.status === 'new' ? 'ring-2 ring-mimoo-purple-200' : ''}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <Badge variant={status.variant} size="sm">
                  {status.label}
                </Badge>
                <p className="text-xs text-mimoo-ink-300 mt-1">
                  {formatRelativeTime(report.created_at)}
                </p>
              </div>
              {report.finder_name && (
                <p className="text-sm font-semibold text-mimoo-ink-700 text-right">
                  {report.finder_name}
                </p>
              )}
            </div>

            <p className="text-sm text-mimoo-ink-900 leading-relaxed mb-3 whitespace-pre-wrap break-words">
              "{report.message}"
            </p>

            <dl className="text-xs space-y-1 text-mimoo-ink-700">
              <div>
                <dt className="inline font-semibold">📍 {labels.locationLabel}: </dt>
                <dd className="inline">{report.location_text}</dd>
                {report.location_lat && report.location_lng && (
                  <a
                    href={`https://www.google.com/maps?q=${report.location_lat},${report.location_lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-mimoo-purple-700 hover:underline font-medium"
                  >
                    {labels.viewOnMap} ↗
                  </a>
                )}
              </div>
              {report.finder_contact && (
                <div>
                  <dt className="inline font-semibold">📞 {labels.contactLabel}: </dt>
                  <dd className="inline">{report.finder_contact}</dd>
                </div>
              )}
            </dl>

            {report.status === 'new' && (
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-mimoo-purple-50">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusUpdate(report.id, 'seen')}
                  disabled={isPending}
                >
                  👀 {labels.markSeen}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(report.id, 'resolved')}
                  disabled={isPending}
                >
                  ✓ {labels.markResolved}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStatusUpdate(report.id, 'spam')}
                  disabled={isPending}
                >
                  🚫 {labels.markSpam}
                </Button>
              </div>
            )}

            {report.status === 'seen' && (
              <div className="flex gap-2 mt-4 pt-3 border-t border-mimoo-purple-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(report.id, 'resolved')}
                  disabled={isPending}
                  className="flex-1"
                >
                  ✓ {labels.markResolved}
                </Button>
              </div>
            )}
          </Card>
        );
      })}

      {/* Reunion celebration modal */}
      {reunionReportId && (
        <ReunionModal
          isOpen={!!reunionReportId}
          onClose={() => setReunionReportId(null)}
          itemId={itemId}
          reportId={reunionReportId}
          labels={reunionLabels}
        />
      )}
    </div>
  );
}
