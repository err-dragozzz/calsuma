/**
 * Public surface of the Calsuma math engine. A single `evaluate` entry point
 * runs the full safe pipeline: tokenize → parse (RPN) → evaluate. It never
 * throws; failures are returned as a structured result.
 */

import type { AngleUnit, EvalResult } from '@/types';
import { tokenize } from './tokenizer';
import { toRPN } from './parser';
import { evaluateRPN } from './evaluator';

export { formatNumber, unformatNumber, clampPrecision } from './format';
export { normalizeExpression } from './tokenizer';

export interface EvaluateOptions {
  angleUnit?: AngleUnit;
}

/**
 * Safely evaluate a mathematical expression string.
 *
 * @example
 * evaluate('2 + 3 * 4') // => { ok: true, value: 14 }
 * evaluate('1 / 0')     // => { ok: false, error: 'Cannot divide by zero', value: NaN }
 */
export function evaluate(expression: string, options: EvaluateOptions = {}): EvalResult {
  const angleUnit = options.angleUnit ?? 'deg';
  const trimmed = expression.trim();

  if (trimmed.length === 0) {
    return { ok: true, value: 0 };
  }

  try {
    const tokens = tokenize(trimmed);
    if (tokens.length === 0) return { ok: true, value: 0 };
    const rpn = toRPN(tokens);
    const value = evaluateRPN(rpn, angleUnit);
    return { ok: true, value };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid expression';
    return { ok: false, value: Number.NaN, error: message };
  }
}

/** Returns true when an expression can be evaluated without error. */
export function isValidExpression(expression: string, options: EvaluateOptions = {}): boolean {
  return evaluate(expression, options).ok;
}
