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
    <section className="mb-12 space-y-4">
      <div>
        <h2 className="font-serif text-3xl font-bold">Gestión de Reservas</h2>
        <p className="text-sm text-[#6B726E]">
          Supervisa solicitudes, reservas automáticas confirmadas y gestiona cancelaciones directamente.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-[#E9E1D2] bg-white p-2">
        {tabs.map(([key, label]) => (
          <button
            type="button"
            key={key}
            onClick={() => setTab(key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              tab === key ? 'bg-[#13322E] text-white shadow' : 'text-[#6B726E] hover:text-[#13322E]'
            }`}
          >
            {label}
            <span className="ml-2 opacity-60">
              {bookings.filter((booking) => groups[key].some((status) => status === booking.status)).length}
            </span>
          </button>
        ))}
      </div>

      {error && <p className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-bold text-red-700">{error}</p>}
      {successMsg && <p className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800">{successMsg}</p>}

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#E9E1D2] bg-white p-8 text-center text-sm text-[#6B726E]">
          No hay reservas en esta sección.
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
              <article key={booking.id} className="rounded-3xl border border-[#E9E1D2] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA] font-mono">{booking.code}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        booking.status === 'REQUESTED' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold">{booking.vehicle.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#6B726E]">
                      <UserRound className="h-3.5 w-3.5" />
                      {booking.traveler.firstName} {booking.traveler.lastName}
                    </p>
                  </div>
                  <strong className="font-serif text-2xl">
                    {booking.ownerPayout.toFixed(2)} €
                    <small className="block text-right font-sans text-[10px] font-normal text-[#6B726E]">netos estimados</small>
                  </strong>
                </div>

                <div className="my-4 grid gap-3 rounded-2xl bg-[#F7F6F2] p-4 sm:grid-cols-3">
                  <span className="text-xs">
                    <CalendarDays className="mb-1 h-4 w-4 text-[#16B8AA]" />
                    <small className="block text-[#6B726E]">Periodo</small>
                    <strong>{new Date(booking.pickupDate).toLocaleDateString('es-ES')} → {new Date(booking.returnDate).toLocaleDateString('es-ES')}</strong>
                  </span>
                  <span className="text-xs">
                    <Clock3 className="mb-1 h-4 w-4 text-[#16B8AA]" />
                    <small className="block text-[#6B726E]">Duración</small>
                    <strong>{booking.totalDays} días</strong>
                  </span>
                  <span className="text-xs">
                    <WalletCards className="mb-1 h-4 w-4 text-[#16B8AA]" />
                    <small className="block text-[#6B726E]">Total abonado</small>
                    <strong>{booking.totalAmount.toFixed(2)} €</strong>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E9E1D2]">
                  <Link href={conversationHref} className="flex items-center gap-1.5 rounded-full border border-[#E9E1D2] px-4 py-2 text-xs font-bold hover:bg-[#FAF7F0] transition-colors">
                    <MessageCircle className="h-4 w-4" /> Hablar con el viajero
                  </Link>
                  {canOpenReservation && (
                    <Link href={`/reserva/${booking.id}`} className="flex items-center gap-1.5 rounded-full border border-[#E9E1D2] px-4 py-2 text-xs font-bold hover:bg-[#FAF7F0] transition-colors">
                      <FileSignature className="h-4 w-4" /> Contrato y reserva
                    </Link>
                  )}
                  {['CONFIRMED', 'CHECKIN_PENDING'].includes(booking.status) && (
                    <Link href={`/checkin?bookingId=${booking.id}`} className="flex items-center gap-1.5 rounded-full bg-[#13322E] px-4 py-2 text-xs font-bold text-white shadow-xs">
                      <ClipboardCheck className="h-4 w-4" /> Registrar entrega
                    </Link>
                  )}
                  {['ACTIVE', 'CHECKOUT_PENDING'].includes(booking.status) && (
                    <Link href={`/checkout?bookingId=${booking.id}`} className="flex items-center gap-1.5 rounded-full bg-[#13322E] px-4 py-2 text-xs font-bold text-white shadow-xs">
                      <ClipboardCheck className="h-4 w-4" /> Registrar devolución
                    </Link>
                  )}
                  {booking.status === 'COMPLETED' && (
                    <button type="button" onClick={() => setReviewing(booking)} className="flex items-center gap-1.5 rounded-full border border-[#E9E1D2] px-4 py-2 text-xs font-bold cursor-pointer">
                      <Star className="h-4 w-4" /> Valorar viajero
                    </button>
                  )}
                  {booking.status === 'REQUESTED' && (
                    <>
                      <button type="button" onClick={() => setDecision({ id: booking.id, action: 'accept' })} className="flex items-center gap-1.5 rounded-full bg-[#16B8AA] px-4 py-2 text-xs font-bold text-white cursor-pointer shadow-xs">
                        <Check className="h-4 w-4" /> Aceptar fechas
                      </button>
                      <button type="button" onClick={() => setDecision({ id: booking.id, action: 'reject' })} className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer">
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
                      className="ml-auto flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#13322E]/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleCancelBooking} className="w-full max-w-lg rounded-[32px] bg-white p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-[.2em]">Acción de Propietario</span>
                <h3 className="font-serif text-2xl font-bold text-[#13322E]">Cancelar Reserva {cancellingBooking.code}</h3>
              </div>
            </div>

            <p className="text-xs text-[#6B726E] leading-relaxed">
              Al cancelar esta reserva, se liberarán automáticamente los días bloqueados en el calendario de tu furgoneta ({cancellingBooking.vehicle.title}) y se enviará un correo explicativo a <strong>{cancellingBooking.traveler.firstName}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#13322E] mb-1.5">
                Motivo de la cancelación (se incluirá en el correo al cliente) *
              </label>
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej. Avería imprevista en el alternador, problema de disponibilidad o ajuste de fechas acordado previamente."
                className="w-full rounded-2xl border border-[#E9E1D2] p-3 text-xs bg-[#FAF7F0] focus:bg-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="rounded-full border border-[#E9E1D2] px-5 py-2.5 text-xs font-bold cursor-pointer"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={cancellingLoading}
                className="rounded-full bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-black text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                {cancellingLoading ? 'Cancelando...' : 'Confirmar Cancelación'}
              </button>
            </div>
          </form>
        </div>
      )}

      {decision && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#13322E]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] bg-white p-7 shadow-2xl">
            <span className="text-[10px] font-black uppercase tracking-[.2em] text-[#16B8AA]">Confirmar decisión</span>
            <h3 className="mt-2 font-serif text-3xl font-bold">{decision.action === 'accept' ? '¿Aceptar estas fechas?' : '¿Rechazar la solicitud?'}</h3>
            <p className="mt-3 text-sm text-[#6B726E]">El viajero recibirá una notificación del cambio.</p>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={decide} className={`rounded-full px-5 py-3 text-xs font-bold text-white ${decision.action === 'accept' ? 'bg-[#16B8AA]' : 'bg-red-600'}`}>Confirmar</button>
              <button type="button" onClick={() => setDecision(null)} className="rounded-full border border-[#E9E1D2] px-5 py-3 text-xs font-bold">Volver</button>
            </div>
          </div>
        </div>
      )}

      {reviewing && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#13322E]/60 p-4">
          <form onSubmit={review} className="w-full max-w-md space-y-4 rounded-[32px] bg-white p-7 shadow-2xl">
            <h3 className="font-serif text-3xl font-bold">Valorar a {reviewing.traveler.firstName}</h3>
            <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="w-full rounded-xl border border-[#E9E1D2] p-3">
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} estrellas</option>)}
            </select>
            <textarea required value={comment} onChange={(event) => setComment(event.target.value)} placeholder="¿Cómo fue la comunicación y el cuidado del vehículo?" className="min-h-28 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm" />
            <div className="flex gap-2">
              <button className="rounded-full bg-[#16B8AA] px-5 py-3 text-xs font-bold text-white">Enviar valoración</button>
              <button type="button" onClick={() => setReviewing(null)} className="rounded-full border border-[#E9E1D2] px-5 py-3 text-xs font-bold">Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
