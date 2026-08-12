'use client';

import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function AdminRefundButton({ bookingId, bookingCode }: { bookingId: string; bookingCode: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function refund() {
    if (!window.confirm(`¿Confirmas el reembolso íntegro de la reserva ${bookingCode}? Esta acción envía dinero real mediante Stripe.`)) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo procesar el reembolso');
      setMessage('Reembolso solicitado correctamente');
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'No se pudo procesar el reembolso');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <button type="button" disabled={loading} onClick={() => void refund()} className="inline-flex items-center gap-1 font-bold text-red-700 underline disabled:opacity-50">
        <RotateCcw className="h-3 w-3" /> {loading ? 'Procesando…' : 'Reembolsar'}
      </button>
      {message && <p className="mt-1 max-w-36 text-[10px] font-bold text-[#6B726E]">{message}</p>}
    </div>
  );
}
