import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  helperText?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightSlot, helperText, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-mimoo-ink-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-mimoo-ink-500 pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={cn(
              'w-full bg-white rounded-cozy border-2 px-4 py-3 text-mimoo-ink-900 placeholder:text-mimoo-ink-300',
              'transition-all duration-200',
              'focus:outline-none focus:ring-4',
              leftIcon && 'pl-11',
              rightSlot && 'pr-12',
              error
                ? 'border-mimoo-pink-300 focus:border-mimoo-pink-400 focus:ring-mimoo-pink-100'
                : 'border-mimoo-purple-100 focus:border-mimoo-purple-400 focus:ring-mimoo-purple-100',
              'disabled:bg-mimoo-cream-200 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          {rightSlot && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightSlot}
            </div>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-xs text-mimoo-pink-400 font-medium flex items-center gap-1"
            role="alert"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-mimoo-ink-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
