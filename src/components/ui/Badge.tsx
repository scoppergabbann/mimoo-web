import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'purple' | 'pink' | 'blue' | 'cream' | 'green';
  size?: 'sm' | 'md';
  children: ReactNode;
}

const VARIANT_CLASSES = {
  purple: 'bg-mimoo-purple-100 text-mimoo-purple-700',
  pink: 'bg-mimoo-pink-100 text-mimoo-pink-400',
  blue: 'bg-mimoo-sky-100 text-mimoo-sky-500',
  cream: 'bg-mimoo-cream-300 text-mimoo-ink-700',
  green: 'bg-mimoo-mint-100 text-mimoo-mint-300',
};

const SIZE_CLASSES = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({
  variant = 'purple',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-pill',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
