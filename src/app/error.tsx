'use client';

import { useEffect } from 'react';

/**
 * Route-level error boundary. Guarantees the app never shows a blank white
 * screen — any render error is caught and the user can recover in one click.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Calsuma error boundary:', error);
  }, [error]);

  return (
    <div
      role="alert"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Something went sideways</h1>
      <p style={{ maxWidth: '38ch', color: 'var(--surface-fg-muted)' }}>
        Calsuma hit an unexpected error. Your history and settings are safe.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          padding: '10px 20px',
          borderRadius: 12,
          border: '1px solid var(--tool-border)',
          background: 'var(--accent)',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  );
}
