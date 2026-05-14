'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { updateProfileAction } from '@/lib/profile/actions';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  locale: z.enum(['id', 'en']),
});

type FormInput = z.infer<typeof formSchema>;

interface ProfileFormProps {
  initialName: string;
  initialLocale: 'id' | 'en';
  labels: {
    name: string;
    nameHelper: string;
    namePlaceholder: string;
    locale: string;
    localeHelper: string;
    localeId: string;
    localeEn: string;
    save: string;
    savedToast: string;
    errorToast: string;
  };
}

export function ProfileForm({ initialName, initialLocale, labels }: ProfileFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
      locale: initialLocale,
    },
  });

  const selectedLocale = watch('locale');

  function onSubmit(data: FormInput) {
    setFormError('');
    startTransition(async () => {
      const result = await updateProfileAction(data);

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof FormInput, { message });
        });
        return;
      }

      if (result.error) {
        setFormError(result.error);
        toast.error(labels.errorToast);
        return;
      }

      if (result.success) {
        toast.success(labels.savedToast);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        {...register('name')}
        type="text"
        label={labels.name}
        placeholder={labels.namePlaceholder}
        autoComplete="name"
        error={errors.name?.message}
        helperText={!errors.name ? labels.nameHelper : undefined}
        disabled={isPending}
      />

      {/* Locale selector */}
      <div>
        <label className="block text-sm font-semibold text-mimoo-ink-700 mb-1.5">
          {labels.locale}
        </label>
        <p className="text-xs text-mimoo-ink-500 mb-3">{labels.localeHelper}</p>
        <div className="grid grid-cols-2 gap-3">
          {(['id', 'en'] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setValue('locale', loc, { shouldDirty: true })}
              disabled={isPending}
              aria-pressed={selectedLocale === loc}
              className={cn(
                'flex items-center justify-center gap-2 p-4 rounded-cozy border-2 transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                selectedLocale === loc
                  ? 'border-mimoo-purple-500 bg-mimoo-purple-50'
                  : 'border-mimoo-purple-100 bg-white hover:border-mimoo-purple-300 hover:bg-mimoo-purple-50'
              )}
            >
              <span className="text-2xl" aria-hidden="true">
                {loc === 'id' ? '🇮🇩' : '🇬🇧'}
              </span>
              <span className="text-sm font-semibold text-mimoo-ink-900">
                {loc === 'id' ? labels.localeId : labels.localeEn}
              </span>
            </button>
          ))}
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
        disabled={!isDirty || isPending}
        className="w-full"
      >
        {labels.save}
      </Button>
    </form>
  );
}
