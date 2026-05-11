'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { loginSchema, type LoginInput } from '@/lib/auth/schemas';
import { loginAction } from '@/lib/auth/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MailIcon, EyeIcon, EyeOffIcon } from '@/components/ui/AuthIcons';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { GoogleSignInButton } from './GoogleSignInButton';
import { OrDivider } from './OrDivider';

export function LoginForm() {
  const t = useTranslations('AuthForm');
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginInput) {
    setFormError('');
    startTransition(async () => {
      const result = await loginAction(data);

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof LoginInput, { message });
        });
        return;
      }

      if (result.error) {
        setFormError(result.error);
        return;
      }

      if (result.success) {
        const redirectTo = searchParams.get('redirect') || `/${locale}/dashboard`;
        router.push(redirectTo);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5">
      <GoogleSignInButton label={t('continueWithGoogle')} />

      <OrDivider text={t('or')} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          {...register('email')}
          type="email"
          label={t('email')}
          placeholder="kamu@email.com"
          autoComplete="email"
          leftIcon={<MailIcon className="w-4 h-4" />}
          error={errors.email?.message}
          disabled={isPending}
        />

        <div>
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label={t('password')}
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            disabled={isPending}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-mimoo-ink-500 hover:text-mimoo-ink-700 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            }
          />
          <div className="mt-2 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-mimoo-purple-700 hover:text-mimoo-purple-900 font-medium hover:underline focus:outline-none focus-visible:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>
        </div>

        {formError && (
          <div
            className="bg-mimoo-pink-50 border-2 border-mimoo-pink-200 rounded-cozy p-3 text-sm text-mimoo-pink-400 font-medium"
            role="alert"
          >
            {formError}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          rightIcon={!isPending && <ArrowRightIcon />}
          className="w-full"
        >
          {t('signIn')}
        </Button>
      </form>
    </div>
  );
}
