'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { itemSchema, type ItemInput } from '@/lib/items/schemas';
import { updateItemAction } from '@/lib/items/actions';
import { ITEM_CATEGORIES } from '@/lib/items/types';
import type { Item } from '@/lib/items/types';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface EditItemFormProps {
  item: Item;
  labels: {
    name: string;
    nameHelper: string;
    namePlaceholder: string;
    category: string;
    categoryHelper: string;
    message: string;
    messageHelper: string;
    messagePlaceholder: string;
    save: string;
    cancel: string;
    savedToast: string;
    errorToast: string;
  };
}

export function EditItemForm({ item, labels }: EditItemFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const toast = useToast();
  const [formError, setFormError] = useState('');
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors, isDirty },
  } = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: item.name,
      category: item.category,
      custom_message: item.custom_message || '',
    },
  });

  const messageValue = watch('custom_message') || '';

  function onSubmit(data: ItemInput) {
    setFormError('');
    startTransition(async () => {
      const result = await updateItemAction(item.id, data);

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof ItemInput, { message });
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
        router.push(`/${locale}/dashboard/items/${item.id}`);
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
        autoComplete="off"
        autoFocus
        error={errors.name?.message}
        helperText={!errors.name ? labels.nameHelper : undefined}
        disabled={isPending}
      />

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
        placeholder={labels.messagePlaceholder}
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
          disabled={!isDirty || isPending}
          className="flex-[2]"
        >
          {labels.save}
        </Button>
      </div>
    </form>
  );
}
