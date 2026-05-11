import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { AvatarConfig, CharacterId, SkinTone, OutfitColor, AccentColor } from '@/lib/avatar/types';
import { DEFAULT_AVATAR_CONFIG } from '@/lib/avatar/types';

/**
 * Get currently authenticated user (or null kalau belum login).
 * Bisa dipanggil dari Server Components.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Require auth — redirect ke /login kalau belum auth.
 * Pakai ini di Server Components yang butuh user.
 */
export async function requireAuth(locale: 'id' | 'en' = 'id') {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }
  return user;
}

/**
 * Get user's display name dari metadata.
 */
export function getUserDisplayName(user: {
  user_metadata?: { name?: string; full_name?: string };
  email?: string | null;
}): string {
  return (
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Sahabat Mimoo'
  );
}

/**
 * Get user's avatar config dari metadata, fallback ke default.
 */
export function getUserAvatarConfig(user: {
  user_metadata?: {
    avatar_character?: string;
    avatar_skin_tone?: string;
    avatar_outfit?: string;
    avatar_accent?: string;
  };
}): AvatarConfig {
  const meta = user.user_metadata || {};
  return {
    character: (meta.avatar_character as CharacterId) || DEFAULT_AVATAR_CONFIG.character,
    skinTone: (meta.avatar_skin_tone as SkinTone) || DEFAULT_AVATAR_CONFIG.skinTone,
    outfit: (meta.avatar_outfit as OutfitColor) || DEFAULT_AVATAR_CONFIG.outfit,
    accent: (meta.avatar_accent as AccentColor) || DEFAULT_AVATAR_CONFIG.accent,
  };
}
