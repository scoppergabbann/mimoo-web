# 💜 Mimoo Web

> **Identitasmu, barangmu, jalannya pulang.**
> Karena kehilangan tidak harus berarti kehilangan harapan.

Mimoo adalah platform "cozy-tech" untuk membantu mengembalikan barang hilang ke pemiliknya. Dengan QR code yang ditempel di kartu, tag, atau stiker — siapapun yang menemukan barangmu bisa langsung scan dan menghubungimu dengan aman.

Mimoo dibuat **di Indonesia, untuk Indonesia** 🇮🇩 — dengan karakter avatar yang merepresentasikan kekayaan budaya Nusantara, dari Sabang sampai Merauke.

---

## ✨ Fitur Utama

- 🎨 **12 Karakter Indonesian Heritage** — dari Bali, Papua, Bandung, Kupang, dan kota-kota Indonesia lainnya
- 🕌 **Inklusif** — representasi Muslimah & Kristiani
- 🌐 **Bilingual** — Bahasa Indonesia & English (next-intl)
- 🔒 **Privacy-First** — encrypted contact info, anonymous bridging
- ♿ **WCAG 2.1 AA Compliant** — accessible untuk semua
- 📱 **Mobile-First Responsive** — beautiful di semua device
- 🎭 **Cozy Design System** — pastel, warm, gemoy aesthetic

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) |
| Database & Auth | [Supabase](https://supabase.com/) (Email + Google OAuth) |
| Forms | [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Encryption | [crypto-js](https://github.com/brix/crypto-js) (AES) |
| Fonts | Plus Jakarta Sans + Inter |

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js >= 18.17.0
- npm / yarn / pnpm

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd mimoo-web
npm install
```

### 3. Environment Variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Lalu isi dengan credentials kamu:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Crypto Secret (generate dengan: openssl rand -base64 32)
CRYPTO_SECRET_KEY=your-32-char-secret-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=id
```

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📁 Project Structure

```
mimoo-web/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Locale-aware routes (id, en)
│   │   │   ├── layout.tsx     # Root layout dgn Navbar, Footer, i18n
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── how-it-works/
│   │   │   ├── products/
│   │   │   ├── pricing/
│   │   │   └── about/
│   │   ├── globals.css        # Tailwind + custom CSS
│   │   ├── layout.tsx         # Minimal root layout
│   │   └── not-found.tsx      # 404 page
│   │
│   ├── components/
│   │   ├── ui/                # Reusable UI (Button, Card, Badge, etc.)
│   │   ├── layout/            # Navbar, Footer, Logo, LanguageSwitcher
│   │   └── sections/          # Landing page sections
│   │
│   ├── lib/
│   │   ├── avatar/            # 🎨 Indonesian Heritage Avatar System
│   │   │   ├── characters/    # SVG characters (Denpa, Jaya, Salma, Kupa)
│   │   │   ├── types.ts       # TypeScript types & constants
│   │   │   ├── MimooAvatar.tsx
│   │   │   └── MimooBlob.tsx  # Mascot character
│   │   ├── supabase/          # Supabase clients (browser + server)
│   │   ├── crypto.ts          # Encryption utilities
│   │   └── utils.ts           # cn() classname helper
│   │
│   ├── i18n/
│   │   ├── config.ts          # defineRouting + locale config
│   │   ├── request.ts         # next-intl server config (requestLocale)
│   │   ├── navigation.ts      # i18n-aware Link, useRouter (createNavigation)
│   │   └── messages/
│   │       ├── id.json        # 🇮🇩 Indonesian (default)
│   │       └── en.json        # 🇬🇧 English
│   │
│   └── middleware.ts          # ⚠️ HARUS di src/, BUKAN root!
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 🎨 Karakter Mimoo

Phase 1 dilengkapi dengan **4 karakter polished** + **8 placeholder** yang siap dikembangkan.

### Phase 1 (Available) ✅
- **Denpa** (Denpasar, Bali) — udeng + bunga kamboja
- **Jaya** (Jayapura, Papua) — ikat kepala motif tribal + bulu cendrawasih
- **Salma** (Bandung) — Muslimah dengan hijab modern
- **Kupa** (Kupang, NTT) — Kristiani dengan tenun NTT + salib

### Phase 2 (Coming Soon) 🚧
- Gadhing (Yogyakarta), Tarra (Dayak), Minang (Padang), Toraja, Lombo (Lombok), Manda (Manado), Batak (Medan), Banda (Aceh)

### Cara Menambah Karakter Baru

1. Buat SVG component di `src/lib/avatar/characters/[Name].tsx`
2. Update `CHARACTERS` di `src/lib/avatar/types.ts` — set `available: true`
3. Tambahkan case di `MimooAvatar.tsx` switch statement
4. Tambahkan translation di `id.json` & `en.json` di `Avatars.characters`

---

## 🌐 i18n Routing

Default locale: `id` (Bahasa Indonesia). Pakai `localePrefix: 'always'` untuk routing yang reliable.

| URL | Behavior |
|-----|----------|
| `/` | → Auto-redirect ke `/id` |
| `/id` | ✅ Landing (Indonesian) |
| `/id/how-it-works` | ✅ Cara Kerja (ID) |
| `/en` | ✅ Landing (English) |
| `/en/how-it-works` | ✅ How It Works (EN) |
| `/about` | → Auto-redirect ke `/id/about` |

---

## 🔒 Privacy & Security

Mimoo menggunakan **AES encryption** (via crypto-js) untuk:
- Lost Mode contact info
- Finder messages
- Anonymous bridging

**JANGAN PERNAH commit `.env.local`** ke git! Sudah di-ignore di `.gitignore`.

---

## 🔐 Authentication Setup (Phase 2)

### Step 1: Create Supabase Project
1. Sign up di [supabase.com](https://supabase.com)
2. Buat project baru (gratis, ~2 menit)
3. Settings → API → copy `URL`, `anon key`, `service_role key`
4. Paste ke `.env.local`

### Step 2: Run SQL Migration
1. Buka **SQL Editor** di Supabase Dashboard
2. Copy isi file `supabase/migrations/001_profiles.sql`
3. Paste & klik **Run**
4. Check Table Editor → harus ada table `profiles` baru

### Step 3: Enable Google OAuth (Optional)
1. Setup OAuth client di [Google Cloud Console](https://console.cloud.google.com/)
2. Authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
3. Di Supabase: **Authentication → Providers → Google** → enable & paste Client ID/Secret
4. Detail lengkap ada di `.env.example` comments

### Step 4: Configure Email Templates (Optional)
Supabase Dashboard → **Authentication → Email Templates** → customize sesuai brand Mimoo.

### Step 5: Test!
```bash
npm run dev
```
- `/register` → daftar akun baru
- `/login` → masuk
- `/dashboard` → protected route

---

## 🗺️ Roadmap

### ✅ Phase 1 — Landing Pages
- Marketing site (Beranda, Cara Kerja, Produk, Harga, Tentang)
- Avatar system foundation (4 karakter)
- Bilingual (ID/EN)
- Responsive & accessible

### ✅ Phase 2 — Auth Foundation
- ✅ Email/password registration & login
- ✅ Google OAuth integration
- ✅ Forgot password + magic link reset
- ✅ Email confirmation flow
- ✅ Avatar picker built into registration (2-step form)
- ✅ Protected dashboard route (auto-redirect kalau belum login)
- ✅ User-aware navbar (avatar menu, logout)
- ✅ Supabase Row Level Security (RLS) ready
- ✅ SQL migration file untuk profiles table

### 🚧 Phase 3 — Full Dashboard & Items
- User dashboard with stats
- Item management (add, edit, delete)
- Avatar customizer (12 karakter lengkap)
- QR code generation per item

### 🔮 Phase 4 — Recovery System
- Lost mode toggle
- QR scan landing page (anonymous-friendly)
- Finder message form
- Encrypted notifications
- Reward system

### 🎯 Phase 5 — Mobile App
- React Native / Flutter
- Push notifications
- NFC support
- Offline-first

---

## 📜 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

---

## 🎨 Design Tokens

### Colors
- **Primary**: `mimoo-purple-500` (#8B7FD9)
- **Background**: `mimoo-cream-100` (#FFF9F0)
- **Accents**: pink, sky, mint
- **Ink**: scale dari 50 sampai 900

### Typography
- **Display**: Plus Jakarta Sans (chunky, friendly)
- **Body**: Inter (clean, readable)

### Border Radius
- **rounded-cozy**: 1.25rem — Mimoo signature
- **rounded-cozy-lg**: 1.75rem
- **rounded-pill**: full

---

## 🤝 Contributing

Karakter, copywriting, atau saran budaya yang lebih akurat sangat welcome! Khususnya untuk validasi representasi karakter dari teman-teman dari daerah masing-masing. 💜

---

## 📄 License

Made with 💜 by the Mimoo team in Indonesia 🇮🇩

---

> *"Karena kehilangan tidak harus berarti kehilangan harapan."*
