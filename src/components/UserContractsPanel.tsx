'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  Ban,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserContractsPanelProps {
  bookings: any[];
  viewerRole: 'TRAVELER' | 'OWNER' | 'ADMIN';
}

export default function UserContractsPanel({ bookings: initialBookings, viewerRole }: UserContractsPanelProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [cancellingBooking, setCancellingBooking] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Filtrar reservas que tengan solicitud o contrato activo
  const contractBookings = bookings.filter(
    (b) => b && (b.contract || b.status === 'CONFIRMED' || b.status === 'COMPLETED' || b.status === 'OWNER_ACCEPTED' || b.status === 'REQUESTED')
  );

  const handleCancelContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingBooking) return;
    if (!cancelReason.trim()) {
      setError('Indica el motivo de la cancelación del contrato.');
      return;
    }

    setLoadingAction(true);
    setError('');
    setMsg('');

    try {
      const res = await fetch(`/api/bookings/${cancellingBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel-contract',
          reason: cancelReason.trim(),
        }),
      });

      const data = await res.json();
      setLoadingAction(false);

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo cancelar el contrato');
      }

      setBookings((current) =>
        current.map((b) =>
          b.id === cancellingBooking.id ? { ...b, contract: data.contract } : b
        )
      );
      setMsg(`Contrato de la reserva ${cancellingBooking.code} cancelado. Se ha notificado al cliente por correo electrónico.`);
      setCancellingBooking(null);
      setCancelReason('');
    } catch (err: any) {
      setLoadingAction(false);
      setError(err.message || 'Error al cancelar el contrato');
    }
  };

  const handleRedoContract = async (bookingId: string, bookingCode: string) => {
    setLoadingAction(true);
    setError('');
    setMsg('');

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'redo-contract',
        }),
      });

      const data = await res.json();
      setLoadingAction(false);

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo regenerar el contrato');
      }

      setBookings((current) =>
        current.map((b) => (b.id === bookingId ? { ...b, contract: data.contract } : b))
      );
      setMsg(`Contrato ${bookingCode} regenerado. Puedes revisarlo y firmarlo a continuación.`);
      router.push(`/reserva/${bookingId}`);
    } catch (err: any) {
      setLoadingAction(false);
      setError(err.message || 'Error al rehacer el contrato');
    }
  };

  return (
    <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-2xl space-y-6 font-sans text-black">
      {/* ENCABEZADO DE LA SECCIÓN MIS CONTRATOS */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-5 font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 text-black flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight font-sans">
              Contratos Digitales & Fianza
            </h2>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              Custodia digital de actas, coberturas de seguro a todo riesgo y firmas de pilotaje.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contrato"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-mono font-bold transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generar Contrato Digital</span>
          </Link>

          <span className="text-xs font-mono font-bold bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-full text-black">
            {contractBookings.length} {contractBookings.length === 1 ? 'contrato' : 'contratos'}
          </span>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/30 text-red-800 text-xs font-mono font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* LISTADO DE CONTRATOS */}
      {contractBookings.length === 0 ? (
        <div className="py-10 text-center space-y-3 bg-gray-100 rounded-2xl border border-dashed border-gray-200 p-6 font-mono">
          <FileText className="w-10 h-10 text-black mx-auto opacity-50" />
          <h4 className="font-bold text-sm text-black">Aún no hay contratos registrados</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto font-sans">
            Al confirmar o aprobar tu primera jornada de conducción, el contrato digital cifrado se generará y archivará aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contractBookings.map((b) => {
            const contract = b.contract || {};
            let snapshot: any = {};
            try {
              if (contract.termsSnapshot) snapshot = JSON.parse(contract.termsSnapshot);
            } catch (_) {}

            const isContractCancelled = Boolean(snapshot.contractCancelled);
            const signedByTraveler = !!contract.signedByTraveler && !isContractCancelled;
            const signedByOwner = !!contract.signedByOwner && !isContractCancelled;
            const fullySigned = signedByTraveler && signedByOwner;
            const isSignedByMe = viewerRole === 'OWNER' ? signedByOwner : signedByTraveler;

            const counterPartyName =
              viewerRole === 'OWNER'
                ? `${b.traveler?.firstName || 'Piloto'} ${b.traveler?.lastName || ''}`
                : `${b.owner?.firstName || 'Propietario'} ${b.owner?.lastName || ''}`;

            return (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md ${
                  isContractCancelled
                    ? 'border-amber-500/30 bg-amber-50'
                    : 'border-gray-200 bg-gray-100 hover:border-black hover:bg-white'
                }`}
              >
                <div className="space-y-1.5 font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-black">
                      {b.code}
                    </span>

                    {isContractCancelled ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 text-[9px] font-bold uppercase flex items-center gap-1 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>CONTRATO ANULADO · REGENERACIÓN REQUERIDA</span>
                      </span>
                    ) : fullySigned ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[9px] font-bold uppercase flex items-center gap-1 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>FIRMADO POR AMBAS PARTES</span>
                      </span>
                    ) : isSignedByMe ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-black text-[9px] font-bold uppercase flex items-center gap-1 border border-gray-200">
                        <Clock className="w-3 h-3" />
                        <span>FIRMADO POR TI · ESPERANDO CONTRAPARTE</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-800 text-[9px] font-bold uppercase flex items-center gap-1 border border-red-500/30">
                        <Clock className="w-3 h-3" />
                        <span>PENDIENTE DE TU FIRMA</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-black font-sans">
                    {b.vehicle?.title || 'Superdeportivo'}
                  </h4>

                  {isContractCancelled && snapshot.cancelledReason && (
                    <p className="text-xs text-amber-800 font-medium italic font-sans">
                      Motivo: &ldquo;{snapshot.cancelledReason}&rdquo;
                    </p>
                  )}

                  <p className="text-xs text-gray-500 font-sans">
                    Contraparte: <strong className="text-black">{counterPartyName}</strong> · Periodo:{' '}
                    {new Date(b.pickupDate || b.createdAt).toLocaleDateString('es-ES')} -{' '}
                    {new Date(b.returnDate || b.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 font-mono">
                  {/* BOTÓN PARA REHACER CONTRATO */}
                  {isContractCancelled && viewerRole === 'OWNER' && (
                    <button
                      type="button"
                      disabled={loadingAction}
                      onClick={() => handleRedoContract(b.id, b.code)}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-black text-white hover:bg-neutral-800 px-4 py-2.5 text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rehacer Contrato</span>
                    </button>
                  )}

                  {/* BOTÓN VER / FIRMAR */}
                  <Link
                    href={`/reserva/${b.id}`}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:border-black transition-all shadow-sm cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-black" />
                    <span>{isContractCancelled ? 'Ver Detalle' : 'Ver / Firmar'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>

                  {/* BOTÓN PARA CANCELAR CONTRATO */}
                  {!isContractCancelled && viewerRole === 'OWNER' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCancellingBooking(b);
                        setCancelReason('');
                      }}
                      className="inline-flex items-center space-x-1 rounded-xl border border-red-500/30 bg-red-50 hover:bg-red-950/40 text-red-400 px-3 py-2 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE CANCELACIÓN DE CONTRATO */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-100 p-4 backdrop-blur-md font-sans">
          <form onSubmit={handleCancelContract} className="w-full max-w-lg rounded-3xl bg-gray-50 border border-red-500/30 p-7 shadow-2xl space-y-4 text-black">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="h-6 w-6 shrink-0 text-red-400" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[.2em] text-red-400">Gestión de Contratos</span>
                <h3 className="text-xl font-bold text-black">Cancelar Contrato Digital {cancellingBooking.code}</h3>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Al cancelar el contrato de la reserva <strong>{cancellingBooking.code}</strong>, se anularán las firmas actuales y se notificará a <strong>{cancellingBooking.traveler?.firstName || 'el cliente'}</strong>. Luego podrás hacer clic en <strong>&ldquo;Rehacer Contrato&rdquo;</strong> para generar uno nuevo.
            </p>

            <div>
              <label className="block text-xs font-mono font-bold text-black mb-1.5 uppercase">
                Motivo de cancelación del contrato *
              </label>
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej. Ajuste en el conductor adicional autorizado, actualización de la fianza pactada o corrección de datos personales."
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
                disabled={loadingAction}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                {loadingAction ? 'Cancelando...' : 'Confirmar y Notificar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
