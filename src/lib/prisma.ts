import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL no está configurada');

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
