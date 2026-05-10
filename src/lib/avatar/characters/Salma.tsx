import type { SkinTone, OutfitColor, AccentColor } from '../types';
import { SKIN_TONES, OUTFIT_COLORS, ACCENT_COLORS } from '../types';

interface SalmaProps {
  skinTone: SkinTone;
  outfit: OutfitColor;
  accent: AccentColor;
  className?: string;
}

/**
 * Salma — Karakter Muslimah dari Bandung 🌷
 * Ciri khas: Hijab pastel modern, ekspresi lembut & elegan, modest fashion
 */
export function Salma({ skinTone, outfit, accent, className }: SalmaProps) {
  const skin = SKIN_TONES[skinTone];
  const outfitColor = OUTFIT_COLORS[outfit];
  const accentColor = ACCENT_COLORS[accent];

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Salma - Karakter Muslimah Bandung"
    >
      <defs>
        <radialGradient id="salma-glow">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="salma-hijab" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={outfitColor.light} />
          <stop offset="100%" stopColor={outfitColor.base} />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#salma-glow)" />

      {/* Body / outer dress */}
      <path
        d="M 50 175 Q 50 145 70 135 L 130 135 Q 150 145 150 175 Z"
        fill={outfitColor.shadow}
      />
      {/* Inner layer */}
      <path
        d="M 60 175 Q 60 150 78 142 L 122 142 Q 140 150 140 175 Z"
        fill={outfitColor.base}
      />
      {/* Soft pattern accent */}
      <g opacity="0.4" fill={outfitColor.light}>
        <circle cx="80" cy="160" r="2" />
        <circle cx="100" cy="155" r="2" />
        <circle cx="120" cy="160" r="2" />
        <circle cx="90" cy="170" r="1.5" />
        <circle cx="110" cy="170" r="1.5" />
      </g>

      {/* Hijab back layer (jatuh ke pundak) */}
      <path
        d="M 45 100 Q 40 130 50 145 L 65 140 Q 55 120 60 95 Z"
        fill="url(#salma-hijab)"
      />
      <path
        d="M 155 100 Q 160 130 150 145 L 135 140 Q 145 120 140 95 Z"
        fill="url(#salma-hijab)"
      />

      {/* Face */}
      <ellipse cx="100" cy="100" rx="38" ry="42" fill={skin.base} />
      <ellipse cx="100" cy="105" rx="38" ry="38" fill={skin.shadow} opacity="0.12" />

      {/* Hijab front (covers head, frames face) */}
      <path
        d="M 60 100 Q 60 60 100 55 Q 140 60 140 100 Q 140 80 130 75 L 70 75 Q 60 80 60 100 Z"
        fill="url(#salma-hijab)"
      />
      {/* Hijab top extends */}
      <path
        d="M 62 95 Q 55 65 100 50 Q 145 65 138 95 L 140 95 Q 145 70 100 55 Q 55 70 60 95 Z"
        fill={outfitColor.shadow}
        opacity="0.4"
      />

      {/* Hijab decorative pin */}
      <g transform="translate(135, 100)">
        <circle cx="0" cy="0" r="4" fill={accentColor} />
        <circle cx="0" cy="0" r="2" fill="#FFFDF8" />
        <circle cx="0" cy="0" r="1" fill={accentColor} />
      </g>

      {/* Eyes — gentle & kind */}
      <ellipse cx="86" cy="103" rx="4" ry="5" fill="#1A1A2E" />
      <ellipse cx="114" cy="103" rx="4" ry="5" fill="#1A1A2E" />
      <circle cx="87" cy="101" r="1.2" fill="#FFFDF8" />
      <circle cx="115" cy="101" r="1.2" fill="#FFFDF8" />

      {/* Eyelashes */}
      <path d="M 82 99 Q 86 96 90 99" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 110 99 Q 114 96 118 99" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Long lashes accent */}
      <line x1="82" y1="100" x2="80" y2="97" stroke="#1A1A2E" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="118" y1="100" x2="120" y2="97" stroke="#1A1A2E" strokeWidth="1.2" strokeLinecap="round" />

      {/* Soft eyebrows */}
      <path d="M 80 95 Q 86 92 92 95" stroke="#3D2818" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 108 95 Q 114 92 120 95" stroke="#3D2818" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Blush */}
      <ellipse cx="78" cy="115" rx="5" ry="3.5" fill={skin.blush} opacity="0.6" />
      <ellipse cx="122" cy="115" rx="5" ry="3.5" fill={skin.blush} opacity="0.6" />

      {/* Nose */}
      <path
        d="M 98 113 Q 100 116 102 113"
        stroke={skin.shadow}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Soft smile */}
      <path
        d="M 92 124 Q 100 129 108 124"
        stroke="#1A1A2E"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Subtle lips tint */}
      <path
        d="M 94 125 Q 100 128 106 125"
        stroke={skin.blush}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      {/* Sparkles - feminine touch */}
      <g fill={accentColor} opacity="0.7">
        <path d="M 35 70 L 37 72 L 35 74 L 33 72 Z" />
        <path d="M 165 80 L 167 82 L 165 84 L 163 82 Z" />
        <path d="M 30 130 L 32 132 L 30 134 L 28 132 Z" />
        <circle cx="170" cy="135" r="2" />
      </g>
    </svg>
  );
}
