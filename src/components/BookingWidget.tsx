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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl sticky top-28 space-y-6 text-black font-sans">
      <div className="flex items-baseline justify-between pb-5 border-b border-gray-100">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono block mb-1 font-bold">Tarifa Oficial</span>
          <span className="font-mono text-3xl font-black text-black tracking-tight">{vehicle.basePricePerDay}€</span>
          <span className="text-xs text-gray-500 font-mono"> / día</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono block font-bold">Fianza (Trato Directo)</span>
          <span className="text-xs font-mono font-bold text-black bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
            {vehicle.securityDeposit}€
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-mono border border-red-200">
          {error}
        </div>
      )}

      {/* SELECCIÓN DE FECHAS */}
      <div className="space-y-2">
        <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-600 font-bold">Fechas de Conducción</label>
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-2">
          <DateRangeCalendar startDate={startDate} endDate={endDate} blocked={blocked} onChange={(start, end) => { setStartDate(start); setEndDate(end); }} />
        </div>
      </div>

      {/* EXTRAS */}
      {vehicle.extras.length > 0 && (
        <div className="space-y-2">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-600 font-bold">Servicios Opcionales</label>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {vehicle.extras.map((ve) => (
              <label
                key={ve.extra.id}
                onClick={() => toggleExtra(ve.extra.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedExtraIds.includes(ve.extra.id)
                    ? 'bg-gray-100 border-black text-black font-bold shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:text-black'
                }`}
              >
                <span className="font-mono text-xs">{ve.extra.name}</span>
                <span className="font-mono font-bold text-black">+{ve.extra.price}€</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* DESGLOSE DE PRECIOS */}
      {pricing && (
        <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-600 font-mono">
          <div className="flex justify-between">
            <span>{vehicle.basePricePerDay}€ x {pricing.totalDays} días</span>
            <span className="text-black font-semibold">{pricing.basePriceTotal}€</span>
          </div>
          {pricing.discountPct > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Descuento periodo extendido</span>
              <span>-{(pricing.discountPct * 100).toFixed(0)}%</span>
            </div>
          )}
          {pricing.extrasTotal > 0 && (
            <div className="flex justify-between">
              <span>Servicios opcionales</span>
              <span className="text-black font-semibold">+{pricing.extrasTotal}€</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Detallado y entrega técnica</span>
            <span className="text-black font-semibold">+{pricing.cleaningFee}€</span>
          </div>
          <div className="flex justify-between">
            <span>Gestión de plataforma (9,7%)</span>
            <span className="text-black font-semibold">+{pricing.travelerFee}€</span>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Total</span>
            <span className="text-2xl font-black font-mono text-black">{pricing.totalAmount}€</span>
          </div>
        </div>
      )}

      {/* CTA RESERVA */}
      <button
        onClick={handleBookingSubmit}
        disabled={loading}
        className="w-full py-4 rounded-full bg-black text-white font-mono font-black text-xs uppercase tracking-widest hover:bg-gray-800 active:scale-[0.99] transition-all shadow-md disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'PROCESANDO SOLICITUD...' : vehicle.bookingType === 'INSTANT_BOOKING' ? 'RESERVAR SUPERDEPORTIVO AHORA' : 'SOLICITAR DISPONIBILIDAD'}
      </button>

      <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 font-mono text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-black shrink-0" />
        <span>Pago retenido con total seguridad y liquidado en 5 días hábiles tras concluir el alquiler</span>
      </div>
    </div>
  );
}
