import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  if (user.role !== 'OWNER') return NextResponse.json({ error: 'Solo los propietarios pueden añadir fotos' }, { status: 403 });
  const { id } = await context.params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, include: { photos: true } });
  if (!vehicle || vehicle.ownerId !== user.id) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File) || file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return NextResponse.json({ error: 'Adjunta una imagen JPG, PNG o WEBP de menos de 5 MB' }, { status: 400 });
  const url = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`;
  const photo = await prisma.vehiclePhoto.create({ data: { vehicleId: id, url, orderIndex: vehicle.photos.length } });
  return NextResponse.json({ success: true, photo });
}
