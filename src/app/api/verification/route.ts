import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { saveUpload, UploadConfigurationError } from '@/lib/uploads';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { sendPushToAdmins } from '@/lib/push';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const form = await request.formData();
    const documentType = String(form.get('documentType') || 'DNI_NIE');
    const documentNumber = String(form.get('documentNumber') || '').trim();
    const licenseExpDate = String(form.get('licenseExpDate') || '').trim();
    const front = form.get('fileFront');
    const back = form.get('fileBack');
    const license = form.get('fileLicense');
    const selfie = form.get('fileSelfie');
    const expiration = new Date(`${licenseExpDate}T23:59:59`);

    if (
      !documentNumber ||
      documentNumber.length > 40 ||
      !licenseExpDate ||
      Number.isNaN(expiration.getTime()) ||
      expiration <= new Date() ||
      !(front instanceof File) ||
      !(back instanceof File) ||
      !(license instanceof File) ||
      !(selfie instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            'Completa el número de documento, la fecha de expiración del permiso, adjunta los 3 documentos (Anverso, Reverso y Carné) y realiza la foto de verificación facial de frente.',
        },
        { status: 400 }
      );
    }

    if (
      front.size > MAX_FILE_SIZE ||
      back.size > MAX_FILE_SIZE ||
      license.size > MAX_FILE_SIZE ||
      selfie.size > MAX_FILE_SIZE
    ) {
      return NextResponse.json({ error: 'Cada archivo debe pesar menos de 5 MB' }, { status: 400 });
    }

    const allowedDocs = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const allowedSelfie = ['image/jpeg', 'image/png', 'image/webp'];
    if (
      !allowedDocs.includes(front.type) ||
      !allowedDocs.includes(back.type) ||
      !allowedDocs.includes(license.type) ||
      !allowedSelfie.includes(selfie.type)
    ) {
      return NextResponse.json(
        { error: 'Los documentos deben ser JPG, PNG o PDF y la captura facial debe ser una imagen.' },
        { status: 400 }
      );
    }

    const [frontUrl, backUrl, licenseUrl, selfieUrl] = await Promise.all([
      saveUpload(front, 'documents'),
      saveUpload(back, 'documents'),
      saveUpload(license, 'documents'),
      saveUpload(selfie, 'documents'),
    ]);

    await prisma.$transaction([
      prisma.document.create({
        data: {
          userId: user.id,
          type: `${documentType}_FRONT`,
          fileUrl: frontUrl,
          status: 'PENDING',
          notes: `Documento terminado en ${documentNumber.slice(-4)}; Caducidad permiso: ${licenseExpDate}`,
        },
      }),
      prisma.document.create({
        data: {
          userId: user.id,
          type: `${documentType}_BACK`,
          fileUrl: backUrl,
          status: 'PENDING',
        },
      }),
      prisma.document.create({
        data: {
          userId: user.id,
          type: 'DRIVING_LICENSE',
          fileUrl: licenseUrl,
          status: 'PENDING',
          notes: `Foto Permiso de Conducir vinculada a DNI/NIE ${documentNumber}`,
        },
      }),
      prisma.document.create({
        data: {
          userId: user.id,
          type: 'FACIAL_SELFIE',
          fileUrl: selfieUrl,
          status: 'PENDING',
          notes: `Captura facial biométrica en vivo para cotejo con documento ${documentNumber}`,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { verification: 'PENDING' },
        select: { id: true, verification: true },
      }),
    ]);

    sendPushToAdmins(
      'Nueva verificación facial y documental',
      `${user.firstName} ${user.lastName} ha enviado su DNI, carné y selfie facial en vivo`,
      '/admin'
    ).catch((error) => console.error('Admin verification push error:', error));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification upload error:', error);
    if (error instanceof UploadConfigurationError) {
      return NextResponse.json(
        { error: 'El almacenamiento seguro de documentos aún no está configurado' },
        { status: 503 }
      );
    }
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudieron guardar los documentos' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const documents = await prisma.document.findMany({
      where: { userId: user.id },
      select: { id: true, type: true, status: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, verification: user.verification, documents });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo cargar la verificación' }, { status: 500 });
  }
}
