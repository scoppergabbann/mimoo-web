'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const reunionStorySchema = z.object({
  reportId: z.string().uuid(),
  itemId: z.string().uuid(),
  storyText: z
    .string()
    .min(10, 'Cerita minimal 10 karakter')
    .max(500, 'Cerita maksimal 500 karakter'),
  displayName: z.string().max(50).optional().nullable(),
  city: z.string().max(50).optional().nullable(),
  shareAnonymously: z.boolean().default(false),
});

export type ReunionStoryInput = z.infer<typeof reunionStorySchema>;

interface ActionResult {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Mark report as resolved with a reunion + optionally share story.
 */
export async function submitReunionStoryAction(
  input: ReunionStoryInput
): Promise<ActionResult> {
  const parsed = reunionStorySchema.safeParse(input);
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

  // Verify ownership
  const { data: item } = await supabase
    .from('items')
    .select('id, category')
    .eq('id', parsed.data.itemId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!item) return { error: 'Item tidak ditemukan' };

  // Mark report as resolved with reunion
  await supabase
    .from('finder_reports')
    .update({
      resolved_with_reunion: true,
      status: 'resolved',
    })
    .eq('id', parsed.data.reportId)
    .eq('item_id', parsed.data.itemId);

  // Save story (default unpublished — admin approves before showing on landing)
  const { error } = await supabase.from('reunion_stories').insert({
    item_id: parsed.data.itemId,
    report_id: parsed.data.reportId,
    story_text: parsed.data.storyText,
    display_name: parsed.data.shareAnonymously
      ? null
      : parsed.data.displayName || null,
    item_type: item.category, // generic, not exact name (privacy)
    city: parsed.data.city || null,
    is_published: false, // moderation required
  });

  if (error) {
    console.error('Reunion story error:', error);
    return { error: 'Gagal simpan cerita reunion. Coba lagi ya!' };
  }

  revalidatePath(`/dashboard/items/${parsed.data.itemId}`);
  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Get total reunion count (public, for landing page badge).
 */
export async function getReunionCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('reunion_stories')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  return count || 0;
}
