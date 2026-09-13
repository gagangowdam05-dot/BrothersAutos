import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/password';
import { 
  createSessionToken, 
  create2FAChallengeToken,
  ADMIN_COOKIE_NAME, 
  SECURE_COOKIE_OPTIONS,
} from '@/lib/auth';
import { checkAuthRateLimit, resetAuthRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Pre-computed bcrypt cost-10 hash used to mitigate timing attacks on non-existent accounts
const DUMMY_BCRYPT_HASH = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa';

// Strict regex for valid 10-digit Indian mobile numbers (starts with 6-9)
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone, password } = body;

    // 1. Sanitize Phone Input
    const cleanPhone = typeof phone === 'string' ? phone.replace(/\D/g, '').slice(-10) : '';

    // 2. Strict Rate Limiting (Dual IP & Phone Bucket: 5 attempts per 15 mins)
    const rateLimit = checkAuthRateLimit(request, cleanPhone || undefined, 5, 15 * 60 * 1000);

    const rateLimitHeaders = {
      'X-RateLimit-Limit': String(rateLimit.limit),
      'X-RateLimit-Remaining': String(rateLimit.remaining),
      'X-RateLimit-Reset': String(rateLimit.resetTime),
    };

    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: `Too many login attempts. For security reasons, please wait ${rateLimit.retryAfterSeconds} seconds before trying again.` 
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

    // 3. Strict Input Validation
    if (!cleanPhone || !INDIAN_MOBILE_REGEX.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number (e.g. 98765 43210).' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      return NextResponse.json(
        { error: 'Password is required.' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Bound password length to mitigate Denial-of-Service via expensive bcrypt hashing
    if (password.length > 128) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password.' },
        { status: 401, headers: rateLimitHeaders }
      );
    }

    // 4. Query Dealer Account
    const dealer = await prisma.dealer.findUnique({
      where: { phone: cleanPhone },
    });

    // 5. Anti-Enumeration & Constant-Time Password Verification
    if (!dealer || !dealer.isActive) {
      // Execute dummy bcrypt comparison to neutralize timing side-channels
      await comparePassword(password, DUMMY_BCRYPT_HASH);

      return NextResponse.json(
        { error: 'Invalid mobile number or password.' },
        { status: 401, headers: rateLimitHeaders }
      );
    }

    const isMatch = await comparePassword(password.trim(), dealer.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password.' },
        { status: 401, headers: rateLimitHeaders }
      );
    }

    // 6. Successful Primary Verification - Reset Rate Limit
    resetAuthRateLimit(request, cleanPhone);

    // 7. Step-Up Multi-Factor Authentication (2FA) for Privileged Roles
    if (dealer.role === 'ADMIN') {
      // Generate a secure 6-digit numeric OTP
      const cryptoArray = new Uint32Array(1);
      crypto.getRandomValues(cryptoArray);
      const plainOtp = String(100000 + (cryptoArray[0] % 900000));

      // Issue signed intermediate 2FA challenge token (5-minute TTL)
      const tempToken = await create2FAChallengeToken(
        {
          dealerId: dealer.id,
          name: dealer.name,
          phone: dealer.phone,
          role: 'ADMIN',
        },
        plainOtp
      );

      // In production, integrate SMS / WhatsApp gateway dispatch here.
      // For local development and testing, log OTP to server console.
      console.log(`[2FA SECURITY CHALLENGE] One-Time Password for ${dealer.phone}: ${plainOtp}`);

      const maskedPhone = `+91 ******${dealer.phone.slice(-4)}`;

      return NextResponse.json({
        requires2FA: true,
        tempToken,
        maskedPhone,
        message: `Security code dispatched to ${maskedPhone}. Please enter the 6-digit code to complete verification.`,
      }, { headers: rateLimitHeaders });
    }

    // 8. Standard Dealer Authentication (Issue Secure Session Cookie)
    const token = await createSessionToken({
      dealerId: dealer.id,
      name: dealer.name,
      phone: dealer.phone,
      role: dealer.role as 'ADMIN' | 'DEALER',
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      user: {
        id: dealer.id,
        name: dealer.name,
        role: dealer.role,
      },
    }, { headers: rateLimitHeaders });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      ...SECURE_COOKIE_OPTIONS,
    });

    return response;
  } catch (error) {
    console.error('[AUTH ERROR] Login handler failure:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
