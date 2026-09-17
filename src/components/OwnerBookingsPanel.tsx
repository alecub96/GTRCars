'use client';

import Link from 'next/link';
import {
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock3,
  FileSignature,
  MessageCircle,
  Star,
  UserRound,
  WalletCards,
  X,
  Ban,
  AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';

const groups = {
  requests: ['REQUESTED'],
  confirmed: [
    'OWNER_ACCEPTED',
    'PAYMENT_PENDING',
    'CONFIRMED',
    'CHECKIN_PENDING',
    'ACTIVE',
    'CHECKOUT_PENDING',
    'DISPUTED',
  ],
  completed: ['COMPLETED', 'CANCELLED', 'OWNER_REJECTED', 'REFUNDED'],
} as const;

type BookingTab = keyof typeof groups;

type OwnerBooking = {
  id: string;
  code: string;
  status: string;
  pickupDate: string | Date;
  returnDate: string | Date;
  totalDays: number;
  totalAmount: number;
  ownerPayout: number;
  vehicle: { title: string };
  traveler: { firstName: string; lastName: string; email?: string };
  conversations?: Array<{ id: string }>;
};

const tabs: Array<[BookingTab, string]> = [
  ['requests', 'Solicitudes'],
  ['confirmed', 'En curso y Confirmadas'],
  ['completed', 'Terminadas / Canceladas'],
];

export default function OwnerBookingsPanel({ initialBookings }: { initialBookings: OwnerBooking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [tab, setTab] = useState<BookingTab>('requests');
  const [decision, setDecision] = useState<{ id: string; action: 'accept' | 'reject' } | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<OwnerBooking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingLoading, setCancellingLoading] = useState(false);
  const [reviewing, setReviewing] = useState<OwnerBooking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const visible = bookings.filter((booking) => groups[tab].some((status) => status === booking.status));

  async function decide() {
    if (!decision) return;
    setError('');
    const response = await fetch(`/api/bookings/${decision.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: decision.action }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'No se pudo actualizar la reserva');
      return;
    }
    setBookings((current) => current.map((booking) => (
      booking.id === decision.id ? { ...booking, status: data.booking.status } : booking
    )));
    setDecision(null);
  }

  async function handleCancelBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!cancellingBooking) return;
    if (!cancelReason.trim()) {
      setError('Debes especificar un motivo para la cancelación.');
      return;
    }

    setCancellingLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/bookings/${cancellingBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'owner-cancel',
          reason: cancelReason.trim(),
        }),
      });

      const data = await res.json();
      setCancellingLoading(false);

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo cancelar la reserva');
      }

      setBookings((current) =>
        current.map((b) => (b.id === cancellingBooking.id ? { ...b, status: 'CANCELLED' } : b))
      );
      setSuccessMsg(`Reserva ${cancellingBooking.code} cancelada. Se ha enviado un correo explicativo al cliente.`);
      setCancellingBooking(null);
      setCancelReason('');
    } catch (err: any) {
      setCancellingLoading(false);
      setError(err.message || 'Error cancelando la reserva');
    }
  }

  async function review(event: React.FormEvent) {
    event.preventDefault();
    if (!reviewing) return;
    setError('');
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: reviewing.id, rating, comment }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'No se pudo enviar la valoración');
      return;
    }
    setReviewing(null);
    setComment('');
    setRating(5);
  }

  return (
    <section className="mb-12 space-y-4 font-sans">
      <div className="font-mono">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-sans">
          Gestión de Reservas & Telemetría
        </h2>
        <p className="text-sm text-gray-500 font-sans mt-1">
          Supervisa solicitudes entrantes, aprueba jornadas de pilotaje y gestiona contratos digitales.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50 p-2 font-mono">
        {tabs.map(([key, label]) => (
          <button
            type="button"
            key={key}
            onClick={() => setTab(key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              tab === key
                ? 'bg-black text-white hover:bg-neutral-800 font-black shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                : 'text-gray-600 hover:text-black hover:bg-white/[0.04]'
            }`}
          >
            {label}
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-gray-100">
              {bookings.filter((booking) => groups[key].some((status) => status === booking.status)).length}
            </span>
          </button>
        ))}
      </div>

      {error && <p className="rounded-xl bg-red-950/50 border border-red-500/30 p-4 text-xs font-mono font-bold text-red-800">{error}</p>}
      {successMsg && <p className="rounded-xl bg-emerald-950/50 border border-emerald-500/30 p-4 text-xs font-mono font-bold text-emerald-800">{successMsg}</p>}

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm font-mono text-gray-400">
          No hay reservas registradas en esta sección.
        </div>
      ) : (
        <div className="grid gap-4">
          {visible.map((booking) => {
            const existingConversation = booking.conversations?.[0]?.id;
            const conversationHref = existingConversation
              ? `/mensajes?conversationId=${encodeURIComponent(existingConversation)}`
              : `/mensajes?bookingId=${encodeURIComponent(booking.id)}`;
            const canOpenReservation = !['REQUESTED', 'OWNER_REJECTED', 'CANCELLED'].includes(booking.status);
            const canOwnerCancel = !['CANCELLED', 'OWNER_REJECTED', 'COMPLETED', 'REFUNDED'].includes(booking.status);

            return (
              <article key={booking.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 font-mono">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black">
                        {booking.code}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        booking.status === 'CONFIRMED' ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30' :
                        booking.status === 'CANCELLED' ? 'bg-red-500/15 text-red-800 border-red-500/30' :
                        booking.status === 'REQUESTED' ? 'bg-amber-500/15 text-amber-800 border-amber-500/30' : 'bg-white/10 text-gray-700 border-gray-200'
                      }`}>
                        {booking.status === 'REQUESTED' ? 'Solicitud Recibida' : booking.status === 'CONFIRMED' ? 'Confirmada' : booking.status}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-black">{booking.vehicle.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                      <UserRound className="h-3.5 w-3.5 text-black" />
                      Piloto: <span className="text-black">{booking.traveler.firstName} {booking.traveler.lastName}</span>
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <strong className="text-2xl sm:text-3xl font-black text-black">
                      {booking.ownerPayout ? booking.ownerPayout.toFixed(2) : (booking.totalAmount * 0.85).toFixed(2)} €
                    </strong>
                    <small className="block text-[10px] uppercase text-gray-400">Liquidación estimada</small>
                  </div>
                </div>

                <div className="my-5 grid gap-3 rounded-2xl border border-gray-200 bg-gray-100 p-4 sm:grid-cols-3 font-mono text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                      <CalendarDays className="h-3.5 w-3.5 text-black" />
                      <span className="uppercase text-[10px]">Periodo de Conducción</span>
                    </div>
                    <strong className="text-black text-xs sm:text-sm">
                      {new Date(booking.pickupDate).toLocaleDateString('es-ES')} → {new Date(booking.returnDate).toLocaleDateString('es-ES')}
                    </strong>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                      <Clock3 className="h-3.5 w-3.5 text-black" />
                      <span className="uppercase text-[10px]">Duración</span>
                    </div>
                    <strong className="text-black text-xs sm:text-sm">{booking.totalDays || 3} jornadas</strong>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                      <WalletCards className="h-3.5 w-3.5 text-black" />
                      <span className="uppercase text-[10px]">Total en Custodia</span>
                    </div>
                    <strong className="text-black text-xs sm:text-sm font-black">{booking.totalAmount.toFixed(2)} €</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-3 border-t border-gray-200 font-mono">
                  <Link
                    href={conversationHref}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white/[0.04] px-4 py-2 text-xs font-bold text-black hover:border-black hover:bg-white/[0.08] transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-black" /> Chat con Piloto
                  </Link>
                  {canOpenReservation && (
                    <Link
                      href={`/reserva/${booking.id}`}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white/[0.04] px-4 py-2 text-xs font-bold text-black hover:border-black hover:bg-white/[0.08] transition-colors"
                    >
                      <FileSignature className="h-4 w-4 text-black" /> Contrato & Telemetría
                    </Link>
                  )}
                  {['CONFIRMED', 'CHECKIN_PENDING'].includes(booking.status) && (
                    <Link
                      href={`/checkin?bookingId=${booking.id}`}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-md hover:brightness-110 transition-all"
                    >
                      <ClipboardCheck className="h-4 w-4" /> Acta de Entrega Digital
                    </Link>
                  )}
                  {['ACTIVE', 'CHECKOUT_PENDING'].includes(booking.status) && (
                    <Link
                      href={`/checkout?bookingId=${booking.id}`}
                      className="flex items-center gap-1.5 rounded-xl bg-[#D4AF37] px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-md hover:brightness-110 transition-all"
                    >
                      <ClipboardCheck className="h-4 w-4" /> Registrar Devolución
                    </Link>
                  )}
                  {booking.status === 'COMPLETED' && (
                    <button
                      type="button"
                      onClick={() => setReviewing(booking)}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-xs font-bold text-black hover:bg-[#D4AF37]/20 transition-all cursor-pointer"
                    >
                      <Star className="h-4 w-4" /> Valorar Piloto
                    </button>
                  )}
                  {booking.status === 'REQUESTED' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setDecision({ id: booking.id, action: 'accept' })}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] px-5 py-2 text-xs font-black uppercase tracking-wider text-black hover:brightness-110 transition-all cursor-pointer shadow-md"
                      >
                        <Check className="h-4 w-4" /> Aprobar Conducción
                      </button>
                      <button
                        type="button"
                        onClick={() => setDecision({ id: booking.id, action: 'reject' })}
                        className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-950/30 transition-all cursor-pointer"
                      >
                        <X className="h-4 w-4" /> Rechazar
                      </button>
                    </>
                  )}

                  {/* BOTÓN PARA CANCELAR RESERVA POR EL PROPIETARIO */}
                  {canOwnerCancel && (
                    <button
                      type="button"
                      onClick={() => {
                        setCancellingBooking(booking);
                        setCancelReason('');
                      }}
                      className="ml-auto flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-950/30 transition-all cursor-pointer"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      <span>Cancelar Reserva</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* MODAL DE CANCELACIÓN DE RESERVA CON MOTIVO */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-100 p-4 backdrop-blur-md font-sans">
          <form onSubmit={handleCancelBooking} className="w-full max-w-lg rounded-3xl bg-gray-50 border border-red-500/30 p-7 shadow-2xl space-y-4 text-black">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="h-6 w-6 shrink-0 text-red-400" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[.2em] text-red-400">Protocolo de Cancelación</span>
                <h3 className="text-xl font-bold text-black">Cancelar Reserva {cancellingBooking.code}</h3>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Al cancelar esta reserva, se liberarán automáticamente los días bloqueados en el calendario de tu superdeportivo ({cancellingBooking.vehicle.title}) y se notificará a <strong>{cancellingBooking.traveler.firstName}</strong>.
            </p>

            <div>
              <label className="block text-xs font-mono font-bold text-black mb-1.5 uppercase">
                Motivo de la cancelación *
              </label>
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej. Revisión técnica en taller oficial, mantenimiento de neumáticos o ajuste acordado."
                className="w-full rounded-xl border border-gray-200 p-3 text-xs bg-gray-100 text-black placeholder:text-black/30 focus:border-red-500 focus:outline-none font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 font-mono">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="rounded-xl border border-gray-200 bg-white/5 px-5 py-2.5 text-xs font-bold text-black hover:bg-white/10 cursor-pointer"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={cancellingLoading}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                {cancellingLoading ? 'Procesando...' : 'Confirmar Cancelación'}
              </button>
            </div>
          </form>
        </div>
      )}

      {decision && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-100 p-4 backdrop-blur-md font-sans">
          <div className="w-full max-w-md rounded-3xl bg-gray-50 border border-gray-200 p-7 shadow-2xl text-black font-mono">
            <span className="text-[10px] font-bold uppercase tracking-[.2em] text-black">Confirmar Decisión</span>
            <h3 className="mt-2 text-2xl font-bold font-sans text-black">
              {decision.action === 'accept' ? '¿Aprobar fechas de conducción?' : '¿Rechazar solicitud?'}
            </h3>
            <p className="mt-3 text-sm text-gray-600 font-sans">
              {decision.action === 'accept'
                ? 'El piloto VIP recibirá la confirmación para proceder con el depósito y firma de contrato.'
                : 'La solicitud quedará cancelada y las fechas se mantendrán disponibles.'}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={decide}
                className={`rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider ${
                  decision.action === 'accept'
                    ? 'bg-black text-white hover:bg-neutral-800 hover:brightness-110'
                    : 'bg-red-600 text-white hover:bg-red-500'
                } cursor-pointer shadow-md`}
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setDecision(null)}
                className="rounded-xl border border-gray-200 bg-white/5 px-5 py-2.5 text-xs font-bold text-black hover:bg-white/10 cursor-pointer"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {reviewing && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-100 p-4 backdrop-blur-md font-sans">
          <form onSubmit={review} className="w-full max-w-md space-y-4 rounded-3xl bg-gray-50 border border-gray-200 p-7 shadow-2xl text-black font-sans">
            <h3 className="text-2xl font-bold font-mono text-black">Valorar a {reviewing.traveler.firstName}</h3>
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 mb-1 uppercase">Puntuación</label>
              <select
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-black p-3 text-sm text-black focus:border-[#D4AF37] focus:outline-none"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value} className="bg-black">
                    {value} estrellas
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 mb-1 uppercase">Comentarios de pilotaje</label>
              <textarea
                required
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="¿Cómo fue la comunicación y el cuidado del vehículo?"
                className="min-h-28 w-full rounded-xl border border-gray-200 bg-black p-3 text-sm text-black placeholder:text-black/30 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="flex gap-3 font-mono">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:brightness-110 shadow-md cursor-pointer"
              >
                Enviar Valoración
              </button>
              <button
                type="button"
                onClick={() => setReviewing(null)}
                className="rounded-xl border border-gray-200 bg-white/5 px-5 py-2.5 text-xs font-bold text-black hover:bg-white/10 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
