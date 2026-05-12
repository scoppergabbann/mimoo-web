import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  characterCount?: { current: number; max: number };
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, characterCount, className, id, ...props }, ref) => {
    const textareaId = id || props.name;
    const errorId = error ? `${textareaId}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-mimoo-ink-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            'w-full bg-white rounded-cozy border-2 px-4 py-3 text-mimoo-ink-900 placeholder:text-mimoo-ink-300',
            'transition-all duration-200 resize-none min-h-[100px]',
            'focus:outline-none focus:ring-4',
            error
              ? 'border-mimoo-pink-300 focus:border-mimoo-pink-400 focus:ring-mimoo-pink-100'
              : 'border-mimoo-purple-100 focus:border-mimoo-purple-400 focus:ring-mimoo-purple-100',
            'disabled:bg-mimoo-cream-200 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-start mt-1.5">
          <div className="flex-1">
            {error && (
              <p
                id={errorId}
                className="text-xs text-mimoo-pink-400 font-medium flex items-center gap-1"
                role="alert"
              >
                <span aria-hidden="true">⚠️</span>
                <span>{error}</span>
              </p>
            )}
            {!error && helperText && (
              <p className="text-xs text-mimoo-ink-500">{helperText}</p>
            )}
          </div>
          {characterCount && (
            <p
              className={cn(
                'text-xs font-medium shrink-0',
                characterCount.current > characterCount.max
                  ? 'text-mimoo-pink-400'
                  : 'text-mimoo-ink-300'
              )}
            >
              {characterCount.current}/{characterCount.max}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
