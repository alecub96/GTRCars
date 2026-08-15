import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getEmailConfiguration, sendEmailTest } from '@/lib/email';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export async function GET() {
  try {
    await ensureDbSchema().catch(() => {});
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Acceso restringido a administradores' }, { status: 403 });
    return NextResponse.json({ success: true, configuration: getEmailConfiguration() });
  } catch (error: any) {
    console.error('Admin Email Config Check Error:', error);
    return NextResponse.json({
      success: true,
      configuration: getEmailConfiguration(),
      warning: error?.message || 'Advertencia de conexión',
    });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDbSchema().catch(() => {});
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Acceso restringido a administradores' }, { status: 403 });

    let target = user.email;
    try {
      const body = await request.json();
      if (body?.email && typeof body.email === 'string' && body.email.includes('@')) {
        target = body.email.trim();
      }
    } catch (_) {}

    await sendEmailTest(target);
    return NextResponse.json({ success: true, message: `Correo de prueba enviado con éxito a ${target}` });
  } catch (error: any) {
    console.error('Admin Email Test Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al conectar con el servidor SMTP de Hostinger' },
      { status: 500 }
    );
  }
}
