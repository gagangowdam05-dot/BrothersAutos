// Edge-compatible session management using Web Crypto API

export const ADMIN_COOKIE_NAME = 'brothers_admin_session';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

const FALLBACK_SECRET = 'brothers_autos_default_secure_session_salt_2025_98fa7e3b';

export interface DealerSession {
  dealerId: string;
  name: string;
  phone: string;
  role: 'ADMIN' | 'DEALER';
  issuedAt: number;
}

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

function toBase64(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64url');
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64(b64: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64, 'base64url').toString('utf-8');
  }
  let base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return atob(base64);
}

/**
 * Creates a cryptographically signed multi-tenant session token.
 * Format: "<base64UrlPayload>.<signature>"
 */
export async function createSessionToken(
  sessionData?: Partial<Omit<DealerSession, 'issuedAt'>>
): Promise<string> {
  const secret = getSecret();
  const payload: DealerSession = {
    dealerId: sessionData?.dealerId || 'admin',
    name: sessionData?.name || 'Administrator',
    phone: sessionData?.phone || '9876543210',
    role: sessionData?.role || 'ADMIN',
    issuedAt: Date.now(),
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = toBase64(payloadString);
  const signature = await hmacSign(payloadBase64, secret);
  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies if a given session token is genuine, untampered, and unexpired.
 * Returns decoded DealerSession or null.
 */
export async function verifySessionToken(
  token?: string | null
): Promise<DealerSession | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadPart, signature] = parts;
  const secret = getSecret();

  try {
    // Check if legacy format "<timestamp>.<signature>"
    if (/^\d+$/.test(payloadPart)) {
      const issuedAt = parseInt(payloadPart, 10);
      if (isNaN(issuedAt)) return null;

      const now = Date.now();
      const maxAgeMs = SESSION_MAX_AGE_SECONDS * 1000;
      if (now - issuedAt > maxAgeMs || issuedAt > now + 60000) return null;

      const expectedSignature = await hmacSign(`admin:${payloadPart}`, secret);
      if (expectedSignature.length !== signature.length) return null;
      let diff = 0;
      for (let i = 0; i < expectedSignature.length; i++) {
        diff |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
      }
      if (diff !== 0) return null;

      return {
        dealerId: 'legacy-admin',
        name: 'Administrator',
        phone: '9876543210',
        role: 'ADMIN',
        issuedAt,
      };
    }

    // Multi-tenant payload format "<base64Payload>.<signature>"
    const expectedSignature = await hmacSign(payloadPart, secret);
    if (expectedSignature.length !== signature.length) return null;
    let diff = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      diff |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    if (diff !== 0) return null;

    const jsonStr = fromBase64(payloadPart);
    const payload: DealerSession = JSON.parse(jsonStr);

    if (!payload.dealerId || !payload.phone || !payload.role) {
      return null;
    }

    const now = Date.now();
    const maxAgeMs = SESSION_MAX_AGE_SECONDS * 1000;
    if (now - payload.issuedAt > maxAgeMs || payload.issuedAt > now + 60000) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error('Session verification error:', err);
    return null;
  }
}

/**
 * Helper to safely retrieve current dealer context server-side from request cookies.
 */
export async function getSession(): Promise<DealerSession | null> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Verifies submitted administrator password (legacy fallback).
 */
export function verifyAdminPassword(password: string): boolean {
  const configuredPassword = process.env.ADMIN_PASSWORD || 'BrothersAdmin2025!';
  return Boolean(password) && password === configuredPassword;
}
