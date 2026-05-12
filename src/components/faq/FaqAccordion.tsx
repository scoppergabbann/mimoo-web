'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={cn(
              'bg-white rounded-cozy border-2 transition-all duration-200',
              isOpen
                ? 'border-mimoo-purple-300 shadow-soft'
                : 'border-mimoo-purple-100 hover:border-mimoo-purple-200'
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-3 p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-mimoo-purple-100 rounded-cozy"
            >
              <span className="font-semibold text-mimoo-ink-900 leading-snug pt-0.5">
                {item.question}
              </span>
              <span
                className={cn(
                  'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-mimoo-purple-700 transition-transform duration-200',
                  isOpen ? 'bg-mimoo-purple-100 rotate-180' : 'bg-mimoo-purple-50'
                )}
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-0">
                <div className="border-t border-mimoo-purple-50 pt-4 text-mimoo-ink-700 leading-relaxed whitespace-pre-wrap">
                  {item.answer}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
