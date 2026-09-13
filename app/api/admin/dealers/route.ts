import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { hashPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Administrator privileges required.' },
        { status: 403 }
      );
    }

    const dealers = await prisma.dealer.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            cars: true,
            leads: true,
          },
        },
      },
    });

    return NextResponse.json(dealers);
  } catch (error) {
    console.error('Failed to fetch dealers:', error);
    return NextResponse.json({ error: 'Failed to fetch dealers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Administrator privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, phone, password, role } = body;

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, mobile number, and password are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: 'Mobile number must be a valid 10-digit number.' },
        { status: 400 }
      );
    }

    const existing = await prisma.dealer.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A dealer with phone ${cleanPhone} already exists.` },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(String(password).trim());

    const newDealer = await prisma.dealer.create({
      data: {
        name: String(name).trim(),
        phone: cleanPhone,
        password: hashedPassword,
        role: role === 'ADMIN' ? 'ADMIN' : 'DEALER',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            cars: true,
            leads: true,
          },
        },
      },
    });

    return NextResponse.json(newDealer, { status: 201 });
  } catch (error) {
    console.error('Failed to create dealer:', error);
    return NextResponse.json({ error: 'Failed to create dealer' }, { status: 500 });
  }
}
