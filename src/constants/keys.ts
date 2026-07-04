import type { KeyDef } from '@/types';

/**
 * Memory row keys (MC / MR / MS / M+ / M-). Rendered as a slim strip above the
 * main keypad.
 */
export const MEMORY_KEYS: KeyDef[] = [
  { id: 'mc', label: 'MC', aria: 'Memory clear', variant: 'memory', action: { type: 'memory', op: 'MC' } },
  { id: 'mr', label: 'MR', aria: 'Memory recall', variant: 'memory', action: { type: 'memory', op: 'MR' } },
  { id: 'ms', label: 'MS', aria: 'Memory store', variant: 'memory', action: { type: 'memory', op: 'MS' } },
  { id: 'mplus', label: 'M+', aria: 'Memory add', variant: 'memory', action: { type: 'memory', op: 'M+' } },
  { id: 'mminus', label: 'M−', aria: 'Memory subtract', variant: 'memory', action: { type: 'memory', op: 'M-' } },
];

/**
 * Scientific keypad, shown only in scientific mode. Function keys open a
 * parenthesis so the argument can be typed naturally.
 */
export const SCIENTIFIC_KEYS: KeyDef[] = [
  { id: 'sin', label: 'sin', aria: 'sine', variant: 'function', action: { type: 'input', value: 'sin(' } },
  { id: 'cos', label: 'cos', aria: 'cosine', variant: 'function', action: { type: 'input', value: 'cos(' } },
  { id: 'tan', label: 'tan', aria: 'tangent', variant: 'function', action: { type: 'input', value: 'tan(' } },
  { id: 'pi', label: 'π', aria: 'pi', variant: 'function', action: { type: 'input', value: 'π' } },

  { id: 'ln', label: 'ln', aria: 'natural logarithm', variant: 'function', action: { type: 'input', value: 'ln(' } },
  { id: 'log', label: 'log', aria: 'base 10 logarithm', variant: 'function', action: { type: 'input', value: 'log(' } },
  { id: 'sqrt', label: '√', aria: 'square root', variant: 'function', action: { type: 'input', value: 'sqrt(' } },
  { id: 'euler', label: 'e', aria: "Euler's number", variant: 'function', action: { type: 'input', value: 'e' } },

  { id: 'square', label: 'x²', aria: 'x squared', variant: 'function', action: { type: 'input', value: '^2' } },
  { id: 'cube', label: 'x³', aria: 'x cubed', variant: 'function', action: { type: 'input', value: '^3' } },
  { id: 'pow', label: 'xʸ', aria: 'x to the power of y', variant: 'function', action: { type: 'input', value: '^' }, keys: ['^'] },
  { id: 'fact', label: 'n!', aria: 'factorial', variant: 'function', action: { type: 'input', value: '!' }, keys: ['!'] },

  { id: 'lparen', label: '(', aria: 'open parenthesis', variant: 'function', action: { type: 'input', value: '(' }, keys: ['('] },
  { id: 'rparen', label: ')', aria: 'close parenthesis', variant: 'function', action: { type: 'input', value: ')' }, keys: [')'] },
  { id: 'mod', label: 'mod', aria: 'modulo', variant: 'function', action: { type: 'input', value: ' mod ' } },
  { id: 'rand', label: 'rand', aria: 'random number', variant: 'function', action: { type: 'random' } },
];

/**
 * Core keypad, always visible. 4 columns × 5 rows.
 */
export const CORE_KEYS: KeyDef[] = [
  { id: 'ac', label: 'AC', aria: 'All clear', variant: 'action', action: { type: 'clearAll' }, keys: ['Escape'] },
  { id: 'ce', label: 'CE', aria: 'Clear entry', variant: 'action', action: { type: 'clearEntry' }, keys: ['Delete'] },
  { id: 'percent', label: '%', aria: 'percent', variant: 'action', action: { type: 'input', value: '%' }, keys: ['%'] },
  { id: 'divide', label: '÷', aria: 'divide', variant: 'operator', action: { type: 'input', value: '÷' }, keys: ['/'] },

  { id: 'seven', label: '7', aria: 'seven', variant: 'digit', action: { type: 'input', value: '7' }, keys: ['7'] },
  { id: 'eight', label: '8', aria: 'eight', variant: 'digit', action: { type: 'input', value: '8' }, keys: ['8'] },
  { id: 'nine', label: '9', aria: 'nine', variant: 'digit', action: { type: 'input', value: '9' }, keys: ['9'] },
  { id: 'multiply', label: '×', aria: 'multiply', variant: 'operator', action: { type: 'input', value: '×' }, keys: ['*'] },

  { id: 'four', label: '4', aria: 'four', variant: 'digit', action: { type: 'input', value: '4' }, keys: ['4'] },
  { id: 'five', label: '5', aria: 'five', variant: 'digit', action: { type: 'input', value: '5' }, keys: ['5'] },
  { id: 'six', label: '6', aria: 'six', variant: 'digit', action: { type: 'input', value: '6' }, keys: ['6'] },
  { id: 'subtract', label: '−', aria: 'minus', variant: 'operator', action: { type: 'input', value: '−' }, keys: ['-'] },

  { id: 'one', label: '1', aria: 'one', variant: 'digit', action: { type: 'input', value: '1' }, keys: ['1'] },
  { id: 'two', label: '2', aria: 'two', variant: 'digit', action: { type: 'input', value: '2' }, keys: ['2'] },
  { id: 'three', label: '3', aria: 'three', variant: 'digit', action: { type: 'input', value: '3' }, keys: ['3'] },
  { id: 'add', label: '+', aria: 'plus', variant: 'operator', action: { type: 'input', value: '+' }, keys: ['+'] },

  { id: 'negate', label: '±', aria: 'toggle sign', variant: 'action', action: { type: 'negate' } },
  { id: 'zero', label: '0', aria: 'zero', variant: 'digit', action: { type: 'input', value: '0' }, keys: ['0'] },
  { id: 'decimal', label: '.', aria: 'decimal point', variant: 'digit', action: { type: 'input', value: '.' }, keys: ['.'] },
  { id: 'equals', label: '=', aria: 'equals', variant: 'equals', action: { type: 'evaluate' }, keys: ['=', 'Enter'] },
];

/** All keys with keyboard bindings, used to build a fast lookup map. */
export const ALL_KEYS: KeyDef[] = [...MEMORY_KEYS, ...SCIENTIFIC_KEYS, ...CORE_KEYS];
