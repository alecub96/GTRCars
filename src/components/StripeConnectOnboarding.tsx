'use client';

import { useMemo } from 'react';
import { loadConnectAndInitialize } from '@stripe/connect-js/pure';
import { ConnectAccountOnboarding, ConnectComponentsProvider } from '@stripe/react-connect-js';
import { Landmark, X } from 'lucide-react';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

async function fetchClientSecret() {
  const response = await fetch('/api/stripe/connect', { method: 'POST' });
  const data = await response.json();
  if (!response.ok || !data.clientSecret) throw new Error(data.error || 'No se pudo preparar la cuenta bancaria');
  return data.clientSecret as string;
}

export default function StripeConnectOnboarding({ onClose }: { onClose: () => void }) {
  const connectInstance = useMemo(() => loadConnectAndInitialize({
    publishableKey,
    fetchClientSecret,
    appearance: { variables: { colorPrimary: '#16B8AA', colorText: '#13322E', borderRadius: '14px', fontFamily: 'Arial, sans-serif' } },
  }), []);

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto bg-[#13322E]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Configuración bancaria">
      <div className="mx-auto my-6 w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <header className="mb-6 flex items-start justify-between gap-4 border-b border-[#E9E1D2] pb-5">
          <div><span className="text-[10px] font-black uppercase tracking-[.2em] text-[#16B8AA]">Cobros protegidos</span><h2 className="flex items-center gap-2 font-serif text-3xl font-bold"><Landmark className="h-6 w-6" />Configura tus transferencias</h2><p className="mt-1 text-sm text-[#6B726E]">Añade tu identidad e IBAN sin salir de Vaneando. Stripe verifica y custodia los datos bancarios.</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar configuración" className="rounded-full border border-[#E9E1D2] p-2"><X className="h-5 w-5" /></button>
        </header>
        <ConnectComponentsProvider connectInstance={connectInstance}>
          <ConnectAccountOnboarding
            onExit={onClose}
            fullTermsOfServiceUrl={`${window.location.origin}/terminos`}
            privacyPolicyUrl={`${window.location.origin}/privacidad`}
            collectionOptions={{ fields: 'eventually_due', futureRequirements: 'include' }}
          />
        </ConnectComponentsProvider>
      </div>
    </div>
  );
}
