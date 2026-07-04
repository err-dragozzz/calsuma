'use client';

import { useSettingsStore } from '@/store/settingsStore';
import { usePrefersReducedMotion } from './useMediaQuery';

/**
 * Single source of truth for "should we animate?". Combines the user's
 * animation setting with the OS reduced-motion preference — the OS preference
 * always wins when it asks to reduce motion.
 */
export function useAnimationsEnabled(): boolean {
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);
  const prefersReduced = usePrefersReducedMotion();
  return animationsEnabled && !prefersReduced;
}
