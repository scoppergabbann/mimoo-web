import type { ReactNode } from 'react';

/**
 * Root layout — minimal, hanya html/body shell.
 * Locale-aware layout ada di [locale]/layout.tsx.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
