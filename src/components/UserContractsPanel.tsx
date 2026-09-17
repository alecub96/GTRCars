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
    <div className="bg-[#0f0f12] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 font-sans text-white">
      {/* ENCABEZADO DE LA SECCIÓN MIS CONTRATOS */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans">
              Contratos Digitales & Fianza
            </h2>
            <p className="text-xs text-white/50 font-sans mt-0.5">
              Custodia digital de actas, coberturas de seguro a todo riesgo y firmas de pilotaje.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold bg-black/60 border border-white/10 px-3.5 py-1.5 rounded-full text-[#D4AF37]">
          {contractBookings.length} {contractBookings.length === 1 ? 'contrato' : 'contratos'}
        </span>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-mono font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* LISTADO DE CONTRATOS */}
      {contractBookings.length === 0 ? (
        <div className="py-10 text-center space-y-3 bg-black/40 rounded-2xl border border-dashed border-white/15 p-6 font-mono">
          <FileText className="w-10 h-10 text-[#D4AF37] mx-auto opacity-50" />
          <h4 className="font-bold text-sm text-white">Aún no hay contratos registrados</h4>
          <p className="text-xs text-white/50 max-w-sm mx-auto font-sans">
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
                    ? 'border-amber-500/30 bg-amber-950/20'
                    : 'border-white/10 bg-black/40 hover:border-[#D4AF37]/50 hover:bg-white/[0.03]'
                }`}
              >
                <div className="space-y-1.5 font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#D4AF37]">
                      {b.code}
                    </span>

                    {isContractCancelled ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[9px] font-bold uppercase flex items-center gap-1 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>CONTRATO ANULADO · REGENERACIÓN REQUERIDA</span>
                      </span>
                    ) : fullySigned ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[9px] font-bold uppercase flex items-center gap-1 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>FIRMADO POR AMBAS PARTES</span>
                      </span>
                    ) : isSignedByMe ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[9px] font-bold uppercase flex items-center gap-1 border border-[#D4AF37]/30">
                        <Clock className="w-3 h-3" />
                        <span>FIRMADO POR TI · ESPERANDO CONTRAPARTE</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-300 text-[9px] font-bold uppercase flex items-center gap-1 border border-red-500/30">
                        <Clock className="w-3 h-3" />
                        <span>PENDIENTE DE TU FIRMA</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-white font-sans">
                    {b.vehicle?.title || 'Superdeportivo'}
                  </h4>

                  {isContractCancelled && snapshot.cancelledReason && (
                    <p className="text-xs text-amber-300 font-medium italic font-sans">
                      Motivo: &ldquo;{snapshot.cancelledReason}&rdquo;
                    </p>
                  )}

                  <p className="text-xs text-white/50 font-sans">
                    Contraparte: <strong className="text-white">{counterPartyName}</strong> · Periodo:{' '}
                    {new Date(b.pickupDate || b.createdAt).toLocaleDateString('es-ES')} -{' '}
                    {new Date(b.returnDate || b.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 font-mono">
                  {/* BOTÓN PARA REHACER CONTRATO */}
                  {isContractCancelled && viewerRole === 'OWNER' && (
                    <button
                      type="button"
                      disabled={loadingAction}
                      onClick={() => handleRedoContract(b.id, b.code)}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black px-4 py-2.5 text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rehacer Contrato</span>
                    </button>
                  )}

                  {/* BOTÓN VER / FIRMAR */}
                  <Link
                    href={`/reserva/${b.id}`}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:border-[#D4AF37]/50 transition-all shadow-sm cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{isContractCancelled ? 'Ver Detalle' : 'Ver / Firmar'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                  </Link>

                  {/* BOTÓN PARA CANCELAR CONTRATO */}
                  {!isContractCancelled && viewerRole === 'OWNER' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCancellingBooking(b);
                        setCancelReason('');
                      }}
                      className="inline-flex items-center space-x-1 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 text-red-400 px-3 py-2 text-xs font-bold transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md font-sans">
          <form onSubmit={handleCancelContract} className="w-full max-w-lg rounded-3xl bg-[#0f0f12] border border-red-500/30 p-7 shadow-2xl space-y-4 text-white">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="h-6 w-6 shrink-0 text-red-400" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[.2em] text-red-400">Gestión de Contratos</span>
                <h3 className="text-xl font-bold text-white">Cancelar Contrato Digital {cancellingBooking.code}</h3>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Al cancelar el contrato de la reserva <strong>{cancellingBooking.code}</strong>, se anularán las firmas actuales y se notificará a <strong>{cancellingBooking.traveler?.firstName || 'el cliente'}</strong>. Luego podrás hacer clic en <strong>&ldquo;Rehacer Contrato&rdquo;</strong> para generar uno nuevo.
            </p>

            <div>
              <label className="block text-xs font-mono font-bold text-white mb-1.5 uppercase">
                Motivo de cancelación del contrato *
              </label>
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej. Ajuste en el conductor adicional autorizado, actualización de la fianza pactada o corrección de datos personales."
                className="w-full rounded-xl border border-white/15 p-3 text-xs bg-black/50 text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 font-mono">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
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
