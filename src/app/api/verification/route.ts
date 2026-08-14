import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { saveUpload, UploadConfigurationError } from '@/lib/uploads';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const form = await request.formData();
    const documentType = String(form.get('documentType') || 'DNI_NIE');
    const documentNumber = String(form.get('documentNumber') || '').trim();
    const drivingLicense = String(form.get('drivingLicense') || '').trim();
    const licenseExpDate = String(form.get('licenseExpDate') || '').trim();
    const front = form.get('fileFront');
    const back = form.get('fileBack');
    const expiration = new Date(`${licenseExpDate}T23:59:59`);
    if (!documentNumber || documentNumber.length > 40 || !drivingLicense || drivingLicense.length > 40 || !licenseExpDate || Number.isNaN(expiration.getTime()) || expiration <= new Date() || !(front instanceof File) || !(back instanceof File)) return NextResponse.json({ error: 'Completa los datos, indica una licencia vigente y adjunta ambos documentos' }, { status: 400 });
    if (front.size > MAX_FILE_SIZE || back.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Cada archivo debe pesar menos de 5 MB' }, { status: 400 });
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(front.type) || !allowed.includes(back.type)) return NextResponse.json({ error: 'Solo se admiten JPG, PNG o PDF' }, { status: 400 });
    const [frontUrl, backUrl] = await Promise.all([
      saveUpload(front, 'documents'),
      saveUpload(back, 'documents'),
    ]);
    await prisma.$transaction([
      prisma.document.create({ data: { userId: user.id, type: `${documentType}_FRONT`, fileUrl: frontUrl, status: 'PENDING', notes: `Documento terminado en ${documentNumber.slice(-4)}; permiso terminado en ${drivingLicense.slice(-4)}; caducidad: ${licenseExpDate}` } }),
      prisma.document.create({ data: { userId: user.id, type: `${documentType}_BACK`, fileUrl: backUrl, status: 'PENDING' } }),
      prisma.user.update({
        where: { id: user.id },
        data: { verification: 'PENDING' },
        select: { id: true, verification: true },
      }),
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification upload error:', error);
    if (error instanceof UploadConfigurationError) {
      return NextResponse.json({ error: 'El almacenamiento seguro de documentos aún no está configurado' }, { status: 503 });
    }
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudieron guardar los documentos' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const documents = await prisma.document.findMany({ where: { userId: user.id }, select: { id: true, type: true, status: true, createdAt: true, updatedAt: true }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, verification: user.verification, documents });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo cargar la verificación' }, { status: 500 });
  }
}
