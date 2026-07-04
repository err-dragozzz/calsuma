'use client';

import { useId } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Optional formatter for the value badge. */
  format?: (value: number) => string;
}

/**
 * Labelled range slider wrapping the native input for full accessibility and
 * keyboard support, with a live value badge.
 */
export function Slider({ label, value, min, max, step = 1, onChange, format }: SliderProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-[var(--panel-fg)]">
          {label}
        </label>
        <span className="rounded-md bg-[var(--segment-track)] px-2 py-0.5 text-xs font-semibold text-[var(--panel-fg)]">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="calsuma-range h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--segment-track)]"
        aria-valuetext={format ? format(value) : String(value)}
      />
    </div>
  );
}
