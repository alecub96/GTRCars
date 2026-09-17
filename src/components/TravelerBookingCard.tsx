'use client';

import Link from 'next/link';
import { CalendarDays, ChevronRight, Clock3, CreditCard, MapPin, MessageCircle, ShieldCheck, Star, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

const labels: Record<string, [string, string]> = {
  REQUESTED: ['Solicitud en Bóveda', 'bg-amber-500/15 text-amber-300 border border-amber-500/30'],
  OWNER_ACCEPTED: ['Aprobada · Pago de Reserva', 'bg-blue-500/15 text-blue-300 border border-blue-500/30'],
  PAYMENT_PENDING: ['Depósito de Fianza Pendiente', 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40'],
  CONFIRMED: ['Confirmada & Telemetría Lista', 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'],
  ACTIVE: ['Pilotaje en Curso', 'bg-[#D4AF37] text-black font-black'],
  COMPLETED: ['Jornada Finalizada', 'bg-white/10 text-white/70 border border-white/15'],
  CANCELLED: ['Cancelada', 'bg-red-500/15 text-red-300 border border-red-500/30'],
  OWNER_REJECTED: ['No Aprobada', 'bg-red-500/15 text-red-300 border border-red-500/30'],
};

export default function TravelerBookingCard({ booking: initial }: { booking: any }) {
  const [booking, setBooking] = useState(initial);
  const [message, setMessage] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const status = labels[booking.status] || [booking.status, 'bg-white/10 text-white/70 border border-white/10'];
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
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f12] text-white shadow-xl">
      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="relative h-52 md:h-full min-h-[190px] bg-black">
          <img
            src={booking.vehicle?.photos?.[0]?.url || '/supercars/ferrari_296.jpg'}
            alt={booking.vehicle?.title || 'Superdeportivo'}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-[#0f0f12]/80 md:to-[#0f0f12]" />
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  COD // {booking.code}
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                  {booking.vehicle?.title || 'Superdeportivo'}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                  {booking.vehicle?.island || 'Canarias'}
                </p>
              </div>
              <span className={`rounded-full px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${status[1]}`}>
                {status[0]}
              </span>
            </div>

            <div className="my-5 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs font-mono">
              <div>
                <div className="flex items-center gap-1.5 text-white/50 mb-1">
                  <CalendarDays className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span className="uppercase text-[10px] tracking-wider">Jornada</span>
                </div>
                <strong className="block text-white text-xs sm:text-sm">
                  {new Date(booking.pickupDate).toLocaleDateString('es-ES')} → {new Date(booking.returnDate).toLocaleDateString('es-ES')}
                </strong>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-white/50 mb-1">
                  <CreditCard className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span className="uppercase text-[10px] tracking-wider">Tarifa Total</span>
                </div>
                <strong className="block text-base sm:text-lg font-black text-[#D4AF37]">
                  {booking.totalAmount} €
                </strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/5">
            {['OWNER_ACCEPTED', 'PAYMENT_PENDING'].includes(booking.status) && (
              <Link
                href={`/reserva/${booking.id}`}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] px-4 py-2.5 text-xs font-mono font-black uppercase tracking-wider text-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <ShieldCheck className="h-4 w-4" />
                Firmar Contrato & Pagar
              </Link>
            )}
            {['CONFIRMED', 'CHECKIN_PENDING'].includes(booking.status) && (
              <Link
                href={`/checkin?bookingId=${booking.id}`}
                className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-mono font-black uppercase tracking-wider text-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <ShieldCheck className="h-4 w-4" />
                Acta de Entrega Digital
              </Link>
            )}
            <Link
              href={conversationHref}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-mono font-bold text-white hover:border-[#D4AF37]/50 hover:bg-white/[0.08] transition-all"
            >
              <MessageCircle className="h-4 w-4 text-[#D4AF37]" />
              Chat con Propietario
            </Link>
            {['REQUESTED', 'OWNER_ACCEPTED', 'PAYMENT_PENDING'].includes(booking.status) && (
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
              >
                Cancelar Solicitud
              </button>
            )}
            {booking.status === 'COMPLETED' && (
              <button
                type="button"
                onClick={() => setReviewing(true)}
                className="flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2.5 text-xs font-mono font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
              >
                <Star className="h-4 w-4" />
                Valorar Experiencia
              </button>
            )}
          </div>

          {message && <p className="mt-3 text-xs font-mono text-amber-300">{message}</p>}
        </div>
      </div>

      {confirmCancel && (
        <div className="border-t border-red-500/30 bg-red-950/40 p-5 font-mono">
          <div className="flex items-start gap-3">
            <Clock3 className="h-5 w-5 shrink-0 text-red-400" />
            <div className="flex-1">
              <strong className="text-sm text-red-200">¿Cancelar esta solicitud de reserva?</strong>
              <p className="mt-1 text-xs text-red-300/80">
                Las fechas bloqueadas en la bóveda se liberarán inmediatamente.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={cancel}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition-colors"
                >
                  Sí, Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              className="text-white/40 hover:text-white"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {reviewing && (
        <form onSubmit={review} className="space-y-3 border-t border-white/10 bg-black/60 p-5 font-sans">
          <strong className="text-base font-bold text-white block font-mono">Valora tu experiencia de pilotaje</strong>
          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="w-full rounded-xl border border-white/15 bg-[#0f0f12] p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value} className="bg-black">
                {value} estrellas — {value === 5 ? 'Excelente' : value === 4 ? 'Muy Buena' : value === 3 ? 'Aceptable' : 'Mejorable'}
              </option>
            ))}
          </select>
          <textarea
            required
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Comenta las sensaciones al volante y la atención del propietario..."
            className="w-full rounded-xl border border-white/15 bg-[#0f0f12] p-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
          />
          <button className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-mono font-black uppercase text-black hover:brightness-110 transition-all">
            Enviar Valoración
            <ChevronRight className="h-4 w-4" />
          </button>
        </form>
      )}
    </article>
  );
}
