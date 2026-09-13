import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { hashPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Administrator privileges required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { isActive, name, phone, password, role } = body;

    const dealer = await prisma.dealer.findUnique({ where: { id } });
    if (!dealer) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (typeof isActive === 'boolean') {
      // Prevent deactivating own account if this is the active admin
      if (id === session.dealerId && !isActive) {
        return NextResponse.json(
          { error: 'You cannot deactivate your own logged-in administrator account.' },
          { status: 400 }
        );
      }
      updateData.isActive = isActive;
    }

    if (name) updateData.name = String(name).trim();

    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
      if (cleanPhone.length !== 10) {
        return NextResponse.json(
          { error: 'Phone must be a valid 10-digit mobile number.' },
          { status: 400 }
        );
      }
      if (cleanPhone !== dealer.phone) {
        const existing = await prisma.dealer.findUnique({ where: { phone: cleanPhone } });
        if (existing) {
          return NextResponse.json(
            { error: 'Mobile number already registered to another dealer.' },
            { status: 409 }
          );
        }
        updateData.phone = cleanPhone;
      }
    }

    if (password && String(password).trim().length > 0) {
      updateData.password = await hashPassword(String(password).trim());
    }

    if (role && (role === 'ADMIN' || role === 'DEALER')) {
      updateData.role = role;
    }

    const updated = await prisma.dealer.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update dealer:', error);
    return NextResponse.json({ error: 'Failed to update dealer' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Administrator privileges required.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (id === session.dealerId) {
      return NextResponse.json(
        { error: 'Cannot delete your own administrator account.' },
        { status: 400 }
      );
    }

    const dealer = await prisma.dealer.findUnique({ where: { id } });
    if (!dealer) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    // Set dealerId to null on associated cars and leads
    await prisma.car.updateMany({
      where: { dealerId: id },
      data: { dealerId: null },
    });

    await prisma.inquiry.updateMany({
      where: { dealerId: id },
      data: { dealerId: null },
    });

    await prisma.dealer.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Dealer ${dealer.name} removed successfully.`,
    });
  } catch (error) {
    console.error('Failed to delete dealer:', error);
    return NextResponse.json({ error: 'Failed to delete dealer' }, { status: 500 });
  }
}
