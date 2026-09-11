import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
            images: true,
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

    // Check if car exists if carId is provided
    let title = carTitle;
    if (carId && !title) {
      const car = await prisma.car.findUnique({
        where: { id: carId },
        select: { year: true, make: true, model: true },
      });
      if (car) {
        title = `${car.year} ${car.make} ${car.model}`;
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        carId: carId || null,
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
