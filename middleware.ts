import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const isAuthenticated = Boolean(session);

  // 1. Handling the Login Page
  if (pathname === '/admin/login') {
    // If dealer/admin is already authenticated, redirect them straight to dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // 2. Protecting Admin Dashboard Pages (/admin, /admin/...)
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      const destination = pathname + (search || '');
      if (destination !== '/admin') {
        loginUrl.searchParams.set('from', destination);
      }
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. Protecting Dealer Management API (Admin only)
  if (pathname.startsWith('/api/admin/dealers')) {
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Administrator privileges required to manage dealers.' },
        { status: 403 }
      );
    }
  }

  // 4. Protecting Mutating API Routes
  // Protect Car modifications (POST /api/cars, PUT /api/cars/:id, DELETE /api/cars/:id)
  if (pathname.startsWith('/api/cars')) {
    const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
    if (isMutation && !isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Dealer session required to modify vehicles.' },
        { status: 401 }
      );
    }
  }

  // Protect Seed Database API (POST /api/seed)
  if (pathname.startsWith('/api/seed')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required to re-seed database.' },
        { status: 401 }
      );
    }
  }

  // Protect Inquiry Status Updates (PATCH/DELETE /api/inquiries/:id)
  if (pathname.startsWith('/api/inquiries')) {
    const isMutation = ['PATCH', 'PUT', 'DELETE'].includes(request.method);
    if (isMutation && !isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Dealer session required to modify leads.' },
        { status: 401 }
      );
    }
  }

  // Protect File Upload API (POST /api/upload)
  if (pathname.startsWith('/api/upload')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Dealer session required to upload images.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/dealers/:path*',
    '/api/cars/:path*',
    '/api/seed/:path*',
    '/api/inquiries/:path*',
    '/api/upload/:path*',
  ],
};
