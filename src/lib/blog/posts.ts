/**
 * Blog post content — static for MVP.
 * Future: migrate to MDX files or Sanity CMS.
 */

export type BlogCategory = 'stories' | 'tips' | 'updates' | 'culture';

export interface BlogPost {
  slug: string;
  title: { id: string; en: string };
  excerpt: { id: string; en: string };
  content: { id: string; en: string }; // Markdown-ish (supports **bold**, paragraph breaks)
  author: string;
  authorRole: { id: string; en: string };
  category: BlogCategory;
  publishedAt: string; // ISO date
  readTimeMinutes: number;
  coverEmoji: string; // simple emoji as cover for MVP
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  // ============ Post 1: Reunion Story ============
  {
    slug: 'cerita-reunion-pertama-mimoo',
    title: {
      id: 'Cerita Reunion Pertama: Dompet Pak Andi yang Pulang dari Bandara',
      en: 'First Reunion Story: Pak Andi\'s Wallet Returning from the Airport',
    },
    excerpt: {
      id: 'Bagaimana QR code Mimoo membantu Pak Andi mendapatkan dompetnya kembali dari seorang penemu baik hati di Bandara Soekarno-Hatta.',
      en: 'How Mimoo\'s QR code helped Pak Andi recover his wallet from a kind finder at Soekarno-Hatta Airport.',
    },
    content: {
      id: `Tanggal 15 Maret 2026 jadi hari yang gak bakal Pak Andi lupain seumur hidup. Setelah perjalanan bisnis 3 hari dari Surabaya, dia turun di Bandara Soekarno-Hatta dengan satu kekhawatiran: **dompetnya hilang**.

Di dompet itu ada KTP, SIM, kartu kredit, ATM, dan uang tunai untuk keperluan sehari-hari. Yang lebih bikin panik: dompet itu pemberian almarhum ayahnya — punya nilai sentimental yang gak bisa diganti uang.

"Saya hampir nangis di terminal. Bukan karena uangnya, tapi karena dompet pemberian Bapak," kenang Pak Andi.

Untungnya, beberapa minggu sebelumnya, Pak Andi sempat denger Mimoo dari rekan kerjanya. Dia sticker Mimoo QR di dalam dompet, "buat jaga-jaga." Saat itu dia pikir, "Ah, palingan gak bakal kepake."

**Ternyata kepake.**

Sekitar jam 8 malam, notifikasi masuk ke emailnya: "💜 Seseorang menemukan dompet Pak Andi!"

Penemunya seorang petugas kebersihan bernama Mas Bagas. Pesannya hangat:

*"Halo Pak, saya nemu dompet ini di toilet terminal 3. Saya scan QR-nya dan ada pesan Bapak. Tenang Pak, dompet aman di saya. Saya bisa kasih ke kantor lost & found atau nunggu Bapak ambil. WA saya: 0812-XXX-XXXX."*

Pak Andi langsung respond. 30 menit kemudian, dompet kembali. Lengkap. Sama sekali tidak ada yang hilang.

"Mas Bagas refuse uang tip yang saya kasih. Dia bilang, 'Saya cuma bantu Pak. Ini barang Bapak.' Saya akhirnya minta nomor istrinya, kirim hadiah ke rumahnya lewat ojek online."

**Apa yang bisa kita pelajari?**

1. **Tempel Mimoo di mana-mana** — bukan cuma di tas, tapi juga di dalam dompet, di lining tas, di pouch elektronik
2. **Custom message itu penting** — Mas Bagas bilang, dia tergerak hubungin karena baca pesan "tolong hubungi pemilik ya, ini dompet sentimen tinggi"
3. **Orang Indonesia masih banyak yang baik** — di tengah news yang bikin pessimis, masih banyak orang seperti Mas Bagas

Kalau cerita Pak Andi membuat kamu mau lindungi barang berhargamu, [bikin akun Mimoo gratis di sini](/register).

💜 Made with love, in Indonesia.`,
      en: `March 15, 2026 became a day Pak Andi will never forget. After a 3-day business trip from Surabaya, he landed at Soekarno-Hatta Airport with one worry: **his wallet was missing**.

In that wallet were his ID, driver's license, credit card, ATM, and cash. Worse: the wallet was a gift from his late father — irreplaceable sentimental value.

"I almost cried at the terminal. Not because of the money, but because Dad gave me that wallet," Pak Andi recalls.

Fortunately, a few weeks earlier, Pak Andi had heard about Mimoo from his colleague. He put a Mimoo QR sticker inside his wallet, "just in case." At the time he thought, "Probably won't need it."

**Turns out he did.**

Around 8pm, a notification hit his email: "💜 Someone found Pak Andi's wallet!"

The finder was a cleaning staff named Mas Bagas. His message was warm:

*"Hello Sir, I found this wallet in Terminal 3's restroom. I scanned the QR and saw your message. Don't worry Sir, the wallet is safe with me. I can hand it to lost & found or wait for you to pick up. My WA: 0812-XXX-XXXX."*

Pak Andi responded immediately. 30 minutes later, the wallet was back. Complete. Nothing missing.

"Mas Bagas refused the tip I offered. He said, 'I just helped Sir. This is yours.' I eventually got his wife's number and sent a gift to his home via online delivery."

**What can we learn?**

1. **Stick Mimoo everywhere** — not just on bags, but inside wallets, bag linings, electronics pouches
2. **Custom messages matter** — Mas Bagas said he was moved by the note: "please contact owner, this wallet has high sentimental value"
3. **There are still many good people in Indonesia** — amidst news that breeds pessimism, there are still many like Mas Bagas

If Pak Andi's story makes you want to protect your valuables, [create a free Mimoo account here](/register).

💜 Made with love, in Indonesia.`,
    },
    author: 'Tim Mimoo',
    authorRole: { id: 'Storyteller', en: 'Storyteller' },
    category: 'stories',
    publishedAt: '2026-03-20',
    readTimeMinutes: 4,
    coverEmoji: '👛',
    featured: true,
  },

  // ============ Post 2: Tips ============
  {
    slug: '5-tips-tempel-qr-mimoo-yang-awet',
    title: {
      id: '5 Tips Tempel QR Mimoo Biar Awet Bertahun-tahun',
      en: '5 Tips for Placing Mimoo QR That Last for Years',
    },
    excerpt: {
      id: 'Cara nempelin QR Mimoo biar tetap kebaca walaupun udah lama, kena cuaca, atau sering dipake.',
      en: 'How to place Mimoo QR so it remains scannable even after long use, weather exposure, or daily handling.',
    },
    content: {
      id: `QR code yang udah kamu generate di Mimoo itu seperti "alamat pulang" buat barangmu. Tapi gimana caranya supaya tetap kebaca setelah beberapa tahun? Berikut 5 tips dari kami:

**1. Pakai Sticker Paper Berkualitas (Bukan Kertas Biasa)**

Sticker paper biasa kalo kena air langsung pudar. Investasi di **sticker waterproof / vinyl** dari toko alat tulis (harga Rp 5.000-10.000 per A4). Bisa juga laminating untuk extra protection.

**2. Print Ukuran Minimal 2.5cm x 2.5cm**

QR kecil cepat error kalau tergores. Mimoo recommend size **minimum 2.5cm × 2.5cm** untuk kartu/sticker. Untuk dompet bagian dalam, 2cm masih ok.

**3. Tempel di Bagian yang Jarang Tersentuh**

- **Dompet**: di dalam, di slot kartu cadangan
- **Tas ransel**: di lining bagian dalam, bukan luar
- **Laptop sleeve**: di pocket kecil dalam
- **Botol minum**: di bagian bawah (jarang dipegang)
- **Pouch elektronik**: di salah satu sisi dalam

**4. Hindari 3 Hal Ini**

- ❌ Tempel di permukaan lentur (gampang lepas)
- ❌ Cover dengan stiker lain yang nutupin QR
- ❌ Tempel di area sering kena sinar matahari langsung (UV bikin pudar)

**5. Test Scan Sebelum Sehari-hari**

Setelah tempel, **scan dengan HP kamu** untuk verify kebaca. Pakai berbagai jarak (10cm, 20cm, 30cm). Kalau gak kebaca, re-print atau pindah posisi.

**Bonus: Beli Mimoo Physical Card!**

Sementara ini Mimoo masih digital-only, tapi kami lagi siapin **physical card** yang udah jadi (gak perlu print). Sticker waterproof, finish premium, awet bertahun-tahun. Subscribe newsletter biar tau pas launch! 💜

[Buat item pertama kamu di Mimoo →](/dashboard/items/new)`,
      en: `The QR code you generated in Mimoo is like a "homing address" for your belongings. But how to keep it scannable after years? Here are 5 tips from us:

**1. Use Quality Sticker Paper (Not Plain Paper)**

Plain sticker paper fades when wet. Invest in **waterproof / vinyl sticker** from stationery stores (Rp 5,000-10,000 per A4). You can also laminate for extra protection.

**2. Print at Minimum 2.5cm × 2.5cm**

Small QR codes error quickly when scratched. Mimoo recommends **minimum 2.5cm × 2.5cm** for cards/stickers. Inside a wallet, 2cm is still ok.

**3. Place in Less-Touched Areas**

- **Wallet**: inside, in reserve card slot
- **Backpack**: on inner lining, not exterior
- **Laptop sleeve**: in small inner pocket
- **Water bottle**: on the bottom (rarely touched)
- **Electronics pouch**: on one inner side

**4. Avoid These 3 Things**

- ❌ Placing on flexible surfaces (peels off easily)
- ❌ Covering with other stickers that block QR
- ❌ Direct sunlight exposure (UV fades it)

**5. Test Scan Before Daily Use**

After placing, **scan with your phone** to verify readability. Try various distances (10cm, 20cm, 30cm). If unreadable, re-print or move position.

**Bonus: Buy a Mimoo Physical Card!**

Mimoo is currently digital-only, but we're preparing **physical cards** (no printing needed). Waterproof, premium finish, lasts for years. Subscribe to our newsletter for launch! 💜

[Create your first item in Mimoo →](/dashboard/items/new)`,
    },
    author: 'Tim Mimoo',
    authorRole: { id: 'Product Team', en: 'Product Team' },
    category: 'tips',
    publishedAt: '2026-03-10',
    readTimeMinutes: 5,
    coverEmoji: '🖨️',
  },

  // ============ Post 3: Behind the Scenes ============
  {
    slug: 'kenapa-mimoo-dibuat',
    title: {
      id: 'Kenapa Mimoo Dibuat: Cerita Dari Founder',
      en: 'Why Mimoo Was Built: A Story from the Founder',
    },
    excerpt: {
      id: 'Bukan sekedar startup. Mimoo dibuat dari pengalaman pribadi yang menyakitkan, dan harapan bahwa teknologi bisa lebih hangat.',
      en: 'Not just a startup. Mimoo was built from painful personal experience, and the hope that technology can be warmer.',
    },
    content: {
      id: `2 tahun yang lalu, mama saya kehilangan dompetnya di pasar.

Bukan dompet biasa. Di dalamnya ada foto laminating Bapak (yang sudah meninggal 5 tahun) yang selalu beliau bawa. KTP, kartu BPJS, dan beberapa kartu nama temen-temen lama yang udah jarang ketemu.

Mama gak nangis karena uangnya. Mama nangis karena fotonya.

"Foto itu satu-satunya yang Mama bawa sehari-hari," kata Mama waktu cerita ke saya via telepon. Suaranya bergetar.

Saya cari di berbagai forum lost-and-found, lapor polisi, pasang pengumuman di grup-grup Facebook lokal. Hasilnya nihil. Padahal yang nemu, kalau berbaik hati, gak punya cara untuk hubungi mama selain kasih ke pos satpam (yang seringnya gak ada).

**Saat itu saya mikir**: kenapa di era smartphone dan internet, lost-and-found masih primitif?

**Dari situ lahir Mimoo.**

---

Mimoo dibangun dengan beberapa prinsip yang kami pegang teguh:

**1. Cozy, Bukan Corporate**

Hampir semua app produktif terasa cold, transactional, dan distant. Kami mau Mimoo terasa seperti **teman hangat** yang ada saat kamu butuh. Itu alasannya kami punya **maskot blob ungu** yang gemoy, **karakter beragam dari Indonesia** (Denpa Bali, Salma berhijab, Kupa bersalib, dll), dan **bahasa yang hangat** (bukan robotik "Your item was scanned at...").

**2. Gratis Selamanya**

Banyak app lost-and-found berbayar dengan fitur dasar yang malah berbayar. Itu absurd. Mimoo **100% gratis selamanya**. Tidak ada paket Pro/Premium yang kunci fitur. Mimoo bertahan dari donasi & physical card sales (segera!).

**3. Privacy by Design**

Saat barang hilang, kamu butuh penemu hubungi kamu. Tapi gak mau nomormu tersebar di internet. Mimoo encrypt kontak darurat dengan AES, hash IP penemu (anti-tracking), dan recovery URL gak di-index Google. Privacy bukan checklist, tapi **principle**.

**4. Made for Indonesia**

Banyak app global gak ngerti konteks Indonesia. WhatsApp dominan? Mimoo prioritize WA contact. Bahasa Indonesia hangat itu beda dengan corporate English translate? Mimoo native ID dengan tone keluarga. **Dibangun di sini, untuk di sini.**

---

Mimoo masih sangat early stage. Ada banyak fitur yang belum ada (mobile app, push notif, B2B mode, dll). Tapi kami percaya:

**Lebih baik mulai kecil dengan hati, daripada besar tapi tanpa jiwa.**

Kalau cerita ini resonate dengan kamu, kami senang sekali kamu coba Mimoo dan kasih feedback. Setiap email yang masuk ke hello@mimoo.id, kami baca semua.

Terima kasih sudah jadi bagian dari journey ini.

— Tim Mimoo 💜

P.S. Dompet mama gak pernah ditemukan. Tapi setiap reunion yang Mimoo facilitate, rasanya seperti reunion kecil yang menyembuhkan luka itu.`,
      en: `Two years ago, my mom lost her wallet at the market.

Not just any wallet. Inside was a laminated photo of Dad (who passed 5 years ago) that she always carried. ID, BPJS card, and old contact cards from friends she rarely sees.

Mom didn't cry about the money. Mom cried about the photo.

"That photo is the only one I carry daily," Mom told me over the phone. Her voice trembled.

I searched lost-and-found forums, filed a police report, posted on local Facebook groups. Nothing came up. Whoever found it, if they were kind, had no way to contact mom except dropping it at security (often absent).

**At that moment I thought**: why in the era of smartphones and internet, is lost-and-found still primitive?

**That's how Mimoo was born.**

---

Mimoo is built with principles we hold firm:

**1. Cozy, Not Corporate**

Almost all productivity apps feel cold, transactional, distant. We want Mimoo to feel like a **warm friend** there when you need it. That's why we have a **cute purple blob mascot**, **diverse Indonesian characters** (Bali's Denpa, hijabi Salma, Christian Kupa, etc.), and **warm language** (not robotic "Your item was scanned at...").

**2. Free Forever**

Many lost-and-found apps charge for basic features. That's absurd. Mimoo is **100% free forever**. No Pro/Premium tier locking features. Mimoo survives on donations & physical card sales (coming soon!).

**3. Privacy by Design**

When your item is lost, you need finders to contact you. But you don't want your number spreading on the internet. Mimoo encrypts emergency contacts with AES, hashes finder IPs (anti-tracking), and recovery URLs aren't indexed by Google. Privacy isn't a checklist, it's a **principle**.

**4. Made for Indonesia**

Many global apps don't understand Indonesian context. WhatsApp dominant? Mimoo prioritizes WA contact. Warm Indonesian different from corporate English-translated? Mimoo is native ID with family tone. **Built here, for here.**

---

Mimoo is still very early stage. Many features missing (mobile app, push notif, B2B mode, etc.). But we believe:

**Better to start small with heart, than large without soul.**

If this story resonates with you, we'd love for you to try Mimoo and give feedback. Every email to hello@mimoo.id, we read all of them.

Thank you for being part of this journey.

— The Mimoo Team 💜

P.S. Mom's wallet was never found. But every reunion Mimoo facilitates feels like a small reunion that heals that wound.`,
    },
    author: 'Founder Mimoo',
    authorRole: { id: 'Founder', en: 'Founder' },
    category: 'culture',
    publishedAt: '2026-02-14',
    readTimeMinutes: 7,
    coverEmoji: '💜',
    featured: true,
  },
];

/**
 * Get all posts sorted newest first.
 */
export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get post by slug.
 */
export function getPostBySlug(slug: string): BlogPost | null {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}

/**
 * Get featured posts.
 */
export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured);
}

/**
 * Filter by category.
 */
export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}
