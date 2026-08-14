import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getEmailConfiguration, sendEmailTest } from '@/lib/email';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
  return NextResponse.json({ success: true, configuration: getEmailConfiguration() });
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });

    let target = user.email;
    try {
      const body = await request.json();
      if (body?.email && typeof body.email === 'string' && body.email.includes('@')) {
        target = body.email.trim();
      }
    } catch (_) {}

    await sendEmailTest(target);
    return NextResponse.json({ success: true, message: `Correo de prueba enviado con éxito a ${target}` });
  } catch (error) {
    console.error('Admin Email Test Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error instanceof Error ? error.message : 'No se pudo enviar el correo de prueba' }, { status: 500 });
  }
}
