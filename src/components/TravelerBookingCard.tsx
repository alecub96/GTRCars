'use client';

import Link from 'next/link';
import { CalendarDays, ChevronRight, Clock3, CreditCard, MapPin, MessageCircle, ShieldCheck, Star, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

const labels: Record<string, [string, string]> = {
  REQUESTED: ['Solicitud en Garaje', 'bg-amber-50 text-amber-800 border border-amber-200'],
  OWNER_ACCEPTED: ['Aprobada · Pago de Reserva', 'bg-blue-50 text-blue-800 border border-blue-200'],
  PAYMENT_PENDING: ['Depósito Pendiente', 'bg-gray-100 text-black border border-gray-300'],
  CONFIRMED: ['Confirmada & Preparada', 'bg-emerald-50 text-emerald-800 border border-emerald-200'],
  ACTIVE: ['En Curso', 'bg-black text-white font-black'],
  COMPLETED: ['Jornada Finalizada', 'bg-gray-100 text-gray-700 border border-gray-200'],
  CANCELLED: ['Cancelada', 'bg-red-50 text-red-700 border border-red-200'],
  OWNER_REJECTED: ['No Aprobada', 'bg-red-50 text-red-700 border border-red-200'],
};

export default function TravelerBookingCard({ booking: initial }: { booking: any }) {
  const [booking, setBooking] = useState(initial);
  const [message, setMessage] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const status = labels[booking.status] || [booking.status, 'bg-gray-100 text-gray-700 border border-gray-200'];
  const conversationHref = booking.conversations?.[0]?.id
    ? `/mensajes?conversationId=${booking.conversations[0].id}`
    : `/mensajes?bookingId=${booking.id}`;

  async function cancel() {
    const response = await fetch(`/api/bookings/${booking.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    });
    const data = await response.json();
    if (response.ok) {
      setBooking({ ...booking, status: data.booking.status });
      setConfirmCancel(false);
    } else {
      setMessage(data.error);
    }
  }

  async function review(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id, rating, comment }),
    });
    const data = await response.json();
    setMessage(response.ok ? 'Reseña enviada con éxito' : data.error);
    if (response.ok) setReviewing(false);
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white text-black shadow-lg">
      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="relative h-52 md:h-full min-h-[190px] bg-gray-50 border-r border-gray-100">
          <img
            src={booking.vehicle?.photos?.[0]?.url || '/supercars/ferrari-296.jpg'}
            alt={booking.vehicle?.title || 'Superdeportivo'}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">
                  COD // {booking.code}
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-black mt-0.5 font-sans">
                  {booking.vehicle?.title || 'Superdeportivo'}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-black" />
                  {booking.vehicle?.island || 'Canarias'}
                </p>
              </div>
              <span className={`rounded-full px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${status[1]}`}>
                {status[0]}
              </span>
            </div>

            <div className="my-5 grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs font-mono">
              <div>
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <CalendarDays className="h-3.5 w-3.5 text-black" />
                  <span className="uppercase text-[10px] tracking-wider">Jornada</span>
                </div>
                <strong className="block text-black text-xs sm:text-sm font-bold">
                  {new Date(booking.pickupDate).toLocaleDateString('es-ES')} → {new Date(booking.returnDate).toLocaleDateString('es-ES')}
                </strong>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <CreditCard className="h-3.5 w-3.5 text-black" />
                  <span className="uppercase text-[10px] tracking-wider">Tarifa Total</span>
                </div>
                <strong className="block text-base sm:text-lg font-black text-black">
                  {booking.totalAmount} €
                </strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-gray-100">
            {['OWNER_ACCEPTED', 'PAYMENT_PENDING'].includes(booking.status) && (
              <Link
                href={`/reserva/${booking.id}`}
                className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-mono font-black uppercase tracking-wider text-white hover:bg-gray-800 transition-all shadow-sm"
              >
                <ShieldCheck className="h-4 w-4" />
                Firmar Contrato & Pagar
              </Link>
            )}
            {['CONFIRMED', 'CHECKIN_PENDING'].includes(booking.status) && (
              <Link
                href={`/checkin?bookingId=${booking.id}`}
                className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-mono font-black uppercase tracking-wider text-white hover:bg-gray-800 transition-all shadow-sm"
              >
                <ShieldCheck className="h-4 w-4" />
                Acta de Entrega Digital
              </Link>
            )}
            <Link
              href={conversationHref}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-mono font-bold text-black hover:bg-gray-100 transition-all shadow-xs"
            >
              <MessageCircle className="h-4 w-4 text-black" />
              Chat con Propietario
            </Link>
            {['REQUESTED', 'OWNER_ACCEPTED', 'PAYMENT_PENDING'].includes(booking.status) && (
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="rounded-full px-3.5 py-2.5 text-xs font-mono font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                Cancelar Solicitud
              </button>
            )}
            {booking.status === 'COMPLETED' && (
              <button
                type="button"
                onClick={() => setReviewing(true)}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-mono font-bold text-black hover:bg-gray-100 transition-all"
              >
                <Star className="h-4 w-4 text-black" />
                Valorar Experiencia
              </button>
            )}
          </div>

          {message && <p className="mt-3 text-xs font-mono text-amber-700">{message}</p>}
        </div>
      </div>

      {confirmCancel && (
        <div className="border-t border-red-200 bg-red-50 p-5 font-mono">
          <div className="flex items-start gap-3">
            <Clock3 className="h-5 w-5 shrink-0 text-red-600" />
            <div className="flex-1">
              <strong className="text-sm text-red-900">¿Cancelar esta solicitud de reserva?</strong>
              <p className="mt-1 text-xs text-red-700">
                Las fechas bloqueadas en el garaje se liberarán inmediatamente.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={cancel}
                  className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors"
                >
                  Sí, Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              className="text-gray-400 hover:text-black"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {reviewing && (
        <form onSubmit={review} className="space-y-3 border-t border-gray-200 bg-gray-50 p-5 font-sans">
          <strong className="text-base font-bold text-black block font-mono">Valora tu experiencia de pilotaje</strong>
          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-black focus:border-black focus:outline-none"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value} className="bg-white">
                {value} estrellas — {value === 5 ? 'Excelente' : value === 4 ? 'Muy Buena' : value === 3 ? 'Aceptable' : 'Mejorable'}
              </option>
            ))}
          </select>
          <textarea
            required
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Comenta las sensaciones al volante y la atención del propietario..."
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
          />
          <button className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-mono font-black uppercase text-white hover:bg-gray-800 transition-all">
            Enviar Valoración
            <ChevronRight className="h-4 w-4" />
          </button>
        </form>
      )}
    </article>
  );
}
