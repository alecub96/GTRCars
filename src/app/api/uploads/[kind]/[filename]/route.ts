import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { readUpload, type UploadKind } from '@/lib/uploads';

export async function GET(_: Request, context: { params: Promise<{ kind: string; filename: string }> }) {
  const { kind, filename } = await context.params;
  if (kind !== 'vehicles' && kind !== 'documents' && kind !== 'avatars' && kind !== 'inspections') return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });

  if (kind === 'documents') {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const fileUrl = `/api/uploads/documents/${filename}`;
    const document = await prisma.document.findFirst({ where: { fileUrl }, select: { userId: true } });
    if (!document || (document.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
    }
  }

  if (kind === 'inspections') {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const fileUrl = `/api/uploads/inspections/${filename}`;
    const [checkInPhoto, checkOutPhoto] = await Promise.all([
      prisma.checkInPhoto.findFirst({ where: { url: fileUrl }, select: { checkIn: { select: { booking: { select: { travelerId: true, ownerId: true } } } } } }),
      prisma.checkOutPhoto.findFirst({ where: { url: fileUrl }, select: { checkOut: { select: { booking: { select: { travelerId: true, ownerId: true } } } } } }),
    ]);
    const booking = checkInPhoto?.checkIn.booking || checkOutPhoto?.checkOut.booking;
    if (!booking || (![booking.travelerId, booking.ownerId].includes(user.id) && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
    }
  }

  try {
    const file = await readUpload(kind as UploadKind, filename);
    return new NextResponse(new Uint8Array(file.contents), {
      headers: {
        'Content-Type': file.contentType,
        'Cache-Control': kind === 'documents' || kind === 'inspections' ? 'private, no-store' : 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
  }
}
