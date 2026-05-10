import CryptoJS from 'crypto-js';

/**
 * Crypto utilities untuk encrypt/decrypt sensitive data.
 * Digunakan untuk:
 * - Lost Mode contact info (nomor HP, alamat)
 * - Finder messages (sebelum disimpan ke DB)
 * - Owner identity dalam mode "anonymous bridging"
 *
 * PENTING: Set CRYPTO_SECRET_KEY di .env.local
 * Generate dengan: openssl rand -base64 32
 */

const SECRET_KEY = process.env.CRYPTO_SECRET_KEY || 'mimoo-dev-fallback-key-change-me';

if (process.env.NODE_ENV === 'production' && !process.env.CRYPTO_SECRET_KEY) {
  throw new Error(
    '⚠️  CRYPTO_SECRET_KEY harus di-set di production! Tidak boleh pakai fallback.'
  );
}

/**
 * Encrypt string menggunakan AES.
 * @param plaintext - Data yang akan dienkripsi
 * @returns Encrypted string (base64)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return '';
  try {
    return CryptoJS.AES.encrypt(plaintext, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Gagal melakukan enkripsi data');
  }
}

/**
 * Decrypt string yang sudah dienkripsi.
 * @param ciphertext - Data terenkripsi
 * @returns Plaintext string
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Gagal melakukan dekripsi data');
  }
}

/**
 * Hash string (one-way) — untuk tag ID, lookup tokens, dll.
 * @param input - String yang akan di-hash
 * @returns SHA256 hash (hex)
 */
export function hash(input: string): string {
  return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}

/**
 * Generate random secure token untuk QR codes.
 * @param length - Panjang token (default 32)
 * @returns Random token string
 */
export function generateToken(length: number = 32): string {
  const wordArray = CryptoJS.lib.WordArray.random(length / 2);
  return wordArray.toString(CryptoJS.enc.Hex);
}

/**
 * Encrypt object → base64 JSON string.
 * Untuk kasus seperti lost mode contact info bundle.
 */
export function encryptObject<T extends Record<string, unknown>>(obj: T): string {
  return encrypt(JSON.stringify(obj));
}

/**
 * Decrypt back to object.
 */
export function decryptObject<T = Record<string, unknown>>(ciphertext: string): T {
  const decrypted = decrypt(ciphertext);
  return JSON.parse(decrypted) as T;
}
