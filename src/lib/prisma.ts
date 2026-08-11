import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL no está configurada');

// Hostinger exposes MySQL connection strings with the standard `mysql://`
// protocol, while the MariaDB driver used by Prisma 7 expects `mariadb://`.
// Both protocols target the same server; only the driver-specific scheme
// needs normalizing.
const adapterUrl = databaseUrl.replace(/^mysql:\/\//, 'mariadb://');
const adapter = new PrismaMariaDb(adapterUrl, { useTextProtocol: true });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
