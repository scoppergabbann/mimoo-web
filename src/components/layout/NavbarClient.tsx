'use client';

import { useState, useEffect, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MimooLogo } from './MimooLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MenuIcon, CloseIcon } from '@/components/ui/Icons';
import { LogOutIcon } from '@/components/ui/AuthIcons';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { logoutAction } from '@/lib/auth/actions';
import { cn } from '@/lib/utils';
import type { AvatarConfig } from '@/lib/avatar/types';

const NAV_ITEMS = [
  { href: '/', key: 'home' as const },
  { href: '/how-it-works', key: 'howItWorks' as const },
  { href: '/products', key: 'products' as const, badge: 'new' },
  { href: '/pricing', key: 'pricing' as const },
  { href: '/about', key: 'about' as const },
];

interface NavbarClientProps {
  user: {
    displayName: string;
    email: string;
    avatarConfig: AvatarConfig;
  } | null;
}

export function NavbarClient({ user }: NavbarClientProps) {
  const t = useTranslations('Nav');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  function handleLogout() {
    setIsUserMenuOpen(false);
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-mimoo-cream-100/80 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      )}
    >
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400 rounded-cozy"
            aria-label="Mimoo - Beranda"
          >
            <MimooLogo size="md" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-4 py-2 rounded-pill',
                    'text-sm font-semibold text-mimoo-ink-700',
                    'hover:bg-mimoo-purple-50 hover:text-mimoo-purple-700',
                    'transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400'
                  )}
                >
                  <span>{t(item.key)}</span>
                  {item.badge === 'new' && (
                    <Badge variant="purple" size="sm">
                      {t('new')}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {user ? (
              // Authenticated: user menu
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-pill hover:bg-mimoo-purple-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400"
                  aria-label="Menu pengguna"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                >
                  <MimooAvatar config={user.avatarConfig} size="xs" />
                  <span className="hidden md:inline text-sm font-semibold text-mimoo-ink-700">
                    {user.displayName}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                      aria-label="Tutup menu"
                      tabIndex={-1}
                    />
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 z-20 w-56 bg-white rounded-cozy shadow-soft-lg border border-mimoo-purple-100 overflow-hidden animate-fade-in"
                    >
                      <div className="px-4 py-3 border-b border-mimoo-purple-50">
                        <p className="text-sm font-semibold text-mimoo-ink-900">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-mimoo-ink-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-mimoo-ink-700 hover:bg-mimoo-purple-50 transition-colors"
                      >
                        {t('dashboard')}
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        disabled={isPending}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-mimoo-pink-400 hover:bg-mimoo-pink-50 transition-colors disabled:opacity-50"
                      >
                        <LogOutIcon className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Not authenticated: login + register
              <>
                <Link
                  href="/login"
                  className={cn(
                    'hidden lg:inline-flex items-center px-5 py-2 rounded-pill',
                    'text-sm font-semibold text-mimoo-ink-700',
                    'hover:bg-mimoo-purple-50 transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400'
                  )}
                >
                  {t('login')}
                </Link>

                <Link href="/register" className="hidden sm:inline-flex">
                  <Button variant="primary" size="md">
                    {t('register')}
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isMobileOpen}
              className="lg:hidden p-2 rounded-cozy text-mimoo-ink-700 hover:bg-mimoo-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400"
            >
              {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-mimoo-cream-100 z-40 overflow-y-auto animate-fade-in"
          id="mobile-menu"
        >
          <div className="px-4 py-6 space-y-2">
            {user && (
              <div className="bg-white rounded-cozy p-4 mb-4 flex items-center gap-3">
                <MimooAvatar config={user.avatarConfig} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-mimoo-ink-900 text-sm">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-mimoo-ink-500 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-cozy text-base font-semibold text-mimoo-ink-700 hover:bg-white transition-colors"
              >
                <span>{t(item.key)}</span>
                {item.badge === 'new' && (
                  <Badge variant="purple" size="sm">
                    {t('new')}
                  </Badge>
                )}
              </Link>
            ))}

            <div className="border-t border-mimoo-purple-100 my-4" />

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-3 rounded-cozy text-base font-semibold text-mimoo-ink-700 hover:bg-white transition-colors"
                >
                  {t('dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleLogout();
                  }}
                  disabled={isPending}
                  className="w-full text-left px-4 py-3 rounded-cozy text-base font-semibold text-mimoo-pink-400 hover:bg-white transition-colors disabled:opacity-50"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-3 rounded-cozy text-base font-semibold text-mimoo-ink-700 hover:bg-white transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4"
                >
                  <Button variant="primary" size="lg" className="w-full">
                    {t('register')}
                  </Button>
                </Link>
              </>
            )}

            <div className="px-4 pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
