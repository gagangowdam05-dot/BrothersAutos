import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function runSeed() {
  console.log('Purging mock data and seeding production Super Admin...');

  // 1. Wipe out all inquiries, mock cars, and dummy dealers
  await prisma.inquiry.deleteMany();
  await prisma.car.deleteMany();
  await prisma.dealer.deleteMany();

  // 2. Hash Super Admin password
  const hashedPassword = await bcrypt.hash('Gagan@2006', 10);

  // 3. Seed ONLY the Super Admin account
  const superAdmin = await prisma.dealer.create({
    data: {
      name: 'Gagan Gowda M',
      phone: '9916581617',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(`Successfully seeded Super Admin: ${superAdmin.name} (${superAdmin.phone}) [Role: ${superAdmin.role}]`);
  console.log('All mock cars, dummy inquiries, and test dealers have been purged.');
}

runSeed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
