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
  // Strip locale prefix untuk check (/id/dashboard → /dashboard)
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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Run i18n middleware first (handles locale routing)
  const intlResponse = intlMiddleware(request);

  // 2. Then handle auth session refresh + route protection
  let response = intlResponse;

  // Skip auth check for static/internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return response;
  }

  // Create Supabase client with cookie handling
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
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(
            ({ name, value, options }: { name: string; value: string; options?: CookieOptions }) =>
              response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: refresh session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = getLocaleFromPath(pathname);

  // Route protection logic
  if (isProtectedPath(pathname) && !user) {
    // Not authenticated → redirect to login
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && user) {
    // Already authenticated → redirect to dashboard
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  // Match all paths except API, static files, and Next.js internals
  matcher: [
    '/',
    '/(id|en)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
