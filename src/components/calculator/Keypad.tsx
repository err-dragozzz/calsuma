'use client';

import type { KeyDef } from '@/types';
import { CORE_KEYS, MEMORY_KEYS, SCIENTIFIC_KEYS } from '@/constants/keys';
import { Key } from './Key';

interface KeypadProps {
  scientific: boolean;
  animate: boolean;
  activeKeyId: string | null;
  onPress: (def: KeyDef) => void;
}

/**
 * Composes the three key regions: the memory strip, the scientific grid (only in
 * scientific mode) and the always-present core grid.
 */
export function Keypad({ scientific, animate, activeKeyId, onPress }: KeypadProps) {
  const render = (def: KeyDef) => (
    <Key
      key={def.id}
      def={def}
      onPress={onPress}
      animate={animate}
      pressed={activeKeyId === def.id}
    />
  );

  return (
    <div className="calc-keypad">
      <div className="calc-keypad__memory" role="group" aria-label="Memory functions">
        {MEMORY_KEYS.map(render)}
      </div>

      {scientific ? (
        <div className="calc-keypad__sci" role="group" aria-label="Scientific functions">
          {SCIENTIFIC_KEYS.map(render)}
        </div>
      ) : null}

      <div className="calc-keypad__core" role="group" aria-label="Number pad">
        {CORE_KEYS.map(render)}
      </div>
    </div>
  );
}
