import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  if (user.role !== 'OWNER') return NextResponse.json({ error: 'Solo los propietarios pueden configurar cobros' }, { status: 403 });
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!key || key.includes('mock')) return NextResponse.json({ error: 'Stripe Connect requiere una clave real configurada' }, { status: 503 });
  try {
    const stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia' as any });
    let accountId = user.stripeAccountId;
    if (!accountId) {
      const account = await stripe.accounts.create({ type: 'express', email: user.email, capabilities: { card_payments: { requested: true }, transfers: { requested: true } } });
      accountId = account.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeAccountId: accountId } });
    }
    const origin = new URL(request.url).origin;
    const link = await stripe.accountLinks.create({ account: accountId, refresh_url: `${origin}/propietario?stripe=refresh`, return_url: `${origin}/propietario?stripe=complete`, type: 'account_onboarding' });
    return NextResponse.json({ success: true, url: link.url });
  } catch (error: any) {
    console.error('Stripe Connect onboarding error:', error);
    const message = typeof error?.message === 'string' ? error.message : '';
    if (message.includes('complete your platform profile')) {
      return NextResponse.json({
        error: 'Stripe requiere completar el perfil de la plataforma Vaneando antes de conectar cuentas reales de propietarios.',
        setupRequired: true,
        dashboardUrl: 'https://dashboard.stripe.com/connect/accounts/overview',
      }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || 'No se pudo iniciar Stripe Connect' }, { status: 500 });
  }
}
