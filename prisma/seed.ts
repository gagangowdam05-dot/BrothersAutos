import { PrismaClient } from '@prisma/client';
import { SEED_CARS, SEED_INQUIRIES } from '../lib/seedData';

const prisma = new PrismaClient();

export async function runSeed() {
  console.log("Seeding database...");

  // Clear existing records
  await prisma.inquiry.deleteMany();
  await prisma.car.deleteMany();

  // Insert cars
  const createdCars = [];
  for (const carData of SEED_CARS) {
    const car = await prisma.car.create({
      data: carData,
    });
    createdCars.push(car);
  }
  console.log(`Seeded ${createdCars.length} cars.`);

  // Insert inquiries linked to sample cars
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
  console.log(`Seeded ${SEED_INQUIRIES.length} sample inquiries.`);
}

runSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
