import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Session required to view leads.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dealerIdFilter = searchParams.get('dealerId');

    const where: any = {};

    if (session.role === 'DEALER') {
      // Scoped strictly to inquiries assigned to this dealer directly or via their vehicle
      where.OR = [
        { dealerId: session.dealerId },
        { car: { dealerId: session.dealerId } },
      ];
    } else if (session.role === 'ADMIN') {
      if (dealerIdFilter && dealerIdFilter !== 'ALL') {
        where.OR = [
          { dealerId: dealerIdFilter },
          { car: { dealerId: dealerIdFilter } },
        ];
      }
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
            images: true,
            dealerId: true,
            dealer: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      carId,
      carTitle,
      customerName,
      phone,
      email,
      inquiryType,
      preferredDate,
      preferredTime,
      tokenAmount,
      message,
    } = body;

    if (!customerName || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required.' },
        { status: 400 }
      );
    }

    let title = carTitle;
    let targetDealerId: string | null = null;

    if (carId) {
      const car = await prisma.car.findUnique({
        where: { id: carId },
        select: { year: true, make: true, model: true, dealerId: true },
      });
      if (car) {
        title = `${car.year} ${car.make} ${car.model}`;
        targetDealerId = car.dealerId;
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        carId: carId || null,
        dealerId: targetDealerId,
        carTitle: title || 'General Showroom Inquiry',
        customerName: String(customerName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        inquiryType: inquiryType || 'GENERAL',
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        tokenAmount: tokenAmount ? Number(tokenAmount) : null,
        message: message ? String(message).trim() : null,
        status: 'NEW',
      },
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          inquiryType === 'TEST_DRIVE'
            ? 'Test drive booking confirmed! Our showroom advisor will contact you shortly.'
            : inquiryType === 'RESERVE_BOOKING'
            ? 'Reservation request received! Our sales manager will contact you for token lock.'
            : 'Inquiry received! We will be in touch.',
        inquiryId: inquiry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
