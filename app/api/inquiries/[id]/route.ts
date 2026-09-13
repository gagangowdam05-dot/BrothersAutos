import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Session required to update inquiry.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        car: {
          select: { dealerId: true },
        },
      },
    });

    if (!existingInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // RBAC: Check dealer ownership
    if (session.role === 'DEALER') {
      const isOwner =
        existingInquiry.dealerId === session.dealerId ||
        existingInquiry.car?.dealerId === session.dealerId;

      if (!isOwner) {
        return NextResponse.json(
          { error: 'Forbidden. You do not have permission to modify another dealer’s lead.' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { status } = body;

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update inquiry status:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Session required to delete inquiry.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        car: {
          select: { dealerId: true },
        },
      },
    });

    if (!existingInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // RBAC: Check dealer ownership
    if (session.role === 'DEALER') {
      const isOwner =
        existingInquiry.dealerId === session.dealerId ||
        existingInquiry.car?.dealerId === session.dealerId;

      if (!isOwner) {
        return NextResponse.json(
          { error: 'Forbidden. You do not have permission to delete another dealer’s lead.' },
          { status: 403 }
        );
      }
    }

    await prisma.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
