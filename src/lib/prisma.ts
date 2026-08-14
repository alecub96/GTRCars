import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getMariaDbCredentials() {
  const envUrl = process.env.VANEANDO_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || '';
  const match = envUrl.match(/^(?:mysql|mariadb):\/\/(?:([^:@]+)(?::([^@]*))?@)?([^:\/]+)(?::(\d+))?\/(.+)$/i);
  if (match) {
    return {
      user: decodeURIComponent(match[1] || ''),
      password: decodeURIComponent(match[2] || ''),
      host: match[3] || '127.0.0.1',
      port: match[4] ? Number(match[4]) : 3306,
      database: decodeURIComponent((match[5] || '').split('?')[0]),
    };
  }
  return {
    host: '127.0.0.1',
    port: 3306,
    user: 'u896809627_vaneando',
    password: 'Sillaman1537912537912',
    database: 'u896809627_vaneando',
  };
}

const creds = getMariaDbCredentials();
const adapter = new PrismaMariaDb({
  host: creds.host,
  port: creds.port,
  user: creds.user,
  password: creds.password,
  database: creds.database,
  connectionLimit: 5,
  connectTimeout: 10_000,
  acquireTimeout: 10_000,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
