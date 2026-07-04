'use client';

import { useSettingsStore } from '@/store/settingsStore';
import { PRECISION_RANGE } from '@/constants/defaults';
import { Segmented } from '@/components/ui/Segmented';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';

/** Small titled grouping for a set of related controls. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-[var(--panel-border)] py-5 first:pt-0 last:border-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--panel-fg-muted)]">
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * The full settings surface. Every control is bound to the persisted settings
 * store, so changes take effect instantly and survive reloads.
 */
export function SettingsPanel() {
  const theme = useSettingsStore((s) => s.theme);
  const mode = useSettingsStore((s) => s.mode);
  const angleUnit = useSettingsStore((s) => s.angleUnit);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const precision = useSettingsStore((s) => s.precision);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);
  const highContrast = useSettingsStore((s) => s.highContrast);
  const autoHistory = useSettingsStore((s) => s.autoHistory);
  const setSetting = useSettingsStore((s) => s.setSetting);
  const reset = useSettingsStore((s) => s.reset);

  return (
    <div className="flex flex-col">
      <Section title="Appearance">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-[var(--panel-fg)]">Theme</span>
          <Segmented
            label="Theme"
            value={theme}
            onChange={(value) => setSetting('theme', value)}
            options={[
              { value: 'ivory', label: 'Ivory' },
              { value: 'graphite', label: 'Graphite' },
            ]}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-[var(--panel-fg)]">Font size</span>
          <Segmented
            label="Font size"
            value={fontSize}
            onChange={(value) => setSetting('fontSize', value)}
            options={[
              { value: 'small', label: 'S' },
              { value: 'medium', label: 'M' },
              { value: 'large', label: 'L' },
            ]}
          />
        </div>
        <Toggle
          label="High contrast"
          description="Boost contrast for readability."
          checked={highContrast}
          onChange={(value) => setSetting('highContrast', value)}
        />
      </Section>

      <Section title="Calculator">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-[var(--panel-fg)]">Mode</span>
          <Segmented
            label="Calculator mode"
            value={mode}
            onChange={(value) => setSetting('mode', value)}
            options={[
              { value: 'classic', label: 'Classic' },
              { value: 'scientific', label: 'Scientific' },
            ]}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-[var(--panel-fg)]">Angle unit</span>
          <Segmented
            label="Angle unit"
            value={angleUnit}
            onChange={(value) => setSetting('angleUnit', value)}
            options={[
              { value: 'deg', label: 'Deg' },
              { value: 'rad', label: 'Rad' },
            ]}
          />
        </div>
        <Slider
          label="Precision"
          value={precision}
          min={PRECISION_RANGE.min}
          max={PRECISION_RANGE.max}
          onChange={(value) => setSetting('precision', value)}
          format={(value) => `${value} sig figs`}
        />
        <Toggle
          label="Auto history"
          description="Save every calculation automatically."
          checked={autoHistory}
          onChange={(value) => setSetting('autoHistory', value)}
        />
      </Section>

      <Section title="Feedback">
        <Toggle
          label="Sound"
          description="Mechanical key clicks."
          checked={soundEnabled}
          onChange={(value) => setSetting('soundEnabled', value)}
        />
        <Toggle
          label="Animations"
          description="Tilt, press springs and transitions."
          checked={animationsEnabled}
          onChange={(value) => setSetting('animationsEnabled', value)}
        />
      </Section>

      <Section title="Reset">
        <button
          type="button"
          onClick={reset}
          className="self-start rounded-xl border border-[var(--panel-border)] bg-[var(--input-bg)] px-4 py-2 text-sm font-medium text-[var(--panel-fg)] transition-colors hover:bg-[var(--tool-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          Restore defaults
        </button>
      </Section>
    </div>
  );
}
