import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from 'node:crypto';

export type UploadKind = 'vehicles' | 'documents' | 'avatars' | 'inspections';

export class UploadConfigurationError extends Error {}

const ENCRYPTED_FILE_MAGIC = 'VANEANDO-DOCUMENT-V1';

const extensions: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

export function getUploadRoot() {
  if (process.env.NODE_ENV === 'production' && !process.env.UPLOAD_DIR) {
    throw new UploadConfigurationError('UPLOAD_DIR no está configurada para almacenamiento persistente');
  }
  return path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'storage'));
}

export async function saveUpload(file: File, kind: UploadKind) {
  const extension = extensions[file.type];
  if (!extension) throw new Error('Tipo de archivo no permitido');
  const directory = path.join(getUploadRoot(), kind);
  await mkdir(directory, { recursive: true });
  const contents = Buffer.from(await file.arrayBuffer());
  const encrypted = kind === 'documents' || kind === 'inspections';
  const filename = encrypted ? `${randomUUID()}.enc` : `${randomUUID()}${extension}`;
  const storedContents = encrypted ? encryptDocument(contents, file.type) : contents;
  await writeFile(path.join(directory, filename), storedContents, { flag: 'wx', mode: 0o600 });
  return `/api/uploads/${kind}/${filename}`;
}

export function resolveUploadPath(kind: UploadKind, filename: string) {
  if (path.basename(filename) !== filename) throw new Error('Nombre de archivo inválido');
  return path.join(getUploadRoot(), kind, filename);
}

function documentKey() {
  const secret = process.env.DOCUMENT_ENCRYPTION_KEY;
  if (!secret || secret.length < 32) {
    throw new UploadConfigurationError('DOCUMENT_ENCRYPTION_KEY debe tener al menos 32 caracteres');
  }
  return createHash('sha256').update(secret).digest();
}

function encryptDocument(contents: Buffer, mimeType: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', documentKey(), iv);
  const encrypted = Buffer.concat([cipher.update(contents), cipher.final()]);
  const metadata = Buffer.from(JSON.stringify({ mimeType, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64') }));
  return Buffer.concat([Buffer.from(`${ENCRYPTED_FILE_MAGIC}\n`), metadata, Buffer.from('\n'), encrypted]);
}

export async function readUpload(kind: UploadKind, filename: string) {
  const contents = await readFile(resolveUploadPath(kind, filename));
  if ((kind !== 'documents' && kind !== 'inspections') || path.extname(filename) !== '.enc') {
    return { contents, contentType: extensionsToMime[path.extname(filename).toLowerCase()] || 'application/octet-stream' };
  }

  const firstBreak = contents.indexOf(10);
  const secondBreak = contents.indexOf(10, firstBreak + 1);
  if (contents.subarray(0, firstBreak).toString() !== ENCRYPTED_FILE_MAGIC || secondBreak < 0) throw new Error('Documento cifrado inválido');
  const metadata = JSON.parse(contents.subarray(firstBreak + 1, secondBreak).toString()) as { mimeType: string; iv: string; tag: string };
  const decipher = createDecipheriv('aes-256-gcm', documentKey(), Buffer.from(metadata.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(metadata.tag, 'base64'));
  const decrypted = Buffer.concat([decipher.update(contents.subarray(secondBreak + 1)), decipher.final()]);
  return { contents: decrypted, contentType: metadata.mimeType };
}

const extensionsToMime: Record<string, string> = Object.fromEntries(Object.entries(extensions).map(([mime, extension]) => [extension, mime]));
