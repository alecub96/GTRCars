import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

const connectionString =
  process.env.GTRCARS_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  process.env.DIRECT_URL?.trim() ||
  '';

const pool =
  globalForPrisma.prismaPool ||
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaPool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
