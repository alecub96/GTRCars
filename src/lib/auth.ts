import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { verifyToken } from './jwt';
import { isConfiguredAdmin } from './admin';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  let user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatarUrl: true,
      verification: true,
      phone: true,
      stripeAccountId: true,
      createdAt: true,
    },
  });

  if (user && user.role !== 'ADMIN' && isConfiguredAdmin(user.email)) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true,
        avatarUrl: true, verification: true, phone: true, stripeAccountId: true, createdAt: true,
      },
    });
  }

  return user;
}
