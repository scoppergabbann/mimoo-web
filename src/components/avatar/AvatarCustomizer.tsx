'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CheckIcon } from '@/components/ui/Icons';
import { updateAvatarAction } from '@/lib/avatar/actions';
import {
  CHARACTERS,
  SKIN_TONES,
  OUTFIT_COLORS,
  ACCENT_COLORS,
  type AvatarConfig,
  type CharacterId,
  type SkinTone,
  type OutfitColor,
  type AccentColor,
} from '@/lib/avatar/types';
import { cn } from '@/lib/utils';

interface AvatarCustomizerProps {
  initialConfig: AvatarConfig;
  labels: {
    title: string;
    subtitle: string;
    pickCharacter: string;
    pickCharacterHelper: string;
    comingSoon: string;
    skinTone: string;
    outfitColor: string;
    accentColor: string;
    preview: string;
    save: string;
    cancel: string;
    saved: string;
    saveError: string;
  };
}

const SKIN_TONE_OPTIONS: SkinTone[] = ['light', 'medium', 'tan', 'deep'];
const OUTFIT_OPTIONS: OutfitColor[] = ['purple', 'blue', 'pink', 'cream', 'sage'];
const ACCENT_OPTIONS: AccentColor[] = ['purple', 'blue', 'pink'];

export function AvatarCustomizer({ initialConfig, labels }: AvatarCustomizerProps) {
  const router = useRouter();
  const [config, setConfig] = useState<AvatarConfig>(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [savedState, setSavedState] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const allCharacters = Object.values(CHARACTERS);
  const availableCharacters = allCharacters.filter((c) => c.available);
  const comingSoonCharacters = allCharacters.filter((c) => !c.available);

  // Detect if config changed from initial
  const hasChanges =
    config.character !== initialConfig.character ||
    config.skinTone !== initialConfig.skinTone ||
    config.outfit !== initialConfig.outfit ||
    config.accent !== initialConfig.accent;

  function handleSave() {
    setSavedState('idle');
    setErrorMsg('');
    startTransition(async () => {
      const result = await updateAvatarAction(config);
      if (result.error) {
        setSavedState('error');
        setErrorMsg(result.error);
        return;
      }
      if (result.success) {
        setSavedState('saved');
        router.refresh();
        // Reset saved indicator after 2s
        setTimeout(() => setSavedState('idle'), 2000);
      }
    });
  }

  function handleReset() {
    setConfig(initialConfig);
    setSavedState('idle');
    setErrorMsg('');
  }

  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
      {/* Preview card (sticky on desktop) */}
      <div className="lg:sticky lg:top-24 self-start">
        <Card variant="elevated" className="p-6 text-center">
          <p className="text-xs uppercase tracking-wider font-semibold text-mimoo-ink-300 mb-4">
            {labels.preview}
          </p>
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-mimoo-purple-50 to-mimoo-cream-100 p-4 rounded-cozy-lg">
              <MimooAvatar config={config} size="xl" />
            </div>
          </div>
          <h3 className="font-display text-xl font-bold text-mimoo-ink-900 mb-1">
            {CHARACTERS[config.character].name}
          </h3>
          <p className="text-xs text-mimoo-ink-500 mb-4">
            {CHARACTERS[config.character].origin}
          </p>

          <div className="flex gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleReset}
              disabled={isPending || !hasChanges}
              className="flex-1"
            >
              {labels.cancel}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={isPending || !hasChanges}
              isLoading={isPending}
              className="flex-[2]"
            >
              {labels.save}
            </Button>
          </div>

          {savedState === 'saved' && (
            <p
              className="mt-3 text-xs text-mimoo-mint-300 font-semibold flex items-center justify-center gap-1"
              role="status"
            >
              <CheckIcon className="w-3.5 h-3.5" />
              <span>{labels.saved}</span>
            </p>
          )}

          {savedState === 'error' && (
            <p className="mt-3 text-xs text-mimoo-pink-400 font-medium" role="alert">
              {errorMsg || labels.saveError}
            </p>
          )}
        </Card>
      </div>

      {/* Customization options */}
      <div className="space-y-6">
        {/* Character picker */}
        <Card variant="default">
          <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-1">
            {labels.pickCharacter}
          </h3>
          <p className="text-sm text-mimoo-ink-500 mb-4">{labels.pickCharacterHelper}</p>

          {/* Available characters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {availableCharacters.map((char) => (
              <button
                key={char.id}
                type="button"
                onClick={() => setConfig({ ...config, character: char.id })}
                aria-pressed={config.character === char.id}
                disabled={isPending}
                className={cn(
                  'p-3 rounded-cozy border-2 transition-all',
                  'hover:bg-mimoo-purple-50',
                  'focus:outline-none focus-visible:ring-4 focus-visible:ring-mimoo-purple-100',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  config.character === char.id
                    ? 'border-mimoo-purple-500 bg-mimoo-purple-50 shadow-soft'
                    : 'border-transparent bg-mimoo-cream-100 hover:border-mimoo-purple-200'
                )}
              >
                <div className="aspect-square mb-2">
                  <MimooAvatar
                    config={{
                      character: char.id,
                      skinTone: config.skinTone,
                      outfit: config.outfit,
                      accent: config.accent,
                    }}
                    size="sm"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-sm font-bold text-mimoo-ink-900 leading-tight">
                  {char.name}
                </p>
                <p className="text-[10px] text-mimoo-ink-500 leading-tight mt-0.5 truncate">
                  {char.origin}
                </p>
              </button>
            ))}
          </div>

          {/* Coming soon characters (disabled) */}
          {comingSoonCharacters.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3 pt-4 border-t border-mimoo-purple-50">
                <Badge variant="cream" size="sm">
                  🚧 {labels.comingSoon}
                </Badge>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 opacity-60">
                {comingSoonCharacters.map((char) => (
                  <div
                    key={char.id}
                    className="aspect-square p-2 rounded-cozy bg-mimoo-cream-200 flex items-center justify-center cursor-not-allowed"
                    title={`${char.name} (${char.origin}) — ${labels.comingSoon}`}
                  >
                    <MimooAvatar
                      config={{
                        character: char.id,
                        skinTone: config.skinTone,
                        outfit: config.outfit,
                        accent: config.accent,
                      }}
                      size="xs"
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Skin tone picker */}
        <Card variant="default">
          <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-1">
            {labels.skinTone}
          </h3>
          <div className="flex gap-3 mt-3">
            {SKIN_TONE_OPTIONS.map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => setConfig({ ...config, skinTone: tone })}
                aria-pressed={config.skinTone === tone}
                aria-label={`Skin tone: ${tone}`}
                disabled={isPending}
                className={cn(
                  'w-12 h-12 rounded-full border-4 transition-all',
                  'focus:outline-none focus-visible:ring-4 focus-visible:ring-mimoo-purple-100',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  config.skinTone === tone
                    ? 'border-mimoo-purple-500 scale-110 shadow-soft'
                    : 'border-mimoo-purple-100 hover:border-mimoo-purple-300'
                )}
                style={{ backgroundColor: SKIN_TONES[tone].base }}
              />
            ))}
          </div>
        </Card>

        {/* Outfit color */}
        <Card variant="default">
          <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-1">
            {labels.outfitColor}
          </h3>
          <div className="flex gap-3 mt-3">
            {OUTFIT_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setConfig({ ...config, outfit: color })}
                aria-pressed={config.outfit === color}
                aria-label={`Outfit: ${color}`}
                disabled={isPending}
                className={cn(
                  'w-12 h-12 rounded-full border-4 transition-all',
                  'focus:outline-none focus-visible:ring-4 focus-visible:ring-mimoo-purple-100',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  config.outfit === color
                    ? 'border-mimoo-purple-500 scale-110 shadow-soft'
                    : 'border-mimoo-purple-100 hover:border-mimoo-purple-300'
                )}
                style={{ backgroundColor: OUTFIT_COLORS[color].base }}
              />
            ))}
          </div>
        </Card>

        {/* Accent color */}
        <Card variant="default">
          <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-1">
            {labels.accentColor}
          </h3>
          <div className="flex gap-3 mt-3">
            {ACCENT_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setConfig({ ...config, accent: color })}
                aria-pressed={config.accent === color}
                aria-label={`Accent: ${color}`}
                disabled={isPending}
                className={cn(
                  'w-12 h-12 rounded-full border-4 transition-all',
                  'focus:outline-none focus-visible:ring-4 focus-visible:ring-mimoo-purple-100',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  config.accent === color
                    ? 'border-mimoo-purple-500 scale-110 shadow-soft'
                    : 'border-mimoo-purple-100 hover:border-mimoo-purple-300'
                )}
                style={{ backgroundColor: ACCENT_COLORS[color] }}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
