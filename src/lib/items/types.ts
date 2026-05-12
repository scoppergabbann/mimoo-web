export type ItemCategory =
  | 'card'
  | 'wallet'
  | 'bag'
  | 'electronics'
  | 'keys'
  | 'document'
  | 'jewelry'
  | 'clothing'
  | 'other';

export type ReportStatus = 'new' | 'seen' | 'resolved' | 'spam';

export interface Item {
  id: string;
  owner_id: string;
  recovery_code: string;
  name: string;
  category: ItemCategory | null;
  custom_message: string | null;
  is_lost: boolean;
  lost_at: string | null;
  scan_count: number;
  report_count: number;
  created_at: string;
  updated_at: string;
}

/** Public-safe subset of Item for recovery pages */
export interface PublicItem {
  id: string;
  recovery_code: string;
  name: string;
  category: ItemCategory | null;
  custom_message: string | null;
  is_lost: boolean;
  // Owner info (limited!)
  owner_name?: string;
  owner_avatar?: {
    character: string;
    skinTone: string;
    outfit: string;
    accent: string;
  };
}

export interface FinderReport {
  id: string;
  item_id: string;
  message: string;
  location_text: string;
  location_lat: number | null;
  location_lng: number | null;
  finder_name: string | null;
  finder_contact: string | null;
  status: ReportStatus;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  item_id: string;
  whatsapp_encrypted: string | null;
  phone_encrypted: string | null;
  email_encrypted: string | null;
  has_reward: boolean;
  reward_description: string | null;
}

/** Decrypted version (used after AES decrypt) */
export interface EmergencyContactDecrypted {
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  has_reward: boolean;
  reward_description: string | null;
}

// === Category metadata ===
export interface CategoryMeta {
  id: ItemCategory;
  labelId: string;
  labelEn: string;
  emoji: string;
}

export const ITEM_CATEGORIES: CategoryMeta[] = [
  { id: 'card', labelId: 'Kartu', labelEn: 'Card', emoji: '💳' },
  { id: 'wallet', labelId: 'Dompet', labelEn: 'Wallet', emoji: '👛' },
  { id: 'bag', labelId: 'Tas', labelEn: 'Bag', emoji: '🎒' },
  { id: 'electronics', labelId: 'Elektronik', labelEn: 'Electronics', emoji: '💻' },
  { id: 'keys', labelId: 'Kunci', labelEn: 'Keys', emoji: '🔑' },
  { id: 'document', labelId: 'Dokumen', labelEn: 'Document', emoji: '📄' },
  { id: 'jewelry', labelId: 'Perhiasan', labelEn: 'Jewelry', emoji: '💍' },
  { id: 'clothing', labelId: 'Pakaian', labelEn: 'Clothing', emoji: '🧢' },
  { id: 'other', labelId: 'Lainnya', labelEn: 'Other', emoji: '✨' },
];

export function getCategoryMeta(id: ItemCategory | null): CategoryMeta | null {
  if (!id) return null;
  return ITEM_CATEGORIES.find((c) => c.id === id) || null;
}
