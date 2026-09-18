'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, X, CheckCircle2, ShieldCheck, Lock, CreditCard, Sparkles, ExternalLink } from 'lucide-react';

export default function StripeConnectOnboarding({ onClose }: { onClose: () => void }) {
  const [iban, setIban] = useState('');
  const [bankHolder, setBankHolder] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [stripeExpressLoading, setStripeExpressLoading] = useState(false);

  useEffect(() => {
    fetch('/api/owner/bank-account')
      .then((res) => res.json())
      .then((data) => {
        if (data.iban) setIban(data.iban);
        if (data.bankHolder) setBankHolder(data.bankHolder);
        if (data.configured) setIsConfigured(true);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/owner/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iban, bankHolder }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudieron guardar los datos bancarios');

      setSuccessMsg('Cuenta bancaria guardada y verificada correctamente para liquidaciones directas.');
      setIsConfigured(true);
      if (data.iban) setIban(data.iban);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el código IBAN');
    } finally {
      setLoading(false);
    }
  };

  const handleStartStripeExpress = async () => {
    setErrorMsg('');
    setStripeExpressLoading(true);
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo inicializar la pasarela de Stripe Connect');
      }
      if (data.clientSecret) {
        setSuccessMsg('Sesión de Stripe Connect creada. Completa los pasos en la ventana emergente.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con Stripe');
    } finally {
      setStripeExpressLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] overflow-y-auto bg-black/60 p-4 backdrop-blur-xs flex items-center justify-center font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Configuración bancaria"
    >
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-200 text-black relative animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* CABECERA ESTÉTICA PORSCHE */}
        <header className="mb-6 flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              <span>STRIPE CONNECT // LIQUIDACIONES GTR CARS</span>
            </div>
            <h2 className="flex items-center gap-2 text-2xl sm:text-3xl font-black text-black uppercase tracking-tight font-sans">
              <Landmark className="h-6 w-6 text-black" /> Cobro de Alquileres
            </h2>
            <p className="mt-1 text-xs text-gray-500 font-sans">
              Configura tu cuenta bancaria (SEPA/IBAN) donde recibirás los pagos íntegros de cada alquiler sin comisiones.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar configuración"
            className="rounded-full border border-gray-200 p-2 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* MENSAJES DE ESTADO */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              {successMsg}
            </span>
          </div>
        )}

        {isConfigured && !successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-black text-xs font-mono font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cuenta IBAN registrada y vinculada para transferencias automáticas.</span>
          </div>
        )}

        {/* FORMULARIO BANCARIO */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
              Nombre y Apellidos del Titular / Razón Social
            </label>
            <input
              type="text"
              required
              value={bankHolder}
              onChange={(e) => setBankHolder(e.target.value)}
              placeholder="Ejemplo: Carlos Mendoza"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-sans font-bold text-black focus:outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
              Código IBAN (Cuenta Bancaria de España o Unión Europea)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="ES91 2100 0418 4502 0000 1234"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-mono font-bold text-black uppercase focus:outline-none focus:border-black focus:bg-white transition-all"
              />
              <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-sans">
              Compatible con cualquier cuenta bancaria en euros (ES, DE, FR, IT, etc.).
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading || fetching}
              className="w-full py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? 'Guardando...' : 'Guardar Cuenta IBAN para Liquidaciones'}</span>
            </button>
          </div>
        </form>

        {/* NOTA LEGAL Y GARANTÍA */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-[11px] text-gray-400 font-sans leading-relaxed flex items-start space-x-2">
          <Lock className="w-4 h-4 text-black shrink-0 mt-0.5" />
          <span>
            Tus datos bancarios quedan encriptados con seguridad SSL de nivel bancario. Las transferencias se gestionan a través de la pasarela Stripe Connect tras la culminación de cada alquiler.
          </span>
        </div>
      </div>
    </div>
  );
}
