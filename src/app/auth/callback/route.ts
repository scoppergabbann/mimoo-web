import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth Callback Handler
 *
 * Path: /auth/callback (NO locale prefix — bypassed by middleware)
 *
 * Receives the OAuth code from Supabase after Google sign-in,
 * exchanges it for a session, then redirects to dashboard (with locale).
 *
 * Also handles email confirmation links (signup confirmation, password reset).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Determine locale (default 'id')
  let locale: 'id' | 'en' = 'id';
  const localeParam = searchParams.get('locale');
  if (localeParam === 'en' || localeParam === 'id') {
    locale = localeParam;
  }

  if (!code) {
    // No code provided → error
    return NextResponse.redirect(`${origin}/${locale}/auth/error`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth exchange error:', error.message);
      return NextResponse.redirect(`${origin}/${locale}/auth/error`);
    }

    // Successful auth → redirect to next path (with locale prefix)
    const cleanNext = next.startsWith('/') ? next : `/${next}`;

    // If next already has a locale prefix, use it; otherwise add one
    const hasLocalePrefix = cleanNext.startsWith('/id/') || cleanNext.startsWith('/en/');
    const finalPath = hasLocalePrefix ? cleanNext : `/${locale}${cleanNext}`;

    return NextResponse.redirect(`${origin}${finalPath}`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(`${origin}/${locale}/auth/error`);
  }
}
