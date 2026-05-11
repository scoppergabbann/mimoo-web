/**
 * Simple className merger.
 * Filter out undefined/null/false values dan join dengan space.
 *
 * Usage:
 *   cn('base-class', isActive && 'active', condition ? 'yes' : 'no')
 */
export function cn(
  ...classes: (string | undefined | null | false | 0 | 0n)[]
): string {
  return classes.filter(Boolean).join(' ');
}
