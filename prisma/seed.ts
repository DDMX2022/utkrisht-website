import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin (existing)
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { hashedPassword, role: 'ADMIN' },
    create: { email, hashedPassword, role: 'ADMIN', name: 'Admin' },
  });

  // Super Admin (new)
  const superEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@example.com';
  const superPassword =
    process.env.SUPERADMIN_PASSWORD || 'SuperChangeMe123!';
  const superHashed = await bcrypt.hash(superPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: superEmail },
    update: { hashedPassword: superHashed, role: 'SUPERADMIN' },
    create: {
      email: superEmail,
      hashedPassword: superHashed,
      role: 'SUPERADMIN',
      name: 'Super Admin',
    },
  });

  console.log('Admin user ready:', {
    email,
    passwordUsed: password === 'ChangeMe123!',
  });
  console.log('Super Admin user ready:', {
    email: superEmail,
    passwordUsed: superPassword === 'SuperChangeMe123!',
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
