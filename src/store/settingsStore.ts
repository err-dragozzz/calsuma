'use client';

/**
 * Persisted user-settings store. Uses Zustand with the persist middleware and
 * an SSR-safe storage adapter. A `hydrated` flag lets UI defer rendering of
 * persisted values until after client hydration, preventing markup mismatches.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '@/types';
import { DEFAULT_SETTINGS, PRECISION_RANGE, STORAGE_KEYS } from '@/constants/defaults';
import { createJSONStorage } from '@/utils/storage';

interface SettingsState extends Settings {
  hydrated: boolean;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  toggleTheme: () => void;
  toggleMode: () => void;
  toggleSound: () => void;
  reset: () => void;
  setHydrated: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      hydrated: false,

      setSetting: (key, value) => {
        if (key === 'precision') {
          const numeric = Math.min(
            PRECISION_RANGE.max,
            Math.max(PRECISION_RANGE.min, Number(value)),
          );
          set({ precision: numeric } as Partial<SettingsState>);
          return;
        }
        set({ [key]: value } as Partial<SettingsState>);
      },

      toggleTheme: () => set({ theme: get().theme === 'ivory' ? 'graphite' : 'ivory' }),
      toggleMode: () => set({ mode: get().mode === 'classic' ? 'scientific' : 'classic' }),
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),

      reset: () => set({ ...DEFAULT_SETTINGS }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage<SettingsState>(),
      partialize: (state): Settings => ({
        theme: state.theme,
        mode: state.mode,
        soundEnabled: state.soundEnabled,
        animationsEnabled: state.animationsEnabled,
        highContrast: state.highContrast,
        fontSize: state.fontSize,
        precision: state.precision,
        angleUnit: state.angleUnit,
        autoHistory: state.autoHistory,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
