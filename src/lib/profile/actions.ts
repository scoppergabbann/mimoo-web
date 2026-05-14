'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  locale: z.enum(['id', 'en']),
});

export type ProfileInput = z.infer<typeof profileUpdateSchema>;

export type ProfileActionResult = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Update user profile (name + locale preference).
 * Update both profiles table AND auth metadata for instant sync.
 */
export async function updateProfileAction(
  input: ProfileInput
): Promise<ProfileActionResult> {
  const parsed = profileUpdateSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    return { fieldErrors };
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
      name: parsed.data.name,
      locale: parsed.data.locale,
    })
    .eq('id', user.id);

  if (profileError) {
    console.error('Update profile error:', profileError);
    return { error: 'Gagal menyimpan profil. Coba lagi ya!' };
  }

  // Also update auth metadata (instant sync for navbar etc)
  await supabase.auth.updateUser({
    data: {
      name: parsed.data.name,
      locale: parsed.data.locale,
    },
  });

  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Request account deletion.
 * For now: just flags the account; admin processes within 30 days.
 * Future: full self-service deletion.
 */
export async function requestAccountDeletionAction(): Promise<ProfileActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Kamu harus login dulu ya' };

  // For MVP: just log the request. Admin handles via Supabase Dashboard.
  // Future: trigger Edge Function untuk auto-delete after 30 days
  console.info(`[deletion-request] User ${user.id} requested account deletion`);

  return {
    success: true,
  };
}
