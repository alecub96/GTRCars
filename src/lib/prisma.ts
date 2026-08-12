import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { getDatabaseUrl } from './database-url';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = getDatabaseUrl();
if (!databaseUrl) throw new Error('VANEANDO_DATABASE_URL o DATABASE_URL no está configurada');

const adapter = new PrismaPg({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  max: 5,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
