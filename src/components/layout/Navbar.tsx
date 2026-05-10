'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MimooLogo } from './MimooLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MenuIcon, CloseIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', key: 'home' as const },
  { href: '/how-it-works', key: 'howItWorks' as const },
  { href: '/products', key: 'products' as const, badge: 'new' },
  { href: '/pricing', key: 'pricing' as const },
  { href: '/about', key: 'about' as const },
];

export function Navbar() {
  const t = useTranslations('Nav');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
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

            <Link href="/get-started" className="hidden sm:inline-flex">
              <Button variant="primary" size="md">
                {t('getStarted')}
              </Button>
            </Link>

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
            <Link
              href="/login"
              onClick={() => setIsMobileOpen(false)}
              className="block px-4 py-3 rounded-cozy text-base font-semibold text-mimoo-ink-700 hover:bg-white transition-colors"
            >
              {t('login')}
            </Link>
            <Link
              href="/get-started"
              onClick={() => setIsMobileOpen(false)}
              className="block px-4"
            >
              <Button variant="primary" size="lg" className="w-full">
                {t('getStarted')}
              </Button>
            </Link>
            <div className="px-4 pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
