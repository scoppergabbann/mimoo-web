import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FloatingCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgColor?: 'purple' | 'blue' | 'pink' | 'mint';
  className?: string;
  delay?: number;
}

const ICON_BG_CLASSES = {
  purple: 'bg-mimoo-purple-100 text-mimoo-purple-500',
  blue: 'bg-mimoo-sky-100 text-mimoo-sky-500',
  pink: 'bg-mimoo-pink-100 text-mimoo-pink-400',
  mint: 'bg-mimoo-mint-100 text-mimoo-mint-300',
};

export function FloatingCard({
  icon,
  title,
  description,
  iconBgColor = 'purple',
  className,
  delay = 0,
}: FloatingCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-cozy-lg p-4 shadow-float',
        'flex items-start gap-3 max-w-[240px]',
        'motion-safe:animate-fade-up',
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div
        className={cn(
          'shrink-0 w-10 h-10 rounded-cozy flex items-center justify-center',
          ICON_BG_CLASSES[iconBgColor]
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-mimoo-ink-900 text-sm leading-tight">
          {title}
        </h3>
        <p className="text-xs text-mimoo-ink-500 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
