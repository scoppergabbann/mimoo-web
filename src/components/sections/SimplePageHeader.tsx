import type { ReactNode } from 'react';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { cn } from '@/lib/utils';

interface SimplePageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  blobExpression?: 'happy' | 'sparkle' | 'love' | 'thoughtful' | 'wink';
  showBlob?: boolean;
  className?: string;
}

/**
 * Hero header section untuk halaman static (Help, FAQ, Legal, dll).
 * Cozy aesthetic dengan gradient background dan optional blob mascot.
 */
export function SimplePageHeader({
  title,
  subtitle,
  badge,
  blobExpression = 'happy',
  showBlob = true,
  className,
}: SimplePageHeaderProps) {
  return (
    <section className={cn('bg-gradient-cozy py-12 lg:py-16', className)}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {showBlob && (
          <div className="flex justify-center mb-4">
            <MimooBlob size="md" expression={blobExpression} />
          </div>
        )}
        {badge && (
          <p className="inline-block px-3 py-1 mb-3 rounded-pill bg-mimoo-purple-100 text-mimoo-purple-700 text-xs font-semibold uppercase tracking-wider">
            {badge}
          </p>
        )}
        <h1 className="font-display text-display-sm lg:text-display-md font-extrabold text-mimoo-ink-900 mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-mimoo-ink-500 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
