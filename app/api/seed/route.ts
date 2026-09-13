import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SEED_CARS, SEED_INQUIRIES, SEED_DEALERS } from '@/lib/seedData';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 1. Clear existing records in correct order
    await prisma.inquiry.deleteMany();
    await prisma.car.deleteMany();
    await prisma.dealer.deleteMany();

    // 2. Insert Dealers and Admin
    const createdDealers = [];
    for (const dealerData of SEED_DEALERS) {
      const hashedPassword = await bcrypt.hash(dealerData.passwordRaw, 10);
      const dealer = await prisma.dealer.create({
        data: {
          name: dealerData.name,
          phone: dealerData.phone,
          password: hashedPassword,
          role: dealerData.role,
          isActive: dealerData.isActive,
        },
      });
      createdDealers.push(dealer);
    }

    const regularDealers = createdDealers.filter((d) => d.role === 'DEALER');

    // 3. Insert Cars distributed across dealers
    const createdCars = [];
    for (let i = 0; i < SEED_CARS.length; i++) {
      const carData = SEED_CARS[i];
      const assignedDealer = regularDealers[i % regularDealers.length];
      const car = await prisma.car.create({
        data: {
          ...carData,
          dealerId: assignedDealer.id,
        },
      });
      createdCars.push(car);
    }

    // 4. Insert Inquiries linked to cars and respective dealers
    for (let i = 0; i < SEED_INQUIRIES.length; i++) {
      const inquiry = SEED_INQUIRIES[i];
      const linkedCar = createdCars[i % createdCars.length];
      await prisma.inquiry.create({
        data: {
          ...inquiry,
          carId: linkedCar.id,
          dealerId: linkedCar.dealerId,
          carTitle: `${linkedCar.year} ${linkedCar.make} ${linkedCar.model}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Database re-seeded successfully with 1 Admin, ${regularDealers.length} Dealers, ${createdCars.length} Cars, and ${SEED_INQUIRIES.length} Leads.`,
    });
  } catch (error) {
    console.error('Failed to seed database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
