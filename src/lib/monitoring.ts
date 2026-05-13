/**
 * Error tracking wrapper.
 *
 * Untuk MVP: just console.error.
 * Untuk production: install @sentry/nextjs dan ganti implementation.
 *
 * Cara setup Sentry nanti:
 * 1. npm install @sentry/nextjs
 * 2. npx @sentry/wizard@latest -i nextjs
 * 3. Ganti `captureException` di sini dengan Sentry.captureException
 * 4. Set SENTRY_DSN di env vars
 *
 * Free tier Sentry: 5K errors/month + 50 user sessions
 */

interface ErrorContext {
  /** User ID kalau ada (jangan PII!) */
  userId?: string;
  /** Tags untuk grouping/filtering */
  tags?: Record<string, string>;
  /** Extra context */
  extra?: Record<string, unknown>;
}

/**
 * Track non-fatal error (caught exception).
 * Replaces basic `console.error` with structured logging.
 */
export function trackError(error: unknown, context?: ErrorContext): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  // Development: full console output
  if (process.env.NODE_ENV === 'development') {
    console.error('[trackError]', errorObj, context);
    return;
  }

  // Production: structured log (ready for Sentry/Logtail/etc)
  console.error(
    JSON.stringify({
      level: 'error',
      message: errorObj.message,
      stack: errorObj.stack,
      timestamp: new Date().toISOString(),
      ...context,
    })
  );

  // TODO: Replace with Sentry call when installed:
  // import * as Sentry from '@sentry/nextjs';
  // Sentry.captureException(errorObj, { tags: context?.tags, extra: context?.extra });
}

/**
 * Track event (analytics-style logging).
 * Berguna untuk track conversion funnel, feature usage.
 */
export function trackEvent(
  name: string,
  properties?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[event]', name, properties);
    return;
  }

  // Production structured log
  console.log(
    JSON.stringify({
      level: 'info',
      event: name,
      timestamp: new Date().toISOString(),
      ...properties,
    })
  );

  // TODO: Send to analytics service (Plausible, PostHog, etc)
}

/**
 * Set user context for subsequent error reports.
 * NEVER include PII (email, phone)!
 */
export function setUserContext(userId: string | null): void {
  // For future Sentry integration:
  // import * as Sentry from '@sentry/nextjs';
  // Sentry.setUser(userId ? { id: userId } : null);

  if (process.env.NODE_ENV === 'development') {
    console.log('[user context]', userId);
  }
}
