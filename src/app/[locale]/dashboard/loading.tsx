import { PageLoadingSkeleton } from '@/components/ui/Skeleton';

/**
 * Dashboard loading state - shown saat data fetching.
 * Next.js otomatis pakai ini saat page suspends.
 */
export default function DashboardLoading() {
  return <PageLoadingSkeleton />;
}
