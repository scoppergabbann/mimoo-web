# 🚀 Mimoo Web - Quick Setup Guide

## 🆕 v2 Bug Fixes Applied

Versi ini sudah fix beberapa bug critical dari v1:

- ✅ next-intl modern API (`defineRouting`, `createNavigation`, `requestLocale`)
- ✅ Next 14 async params (`params: Promise<{...}>`)
- ✅ `setRequestLocale()` di setiap page (wajib untuk static rendering)
- ✅ Middleware location di `src/` folder (penting kalau pakai src directory!)
- ✅ Routing pakai `localePrefix: 'always'` — paling reliable
- ✅ Supabase server client async + typed cookies

## 1. Install Dependencies

```bash
cd mimoo-web
npm install
```

## 2. Setup Environment

```bash
cp .env.example .env.local
```

Generate crypto secret:
```bash
openssl rand -base64 32
```

Paste hasil ke `CRYPTO_SECRET_KEY` di `.env.local`.

### Skip Supabase untuk Phase 1?

Phase 1 hanya landing pages (no auth/DB), kamu bisa pakai dummy values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder
```

Setup Supabase asli nanti di Phase 2 saat butuh auth.

## 3. Run Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 4. Test Routes

Karena pakai `localePrefix: 'always'`, semua URL pakai prefix locale:

| URL | Behavior |
|-----|----------|
| `/` | → Auto-redirect ke `/id` (307) |
| `/id` | ✅ Landing page (Indonesian) |
| `/en` | ✅ Landing page (English) |
| `/id/about` | ✅ Tentang |
| `/id/how-it-works` | ✅ Cara Kerja |
| `/id/products` | ✅ Produk |
| `/id/pricing` | ✅ Harga |
| `/en/about` | ✅ About (English) |
| `/about` | → Auto-redirect ke `/id/about` |

## 5. Build for Production

```bash
npm run build
npm start
```

Expected output:
```
✓ Generating static pages (13/13)
ƒ Middleware  31.4 kB
```

## 6. Deploy

Recommended: **Vercel** — auto-detect Next.js, zero config.

```bash
npm i -g vercel
vercel
```

Set env vars di Vercel dashboard.

---

## ⚠️ Troubleshooting

### "404 di /, /about, dll"
✅ Sudah fixed di v2! Middleware sekarang di `src/middleware.ts`. Kalau masih kejadian:
1. Cek `src/middleware.ts` ADA (bukan di root!)
2. Run `npm run build` — output harus include `ƒ Middleware`
3. Restart dev server

### "CSS gak ke-load"
✅ Sudah fixed di v2! Penyebab di v1: middleware nggak nge-handle root path, sehingga layout (yang import globals.css) nggak dijalankan.

### "Module not found: next-intl"
Run `npm install` lagi.

### "Failed to fetch font"
Network ke Google Fonts kena block. Cek koneksi internet.

### Translation missing
Check `src/i18n/messages/id.json` & `en.json` — namespace harus match dengan `useTranslations('Namespace')` di komponen.

---

## ✅ Verified Working

Build di sandbox: **13 pages static-generated, middleware 31.4 KB compiled, CSS 32 KB**.

Tested routes:
- `/` → 307 → `/id` → 200 ✅
- `/about` → 307 → `/id/about` → 200 ✅
- `/id/{about,how-it-works,products,pricing}` → 200 ✅
- `/en/{about,...}` → 200 ✅
- All 4 characters (Denpa, Jaya, Salma, Kupa) render correctly ✅
- All 8 placeholder characters show "Segera Hadir" ✅

Need help? Open an issue! 💜
