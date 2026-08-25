import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { saveUpload, UploadConfigurationError } from '@/lib/uploads';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: 'No autorizado como administrador' }, { status: 403 });

    const form = await request.formData();
    const avatar = form.get('avatar');

    if (!(avatar instanceof File) || avatar.size === 0) {
      return NextResponse.json({ error: 'Debes seleccionar un archivo de imagen válido' }, { status: 400 });
    }

    if (avatar.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(avatar.type)) {
      return NextResponse.json({ error: 'La foto debe ser JPG, PNG o WEBP y pesar menos de 5 MB' }, { status: 400 });
    }

    const avatarUrl = await saveUpload(avatar, 'avatars');

    return NextResponse.json({
      success: true,
      avatarUrl,
      message: 'Foto subida correctamente',
    });
  } catch (error: any) {
    console.error('Admin avatar upload error:', error);
    if (error instanceof UploadConfigurationError) return NextResponse.json({ error: 'El almacenamiento de imágenes no está configurado' }, { status: 503 });
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error?.message || 'Error al subir la imagen' }, { status: 500 });
  }
}
