'use server';

import { createClient } from '@/lib/supabase/server';

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PHOTOS_PER_ITEM = 3;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UploadResult {
  url?: string;
  error?: string;
}

/**
 * Upload photo to Supabase Storage.
 *
 * @param bucket - 'item-photos' or 'report-photos'
 * @param folder - typically user_id (for items) or recovery_code (for reports)
 * @param file - File object (from FormData)
 */
export async function uploadPhoto(
  bucket: 'item-photos' | 'report-photos',
  folder: string,
  file: File
): Promise<UploadResult> {
  // Validate
  if (file.size > MAX_PHOTO_SIZE) {
    return { error: 'Foto terlalu besar (max 5MB)' };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Format foto harus JPG, PNG, atau WebP' };
  }

  const supabase = await createClient();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
  const filename = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Photo upload error:', error);
    return { error: 'Gagal upload foto. Coba lagi ya!' };
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { url: urlData.publicUrl };
}

/**
 * Add photos to an existing item (max 3 total).
 */
export async function addItemPhotos(
  itemId: string,
  files: File[]
): Promise<{ urls?: string[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Kamu harus login dulu ya' };

  // Verify ownership + check existing photo count
  const { data: item } = await supabase
    .from('items')
    .select('id, photo_urls')
    .eq('id', itemId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!item) return { error: 'Item tidak ditemukan' };

  const existingCount = (item.photo_urls as string[] | null)?.length || 0;
  if (existingCount + files.length > MAX_PHOTOS_PER_ITEM) {
    return {
      error: `Max ${MAX_PHOTOS_PER_ITEM} foto per item (sudah ada ${existingCount})`,
    };
  }

  // Upload all in parallel
  const uploads = await Promise.all(
    files.map((file) => uploadPhoto('item-photos', user.id, file))
  );

  const successUrls = uploads.filter((r) => r.url).map((r) => r.url!);
  const firstError = uploads.find((r) => r.error)?.error;

  if (successUrls.length === 0 && firstError) {
    return { error: firstError };
  }

  // Update item with new URLs
  const allUrls = [...(item.photo_urls as string[] || []), ...successUrls];
  await supabase.from('items').update({ photo_urls: allUrls }).eq('id', itemId);

  return { urls: successUrls };
}

/**
 * Delete photo from item.
 */
export async function deleteItemPhoto(
  itemId: string,
  photoUrl: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const { data: item } = await supabase
    .from('items')
    .select('photo_urls')
    .eq('id', itemId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!item) return { error: 'Item tidak ditemukan' };

  // Remove URL from array
  const updatedUrls = ((item.photo_urls as string[] | null) || []).filter(
    (u) => u !== photoUrl
  );

  // Extract path from URL to delete from storage
  const pathMatch = photoUrl.match(/item-photos\/(.+)$/);
  if (pathMatch) {
    await supabase.storage.from('item-photos').remove([pathMatch[1]]);
  }

  await supabase.from('items').update({ photo_urls: updatedUrls }).eq('id', itemId);

  return { success: true };
}
