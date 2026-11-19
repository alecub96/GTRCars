'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Lock,
  ScanFace,
  ShieldCheck,
  Unlock,
} from 'lucide-react';
import StripePaymentElement from '@/components/StripePaymentElement';
import BookingIncidentPanel from '@/components/BookingIncidentPanel';
import DigitalContractViewer from '@/components/DigitalContractViewer';

const DEPOSIT_STATUS_LABELS: Record<string, { label: string; badgeClass: string }> = {
  NOT_REQUIRED: { label: 'No requerida', badgeClass: 'bg-gray-100 text-gray-700' },
  PENDING: { label: 'Pendiente de Verificación / Retención', badgeClass: 'bg-amber-100 text-amber-800' },
  HELD: { label: 'Fianza Retenida y Verificada en Custodia', badgeClass: 'bg-emerald-100 text-emerald-800' },
  RELEASED: { label: 'Fianza Desbloqueada y Liberada (100%)', badgeClass: 'bg-blue-100 text-blue-800' },
  PARTIALLY_CHARGED: { label: 'Retención Parcial Ejecutada', badgeClass: 'bg-rose-100 text-rose-800' },
  CHARGED: { label: 'Fianza Ejecutada', badgeClass: 'bg-red-100 text-red-800' },
  DISPUTED: { label: 'En Revisión de Incidencia', badgeClass: 'bg-amber-100 text-amber-900' },
};

export default function BookingCheckoutClient() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [paymentClientSecret, setPaymentClientSecret] = useState('');
  const [viewerRole, setViewerRole] = useState<'TRAVELER' | 'OWNER' | 'ADMIN'>('TRAVELER');

  // Estados para gestión de Fianza cuando la gestiona GTR Cars (PLATFORM)
  const [depositMethod, setDepositMethod] = useState<'STRIPE_HOLD' | 'BANK_TRANSFER'>('STRIPE_HOLD');
  const [transferReference, setTransferReference] = useState('');
  const [transferHolder, setTransferHolder] = useState('');
  const [depositActionLoading, setDepositActionLoading] = useState(false);
  const [captureAmountInput, setCaptureAmountInput] = useState('');
  const [captureReasonInput, setCaptureReasonInput] = useState('');
  const [showCaptureForm, setShowCaptureForm] = useState(false);

  const load = async () => {
    const response = await fetch(`/api/bookings/${id}`, { cache: 'no-store' });
    const data = await response.json();
    if (response.ok) {
      setBooking(data.booking);
      setViewerRole(data.viewerRole);
    } else {
      setError(data.error || 'No se pudo cargar la reserva');
    }
  };

  useEffect(() => {
    let active = true;
    void fetch(`/api/bookings/${id}`, { cache: 'no-store' }).then(async (response) => {
      const data = await response.json();
      if (!active) return;
      if (response.ok) {
        setBooking(data.booking);
        setViewerRole(data.viewerRole);
      } else {
        setError(data.error || 'No se pudo cargar la reserva');
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  async function pay() {
    setLoading(true);
    setError('');
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: id }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error || 'No se pudo iniciar el pago');
    else if (data.clientSecret) setPaymentClientSecret(data.clientSecret);
    else await load();
    setLoading(false);
  }

  // Iniciar retención de fianza con tarjeta o notificar transferencia bancaria (Solo cuando GTR Cars gestiona la fianza)
  async function handleDepositSubmit() {
    setDepositActionLoading(true);
    setError('');
    setSuccessNotice('');
    try {
      const response = await fetch('/api/payments/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: id,
          method: depositMethod,
          transferReference,
          transferHolder,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo procesar la fianza');
      }
      if (data.clientSecret) {
        setPaymentClientSecret(data.clientSecret);
      } else {
        setSuccessNotice(data.message || 'Operación de fianza registrada con éxito.');
        await load();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDepositActionLoading(false);
    }
  }

  // Acciones de Administración GTR Cars: verificar retención, desbloquear fianza o ejecutar cargo parcial
  async function handleAdminDepositAction(
    action: 'verify-hold' | 'release-deposit' | 'capture-deposit' | 'toggle-management'
  ) {
    setDepositActionLoading(true);
    setError('');
    setSuccessNotice('');
    try {
      const response = await fetch('/api/payments/deposit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: id,
          action,
          captureAmount: captureAmountInput ? Number(captureAmountInput) : undefined,
          reason: captureReasonInput,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar la fianza');
      }
      setSuccessNotice(data.message || 'Estado de fianza actualizado.');
      setShowCaptureForm(false);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDepositActionLoading(false);
    }
  }

  if (!booking)
    return (
      <div className="min-h-screen bg-white text-black">
        <Navbar />
        <p className="p-12 text-center font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
          {error || 'Sincronizando expediente de reserva…'}
        </p>
      </div>
    );

  const fullySigned = booking.contract?.signedByTraveler && booking.contract?.signedByOwner;
  const payable = ['OWNER_ACCEPTED', 'CONFIRMED', 'PAYMENT_PENDING'].includes(booking.status);
  const date = (value: string) =>
    new Date(value).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  // ¿Gestiona GTR Cars la fianza de este vehículo?
  const isPlatformManagedDeposit = booking.vehicle?.ownershipType === 'PLATFORM';
  const depositInfo = DEPOSIT_STATUS_LABELS[booking.depositStatus] || DEPOSIT_STATUS_LABELS.PENDING;

  let contractSnapshot: any = {};
  try {
    if (booking.contract?.termsSnapshot) {
      contractSnapshot = JSON.parse(booking.contract.termsSnapshot);
    }
  } catch {}
  const depositVerificationData = contractSnapshot.depositVerification || null;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans">
      <Navbar />
      {paymentClientSecret && (
        <StripePaymentElement
          clientSecret={paymentClientSecret}
          bookingId={id}
          onClose={() => {
            setPaymentClientSecret('');
            void load();
          }}
        />
      )}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <header className="mb-8 font-mono border-b border-gray-100 pb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em] text-gray-500 mb-1">
              <span>EXPEDIENTE {booking.code} // BÓVEDA STRIPE CONNECT</span>
            </div>
            <h1 className="font-sans text-3xl sm:text-4xl font-black uppercase text-black">
              Revisión, Contrato &amp; Pago Seguro
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 font-sans">
              Pago custodiado mediante protocolo encriptado de Stripe integrado directamente en GTR Cars.
            </p>
          </div>

          {/* ESTADO DE VERIFICACIÓN FACIAL DEL CONDUCTOR */}
          <div className="flex items-center gap-2">
            {booking.traveler?.verification === 'VERIFIED' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
                <ScanFace className="w-4 h-4" />
                Conductor Verificado (Biometría + Carné OK)
              </span>
            ) : (
              <Link
                href="/verificacion"
                className="inline-flex items-center gap-1.5 rounded-full bg-black text-white hover:bg-neutral-800 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <ScanFace className="w-4 h-4" />
                <span>Completar Verificación Facial</span>
              </Link>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-mono font-bold text-red-700">
            {error}
          </div>
        )}

        {successNotice && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-mono font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
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
                  <dd className="font-bold text-black font-sans text-sm">
                    {booking.vehicle?.title || 'Superdeportivo'}
                  </dd>
                  <dd className="text-gray-500">
                    {booking.vehicle?.brand || ''} {booking.vehicle?.model || ''} · {booking.vehicle?.year || ''}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Lugar de Recogida</dt>
                  <dd className="font-bold text-black font-sans text-sm">
                    {booking.vehicle?.municipality || ''}, {booking.vehicle?.island || ''}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Entrega de Llaves</dt>
                  <dd className="font-bold text-black font-sans text-sm">
                    {date(booking.pickupDate)} · {booking.pickupTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Retorno</dt>
                  <dd className="font-bold text-black font-sans text-sm">
                    {date(booking.returnDate)} · {booking.returnTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Piloto Arrendatario</dt>
                  <dd className="font-bold text-black font-sans text-sm">
                    {booking.traveler?.firstName || 'Piloto'} {booking.traveler?.lastName || ''}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-400 uppercase font-bold text-[10px]">Propietario Vault</dt>
                  <dd className="font-bold text-black font-sans text-sm">
                    {booking.owner?.firstName || 'Propietario'} {booking.owner?.lastName || ''}
                  </dd>
                </div>
              </dl>
            </article>

            {/* CONTRATO DIGITAL Y SUITE DE FIRMA ELECTRÓNICA */}
            <DigitalContractViewer booking={booking} viewerRole={viewerRole} onSigned={load} />
          </section>

          <aside className="space-y-6 h-fit lg:sticky lg:top-28 font-mono">
            {/* BLOQUE 1: LIQUIDACIÓN DEL ALQUILER */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
              <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-black">
                Liquidación del Alquiler
              </h2>
              <div className="my-5 space-y-2.5 border-y border-gray-100 py-4 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Jornadas de pilotaje</span>
                  <span className="font-bold text-black">{booking.basePrice} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Preparación &amp; Detailing</span>
                  <span className="font-bold text-black">{booking.cleaningFee} €</span>
                </div>
                {booking.extrasTotal > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Opciones complementarias</span>
                    <span className="font-bold text-black">{booking.extrasTotal} €</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Garantía &amp; Bóveda GTR Cars</span>
                  <span className="font-bold text-black">{booking.travelerFee} €</span>
                </div>
                <div className="flex justify-between text-base font-black text-black pt-2 border-t border-gray-100">
                  <span>Total Alquiler</span>
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
                  <span>{loading ? 'Procesando…' : 'Pagar Alquiler Ahora'}</span>
                </button>
              )}

              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-black" /> Tarjeta
                </span>
                <span>Klarna</span>
                <span>Apple Pay</span>
              </div>
            </div>

            {/* BLOQUE 2: GESTIÓN DE FIANZA (SOLO SE ACTIVA SI LA FIANZA LA GESTIONA GTR CARS — ownershipType === 'PLATFORM') */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
                    GARANTÍA DE VEHÍCULO
                  </span>
                  <h3 className="font-sans text-lg font-black uppercase text-black">
                    Fianza: {booking.depositAmount} €
                  </h3>
                </div>
                {viewerRole === 'ADMIN' && (
                  <button
                    type="button"
                    disabled={depositActionLoading}
                    onClick={() => void handleAdminDepositAction('toggle-management')}
                    className="rounded-full border border-gray-300 bg-gray-50 hover:bg-black hover:text-white px-3 py-1 text-[10px] font-bold uppercase cursor-pointer transition-all"
                    title="Cambiar quién gestiona la fianza de este vehículo"
                  >
                    {isPlatformManagedDeposit ? 'Gestiona: GTR Cars' : 'Gestiona: Propietario'}
                  </button>
                )}
              </div>

              {!isPlatformManagedDeposit ? (
                /* CASO A: LA FIANZA LA GESTIONA EL PROPIETARIO DIRECTAMENTE -> NO HACE FALTA COBRO NI VERIFICACIÓN EN WEB */
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-xs space-y-1.5 font-sans">
                  <div className="flex items-center gap-2 font-bold text-black">
                    <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                    <span>Gestión Directa con el Propietario</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-xs">
                    En esta unidad la fianza ({booking.depositAmount} €) la gestiona directamente el propietario en el momento de la entrega y se devuelve al finalizar el alquiler. No requiere retención ni transferencia en la web.
                  </p>
                </div>
              ) : (
                /* CASO B: GTR CARS GESTIONA LA FIANZA (RETENCIÓN Y DESBLOQUEO / VERIFICACIÓN DE TRANSFERENCIA) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Estado Fianza GTR Cars:</span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${depositInfo.badgeClass}`}>
                      {depositInfo.label}
                    </span>
                  </div>

                  {/* Información de transferencia notificada si existe */}
                  {depositVerificationData?.reference && (
                    <div className="rounded-2xl bg-gray-50 border border-gray-200 p-3.5 text-xs space-y-1 font-sans">
                      <span className="text-[10px] font-mono font-bold uppercase text-gray-500 block">
                        Justificante de Transferencia Registrado
                      </span>
                      <p className="text-black font-bold">
                        Referencia: <span className="font-mono">{depositVerificationData.reference}</span>
                      </p>
                      {depositVerificationData.holder && (
                        <p className="text-gray-600 text-[11px]">Ordenante: {depositVerificationData.holder}</p>
                      )}
                    </div>
                  )}

                  {/* ACCIONES PARA EL VIAJERO CUANDO LA FIANZA ESTÁ PENDIENTE */}
                  {viewerRole === 'TRAVELER' &&
                    booking.depositStatus !== 'HELD' &&
                    booking.depositStatus !== 'RELEASED' && (
                      <div className="space-y-3 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-600 font-sans leading-relaxed">
                          Esta fianza es gestionada y custodiada por <strong>GTR Cars</strong>. Queda retenida durante el alquiler y se desbloquea íntegramente tras la devolución sin incidencias.
                        </p>

                        {/* Selector de método: Retención Tarjeta vs Transferencia Verificada */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setDepositMethod('STRIPE_HOLD')}
                            className={`p-2.5 rounded-xl border text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              depositMethod === 'STRIPE_HOLD'
                                ? 'border-black bg-black text-white'
                                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-black'
                            }`}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Retención Tarjeta</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDepositMethod('BANK_TRANSFER')}
                            className={`p-2.5 rounded-xl border text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              depositMethod === 'BANK_TRANSFER'
                                ? 'border-black bg-black text-white'
                                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-black'
                            }`}
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Transferencia</span>
                          </button>
                        </div>

                        {depositMethod === 'STRIPE_HOLD' ? (
                          <div className="space-y-2.5">
                            <p className="text-[11px] text-gray-500 font-sans">
                              Se realizará un <strong>bloqueo / preautorización temporal</strong> de {booking.depositAmount} € en tu tarjeta mediante Stripe y se desbloqueará al devolver el vehículo.
                            </p>
                            <button
                              type="button"
                              disabled={depositActionLoading}
                              onClick={() => void handleDepositSubmit()}
                              className="w-full py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                            >
                              {depositActionLoading
                                ? 'Iniciando bloqueo seguro…'
                                : `Autorizar Retención de ${booking.depositAmount} €`}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 rounded-2xl bg-gray-50 border border-gray-200 p-4 font-sans text-xs">
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase text-gray-500 block">
                                Cuenta de Custodia de Fianzas GTR Cars
                              </span>
                              <p className="font-mono font-bold text-black mt-0.5">
                                Concepto obligatorio: FIANZA-{booking.code}
                              </p>
                              <p className="text-[11px] text-gray-600 mt-1">
                                Realiza la transferencia por <strong>{booking.depositAmount} €</strong> e introduce debajo el número de referencia o justificante bancario para que Administración la verifique y deje retenida hasta el check-out.
                              </p>
                            </div>

                            <div className="space-y-2 font-mono">
                              <input
                                type="text"
                                placeholder="Titular de la cuenta ordenante"
                                value={transferHolder}
                                onChange={(e) => setTransferHolder(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs text-black focus:border-black outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Nº referencia / justificante de transferencia *"
                                value={transferReference}
                                onChange={(e) => setTransferReference(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs text-black focus:border-black outline-none"
                              />
                              <button
                                type="button"
                                disabled={depositActionLoading}
                                onClick={() => void handleDepositSubmit()}
                                className="w-full py-3 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider cursor-pointer disabled:opacity-50"
                              >
                                {depositActionLoading ? 'Registrando…' : 'Notificar Transferencia de Fianza'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {/* PANEL DE CONTROL DE FIANZA PARA ADMINISTRACIÓN GTR CARS */}
                  {viewerRole === 'ADMIN' && (
                    <div className="pt-3 border-t border-gray-200 space-y-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
                        CONTROL DE FIANZA (ADMINISTRACIÓN GTR CARS)
                      </span>

                      {booking.depositStatus !== 'HELD' && booking.depositStatus !== 'RELEASED' && (
                        <button
                          type="button"
                          disabled={depositActionLoading}
                          onClick={() => void handleAdminDepositAction('verify-hold')}
                          className="w-full py-2.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verificar y Marcar Fianza Retenida</span>
                        </button>
                      )}

                      {booking.depositStatus !== 'RELEASED' && (
                        <button
                          type="button"
                          disabled={depositActionLoading}
                          onClick={() => void handleAdminDepositAction('release-deposit')}
                          className="w-full py-2.5 px-4 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Unlock className="w-4 h-4" />
                          <span>Desbloquear / Devolver Fianza (100%)</span>
                        </button>
                      )}

                      {booking.depositStatus === 'HELD' && (
                        <div>
                          <button
                            type="button"
                            onClick={() => setShowCaptureForm(!showCaptureForm)}
                            className="w-full py-2 px-4 rounded-full border border-red-300 bg-red-50 hover:bg-red-100 text-red-800 text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Aplicar Cargo por Daños / Km Extra
                          </button>

                          {showCaptureForm && (
                            <div className="mt-2 p-3 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
                              <input
                                type="number"
                                min="1"
                                max={booking.depositAmount}
                                placeholder={`Importe a retener (máx ${booking.depositAmount} €)`}
                                value={captureAmountInput}
                                onChange={(e) => setCaptureAmountInput(e.target.value)}
                                className="w-full p-2 rounded-xl border border-red-300 bg-white text-xs text-black"
                              />
                              <input
                                type="text"
                                placeholder="Motivo (ej. Exceso 80 km o marca en llanta)"
                                value={captureReasonInput}
                                onChange={(e) => setCaptureReasonInput(e.target.value)}
                                className="w-full p-2 rounded-xl border border-red-300 bg-white text-xs text-black"
                              />
                              <button
                                type="button"
                                disabled={depositActionLoading}
                                onClick={() => void handleAdminDepositAction('capture-deposit')}
                                className="w-full py-2 rounded-full bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase cursor-pointer"
                              >
                                Confirmar Cargo y Liberar Resto
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
        <BookingIncidentPanel bookingId={id} bookingStatus={booking.status} canReport={viewerRole !== 'ADMIN'} />
      </main>
    </div>
  );
}
