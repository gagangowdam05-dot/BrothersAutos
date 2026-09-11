import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const car = await prisma.car.findUnique({
      where: { id: params.id },
      include: {
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
  { params }: { params: { id: string } }
) {
  try {
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

    if (features !== undefined) {
      updateData.features = typeof features === 'string' ? features : JSON.stringify(features);
    }
    if (images !== undefined) {
      updateData.images = typeof images === 'string' ? images : JSON.stringify(images);
    }

    const updatedCar = await prisma.car.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error('Failed to update car:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.car.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Failed to delete car:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
