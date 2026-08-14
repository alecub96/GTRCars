import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Credenciales fijas y blindadas de MariaDB de Hostinger.
// Rompe por completo cualquier sobreescritura automática de DATABASE_URL de Postgres.
const adapter = new PrismaMariaDb({
  host: '127.0.0.1',
  port: 3306,
  user: 'u896809627_vaneando',
  password: 'Sillaman1537912537912_',
  database: 'u896809627_vaneando',
  connectionLimit: 5,
  connectTimeout: 10_000,
  acquireTimeout: 10_000,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
