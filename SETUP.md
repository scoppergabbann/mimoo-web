# 🚀 Mimoo Web - Quick Setup Guide

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

Karena Phase 1 hanya landing pages (no auth/DB), kamu bisa pakai dummy values:
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

- `/` — Landing (Indonesian)
- `/en` — Landing (English)
- `/how-it-works` — Cara Kerja
- `/products` — Produk
- `/pricing` — Harga
- `/about` — Tentang

## 5. Build for Production

```bash
npm run build
npm start
```

## 6. Deploy

Recommended: **Vercel** — auto-detect Next.js, zero config.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set env vars di Vercel dashboard.

---

## ⚠️ Common Issues

### "Module not found: next-intl"
Run `npm install` lagi. Pastikan node_modules ke-install.

### Karakter avatar nggak muncul
Check console — kemungkinan typo di config (character/skinTone/outfit/accent).

### Translation missing
Check `src/i18n/messages/id.json` & `en.json` — namespace harus match dengan `useTranslations('Namespace')`.

---

Need help? Open an issue! 💜
