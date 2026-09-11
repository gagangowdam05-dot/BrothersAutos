import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SEED_CARS, SEED_INQUIRIES } from '@/lib/seedData';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await prisma.inquiry.deleteMany();
    await prisma.car.deleteMany();

    const createdCars = [];
    for (const car of SEED_CARS) {
      const c = await prisma.car.create({ data: car });
      createdCars.push(c);
    }

    for (let i = 0; i < SEED_INQUIRIES.length; i++) {
      const inquiry = SEED_INQUIRIES[i];
      const linkedCar = createdCars[i % createdCars.length];
      await prisma.inquiry.create({
        data: {
          ...inquiry,
          carId: linkedCar.id,
          carTitle: `${linkedCar.year} ${linkedCar.make} ${linkedCar.model}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Database re-seeded successfully with ${createdCars.length} cars and ${SEED_INQUIRIES.length} inquiries.`,
    });
  } catch (error) {
    console.error('Failed to seed database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
