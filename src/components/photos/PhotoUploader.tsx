'use client';

import { useState, useRef, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { addItemPhotos, deleteItemPhoto } from '@/lib/photos/actions';
import { cn } from '@/lib/utils';

interface PhotoUploaderProps {
  itemId: string;
  initialPhotos?: string[];
  maxPhotos?: number;
  labels: {
    title: string;
    helper: string;
    addPhoto: string;
    uploading: string;
    remove: string;
    successToast: string;
    errorToast: string;
    maxReached: string;
  };
}

const MAX_PHOTOS = 3;

export function PhotoUploader({
  itemId,
  initialPhotos = [],
  maxPhotos = MAX_PHOTOS,
  labels,
}: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [isPending, startTransition] = useTransition();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const remaining = maxPhotos - photos.length;

    if (remaining <= 0) {
      toast.error(labels.maxReached);
      return;
    }

    const toUpload = files.slice(0, remaining);

    startTransition(async () => {
      const result = await addItemPhotos(itemId, toUpload);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.urls) {
        setPhotos((prev) => [...prev, ...result.urls!]);
        toast.success(labels.successToast);
      }
    });
  }

  function handleRemove(url: string) {
    startTransition(async () => {
      const result = await deleteItemPhoto(itemId, url);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setPhotos((prev) => prev.filter((p) => p !== url));
    });
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold text-mimoo-ink-900 mb-1">{labels.title}</h3>
        <p className="text-xs text-mimoo-ink-500">
          {labels.helper} ({photos.length}/{maxPhotos})
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Existing photos */}
        {photos.map((url) => (
          <div
            key={url}
            className="relative aspect-square rounded-cozy overflow-hidden border-2 border-mimoo-purple-100 group"
          >
            <Image
              src={url}
              alt="Foto item"
              fill
              sizes="(max-width: 640px) 33vw, 200px"
              className="object-cover"
              unoptimized // Supabase Storage handles optimization
            />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              disabled={isPending}
              aria-label={labels.remove}
              className="absolute top-1 right-1 w-7 h-7 bg-mimoo-pink-400 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md motion-safe:opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-pink-200"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Upload button */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            disabled={isPending}
            className={cn(
              'aspect-square rounded-cozy border-2 border-dashed flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              dragActive
                ? 'border-mimoo-purple-500 bg-mimoo-purple-50 scale-105'
                : 'border-mimoo-purple-200 bg-white hover:border-mimoo-purple-300 hover:bg-mimoo-purple-50'
            )}
          >
            <span className="text-3xl" aria-hidden="true">
              {isPending ? '⏳' : '📷'}
            </span>
            <span className="text-mimoo-ink-700 text-center px-2">
              {isPending ? labels.uploading : labels.addPhoto}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
