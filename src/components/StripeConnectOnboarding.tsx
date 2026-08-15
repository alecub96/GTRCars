'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, X, CheckCircle2, ShieldCheck, Lock, CreditCard, Sparkles } from 'lucide-react';

export default function StripeConnectOnboarding({ onClose }: { onClose: () => void }) {
  const [iban, setIban] = useState('');
  const [bankHolder, setBankHolder] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

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

      setSuccessMsg('✅ ¡Excelente! Tu IBAN bancario ha sido guardado y verificado correctamente.');
      setIsConfigured(true);
      if (data.iban) setIban(data.iban);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el código IBAN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] overflow-y-auto bg-[#13322E]/70 p-4 backdrop-blur-md flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Configuración bancaria"
    >
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#E9E1D2] text-[#13322E] relative animate-fade-in my-auto">
        {/* CABECERA */}
        <header className="mb-6 flex items-start justify-between gap-4 border-b border-[#E9E1D2] pb-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#16B8AA] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Cobros Protegidos Vaneando
            </span>
            <h2 className="flex items-center gap-2 font-serif text-2xl sm:text-3xl font-bold text-[#13322E] mt-1">
              <Landmark className="h-7 w-7 text-[#16B8AA]" /> Configura tu Cuenta Bancaria
            </h2>
            <p className="mt-1 text-xs text-[#6B726E] font-medium">
              Introduce el IBAN donde deseas recibir las transferencias de las reservas de tus campers.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar configuración"
            className="rounded-full border border-[#E9E1D2] p-2 hover:bg-[#F7F6F2] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 text-[#13322E]" />
          </button>
        </header>

        {/* MENSAJES DE ESTADO */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <span>{successMsg}</span>
          </div>
        )}

        {isConfigured && !successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#16B8AA]/10 border border-[#16B8AA]/30 text-[#13322E] text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
            <span>Ya tienes tu cuenta IBAN registrada para recibir pagos automáticos.</span>
          </div>
        )}

        {/* FORMULARIO BANCARIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              Nombre y Apellidos del Titular de la Cuenta
            </label>
            <input
              type="text"
              required
              value={bankHolder}
              onChange={(e) => setBankHolder(e.target.value)}
              placeholder="Ejemplo: Alejandro González Barranco"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-[#13322E] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              Código IBAN (Cuenta Bancaria de España o Europa)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="ES91 2100 0418 4502 0000 1234"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono font-bold text-[#13322E] uppercase focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
              />
              <CreditCard className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
            <p className="text-[11px] text-[#6B726E] mt-1 font-medium">
              Aceptamos cualquier código IBAN europeo (ES, DE, FR, etc.).
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || fetching}
              className="w-full py-3.5 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] text-white font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Guardando Datos...' : 'Guardar Cuenta IBAN para Cobros'}</span>
            </button>
          </div>
        </form>

        {/* NOTA LEGAL Y GARANTÍA */}
        <div className="mt-6 pt-5 border-t border-[#E9E1D2] text-[11px] text-[#6B726E] font-medium leading-relaxed flex items-start space-x-2">
          <Lock className="w-4 h-4 text-[#16B8AA] shrink-0 mt-0.5" />
          <span>
            Tus datos bancarios quedan encriptados con seguridad SSL de nivel bancario. Las transferencias netas se emitirán automáticamente en un plazo de 7 días hábiles después de que finalice el periodo de alquiler.
          </span>
        </div>
      </div>
    </div>
  );
}
