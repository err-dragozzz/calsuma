/**
 * Shunting-yard parser: converts an infix token stream into Reverse Polish
 * Notation (RPN), inserting an explicit `neg` operator for unary minus and
 * validating parenthesis balance. Never evaluates code.
 */

import type { Token } from './tokenizer';

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

interface OpInfo {
  precedence: number;
  /** 'L' = left associative, 'R' = right associative. */
  assoc: 'L' | 'R';
}

const BINARY_OPS: Record<string, OpInfo> = {
  '+': { precedence: 2, assoc: 'L' },
  '-': { precedence: 2, assoc: 'L' },
  '*': { precedence: 3, assoc: 'L' },
  '/': { precedence: 3, assoc: 'L' },
  mod: { precedence: 3, assoc: 'L' },
  '^': { precedence: 5, assoc: 'R' },
};

/** Unary minus precedence (binds tighter than ^ on its right operand). */
const UNARY_PRECEDENCE = 4;

type StackItem =
  | { kind: 'op'; value: string }
  | { kind: 'unary' }
  | { kind: 'func'; value: string }
  | { kind: 'lparen' };

/**
 * Determines whether the previous token means the next `-`/`+` is unary.
 * A unary sign occurs at the start, after another operator, after `(`, or
 * after a function.
 */
function expectsOperand(prev: Token | undefined): boolean {
  if (!prev) return true;
  return prev.type === 'operator' || prev.type === 'lparen' || prev.type === 'function';
}

export function toRPN(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const stack: StackItem[] = [];

  const popWhile = (predicate: (top: StackItem) => boolean): void => {
    while (stack.length > 0 && predicate(stack[stack.length - 1]!)) {
      const top = stack.pop()!;
      if (top.kind === 'op') output.push({ type: 'operator', value: top.value });
      else if (top.kind === 'unary') output.push({ type: 'operator', value: 'neg' });
      else if (top.kind === 'func') output.push({ type: 'function', value: top.value });
    }
  };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]!;
    const prev = tokens[index - 1];

    switch (token.type) {
      case 'number':
      case 'constant':
        output.push(token);
        break;

      case 'function':
        stack.push({ kind: 'func', value: token.value });
        break;

      case 'postfix':
        // Postfix operators bind immediately to the operand already emitted.
        output.push({ type: 'postfix', value: token.value });
        break;

      case 'operator': {
        if ((token.value === '-' || token.value === '+') && expectsOperand(prev)) {
          // Unary sign. Unary plus is a no-op and can be skipped.
          if (token.value === '-') {
            popWhile((top) => top.kind === 'unary');
            stack.push({ kind: 'unary' });
          }
          break;
        }
        const info = BINARY_OPS[token.value];
        if (!info) throw new ParseError(`Unknown operator: "${token.value}"`);
        popWhile((top) => {
          if (top.kind === 'func' || top.kind === 'unary') {
            const topPrec = top.kind === 'unary' ? UNARY_PRECEDENCE : 6;
            return topPrec >= info.precedence;
          }
          if (top.kind === 'op') {
            const topInfo = BINARY_OPS[top.value]!;
            return (
              topInfo.precedence > info.precedence ||
              (topInfo.precedence === info.precedence && info.assoc === 'L')
            );
          }
          return false;
        });
        stack.push({ kind: 'op', value: token.value });
        break;
      }

      case 'lparen':
        stack.push({ kind: 'lparen' });
        break;

      case 'rparen': {
        let foundParen = false;
        while (stack.length > 0) {
          const top = stack.pop()!;
          if (top.kind === 'lparen') {
            foundParen = true;
            break;
          }
          if (top.kind === 'op') output.push({ type: 'operator', value: top.value });
          else if (top.kind === 'unary') output.push({ type: 'operator', value: 'neg' });
          else if (top.kind === 'func') output.push({ type: 'function', value: top.value });
        }
        if (!foundParen) throw new ParseError('Mismatched parentheses');
        // If a function directly precedes the just-closed group, emit it.
        const top = stack[stack.length - 1];
        if (top && top.kind === 'func') {
          stack.pop();
          output.push({ type: 'function', value: top.value });
        }
        break;
      }

      default:
        throw new ParseError(`Unexpected token: "${token.value}"`);
    }
  }

  while (stack.length > 0) {
    const top = stack.pop()!;
    if (top.kind === 'lparen') throw new ParseError('Mismatched parentheses');
    if (top.kind === 'op') output.push({ type: 'operator', value: top.value });
    else if (top.kind === 'unary') output.push({ type: 'operator', value: 'neg' });
    else if (top.kind === 'func') output.push({ type: 'function', value: top.value });
  }

  return output;
}
