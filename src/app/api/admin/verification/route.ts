import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) };
  if (user.role !== 'ADMIN') return { error: NextResponse.json({ error: 'Acceso restringido' }, { status: 403 }) };
  return { user };
}

export async function GET() {
 try {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const documents = await prisma.document.findMany({ where: { status: 'PENDING' }, include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }, orderBy: { createdAt: 'asc' } });
  return NextResponse.json({ success: true, documents });
 } catch (error) {
   if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
   return NextResponse.json({ error: 'No se pudo cargar la cola documental' }, { status: 500 });
 }
}

export async function PATCH(request: Request) {
 try {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { documentId, status, notes } = await request.json();
  if (!documentId || !['VERIFIED', 'REJECTED'].includes(status)) return NextResponse.json({ error: 'Datos de revisión inválidos' }, { status: 400 });
  const document = await prisma.document.update({ where: { id: documentId }, data: { status, notes } });
  const statuses = await prisma.document.findMany({ where: { userId: document.userId }, select: { status: true } });
  const verification = statuses.some((item) => item.status === 'PENDING')
    ? 'PENDING'
    : statuses.some((item) => item.status === 'REJECTED')
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
