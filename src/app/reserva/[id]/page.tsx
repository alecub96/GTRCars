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

  return <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar />{paymentClientSecret && <StripePaymentElement clientSecret={paymentClientSecret} bookingId={id} onClose={() => setPaymentClientSecret('')} />}<main className="mx-auto max-w-6xl px-4 py-10">
    <header className="mb-7"><span className="text-[11px] font-black uppercase tracking-[.25em] text-[#16B8AA]">Reserva {booking.code}</span><h1 className="font-serif text-4xl font-bold">Revisa, firma y paga con seguridad</h1><p className="mt-2 text-sm text-[#6B726E]">El pago se completa aquí mediante componentes seguros de Stripe integrados en Vaneando.</p></header>
    {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-6">
        <article className="rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><CalendarDays className="h-6 w-6 text-[#16B8AA]" /><div><h2 className="font-serif text-2xl font-bold">Datos de la reserva</h2><p className="text-xs text-[#6B726E]">Información vinculada al contrato</p></div></div><dl className="grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-xs text-[#6B726E]">Vehículo</dt><dd className="font-bold">{booking.vehicle?.title || 'Camper'}</dd><dd>{booking.vehicle?.brand || ''} {booking.vehicle?.model || ''} · {booking.vehicle?.year || ''}</dd></div><div><dt className="text-xs text-[#6B726E]">Recogida</dt><dd className="font-bold">{booking.vehicle?.municipality || ''}, {booking.vehicle?.island || ''}</dd></div><div><dt className="text-xs text-[#6B726E]">Entrega</dt><dd className="font-bold">{date(booking.pickupDate)} · {booking.pickupTime}</dd></div><div><dt className="text-xs text-[#6B726E]">Devolución</dt><dd className="font-bold">{date(booking.returnDate)} · {booking.returnTime}</dd></div><div><dt className="text-xs text-[#6B726E]">Viajero</dt><dd className="font-bold">{booking.traveler?.firstName || 'Viajero'} {booking.traveler?.lastName || ''}</dd></div><div><dt className="text-xs text-[#6B726E]">Propietario</dt><dd className="font-bold">{booking.owner?.firstName || 'Propietario'} {booking.owner?.lastName || ''}</dd></div></dl></article>
        {/* CONTRATO DIGITAL Y SUITE DE FIRMA ELECTRÓNICA */}
        <DigitalContractViewer
          booking={booking}
          viewerRole={viewerRole}
          onSigned={load}
        />
      </section>
      <aside className="h-fit rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-xl lg:sticky lg:top-28"><h2 className="font-serif text-2xl font-bold">Resumen de pago</h2><div className="my-5 space-y-3 border-y border-[#E9E1D2] py-5 text-sm"><div className="flex justify-between"><span>Alquiler</span><span>{booking.basePrice} €</span></div><div className="flex justify-between"><span>Limpieza</span><span>{booking.cleaningFee} €</span></div><div className="flex justify-between"><span>Extras</span><span>{booking.extrasTotal} €</span></div><div className="flex justify-between"><span>Gestión de plataforma (9,7%)</span><span>{booking.travelerFee} €</span></div><div className="flex justify-between text-lg font-bold"><span>Total</span><span>{booking.totalAmount} €</span></div></div><div className="mb-5 rounded-2xl bg-[#F0FDFA] p-4 text-xs"><ShieldCheck className="mb-2 h-6 w-6 text-[#16B8AA]" /><strong className="block">Pago protegido por Stripe</strong>En el siguiente paso podrás elegir tarjeta o Klarna si Stripe lo ofrece para tu compra.</div>{booking.status === 'REQUESTED' && <p className="mb-4 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-800">Solicitud enviada. Podrás pagar cuando el propietario la acepte.</p>}{viewerRole === 'TRAVELER' && <button onClick={pay} disabled={!fullySigned || !payable || loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#16B8AA] py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"><Lock className="h-4 w-4" />Continuar a pago seguro</button>}<div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold text-[#6B726E]"><span className="flex items-center gap-1"><CreditCard className="h-4 w-4" />Tarjeta</span><span>Klarna.</span></div></aside>
    </div>
    <BookingIncidentPanel bookingId={id} bookingStatus={booking.status} canReport={viewerRole !== 'ADMIN'} />
  </main></div>;
}
