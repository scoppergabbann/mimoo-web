import type { ReactNode } from 'react';

/**
 * Root layout — passes through to [locale]/layout.tsx
 * Tidak perlu html/body di sini karena [locale]/layout.tsx yang handle.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

// Required for the root layout
export const metadata = {
  title: 'Mimoo',
  description: 'Identitasmu, barangmu, jalannya pulang.',
};
