/**
 * Tokenizer for the Calsuma safe math parser.
 *
 * Converts a raw expression string into a flat list of tokens. It performs no
 * evaluation and never uses `eval` / `Function`, so it is safe against code
 * injection. Unknown characters raise a descriptive error.
 */

export type TokenType =
  | 'number'
  | 'operator'
  | 'function'
  | 'constant'
  | 'lparen'
  | 'rparen'
  | 'postfix';

export interface Token {
  type: TokenType;
  value: string;
}

/** Binary operators supported by the parser. */
export const OPERATORS = new Set(['+', '-', '*', '/', '^', 'mod']);

/** Unary functions supported by the parser. */
export const FUNCTIONS = new Set([
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'sinh',
  'cosh',
  'tanh',
  'log',
  'ln',
  'sqrt',
  'cbrt',
  'exp',
  'abs',
]);

/** Named constants. */
export const CONSTANTS = new Set(['pi', 'e']);

/** Postfix operators (applied to the value on their left). */
export const POSTFIX = new Set(['!', '%']);

const WORD_ALIASES: Record<string, string> = {
  π: 'pi',
  '√': 'sqrt',
  '∛': 'cbrt',
  τ: 'tau',
};

/**
 * Normalises a raw display expression into a token-friendly ASCII string.
 * Handles unicode operators (×, ÷, −) and glyph aliases (π, √).
 */
export function normalizeExpression(input: string): string {
  return input
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, ' pi ')
    .replace(/τ/g, ' tau ')
    .replace(/√/g, ' sqrt ')
    .replace(/∛/g, ' cbrt ')
    .replace(/\s+/g, ' ')
    .trim();
}

export class TokenizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenizeError';
  }
}

const isDigit = (c: string): boolean => c >= '0' && c <= '9';
const isLetter = (c: string): boolean => /[a-zπτ√∛]/i.test(c);

export function tokenize(rawInput: string): Token[] {
  const input = normalizeExpression(rawInput);
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i]!;

    if (char === ' ') {
      i += 1;
      continue;
    }

    // Numbers: integer, decimal and scientific notation (1.2e-3).
    if (isDigit(char) || (char === '.' && isDigit(input[i + 1] ?? ''))) {
      let num = '';
      let seenDot = false;
      let seenExp = false;
      while (i < input.length) {
        const c = input[i]!;
        if (isDigit(c)) {
          num += c;
          i += 1;
        } else if (c === '.' && !seenDot && !seenExp) {
          seenDot = true;
          num += c;
          i += 1;
        } else if ((c === 'e' || c === 'E') && !seenExp && num.length > 0) {
          // Only treat as exponent if followed by digits or a signed digit.
          const next = input[i + 1];
          const nextNext = input[i + 2];
          const validExp =
            (next && isDigit(next)) ||
            ((next === '+' || next === '-') && nextNext && isDigit(nextNext));
          if (!validExp) break;
          seenExp = true;
          num += 'e';
          i += 1;
          if (input[i] === '+' || input[i] === '-') {
            num += input[i];
            i += 1;
          }
        } else {
          break;
        }
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    // Words: functions, constants and word-operators (mod).
    if (isLetter(char)) {
      let word = '';
      while (i < input.length && isLetter(input[i]!)) {
        word += input[i];
        i += 1;
      }
      const normalized = (WORD_ALIASES[word] ?? word).toLowerCase();
      if (normalized === 'mod') {
        tokens.push({ type: 'operator', value: 'mod' });
      } else if (FUNCTIONS.has(normalized)) {
        tokens.push({ type: 'function', value: normalized });
      } else if (CONSTANTS.has(normalized) || normalized === 'tau') {
        tokens.push({ type: 'constant', value: normalized });
      } else {
        throw new TokenizeError(`Unknown symbol: "${word}"`);
      }
      continue;
    }

    switch (char) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '^':
        tokens.push({ type: 'operator', value: char });
        i += 1;
        break;
      case '(':
        tokens.push({ type: 'lparen', value: '(' });
        i += 1;
        break;
      case ')':
        tokens.push({ type: 'rparen', value: ')' });
        i += 1;
        break;
      case '!':
      case '%':
        tokens.push({ type: 'postfix', value: char });
        i += 1;
        break;
      default:
        throw new TokenizeError(`Unexpected character: "${char}"`);
    }
  }

  return tokens;
}
