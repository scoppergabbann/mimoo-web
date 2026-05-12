import type { ReactNode } from 'react';

/**
 * Root layout — minimal passthrough.
 *
 * Routes punya layout sendiri:
 * - `[locale]/layout.tsx` → landing/dashboard (dengan i18n, navbar, footer)
 * - `found/layout.tsx` → public recovery (independent, no i18n)
 * - `auth/callback/route.ts` → API handler (no layout needed)
 *
 * Layout ini cuma return children, html/body di-handle child layouts.
 * Tapi Next.js butuh html/body somewhere — kalau child layout punya,
 * mereka override layout ini.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

export const metadata = {
  title: 'Mimoo',
  description: 'Identitasmu, barangmu, jalannya pulang.',
};
