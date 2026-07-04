/**
 * Runtime verification for the Calsuma math engine. Runs the *actual* TypeScript
 * source (via Node type-stripping) so behaviour is checked, not just types.
 *
 * Run:  node --import ./scripts/register-loader.mjs scripts/verify-math.ts
 */
import { evaluate, formatNumber } from '../src/lib/math/index';
import {
  negateTrailingNumber,
  endsWithOperator,
  canAppendDecimal,
} from '../src/utils/expression';

let passed = 0;
let failed = 0;

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b));
}

function expectValue(expr: string, want: number, opts?: { angleUnit?: 'deg' | 'rad' }): void {
  const res = evaluate(expr, opts);
  if (res.ok && approx(res.value, want)) {
    passed += 1;
  } else {
    failed += 1;
    console.error(`FAIL  ${expr}  => ${res.ok ? res.value : 'ERR:' + res.error} (want ${want})`);
  }
}

function expectError(expr: string): void {
  const res = evaluate(expr);
  if (!res.ok) {
    passed += 1;
  } else {
    failed += 1;
    console.error(`FAIL  ${expr}  => ${res.value} (wanted an error)`);
  }
}

function expectFormat(value: number, precision: number, want: string): void {
  const got = formatNumber(value, precision);
  if (got === want) {
    passed += 1;
  } else {
    failed += 1;
    console.error(`FAIL  formatNumber(${value}, ${precision}) => "${got}" (want "${want}")`);
  }
}

function expectEqual<T>(label: string, got: T, want: T): void {
  if (got === want) {
    passed += 1;
  } else {
    failed += 1;
    console.error(`FAIL  ${label} => ${String(got)} (want ${String(want)})`);
  }
}

// --- Arithmetic & precedence ---
expectValue('2 + 3 * 4', 14);
expectValue('(2 + 3) * 4', 20);
expectValue('2 ^ 3 ^ 2', 512); // right-associative
expectValue('10 / 4', 2.5);
expectValue('2 - -3', 5);
expectValue('-5 + 2', -3);
expectValue('-(3 + 4)', -7);
expectValue('2 * (3 + (4 - 1))', 12);
expectValue('7 mod 3', 1);
expectValue('2 ^ 10', 1024);

// --- Unicode operators (as produced by the UI) ---
expectValue('6 ÷ 2 × 3', 9);
expectValue('10 − 4 + 1', 7);

// --- Postfix ---
expectValue('5!', 120);
expectValue('0!', 1);
expectValue('50%', 0.5);
expectValue('200% + 1', 3);

// --- Functions (degrees by default) ---
expectValue('sin(30)', 0.5, { angleUnit: 'deg' });
expectValue('cos(60)', 0.5, { angleUnit: 'deg' });
expectValue('sin(0)', 0);
expectValue('sqrt(16)', 4);
expectValue('cbrt(27)', 3);
expectValue('log(1000)', 3);
expectValue('ln(e)', 1);
expectValue('abs(-9)', 9);
expectValue('exp(0)', 1);

// --- Radians ---
expectValue('sin(pi / 2)', 1, { angleUnit: 'rad' });
expectValue('cos(0)', 1, { angleUnit: 'rad' });

// --- Constants ---
expectValue('pi', Math.PI);
expectValue('2 * pi', Math.PI * 2);
expectValue('e', Math.E);

// --- Implicit x^2 / x^3 from the UI keys (append ^2 / ^3) ---
expectValue('5^2', 25);
expectValue('3^3', 27);

// --- Errors (graceful) ---
expectError('1 / 0');
expectError('5 mod 0');
expectError('sqrt(-4)');
expectError('log(0)');
expectError('(2 + 3'); // unbalanced
expectError('2 +'); // incomplete
expectError('asin(5)'); // domain
expectError('2 @ 3'); // unknown char

// --- Empty is zero ---
expectValue('', 0);

// --- Formatting ---
expectFormat(1234567, 10, '1,234,567');
expectFormat(0.1 + 0.2, 10, '0.3'); // float-noise cleaned
expectFormat(1 / 3, 6, '0.333333');
expectFormat(-42.5, 10, '-42.5');
expectFormat(0, 10, '0');
expectFormat(Infinity, 10, '∞');
expectFormat(NaN, 10, 'Error');
expectFormat(1000000, 10, '1,000,000');

// --- Expression helpers ---
expectEqual('negate 5', negateTrailingNumber('5'), '(-5)');
expectEqual('negate (-5)', negateTrailingNumber('(-5)'), '5');
expectEqual('negate 2+3', negateTrailingNumber('2+3'), '2+(-3)');
expectEqual('endsWithOperator 2+', endsWithOperator('2+'), true);
expectEqual('endsWithOperator 2+3', endsWithOperator('2+3'), false);
expectEqual('canAppendDecimal 12', canAppendDecimal('12'), true);
expectEqual('canAppendDecimal 12.5', canAppendDecimal('12.5'), false);

// --- Round-trip: evaluate a formatted chain the way the UI chains results ---
const chain = evaluate('2 + 3');
expectEqual('chain ok', chain.ok, true);
const chained = evaluate(`${chain.value} * 4`);
expectEqual('chain value', chained.ok && chained.value, 20);

console.log(`\nMath verification: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
