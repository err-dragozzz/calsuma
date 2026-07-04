/**
 * Presentation helpers for the working expression string. These do not affect
 * evaluation — they only make the LCD read like a real calculator.
 */

/** Add thousands separators to every numeric literal inside an expression. */
export function groupExpression(expression: string): string {
  return expression.replace(/\d+(\.\d+)?/g, (match) => {
    const [intPart = '', fracPart] = match.split('.');
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return fracPart !== undefined ? `${grouped}.${fracPart}` : grouped;
  });
}

/**
 * Adds gentle spacing around binary operators for readability while leaving
 * function calls and unary signs compact.
 */
export function prettifyExpression(expression: string): string {
  const spaced = expression
    .replace(/\s*([+×÷])\s*/g, ' $1 ')
    .replace(/\s+mod\s+/g, ' mod ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return groupExpression(spaced);
}

/** True when the last meaningful character is a binary operator. */
export function endsWithOperator(expression: string): boolean {
  return /[+\-×÷*/^]\s*$/.test(expression.trimEnd()) || /\bmod\s*$/.test(expression.trimEnd());
}

/** True when appending a decimal point to the trailing number is valid. */
export function canAppendDecimal(expression: string): boolean {
  const trailingNumber = expression.match(/(\d*\.?\d*)$/)?.[0] ?? '';
  return !trailingNumber.includes('.');
}

/** Toggle the sign of the trailing numeric literal (reversible). */
export function negateTrailingNumber(expression: string): string {
  if (expression.length === 0) return '(-';
  const parenNeg = expression.match(/\(-(\d*\.?\d+)\)$/);
  if (parenNeg && parenNeg.index !== undefined) {
    return expression.slice(0, parenNeg.index) + parenNeg[1];
  }
  const num = expression.match(/(\d*\.?\d+)$/);
  if (num && num.index !== undefined) {
    return `${expression.slice(0, num.index)}(-${num[0]})`;
  }
  return expression;
}
