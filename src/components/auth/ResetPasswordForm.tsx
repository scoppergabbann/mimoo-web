'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/auth/schemas';
import { resetPasswordAction } from '@/lib/auth/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/AuthIcons';

export function ResetPasswordForm() {
  const t = useTranslations('AuthForm');
  const router = useRouter();
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function onSubmit(data: ResetPasswordInput) {
    setFormError('');
    startTransition(async () => {
      const result = await resetPasswordAction(data);

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof ResetPasswordInput, { message });
        });
        return;
      }

      if (result.error) {
        setFormError(result.error);
        return;
      }

      if (result.success) {
        setDone(true);
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
          router.refresh();
        }, 2000);
      }
    });
  }

  if (done) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="text-6xl mb-2" aria-hidden="true">
          🎉
        </div>
        <h2 className="font-display text-xl font-bold text-mimoo-ink-900">
          {t('resetDone.title')}
        </h2>
        <p className="text-mimoo-ink-500 text-sm">{t('resetDone.subtitle')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        {...register('password')}
        type={showPassword ? 'text' : 'password'}
        label={t('newPassword')}
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        helperText={!errors.password ? t('passwordHelper') : undefined}
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

      <Input
        {...register('confirmPassword')}
        type={showPassword ? 'text' : 'password'}
        label={t('confirmPassword')}
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        disabled={isPending}
      />

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
        className="w-full"
      >
        {t('resetPasswordCta')}
      </Button>
    </form>
  );
}
