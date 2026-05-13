'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback — if no provider, just log
    return {
      success: (msg: string) => console.log('[toast.success]', msg),
      error: (msg: string) => console.error('[toast.error]', msg),
      info: (msg: string) => console.info('[toast.info]', msg),
      dismiss: () => {},
    };
  }
  return context;
}

const AUTO_DISMISS_MS = 4000;
const MAX_TOASTS = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type: ToastType, message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => {
        // Limit max toasts (drop oldest)
        const next = [...prev, { id, type, message }];
        return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
      });

      // Auto-dismiss
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss]
  );

  const value: ToastContextValue = {
    success: (msg) => show('success', msg),
    error: (msg) => show('error', msg),
    info: (msg) => show('info', msg),
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {isMounted &&
        createPortal(
          <ToastViewport toasts={toasts} onDismiss={dismiss} />,
          document.body
        )}
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[200] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] sm:w-auto pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const config = {
    success: {
      icon: '✓',
      bg: 'bg-mimoo-mint-100',
      border: 'border-mimoo-mint-300',
      text: 'text-mimoo-ink-900',
      iconBg: 'bg-mimoo-mint-300 text-white',
    },
    error: {
      icon: '⚠',
      bg: 'bg-mimoo-pink-50',
      border: 'border-mimoo-pink-300',
      text: 'text-mimoo-ink-900',
      iconBg: 'bg-mimoo-pink-400 text-white',
    },
    info: {
      icon: 'i',
      bg: 'bg-mimoo-purple-50',
      border: 'border-mimoo-purple-300',
      text: 'text-mimoo-ink-900',
      iconBg: 'bg-mimoo-purple-500 text-white',
    },
  }[toast.type];

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-cozy-lg shadow-soft-lg border-2',
        config.bg,
        config.border,
        'animate-slide-up'
      )}
    >
      <span
        className={cn(
          'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold',
          config.iconBg
        )}
        aria-hidden="true"
      >
        {config.icon}
      </span>
      <p className={cn('flex-1 text-sm font-medium leading-relaxed', config.text)}>
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-mimoo-ink-500 hover:text-mimoo-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400 rounded p-0.5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
