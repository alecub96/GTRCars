import { NextResponse } from 'next/server';

export function databaseUnavailableResponse(error?: unknown) {
  const candidate = error as { code?: unknown; message?: unknown };
  const rawMessage = typeof candidate?.message === 'string' ? candidate.message : String(error || '');

  return NextResponse.json(
    {
      error: 'El servicio no está disponible en este momento. Por favor, inténtalo de nuevo en unos minutos.',
      debug: rawMessage,
    },
    { status: 503, headers: { 'Retry-After': '60' } },
  );
}

export function isDatabaseUnavailable(error: unknown) {
  const candidate = error as { code?: unknown; message?: unknown };
  const code = typeof candidate?.code === 'string' ? candidate.code : '';
  const message = typeof candidate?.message === 'string' ? candidate.message.toLowerCase() : '';
  return (
    ['P1000', 'P1001', 'P1002'].includes(code) ||
    message.includes('authentication failed') ||
    message.includes('credentials are incorrect') ||
    message.includes("can't reach database") ||
    message.includes('connection timeout') ||
    message.includes('pool timeout') ||
    message.includes('econnrefused') ||
    message.includes('access denied for user') ||
    message.includes('unknown database')
  );
}
