import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/database-health';
import { getEmailConfiguration } from '@/lib/email';
import { getDatabaseUrl, isSupportedDatabaseUrl } from '@/lib/database-url';

export const dynamic = 'force-dynamic';

export async function GET() {
  const database = await checkDatabaseHealth();
  const databaseUrl = getDatabaseUrl();
  const databaseProvider = isSupportedDatabaseUrl(databaseUrl) ? 'mysql' : databaseUrl ? 'incompatible' : 'missing';
  const email = getEmailConfiguration();
  const configuration = {
    email: { status: email.configured ? 'configured' : 'missing', missing: email.missing },
    stripe: {
      status: process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'missing',
      missing: [
        !process.env.STRIPE_SECRET_KEY && 'STRIPE_SECRET_KEY',
        !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        !process.env.STRIPE_WEBHOOK_SECRET && 'STRIPE_WEBHOOK_SECRET',
      ].filter(Boolean),
    },
    security: {
      status: process.env.JWT_SECRET && process.env.DOCUMENT_ENCRYPTION_KEY && process.env.CRON_SECRET ? 'configured' : 'missing',
      missing: [
        !process.env.JWT_SECRET && 'JWT_SECRET',
        !process.env.DOCUMENT_ENCRYPTION_KEY && 'DOCUMENT_ENCRYPTION_KEY',
        !process.env.CRON_SECRET && 'CRON_SECRET',
      ].filter(Boolean),
    },
  };
  const healthy = database.status === 'ok' && Object.values(configuration).every((check) => check.status === 'configured');

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      checks: { database: { ...database, source: process.env.VANEANDO_DATABASE_URL?.trim() ? 'VANEANDO_DATABASE_URL' : process.env.DATABASE_URL?.trim() ? 'DATABASE_URL' : 'missing', provider: databaseProvider }, configuration },
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
