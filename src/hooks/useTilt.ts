'use client';

import { useCallback } from 'react';
import { useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';

export interface TiltResult {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

interface TiltOptions {
  /** Maximum tilt in degrees on each axis. */
  max?: number;
  /** Disable the effect entirely (reduced motion / touch / setting off). */
  disabled?: boolean;
}

/**
 * Subtle "tilt toward the cursor" effect built on spring physics. Pointer
 * position is normalised to [-1, 1] and mapped to a small rotation, giving the
 * calculator an expensive, tactile feel. Fully disabled when requested.
 */
export function useTilt({ max = 8, disabled = false }: TiltOptions = {}): TiltResult {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [max, -max]), springConfig);
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-max, max]), springConfig);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (disabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      pointerX.set(Math.max(-1, Math.min(1, px * 2 - 1)));
      pointerY.set(Math.max(-1, Math.min(1, py * 2 - 1)));
    },
    [disabled, pointerX, pointerY],
  );

  const onPointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return { rotateX, rotateY, onPointerMove, onPointerLeave };
}
