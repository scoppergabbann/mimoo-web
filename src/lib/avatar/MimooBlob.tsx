import { cn } from '@/lib/utils';

interface MimooBlobProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'wink' | 'love' | 'sparkle' | 'thoughtful';
  animated?: boolean;
}

const SIZE_CLASSES = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

/**
 * MimooBlob — Maskot ungu gemoy yang jadi sidekick Mimoo.
 * Karakter signature yang "hidup" di seluruh produk.
 */
export function MimooBlob({
  className,
  size = 'md',
  expression = 'happy',
  animated = true,
}: MimooBlobProps) {
  return (
    <div
      className={cn(
        SIZE_CLASSES[size],
        animated && 'animate-float',
        'inline-block',
        className
      )}
    >
      <svg
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        role="img"
        aria-label="Mimoo blob mascot"
      >
        <defs>
          <radialGradient id="blob-body" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#D6C9FF" />
            <stop offset="50%" stopColor="#9B8FE8" />
            <stop offset="100%" stopColor="#7363C7" />
          </radialGradient>
          <radialGradient id="blob-shine" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#FFFDF8" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#FFFDF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Body — chubby blob shape */}
        <path
          d="M 60 20 Q 95 20 100 55 Q 105 90 80 100 Q 60 105 40 100 Q 15 90 20 55 Q 25 20 60 20 Z"
          fill="url(#blob-body)"
        />
        {/* Shine highlight */}
        <ellipse cx="42" cy="42" rx="20" ry="15" fill="url(#blob-shine)" />

        {/* Little ear tufts */}
        <path d="M 35 22 Q 32 12 40 15 Q 42 22 38 25 Z" fill="#7363C7" />
        <path d="M 85 22 Q 88 12 80 15 Q 78 22 82 25 Z" fill="#7363C7" />

        {/* Eyes — varies by expression */}
        {expression === 'happy' && (
          <>
            <ellipse cx="45" cy="55" rx="4" ry="5" fill="#1A1A2E" />
            <ellipse cx="75" cy="55" rx="4" ry="5" fill="#1A1A2E" />
            <circle cx="46" cy="53" r="1.2" fill="#FFFDF8" />
            <circle cx="76" cy="53" r="1.2" fill="#FFFDF8" />
          </>
        )}
        {expression === 'wink' && (
          <>
            <ellipse cx="45" cy="55" rx="4" ry="5" fill="#1A1A2E" />
            <circle cx="46" cy="53" r="1.2" fill="#FFFDF8" />
            <path d="M 70 55 Q 75 52 80 55" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        )}
        {expression === 'love' && (
          <>
            <path d="M 42 53 L 45 50 L 48 53 L 45 58 Z" fill="#FA7095" />
            <path d="M 72 53 L 75 50 L 78 53 L 75 58 Z" fill="#FA7095" />
          </>
        )}
        {expression === 'sparkle' && (
          <>
            <path d="M 45 50 L 47 55 L 45 60 L 43 55 Z" fill="#FFD96B" />
            <path d="M 75 50 L 77 55 L 75 60 L 73 55 Z" fill="#FFD96B" />
          </>
        )}
        {expression === 'thoughtful' && (
          <>
            {/* Eyes looking up-side (curious/contemplative) */}
            <ellipse cx="44" cy="56" rx="3.5" ry="4.5" fill="#1A1A2E" />
            <ellipse cx="74" cy="56" rx="3.5" ry="4.5" fill="#1A1A2E" />
            <circle cx="46" cy="54" r="1" fill="#FFFDF8" />
            <circle cx="76" cy="54" r="1" fill="#FFFDF8" />
            {/* Small eyebrows raised slightly */}
            <path d="M 40 47 Q 45 45 50 47" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M 70 47 Q 75 45 80 47" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Cheeks */}
        <ellipse cx="38" cy="68" rx="5" ry="3" fill="#FFB8CD" opacity="0.7" />
        <ellipse cx="82" cy="68" rx="5" ry="3" fill="#FFB8CD" opacity="0.7" />

        {/* Smile */}
        <path
          d="M 52 72 Q 60 78 68 72"
          stroke="#1A1A2E"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tiny tooth */}
        <rect x="58" y="73" width="2" height="3" fill="#FFFDF8" />

        {/* Sparkles around */}
        <g fill="#8B7FD9" opacity="0.6">
          <circle cx="15" cy="40" r="1.5" />
          <circle cx="105" cy="35" r="2" />
          <circle cx="20" cy="85" r="1.5" />
        </g>
      </svg>
    </div>
  );
}
