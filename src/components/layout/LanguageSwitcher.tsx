'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { GlobeIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  function handleLocaleChange(newLocale: Locale) {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        aria-label="Pilih bahasa"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-2 rounded-pill text-sm font-medium',
          'text-mimoo-ink-700 hover:bg-mimoo-purple-50',
          'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400',
          isPending && 'opacity-60'
        )}
      >
        <GlobeIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{localeFlags[currentLocale]}</span>
        <span className="uppercase">{currentLocale}</span>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup menu bahasa"
            tabIndex={-1}
          />
          <div
            role="menu"
            className="absolute right-0 mt-2 z-20 min-w-[180px] bg-white rounded-cozy shadow-soft-lg border border-mimoo-purple-100 overflow-hidden animate-fade-in"
          >
            {locales.map((locale) => (
              <button
                key={locale}
                type="button"
                role="menuitem"
                onClick={() => handleLocaleChange(locale)}
                className={cn(
                  'w-full text-left px-4 py-2.5 text-sm flex items-center gap-2',
                  'hover:bg-mimoo-purple-50 transition-colors',
                  currentLocale === locale && 'bg-mimoo-purple-50 text-mimoo-purple-700 font-semibold'
                )}
              >
                <span aria-hidden="true">{localeFlags[locale]}</span>
                <span>{localeNames[locale]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
