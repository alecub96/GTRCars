import { NextResponse } from 'next/server';

export function databaseUnavailableResponse(error?: unknown) {
  const candidate = error as { code?: unknown; message?: unknown };
  const code = typeof candidate?.code === 'string' ? candidate.code : '';
  const message = typeof candidate?.message === 'string' ? candidate.message.toLowerCase() : '';

  let detail = 'No se pudo conectar con la base de datos.';

  if (code === 'P1000' || message.includes('authentication failed') || message.includes('credentials are incorrect') || message.includes('access denied for user')) {
    detail = 'Fallo de autenticación en MySQL (usuario o contraseña incorrectos en Hostinger).';
  } else if (message.includes('unknown database')) {
    detail = 'El nombre de la base de datos no existe en el servidor MySQL.';
  } else if (code === 'P1001' || message.includes("can't reach database") || message.includes('econnrefused')) {
    detail = 'No se puede alcanzar el servidor MySQL (revisa el host/puerto en la URL).';
  } else if (code === 'P1002' || message.includes('connection timeout') || message.includes('pool timeout')) {
    detail = 'Tiempo de espera agotado al conectar con MySQL.';
  } else if (!process.env.VANEANDO_DATABASE_URL && !process.env.DATABASE_URL) {
    detail = 'Falta configurar la variable VANEANDO_DATABASE_URL en Hostinger.';
  }

  return NextResponse.json(
    { error: `Error de base de datos: ${detail}` },
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
