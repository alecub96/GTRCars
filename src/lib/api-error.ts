import { NextResponse } from 'next/server';

export function databaseUnavailableResponse() {
  return NextResponse.json(
    { error: 'El servicio de datos no está disponible temporalmente. Inténtalo de nuevo en unos minutos.' },
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
    message.includes('connection timeout')
  );
}
