import type { CharacterMeta } from '../types';

interface PlaceholderProps {
  character: CharacterMeta;
  className?: string;
}

/**
 * Placeholder untuk karakter yang belum di-implement penuh di Phase 1.
 * Menampilkan emoji + nama dengan style cozy.
 */
export function Placeholder({ character, className }: PlaceholderProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`${character.name} - ${character.origin} (Coming soon)`}
    >
      <defs>
        <linearGradient id={`placeholder-bg-${character.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F2FF" />
          <stop offset="100%" stopColor="#EBE5FF" />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="100" cy="100" r="85" fill={`url(#placeholder-bg-${character.id})`} />
      <circle cx="100" cy="100" r="85" fill="none" stroke="#D6C9FF" strokeWidth="2" strokeDasharray="4 4" />

      {/* Big emoji */}
      <text
        x="100"
        y="105"
        textAnchor="middle"
        fontSize="48"
        dominantBaseline="middle"
      >
        {character.emoji}
      </text>

      {/* Coming soon badge */}
      <rect x="55" y="130" width="90" height="22" rx="11" fill="#8B7FD9" opacity="0.9" />
      <text
        x="100"
        y="145"
        textAnchor="middle"
        fontSize="10"
        fill="#FFFDF8"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        Segera Hadir
      </text>

      {/* Sparkles */}
      <g fill="#8B7FD9" opacity="0.5">
        <circle cx="50" cy="60" r="2" />
        <circle cx="155" cy="55" r="2.5" />
        <circle cx="40" cy="120" r="1.8" />
        <circle cx="160" cy="130" r="2" />
      </g>
    </svg>
  );
}
