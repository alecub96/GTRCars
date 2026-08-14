import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
    const documents = await prisma.document.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ success: true, documents });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo cargar la cola documental' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
    const { documentId, status, notes } = await request.json();
    if (!documentId || !['VERIFIED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Datos de revisión inválidos' }, { status: 400 });
    }
    const document = await prisma.document.update({ where: { id: documentId }, data: { status, notes } });
    const statuses = await prisma.document.findMany({ where: { userId: document.userId }, select: { status: true } });
    const verification = statuses.some((item: any) => item.status === 'PENDING')
      ? 'PENDING'
      : statuses.some((item: any) => item.status === 'REJECTED')
      ? 'REJECTED'
      : 'VERIFIED';
    await prisma.user.update({
      where: { id: document.userId },
      data: { verification },
      select: { id: true, verification: true },
    });
    return NextResponse.json({ success: true, document });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo guardar la revisión' }, { status: 500 });
  }
}
