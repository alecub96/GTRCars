'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CalendarDays, CheckCircle2, CreditCard, FileCheck2, Lock, ShieldCheck } from 'lucide-react';
import StripePaymentElement from '@/components/StripePaymentElement';
import BookingIncidentPanel from '@/components/BookingIncidentPanel';
import DigitalContractViewer from '@/components/DigitalContractViewer';

export default function BookingCheckoutClient() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [signature, setSignature] = useState('');
  const [checks, setChecks] = useState({ terms: false, privacy: false, deposit: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentClientSecret, setPaymentClientSecret] = useState('');
  const [viewerRole, setViewerRole] = useState<'TRAVELER' | 'OWNER' | 'ADMIN'>('TRAVELER');

  const load = async () => {
    const response = await fetch(`/api/bookings/${id}`);
    const data = await response.json();
    if (response.ok) { setBooking(data.booking); setViewerRole(data.viewerRole); } else setError(data.error || 'No se pudo cargar la reserva');
  };
  useEffect(() => {
    let active = true;
    void fetch(`/api/bookings/${id}`).then(async (response) => {
      const data = await response.json();
      if (!active) return;
      if (response.ok) { setBooking(data.booking); setViewerRole(data.viewerRole); }
      else setError(data.error || 'No se pudo cargar la reserva');
    });
    return () => { active = false; };
  }, [id]);

  async function sign() {
    setLoading(true); setError('');
    const response = await fetch(`/api/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'sign-contract', signature, acceptedTerms: checks.terms, acceptedPrivacy: checks.privacy, acceptedDeposit: checks.deposit }) });
    const data = await response.json();
    if (!response.ok) setError(data.error || 'No se pudo firmar'); else await load();
    setLoading(false);
  }

  async function pay() {
    setLoading(true); setError('');
    const response = await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: id }) });
    const data = await response.json();
    if (!response.ok) setError(data.error || 'No se pudo iniciar el pago');
    else if (data.clientSecret) setPaymentClientSecret(data.clientSecret);
    else await load();
    setLoading(false);
  }

  if (!booking) return <div className="min-h-screen bg-[#F7F6F2]"><Navbar /><p className="p-12 text-center">{error || 'Cargando reserva…'}</p></div>;
  const signed = viewerRole === 'OWNER' ? booking.contract?.signedByOwner : booking.contract?.signedByTraveler;
  const fullySigned = booking.contract?.signedByTraveler && booking.contract?.signedByOwner;
  const payable = ['OWNER_ACCEPTED', 'CONFIRMED', 'PAYMENT_PENDING'].includes(booking.status);
  const date = (value: string) => new Date(value).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans">
      <Navbar />
      {paymentClientSecret && (
        <StripePaymentElement
          clientSecret={paymentClientSecret}
          bookingId={id}
          onClose={() => setPaymentClientSecret('')}
        />
      )}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <header className="mb-8 font-mono border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em] text-gray-500 mb-1">
            <span>EXPEDIENTE // BÓVEDA STRIPE CONNECT</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-black uppercase text-black">
            Revisión, Contrato & Pago Seguro
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-sans">
            Pago custodiado mediante protocolo encriptado de Stripe integrado directamente en GTRCars.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-mono font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs font-mono">
              <div className="mb-5 flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-black" />
                <div>
                  <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-black">
                    Ficha Técnica del Servicio
                  </h2>
                  <p className="text-xs text-gray-500 font-sans">Datos vinculados a la póliza y contrato digital</p>
                </div>
              </div>
              <dl className="grid gap-4 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Vehículo Supercar</dt>
                  <dd className="font-bold text-black font-sans text-sm">{booking.vehicle?.title || 'Superdeportivo'}</dd>
                  <dd className="text-gray-500">{booking.vehicle?.brand || ''} {booking.vehicle?.model || ''} · {booking.vehicle?.year || ''}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Lugar de Recogida</dt>
                  <dd className="font-bold text-black font-sans text-sm">{booking.vehicle?.municipality || ''}, {booking.vehicle?.island || ''}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Entrega de Llaves</dt>
                  <dd className="font-bold text-black font-sans text-sm">{date(booking.pickupDate)} · {booking.pickupTime}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Retorno</dt>
                  <dd className="font-bold text-black font-sans text-sm">{date(booking.returnDate)} · {booking.returnTime}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Piloto Arrendatario</dt>
                  <dd className="font-bold text-black font-sans text-sm">{booking.traveler?.firstName || 'Piloto'} {booking.traveler?.lastName || ''}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Propietario Vault</dt>
                  <dd className="font-bold text-black font-sans text-sm">{booking.owner?.firstName || 'Propietario'} {booking.owner?.lastName || ''}</dd>
                </div>
              </dl>
            </article>

            {/* CONTRATO DIGITAL Y SUITE DE FIRMA ELECTRÓNICA */}
            <DigitalContractViewer
              booking={booking}
              viewerRole={viewerRole}
              onSigned={load}
            />
          </section>

          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-md lg:sticky lg:top-28 font-mono">
            <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-black">
              Liquidación del Pago
            </h2>
            <div className="my-5 space-y-2.5 border-y border-gray-100 py-4 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Jornadas de pilotaje</span>
                <span className="font-bold text-black">{booking.basePrice} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Preparación & Detailing</span>
                <span className="font-bold text-black">{booking.cleaningFee} €</span>
              </div>
              {booking.extrasTotal > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Opciones complementarias</span>
                  <span className="font-bold text-black">{booking.extrasTotal} €</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Garantía & Bóveda GTRCars</span>
                <span className="font-bold text-black">{booking.travelerFee} €</span>
              </div>
              <div className="flex justify-between text-base font-black text-black pt-2 border-t border-gray-100">
                <span>Total a Transferir</span>
                <span>{booking.totalAmount} €</span>
              </div>
            </div>

            <div className="mb-5 rounded-2xl bg-gray-50 border border-gray-200 p-4 text-xs">
              <ShieldCheck className="mb-2 h-5 w-5 text-black" />
              <strong className="block font-sans text-black">Custodia Segura Stripe Connect</strong>
              <span className="text-gray-500 font-sans block mt-0.5">
                Los fondos quedan retenidos en depósito seguro hasta la entrega del superdeportivo.
              </span>
            </div>

            {booking.status === 'REQUESTED' && (
              <p className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs font-bold text-amber-800">
                Solicitud enviada al propietario. Podrás formalizar el pago cuando la acepte.
              </p>
            )}

            {viewerRole === 'TRAVELER' && (
              <button
                onClick={pay}
                disabled={!fullySigned || !payable || loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-neutral-800 transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Continuar a Pago Seguro</span>
              </button>
            )}

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5 text-black" /> Tarjeta</span>
              <span>Klarna</span>
              <span>Apple Pay</span>
            </div>
          </aside>
        </div>
        <BookingIncidentPanel bookingId={id} bookingStatus={booking.status} canReport={viewerRole !== 'ADMIN'} />
      </main>
    </div>
  );
}
