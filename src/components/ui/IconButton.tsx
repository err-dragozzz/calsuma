'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required accessible label — icon-only buttons have no visible text. */
  label: string;
  children: ReactNode;
  active?: boolean;
}

/**
 * Accessible icon-only button used across the toolbar and panels. Always exposes
 * an aria-label and a visible focus ring.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, children, active = false, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-xl',
        'text-[var(--tool-fg)] transition-colors duration-150',
        'bg-[var(--tool-bg)] hover:bg-[var(--tool-bg-hover)]',
        'border border-[var(--tool-border)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
        active && 'bg-[var(--tool-bg-active)] text-[var(--accent)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
