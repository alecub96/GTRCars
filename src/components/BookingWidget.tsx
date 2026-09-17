'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculatePricing } from '@/lib/pricing';
import DateRangeCalendar from '@/components/DateRangeCalendar';
import { analytics } from '@/lib/analytics';
import { ShieldCheck } from 'lucide-react';

interface BookingWidgetProps {
  vehicle: {
    id: string;
    basePricePerDay: number;
    cleaningFee: number;
    ownershipType: 'PLATFORM' | 'THIRD_PARTY';
    securityDeposit: number;
    bookingType: 'INSTANT_BOOKING' | 'REQUEST_TO_BOOK';
    minDays: number;
    maxDays: number;
    pricingRules?: { startDate: Date | string; endDate: Date | string; pricePerDay: number }[];
    extras: {
      extra: { id: string; name: string; price: number; priceType: 'PER_RENTAL' | 'PER_DAY' };
    }[];
  };
}

export default function BookingWidget({ vehicle }: BookingWidgetProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState<{ startDate: string; endDate: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/vehicles/${vehicle.id}/availability`).then((response) => response.json()).then((data) => setBlocked(data.blocks || [])).catch(() => setBlocked([]));
  }, [vehicle.id]);

  const toggleExtra = (id: string) => {
    if (selectedExtraIds.includes(id)) {
      setSelectedExtraIds(selectedExtraIds.filter((eId) => eId !== id));
    } else {
      setSelectedExtraIds([...selectedExtraIds, id]);
    }
  };

  const selectedExtrasObj = vehicle.extras
    .filter((ve) => selectedExtraIds.includes(ve.extra.id))
    .map((ve) => ve.extra);

  const pricing = startDate && endDate
    ? calculatePricing({
        basePricePerDay: vehicle.basePricePerDay,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        selectedExtras: selectedExtrasObj,
        cleaningFee: vehicle.cleaningFee,
        ownershipType: vehicle.ownershipType,
        pricingRules: vehicle.pricingRules?.map((rule) => ({ startDate: new Date(rule.startDate), endDate: new Date(rule.endDate), pricePerDay: rule.pricePerDay })),
      })
    : null;

  const handleBookingSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Por favor selecciona las fechas de viaje');
      return;
    }
    setError('');
    setLoading(true);
    analytics.track('booking_started', { vehicle_id: vehicle.id });
    analytics.formStart('booking');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          startDate,
          endDate,
          selectedExtraIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Si el usuario no ha iniciado sesión, guardamos la selección y abrimos el modal de registro/acceso
        if (res.status === 401 || data.error?.toLowerCase().includes('iniciar sesión')) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(
              'pending_booking',
              JSON.stringify({
                vehicleId: vehicle.id,
                startDate,
                endDate,
                selectedExtraIds,
              })
            );
          }
          window.dispatchEvent(
            new CustomEvent('open-auth-modal', {
              detail: {
                mode: 'register',
                subtitle: 'Crea tu cuenta o inicia sesión para confirmar tu reserva en un clic. Mantendremos tus fechas guardadas.',
              },
            })
          );
          setLoading(false);
          return;
        }
        throw new Error(data.error || 'Error al procesar reserva');
      }
      analytics.track('booking_completed', { vehicle_id: vehicle.id });
      analytics.conversion('conversion', { conversion_type: 'booking_request' });

      router.push(`/reserva/${data.booking.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f12]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl sticky top-28 space-y-6 text-white font-sans">
      <div className="flex items-baseline justify-between pb-5 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-mono block mb-1">Tarifa Exclusiva</span>
          <span className="font-mono text-3xl font-black text-white tracking-tight">{vehicle.basePricePerDay}€</span>
          <span className="text-xs text-white/50 font-mono"> / día</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono block">Fianza Escrow</span>
          <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
            {vehicle.securityDeposit}€
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/50 text-red-300 text-xs font-mono border border-red-500/30">
          {error}
        </div>
      )}

      {/* SELECCIÓN DE FECHAS */}
      <div className="space-y-2">
        <label className="block text-[11px] font-mono uppercase tracking-widest text-white/60">Fechas de Conducción</label>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-2">
          <DateRangeCalendar startDate={startDate} endDate={endDate} blocked={blocked} onChange={(start, end) => { setStartDate(start); setEndDate(end); }} />
        </div>
      </div>

      {/* EXTRAS */}
      {vehicle.extras.length > 0 && (
        <div className="space-y-2">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-white/60">Servicios VIP Opcionales</label>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {vehicle.extras.map((ve) => (
              <label
                key={ve.extra.id}
                onClick={() => toggleExtra(ve.extra.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedExtraIds.includes(ve.extra.id)
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                    : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="font-mono text-xs">{ve.extra.name}</span>
                <span className="font-mono font-bold text-[#D4AF37]">+{ve.extra.price}€</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* DESGLOSE DE PRECIOS */}
      {pricing && (
        <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-white/70 font-mono">
          <div className="flex justify-between">
            <span>{vehicle.basePricePerDay}€ x {pricing.totalDays} días</span>
            <span className="text-white font-medium">{pricing.basePriceTotal}€</span>
          </div>
          {pricing.discountPct > 0 && (
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Descuento periodo extendido</span>
              <span>-{(pricing.discountPct * 100).toFixed(0)}%</span>
            </div>
          )}
          {pricing.extrasTotal > 0 && (
            <div className="flex justify-between">
              <span>Servicios VIP seleccionados</span>
              <span className="text-[#D4AF37]">+{pricing.extrasTotal}€</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Detallado y entrega técnica</span>
            <span className="text-white font-medium">+{pricing.cleaningFee}€</span>
          </div>
          <div className="flex justify-between">
            <span>Cobertura VIP y Escrow</span>
            <span className="text-white font-medium">+{pricing.travelerFee}€</span>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-widest text-white/50">Total Estancia</span>
            <span className="text-2xl font-black font-mono text-[#D4AF37]">{pricing.totalAmount}€</span>
          </div>
        </div>
      )}

      {/* CTA RESERVA */}
      <button
        onClick={handleBookingSubmit}
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black font-mono font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'PROCESANDO PROTOCOLO...' : vehicle.bookingType === 'INSTANT_BOOKING' ? 'RESERVAR SUPERCAMPER AHORA' : 'SOLICITAR DISPONIBILIDAD VIP'}
      </button>

      <div className="flex items-center justify-center space-x-2 text-[10px] text-white/40 font-mono text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Depósito en custodia retenido hasta finalización del alquiler</span>
      </div>
    </div>
  );
}
