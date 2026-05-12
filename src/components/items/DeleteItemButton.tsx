'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { deleteItemAction } from '@/lib/items/actions';
import { Button } from '@/components/ui/Button';

interface DeleteItemButtonProps {
  itemId: string;
  labels: {
    delete: string;
    confirm: string;
    cancel: string;
    confirmYes: string;
    deleting: string;
  };
}

export function DeleteItemButton({ itemId, labels }: DeleteItemButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteItemAction(itemId);
      if (result.success) {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    });
  }

  if (!showConfirm) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="text-mimoo-pink-400 hover:bg-mimoo-pink-50"
      >
        🗑️ {labels.delete}
      </Button>
    );
  }

  return (
    <div className="bg-mimoo-pink-50 border-2 border-mimoo-pink-200 rounded-cozy p-4 space-y-3">
      <p className="text-sm text-mimoo-ink-900 font-medium">{labels.confirm}</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="flex-1"
        >
          {labels.cancel}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleDelete}
          isLoading={isPending}
          className="flex-1 bg-mimoo-pink-400 hover:bg-mimoo-pink-400/90"
        >
          {labels.confirmYes}
        </Button>
      </div>
    </div>
  );
}
