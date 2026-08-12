'use client';

import { useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CheckoutElementsProvider,
  PaymentElement,
  useCheckoutElements,
} from '@stripe/react-stripe-js/checkout';
import { CreditCard, Lock, X } from 'lucide-react';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);

function PaymentForm({ returnUrl, onClose }: { returnUrl: string; onClose: () => void }) {
  const checkoutState = useCheckoutElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (checkoutState.type !== 'success') return;
    setSubmitting(true);
    setError('');
    const result = await checkoutState.checkout.confirm({ returnUrl, redirect: 'if_required' });
    if (result.type === 'error') {
      setError(result.error.message || 'No se pudo confirmar el pago');
      setSubmitting(false);
      return;
    }
    window.location.assign(returnUrl);
  }

  if (checkoutState.type === 'loading') return <p className="p-8 text-center text-sm">Preparando pago seguro…</p>;
  if (checkoutState.type === 'error') return <p className="p-8 text-center text-sm text-red-700">{checkoutState.error.message}</p>;

  return (
    <form onSubmit={submit} className="space-y-5">
      <PaymentElement options={{ layout: 'accordion' }} />
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className="rounded-full border border-[#E9E1D2] px-5 py-3 text-sm font-bold">Volver</button>
        <button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16B8AA] px-6 py-3 text-sm font-bold text-white disabled:bg-slate-300">
          <Lock className="h-4 w-4" />{submitting ? 'Confirmando…' : 'Confirmar pago seguro'}
        </button>
      </div>
    </form>
  );
}

export default function StripePaymentElement({ clientSecret, bookingId, onClose }: { clientSecret: string; bookingId: string; onClose: () => void }) {
  const returnUrl = useMemo(() => `${window.location.origin}/reserva/${bookingId}?pago=procesado`, [bookingId]);
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#13322E]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Pago seguro">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <header className="mb-6 flex items-start justify-between gap-4 border-b border-[#E9E1D2] pb-5">
          <div><span className="text-[10px] font-black uppercase tracking-[.2em] text-[#16B8AA]">Pago integrado</span><h2 className="flex items-center gap-2 font-serif text-3xl font-bold"><CreditCard className="h-6 w-6" />Completa tu reserva</h2><p className="mt-1 text-sm text-[#6B726E]">Tus datos se envían cifrados directamente a Stripe y nunca pasan por nuestros servidores.</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar pago" className="rounded-full border border-[#E9E1D2] p-2"><X className="h-5 w-5" /></button>
        </header>
        <CheckoutElementsProvider stripe={stripePromise} options={{ clientSecret, elementsOptions: { appearance: { variables: { colorPrimary: '#16B8AA', colorText: '#13322E', borderRadius: '14px', fontFamily: 'Arial, sans-serif' } } } }}>
          <PaymentForm returnUrl={returnUrl} onClose={onClose} />
        </CheckoutElementsProvider>
      </div>
    </div>
  );
}
