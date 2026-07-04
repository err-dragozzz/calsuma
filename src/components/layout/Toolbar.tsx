'use client';

import { useSettingsStore } from '@/store/settingsStore';
import { IconButton } from '@/components/ui/IconButton';
import {
  HistoryIcon,
  MoonIcon,
  SettingsIcon,
  SoundOffIcon,
  SoundOnIcon,
  SunIcon,
} from '@/components/icons';

interface ToolbarProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

/** Top application bar: branding on the left, quick controls on the right. */
export function Toolbar({ onOpenHistory, onOpenSettings }: ToolbarProps) {
  const theme = useSettingsStore((s) => s.theme);
  const mode = useSettingsStore((s) => s.mode);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const toggleMode = useSettingsStore((s) => s.toggleMode);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  return (
    <header className="flex w-full items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-lg font-semibold tracking-tight text-[var(--surface-fg)]">
          Calsuma
        </span>
        <span className="text-xs text-[var(--surface-fg-muted)]">Premium retro calculator</span>
      </div>

      <nav className="flex items-center gap-1.5" aria-label="Calculator controls">
        <button
          type="button"
          onClick={toggleMode}
          aria-pressed={mode === 'scientific'}
          className="h-10 rounded-xl border border-[var(--tool-border)] bg-[var(--tool-bg)] px-3 text-xs font-semibold text-[var(--tool-fg)] transition-colors hover:bg-[var(--tool-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
        >
          {mode === 'scientific' ? 'Scientific' : 'Classic'}
        </button>
        <IconButton
          label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          active={soundEnabled}
          aria-pressed={soundEnabled}
          onClick={toggleSound}
        >
          {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
        </IconButton>
        <IconButton
          label={theme === 'ivory' ? 'Switch to graphite theme' : 'Switch to ivory theme'}
          onClick={toggleTheme}
        >
          {theme === 'ivory' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
        <IconButton label="Open history" onClick={onOpenHistory}>
          <HistoryIcon />
        </IconButton>
        <IconButton label="Open settings" onClick={onOpenSettings}>
          <SettingsIcon />
        </IconButton>
      </nav>
    </header>
  );
}
