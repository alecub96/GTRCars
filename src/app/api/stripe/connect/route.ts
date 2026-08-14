import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  if (user.role !== 'OWNER') return NextResponse.json({ error: 'Solo los propietarios pueden configurar cobros' }, { status: 403 });
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!key || key.includes('mock')) return NextResponse.json({ error: 'Stripe Connect requiere una clave real configurada' }, { status: 503 });
  try {
    const stripe = new Stripe(key);
    let accountId = user.stripeAccountId;
    if (!accountId) {
      const account = await stripe.accounts.create({ type: 'express', email: user.email, capabilities: { card_payments: { requested: true }, transfers: { requested: true } } });
      accountId = account.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeAccountId: accountId },
        select: { id: true, stripeAccountId: true },
      });
    }
    const accountSession = await stripe.accountSessions.create({
      account: accountId,
      components: {
        account_onboarding: {
          enabled: true,
          features: { external_account_collection: true },
        },
      },
    });
    return NextResponse.json({ success: true, clientSecret: accountSession.client_secret });
  } catch (error: any) {
    console.error('Stripe Connect onboarding error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    const message = typeof error?.message === 'string' ? error.message : '';
    if (message.includes('complete your platform profile')) {
      return NextResponse.json({
        error: 'Stripe requiere completar el perfil de la plataforma Vaneando antes de conectar cuentas reales de propietarios.',
        setupRequired: true,
        dashboardUrl: 'https://dashboard.stripe.com/connect/accounts/overview',
      }, { status: 409 });
    }
    return NextResponse.json({ error: 'No se pudo iniciar la configuración segura de cobros' }, { status: 502 });
  }
}
