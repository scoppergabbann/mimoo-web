import { z } from 'zod';

const ITEM_CATEGORIES_VALUES = [
  'card', 'wallet', 'bag', 'electronics', 'keys',
  'document', 'jewelry', 'clothing', 'other',
] as const;

/**
 * Schema untuk create/update Item.
 */
export const itemSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama barang tidak boleh kosong')
    .max(100, 'Nama maksimal 100 karakter'),
  category: z.enum(ITEM_CATEGORIES_VALUES).optional().nullable(),
  custom_message: z
    .string()
    .max(500, 'Pesan maksimal 500 karakter')
    .optional()
    .nullable(),
});

export type ItemInput = z.infer<typeof itemSchema>;

/**
 * Schema untuk Lost Mode dengan emergency contact.
 */
export const lostModeSchema = z.object({
  enable: z.boolean(),
  // Hanya validate kalau enable = true
  whatsapp: z
    .string()
    .max(20)
    .regex(/^(\+62|62|0)[0-9]{8,13}$/, 'Format nomor WhatsApp tidak valid')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20)
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  has_reward: z.boolean().default(false),
  reward_description: z
    .string()
    .max(300, 'Deskripsi reward maksimal 300 karakter')
    .optional()
    .or(z.literal('')),
});

export type LostModeInput = z.infer<typeof lostModeSchema>;

/**
 * Schema untuk Finder Report (public submission).
 */
export const finderReportSchema = z.object({
  message: z
    .string()
    .min(5, 'Pesan minimal 5 karakter')
    .max(1000, 'Pesan maksimal 1000 karakter'),
  location_text: z
    .string()
    .min(3, 'Lokasi minimal 3 karakter')
    .max(200, 'Lokasi maksimal 200 karakter'),
  location_lat: z.number().min(-90).max(90).optional().nullable(),
  location_lng: z.number().min(-180).max(180).optional().nullable(),
  finder_name: z
    .string()
    .max(100, 'Nama maksimal 100 karakter')
    .optional()
    .or(z.literal('')),
  finder_contact: z
    .string()
    .max(200)
    .optional()
    .or(z.literal('')),
});

export type FinderReportInput = z.infer<typeof finderReportSchema>;
