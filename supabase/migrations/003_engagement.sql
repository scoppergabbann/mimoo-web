-- =================================================================
-- 🎯 MIMOO DATABASE SETUP — Migration 003: Onboarding & Reunion Stories
-- =================================================================
-- Phase 5B: Engagement features
-- Run this AFTER 001_profiles.sql AND 002_items.sql
--
-- Yang dibikin:
-- ✅ Column `onboarded_at` di profiles (track first-time user)
-- ✅ Column `bio` di profiles (optional profile description)
-- ✅ Column `reunited_at` di finder_reports (track reunion success)
-- ✅ Column `reunion_story` di finder_reports (anonymous testimonial)
-- ✅ Column `share_reunion_publicly` di finder_reports (opt-in share)
-- =================================================================

-- =================================================================
-- 1. PROFILES — Add onboarding & bio
-- =================================================================
alter table public.profiles
  add column if not exists onboarded_at timestamptz,
  add column if not exists bio text check (char_length(bio) <= 200);

comment on column public.profiles.onboarded_at is 'Set saat user complete welcome tutorial';
comment on column public.profiles.bio is 'Optional bio (max 200 chars) - tampil di profile';

-- =================================================================
-- 2. FINDER REPORTS — Reunion tracking
-- =================================================================
alter table public.finder_reports
  add column if not exists reunited_at timestamptz,
  add column if not exists reunion_story text check (char_length(reunion_story) <= 500),
  add column if not exists share_reunion_publicly boolean default false not null;

comment on column public.finder_reports.reunited_at is 'Set saat owner mark report as resolved (reunion happened)';
comment on column public.finder_reports.reunion_story is 'Optional anonymous reunion testimonial';
comment on column public.finder_reports.share_reunion_publicly is 'User opt-in to share story di landing page';

-- Index untuk lookup successful reunions
create index if not exists finder_reports_reunited_at_idx 
  on public.finder_reports(reunited_at desc) 
  where reunited_at is not null;

create index if not exists finder_reports_public_stories_idx
  on public.finder_reports(reunited_at desc)
  where share_reunion_publicly = true and reunion_story is not null;

-- =================================================================
-- 3. PUBLIC STATS VIEW (untuk landing page counter)
-- =================================================================
create or replace view public.mimoo_stats as
select
  (select count(*) from public.items) as total_items,
  (select count(*) from public.finder_reports where reunited_at is not null) as total_reunions,
  (select count(*) from public.profiles) as total_users;

comment on view public.mimoo_stats is 'Aggregate stats untuk public display (landing counter)';

-- Allow anon to read stats view
grant select on public.mimoo_stats to anon, authenticated;

-- =================================================================
-- 4. PUBLIC REUNION STORIES VIEW
-- =================================================================
-- View untuk reunion stories yang opt-in untuk public sharing
create or replace view public.public_reunion_stories as
select
  fr.id,
  fr.reunion_story,
  fr.reunited_at,
  fr.location_text,
  i.name as item_name,
  i.category as item_category,
  p.name as owner_name,
  p.avatar_character as owner_avatar_character,
  p.avatar_skin_tone as owner_avatar_skin_tone
from public.finder_reports fr
inner join public.items i on i.id = fr.item_id
inner join public.profiles p on p.id = i.owner_id
where fr.share_reunion_publicly = true
  and fr.reunion_story is not null
  and fr.reunited_at is not null
order by fr.reunited_at desc;

comment on view public.public_reunion_stories is 'Opt-in reunion stories untuk display di landing/blog';

grant select on public.public_reunion_stories to anon, authenticated;

-- =================================================================
-- ✅ DONE!
-- =================================================================
-- Verifikasi:
-- 1. profiles → harus ada kolom onboarded_at, bio
-- 2. finder_reports → harus ada reunited_at, reunion_story, share_reunion_publicly
-- 3. Test query: SELECT * FROM mimoo_stats
-- 4. Test query: SELECT * FROM public_reunion_stories
-- =================================================================
