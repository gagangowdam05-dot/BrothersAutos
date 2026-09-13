import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        inquiries: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Failed to get car:', error);
    return NextResponse.json({ error: 'Failed to get car' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Session required to modify vehicle.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingCar = await prisma.car.findUnique({
      where: { id },
      select: { id: true, dealerId: true },
    });

    if (!existingCar) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // RBAC: Check dealer ownership
    if (session.role === 'DEALER' && existingCar.dealerId !== session.dealerId) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to modify another dealer’s vehicle.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      make,
      model,
      year,
      price,
      mileageKm,
      fuelType,
      transmission,
      ownership,
      bodyType,
      color,
      registrationCity,
      insuranceValidTill,
      description,
      features,
      images,
      status,
      isFeatured,
      dealerId,
    } = body;

    const updateData: any = {};
    if (make !== undefined) updateData.make = String(make).trim();
    if (model !== undefined) updateData.model = String(model).trim();
    if (year !== undefined) updateData.year = Number(year);
    if (price !== undefined) updateData.price = Number(price);
    if (mileageKm !== undefined) updateData.mileageKm = Number(mileageKm);
    if (fuelType !== undefined) updateData.fuelType = fuelType;
    if (transmission !== undefined) updateData.transmission = transmission;
    if (ownership !== undefined) updateData.ownership = ownership;
    if (bodyType !== undefined) updateData.bodyType = bodyType;
    if (color !== undefined) updateData.color = color;
    if (registrationCity !== undefined) updateData.registrationCity = registrationCity;
    if (insuranceValidTill !== undefined) updateData.insuranceValidTill = insuranceValidTill;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);

    // Only Admin can reassign a vehicle to another dealer
    if (session.role === 'ADMIN' && dealerId !== undefined) {
      updateData.dealerId = dealerId || null;
    }

    if (features !== undefined) {
      updateData.features = typeof features === 'string' ? features : JSON.stringify(features);
    }
    if (images !== undefined) {
      updateData.images = typeof images === 'string' ? images : JSON.stringify(images);
    }

    const updatedCar = await prisma.car.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error('Failed to update car:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
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
        { error: 'Unauthorized. Session required to delete vehicle.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingCar = await prisma.car.findUnique({
      where: { id },
      select: { id: true, dealerId: true },
    });

    if (!existingCar) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // RBAC: Check dealer ownership
    if (session.role === 'DEALER' && existingCar.dealerId !== session.dealerId) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to delete another dealer’s vehicle.' },
        { status: 403 }
      );
    }

    await prisma.car.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Failed to delete car:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
