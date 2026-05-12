'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { finderReportSchema, type FinderReportInput } from '@/lib/items/schemas';
import { submitFinderReportAction } from '@/lib/items/actions';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { MimooBlob } from '@/lib/avatar/MimooBlob';
import { ArrowRightIcon } from '@/components/ui/Icons';

interface FinderFormProps {
  recoveryCode: string;
  itemName: string;
  labels: {
    title: string;
    subtitle: string;
    messageLabel: string;
    messagePlaceholder: string;
    messageHelper: string;
    locationLabel: string;
    locationPlaceholder: string;
    locationHelper: string;
    useGpsLabel: string;
    gpsLoading: string;
    gpsCaptured: string;
    gpsError: string;
    nameLabel: string;
    namePlaceholder: string;
    nameOptional: string;
    contactLabel: string;
    contactPlaceholder: string;
    contactOptional: string;
    submit: string;
    cancel: string;
    successTitle: string;
    successDesc: string;
    backHome: string;
  };
}

export function FinderForm({ recoveryCode, itemName, labels }: FinderFormProps) {
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'captured' | 'error'>(
    'idle'
  );
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FinderReportInput>({
    resolver: zodResolver(finderReportSchema),
    defaultValues: {
      message: '',
      location_text: '',
      location_lat: null,
      location_lng: null,
      finder_name: '',
      finder_contact: '',
    },
  });

  const messageValue = watch('message') || '';

  function captureGps() {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('location_lat', position.coords.latitude);
        setValue('location_lng', position.coords.longitude);
        setGpsStatus('captured');
      },
      () => {
        setGpsStatus('error');
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  function onSubmit(data: FinderReportInput) {
    setFormError('');
    startTransition(async () => {
      const result = await submitFinderReportAction(recoveryCode, data);

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof FinderReportInput, { message });
        });
        return;
      }

      if (result.error) {
        setFormError(result.error);
        return;
      }

      if (result.success) {
        setSubmitted(true);
      }
    });
  }

  // === SUCCESS STATE ===
  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <MimooBlob size="xl" expression="love" />
        </div>
        <div className="text-4xl mb-3" aria-hidden="true">
          💜
        </div>
        <h2 className="font-display text-2xl font-extrabold text-mimoo-ink-900 mb-3">
          {labels.successTitle}
        </h2>
        <p className="text-mimoo-ink-500 leading-relaxed mb-6 max-w-md mx-auto">
          {labels.successDesc}
        </p>
        <a
          href="/"
          className="inline-block"
        >
          <Button variant="outline" size="md">
            {labels.backHome}
          </Button>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Textarea
        {...register('message')}
        label={labels.messageLabel}
        placeholder={labels.messagePlaceholder}
        rows={4}
        error={errors.message?.message}
        helperText={!errors.message ? labels.messageHelper : undefined}
        characterCount={{ current: messageValue.length, max: 1000 }}
        disabled={isPending}
        autoFocus
      />

      <div>
        <Input
          {...register('location_text')}
          type="text"
          label={labels.locationLabel}
          placeholder={labels.locationPlaceholder}
          error={errors.location_text?.message}
          helperText={!errors.location_text ? labels.locationHelper : undefined}
          disabled={isPending}
        />
        <div className="mt-2">
          <button
            type="button"
            onClick={captureGps}
            disabled={isPending || gpsStatus === 'loading'}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-pill bg-mimoo-sky-50 hover:bg-mimoo-sky-100 text-mimoo-sky-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-sky-300 disabled:opacity-60"
          >
            {gpsStatus === 'loading' && (
              <>
                <svg
                  className="animate-spin w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>{labels.gpsLoading}</span>
              </>
            )}
            {gpsStatus === 'captured' && (
              <>
                <span aria-hidden="true">✓</span>
                <span>{labels.gpsCaptured}</span>
              </>
            )}
            {gpsStatus === 'error' && (
              <>
                <span aria-hidden="true">⚠️</span>
                <span>{labels.gpsError}</span>
              </>
            )}
            {gpsStatus === 'idle' && (
              <>
                <span aria-hidden="true">📍</span>
                <span>{labels.useGpsLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-mimoo-purple-50">
        <p className="text-xs text-mimoo-ink-300 mb-3 uppercase tracking-wider font-semibold">
          Opsional
        </p>

        <Input
          {...register('finder_name')}
          type="text"
          label={
            <>
              {labels.nameLabel}{' '}
              <span className="text-mimoo-ink-300 font-normal">
                ({labels.nameOptional})
              </span>
            </>
          }
          placeholder={labels.namePlaceholder}
          error={errors.finder_name?.message}
          disabled={isPending}
        />

        <div className="mt-4">
          <Input
            {...register('finder_contact')}
            type="text"
            label={
              <>
                {labels.contactLabel}{' '}
                <span className="text-mimoo-ink-300 font-normal">
                  ({labels.contactOptional})
                </span>
              </>
            }
            placeholder={labels.contactPlaceholder}
            error={errors.finder_contact?.message}
            disabled={isPending}
          />
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

      <div className="flex gap-3">
        <a href={`/found/${recoveryCode}`} className="flex-1">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isPending}
            className="w-full"
          >
            {labels.cancel}
          </Button>
        </a>
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
