import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const rawDatabaseUrl = process.env.VANEANDO_DATABASE_URL?.trim();
if (!rawDatabaseUrl) throw new Error('VANEANDO_DATABASE_URL no está configurada');

// PrismaMariaDb espera el esquema `mariadb://`. Hostinger suele mostrar
// `mysql://`, así que aceptamos ambos formatos para evitar errores 500 de
// autenticación cuando la variable se copia tal cual desde el panel.
const databaseUrl = rawDatabaseUrl.replace(/^mysql:\/\//i, 'mariadb://');

const adapter = new PrismaMariaDb(databaseUrl, { useTextProtocol: true });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
