import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { verifyToken } from './jwt';
import { isConfiguredAdmin } from './admin';

export const DEMO_USERS: Record<string, any> = {
  'demo-owner-gtcars-001': {
    id: 'demo-owner-gtcars-001',
    email: 'propietario@gtcars.club',
    firstName: 'Carlos',
    lastName: 'M. (Propietario VIP)',
    role: 'OWNER',
    avatarUrl: '/supercars/lambo_revuelto.jpg',
    verification: 'VERIFIED',
    phone: '+34 600 123 456',
    stripeAccountId: 'acct_demo_owner',
    createdAt: new Date('2026-01-01'),
  },
  'demo-client-gtcars-002': {
    id: 'demo-client-gtcars-002',
    email: 'cliente@gtcars.club',
    firstName: 'Alejandro',
    lastName: 'B. (Piloto VIP)',
    role: 'TRAVELER',
    avatarUrl: '/default-avatar.svg',
    verification: 'VERIFIED',
    phone: '+34 611 789 012',
    stripeAccountId: null,
    createdAt: new Date('2026-01-01'),
  },
};

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  if (payload.userId && DEMO_USERS[payload.userId]) {
    return DEMO_USERS[payload.userId];
  }
  if (payload.email === 'propietario@gtcars.club') {
    return DEMO_USERS['demo-owner-gtcars-001'];
  }
  if (payload.email === 'cliente@gtcars.club') {
    return DEMO_USERS['demo-client-gtcars-002'];
  }

  let user: any = null;
  try {
    user = await prisma.user.findUnique({
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
        address: true,
        iban: true,
        bankHolder: true,
        stripeAccountId: true,
        createdAt: true,
      },
    });
  } catch (err) {
    if (payload.email?.includes('propietario')) return DEMO_USERS['demo-owner-gtcars-001'];
    if (payload.email?.includes('cliente')) return DEMO_USERS['demo-client-gtcars-002'];
  }

  if (user && user.role === 'ADMIN' && !isConfiguredAdmin(user.email)) {
    try {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'TRAVELER' },
        select: {
          id: true, email: true, firstName: true, lastName: true, role: true,
          avatarUrl: true, verification: true, phone: true, stripeAccountId: true, createdAt: true,
        },
      });
      user = updated;
    } catch {
      user.role = 'TRAVELER';
    }
  } else if (user && user.role !== 'ADMIN' && isConfiguredAdmin(user.email)) {
    try {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
        select: {
          id: true, email: true, firstName: true, lastName: true, role: true,
          avatarUrl: true, verification: true, phone: true, stripeAccountId: true, createdAt: true,
        },
      });
      user = updated;
    } catch {
      // mantener estado actual si falla BD
    }
  }

  return user;
}
