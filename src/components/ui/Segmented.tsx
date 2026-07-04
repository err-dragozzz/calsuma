'use client';

import { cn } from '@/utils/cn';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  label: string;
}

/**
 * Accessible segmented control implemented with the radiogroup pattern. Arrow
 * keys move between options; the active option is visually and semantically
 * marked.
 */
export function Segmented<T extends string>({ value, options, onChange, label }: SegmentedProps<T>) {
  const handleKey = (event: React.KeyboardEvent, index: number): void => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const dir = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + dir + options.length) % options.length;
    onChange(options[next]!.value);
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-xl border border-[var(--panel-border)] bg-[var(--segment-track)] p-1"
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKey(event, index)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]',
              selected
                ? 'bg-[var(--segment-active)] text-[var(--segment-active-fg)] shadow-sm'
                : 'text-[var(--panel-fg-muted)] hover:text-[var(--panel-fg)]',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
