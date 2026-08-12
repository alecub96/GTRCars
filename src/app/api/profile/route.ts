import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { saveUpload } from '@/lib/uploads';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const form = await request.formData();
  const firstName = String(form.get('firstName') || '').trim();
  const lastName = String(form.get('lastName') || '').trim();
  const phone = String(form.get('phone') || '').trim();
  const avatar = form.get('avatar');
  if (firstName.length < 2 || firstName.length > 80 || lastName.length < 2 || lastName.length > 120 || phone.length > 30) return NextResponse.json({ error: 'Revisa el nombre, los apellidos y el teléfono' }, { status: 400 });
  let avatarUrl = user.avatarUrl;
  if (avatar instanceof File && avatar.size > 0) {
    if (avatar.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(avatar.type)) return NextResponse.json({ error: 'La foto debe ser JPG, PNG o WEBP y pesar menos de 5 MB' }, { status: 400 });
    avatarUrl = await saveUpload(avatar, 'avatars');
  }
  const updated = await prisma.user.update({ where: { id: user.id }, data: { firstName, lastName, phone: phone || null, avatarUrl }, select: { firstName: true, lastName: true, phone: true, avatarUrl: true } });
  return NextResponse.json({ success: true, user: updated });
}
