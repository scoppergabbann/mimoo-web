import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth Callback Handler
 *
 * Supabase redirects to this route setelah user complete OAuth flow.
 * Kita exchange the code untuk session, lalu redirect ke dashboard.
 *
 * Also handles email confirmation links (signup confirmation, password reset).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const locale = (searchParams.get('locale') as 'id' | 'en') || 'id';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful auth → redirect ke next or dashboard (dengan locale prefix)
      const redirectPath = next.startsWith('/') ? next : `/${next}`;
      const finalPath = redirectPath.startsWith(`/${locale}`)
        ? redirectPath
        : `/${locale}${redirectPath}`;
      return NextResponse.redirect(`${origin}${finalPath}`);
    }
  }

  // Error → redirect ke auth-error page
  return NextResponse.redirect(`${origin}/${locale}/auth/error`);
}
