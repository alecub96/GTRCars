import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export type UploadKind = 'vehicles' | 'documents';

const extensions: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

export function getUploadRoot() {
  return path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'storage'));
}

export async function saveUpload(file: File, kind: UploadKind) {
  const extension = extensions[file.type];
  if (!extension) throw new Error('Tipo de archivo no permitido');
  const directory = path.join(getUploadRoot(), kind);
  await mkdir(directory, { recursive: true });
  const filename = `${randomUUID()}${extension}`;
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()), { flag: 'wx' });
  return `/api/uploads/${kind}/${filename}`;
}

export function resolveUploadPath(kind: UploadKind, filename: string) {
  if (path.basename(filename) !== filename) throw new Error('Nombre de archivo inválido');
  return path.join(getUploadRoot(), kind, filename);
}
