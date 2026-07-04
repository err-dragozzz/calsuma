'use client';

import { motion } from 'framer-motion';
import type { KeyDef } from '@/types';
import { useTilt } from '@/hooks/useTilt';
import { Display } from './Display';
import { Keypad } from './Keypad';

interface CalculatorProps {
  scientific: boolean;
  animate: boolean;
  /** Disable the pointer-tilt effect (touch devices / reduced motion). */
  tiltDisabled: boolean;
  booting: boolean;
  activeKeyId: string | null;
  onPress: (def: KeyDef) => void;
}

/** A small decorative grid of speaker holes. */
function SpeakerGrid() {
  return (
    <span className="calc-speaker" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span key={index} className="calc-speaker__hole" />
      ))}
    </span>
  );
}

/**
 * The physical calculator. A perspective stage hosts a multi-layer plastic body
 * that tilts gently toward the pointer and breathes when idle. Decorative
 * details (screws, speaker grille, engraved plate, rubber feet) sell the
 * realism; all interactive logic lives in the Display and Keypad children.
 */
export function Calculator({
  scientific,
  animate,
  tiltDisabled,
  booting,
  activeKeyId,
  onPress,
}: CalculatorProps) {
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = useTilt({
    max: 8,
    disabled: tiltDisabled,
  });

  return (
    <div
      className="calc-stage"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        className="calc-body"
        data-mode={scientific ? 'scientific' : 'classic'}
        style={tiltDisabled ? undefined : { rotateX, rotateY }}
      >
        <motion.div
          className="calc-body__inner"
          animate={animate && !booting ? { y: [0, -2.5, 0] } : { y: 0 }}
          transition={
            animate && !booting
              ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0 }
          }
        >
          <div className="calc-body__topbar">
            <span className="calc-screw calc-screw--tl" aria-hidden="true" />
            <span className="calc-screw calc-screw--tr" aria-hidden="true" />
            <div className="calc-brand">
              <span className="calc-brand__mark">calsuma</span>
              <span className="calc-brand__sub">electro · calc</span>
            </div>
            <div className="calc-topbar__right">
              <span className="calc-power-led" aria-hidden="true" />
              <SpeakerGrid />
            </div>
          </div>

          <Display booting={booting} />

          <Keypad
            scientific={scientific}
            animate={animate}
            activeKeyId={activeKeyId}
            onPress={onPress}
          />

          <div className="calc-body__footer">
            <span className="calc-screw calc-screw--bl" aria-hidden="true" />
            <span className="calc-engrave">MODEL CS·88 — SOLAR / LR44 — MADE FOR THE WEB</span>
            <span className="calc-screw calc-screw--br" aria-hidden="true" />
          </div>
        </motion.div>

        <span className="calc-foot calc-foot--l" aria-hidden="true" />
        <span className="calc-foot calc-foot--r" aria-hidden="true" />
      </motion.div>
      <div className="calc-contact-shadow" aria-hidden="true" />
    </div>
  );
}
