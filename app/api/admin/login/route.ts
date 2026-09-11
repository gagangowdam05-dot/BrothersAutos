import { NextResponse } from 'next/server';
import { 
  verifyAdminPassword, 
  createSessionToken, 
  ADMIN_COOKIE_NAME, 
  SESSION_MAX_AGE_SECONDS 
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password.trim());
    if (!isValid) {
      // Intentional delay to mitigate rapid brute-force attempts
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(
        { error: 'Invalid administrator password. Please try again.' },
        { status: 401 }
      );
    }

    const token = await createSessionToken();

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
