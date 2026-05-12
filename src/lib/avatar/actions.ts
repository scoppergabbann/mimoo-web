'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { AvatarConfig } from '@/lib/avatar/types';

const avatarConfigSchema = z.object({
  character: z.enum(['denpa', 'jaya', 'salma', 'kupa']),
  skinTone: z.enum(['light', 'medium', 'tan', 'deep']),
  outfit: z.enum(['purple', 'blue', 'pink', 'cream', 'sage']),
  accent: z.enum(['purple', 'blue', 'pink']),
});

export type AvatarActionResult = {
  success?: boolean;
  error?: string;
};

/**
 * Update user's avatar config.
 * Updates both:
 *  - profiles table (used for public recovery page)
 *  - auth.user_metadata (used for fast nav/dashboard reads)
 */
export async function updateAvatarAction(
  config: AvatarConfig
): Promise<AvatarActionResult> {
  const parsed = avatarConfigSchema.safeParse(config);
  if (!parsed.success) {
    return { error: 'Konfigurasi avatar tidak valid' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Kamu harus login dulu ya' };

  // Update profile table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      avatar_character: parsed.data.character,
      avatar_skin_tone: parsed.data.skinTone,
      avatar_outfit: parsed.data.outfit,
      avatar_accent: parsed.data.accent,
    })
    .eq('id', user.id);

  if (profileError) {
    console.error('Update profile avatar error:', profileError);
    return { error: 'Gagal menyimpan avatar. Coba lagi ya!' };
  }

  // Also update auth metadata (so it's available immediately in user.user_metadata)
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      avatar_character: parsed.data.character,
      avatar_skin_tone: parsed.data.skinTone,
      avatar_outfit: parsed.data.outfit,
      avatar_accent: parsed.data.accent,
    },
  });

  if (metadataError) {
    // Not fatal — profile is the source of truth
    console.warn('Update metadata warning (non-fatal):', metadataError);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
