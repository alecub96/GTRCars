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
    <div className="bg-white rounded-3xl border border-[#E9E1D2] p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* ENCABEZADO DE LA SECCIÓN MIS CONTRATOS */}
      <div className="flex items-center justify-between border-b border-[#E9E1D2] pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#13322E] tracking-tight">
              Mis Contratos Digitales
            </h2>
            <p className="text-xs text-[#6B726E] font-medium mt-0.5">
              Historial de contratos de alquiler, firmas digitales y control de modificaciones.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold bg-[#FAF7F0] border border-[#E9E1D2] px-3.5 py-1.5 rounded-full text-[#13322E]">
          {contractBookings.length} {contractBookings.length === 1 ? 'contrato' : 'contratos'}
        </span>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* LISTADO DE CONTRATOS */}
      {contractBookings.length === 0 ? (
        <div className="py-10 text-center space-y-3 bg-[#FAF7F0] rounded-2xl border border-dashed border-[#E9E1D2] p-6">
          <FileText className="w-10 h-10 text-[#16B8AA] mx-auto opacity-60" />
          <h4 className="font-bold text-sm text-[#13322E]">Aún no tienes contratos registrados</h4>
          <p className="text-xs text-[#6B726E] max-w-sm mx-auto font-medium">
            Cuando aceptes o confirmes tu primera reserva, el contrato digital generado se guardará aquí de forma permanente.
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
                ? `${b.traveler?.firstName || 'Viajero'} ${b.traveler?.lastName || ''}`
                : `${b.owner?.firstName || 'Propietario'} ${b.owner?.lastName || ''}`;

            return (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                  isContractCancelled
                    ? 'border-amber-300 bg-amber-50/40'
                    : 'border-[#E9E1D2] bg-[#FAF7F0]/40 hover:bg-white hover:border-[#16B8AA]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#16B8AA]">
                      {b.code}
                    </span>

                    {isContractCancelled ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[9px] font-black uppercase flex items-center gap-1 border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        <span>CONTRATO CANCELADO / PENDIENTE DE REHACER</span>
                      </span>
                    ) : fullySigned ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>FIRMADO POR AMBOS</span>
                      </span>
                    ) : isSignedByMe ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-black uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>FIRMADO POR TI · ESPERANDO OTRA PARTE</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 text-[9px] font-black uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>PENDIENTE DE TU FIRMA</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-[#13322E]">
                    {b.vehicle?.title || 'Camper'}
                  </h4>

                  {isContractCancelled && snapshot.cancelledReason && (
                    <p className="text-xs text-amber-800 font-medium italic">
                      Motivo de cancelación: &ldquo;{snapshot.cancelledReason}&rdquo;
                    </p>
                  )}

                  <p className="text-xs text-[#6B726E] font-medium">
                    Contraparte: <strong>{counterPartyName}</strong> · Fechas:{' '}
                    {new Date(b.pickupDate || b.createdAt).toLocaleDateString('es-ES')} -{' '}
                    {new Date(b.returnDate || b.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E9E1D2]">
                  {/* BOTÓN PARA REHACER CONTRATO (SI ESTÁ CANCELADO Y SOY PROPIETARIO) */}
                  {isContractCancelled && viewerRole === 'OWNER' && (
                    <button
                      type="button"
                      disabled={loadingAction}
                      onClick={() => handleRedoContract(b.id, b.code)}
                      className="inline-flex items-center space-x-1.5 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rehacer y Regenerar Contrato</span>
                    </button>
                  )}

                  {/* BOTÓN VER / FIRMAR */}
                  <Link
                    href={`/reserva/${b.id}`}
                    className="inline-flex items-center space-x-1.5 rounded-full bg-[#13322E] hover:bg-[#254842] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#16B8AA]" />
                    <span>{isContractCancelled ? 'Ver Detalle' : 'Ver / Firmar Contrato'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  {/* BOTÓN PARA CANCELAR CONTRATO (PROPIETARIO / ADMIN) */}
                  {!isContractCancelled && viewerRole === 'OWNER' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCancellingBooking(b);
                        setCancelReason('');
                      }}
                      className="inline-flex items-center space-x-1 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancelar Contrato</span>
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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#13322E]/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleCancelContract} className="w-full max-w-lg rounded-[32px] bg-white p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-[.2em]">Gestión de Contratos</span>
                <h3 className="font-serif text-2xl font-bold text-[#13322E]">Cancelar Contrato Digital</h3>
              </div>
            </div>

            <p className="text-xs text-[#6B726E] leading-relaxed">
              Al cancelar el contrato de la reserva <strong>{cancellingBooking.code}</strong>, se anularán las firmas actuales y se enviará un correo automático a <strong>{cancellingBooking.traveler?.firstName || 'el cliente'}</strong> notificándole la cancelación. Luego podrás hacer clic en <strong>&ldquo;Rehacer Contrato&rdquo;</strong> para generar uno nuevo.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#13322E] mb-1.5">
                Motivo de la cancelación del contrato (se enviará en el email al cliente) *
              </label>
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej. Ajuste en el conductor adicional autorizado, actualización de la fianza pactada o corrección de datos personales."
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
                disabled={loadingAction}
                className="rounded-full bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-black text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                {loadingAction ? 'Cancelando...' : 'Confirmar y Notificar al Cliente'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
