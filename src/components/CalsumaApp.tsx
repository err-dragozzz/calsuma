'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { HistoryEntry, KeyDef } from '@/types';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAnimationsEnabled } from '@/hooks/useAnimationsEnabled';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMounted } from '@/hooks/useMounted';
import { useSound } from '@/hooks/useSound';
import { Calculator } from '@/components/calculator/Calculator';
import { Toolbar } from '@/components/layout/Toolbar';
import { Sheet } from '@/components/ui/Sheet';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { SettingsPanel } from '@/components/settings/SettingsPanel';

type SoundVariant = 'key' | 'equals' | 'clear';

/**
 * Client root that assembles the whole experience: the boot sequence, keyboard
 * support, sound, key-press feedback, and the history / settings sheets. Kept as
 * the single stateful orchestrator so individual components stay presentational.
 */
export function CalsumaApp() {
  const mounted = useMounted();
  const mode = useSettingsStore((s) => s.mode);
  const dispatch = useCalculatorStore((s) => s.dispatch);
  const recallHistory = useCalculatorStore((s) => s.recallHistory);

  const animate = useAnimationsEnabled();
  const coarsePointer = useMediaQuery('(pointer: coarse)');
  const { playClick, playPower } = useSound();

  const [booting, setBooting] = useState(true);
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const flashTimer = useRef<number | null>(null);

  const flash = useCallback((id: string) => {
    setActiveKeyId(id);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setActiveKeyId(null), 130);
  }, []);

  const variantFor = (def: KeyDef): SoundVariant =>
    def.variant === 'equals' ? 'equals' : def.variant === 'action' ? 'clear' : 'key';

  const press = useCallback(
    (def: KeyDef) => {
      dispatch(def.action);
      playClick(variantFor(def));
      flash(def.id);
    },
    [dispatch, playClick, flash],
  );

  const handleKeyboardActivate = useCallback(
    (id: string, variant: SoundVariant) => {
      playClick(variant);
      flash(id);
    },
    [playClick, flash],
  );

  useKeyboard({ onActivate: handleKeyboardActivate });

  // Boot sequence: run once on mount.
  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 1100);
    playPower();
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
    },
    [],
  );

  const handleRecall = useCallback(
    (entry: HistoryEntry) => {
      recallHistory(entry);
      setHistoryOpen(false);
    },
    [recallHistory],
  );

  const tiltDisabled = !mounted || !animate || coarsePointer;

  return (
    <div className="calsuma-app">
      <div className="calsuma-app__frame">
        <Toolbar
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <main id="main" className="calsuma-app__main">
          <h1 className="sr-only">Calsuma — premium retro calculator</h1>
          <Calculator
            scientific={mode === 'scientific'}
            animate={animate}
            tiltDisabled={tiltDisabled}
            booting={mounted && booting}
            activeKeyId={activeKeyId}
            onPress={press}
          />
        </main>

        <footer className="calsuma-app__hint">
          <p>
            Type with your keyboard — digits, <kbd>+</kbd> <kbd>−</kbd> <kbd>×</kbd> <kbd>÷</kbd>,{' '}
            <kbd>Enter</kbd> to equal, <kbd>Esc</kbd> to clear, <kbd>⌫</kbd> to delete.
          </p>
        </footer>
      </div>

      <Sheet open={historyOpen} onClose={() => setHistoryOpen(false)} title="History">
        <HistoryPanel onRecall={handleRecall} />
      </Sheet>

      <Sheet open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
        <SettingsPanel />
      </Sheet>
    </div>
  );
}
