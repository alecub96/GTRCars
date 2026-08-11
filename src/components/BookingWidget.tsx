'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculatePricing } from '@/lib/pricing';
import DateRangeCalendar from '@/components/DateRangeCalendar';

interface BookingWidgetProps {
  vehicle: {
    id: string;
    basePricePerDay: number;
    cleaningFee: number;
    ownershipType: 'PLATFORM' | 'THIRD_PARTY';
    securityDeposit: number;
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
      })
    : null;

  const handleBookingSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Por favor selecciona las fechas de viaje');
      return;
    }
    setError('');
    setLoading(true);

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
        throw new Error(data.error || 'Error al procesar reserva');
      }

      router.push(`/reserva/${data.booking.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E9E1D2] shadow-xl sticky top-28 space-y-6">
      <div className="flex items-baseline justify-between pb-4 border-b border-[#E9E1D2]">
        <div>
          <span className="font-serif text-3xl font-semibold text-[#1C2826]">{vehicle.basePricePerDay}€</span>
          <span className="text-xs text-[#6B726E]"> /día</span>
        </div>
        <span className="text-xs font-semibold text-[#E07A5F] uppercase tracking-wider">Fianza {vehicle.securityDeposit}€</span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
          {error}
        </div>
      )}

      {/* SELECCIÓN DE FECHAS */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B726E]">Fechas de Viaje</label>
        <DateRangeCalendar startDate={startDate} endDate={endDate} blocked={blocked} onChange={(start, end) => { setStartDate(start); setEndDate(end); }} />
      </div>

      {/* EXTRAS */}
      {vehicle.extras.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B726E]">Extras Opcionales</label>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {vehicle.extras.map((ve) => (
              <label
                key={ve.extra.id}
                onClick={() => toggleExtra(ve.extra.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedExtraIds.includes(ve.extra.id)
                    ? 'bg-[#1C2826] text-white border-[#1C2826]'
                    : 'bg-[#F7F6F2] border-[#E9E1D2] text-[#1C2826]'
                }`}
              >
                <span>{ve.extra.name}</span>
                <span className="font-semibold">+{ve.extra.price}€</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* DESGLOSE AUTORITATIVO DE PRECIOS */}
      {pricing && (
        <div className="pt-4 border-t border-[#E9E1D2] space-y-2 text-xs text-[#4A4643]">
          <div className="flex justify-between">
            <span>{vehicle.basePricePerDay}€ x {pricing.totalDays} días</span>
            <span>{pricing.basePriceTotal}€</span>
          </div>
          {pricing.discountPct > 0 && (
            <div className="flex justify-between text-green-700 font-semibold">
              <span>Descuento estancia larga</span>
              <span>-{(pricing.discountPct * 100).toFixed(0)}%</span>
            </div>
          )}
          {pricing.extrasTotal > 0 && (
            <div className="flex justify-between">
              <span>Extras seleccionados</span>
              <span>+{pricing.extrasTotal}€</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Limpieza y preparación</span>
            <span>+{pricing.cleaningFee}€</span>
          </div>
          <div className="flex justify-between">
            <span>Gastos de gestión / seguro</span>
            <span>+{pricing.travelerFee}€</span>
          </div>

          <div className="pt-3 border-t border-[#E9E1D2] flex justify-between text-base font-serif font-semibold text-[#1C2826]">
            <span>Total Reserva</span>
            <span>{pricing.totalAmount}€</span>
          </div>
        </div>
      )}

      {/* CTA RESERVA */}
      <button
        onClick={handleBookingSubmit}
        disabled={loading}
        className="w-full py-4 rounded-full bg-[#1C2826] text-white font-semibold text-sm hover:bg-[#2C3E3B] transition-all shadow-md"
      >
        {loading ? 'Procesando...' : 'SOLICITAR RESERVA'}
      </button>

      <p className="text-[11px] text-center text-[#6B726E] font-light">
        No se realizará ningún cargo hasta que confirmes la reserva.
      </p>
    </div>
  );
}
