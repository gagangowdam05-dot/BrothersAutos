import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 1. Wipe out all inquiries, mock cars, and dummy dealers
    await prisma.inquiry.deleteMany();
    await prisma.car.deleteMany();
    await prisma.dealer.deleteMany();

    // 2. Hash Super Admin password
    const hashedPassword = await bcrypt.hash('Gagan@2006', 10);

    // 3. Seed ONLY the Super Admin account
    const superAdmin = await prisma.dealer.create({
      data: {
        name: 'Gagan Gowda M',
        phone: '9916581617',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Database purged. Super Admin account ready: ${superAdmin.name} (${superAdmin.phone}). Zero mock data remaining.`,
    });
  } catch (error) {
    console.error('Failed to reset database:', error);
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}
