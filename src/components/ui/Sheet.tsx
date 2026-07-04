'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from '@/components/icons';
import { useAnimationsEnabled } from '@/hooks/useAnimationsEnabled';
import { IconButton } from './IconButton';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Which edge the sheet slides in from. */
  side?: 'right' | 'left';
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible slide-over dialog. Implements the modal dialog pattern: focus trap,
 * ESC to close, backdrop click to dismiss, scroll lock, and focus restoration.
 */
export function Sheet({ open, onClose, title, children, side = 'right' }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const animate = useAnimationsEnabled();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the panel on open.
    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      const target = panel?.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = original;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  const offset = side === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex" role="presentation">
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={animate ? { opacity: 0 } : undefined}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onKeyDown={handleKeyDown}
            initial={animate ? { x: offset } : false}
            animate={{ x: 0 }}
            exit={animate ? { x: offset } : undefined}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className={
              'relative z-10 ml-auto flex h-full w-full max-w-[420px] flex-col bg-[var(--panel-bg)] text-[var(--panel-fg)] shadow-2xl ' +
              (side === 'left' ? 'mr-auto ml-0' : '')
            }
          >
            <header className="flex items-center justify-between border-b border-[var(--panel-border)] px-5 py-4">
              <h2 className="text-base font-semibold tracking-tight">{title}</h2>
              <IconButton label="Close panel" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
