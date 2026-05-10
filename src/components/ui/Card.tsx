import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'cozy';
  children: ReactNode;
}

const VARIANT_CLASSES = {
  default: 'bg-white shadow-soft',
  elevated: 'bg-white shadow-soft-lg',
  outline: 'bg-white border-2 border-mimoo-purple-100',
  cozy: 'bg-mimoo-cream-100 shadow-soft',
};

export function Card({
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-cozy-lg p-6',
        'transition-shadow duration-300',
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
