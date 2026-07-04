import type { Settings } from '@/types';

/** Factory for the default settings object (avoids shared-reference mutation). */
export const DEFAULT_SETTINGS: Settings = {
  theme: 'ivory',
  mode: 'classic',
  soundEnabled: false,
  animationsEnabled: true,
  highContrast: false,
  fontSize: 'medium',
  precision: 10,
  angleUnit: 'deg',
  autoHistory: true,
};

/** localStorage keys. Versioned so schema changes can invalidate old data. */
export const STORAGE_KEYS = {
  settings: 'calsuma:settings:v1',
  calculator: 'calsuma:calculator:v1',
} as const;

/** Maximum number of history entries retained (pinned entries are exempt). */
export const MAX_HISTORY = 500;

export const PRECISION_RANGE = { min: 1, max: 14 } as const;
