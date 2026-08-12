import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/database-health';

export const dynamic = 'force-dynamic';

export async function GET() {
  const database = await checkDatabaseHealth();
  const healthy = database.status === 'ok';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      checks: { database },
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
