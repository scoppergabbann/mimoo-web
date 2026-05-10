import type { SkinTone, OutfitColor, AccentColor } from '../types';
import { SKIN_TONES, OUTFIT_COLORS, ACCENT_COLORS } from '../types';

interface DenpaProps {
  skinTone: SkinTone;
  outfit: OutfitColor;
  accent: AccentColor;
  className?: string;
}

/**
 * Denpa — Karakter dari Denpasar, Bali 🌺
 * Ciri khas: Udeng (ikat kepala Bali), bunga kamboja di telinga, senyum hangat
 */
export function Denpa({ skinTone, outfit, accent, className }: DenpaProps) {
  const skin = SKIN_TONES[skinTone];
  const outfitColor = OUTFIT_COLORS[outfit];
  const accentColor = ACCENT_COLORS[accent];

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Denpa - Karakter Bali"
    >
      {/* Background glow */}
      <defs>
        <radialGradient id="denpa-glow">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="denpa-udeng" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={outfitColor.base} />
          <stop offset="100%" stopColor={outfitColor.shadow} />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#denpa-glow)" />

      {/* Body / shirt */}
      <path
        d="M 55 175 Q 55 145 75 135 L 125 135 Q 145 145 145 175 Z"
        fill={outfitColor.base}
      />
      <path
        d="M 60 175 Q 60 150 78 142 L 122 142 Q 140 150 140 175 Z"
        fill={outfitColor.light}
        opacity="0.5"
      />
      {/* Bali floral pattern accent on shirt */}
      <circle cx="85" cy="158" r="3" fill={accentColor} opacity="0.6" />
      <circle cx="100" cy="165" r="3" fill={accentColor} opacity="0.6" />
      <circle cx="115" cy="158" r="3" fill={accentColor} opacity="0.6" />

      {/* Neck */}
      <rect x="90" y="125" width="20" height="18" rx="6" fill={skin.base} />
      <rect x="90" y="125" width="20" height="6" fill={skin.shadow} opacity="0.4" />

      {/* Face */}
      <ellipse cx="100" cy="95" rx="42" ry="45" fill={skin.base} />
      {/* Face shadow */}
      <ellipse cx="100" cy="100" rx="42" ry="40" fill={skin.shadow} opacity="0.15" />

      {/* Hair (peeking from under udeng) */}
      <path
        d="M 60 75 Q 60 90 68 98 L 70 90 Q 75 80 80 75 Z"
        fill="#2D1810"
      />
      <path
        d="M 140 75 Q 140 90 132 98 L 130 90 Q 125 80 120 75 Z"
        fill="#2D1810"
      />

      {/* Udeng (ikat kepala Bali) — signature feature */}
      <path
        d="M 58 75 Q 58 55 78 50 L 122 50 Q 142 55 142 75 Q 142 80 138 82 L 62 82 Q 58 80 58 75 Z"
        fill="url(#denpa-udeng)"
      />
      {/* Udeng front knot detail */}
      <path
        d="M 90 50 Q 100 42 110 50 L 108 60 Q 100 55 92 60 Z"
        fill={outfitColor.shadow}
      />
      {/* Udeng pattern lines */}
      <path
        d="M 65 70 Q 100 65 135 70"
        stroke={outfitColor.light}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 65 76 Q 100 71 135 76"
        stroke={outfitColor.light}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />

      {/* Frangipani flower (bunga kamboja) on right ear */}
      <g transform="translate(140, 95)">
        <circle cx="0" cy="0" r="6" fill="#FFFDF8" />
        <circle cx="-3" cy="-2" r="4" fill="#FFFDF8" />
        <circle cx="3" cy="-2" r="4" fill="#FFFDF8" />
        <circle cx="-2" cy="3" r="4" fill="#FFFDF8" />
        <circle cx="2" cy="3" r="4" fill="#FFFDF8" />
        <circle cx="0" cy="0" r="2" fill="#FFD96B" />
      </g>

      {/* Ears */}
      <ellipse cx="58" cy="98" rx="5" ry="8" fill={skin.base} />
      <ellipse cx="58" cy="98" rx="2" ry="4" fill={skin.shadow} opacity="0.5" />

      {/* Eyes — closed/smiling (Bali peaceful vibe) */}
      <path
        d="M 78 98 Q 84 94 90 98"
        stroke="#1A1A2E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 110 98 Q 116 94 122 98"
        stroke="#1A1A2E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Eyelashes */}
      <line x1="78" y1="96" x2="76" y2="93" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="122" y1="96" x2="124" y2="93" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="76" cy="110" rx="6" ry="4" fill={skin.blush} opacity="0.6" />
      <ellipse cx="124" cy="110" rx="6" ry="4" fill={skin.blush} opacity="0.6" />

      {/* Nose */}
      <path
        d="M 98 108 Q 100 112 102 108"
        stroke={skin.shadow}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Smile */}
      <path
        d="M 90 118 Q 100 125 110 118"
        stroke="#1A1A2E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sparkles */}
      <g fill={accentColor} opacity="0.7">
        <circle cx="40" cy="60" r="2" />
        <circle cx="165" cy="50" r="2.5" />
        <circle cx="170" cy="120" r="1.5" />
        <circle cx="35" cy="130" r="2" />
      </g>
    </svg>
  );
}
