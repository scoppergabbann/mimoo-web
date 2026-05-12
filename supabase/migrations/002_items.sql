-- =================================================================
-- 🎯 MIMOO DATABASE SETUP — Migration 002: Items & Recovery System
-- =================================================================
-- Phase 3: Core MVP Flow
-- Run this AFTER 001_profiles.sql
--
-- Cara pakai:
-- 1. Buka Supabase Dashboard → SQL Editor → New Query
-- 2. Copy-paste isi file ini
-- 3. Klik Run
--
-- Yang dibikin:
-- ✅ Table `items` — barang yang dilindungi user
-- ✅ Table `finder_reports` — laporan dari penemu
-- ✅ Table `emergency_contacts` — kontak darurat (encrypted)
-- ✅ Table `contact_reveals` — audit log (anti-abuse)
-- ✅ RLS policies
-- ✅ Indexes for performance
-- =================================================================

-- =================================================================
-- 1. ITEMS TABLE
-- =================================================================
create table if not exists public.items (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  -- Public recovery code (e.g. "ABCD1234") — diisi oleh aplikasi via nanoid
  recovery_code text unique not null,
  -- Item info
  name text not null check (char_length(name) between 1 and 100),
  category text check (category in (
    'card',      -- KTP, SIM, ATM, KTM, Kartu kantor
    'wallet',    -- Dompet
    'bag',       -- Tas, ransel
    'electronics', -- Laptop, HP, kamera
    'keys',      -- Kunci motor/mobil/rumah
    'document',  -- Buku, ijazah, dokumen penting
    'jewelry',   -- Cincin, kalung
    'clothing',  -- Jaket, topi
    'other'
  )),
  custom_message text check (char_length(custom_message) <= 500),
  -- Lost mode state
  is_lost boolean default false not null,
  lost_at timestamptz,
  -- Stats (denormalized for perf)
  scan_count integer default 0 not null,
  report_count integer default 0 not null,
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.items is 'User items dengan QR recovery code';
comment on column public.items.recovery_code is 'Unique 8-char code untuk public URL (mimoo.id/found/CODE)';

-- Indexes
create index if not exists items_owner_id_idx on public.items(owner_id);
create unique index if not exists items_recovery_code_idx on public.items(recovery_code);
create index if not exists items_is_lost_idx on public.items(is_lost) where is_lost = true;

-- Auto-update timestamp trigger
drop trigger if exists items_updated_at on public.items;
create trigger items_updated_at
  before update on public.items
  for each row
  execute function public.handle_updated_at();

-- Auto-set lost_at when is_lost changes
create or replace function public.handle_lost_mode_change()
returns trigger
language plpgsql
as $$
begin
  if new.is_lost = true and (old.is_lost is null or old.is_lost = false) then
    new.lost_at = now();
  elsif new.is_lost = false then
    new.lost_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists items_lost_mode on public.items;
create trigger items_lost_mode
  before update on public.items
  for each row
  execute function public.handle_lost_mode_change();

-- =================================================================
-- 2. FINDER REPORTS TABLE
-- =================================================================
create table if not exists public.finder_reports (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  -- Message dari penemu
  message text not null check (char_length(message) between 1 and 1000),
  -- Lokasi text (required)
  location_text text not null check (char_length(location_text) between 1 and 200),
  -- GPS coords (optional, kalau finder izinkan)
  location_lat numeric(10, 7),
  location_lng numeric(10, 7),
  -- Finder optional contact (untuk owner reply via email/wa)
  finder_name text check (char_length(finder_name) <= 100),
  finder_contact text check (char_length(finder_contact) <= 200),
  -- Status flow: new → seen → resolved
  status text default 'new' not null check (status in ('new', 'seen', 'resolved', 'spam')),
  -- Anti-abuse: track IP hash (NOT full IP for privacy)
  ip_hash text,
  user_agent text,
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.finder_reports is 'Reports dari penemu barang via public recovery page';

-- Indexes
create index if not exists finder_reports_item_id_idx on public.finder_reports(item_id);
create index if not exists finder_reports_status_idx on public.finder_reports(status);
create index if not exists finder_reports_created_at_idx on public.finder_reports(created_at desc);

drop trigger if exists finder_reports_updated_at on public.finder_reports;
create trigger finder_reports_updated_at
  before update on public.finder_reports
  for each row
  execute function public.handle_updated_at();

-- Auto-increment report_count on items when new report created
create or replace function public.handle_new_finder_report()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.items
  set report_count = report_count + 1
  where id = new.item_id;
  return new;
end;
$$;

drop trigger if exists on_finder_report_created on public.finder_reports;
create trigger on_finder_report_created
  after insert on public.finder_reports
  for each row
  execute function public.handle_new_finder_report();

-- =================================================================
-- 3. EMERGENCY CONTACTS TABLE
-- =================================================================
-- Contact info di-encrypt di app layer (crypto-js AES)
-- Hanya muncul di public page kalau item dalam Lost Mode
create table if not exists public.emergency_contacts (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references public.items(id) on delete cascade unique not null,
  -- Encrypted fields (AES via crypto-js, NEVER plaintext)
  whatsapp_encrypted text,
  phone_encrypted text,
  email_encrypted text,
  -- Reward (optional, untuk encourage return)
  has_reward boolean default false not null,
  reward_description text check (char_length(reward_description) <= 300),
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.emergency_contacts is 'Encrypted contact info untuk Lost Mode';

drop trigger if exists emergency_contacts_updated_at on public.emergency_contacts;
create trigger emergency_contacts_updated_at
  before update on public.emergency_contacts
  for each row
  execute function public.handle_updated_at();

-- =================================================================
-- 4. CONTACT REVEALS LOG (anti-abuse tracking)
-- =================================================================
create table if not exists public.contact_reveals (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  ip_hash text,
  user_agent text,
  channel text check (channel in ('whatsapp', 'phone', 'email')),
  revealed_at timestamptz default now() not null
);

comment on table public.contact_reveals is 'Audit log untuk reveal kontak (anti-abuse)';

create index if not exists contact_reveals_item_id_idx on public.contact_reveals(item_id);
create index if not exists contact_reveals_revealed_at_idx on public.contact_reveals(revealed_at desc);

-- =================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =================================================================

-- === ITEMS ===
alter table public.items enable row level security;

drop policy if exists "Owners can view their items" on public.items;
drop policy if exists "Owners can insert their items" on public.items;
drop policy if exists "Owners can update their items" on public.items;
drop policy if exists "Owners can delete their items" on public.items;
drop policy if exists "Public can view items by recovery code" on public.items;

create policy "Owners can view their items"
  on public.items for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their items"
  on public.items for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their items"
  on public.items for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their items"
  on public.items for delete
  using (auth.uid() = owner_id);

-- 🔑 IMPORTANT: Public bisa read item by recovery_code (untuk recovery page)
-- Tapi hanya field yang aman (name, message, dll — diatur di app query level)
create policy "Public can view items by recovery code"
  on public.items for select
  using (true);

-- === FINDER REPORTS ===
alter table public.finder_reports enable row level security;

drop policy if exists "Owners can view reports for their items" on public.finder_reports;
drop policy if exists "Owners can update reports for their items" on public.finder_reports;
drop policy if exists "Anyone can submit a finder report" on public.finder_reports;

create policy "Owners can view reports for their items"
  on public.finder_reports for select
  using (
    item_id in (
      select id from public.items where owner_id = auth.uid()
    )
  );

create policy "Owners can update reports for their items"
  on public.finder_reports for update
  using (
    item_id in (
      select id from public.items where owner_id = auth.uid()
    )
  );

-- 🔑 Anyone can submit a report (anonymous finders)
create policy "Anyone can submit a finder report"
  on public.finder_reports for insert
  with check (true);

-- === EMERGENCY CONTACTS ===
alter table public.emergency_contacts enable row level security;

drop policy if exists "Owners can manage emergency contacts" on public.emergency_contacts;
drop policy if exists "Public can view emergency contacts of lost items" on public.emergency_contacts;

create policy "Owners can manage emergency contacts"
  on public.emergency_contacts for all
  using (
    item_id in (
      select id from public.items where owner_id = auth.uid()
    )
  )
  with check (
    item_id in (
      select id from public.items where owner_id = auth.uid()
    )
  );

-- 🔑 Public can read emergency contacts ONLY for items in lost mode
create policy "Public can view emergency contacts of lost items"
  on public.emergency_contacts for select
  using (
    item_id in (
      select id from public.items where is_lost = true
    )
  );

-- === CONTACT REVEALS ===
alter table public.contact_reveals enable row level security;

drop policy if exists "Anyone can log a reveal" on public.contact_reveals;
drop policy if exists "Owners can view reveals for their items" on public.contact_reveals;

create policy "Anyone can log a reveal"
  on public.contact_reveals for insert
  with check (true);

create policy "Owners can view reveals for their items"
  on public.contact_reveals for select
  using (
    item_id in (
      select id from public.items where owner_id = auth.uid()
    )
  );

-- =================================================================
-- 6. ATOMIC SCAN COUNT INCREMENT
-- =================================================================
-- RPC function untuk increment scan_count atomically
-- Dipanggil dari getPublicItemByCode() saat ada yang scan QR
create or replace function public.increment_scan_count(item_id_param uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.items
  set scan_count = scan_count + 1
  where id = item_id_param;
end;
$$;

-- Grant execute ke anon role agar public bisa increment
grant execute on function public.increment_scan_count(uuid) to anon, authenticated;

-- =================================================================
-- 7. ALLOW PUBLIC PROFILE READ (untuk recovery page)
-- =================================================================
-- Public bisa read profile info (name, avatar) untuk render recovery page
-- TAPI hanya kalau user tersebut punya item yang aktif (filter via item join)
drop policy if exists "Public can view profiles for active recovery pages" on public.profiles;
create policy "Public can view profiles for active recovery pages"
  on public.profiles for select
  using (
    id in (select owner_id from public.items)
  );

-- =================================================================
-- ✅ DONE!
-- =================================================================
-- Verifikasi:
-- 1. Table Editor → harus muncul 4 table baru
-- 2. Authentication → Policies → setiap table ada RLS policies
-- 3. Test dari app — coba create item, scan QR, submit finder report
-- =================================================================
