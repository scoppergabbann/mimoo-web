/**
 * Mimoo Avatar System
 * Character library berdasarkan kekayaan budaya Indonesia.
 *
 * Phase 1: 4 karakter polished (Denpa, Jaya, Salma, Kupa)
 * Phase 2+: 8 karakter sisanya (placeholder ready)
 */

export type SkinTone = 'light' | 'medium' | 'tan' | 'deep';
export type OutfitColor = 'purple' | 'blue' | 'pink' | 'cream' | 'sage';
export type AccentColor = 'purple' | 'blue' | 'pink';

export type CharacterId =
  | 'denpa'   // Bali
  | 'jaya'    // Papua
  | 'salma'   // Bandung (Muslimah)
  | 'kupa'    // NTT (Kristiani)
  | 'gadhing' // Yogyakarta (placeholder)
  | 'tarra'   // Dayak (placeholder)
  | 'minang'  // Padang (placeholder)
  | 'toraja'  // Toraja (placeholder)
  | 'lombo'   // Lombok (placeholder)
  | 'manda'   // Manado (placeholder)
  | 'batak'   // Medan (placeholder)
  | 'banda';  // Aceh (placeholder)

export interface AvatarConfig {
  character: CharacterId;
  skinTone: SkinTone;
  outfit: OutfitColor;
  accent: AccentColor;
}

export interface CharacterMeta {
  id: CharacterId;
  name: string;
  origin: string;
  region: 'sumatera' | 'jawa' | 'bali-nusa' | 'kalimantan' | 'sulawesi' | 'papua';
  available: boolean; // true di Phase 1, false untuk yang masih placeholder
  emoji: string;
}

export const CHARACTERS: Record<CharacterId, CharacterMeta> = {
  denpa: {
    id: 'denpa',
    name: 'Denpa',
    origin: 'Denpasar, Bali',
    region: 'bali-nusa',
    available: true,
    emoji: '🌺',
  },
  jaya: {
    id: 'jaya',
    name: 'Jaya',
    origin: 'Jayapura, Papua',
    region: 'papua',
    available: true,
    emoji: '🪶',
  },
  salma: {
    id: 'salma',
    name: 'Salma',
    origin: 'Bandung',
    region: 'jawa',
    available: true,
    emoji: '🌷',
  },
  kupa: {
    id: 'kupa',
    name: 'Kupa',
    origin: 'Kupang, NTT',
    region: 'bali-nusa',
    available: true,
    emoji: '✨',
  },
  gadhing: {
    id: 'gadhing',
    name: 'Gadhing',
    origin: 'Yogyakarta',
    region: 'jawa',
    available: false,
    emoji: '🎭',
  },
  tarra: {
    id: 'tarra',
    name: 'Tarra',
    origin: 'Palangkaraya, Kalimantan',
    region: 'kalimantan',
    available: false,
    emoji: '🌿',
  },
  minang: {
    id: 'minang',
    name: 'Minang',
    origin: 'Padang, Sumatera',
    region: 'sumatera',
    available: false,
    emoji: '🏛️',
  },
  toraja: {
    id: 'toraja',
    name: 'Toraja',
    origin: 'Tana Toraja, Sulawesi',
    region: 'sulawesi',
    available: false,
    emoji: '⛰️',
  },
  lombo: {
    id: 'lombo',
    name: 'Lombo',
    origin: 'Lombok, NTB',
    region: 'bali-nusa',
    available: false,
    emoji: '🏝️',
  },
  manda: {
    id: 'manda',
    name: 'Manda',
    origin: 'Manado, Sulawesi',
    region: 'sulawesi',
    available: false,
    emoji: '🌊',
  },
  batak: {
    id: 'batak',
    name: 'Batak',
    origin: 'Medan, Sumatera',
    region: 'sumatera',
    available: false,
    emoji: '🎵',
  },
  banda: {
    id: 'banda',
    name: 'Banda',
    origin: 'Banda Aceh',
    region: 'sumatera',
    available: false,
    emoji: '🕌',
  },
};

// === Color Palettes ===

export const SKIN_TONES: Record<SkinTone, { base: string; shadow: string; blush: string }> = {
  light: { base: '#FFE0CC', shadow: '#F5C9A8', blush: '#FFB8C8' },
  medium: { base: '#E8B894', shadow: '#C99770', blush: '#E89090' },
  tan: { base: '#C99770', shadow: '#9F7050', blush: '#C66A6A' },
  deep: { base: '#8B5A3C', shadow: '#5D3A24', blush: '#A04545' },
};

export const OUTFIT_COLORS: Record<OutfitColor, { base: string; shadow: string; light: string }> = {
  purple: { base: '#9B8FE8', shadow: '#7363C7', light: '#D6C9FF' },
  blue: { base: '#6BA5FA', shadow: '#5294F0', light: '#B8D7FF' },
  pink: { base: '#FA7095', shadow: '#E04F76', light: '#FFB8CD' },
  cream: { base: '#F5E8CE', shadow: '#D9C6A0', light: '#FFF9F0' },
  sage: { base: '#A6F0C2', shadow: '#76C994', light: '#D1FADF' },
};

export const ACCENT_COLORS: Record<AccentColor, string> = {
  purple: '#8B7FD9',
  blue: '#5294F0',
  pink: '#FA7095',
};

// Default config untuk fallback
export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  character: 'denpa',
  skinTone: 'medium',
  outfit: 'purple',
  accent: 'purple',
};

/**
 * Get list of characters yang available di Phase saat ini.
 */
export function getAvailableCharacters(): CharacterMeta[] {
  return Object.values(CHARACTERS).filter((c) => c.available);
}

/**
 * Get all characters (termasuk placeholder).
 */
export function getAllCharacters(): CharacterMeta[] {
  return Object.values(CHARACTERS);
}
