'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { KeyDef } from '@/types';
import { cn } from '@/utils/cn';

interface KeyProps {
  def: KeyDef;
  onPress: (def: KeyDef) => void;
  /** True briefly when the matching keyboard key is pressed (for feedback). */
  pressed?: boolean;
  animate?: boolean;
}

/**
 * A single physical calculator key. The layered 3D appearance is produced in
 * CSS (see globals.css `.calc-key`); Framer Motion owns the transform so the
 * press has real spring physics. When animations are disabled it degrades to a
 * plain button with CSS `:active` feedback.
 */
function KeyComponent({ def, onPress, pressed = false, animate = true }: KeyProps) {
  const shared = {
    type: 'button' as const,
    'data-variant': def.variant,
    'data-active': pressed ? 'true' : undefined,
    'aria-label': def.aria,
    onClick: () => onPress(def),
    className: cn('calc-key', def.span === 2 && 'calc-key--wide'),
  };

  const content = (
    <span className="calc-key__cap">
      <span className="calc-key__label">{def.label}</span>
    </span>
  );

  if (!animate) {
    return (
      <button {...shared} className={cn(shared.className, 'calc-key--static')}>
        {content}
      </button>
    );
  }

  return (
    <motion.button
      {...shared}
      whileHover={{ y: -1.5 }}
      whileTap={{ y: 2.5, scale: 0.975 }}
      animate={pressed ? { y: 2.5, scale: 0.975 } : { y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 700, damping: 22, mass: 0.5 }}
    >
      {content}
    </motion.button>
  );
}

export const Key = memo(KeyComponent);
