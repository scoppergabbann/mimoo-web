'use client';

import { useTranslations } from 'next-intl';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import {
  type CharacterId,
  type SkinTone,
  type OutfitColor,
  type AccentColor,
  SKIN_TONES,
  OUTFIT_COLORS,
} from '@/lib/avatar/types';
import { cn } from '@/lib/utils';

interface AvatarPickerProps {
  character: CharacterId;
  skinTone: SkinTone;
  outfit: OutfitColor;
  accent: AccentColor;
  onCharacterChange: (c: CharacterId) => void;
  onSkinToneChange: (s: SkinTone) => void;
  onOutfitChange: (o: OutfitColor) => void;
}

const AVAILABLE_CHARACTERS: { id: CharacterId; label: string }[] = [
  { id: 'denpa', label: 'Denpa' },
  { id: 'jaya', label: 'Jaya' },
  { id: 'salma', label: 'Salma' },
  { id: 'kupa', label: 'Kupa' },
];

const SKIN_TONE_OPTIONS: SkinTone[] = ['light', 'medium', 'tan', 'deep'];
const OUTFIT_OPTIONS: OutfitColor[] = ['purple', 'blue', 'pink', 'cream', 'sage'];

export function AvatarPicker({
  character,
  skinTone,
  outfit,
  accent,
  onCharacterChange,
  onSkinToneChange,
  onOutfitChange,
}: AvatarPickerProps) {
  const t = useTranslations('AuthForm');

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-mimoo-ink-700 mb-2">
          {t('avatarPicker.title')}
        </p>
        <p className="text-xs text-mimoo-ink-500 mb-3">
          {t('avatarPicker.subtitle')}
        </p>
      </div>

      {/* Preview */}
      <div className="flex justify-center mb-4">
        <div className="bg-gradient-to-br from-mimoo-purple-50 to-mimoo-cream-100 p-3 rounded-cozy-lg">
          <MimooAvatar
            config={{ character, skinTone, outfit, accent }}
            size="lg"
          />
        </div>
      </div>

      {/* Character selection */}
      <div>
        <label className="block text-xs font-semibold text-mimoo-ink-700 mb-2">
          {t('avatarPicker.character')}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {AVAILABLE_CHARACTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onCharacterChange(c.id)}
              aria-label={c.label}
              aria-pressed={character === c.id}
              className={cn(
                'p-2 rounded-cozy border-2 transition-all',
                'hover:bg-mimoo-purple-50',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400',
                character === c.id
                  ? 'border-mimoo-purple-500 bg-mimoo-purple-50'
                  : 'border-transparent bg-mimoo-cream-200'
              )}
            >
              <MimooAvatar
                config={{ character: c.id, skinTone, outfit, accent }}
                size="sm"
                className="w-full h-auto aspect-square"
              />
              <p className="text-[10px] text-mimoo-ink-700 mt-1 font-medium">{c.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Skin tone */}
      <div>
        <label className="block text-xs font-semibold text-mimoo-ink-700 mb-2">
          {t('avatarPicker.skinTone')}
        </label>
        <div className="flex gap-2">
          {SKIN_TONE_OPTIONS.map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => onSkinToneChange(tone)}
              aria-label={`Skin tone: ${tone}`}
              aria-pressed={skinTone === tone}
              className={cn(
                'w-9 h-9 rounded-full border-2 transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400',
                skinTone === tone
                  ? 'border-mimoo-purple-500 ring-2 ring-mimoo-purple-200'
                  : 'border-mimoo-purple-100 hover:border-mimoo-purple-300'
              )}
              style={{ backgroundColor: SKIN_TONES[tone].base }}
            />
          ))}
        </div>
      </div>

      {/* Outfit color */}
      <div>
        <label className="block text-xs font-semibold text-mimoo-ink-700 mb-2">
          {t('avatarPicker.outfit')}
        </label>
        <div className="flex gap-2">
          {OUTFIT_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onOutfitChange(color)}
              aria-label={`Outfit: ${color}`}
              aria-pressed={outfit === color}
              className={cn(
                'w-9 h-9 rounded-full border-2 transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400',
                outfit === color
                  ? 'border-mimoo-purple-500 ring-2 ring-mimoo-purple-200'
                  : 'border-mimoo-purple-100 hover:border-mimoo-purple-300'
              )}
              style={{ backgroundColor: OUTFIT_COLORS[color].base }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
