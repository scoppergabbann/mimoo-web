import type { SkinTone, OutfitColor, AccentColor } from '../types';
import { SKIN_TONES, OUTFIT_COLORS, ACCENT_COLORS } from '../types';

interface KupaProps {
  skinTone: SkinTone;
  outfit: OutfitColor;
  accent: AccentColor;
  className?: string;
}

/**
 * Kupa — Karakter dari Kupang, NTT (Kristiani) ✨
 * Ciri khas: Tenun NTT pattern, kalung salib kecil, ekspresi tenang & hangat
 */
export function Kupa({ skinTone, outfit, accent, className }: KupaProps) {
  const skin = SKIN_TONES[skinTone];
  const outfitColor = OUTFIT_COLORS[outfit];
  const accentColor = ACCENT_COLORS[accent];

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Kupa - Karakter Kupang NTT"
    >
      <defs>
        <radialGradient id="kupa-glow">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        {/* Tenun NTT pattern */}
        <pattern id="kupa-tenun" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill={outfitColor.base} />
          <path d="M 0 6 L 6 0 L 12 6 L 6 12 Z" fill={outfitColor.shadow} opacity="0.5" />
          <circle cx="6" cy="6" r="1.5" fill={outfitColor.light} opacity="0.7" />
        </pattern>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#kupa-glow)" />

      {/* Body / shirt */}
      <path
        d="M 55 175 Q 55 145 75 135 L 125 135 Q 145 145 145 175 Z"
        fill={outfitColor.base}
      />
      {/* Tenun NTT scarf/sash diagonal */}
      <path
        d="M 60 145 L 145 175 L 145 165 L 65 138 Z"
        fill="url(#kupa-tenun)"
      />
      {/* Pattern stripes on shirt */}
      <line x1="70" y1="155" x2="130" y2="155" stroke={outfitColor.shadow} strokeWidth="1.5" opacity="0.5" />
      <line x1="70" y1="165" x2="130" y2="165" stroke={outfitColor.shadow} strokeWidth="1.5" opacity="0.5" />

      {/* Neck */}
      <rect x="90" y="125" width="20" height="18" rx="6" fill={skin.base} />
      <rect x="90" y="125" width="20" height="6" fill={skin.shadow} opacity="0.4" />

      {/* Cross necklace */}
      <line x1="100" y1="138" x2="100" y2="148" stroke="#FFD96B" strokeWidth="1.5" />
      <g transform="translate(100, 148)">
        <rect x="-2" y="-2" width="4" height="6" fill="#FFD96B" />
        <rect x="-4" y="0" width="8" height="2" fill="#FFD96B" />
      </g>

      {/* Face */}
      <ellipse cx="100" cy="95" rx="42" ry="45" fill={skin.base} />
      <ellipse cx="100" cy="100" rx="42" ry="40" fill={skin.shadow} opacity="0.15" />

      {/* Hair — wavy mid-length */}
      <path
        d="M 58 80 Q 55 60 75 50 Q 100 42 125 50 Q 145 60 142 80 L 142 105 Q 138 95 135 90 L 130 78 Q 125 70 100 68 Q 75 70 70 78 L 65 90 Q 62 95 58 105 Z"
        fill="#3D2818"
      />
      {/* Hair highlights */}
      <path
        d="M 75 68 Q 100 62 125 68"
        stroke="#5A3825"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      {/* Hair side flow */}
      <path
        d="M 60 90 Q 50 105 55 130"
        fill="#3D2818"
        stroke="#3D2818"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 140 90 Q 150 105 145 130"
        fill="#3D2818"
        stroke="#3D2818"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Hair flower accent */}
      <g transform="translate(72, 78)">
        <circle cx="0" cy="0" r="4" fill="#FFB8CD" />
        <circle cx="-2" cy="-1" r="2.5" fill="#FFB8CD" />
        <circle cx="2" cy="-1" r="2.5" fill="#FFB8CD" />
        <circle cx="0" cy="2" r="2.5" fill="#FFB8CD" />
        <circle cx="0" cy="0" r="1" fill="#FFD96B" />
      </g>

      {/* Ears */}
      <ellipse cx="58" cy="100" rx="5" ry="8" fill={skin.base} />
      <ellipse cx="58" cy="100" rx="2" ry="4" fill={skin.shadow} opacity="0.5" />
      <ellipse cx="142" cy="100" rx="5" ry="8" fill={skin.base} />
      <ellipse cx="142" cy="100" rx="2" ry="4" fill={skin.shadow} opacity="0.5" />

      {/* Earrings - tiny */}
      <circle cx="58" cy="106" r="1.5" fill="#FFD96B" />
      <circle cx="142" cy="106" r="1.5" fill="#FFD96B" />

      {/* Eyes — warm & calm */}
      <ellipse cx="86" cy="100" rx="4.5" ry="5.5" fill="#1A1A2E" />
      <ellipse cx="114" cy="100" rx="4.5" ry="5.5" fill="#1A1A2E" />
      <circle cx="87" cy="98" r="1.3" fill="#FFFDF8" />
      <circle cx="115" cy="98" r="1.3" fill="#FFFDF8" />

      {/* Eyebrows */}
      <path d="M 79 92 Q 86 89 93 92" stroke="#3D2818" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 107 92 Q 114 89 121 92" stroke="#3D2818" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Blush */}
      <ellipse cx="76" cy="112" rx="6" ry="4" fill={skin.blush} opacity="0.6" />
      <ellipse cx="124" cy="112" rx="6" ry="4" fill={skin.blush} opacity="0.6" />

      {/* Nose */}
      <path
        d="M 98 110 Q 100 114 102 110"
        stroke={skin.shadow}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Warm smile */}
      <path
        d="M 88 121 Q 100 128 112 121"
        stroke="#1A1A2E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sparkles */}
      <g fill={accentColor} opacity="0.7">
        <circle cx="35" cy="80" r="2" />
        <path d="M 165 65 L 167 67 L 165 69 L 163 67 Z" />
        <circle cx="170" cy="125" r="1.8" />
        <path d="M 30 140 L 32 142 L 30 144 L 28 142 Z" />
      </g>
    </svg>
  );
}
