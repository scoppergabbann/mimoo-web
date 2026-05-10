import { CHARACTERS, type AvatarConfig, DEFAULT_AVATAR_CONFIG } from './types';
import { Denpa } from './characters/Denpa';
import { Jaya } from './characters/Jaya';
import { Salma } from './characters/Salma';
import { Kupa } from './characters/Kupa';
import { Placeholder } from './characters/Placeholder';
import { cn } from '@/lib/utils';

interface MimooAvatarProps {
  config?: AvatarConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withFrame?: boolean;
}

const SIZE_CLASSES = {
  xs: 'w-10 h-10',
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-40 h-40',
  xl: 'w-64 h-64',
};

/**
 * Main Mimoo Avatar Component
 *
 * Render karakter Indonesian heritage berdasarkan config.
 * Reusable di seluruh app: dashboard greeting, QR card, profile, dll.
 *
 * @example
 * <MimooAvatar config={{ character: 'denpa', skinTone: 'medium', outfit: 'purple', accent: 'purple' }} size="lg" />
 */
export function MimooAvatar({
  config = DEFAULT_AVATAR_CONFIG,
  size = 'md',
  className,
  withFrame = false,
}: MimooAvatarProps) {
  const characterMeta = CHARACTERS[config.character];

  const renderCharacter = () => {
    if (!characterMeta.available) {
      return <Placeholder character={characterMeta} className="w-full h-full" />;
    }

    const props = {
      skinTone: config.skinTone,
      outfit: config.outfit,
      accent: config.accent,
      className: 'w-full h-full',
    };

    switch (config.character) {
      case 'denpa':
        return <Denpa {...props} />;
      case 'jaya':
        return <Jaya {...props} />;
      case 'salma':
        return <Salma {...props} />;
      case 'kupa':
        return <Kupa {...props} />;
      default:
        return <Placeholder character={characterMeta} className="w-full h-full" />;
    }
  };

  return (
    <div
      className={cn(
        SIZE_CLASSES[size],
        withFrame && 'rounded-full bg-mimoo-purple-50 p-2 shadow-soft',
        'inline-block',
        className
      )}
    >
      {renderCharacter()}
    </div>
  );
}
