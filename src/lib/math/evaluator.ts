/**
 * RPN evaluator. Operates on the token stream produced by `toRPN`. All numeric
 * operations are performed with native JS math — there is no dynamic code
 * execution anywhere in this pipeline.
 */

import type { AngleUnit } from '@/types';
import type { Token } from './tokenizer';

export class EvaluateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EvaluateError';
  }
}

/** Guard against pathological factorial inputs. */
const MAX_FACTORIAL = 170;

function factorial(n: number): number {
  if (!Number.isFinite(n)) throw new EvaluateError('Invalid factorial input');
  if (n < 0) throw new EvaluateError('Factorial of a negative number');
  if (!Number.isInteger(n)) throw new EvaluateError('Factorial requires an integer');
  if (n > MAX_FACTORIAL) return Infinity;
  let acc = 1;
  for (let k = 2; k <= n; k += 1) acc *= k;
  return acc;
}

function toRadians(value: number, unit: AngleUnit): number {
  return unit === 'deg' ? (value * Math.PI) / 180 : value;
}

function fromRadians(value: number, unit: AngleUnit): number {
  return unit === 'deg' ? (value * 180) / Math.PI : value;
}

function applyFunction(name: string, x: number, angleUnit: AngleUnit): number {
  switch (name) {
    case 'sin':
      return Math.sin(toRadians(x, angleUnit));
    case 'cos':
      return Math.cos(toRadians(x, angleUnit));
    case 'tan':
      return Math.tan(toRadians(x, angleUnit));
    case 'asin':
      if (x < -1 || x > 1) throw new EvaluateError('asin domain is [-1, 1]');
      return fromRadians(Math.asin(x), angleUnit);
    case 'acos':
      if (x < -1 || x > 1) throw new EvaluateError('acos domain is [-1, 1]');
      return fromRadians(Math.acos(x), angleUnit);
    case 'atan':
      return fromRadians(Math.atan(x), angleUnit);
    case 'sinh':
      return Math.sinh(x);
    case 'cosh':
      return Math.cosh(x);
    case 'tanh':
      return Math.tanh(x);
    case 'log':
      if (x <= 0) throw new EvaluateError('log requires a positive number');
      return Math.log10(x);
    case 'ln':
      if (x <= 0) throw new EvaluateError('ln requires a positive number');
      return Math.log(x);
    case 'sqrt':
      if (x < 0) throw new EvaluateError('Cannot take the square root of a negative number');
      return Math.sqrt(x);
    case 'cbrt':
      return Math.cbrt(x);
    case 'exp':
      return Math.exp(x);
    case 'abs':
      return Math.abs(x);
    default:
      throw new EvaluateError(`Unknown function: "${name}"`);
  }
}

function constantValue(name: string): number {
  switch (name) {
    case 'pi':
      return Math.PI;
    case 'tau':
      return Math.PI * 2;
    case 'e':
      return Math.E;
    default:
      throw new EvaluateError(`Unknown constant: "${name}"`);
  }
}

export function evaluateRPN(rpn: Token[], angleUnit: AngleUnit): number {
  const stack: number[] = [];

  const pop = (): number => {
    const value = stack.pop();
    if (value === undefined) throw new EvaluateError('Incomplete expression');
    return value;
  };

  for (const token of rpn) {
    switch (token.type) {
      case 'number': {
        const value = Number(token.value);
        if (Number.isNaN(value)) throw new EvaluateError(`Invalid number: "${token.value}"`);
        stack.push(value);
        break;
      }
      case 'constant':
        stack.push(constantValue(token.value));
        break;
      case 'function':
        stack.push(applyFunction(token.value, pop(), angleUnit));
        break;
      case 'postfix': {
        const value = pop();
        stack.push(token.value === '!' ? factorial(value) : value / 100);
        break;
      }
      case 'operator': {
        if (token.value === 'neg') {
          stack.push(-pop());
          break;
        }
        const b = pop();
        const a = pop();
        switch (token.value) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            if (b === 0) throw new EvaluateError('Cannot divide by zero');
            stack.push(a / b);
            break;
          case 'mod':
            if (b === 0) throw new EvaluateError('Cannot take modulo by zero');
            stack.push(a % b);
            break;
          case '^':
            stack.push(Math.pow(a, b));
            break;
          default:
            throw new EvaluateError(`Unknown operator: "${token.value}"`);
        }
        break;
      }
      default:
        throw new EvaluateError(`Unexpected token in evaluation: "${token.value}"`);
    }
  }

  if (stack.length !== 1) throw new EvaluateError('Incomplete expression');
  const result = stack[0]!;
  if (Number.isNaN(result)) throw new EvaluateError('Result is not a number');
  return result;
}
