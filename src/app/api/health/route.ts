import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/database-health';
import { getEmailConfiguration } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  const database = await checkDatabaseHealth();
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
      status: process.env.JWT_SECRET && process.env.DOCUMENT_ENCRYPTION_KEY ? 'configured' : 'missing',
      missing: [
        !process.env.JWT_SECRET && 'JWT_SECRET',
        !process.env.DOCUMENT_ENCRYPTION_KEY && 'DOCUMENT_ENCRYPTION_KEY',
      ].filter(Boolean),
    },
    analytics: {
      clarity: Boolean(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'zf9zp8dwdj'),
      ga4: true,
      searchConsole: true,
    },
  };
  const serverOperational = database.status === 'ok';
  const healthy = serverOperational && configuration.stripe.status === 'configured' && configuration.security.status === 'configured';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : serverOperational ? 'operational' : 'degraded',
      checks: { database: { ...database, provider: 'postgresql' }, configuration },
      timestamp: new Date().toISOString(),
    },
    {
      status: serverOperational ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
