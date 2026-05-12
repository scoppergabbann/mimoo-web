import { customAlphabet } from 'nanoid';

/**
 * Generator untuk recovery codes.
 * Format: 8 karakter, uppercase alphanumeric (no ambiguous chars).
 *
 * - Excludes: 0, O, I, 1, l (untuk readability)
 * - Length 8 gives ~1 in 200 billion collision probability
 */
const RECOVERY_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const RECOVERY_CODE_LENGTH = 8;

const generator = customAlphabet(RECOVERY_CODE_ALPHABET, RECOVERY_CODE_LENGTH);

export function generateRecoveryCode(): string {
  return generator();
}

/**
 * Validate recovery code format (untuk public URL).
 */
export function isValidRecoveryCode(code: string): boolean {
  if (code.length !== RECOVERY_CODE_LENGTH) return false;
  return /^[A-HJ-NP-Z2-9]+$/.test(code);
}
