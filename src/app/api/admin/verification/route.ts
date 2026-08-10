import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) };
  if (user.role !== 'ADMIN') return { error: NextResponse.json({ error: 'Acceso restringido' }, { status: 403 }) };
  return { user };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const documents = await prisma.document.findMany({ where: { status: 'PENDING' }, include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }, orderBy: { createdAt: 'asc' } });
  return NextResponse.json({ success: true, documents });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { documentId, status, notes } = await request.json();
  if (!documentId || !['VERIFIED', 'REJECTED'].includes(status)) return NextResponse.json({ error: 'Datos de revisión inválidos' }, { status: 400 });
  const document = await prisma.document.update({ where: { id: documentId }, data: { status, notes } });
  const pending = await prisma.document.count({ where: { userId: document.userId, status: 'PENDING' } });
  await prisma.user.update({ where: { id: document.userId }, data: { verification: pending ? 'PENDING' : status } });
  return NextResponse.json({ success: true, document });
}
