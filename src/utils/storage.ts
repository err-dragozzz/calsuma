/**
 * SSR-safe localStorage wrapper used by the Zustand persist middleware. All
 * access is wrapped in try/catch so private-mode or storage-quota errors never
 * crash the app.
 */
import type { PersistStorage, StorageValue } from 'zustand/middleware';

const isBrowser = (): boolean => typeof window !== 'undefined' && !!window.localStorage;

/**
 * Creates a typed, JSON-serialising storage adapter for a persisted store.
 * When storage is unavailable every operation becomes a safe no-op.
 */
export function createJSONStorage<T>(): PersistStorage<T> {
  return {
    getItem: (name): StorageValue<T> | null => {
      if (!isBrowser()) return null;
      try {
        const raw = window.localStorage.getItem(name);
        if (!raw) return null;
        return JSON.parse(raw) as StorageValue<T>;
      } catch {
        return null;
      }
    },
    setItem: (name, value): void => {
      if (!isBrowser()) return;
      try {
        window.localStorage.setItem(name, JSON.stringify(value));
      } catch {
        // Ignore quota / serialization errors.
      }
    },
    removeItem: (name): void => {
      if (!isBrowser()) return;
      try {
        window.localStorage.removeItem(name);
      } catch {
        // Ignore.
      }
    },
  };
}
