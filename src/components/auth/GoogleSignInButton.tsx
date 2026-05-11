'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { signInWithGoogleAction } from '@/lib/auth/actions';
import { GoogleIcon } from '@/components/ui/AuthIcons';
import { cn } from '@/lib/utils';

interface GoogleSignInButtonProps {
  label?: string;
  className?: string;
}

export function GoogleSignInButton({
  label = 'Lanjutkan dengan Google',
  className,
}: GoogleSignInButtonProps) {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale() as 'id' | 'en';

  function handleClick() {
    startTransition(async () => {
      // signInWithGoogleAction akan redirect via Server Action
      await signInWithGoogleAction(locale);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'w-full inline-flex items-center justify-center gap-3 px-6 py-3',
        'bg-white border-2 border-mimoo-purple-100 rounded-pill',
        'text-mimoo-ink-700 font-semibold text-sm',
        'transition-all duration-200',
        'hover:border-mimoo-purple-300 hover:bg-mimoo-purple-50',
        'motion-safe:hover:-translate-y-0.5',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-mimoo-purple-100',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        className
      )}
    >
      {isPending ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-mimoo-purple-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Menghubungkan...</span>
        </>
      ) : (
        <>
          <GoogleIcon />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
