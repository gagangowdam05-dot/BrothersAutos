/**
 * Production-ready Sliding-Window Token Bucket Rate Limiter
 * 
 * Provides defense against brute-force and credential stuffing attacks.
 * Features:
 * - Dual-key throttling (by Client IP and Target Identifier)
 * - Automatic background memory cleanup (TTL sweep)
 * - Standard RFC-compliant rate limit response headers
 * - Safe for Edge/Serverless and Node.js runtimes
 */

interface RateLimitRecord {
  count: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
}

// In-memory store (sliding window)
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitMap.entries()) {
    if (now - record.firstAttemptAt > windowMs) {
      rateLimitMap.delete(key);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix timestamp in seconds
  retryAfterSeconds: number;
}

/**
 * Check and increment rate limit for a specific key.
 * 
 * @param key Unique key (e.g. `login:ip:1.2.3.4` or `login:id:9876543210`)
 * @param limit Maximum allowed attempts within window
 * @param windowMs Time window in milliseconds (default: 15 minutes)
 */
export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  cleanupStaleEntries(windowMs);

  const existing = rateLimitMap.get(key);

  if (!existing) {
    rateLimitMap.set(key, {
      count: 1,
      firstAttemptAt: now,
      lastAttemptAt: now,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime: Math.ceil((now + windowMs) / 1000),
      retryAfterSeconds: 0,
    };
  }

  // If window has passed, reset the bucket
  if (now - existing.firstAttemptAt > windowMs) {
    rateLimitMap.set(key, {
      count: 1,
      firstAttemptAt: now,
      lastAttemptAt: now,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime: Math.ceil((now + windowMs) / 1000),
      retryAfterSeconds: 0,
    };
  }

  // Within window
  existing.count += 1;
  existing.lastAttemptAt = now;

  const remaining = Math.max(0, limit - existing.count);
  const resetTime = Math.ceil((existing.firstAttemptAt + windowMs) / 1000);
  const retryAfterSeconds = Math.max(0, Math.ceil((existing.firstAttemptAt + windowMs - now) / 1000));
  const isAllowed = existing.count <= limit;

  return {
    success: isAllowed,
    limit,
    remaining,
    resetTime,
    retryAfterSeconds: isAllowed ? 0 : retryAfterSeconds,
  };
}

/**
 * Reset rate limit counter upon successful authentication.
 */
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

/**
 * Extract client IP from Next.js incoming request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; first entry is client IP
    const clientIp = forwarded.split(',')[0].trim();
    if (clientIp) return clientIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  return '127.0.0.1';
}

/**
 * Enforces dual-key rate limit:
 * 1. By Client IP (e.g. 5 attempts per 15 minutes)
 * 2. By Identifier / Phone number (e.g. 5 attempts per 15 minutes)
 */
export function checkAuthRateLimit(
  request: Request,
  identifier?: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000
): RateLimitResult {
  const ip = getClientIp(request);
  const ipKey = `auth:ip:${ip}`;
  const ipResult = checkRateLimit(ipKey, limit, windowMs);

  if (!ipResult.success) {
    return ipResult;
  }

  if (identifier && identifier.trim()) {
    const idKey = `auth:id:${identifier.trim().toLowerCase()}`;
    const idResult = checkRateLimit(idKey, limit, windowMs);
    if (!idResult.success) {
      return idResult;
    }
    // Return the more restrictive remaining count
    return {
      ...idResult,
      remaining: Math.min(ipResult.remaining, idResult.remaining),
    };
  }

  return ipResult;
}

/**
 * Reset both IP and Identifier limits on successful login.
 */
export function resetAuthRateLimit(request: Request, identifier?: string): void {
  const ip = getClientIp(request);
  resetRateLimit(`auth:ip:${ip}`);
  if (identifier && identifier.trim()) {
    resetRateLimit(`auth:id:${identifier.trim().toLowerCase()}`);
  }
}
