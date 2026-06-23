import { PrismaClient } from '@prisma/client';
import { applyDatabaseEnvAliases } from './db-env';

applyDatabaseEnvAliases();

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
