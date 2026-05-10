import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client untuk browser (client components).
 * Gunakan di Client Components dan event handlers.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
