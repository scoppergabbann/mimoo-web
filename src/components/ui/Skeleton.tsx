import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circle' | 'text';
}

/**
 * Skeleton loading placeholder dengan pulse animation.
 *
 * Usage:
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton variant="circle" className="w-12 h-12" />
 */
export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-mimoo-purple-50 via-mimoo-purple-100 to-mimoo-purple-50 bg-[length:200%_100%]',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'default' && 'rounded-cozy',
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton untuk item card di dashboard.
 */
export function ItemCardSkeleton() {
  return (
    <div className="rounded-cozy-lg p-5 bg-white border-2 border-transparent shadow-soft">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" variant="text" />
          <Skeleton className="h-3 w-1/3" variant="text" />
          <Skeleton className="h-3 w-full mt-3" variant="text" />
          <div className="flex gap-3 mt-3">
            <Skeleton className="h-3 w-20" variant="text" />
            <Skeleton className="h-3 w-16" variant="text" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton untuk dashboard stats grid.
 */
export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-cozy-lg p-5 shadow-soft text-center">
          <Skeleton className="h-8 w-12 mx-auto mb-2" />
          <Skeleton className="h-3 w-20 mx-auto" variant="text" />
        </div>
      ))}
    </div>
  );
}

/**
 * Generic page-level loading state.
 */
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-[calc(100vh-200px)] py-8 lg:py-12 bg-gradient-cozy">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header card skeleton */}
        <div className="bg-white rounded-cozy-lg shadow-soft p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Skeleton variant="circle" className="w-20 h-20 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" variant="text" />
              <Skeleton className="h-3 w-32" variant="text" />
            </div>
          </div>
        </div>

        <StatsGridSkeleton />

        {/* Items list skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <div className="grid sm:grid-cols-2 gap-3">
            <ItemCardSkeleton />
            <ItemCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
