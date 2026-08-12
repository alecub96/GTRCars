import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';
import { getDatabaseUrl, isSupportedDatabaseUrl } from './database-url';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const configuredDatabaseUrl = getDatabaseUrl();
const databaseUrl = isSupportedDatabaseUrl(configuredDatabaseUrl)
  ? configuredDatabaseUrl
  : 'mysql://invalid:invalid@127.0.0.1:3306/vaneando_missing_configuration';

const url = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: decodeURIComponent(url.pathname.replace(/^\//, '')),
  connectionLimit: 5,
  connectTimeout: 10_000,
  acquireTimeout: 10_000,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
