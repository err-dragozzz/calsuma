/**
 * Tiny className combiner. Filters out falsy values and joins with spaces.
 * Avoids pulling in an extra dependency for such a small utility.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
