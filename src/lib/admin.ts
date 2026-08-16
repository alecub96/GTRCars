import { getCurrentUser } from './auth';
import { prisma } from './prisma';

const DEFAULT_ADMIN_EMAILS = [
  'admin@vaneando.com',
  'vaneando@vaneando.com',
  'alecub96@hotmail.com',
];

export function getConfiguredAdminEmails() {
  const envEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...envEmails]));
}

export function isConfiguredAdmin(email?: string | null) {
  if (!email || typeof email !== 'string') return false;
  return getConfiguredAdminEmails().includes(email.trim().toLowerCase());
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;

  if (isConfiguredAdmin(user.email) || user.role === 'ADMIN') {
    if (user.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      }).catch(() => {});
      user.role = 'ADMIN';
    }
    return user;
  }
  return null;
}
