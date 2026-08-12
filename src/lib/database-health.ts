import { prisma } from '@/lib/prisma';

type DatabaseFailure = {
  status: 'unavailable';
  category: 'configuration' | 'network' | 'authentication' | 'schema' | 'unknown';
  code: string | null;
};

export type DatabaseHealth =
  | { status: 'ok'; latencyMs: number }
  | DatabaseFailure;

function classifyDatabaseError(error: unknown): DatabaseFailure {
  const candidate = error as { code?: unknown; message?: unknown; name?: unknown };
  const code = typeof candidate?.code === 'string' ? candidate.code : null;
  const message = typeof candidate?.message === 'string' ? candidate.message.toLowerCase() : '';

  if (code === 'P1000' || message.includes('authentication failed') || message.includes('credentials are incorrect')) {
    return { status: 'unavailable', category: 'authentication', code };
  }
  if (
    code === 'P1001' ||
    code === 'P1002' ||
    message.includes("can't reach database") ||
    message.includes('connection timeout') ||
    message.includes('econnrefused')
  ) {
    return { status: 'unavailable', category: 'network', code };
  }
  if (code === 'P2021' || code === 'P2022' || message.includes('does not exist in the current database')) {
    return { status: 'unavailable', category: 'schema', code };
  }
  if (message.includes('database_url') || message.includes('connection string')) {
    return { status: 'unavailable', category: 'configuration', code };
  }

  return { status: 'unavailable', category: 'unknown', code };
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', latencyMs: Date.now() - startedAt };
  } catch (error) {
    console.error('Database health check failed:', error);
    return classifyDatabaseError(error);
  }
}
