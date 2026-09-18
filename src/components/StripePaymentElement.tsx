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

  if (checkoutState.type === 'loading') return <p className="p-8 text-center text-xs font-mono text-gray-500">Iniciando pasarela de pago seguro Stripe…</p>;
  if (checkoutState.type === 'error') return <p className="p-8 text-center text-xs font-mono text-red-600 font-bold">{checkoutState.error.message}</p>;

  return (
    <form onSubmit={submit} className="space-y-5">
      <PaymentElement options={{ layout: 'accordion' }} />
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-mono font-bold text-red-700">{error}</p>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
        <button type="button" onClick={onClose} className="rounded-full border border-gray-200 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black hover:bg-gray-100 transition-colors">Volver</button>
        <button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-3 text-xs font-mono font-black uppercase tracking-widest text-white hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50">
          <Lock className="h-3.5 w-3.5" />{submitting ? 'Procesando…' : 'Confirmar Pago Seguro'}
        </button>
      </div>
    </form>
  );
}

export default function StripePaymentElement({ clientSecret, bookingId, onClose }: { clientSecret: string; bookingId: string; onClose: () => void }) {
  const returnUrl = useMemo(() => `${window.location.origin}/reserva/${bookingId}?pago=procesado`, [bookingId]);
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans" role="dialog" aria-modal="true" aria-label="Pago seguro">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8 border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        <header className="mb-6 flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[.25em] text-gray-500">BÓVEDA DE PAGO SEGURO // STRIPE</span>
            <h2 className="flex items-center gap-2 font-sans text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-0.5">
              <CreditCard className="h-6 w-6 text-black" /> Pago de Experiencia
            </h2>
            <p className="mt-1 text-xs text-gray-500 font-sans">Tus credenciales y tarjetas se encriptan bajo certificación PCI-DSS nivel 1 de Stripe.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar pago" className="rounded-full border border-gray-200 p-2 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"><X className="h-5 w-5" /></button>
        </header>
        <CheckoutElementsProvider stripe={stripePromise} options={{ clientSecret, elementsOptions: { appearance: { theme: 'stripe', variables: { colorPrimary: '#000000', colorText: '#000000', borderRadius: '12px', fontFamily: 'system-ui, sans-serif' } } } }}>
          <PaymentForm returnUrl={returnUrl} onClose={onClose} />
        </CheckoutElementsProvider>
      </div>
    </div>
  );
}
