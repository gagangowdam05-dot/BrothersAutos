import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Refresh user state from database
  try {
    const dealer = await prisma.dealer.findUnique({
      where: { id: session.dealerId },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    if (dealer && !dealer.isActive) {
      return NextResponse.json(
        { authenticated: false, error: 'Dealer account deactivated' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        dealerId: dealer?.id || session.dealerId,
        name: dealer?.name || session.name,
        phone: dealer?.phone || session.phone,
        role: dealer?.role || session.role,
      },
    });
  } catch (error) {
    console.error('Failed to verify session against DB:', error);
    // Fall back to token session if database has a temporary hitch
    return NextResponse.json({
      authenticated: true,
      user: session,
    });
  }
}
