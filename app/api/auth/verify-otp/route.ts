import { NextResponse } from 'next/server';
import { 
  verify2FAChallenge, 
  createSessionToken, 
  ADMIN_COOKIE_NAME, 
  SECURE_COOKIE_OPTIONS 
} from '@/lib/auth';
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json().catch(() => ({}));
    const { tempToken, otp } = body;

    // 1. Rate Limit OTP Attempts (3 attempts per 5 minutes to prevent OTP brute-force)
    const rateLimitKey = `otp:ip:${ip}`;
    const rateLimit = checkRateLimit(rateLimitKey, 3, 5 * 60 * 1000);

    const rateLimitHeaders = {
      'X-RateLimit-Limit': String(rateLimit.limit),
      'X-RateLimit-Remaining': String(rateLimit.remaining),
      'X-RateLimit-Reset': String(rateLimit.resetTime),
    };

    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: `Too many invalid code attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.` 
        },
        { 
          status: 429,
          headers: {
            ...rateLimitHeaders,
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    // 2. Validate Inputs
    if (!tempToken || typeof tempToken !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing authentication challenge. Please sign in again.' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const cleanOtp = typeof otp === 'string' ? otp.trim().replace(/\D/g, '') : '';
    if (cleanOtp.length !== 6) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit verification code.' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // 3. Verify Challenge Token and OTP
    const verification = await verify2FAChallenge(tempToken, cleanOtp);

    if (!verification.success || !verification.user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please check and try again.' },
        { status: 401, headers: rateLimitHeaders }
      );
    }

    // 4. Successful Verification - Reset Rate Limit
    resetRateLimit(rateLimitKey);

    const { user } = verification;

    // 5. Issue Authenticated Administrative Session
    const sessionToken = await createSessionToken({
      dealerId: user.dealerId,
      name: user.name,
      phone: user.phone,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Two-factor authentication successful. Access granted.',
      user: {
        id: user.dealerId,
        name: user.name,
        role: user.role,
      },
    }, { headers: rateLimitHeaders });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      ...SECURE_COOKIE_OPTIONS,
    });

    return response;
  } catch (error) {
    console.error('[2FA ERROR] OTP verification failed:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification. Please try again.' },
      { status: 500 }
    );
  }
}
