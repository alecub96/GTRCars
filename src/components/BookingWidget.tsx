'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculatePricing } from '@/lib/pricing';
import DateRangeCalendar from '@/components/DateRangeCalendar';
import { analytics } from '@/lib/analytics';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

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

  const draftKey = `gtrcars_draft_booking_${vehicle.id}`;

  // Recuperar embudo abandonado (#65, #74, #86 WEB 250)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(draftKey) || sessionStorage.getItem('pending_booking');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.vehicleId === vehicle.id) {
          if (parsed.startDate) setStartDate(parsed.startDate);
          if (parsed.endDate) setEndDate(parsed.endDate);
          if (Array.isArray(parsed.selectedExtraIds)) setSelectedExtraIds(parsed.selectedExtraIds);
        }
      }
    } catch {}
  }, [vehicle.id, draftKey]);

  // Persistir selección en borrador para no perder datos ante error o recarga
  useEffect(() => {
    if (!startDate && !endDate) return;
    try {
      sessionStorage.setItem(
        draftKey,
        JSON.stringify({
          vehicleId: vehicle.id,
          startDate,
          endDate,
          selectedExtraIds,
        })
      );
    } catch {}
  }, [vehicle.id, startDate, endDate, selectedExtraIds, draftKey]);

  useEffect(() => {
    fetch(`/api/vehicles/${vehicle.id}/availability`)
      .then((response) => response.json())
      .then((data) => setBlocked(data.blocks || []))
      .catch(() => setBlocked([]));
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

  const pricing =
    startDate && endDate
      ? calculatePricing({
          basePricePerDay: vehicle.basePricePerDay,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          selectedExtras: selectedExtrasObj,
          cleaningFee: vehicle.cleaningFee,
          ownershipType: vehicle.ownershipType,
          pricingRules: vehicle.pricingRules?.map((rule) => ({
            startDate: new Date(rule.startDate),
            endDate: new Date(rule.endDate),
            pricePerDay: rule.pricePerDay,
          })),
        })
      : null;

  const handleBookingSubmit = async () => {
    if (loading) return; // Evita doble envío (#98 WEB 250)
    if (!startDate || !endDate) {
      setError('Selecciona las fechas de recogida y devolución en el calendario para calcular el total.');
      analytics.formError('booking', 'dates', 'missing_dates');
      return;
    }
    setError('');
    setLoading(true);
    analytics.beginCheckout(vehicle.id, pricing?.totalAmount, pricing?.totalDays);
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
                subtitle:
                  'Identifícate o crea tu cuenta en 30 segundos para continuar con tu reserva. Tus fechas seleccionadas están guardadas.',
              },
            })
          );
          setLoading(false);
          return;
        }
        throw new Error(data.error || 'Error al procesar la solicitud de reserva');
      }

      sessionStorage.removeItem(draftKey);
      sessionStorage.removeItem('pending_booking');
      analytics.track('booking_completed', {
        vehicle_id: vehicle.id,
        value: pricing?.totalAmount || vehicle.basePricePerDay,
        currency: 'EUR',
      });
      analytics.conversion('conversion', {
        conversion_type: 'booking_request',
        value: pricing?.totalAmount || vehicle.basePricePerDay,
      });

      router.push(`/reserva/${data.booking.id}`);
    } catch (err: any) {
      setError(err.message);
      analytics.formError('booking', 'submit', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl sticky top-28 space-y-6 text-black font-sans">
      <div className="flex items-baseline justify-between pb-5 border-b border-gray-100">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono block mb-1 font-bold">
            Tarifa Oficial Todo Transparente
          </span>
          <span className="font-mono text-3xl font-black text-black tracking-tight">
            {vehicle.basePricePerDay}€
          </span>
          <span className="text-xs text-gray-500 font-mono"> / día</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono block font-bold mb-1">
            {vehicle.ownershipType === 'PLATFORM' ? 'Fianza (Custodia GTR Cars)' : 'Fianza (Gestión Propietario)'}
          </span>
          <span className="text-xs font-mono font-bold text-black bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
            {vehicle.securityDeposit}€
          </span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-mono font-bold border border-red-200"
        >
          {error}
        </div>
      )}

      {/* SELECCIÓN DE FECHAS */}
      <div className="space-y-2">
        <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-700 font-bold">
          1. Selecciona Fechas de Conducción
        </label>
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-2">
          <DateRangeCalendar
            startDate={startDate}
            endDate={endDate}
            blocked={blocked}
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
              if (error) setError('');
            }}
          />
        </div>
      </div>

      {/* EXTRAS */}
      {vehicle.extras.length > 0 && (
        <div className="space-y-2">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-700 font-bold">
            2. Servicios de Entrega VIP (Opcional)
          </label>
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

      {/* DESGLOSE DE PRECIOS SIN SORPRESAS (#53, #54, #95, #96) */}
      {pricing ? (
        <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-600 font-mono">
          <div className="flex justify-between">
            <span>
              {vehicle.basePricePerDay}€ x {pricing.totalDays} {pricing.totalDays === 1 ? 'día' : 'días'}
            </span>
            <span className="text-black font-semibold">{pricing.basePriceTotal}€</span>
          </div>
          {pricing.discountPct > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Bonificación por alquiler extendido</span>
              <span>-{(pricing.discountPct * 100).toFixed(0)}%</span>
            </div>
          )}
          {pricing.extrasTotal > 0 && (
            <div className="flex justify-between">
              <span>Logística / Extras seleccionados</span>
              <span className="text-black font-semibold">+{pricing.extrasTotal}€</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Detallado y preparación técnica</span>
            <span className="text-black font-semibold">+{pricing.cleaningFee}€</span>
          </div>
          <div className="flex justify-between">
            <span>Custodia, contrato eIDAS y gestión</span>
            <span className="text-black font-semibold">+{pricing.travelerFee}€</span>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
            <div>
              <span className="text-xs uppercase tracking-widest text-black font-black block">
                Total Final
              </span>
              <span className="text-[10px] text-gray-500">Impuestos incluidos · Sin cargos ocultos</span>
            </div>
            <span className="text-2xl font-black font-mono text-black">{pricing.totalAmount}€</span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-[11px] font-mono text-gray-600">
          Marca el día de inicio y fin en el calendario superior para ver el desglose exacto antes de reservar.
        </div>
      )}

      {/* CTA PRINCIPAL (#43, #48, #49) */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleBookingSubmit}
          disabled={loading}
          data-analytics-cta="booking_widget_submit"
          className="w-full py-4 rounded-full bg-black text-white font-mono font-black text-xs uppercase tracking-widest hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-md disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? 'PROCESANDO SOLICITUD...'
            : vehicle.bookingType === 'INSTANT_BOOKING'
              ? 'RESERVAR SUPERDEPORTIVO AHORA'
              : 'SOLICITAR RESERVA Y CONTRATO'}
        </button>
        <p className="text-[11px] text-gray-600 font-mono text-center">
          No se realizará ningún cargo hasta que el propietario confirme y revises el contrato digital.
        </p>
      </div>

      {/* REDUCCIÓN DE RIESGO Y GARANTÍAS JUNTO AL PUNTO DE CONVERSIÓN (#50, #51, #52) */}
      <div className="pt-3 border-t border-gray-100 space-y-2 text-[11px] text-gray-600 font-mono">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-black shrink-0" />
          <span>Pago protegido por Stripe Connect con reembolso garantizado si el propietario no acepta.</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
          <span>Contrato digital eIDAS (UE 910/2014) y check-in fotográfico incluidos.</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-black shrink-0" />
          <span>Asistencia de Conserjería VIP 24/7 en entrega y devolución.</span>
        </div>
      </div>
    </div>
  );
}
