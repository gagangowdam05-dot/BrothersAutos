// Edge-compatible session management using Web Crypto API

export const ADMIN_COOKIE_NAME = 'brothers_admin_session';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

const FALLBACK_SECRET = 'brothers_autos_default_secure_session_salt_2025_98fa7e3b';

function getSecret(): string {
  return process.env.SESSION_SECRET || FALLBACK_SECRET;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Sign data string with HMAC-SHA256
 */
async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates a cryptographically signed session token.
 * Format: "<issuedAtTimestamp>.<signature>"
 */
export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  const issuedAt = Date.now().toString();
  const signature = await hmacSign(`admin:${issuedAt}`, secret);
  return `${issuedAt}.${signature}`;
}

/**
 * Verifies if a given session token is genuine, untampered, and unexpired.
 */
export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [issuedAtStr, signature] = parts;
  const issuedAt = parseInt(issuedAtStr, 10);
  if (isNaN(issuedAt)) return false;

  const now = Date.now();
  const maxAgeMs = SESSION_MAX_AGE_SECONDS * 1000;

  // Check expiration & future clock-skew tolerance (60s)
  if (now - issuedAt > maxAgeMs || issuedAt > now + 60000) {
    return false;
  }

  try {
    const secret = getSecret();
    const expectedSignature = await hmacSign(`admin:${issuedAtStr}`, secret);

    // Constant-time string comparison
    if (expectedSignature.length !== signature.length) return false;
    let diff = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      diff |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return diff === 0;
  } catch (err) {
    console.error('Session verification error:', err);
    return false;
  }
}

/**
 * Verifies submitted administrator password.
 */
export function verifyAdminPassword(password: string): boolean {
  const configuredPassword = process.env.ADMIN_PASSWORD || 'BrothersAdmin2025!';
  return Boolean(password) && password === configuredPassword;
}
