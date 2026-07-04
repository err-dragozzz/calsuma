/**
 * Shared application types for Calsuma.
 */

export type CalculatorMode = 'classic' | 'scientific';

export type ThemeName = 'ivory' | 'graphite';

export type AngleUnit = 'deg' | 'rad';

export type FontSize = 'small' | 'medium' | 'large';

/** A single evaluated calculation stored in history. */
export interface HistoryEntry {
  id: string;
  /** The human-readable expression that was evaluated. */
  expression: string;
  /** The formatted result string. */
  result: string;
  /** Raw numeric result, used for reuse/copy. */
  value: number;
  /** Epoch milliseconds when the calculation was made. */
  timestamp: number;
  /** Whether the user has pinned this entry. */
  pinned: boolean;
}

/** Persisted user settings. */
export interface Settings {
  theme: ThemeName;
  mode: CalculatorMode;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  highContrast: boolean;
  fontSize: FontSize;
  /** Number of significant digits used when formatting results (1–14). */
  precision: number;
  angleUnit: AngleUnit;
  /** When true, every evaluation is written to history automatically. */
  autoHistory: boolean;
}

/** The category of a keypad key, used for styling and behaviour. */
export type KeyVariant = 'digit' | 'operator' | 'function' | 'memory' | 'action' | 'equals';

/** A logical action produced by pressing a key or a keyboard shortcut. */
export type CalcAction =
  | { type: 'input'; value: string }
  | { type: 'clearAll' }
  | { type: 'clearEntry' }
  | { type: 'delete' }
  | { type: 'evaluate' }
  | { type: 'negate' }
  | { type: 'percent' }
  | { type: 'random' }
  | { type: 'memory'; op: 'MC' | 'MR' | 'MS' | 'M+' | 'M-' };

/** Definition of a single keypad key. */
export interface KeyDef {
  /** Stable identifier. */
  id: string;
  /** Visible label (may contain unicode glyphs). */
  label: string;
  /** Accessible name announced to screen readers. */
  aria: string;
  variant: KeyVariant;
  action: CalcAction;
  /** Keyboard keys (event.key values) that trigger this key. */
  keys?: string[];
  /** Only shown in scientific mode when true. */
  scientificOnly?: boolean;
  /** Optional grid column span. */
  span?: 1 | 2;
}

/** Result of evaluating an expression. */
export interface EvalResult {
  ok: boolean;
  value: number;
  /** Present when ok is false. */
  error?: string;
}
