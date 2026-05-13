/**
 * Simple in-memory rate limiter.
 *
 * Untuk MVP, ini cukup. Catatannya:
 * - In-memory state reset saat server restart (gak persistent)
 * - Multi-server/Vercel serverless: state gak shared antar invocations
 * - Production-scale: upgrade ke Upstash Redis (lihat catatan di bawah)
 *
 * Cara upgrade ke Upstash nanti:
 * 1. npm install @upstash/ratelimit @upstash/redis
 * 2. Replace InMemoryStore dengan Redis-backed store
 * 3. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN di env
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class InMemoryStore {
  private store = new Map<string, RateLimitEntry>();
  private lastCleanup = Date.now();

  /**
   * Increment counter for key, return current state.
   * Auto-cleanup entries expired > 1 hour.
   */
  increment(key: string, windowMs: number): RateLimitEntry {
    const now = Date.now();

    // Periodic cleanup (max once per minute)
    if (now - this.lastCleanup > 60_000) {
      this.cleanup();
      this.lastCleanup = now;
    }

    const existing = this.store.get(key);

    if (!existing || existing.resetAt < now) {
      const entry: RateLimitEntry = {
        count: 1,
        resetAt: now + windowMs,
      };
      this.store.set(key, entry);
      return entry;
    }

    existing.count += 1;
    return existing;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt < now) {
        this.store.delete(key);
      }
    }
  }
}

const store = new InMemoryStore();

export interface RateLimitConfig {
  /** Number of allowed requests in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Prefix to namespace different rate limits */
  prefix: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for an identifier (typically IP hash + endpoint).
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `${config.prefix}:${identifier}`;
  const entry = store.increment(key, config.windowMs);

  return {
    allowed: entry.count <= config.limit,
    limit: config.limit,
    remaining: Math.max(0, config.limit - entry.count),
    resetAt: entry.resetAt,
  };
}

// === Pre-configured limiters ===

/**
 * Finder reports: 3 per IP per hour
 * Protects: spam submissions on public recovery pages
 */
export const FINDER_REPORT_LIMIT: RateLimitConfig = {
  prefix: 'finder_report',
  limit: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * Contact reveals: 5 per IP per hour
 * Protects: contact info scraping abuse
 */
export const CONTACT_REVEAL_LIMIT: RateLimitConfig = {
  prefix: 'contact_reveal',
  limit: 5,
  windowMs: 60 * 60 * 1000,
};

/**
 * Account registration: 5 per IP per day
 * Protects: bulk account creation
 */
export const REGISTRATION_LIMIT: RateLimitConfig = {
  prefix: 'register',
  limit: 5,
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Login attempts: 10 per IP per 15 minutes
 * Note: Supabase has its own rate limiting, this is supplementary
 */
export const LOGIN_LIMIT: RateLimitConfig = {
  prefix: 'login',
  limit: 10,
  windowMs: 15 * 60 * 1000, // 15 min
};

/**
 * Friendly error message untuk rate limit hit (Indonesian).
 */
export function getRateLimitMessage(resetAt: number): string {
  const secondsLeft = Math.ceil((resetAt - Date.now()) / 1000);
  const minutesLeft = Math.ceil(secondsLeft / 60);

  if (minutesLeft < 1) {
    return 'Terlalu cepat! Tunggu sebentar ya, lalu coba lagi.';
  }
  if (minutesLeft < 60) {
    return `Terlalu banyak permintaan. Coba lagi dalam ${minutesLeft} menit ya.`;
  }
  const hoursLeft = Math.ceil(minutesLeft / 60);
  return `Terlalu banyak permintaan. Coba lagi dalam ${hoursLeft} jam ya.`;
}
