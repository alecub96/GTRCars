import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';
import { getDatabaseUrl, isSupportedDatabaseUrl } from './database-url';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const configuredDatabaseUrl = getDatabaseUrl();
const databaseUrl = isSupportedDatabaseUrl(configuredDatabaseUrl)
  ? configuredDatabaseUrl
  : 'mysql://invalid:invalid@127.0.0.1:3306/vaneando_missing_configuration';

function parseDatabaseUrl(connectionString: string) {
  const match = connectionString.match(/^(?:mysql|mariadb):\/\/(?:([^:@]+)(?::([^@]*))?@)?([^:\/]+)(?::(\d+))?\/(.+)$/i);
  if (!match) {
    return {
      host: '127.0.0.1',
      port: 3306,
      user: 'invalid',
      password: 'invalid',
      database: 'vaneando_invalid',
    };
  }
  return {
    user: decodeURIComponent(match[1] || ''),
    password: decodeURIComponent(match[2] || ''),
    host: match[3] || '127.0.0.1',
    port: match[4] ? Number(match[4]) : 3306,
    database: decodeURIComponent((match[5] || '').split('?')[0]),
  };
}

const parsed = parseDatabaseUrl(databaseUrl);
const adapter = new PrismaMariaDb({
  host: parsed.host,
  port: parsed.port,
  user: parsed.user,
  password: parsed.password,
  database: parsed.database,
  connectionLimit: 5,
  connectTimeout: 10_000,
  acquireTimeout: 10_000,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
