'use client';

import { useState, useEffect, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { MimooAvatar } from '@/lib/avatar/MimooAvatar';
import { completeOnboardingAction } from '@/lib/auth/actions';
import { cn } from '@/lib/utils';
import type { AvatarConfig } from '@/lib/avatar/types';

interface OnboardingModalProps {
  userName: string;
  avatarConfig: AvatarConfig;
  labels: {
    skipButton: string;
    nextButton: string;
    backButton: string;
    finishButton: string;
    step1: {
      title: string;
      subtitle: string;
      welcomeMessage: string;
    };
    step2: {
      title: string;
      subtitle: string;
      steps: { emoji: string; title: string; desc: string }[];
    };
    step3: {
      title: string;
      subtitle: string;
      primaryCta: string;
      secondaryCta: string;
    };
  };
}

export function OnboardingModal({ userName, avatarConfig, labels }: OnboardingModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const [currentStep, setCurrentStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  function handleSkip() {
    startTransition(async () => {
      await completeOnboardingAction();
      router.refresh();
    });
  }

  function handleCreateFirstItem() {
    startTransition(async () => {
      await completeOnboardingAction();
      router.push(`/${locale}/dashboard/items/new`);
      router.refresh();
    });
  }

  function handleExploreFirst() {
    startTransition(async () => {
      await completeOnboardingAction();
      router.refresh();
    });
  }

  if (!isMounted) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 bg-mimoo-ink-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="bg-white rounded-cozy-xl shadow-soft-lg max-w-lg w-full overflow-hidden animate-slide-up max-h-[calc(100vh-4rem)] flex flex-col">
        {/* Header with progress */}
        <div className="bg-gradient-cozy px-6 pt-6 pb-4">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={currentStep}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  'h-2 rounded-pill transition-all duration-300 flex-1',
                  step <= currentStep ? 'bg-mimoo-purple-500' : 'bg-mimoo-purple-100'
                )}
              />
            ))}
          </div>

          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold text-mimoo-purple-700 uppercase tracking-wider">
              Step {currentStep} / 3
            </p>
            {currentStep < 3 && (
              <button
                type="button"
                onClick={handleSkip}
                disabled={isPending}
                className="text-xs text-mimoo-ink-500 hover:text-mimoo-ink-900 hover:underline disabled:opacity-50"
              >
                {labels.skipButton}
              </button>
            )}
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <MimooAvatar config={avatarConfig} size="xl" withFrame />
              </div>
              <h2
                id="onboarding-title"
                className="font-display text-2xl sm:text-3xl font-extrabold text-mimoo-ink-900 mb-2"
              >
                {labels.step1.title.replace('{name}', userName)}
              </h2>
              <p className="text-mimoo-ink-500 leading-relaxed mb-6">
                {labels.step1.subtitle}
              </p>
              <div className="bg-mimoo-purple-50 rounded-cozy-lg p-5 text-left">
                <p className="text-sm text-mimoo-ink-700 leading-relaxed italic">
                  &ldquo;{labels.step1.welcomeMessage}&rdquo;
                </p>
                <p className="text-xs text-mimoo-purple-700 font-semibold mt-3">
                  — Tim Mimoo 💜
                </p>
              </div>
            </div>
          )}

          {/* Step 2: How it works */}
          {currentStep === 2 && (
            <div>
              <div className="flex justify-center mb-4">
                <MimooBlob size="lg" expression="sparkle" />
              </div>
              <h2 className="font-display text-2xl font-extrabold text-mimoo-ink-900 mb-2 text-center">
                {labels.step2.title}
              </h2>
              <p className="text-mimoo-ink-500 leading-relaxed mb-6 text-center">
                {labels.step2.subtitle}
              </p>

              <div className="space-y-3">
                {labels.step2.steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 bg-mimoo-cream-100 rounded-cozy p-4"
                  >
                    <div
                      className="w-10 h-10 rounded-cozy bg-white flex items-center justify-center text-2xl shrink-0"
                      aria-hidden="true"
                    >
                      {step.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-mimoo-purple-700 mb-0.5">
                        {i + 1}.
                      </p>
                      <h3 className="font-display font-bold text-mimoo-ink-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-mimoo-ink-500 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Ready to start */}
          {currentStep === 3 && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <MimooBlob size="xl" expression="love" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-mimoo-ink-900 mb-2">
                {labels.step3.title}
              </h2>
              <p className="text-mimoo-ink-500 leading-relaxed">
                {labels.step3.subtitle}
              </p>
            </div>
          )}
        </div>

        {/* Footer with buttons */}
        <div className="px-6 py-4 border-t border-mimoo-purple-50 bg-white">
          {currentStep < 3 ? (
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={isPending}
                  className="flex-1"
                >
                  {labels.backButton}
                </Button>
              )}
              <Button
                variant="primary"
                size="lg"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={isPending}
                className={currentStep > 1 ? 'flex-[2]' : 'w-full'}
              >
                {labels.nextButton} →
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleCreateFirstItem}
                isLoading={isPending}
                className="w-full"
              >
                ✨ {labels.step3.primaryCta}
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={handleExploreFirst}
                disabled={isPending}
                className="w-full"
              >
                {labels.step3.secondaryCta}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
