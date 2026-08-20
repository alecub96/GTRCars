import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { saveUpload, UploadConfigurationError } from '@/lib/uploads';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const { id } = await context.params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { photos: true, owner: { select: { id: true, email: true } } },
    });
    if (!vehicle) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    const isOwner = vehicle.ownerId === user.id || vehicle.owner?.email === user.email || user.role === 'ADMIN';
    if (!isOwner) return NextResponse.json({ error: 'No tienes permiso para modificar este vehículo' }, { status: 403 });
    if (vehicle.photos.length >= 20) return NextResponse.json({ error: 'El anuncio admite un máximo de 20 fotos' }, { status: 400 });
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File) || file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return NextResponse.json({ error: 'Adjunta una imagen JPG, PNG o WEBP de menos de 5 MB' }, { status: 400 });
    const url = await saveUpload(file, 'vehicles');
    const photo = await prisma.vehiclePhoto.create({ data: { vehicleId: id, url, orderIndex: vehicle.photos.length } });
    return NextResponse.json({ success: true, photo });
  } catch (error) {
    console.error('Vehicle photo upload error:', error);
    if (error instanceof UploadConfigurationError) return NextResponse.json({ error: 'El almacenamiento de imágenes no está configurado' }, { status: 503 });
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo guardar la foto' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const { id } = await context.params;
    const body = await request.json();
    const { photoId } = body;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { owner: { select: { id: true, email: true } } },
    });
    if (!vehicle) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    const isOwner = vehicle.ownerId === user.id || vehicle.owner?.email === user.email || user.role === 'ADMIN';
    if (!isOwner) return NextResponse.json({ error: 'No tienes permiso para modificar este vehículo' }, { status: 403 });

    if (photoId) {
      await prisma.vehiclePhoto.deleteMany({
        where: { id: photoId, vehicleId: id },
      });
    }

    return NextResponse.json({ success: true, message: 'Foto eliminada con éxito' });
  } catch (error) {
    console.error('Vehicle photo delete error:', error);
    return NextResponse.json({ error: 'No se pudo eliminar la foto' }, { status: 500 });
  }
}

