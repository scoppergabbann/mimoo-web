import { cn } from '@/lib/utils';

interface MimooLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-12',
};

/**
 * Mimoo Wordmark Logo dengan sparkle accent
 */
export function MimooLogo({ className, size = 'md' }: MimooLogoProps) {
  return (
    <div className={cn('inline-flex items-center', SIZE_CLASSES[size], className)}>
      <svg
        viewBox="0 0 140 40"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        role="img"
        aria-label="Mimoo"
      >
        <text
          x="0"
          y="30"
          fontFamily="ui-rounded, system-ui, sans-serif"
          fontSize="32"
          fontWeight="800"
          fill="#8B7FD9"
          letterSpacing="-1"
        >
          Mimoo
        </text>
        {/* Sparkle accent */}
        <g fill="#8B7FD9">
          <path d="M 122 6 L 124 11 L 129 13 L 124 15 L 122 20 L 120 15 L 115 13 L 120 11 Z" />
          <circle cx="132" cy="8" r="1.5" />
        </g>
      </svg>
    </div>
  );
}
