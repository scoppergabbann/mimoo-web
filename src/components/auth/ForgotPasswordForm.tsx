'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/auth/schemas';
import { forgotPasswordAction } from '@/lib/auth/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MailIcon } from '@/components/ui/AuthIcons';

export function ForgotPasswordForm() {
  const t = useTranslations('AuthForm');
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(data: ForgotPasswordInput) {
    setFormError('');
    startTransition(async () => {
      const result = await forgotPasswordAction(data);

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof ForgotPasswordInput, { message });
        });
        return;
      }

      if (result.error) {
        setFormError(result.error);
        return;
      }

      if (result.success) {
        setSent(true);
      }
    });
  }

  if (sent) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="text-6xl mb-2" aria-hidden="true">
          💌
        </div>
        <h2 className="font-display text-xl font-bold text-mimoo-ink-900">
          {t('forgotSent.title')}
        </h2>
        <p className="text-mimoo-ink-500 leading-relaxed text-sm">
          {t('forgotSent.subtitle', { email: watch('email') })}
        </p>
        <p className="text-xs text-mimoo-ink-300">{t('forgotSent.helper')}</p>
        <Link href="/login">
          <Button variant="outline" size="md" className="mt-4">
            {t('backToLogin')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
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
        {t('sendResetLink')}
      </Button>
    </form>
  );
}
