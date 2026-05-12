'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { itemSchema, type ItemInput } from '@/lib/items/schemas';
import { createItemAction } from '@/lib/items/actions';
import { ITEM_CATEGORIES, type ItemCategory } from '@/lib/items/types';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

interface NewItemFormProps {
  examples: string[];
  placeholders: {
    name: string;
    message: string;
  };
  labels: {
    name: string;
    nameHelper: string;
    category: string;
    categoryHelper: string;
    message: string;
    messageHelper: string;
    examplesTitle: string;
    submit: string;
    cancel: string;
  };
}

export function NewItemForm({ examples, placeholders, labels }: NewItemFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const [formError, setFormError] = useState('');
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      category: null,
      custom_message: '',
    },
  });

  const messageValue = watch('custom_message') || '';

  function onSubmit(data: ItemInput) {
    setFormError('');
    startTransition(async () => {
      const result = await createItemAction(data);

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof ItemInput, { message });
        });
        return;
      }

      if (result.error) {
        setFormError(result.error);
        return;
      }

      if (result.success && result.data) {
        router.push(`/${locale}/dashboard/items/${result.data.id}`);
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
        placeholder={placeholders.name}
        autoComplete="off"
        autoFocus
        error={errors.name?.message}
        helperText={!errors.name ? labels.nameHelper : undefined}
        disabled={isPending}
      />

      {/* Examples chips */}
      {examples.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-mimoo-ink-500 uppercase tracking-wider mb-2">
            {labels.examplesTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setValue('name', example, { shouldValidate: true })}
                className="px-3 py-1.5 text-xs font-medium bg-mimoo-purple-50 hover:bg-mimoo-purple-100 text-mimoo-purple-700 rounded-pill transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400"
                disabled={isPending}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category picker */}
      <div>
        <label className="block text-sm font-semibold text-mimoo-ink-700 mb-1.5">
          {labels.category}
        </label>
        <p className="text-xs text-mimoo-ink-500 mb-3">{labels.categoryHelper}</p>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {ITEM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    field.onChange(field.value === cat.id ? null : cat.id)
                  }
                  disabled={isPending}
                  aria-pressed={field.value === cat.id}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 p-3 rounded-cozy border-2 transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    field.value === cat.id
                      ? 'border-mimoo-purple-500 bg-mimoo-purple-50'
                      : 'border-mimoo-purple-100 bg-white hover:border-mimoo-purple-300 hover:bg-mimoo-purple-50'
                  )}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {cat.emoji}
                  </span>
                  <span className="text-[10px] font-medium text-mimoo-ink-700 text-center leading-tight">
                    {locale === 'en' ? cat.labelEn : cat.labelId}
                  </span>
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <Textarea
        {...register('custom_message')}
        label={labels.message}
        placeholder={placeholders.message}
        rows={3}
        error={errors.custom_message?.message}
        helperText={!errors.custom_message ? labels.messageHelper : undefined}
        characterCount={{ current: messageValue.length, max: 500 }}
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

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          disabled={isPending}
          className="flex-1"
        >
          {labels.cancel}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          rightIcon={!isPending && <ArrowRightIcon />}
          className="flex-[2]"
        >
          {labels.submit}
        </Button>
      </div>
    </form>
  );
}
