/**
 * Number formatting utilities. Produces calculator-style output with thousands
 * grouping, configurable significant-digit precision, and automatic exponential
 * notation for very large or very small magnitudes.
 */

const MAX_MAGNITUDE = 1e15;
const MIN_MAGNITUDE = 1e-9;

/** Clamp precision to a sane, supported range. */
export function clampPrecision(precision: number): number {
  if (!Number.isFinite(precision)) return 10;
  return Math.min(14, Math.max(1, Math.round(precision)));
}

/** Insert thousands separators into the integer part of a decimal string. */
function groupThousands(numberString: string): string {
  const negative = numberString.startsWith('-');
  const unsigned = negative ? numberString.slice(1) : numberString;
  const [intPart = '0', fracPart] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = fracPart !== undefined ? `${grouped}.${fracPart}` : grouped;
  return negative ? `-${body}` : body;
}

/**
 * Formats a finite number for the LCD. Returns 'Error' for NaN and an infinity
 * glyph for non-finite values so callers can display them safely.
 */
export function formatNumber(value: number, precision = 10): string {
  if (Number.isNaN(value)) return 'Error';
  if (!Number.isFinite(value)) return value > 0 ? '∞' : '−∞';

  const sig = clampPrecision(precision);

  if (value === 0) return '0';

  const magnitude = Math.abs(value);

  // Use exponential notation for extreme magnitudes.
  if (magnitude >= MAX_MAGNITUDE || magnitude < MIN_MAGNITUDE) {
    return value
      .toExponential(Math.min(sig, 10))
      .replace(/\.?0+e/, 'e')
      .replace('e', 'e');
  }

  // Round to the requested number of significant digits, then trim.
  const rounded = Number(value.toPrecision(sig));
  let out = rounded.toString();

  if (out.includes('e') || out.includes('E')) {
    out = rounded.toFixed(Math.max(0, sig));
  }

  // Trim trailing zeros in the fractional part.
  if (out.includes('.')) {
    out = out.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  }

  return groupThousands(out);
}

/** Strip grouping so a formatted result can be reused as raw input. */
export function unformatNumber(display: string): string {
  return display.replace(/,/g, '');
}
