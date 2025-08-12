import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { hashedPassword, role: 'ADMIN' },
    create: { email, hashedPassword, role: 'ADMIN', name: 'Admin' },
  });

  console.log('Admin user ready:', {
    email,
    passwordUsed: password === 'ChangeMe123!',
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
