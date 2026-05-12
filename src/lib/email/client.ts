import { Resend } from 'resend';

/**
 * Resend client — lazy initialized.
 * Kalau RESEND_API_KEY gak di-set, return null (email akan di-skip).
 *
 * Pattern ini biar dev tanpa Resend setup masih bisa develop tanpa error.
 */
let resendInstance: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/**
 * Email config — fallback ke Resend's testing domain kalau gak di-set
 */
export function getEmailConfig() {
  return {
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    fromName: process.env.EMAIL_FROM_NAME || 'Mimoo',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  };
}

/**
 * Format From header dengan nama (kayak "Mimoo <hello@mimoo.id>")
 */
export function formatFrom(): string {
  const { from, fromName } = getEmailConfig();
  return `${fromName} <${from}>`;
}
