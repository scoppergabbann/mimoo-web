import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { routing } from './i18n/config';

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Protected routes — butuh login (akan redirect ke /login kalau belum auth)
 */
const PROTECTED_ROUTES = ['/dashboard'];

/**
 * Auth routes — kalau sudah login, redirect ke /dashboard
 */
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

function isProtectedPath(pathname: string): boolean {
  const withoutLocale = pathname.replace(/^\/(id|en)/, '') || '/';
  return PROTECTED_ROUTES.some((route) => withoutLocale.startsWith(route));
}

function isAuthPath(pathname: string): boolean {
  const withoutLocale = pathname.replace(/^\/(id|en)/, '') || '/';
  return AUTH_ROUTES.some((route) => withoutLocale.startsWith(route));
}

function getLocaleFromPath(pathname: string): 'id' | 'en' {
  if (pathname.startsWith('/en')) return 'en';
  return 'id';
}

/**
 * Paths yang BYPASS i18n middleware (no locale prefix added).
 * Ini penting untuk:
 * - OAuth callback (URL persis seperti di Google/Supabase config)
 * - Public recovery pages (URL pendek, brand-able: mimoo.id/found/CODE)
 */
function isBypassPath(pathname: string): boolean {
  return (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/found/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 🔑 BYPASS for OAuth callback dan public recovery pages
  // Ini PENTING: /auth/callback dan /found/* gak boleh ke-redirect ke /id/...
  if (isBypassPath(pathname)) {
    // Still handle Supabase session for /auth/* paths
    if (pathname.startsWith('/auth/')) {
      return handleSupabaseSession(request);
    }
    // Public recovery pages — no session needed, no locale needed
    return NextResponse.next();
  }

  // 1. Run i18n middleware (handles locale routing)
  let response = intlMiddleware(request);

  // 2. Create Supabase client to refresh session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(
            ({ name, value, options }: { name: string; value: string; options?: CookieOptions }) =>
              response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: refresh session if needed (Supabase requirement)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = getLocaleFromPath(pathname);

  // Route protection logic
  if (isProtectedPath(pathname) && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && user) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

/**
 * Minimal Supabase session handler — only for /auth/* paths.
 * Refreshes session tanpa locale redirect logic.
 */
async function handleSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(
            ({ name, value, options }: { name: string; value: string; options?: CookieOptions }) =>
              response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  // Match all paths except API, static files, and Next.js internals
  matcher: [
    '/',
    '/(id|en)/:path*',
    '/auth/:path*',
    '/found/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
