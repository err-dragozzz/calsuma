'use client';

import { useId } from 'react';
import { cn } from '@/utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}

/**
 * Accessible on/off switch (ARIA switch pattern). Fully keyboard operable and
 * labelled. The visible knob slides with a CSS transition.
 */
export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  const id = useId();
  const descId = description ? `${id}-desc` : undefined;

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex flex-col">
        <label htmlFor={id} className="text-sm font-medium text-[var(--panel-fg)]">
          {label}
        </label>
        {description ? (
          <span id={descId} className="text-xs text-[var(--panel-fg-muted)]">
            {description}
          </span>
        ) : null}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={descId}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel-bg)]',
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--toggle-off)]',
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  );
}
