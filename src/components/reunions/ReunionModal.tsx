'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { useToast } from '@/components/ui/Toast';
import { submitReunionStoryAction } from '@/lib/reunions/actions';

interface ReunionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  reportId: string;
  labels: {
    title: string;
    subtitle: string;
    storyLabel: string;
    storyPlaceholder: string;
    storyHelper: string;
    displayNameLabel: string;
    displayNamePlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    anonymous: string;
    submit: string;
    skip: string;
    successToast: string;
    errorToast: string;
  };
}

export function ReunionModal({
  isOpen,
  onClose,
  itemId,
  reportId,
  labels,
}: ReunionModalProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [city, setCity] = useState('');
  const [shareAnonymously, setShareAnonymously] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', escHandler);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', escHandler);
      };
    }
  }, [isOpen, onClose]);

  function handleSubmit() {
    if (storyText.trim().length < 10) {
      toast.error(labels.errorToast);
      return;
    }

    startTransition(async () => {
      const result = await submitReunionStoryAction({
        reportId,
        itemId,
        storyText: storyText.trim(),
        displayName: displayName.trim() || null,
        city: city.trim() || null,
        shareAnonymously,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success) {
        toast.success(labels.successToast);
        onClose();
        router.refresh();
      }
    });
  }

  if (!isOpen || !isMounted) return null;

  const modal = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-mimoo-ink-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[151] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reunion-title"
      >
        <div
          className="w-full max-w-lg bg-white rounded-cozy-lg shadow-soft-lg my-8 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 sm:p-8 text-center border-b border-mimoo-purple-50">
            <div className="flex justify-center mb-3">
              <MimooBlob size="lg" expression="love" />
            </div>
            <h2
              id="reunion-title"
              className="font-display text-2xl font-extrabold text-mimoo-ink-900 mb-2"
            >
              {labels.title} 💜
            </h2>
            <p className="text-sm text-mimoo-ink-500 leading-relaxed">
              {labels.subtitle}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-4">
            <Textarea
              label={labels.storyLabel}
              placeholder={labels.storyPlaceholder}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              helperText={labels.storyHelper}
              characterCount={{ current: storyText.length, max: 500 }}
              rows={4}
              disabled={isPending}
            />

            {!shareAnonymously && (
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  type="text"
                  label={labels.displayNameLabel}
                  placeholder={labels.displayNamePlaceholder}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isPending}
                />
                <Input
                  type="text"
                  label={labels.cityLabel}
                  placeholder={labels.cityPlaceholder}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isPending}
                />
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-cozy bg-mimoo-cream-100 hover:bg-mimoo-cream-200 transition-colors">
              <input
                type="checkbox"
                checked={shareAnonymously}
                onChange={(e) => setShareAnonymously(e.target.checked)}
                disabled={isPending}
                className="w-4 h-4 rounded text-mimoo-purple-500 focus:ring-mimoo-purple-400 focus:ring-2"
              />
              <span className="text-sm text-mimoo-ink-700">{labels.anonymous}</span>
            </label>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onClose}
                disabled={isPending}
                className="flex-1"
              >
                {labels.skip}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                isLoading={isPending}
                disabled={isPending || storyText.trim().length < 10}
                className="flex-[2]"
              >
                {labels.submit}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
