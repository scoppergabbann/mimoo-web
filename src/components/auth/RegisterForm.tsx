'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { registerSchema, type RegisterInput } from '@/lib/auth/schemas';
import { registerAction } from '@/lib/auth/actions';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { MailIcon, EyeIcon, EyeOffIcon, UserIcon } from '@/components/ui/AuthIcons';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { GoogleSignInButton } from './GoogleSignInButton';
import { OrDivider } from './OrDivider';
import { AvatarPicker } from './AvatarPicker';

export function RegisterForm() {
  const t = useTranslations('AuthForm');
  const router = useRouter();
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2>(1); // step 1 = info, 2 = avatar

  const {
    register,
    handleSubmit,
    setError,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      character: 'denpa',
      skinTone: 'medium',
      outfit: 'purple',
      accent: 'purple',
      agreeTerms: false,
    },
  });

  async function handleNextStep() {
    // Validate step 1 fields before proceeding to step 2
    const valid = await trigger(['name', 'email', 'password', 'confirmPassword']);
    if (valid) setStep(2);
  }

  function onSubmit(data: RegisterInput) {
    setFormError('');
    startTransition(async () => {
      const result = await registerAction(data);

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof RegisterInput, { message });
        });
        // If error in step 1 fields, go back
        const step1Fields = ['name', 'email', 'password', 'confirmPassword'];
        if (Object.keys(result.fieldErrors).some((f) => step1Fields.includes(f))) {
          setStep(1);
        }
        return;
      }

      if (result.error === 'CONFIRMATION_NEEDED') {
        setConfirmationSent(true);
        return;
      }

      if (result.error) {
        setFormError(result.error);
        return;
      }

      if (result.success) {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    });
  }

  // Confirmation sent screen
  if (confirmationSent) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="text-6xl mb-2" aria-hidden="true">
          📬
        </div>
        <h2 className="font-display text-xl font-bold text-mimoo-ink-900">
          {t('confirmation.title')}
        </h2>
        <p className="text-mimoo-ink-500 leading-relaxed text-sm">
          {t('confirmation.subtitle', { email: watch('email') })}
        </p>
        <p className="text-xs text-mimoo-ink-300">
          {t('confirmation.helper')}
        </p>
        <Link href="/login">
          <Button variant="outline" size="md" className="mt-4">
            {t('confirmation.backToLogin')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {step === 1 && (
        <>
          <GoogleSignInButton label={t('continueWithGoogle')} />
          <OrDivider text={t('or')} />
        </>
      )}

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div
          className={`w-8 h-1 rounded-pill transition-colors ${
            step >= 1 ? 'bg-mimoo-purple-500' : 'bg-mimoo-purple-100'
          }`}
        />
        <div
          className={`w-8 h-1 rounded-pill transition-colors ${
            step >= 2 ? 'bg-mimoo-purple-500' : 'bg-mimoo-purple-100'
          }`}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {step === 1 && (
          <>
            <Input
              {...register('name')}
              type="text"
              label={t('name')}
              placeholder={t('namePlaceholder')}
              autoComplete="name"
              leftIcon={<UserIcon className="w-4 h-4" />}
              error={errors.name?.message}
              disabled={isPending}
            />

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

            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label={t('password')}
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
              type={showConfirmPassword ? 'text' : 'password'}
              label={t('confirmPassword')}
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              disabled={isPending}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1.5 text-mimoo-ink-500 hover:text-mimoo-ink-700 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              }
            />

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNextStep}
              rightIcon={<ArrowRightIcon />}
              className="w-full"
            >
              {t('nextStep')}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Controller
              control={control}
              name="character"
              render={({ field: charField }) => (
                <Controller
                  control={control}
                  name="skinTone"
                  render={({ field: skinField }) => (
                    <Controller
                      control={control}
                      name="outfit"
                      render={({ field: outfitField }) => (
                        <Controller
                          control={control}
                          name="accent"
                          render={({ field: accentField }) => (
                            <AvatarPicker
                              character={charField.value}
                              skinTone={skinField.value}
                              outfit={outfitField.value}
                              accent={accentField.value}
                              onCharacterChange={charField.onChange}
                              onSkinToneChange={skinField.onChange}
                              onOutfitChange={outfitField.onChange}
                            />
                          )}
                        />
                      )}
                    />
                  )}
                />
              )}
            />

            <Controller
              control={control}
              name="agreeTerms"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  ref={field.ref}
                  error={errors.agreeTerms?.message}
                  label={
                    <span>
                      {t('agreeTermsPrefix')}{' '}
                      <Link
                        href="/terms"
                        className="text-mimoo-purple-700 hover:underline font-semibold"
                        target="_blank"
                      >
                        {t('termsLink')}
                      </Link>{' '}
                      {t('and')}{' '}
                      <Link
                        href="/privacy"
                        className="text-mimoo-purple-700 hover:underline font-semibold"
                        target="_blank"
                      >
                        {t('privacyLink')}
                      </Link>
                    </span>
                  }
                />
              )}
            />

            {formError && (
              <div
                className="bg-mimoo-pink-50 border-2 border-mimoo-pink-200 rounded-cozy p-3 text-sm text-mimoo-pink-400 font-medium"
                role="alert"
              >
                {formError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setStep(1)}
                disabled={isPending}
                className="flex-1"
              >
                {t('back')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                className="flex-[2]"
              >
                {t('createAccount')}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
