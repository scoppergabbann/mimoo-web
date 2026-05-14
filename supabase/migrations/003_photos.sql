-- =================================================================
-- Migration 003: Photo Support
-- Adds: item photos, finder report photos
-- Storage buckets: item-photos, report-photos
-- =================================================================

-- Add photo URLs to items (max 3 photos per item, stored as array)
ALTER TABLE items
ADD COLUMN IF NOT EXISTS photo_urls TEXT[] DEFAULT '{}';

-- Add photo URLs to finder reports (max 3 photos per report)
ALTER TABLE finder_reports
ADD COLUMN IF NOT EXISTS photo_urls TEXT[] DEFAULT '{}';

-- =================================================================
-- STORAGE BUCKETS — Run di Supabase Dashboard → Storage manually:
--
-- 1. Create bucket "item-photos" (public, 5MB file limit, image/*)
-- 2. Create bucket "report-photos" (public, 5MB file limit, image/*)
--
-- RLS policies untuk item-photos:
--   INSERT: authenticated users only, owner_id = auth.uid()
--   SELECT: public read (untuk recovery page)
--   DELETE: only owner (via item ownership)
--
-- RLS policies untuk report-photos:
--   INSERT: anyone (public, no auth — finders can upload)
--   SELECT: public read
--   DELETE: only item owner
-- =================================================================

-- =================================================================
-- STORAGE POLICIES (run di SQL Editor setelah create buckets)
-- =================================================================

-- ITEM PHOTOS — Owner can upload to their item's folder
DROP POLICY IF EXISTS "Owners can upload item photos" ON storage.objects;
CREATE POLICY "Owners can upload item photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'item-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ITEM PHOTOS — Public read (so recovery page can display)
DROP POLICY IF EXISTS "Public read item photos" ON storage.objects;
CREATE POLICY "Public read item photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'item-photos');

-- ITEM PHOTOS — Owner can delete their own
DROP POLICY IF EXISTS "Owners can delete item photos" ON storage.objects;
CREATE POLICY "Owners can delete item photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'item-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- REPORT PHOTOS — Anonymous finders can upload
DROP POLICY IF EXISTS "Anyone can upload report photos" ON storage.objects;
CREATE POLICY "Anyone can upload report photos"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'report-photos');

-- REPORT PHOTOS — Public read
DROP POLICY IF EXISTS "Public read report photos" ON storage.objects;
CREATE POLICY "Public read report photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'report-photos');

-- INDEX untuk performance
CREATE INDEX IF NOT EXISTS items_photo_urls_idx ON items USING GIN (photo_urls);
CREATE INDEX IF NOT EXISTS reports_photo_urls_idx ON finder_reports USING GIN (photo_urls);
