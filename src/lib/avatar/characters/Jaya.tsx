import type { SkinTone, OutfitColor, AccentColor } from '../types';
import { SKIN_TONES, OUTFIT_COLORS, ACCENT_COLORS } from '../types';

interface JayaProps {
  skinTone: SkinTone;
  outfit: OutfitColor;
  accent: AccentColor;
  className?: string;
}

/**
 * Jaya — Karakter dari Jayapura, Papua 🪶
 * Ciri khas: Ikat kepala dengan motif tribal Papua, ekspresi ceria & autentik
 */
export function Jaya({ skinTone, outfit, accent, className }: JayaProps) {
  const skin = SKIN_TONES[skinTone];
  const outfitColor = OUTFIT_COLORS[outfit];
  const accentColor = ACCENT_COLORS[accent];

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Jaya - Karakter Papua"
    >
      <defs>
        <radialGradient id="jaya-glow">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="jaya-band" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D9534F" />
          <stop offset="33%" stopColor="#FFD96B" />
          <stop offset="66%" stopColor="#1A1A2E" />
          <stop offset="100%" stopColor="#D9534F" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#jaya-glow)" />

      {/* Body / shirt */}
      <path
        d="M 55 175 Q 55 145 75 135 L 125 135 Q 145 145 145 175 Z"
        fill={outfitColor.base}
      />
      {/* Tribal pattern accents */}
      <g fill={accentColor} opacity="0.7">
        <path d="M 75 152 L 80 145 L 85 152 L 80 159 Z" />
        <path d="M 100 158 L 105 151 L 110 158 L 105 165 Z" />
        <path d="M 120 152 L 125 145 L 130 152 L 125 159 Z" />
      </g>

      {/* Neck */}
      <rect x="90" y="125" width="20" height="18" rx="6" fill={skin.base} />
      <rect x="90" y="125" width="20" height="6" fill={skin.shadow} opacity="0.4" />

      {/* Tribal necklace */}
      <path
        d="M 80 138 Q 100 148 120 138"
        stroke="#FFD96B"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="100" cy="146" r="3" fill="#D9534F" />

      {/* Face */}
      <ellipse cx="100" cy="95" rx="42" ry="45" fill={skin.base} />
      <ellipse cx="100" cy="100" rx="42" ry="40" fill={skin.shadow} opacity="0.15" />

      {/* Curly hair (top) */}
      <g fill="#1A0F0A">
        <circle cx="70" cy="62" r="10" />
        <circle cx="85" cy="55" r="11" />
        <circle cx="100" cy="52" r="12" />
        <circle cx="115" cy="55" r="11" />
        <circle cx="130" cy="62" r="10" />
        <circle cx="62" cy="75" r="9" />
        <circle cx="138" cy="75" r="9" />
      </g>

      {/* Tribal headband (ikat kepala) */}
      <rect x="58" y="70" width="84" height="10" fill="url(#jaya-band)" rx="2" />
      <rect x="58" y="70" width="84" height="3" fill="#1A1A2E" opacity="0.3" />

      {/* Headband feather (bulu cendrawasih stylized) */}
      <g transform="translate(140, 60)">
        <path d="M 0 0 Q 5 -10 10 -25 L 12 -28 Q 14 -15 8 0 Z" fill="#FFD96B" />
        <path d="M 0 0 Q 5 -10 10 -25" stroke="#D9534F" strokeWidth="1" fill="none" />
      </g>

      {/* Ears */}
      <ellipse cx="58" cy="98" rx="5" ry="8" fill={skin.base} />
      <ellipse cx="58" cy="98" rx="2" ry="4" fill={skin.shadow} opacity="0.5" />
      <ellipse cx="142" cy="98" rx="5" ry="8" fill={skin.base} />
      <ellipse cx="142" cy="98" rx="2" ry="4" fill={skin.shadow} opacity="0.5" />

      {/* Eyes — bright & expressive */}
      <ellipse cx="84" cy="100" rx="5" ry="6" fill="#1A1A2E" />
      <ellipse cx="116" cy="100" rx="5" ry="6" fill="#1A1A2E" />
      {/* Eye sparkle */}
      <circle cx="86" cy="98" r="1.5" fill="#FFFDF8" />
      <circle cx="118" cy="98" r="1.5" fill="#FFFDF8" />
      {/* Eyebrows */}
      <path d="M 78 92 Q 84 89 90 92" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 110 92 Q 116 89 122 92" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Blush */}
      <ellipse cx="76" cy="112" rx="6" ry="4" fill={skin.blush} opacity="0.5" />
      <ellipse cx="124" cy="112" rx="6" ry="4" fill={skin.blush} opacity="0.5" />

      {/* Nose */}
      <ellipse cx="100" cy="110" rx="3" ry="2" fill={skin.shadow} opacity="0.6" />

      {/* Big happy smile */}
      <path
        d="M 84 120 Q 100 132 116 120"
        stroke="#1A1A2E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="#1A1A2E"
        fillOpacity="0.1"
      />
      <path
        d="M 84 120 Q 100 132 116 120"
        stroke="#1A1A2E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Teeth peek */}
      <path d="M 92 122 L 108 122" stroke="#FFFDF8" strokeWidth="2" strokeLinecap="round" />

      {/* Sparkles */}
      <g fill={accentColor} opacity="0.7">
        <circle cx="40" cy="100" r="2" />
        <circle cx="160" cy="115" r="2.5" />
        <circle cx="35" cy="140" r="1.5" />
      </g>
    </svg>
  );
}
