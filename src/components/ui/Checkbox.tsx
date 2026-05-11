import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const checkboxId = id || props.name;
    const errorId = error ? `${checkboxId}-error` : undefined;

    return (
      <div className="w-full">
        <label
          htmlFor={checkboxId}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={cn(
              'mt-0.5 w-5 h-5 rounded-md border-2 cursor-pointer shrink-0',
              'text-mimoo-purple-500 bg-white',
              'focus:outline-none focus:ring-4 focus:ring-mimoo-purple-100',
              'transition-all',
              error ? 'border-mimoo-pink-300' : 'border-mimoo-purple-200',
              'checked:bg-mimoo-purple-500 checked:border-mimoo-purple-500',
              className
            )}
            {...props}
          />
          {label && (
            <span className="text-sm text-mimoo-ink-700 leading-relaxed select-none group-hover:text-mimoo-ink-900 transition-colors">
              {label}
            </span>
          )}
        </label>
        {error && (
          <p
            id={errorId}
            className="mt-1 ml-8 text-xs text-mimoo-pink-400 font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
