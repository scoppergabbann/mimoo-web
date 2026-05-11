-- =================================================================
-- 🎨 MIMOO DATABASE SETUP — Migration 001: Profiles
-- =================================================================
-- Cara pakai:
-- 1. Buka Supabase Dashboard → SQL Editor
-- 2. Klik "New Query"
-- 3. Copy-paste isi file ini
-- 4. Klik "Run" (atau Ctrl+Enter)
--
-- Migration ini bikin:
-- ✅ Table `profiles` untuk simpan user data (nama, avatar config)
-- ✅ Auto-create profile on signup (trigger function)
-- ✅ Row Level Security (RLS) untuk privacy
-- ✅ Indexes untuk performance
-- =================================================================

-- =================================================================
-- 1. PROFILES TABLE
-- =================================================================
-- Extends auth.users dengan custom fields
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique,
  name text,
  -- Avatar configuration
  avatar_character text default 'denpa'
    check (avatar_character in (
      'denpa', 'jaya', 'salma', 'kupa',
      'gadhing', 'tarra', 'minang', 'toraja',
      'lombo', 'manda', 'batak', 'banda'
    )),
  avatar_skin_tone text default 'medium'
    check (avatar_skin_tone in ('light', 'medium', 'tan', 'deep')),
  avatar_outfit text default 'purple'
    check (avatar_outfit in ('purple', 'blue', 'pink', 'cream', 'sage')),
  avatar_accent text default 'purple'
    check (avatar_accent in ('purple', 'blue', 'pink')),
  -- Subscription tier (free/premium)
  tier text default 'free' check (tier in ('free', 'premium')),
  -- Locale preference
  locale text default 'id' check (locale in ('id', 'en')),
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.profiles is 'User profiles dengan avatar config dan preferences';

-- Index untuk lookup by email
create index if not exists profiles_email_idx on public.profiles(email);

-- =================================================================
-- 2. AUTO-UPDATE TIMESTAMP TRIGGER
-- =================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- =================================================================
-- 3. AUTO-CREATE PROFILE ON SIGNUP
-- =================================================================
-- Saat user signup di auth.users, otomatis bikin row di profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    name,
    avatar_character,
    avatar_skin_tone,
    avatar_outfit,
    avatar_accent
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data->>'avatar_character', 'denpa'),
    coalesce(new.raw_user_meta_data->>'avatar_skin_tone', 'medium'),
    coalesce(new.raw_user_meta_data->>'avatar_outfit', 'purple'),
    coalesce(new.raw_user_meta_data->>'avatar_accent', 'purple')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Hook ke auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =================================================================
-- Penting: pastikan user hanya bisa lihat & edit data mereka sendiri
alter table public.profiles enable row level security;

-- Hapus existing policies kalau ada (idempotent)
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;

-- Policy: user bisa lihat profile sendiri
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy: user bisa update profile sendiri
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policy: user bisa insert profile sendiri (jaga-jaga kalau trigger gagal)
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- =================================================================
-- ✅ DONE!
-- =================================================================
-- Verifikasi setup:
-- 1. Authentication → Users → coba register di app
-- 2. Table Editor → profiles → harus ada row baru otomatis
-- 3. Test logout & login → profile data persists
-- =================================================================
