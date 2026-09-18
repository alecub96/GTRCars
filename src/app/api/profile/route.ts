import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { saveUpload, UploadConfigurationError } from '@/lib/uploads';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const form = await request.formData();
    const firstName = String(form.get('firstName') || '').trim();
    const lastName = String(form.get('lastName') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const avatar = form.get('avatar');
    const address = String(form.get('address') || '').trim();
    const iban = String(form.get('iban') || '').trim();
    const bankHolder = String(form.get('bankHolder') || '').trim();

    if (firstName.length < 2 || firstName.length > 80 || lastName.length < 2 || lastName.length > 120 || phone.length > 30) return NextResponse.json({ error: 'Revisa el nombre, los apellidos y el teléfono' }, { status: 400 });
    let avatarUrl = user.avatarUrl;
    if (avatar instanceof File && avatar.size > 0) {
      if (avatar.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'La imagen de perfil no puede superar los 10 MB' }, { status: 400 });
      }
      avatarUrl = await saveUpload(avatar, 'avatars');
    }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        address: address || null,
        iban: iban ? iban.replace(/\s+/g, '').toUpperCase() : user.iban,
        bankHolder: bankHolder || user.bankHolder,
        avatarUrl,
      },
      select: {
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        iban: true,
        bankHolder: true,
        avatarUrl: true,
      },
    });
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error instanceof UploadConfigurationError) return NextResponse.json({ error: 'El almacenamiento de imágenes no está configurado' }, { status: 503 });
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo actualizar el perfil' }, { status: 500 });
  }
}
