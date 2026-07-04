'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

const THEME_COLORS: Record<string, string> = {
  ivory: '#e7e1d4',
  graphite: '#161719',
};

/**
 * Syncs persisted settings onto the document root as data-attributes so global
 * CSS can react (themes, high-contrast, font-size, animation gating). Renders
 * nothing. Kept out of React state to avoid re-rendering the whole tree.
 */
export function ThemeManager(): null {
  const theme = useSettingsStore((s) => s.theme);
  const highContrast = useSettingsStore((s) => s.highContrast);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-contrast', highContrast ? 'high' : 'normal');
    root.setAttribute('data-font-size', fontSize);
    root.setAttribute('data-animations', animationsEnabled ? 'on' : 'off');

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme] ?? THEME_COLORS.ivory!);
  }, [theme, highContrast, fontSize, animationsEnabled]);

  return null;
}
