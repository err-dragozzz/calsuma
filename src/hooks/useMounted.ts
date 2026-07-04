'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true only after the component has mounted on the client. Used to
 * gate rendering of values that differ between server and client (persisted
 * store data, media queries) and avoid hydration mismatches.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
