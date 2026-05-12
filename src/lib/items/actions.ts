'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { encrypt, hash } from '@/lib/crypto';
import {
  itemSchema,
  lostModeSchema,
  finderReportSchema,
  type ItemInput,
  type LostModeInput,
  type FinderReportInput,
} from './schemas';
import { generateRecoveryCode } from './recovery-code';
import type { Item, PublicItem, FinderReport, EmergencyContactDecrypted } from './types';

export type ActionResult<T = unknown> = {
  success?: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
};

// =================================================================
// CREATE ITEM
// =================================================================
export async function createItemAction(
  input: ItemInput
): Promise<ActionResult<{ id: string; recovery_code: string }>> {
  const parsed = itemSchema.safeParse(input);
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

  // Generate recovery code with retry on collision
  let recoveryCode = generateRecoveryCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase
      .from('items')
      .select('id')
      .eq('recovery_code', recoveryCode)
      .maybeSingle();

    if (!existing) break;
    recoveryCode = generateRecoveryCode();
  }

  const { data, error } = await supabase
    .from('items')
    .insert({
      owner_id: user.id,
      recovery_code: recoveryCode,
      name: parsed.data.name,
      category: parsed.data.category || null,
      custom_message: parsed.data.custom_message || null,
    })
    .select('id, recovery_code')
    .single();

  if (error) {
    console.error('Create item error:', error);
    return { error: 'Gagal membuat item. Coba lagi ya!' };
  }

  revalidatePath('/dashboard');
  return { success: true, data };
}

// =================================================================
// UPDATE ITEM
// =================================================================
export async function updateItemAction(
  itemId: string,
  input: ItemInput
): Promise<ActionResult> {
  const parsed = itemSchema.safeParse(input);
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

  const { error } = await supabase
    .from('items')
    .update({
      name: parsed.data.name,
      category: parsed.data.category || null,
      custom_message: parsed.data.custom_message || null,
    })
    .eq('id', itemId)
    .eq('owner_id', user.id);

  if (error) {
    return { error: 'Gagal update item' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/items/${itemId}`);
  return { success: true };
}

// =================================================================
// DELETE ITEM
// =================================================================
export async function deleteItemAction(itemId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Kamu harus login dulu ya' };

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)
    .eq('owner_id', user.id);

  if (error) {
    return { error: 'Gagal menghapus item' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

// =================================================================
// TOGGLE LOST MODE
// =================================================================
export async function toggleLostModeAction(
  itemId: string,
  input: LostModeInput
): Promise<ActionResult> {
  const parsed = lostModeSchema.safeParse(input);
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

  // Update item is_lost
  const { error: itemError } = await supabase
    .from('items')
    .update({ is_lost: parsed.data.enable })
    .eq('id', itemId)
    .eq('owner_id', user.id);

  if (itemError) {
    return { error: 'Gagal update lost mode' };
  }

  // Upsert emergency contact (encrypted)
  if (parsed.data.enable) {
    const { error: contactError } = await supabase
      .from('emergency_contacts')
      .upsert(
        {
          item_id: itemId,
          whatsapp_encrypted: parsed.data.whatsapp
            ? encrypt(parsed.data.whatsapp)
            : null,
          phone_encrypted: parsed.data.phone ? encrypt(parsed.data.phone) : null,
          email_encrypted: parsed.data.email ? encrypt(parsed.data.email) : null,
          has_reward: parsed.data.has_reward,
          reward_description: parsed.data.reward_description || null,
        },
        { onConflict: 'item_id' }
      );

    if (contactError) {
      console.error('Emergency contact error:', contactError);
      return { error: 'Gagal save emergency contact' };
    }
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/items/${itemId}`);
  return { success: true };
}

// =================================================================
// SUBMIT FINDER REPORT (PUBLIC, no auth required)
// =================================================================
export async function submitFinderReportAction(
  recoveryCode: string,
  input: FinderReportInput
): Promise<ActionResult> {
  const parsed = finderReportSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    return { fieldErrors };
  }

  const supabase = await createClient();

  // Get item by recovery code
  const { data: item, error: itemError } = await supabase
    .from('items')
    .select('id')
    .eq('recovery_code', recoveryCode.toUpperCase())
    .maybeSingle();

  if (itemError || !item) {
    return { error: 'Item tidak ditemukan' };
  }

  // Get IP & UA for anti-abuse logging (hash IP for privacy)
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for') || '';
  const realIp = headersList.get('x-real-ip') || '';
  const ipRaw = forwardedFor.split(',')[0].trim() || realIp || 'unknown';
  const ipHash = hash(ipRaw);
  const userAgent = headersList.get('user-agent') || '';

  // Submit report
  const { error: reportError } = await supabase.from('finder_reports').insert({
    item_id: item.id,
    message: parsed.data.message,
    location_text: parsed.data.location_text,
    location_lat: parsed.data.location_lat || null,
    location_lng: parsed.data.location_lng || null,
    finder_name: parsed.data.finder_name || null,
    finder_contact: parsed.data.finder_contact || null,
    ip_hash: ipHash,
    user_agent: userAgent.substring(0, 500),
  });

  if (reportError) {
    console.error('Finder report error:', reportError);
    return { error: 'Gagal kirim laporan. Coba lagi ya!' };
  }

  return { success: true };
}

// =================================================================
// MARK FINDER REPORT AS SEEN / RESOLVED
// =================================================================
export async function updateReportStatusAction(
  reportId: string,
  status: 'seen' | 'resolved' | 'spam'
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Kamu harus login dulu ya' };

  const { error } = await supabase
    .from('finder_reports')
    .update({ status })
    .eq('id', reportId);

  if (error) {
    return { error: 'Gagal update status laporan' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

// =================================================================
// LOG CONTACT REVEAL (anti-abuse audit)
// =================================================================
export async function logContactRevealAction(
  recoveryCode: string,
  channel: 'whatsapp' | 'phone' | 'email'
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: item } = await supabase
    .from('items')
    .select('id')
    .eq('recovery_code', recoveryCode.toUpperCase())
    .maybeSingle();

  if (!item) return { error: 'Item not found' };

  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for') || '';
  const realIp = headersList.get('x-real-ip') || '';
  const ipRaw = forwardedFor.split(',')[0].trim() || realIp || 'unknown';
  const ipHash = hash(ipRaw);
  const userAgent = headersList.get('user-agent') || '';

  await supabase.from('contact_reveals').insert({
    item_id: item.id,
    ip_hash: ipHash,
    user_agent: userAgent.substring(0, 500),
    channel,
  });

  return { success: true };
}
