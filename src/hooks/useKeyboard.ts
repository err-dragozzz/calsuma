'use client';

import { useEffect, useMemo } from 'react';
import type { KeyDef } from '@/types';
import { ALL_KEYS } from '@/constants/keys';
import { useCalculatorStore } from '@/store/calculatorStore';

/** Build a fast event.key → KeyDef lookup once. */
function buildKeyMap(): Map<string, KeyDef> {
  const map = new Map<string, KeyDef>();
  for (const key of ALL_KEYS) {
    for (const binding of key.keys ?? []) {
      map.set(binding, key);
    }
  }
  return map;
}

/** True when the event originated from an editable element we should not hijack. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

interface KeyboardHandlers {
  /** Called with the KeyDef id (or 'del') when a binding fires, for UI feedback. */
  onActivate?: (keyId: string, variant: 'key' | 'equals' | 'clear') => void;
}

/**
 * Global keyboard support. Maps physical keys to calculator actions, ignores
 * shortcuts with modifiers, and never interferes with typing in real inputs
 * (e.g. the history search field).
 */
export function useKeyboard({ onActivate }: KeyboardHandlers = {}): void {
  const dispatch = useCalculatorStore((s) => s.dispatch);
  const del = useCalculatorStore((s) => s.del);
  const keyMap = useMemo(buildKeyMap, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableTarget(event.target)) return;

      if (event.key === 'Backspace') {
        event.preventDefault();
        del();
        onActivate?.('del', 'clear');
        return;
      }

      const def = keyMap.get(event.key);
      if (!def) return;

      event.preventDefault();
      dispatch(def.action);
      const variant =
        def.variant === 'equals' ? 'equals' : def.variant === 'action' ? 'clear' : 'key';
      onActivate?.(def.id, variant);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch, del, keyMap, onActivate]);
}
