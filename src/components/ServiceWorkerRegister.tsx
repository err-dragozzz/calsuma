'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker in production for offline / installable PWA
 * support. Silently skips registration in development and where unsupported.
 */
export function ServiceWorkerRegister(): null {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    const register = (): void => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* Registration failures are non-fatal. */
      });
    };

    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });

    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
