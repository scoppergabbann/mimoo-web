import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/Badge';
import { getCategoryMeta } from '@/lib/items/types';
import type { Item } from '@/lib/items/types';
import { QrCodeIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const category = getCategoryMeta(item.category);

  return (
    <Link
      href={`/dashboard/items/${item.id}`}
      className={cn(
        'group block rounded-cozy-lg p-5 transition-all duration-200',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-mimoo-purple-100',
        'motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-soft-lg',
        item.is_lost
          ? 'bg-gradient-to-br from-mimoo-pink-50 to-mimoo-cream-100 border-2 border-mimoo-pink-200 shadow-soft'
          : 'bg-white border-2 border-transparent shadow-soft'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Category emoji */}
        <div
          className={cn(
            'w-12 h-12 rounded-cozy flex items-center justify-center text-2xl shrink-0',
            item.is_lost ? 'bg-mimoo-pink-100' : 'bg-mimoo-purple-50'
          )}
          aria-hidden="true"
        >
          {category?.emoji || '✨'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-lg font-bold text-mimoo-ink-900 truncate">
              {item.name}
            </h3>
            {item.is_lost && (
              <Badge variant="pink" size="sm" className="shrink-0">
                ⚠️ Hilang
              </Badge>
            )}
          </div>
          {category && (
            <p className="text-xs text-mimoo-ink-500 mb-2">{category.labelId}</p>
          )}
          {item.custom_message && (
            <p className="text-sm text-mimoo-ink-700 line-clamp-2 mb-3">
              {item.custom_message}
            </p>
          )}

          {/* Stats footer */}
          <div className="flex items-center gap-3 text-xs text-mimoo-ink-500">
            <span className="inline-flex items-center gap-1">
              <QrCodeIcon className="w-3.5 h-3.5" />
              <code className="font-mono font-semibold">{item.recovery_code}</code>
            </span>
            {item.scan_count > 0 && (
              <span>
                👀 {item.scan_count} {item.scan_count === 1 ? 'scan' : 'scans'}
              </span>
            )}
            {item.report_count > 0 && (
              <span className="text-mimoo-purple-700 font-semibold">
                📬 {item.report_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
