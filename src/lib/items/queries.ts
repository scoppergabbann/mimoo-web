import { createClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/crypto';
import type {
  Item,
  PublicItem,
  FinderReport,
  EmergencyContactDecrypted,
} from './types';
import { getUserAvatarConfig, getUserDisplayName } from '@/lib/auth/helpers';

/**
 * Get all items for the current user.
 */
export async function getMyItems(): Promise<Item[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getMyItems error:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single item by ID (owner only).
 */
export async function getMyItem(id: string): Promise<Item | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('getMyItem error:', error);
    return null;
  }

  return data;
}

/**
 * Get finder reports for an item (owner only).
 */
export async function getItemReports(itemId: string): Promise<FinderReport[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('finder_reports')
    .select('*')
    .eq('item_id', itemId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getItemReports error:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all unread reports for current user (across all items).
 * For dashboard notifications.
 */
export async function getUnreadReports(): Promise<FinderReport[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('finder_reports')
    .select('*, items!inner(owner_id)')
    .eq('items.owner_id', user.id)
    .eq('status', 'new')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('getUnreadReports error:', error);
    return [];
  }

  return data || [];
}

/**
 * Get item by recovery code for PUBLIC recovery page.
 * Returns only safe-to-expose fields.
 */
export async function getPublicItemByCode(code: string): Promise<PublicItem | null> {
  const supabase = await createClient();
  const normalizedCode = code.toUpperCase();

  const { data: item, error } = await supabase
    .from('items')
    .select('id, recovery_code, name, category, custom_message, is_lost, owner_id')
    .eq('recovery_code', normalizedCode)
    .maybeSingle();

  if (error || !item) {
    return null;
  }

  // Increment scan count atomically (graceful — ignore failure)
  await supabase
    .rpc('increment_scan_count', { item_id_param: item.id })
    .then(
      () => {},
      () => {}
    );

  // Fetch owner display info from profiles (NOT auth.admin — anon-safe)
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, avatar_character, avatar_skin_tone, avatar_outfit, avatar_accent')
    .eq('id', item.owner_id)
    .maybeSingle();

  return {
    id: item.id,
    recovery_code: item.recovery_code,
    name: item.name,
    category: item.category,
    custom_message: item.custom_message,
    is_lost: item.is_lost,
    owner_name: profile?.name || 'Sahabat Mimoo',
    owner_avatar: profile
      ? {
          character: profile.avatar_character || 'denpa',
          skinTone: profile.avatar_skin_tone || 'medium',
          outfit: profile.avatar_outfit || 'purple',
          accent: profile.avatar_accent || 'purple',
        }
      : undefined,
  };
}

/**
 * Get emergency contact for a LOST item (public, decrypted).
 * Only returns data if item.is_lost = true.
 */
export async function getEmergencyContact(
  recoveryCode: string
): Promise<EmergencyContactDecrypted | null> {
  const supabase = await createClient();

  // Verify item is lost first
  const { data: item } = await supabase
    .from('items')
    .select('id, is_lost')
    .eq('recovery_code', recoveryCode.toUpperCase())
    .maybeSingle();

  if (!item || !item.is_lost) return null;

  const { data: contact, error } = await supabase
    .from('emergency_contacts')
    .select('whatsapp_encrypted, phone_encrypted, email_encrypted, has_reward, reward_description')
    .eq('item_id', item.id)
    .maybeSingle();

  if (error || !contact) return null;

  // Decrypt at app layer (NEVER expose encrypted values)
  return {
    whatsapp: contact.whatsapp_encrypted ? decrypt(contact.whatsapp_encrypted) : null,
    phone: contact.phone_encrypted ? decrypt(contact.phone_encrypted) : null,
    email: contact.email_encrypted ? decrypt(contact.email_encrypted) : null,
    has_reward: contact.has_reward,
    reward_description: contact.reward_description,
  };
}

/**
 * Get full emergency contact for owner (with original values for editing).
 */
export async function getMyEmergencyContact(
  itemId: string
): Promise<EmergencyContactDecrypted | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Verify ownership
  const { data: item } = await supabase
    .from('items')
    .select('id')
    .eq('id', itemId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!item) return null;

  const { data: contact } = await supabase
    .from('emergency_contacts')
    .select('whatsapp_encrypted, phone_encrypted, email_encrypted, has_reward, reward_description')
    .eq('item_id', itemId)
    .maybeSingle();

  if (!contact) return null;

  return {
    whatsapp: contact.whatsapp_encrypted ? decrypt(contact.whatsapp_encrypted) : null,
    phone: contact.phone_encrypted ? decrypt(contact.phone_encrypted) : null,
    email: contact.email_encrypted ? decrypt(contact.email_encrypted) : null,
    has_reward: contact.has_reward,
    reward_description: contact.reward_description,
  };
}
