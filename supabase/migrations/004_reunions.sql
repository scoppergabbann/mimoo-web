-- =================================================================
-- Migration 004: Reunion Stories
-- Adds: reunion stories table (anonymous testimonials)
-- =================================================================

CREATE TABLE IF NOT EXISTS reunion_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  report_id UUID REFERENCES finder_reports(id) ON DELETE SET NULL,
  -- Owner can share their story (optional, anonymous-friendly)
  story_text TEXT NOT NULL CHECK (length(story_text) BETWEEN 10 AND 500),
  -- Optional public display info
  display_name TEXT,
  item_type TEXT, -- e.g. "Dompet", "KTP" — not exact item name (privacy)
  city TEXT, -- e.g. "Jakarta", "Bandung" — not exact location
  -- Anti-spam
  is_published BOOLEAN DEFAULT FALSE, -- admin moderates before publish
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reunion_stories_published_idx ON reunion_stories(is_published, created_at DESC);

-- RLS
ALTER TABLE reunion_stories ENABLE ROW LEVEL SECURITY;

-- Owners can submit their stories
DROP POLICY IF EXISTS "Owners can submit stories" ON reunion_stories;
CREATE POLICY "Owners can submit stories"
  ON reunion_stories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM items
      WHERE items.id = reunion_stories.item_id
        AND items.owner_id = auth.uid()
    )
  );

-- Public can read published stories
DROP POLICY IF EXISTS "Public can read published stories" ON reunion_stories;
CREATE POLICY "Public can read published stories"
  ON reunion_stories FOR SELECT
  TO public
  USING (is_published = TRUE);

-- Owners can read & manage their own (even if unpublished)
DROP POLICY IF EXISTS "Owners read own stories" ON reunion_stories;
CREATE POLICY "Owners read own stories"
  ON reunion_stories FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM items
      WHERE items.id = reunion_stories.item_id
        AND items.owner_id = auth.uid()
    )
  );

-- Update finder_reports to track resolution status
ALTER TABLE finder_reports
ADD COLUMN IF NOT EXISTS resolved_with_reunion BOOLEAN DEFAULT FALSE;

-- Counter view untuk landing page (public aggregate)
CREATE OR REPLACE VIEW reunion_counter AS
SELECT COUNT(*) AS total_reunions
FROM reunion_stories
WHERE is_published = TRUE;

GRANT SELECT ON reunion_counter TO anon, authenticated;
