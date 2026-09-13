import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/password';
import { 
  createSessionToken, 
  ADMIN_COOKIE_NAME, 
  SESSION_MAX_AGE_SECONDS,
  verifyAdminPassword
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone, password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : '';

    // If phone is provided, authenticate against the Dealer database
    if (cleanPhone) {
      if (cleanPhone.length !== 10) {
        return NextResponse.json(
          { error: 'Please enter a valid 10-digit mobile number' },
          { status: 400 }
        );
      }

      const dealer = await prisma.dealer.findUnique({
        where: { phone: cleanPhone },
      });

      if (!dealer) {
        // Intentional delay to mitigate timing attacks
        await new Promise((r) => setTimeout(r, 250));
        return NextResponse.json(
          { error: 'Invalid mobile number or password. Please check your credentials.' },
          { status: 401 }
        );
      }

      if (!dealer.isActive) {
        return NextResponse.json(
          { error: 'This dealer account has been deactivated. Please contact the showroom administrator.' },
          { status: 403 }
        );
      }

      const isMatch = await comparePassword(password.trim(), dealer.password);
      if (!isMatch) {
        await new Promise((r) => setTimeout(r, 250));
        return NextResponse.json(
          { error: 'Invalid mobile number or password. Please check your credentials.' },
          { status: 401 }
        );
      }

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
          phone: dealer.phone,
          role: dealer.role,
        },
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
    }

    // Fallback: Check if user submitted master password without mobile number
    if (verifyAdminPassword(password.trim())) {
      // Find default super admin account
      const adminUser = await prisma.dealer.findFirst({
        where: { role: 'ADMIN' },
      });

      const token = await createSessionToken({
        dealerId: adminUser?.id || 'admin',
        name: adminUser?.name || 'Super Admin',
        phone: adminUser?.phone || '9876543210',
        role: 'ADMIN',
      });

      const response = NextResponse.json({
        success: true,
        message: 'Master admin authentication successful',
        user: {
          id: adminUser?.id || 'admin',
          name: adminUser?.name || 'Super Admin',
          phone: adminUser?.phone || '9876543210',
          role: 'ADMIN',
        },
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
    }

    return NextResponse.json(
      { error: 'Mobile number and password are required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
