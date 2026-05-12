'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { lostModeSchema, type LostModeInput } from '@/lib/items/schemas';
import { toggleLostModeAction } from '@/lib/items/actions';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import type { EmergencyContactDecrypted } from '@/lib/items/types';
import { cn } from '@/lib/utils';

interface LostModeToggleProps {
  itemId: string;
  itemName: string;
  isLost: boolean;
  currentContact: EmergencyContactDecrypted | null;
  labels: {
    title: string;
    description: string;
    activate: string;
    deactivate: string;
    warningTitle: string;
    warningDesc: string;
    whatsapp: string;
    whatsappPlaceholder: string;
    whatsappHelper: string;
    rewardCheckbox: string;
    rewardLabel: string;
    rewardPlaceholder: string;
    cancel: string;
    saveAndActivate: string;
    confirmDeactivate: string;
    activeTitle: string;
    activeDesc: string;
  };
}

export function LostModeToggle({
  itemId,
  itemName,
  isLost,
  currentContact,
  labels,
}: LostModeToggleProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [formError, setFormError] = useState('');
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<LostModeInput>({
    resolver: zodResolver(lostModeSchema),
    defaultValues: {
      enable: true,
      whatsapp: currentContact?.whatsapp || '',
      phone: '',
      email: '',
      has_reward: currentContact?.has_reward || false,
      reward_description: currentContact?.reward_description || '',
    },
  });

  const hasReward = watch('has_reward');
  const rewardDesc = watch('reward_description') || '';

  function onSubmit(data: LostModeInput) {
    setFormError('');
    startTransition(async () => {
      const result = await toggleLostModeAction(itemId, { ...data, enable: true });

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof LostModeInput, { message });
        });
        return;
      }

      if (result.error) {
        setFormError(result.error);
        return;
      }

      if (result.success) {
        setShowForm(false);
        router.refresh();
      }
    });
  }

  function handleDeactivate() {
    startTransition(async () => {
      const result = await toggleLostModeAction(itemId, {
        enable: false,
        whatsapp: '',
        phone: '',
        email: '',
        has_reward: false,
        reward_description: '',
      });

      if (result.success) {
        setShowDeactivateConfirm(false);
        router.refresh();
      }
    });
  }

  // === ACTIVE STATE (item is currently lost) ===
  if (isLost) {
    return (
      <div className="rounded-cozy-lg p-6 bg-gradient-to-br from-mimoo-pink-50 to-mimoo-cream-100 border-2 border-mimoo-pink-300">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl shrink-0" aria-hidden="true">
            ⚠️
          </span>
          <div className="flex-1">
            <Badge variant="pink" className="mb-2">
              LOST MODE AKTIF
            </Badge>
            <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-1">
              {labels.activeTitle}
            </h3>
            <p className="text-sm text-mimoo-ink-700 leading-relaxed">
              {labels.activeDesc}
            </p>
          </div>
        </div>

        {!showDeactivateConfirm ? (
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowDeactivateConfirm(true)}
            className="w-full bg-white"
          >
            {labels.deactivate}
          </Button>
        ) : (
          <div className="bg-white rounded-cozy p-4 space-y-3">
            <p className="text-sm text-mimoo-ink-700">{labels.confirmDeactivate}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeactivateConfirm(false)}
                disabled={isPending}
                className="flex-1"
              >
                {labels.cancel}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDeactivate}
                isLoading={isPending}
                className="flex-1"
              >
                ✓ {labels.deactivate}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // === INACTIVE STATE (item is safe) ===
  return (
    <div className="rounded-cozy-lg p-6 bg-white border-2 border-mimoo-purple-100">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl shrink-0" aria-hidden="true">
          🛡️
        </span>
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-1">
            {labels.title}
          </h3>
          <p className="text-sm text-mimoo-ink-500 leading-relaxed">
            {labels.description}
          </p>
        </div>
      </div>

      {!showForm ? (
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowForm(true)}
          className="w-full"
        >
          ⚠️ {labels.activate}
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 mt-2 pt-4 border-t border-mimoo-purple-50"
          noValidate
        >
          <div className="rounded-cozy p-4 bg-mimoo-cream-100">
            <p className="text-xs font-semibold text-mimoo-ink-900 mb-1">
              ⚠️ {labels.warningTitle}
            </p>
            <p className="text-xs text-mimoo-ink-500 leading-relaxed">
              {labels.warningDesc}
            </p>
          </div>

          <Input
            {...register('whatsapp')}
            type="tel"
            label={labels.whatsapp}
            placeholder={labels.whatsappPlaceholder}
            error={errors.whatsapp?.message}
            helperText={!errors.whatsapp ? labels.whatsappHelper : undefined}
            disabled={isPending}
          />

          {/* Reward toggle */}
          <Checkbox
            {...register('has_reward')}
            label={labels.rewardCheckbox}
            disabled={isPending}
          />

          {hasReward && (
            <Textarea
              {...register('reward_description')}
              label={labels.rewardLabel}
              placeholder={labels.rewardPlaceholder}
              rows={2}
              error={errors.reward_description?.message}
              characterCount={{ current: rewardDesc.length, max: 300 }}
              disabled={isPending}
            />
          )}

          {formError && (
            <div
              className="bg-mimoo-pink-50 border-2 border-mimoo-pink-200 rounded-cozy p-3 text-sm text-mimoo-pink-400 font-medium"
              role="alert"
            >
              {formError}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setShowForm(false)}
              disabled={isPending}
              className="flex-1"
            >
              {labels.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isPending}
              className="flex-[2]"
            >
              {labels.saveAndActivate}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
