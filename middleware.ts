import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = await verifySessionToken(token);

  // 1. Handling the Login Page
  if (pathname === '/admin/login') {
    // If admin is already authenticated, redirect them straight to the admin dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Otherwise, allow access to the login page
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

  // 3. Protecting Mutating API Routes
  // Protect Car modifications (POST /api/cars, PUT /api/cars/:id, DELETE /api/cars/:id)
  if (pathname.startsWith('/api/cars')) {
    const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
    if (isMutation && !isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required to modify vehicles.' },
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
        { error: 'Unauthorized. Admin session required to modify leads.' },
        { status: 401 }
      );
    }
  }

  // Protect File Upload API (POST /api/upload)
  if (pathname.startsWith('/api/upload')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required to upload images.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/cars/:path*',
    '/api/seed/:path*',
    '/api/inquiries/:path*',
    '/api/upload/:path*',
  ],
};
