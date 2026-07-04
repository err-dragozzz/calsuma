'use client';

import { useCallback } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * Lightweight, asset-free sound engine using the Web Audio API. Synthesises a
 * short mechanical "click" for key presses and a soft two-note chime for power
 * on. No network requests, no audio files. Honours the sound setting.
 */

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!audioContext) audioContext = new Ctor();
    if (audioContext.state === 'suspended') void audioContext.resume();
    return audioContext;
  } catch {
    return null;
  }
}

interface ClickOptions {
  frequency?: number;
  duration?: number;
  gain?: number;
  type?: OscillatorType;
}

function tone(ctx: AudioContext, { frequency = 320, duration = 0.045, gain = 0.06, type = 'triangle' }: ClickOptions): void {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(60, frequency * 0.6), now + duration);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.005);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export interface SoundEngine {
  playClick: (variant?: 'key' | 'equals' | 'clear') => void;
  playPower: () => void;
}

export function useSound(): SoundEngine {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  const playClick = useCallback(
    (variant: 'key' | 'equals' | 'clear' = 'key') => {
      if (!soundEnabled) return;
      const ctx = getContext();
      if (!ctx) return;
      const presets: Record<typeof variant, ClickOptions> = {
        key: { frequency: 300, duration: 0.04, gain: 0.05 },
        equals: { frequency: 440, duration: 0.08, gain: 0.07 },
        clear: { frequency: 200, duration: 0.06, gain: 0.06 },
      };
      tone(ctx, presets[variant]);
    },
    [soundEnabled],
  );

  const playPower = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getContext();
    if (!ctx) return;
    tone(ctx, { frequency: 392, duration: 0.12, gain: 0.05, type: 'sine' });
    window.setTimeout(() => tone(ctx, { frequency: 587, duration: 0.16, gain: 0.05, type: 'sine' }), 110);
  }, [soundEnabled]);

  return { playClick, playPower };
}
