import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SEED_CARS, SEED_INQUIRIES, SEED_DEALERS } from '../lib/seedData';

const prisma = new PrismaClient();

export async function runSeed() {
  console.log('Seeding multi-tenant Brothers Autos database...');

  // 1. Clear existing records in correct relation order
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
  console.log(`Seeded ${createdDealers.length} dealers/admins.`);

  // Dealer accounts list (filter dealers excluding pure admin for car distribution, or include admin)
  const regularDealers = createdDealers.filter((d) => d.role === 'DEALER');

  // 3. Insert Cars distributed across dealers
  const createdCars = [];
  for (let i = 0; i < SEED_CARS.length; i++) {
    const carData = SEED_CARS[i];
    // Distribute cars among the 6 dealers
    const assignedDealer = regularDealers[i % regularDealers.length];
    const car = await prisma.car.create({
      data: {
        ...carData,
        dealerId: assignedDealer.id,
      },
    });
    createdCars.push(car);
  }
  console.log(`Seeded ${createdCars.length} cars distributed among ${regularDealers.length} dealers.`);

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
  console.log(`Seeded ${SEED_INQUIRIES.length} sample customer inquiries with dealer attribution.`);
}

runSeed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
