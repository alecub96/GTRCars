import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { resolveUploadPath, type UploadKind } from '@/lib/uploads';

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
};

export async function GET(_: Request, context: { params: Promise<{ kind: string; filename: string }> }) {
  const { kind, filename } = await context.params;
  if (kind !== 'vehicles' && kind !== 'documents') return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });

  if (kind === 'documents') {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const fileUrl = `/api/uploads/documents/${filename}`;
    const document = await prisma.document.findFirst({ where: { fileUrl }, select: { userId: true } });
    if (!document || (document.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
    }
  }

  try {
    const file = await readFile(resolveUploadPath(kind as UploadKind, filename));
    const contentType = mimeTypes[path.extname(filename).toLowerCase()] || 'application/octet-stream';
    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': kind === 'vehicles' ? 'public, max-age=31536000, immutable' : 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
  }
}
