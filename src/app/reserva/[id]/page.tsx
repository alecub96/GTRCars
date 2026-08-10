'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CheckCircle2, CreditCard, Lock, ShieldCheck, Download, AlertCircle } from 'lucide-react';

interface BookingCheckoutProps {
  params: Promise<{ id: string }>;
}

export default function BookingCheckoutClient({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al pagar');

      setPaid(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C2826]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-[#E6E1DA] shadow-xl space-y-8">
          
          <div className="border-b border-[#E6E1DA] pb-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07A5F]">
              Confirmación y Firma de Contrato
            </span>
            <h1 className="font-serif text-3xl font-normal mt-1">Reserva #{id.substring(0, 8)}</h1>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          {/* PASO 1: FIRMA DE CONTRATO DE ALQUILER */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold flex items-center space-x-2">
              <CheckCircle2 className={`w-5 h-5 ${signed ? 'text-green-600' : 'text-[#7A7571]'}`} />
              <span>1. Contrato de Alquiler de Vehículo sin Conductor en España</span>
            </h3>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E6E1DA] text-xs text-[#4A4643] h-32 overflow-y-auto font-light leading-relaxed">
              El arrendatario acepta las condiciones generales de alquiler de camper vans en las Islas Canarias. El vehículo entregado debe devolverse con los mismos niveles de combustible y en idénticas condiciones de limpieza. La fianza retenida cubrirá posibles desperfectos o excesos de kilometraje según contrato.
            </div>

            {!signed ? (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-[#4A4643]">Firma Digital (Escribe tu Nombre Completo):</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Ej. Marc García López"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6E1DA] bg-white text-sm"
                  />
                  <button
                    onClick={() => {
                      if (signatureText.trim().length > 3) setSigned(true);
                    }}
                    className="px-6 py-2.5 bg-[#1C2826] text-white font-semibold text-xs rounded-xl hover:bg-[#2C3E3B] transition-colors"
                  >
                    Firmar
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-green-50 text-green-800 rounded-xl text-xs font-medium border border-green-200">
                ✓ Contrato firmado digitalmente por {signatureText}
              </div>
            )}
          </div>

          {/* PASO 2: PAGO SEGURO STRIPE */}
          <div className="space-y-4 border-t border-[#E6E1DA] pt-6">
            <h3 className="font-serif text-xl font-semibold flex items-center space-x-2">
              <CreditCard className={`w-5 h-5 ${paid ? 'text-green-600' : 'text-[#7A7571]'}`} />
              <span>2. Pago Seguro y Confirmación</span>
            </h3>

            {!paid ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#F3EFEA] rounded-2xl border border-[#E6E1DA] flex items-center justify-between text-xs">
                  <span className="font-medium">Total a Pagar ahora:</span>
                  <span className="font-serif text-xl font-semibold text-[#1C2826]">Confirmar en el siguiente paso</span>
                </div>

                <button
                  onClick={handlePay}
                  disabled={!signed || loading}
                  className={`w-full py-4 rounded-full font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2 ${
                    signed
                      ? 'bg-[#E07A5F] text-white hover:bg-[#D0694E]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'Procesando con Stripe...' : 'PAGAR Y CONFIRMAR RESERVA'}</span>
                </button>
              </div>
            ) : (
              <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h4 className="font-serif text-2xl font-semibold text-green-900">¡Reserva Confirmada con Éxito!</h4>
                <p className="text-xs text-green-800">
                  Hemos enviado la confirmación y el documento del contrato a tu correo electrónico.
                </p>
                <button
                  onClick={() => router.push('/cuenta')}
                  className="px-6 py-2.5 bg-green-900 text-white rounded-full text-xs font-semibold hover:bg-green-950"
                >
                  Ir a Mis Viajes
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
