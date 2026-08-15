'use client';

import React from 'react';
import Link from 'next/link';
import { FileCheck2, ShieldCheck, Printer, CheckCircle2, Clock, ChevronRight, FileText } from 'lucide-react';

interface UserContractsPanelProps {
  bookings: any[];
  viewerRole: 'TRAVELER' | 'OWNER' | 'ADMIN';
}

export default function UserContractsPanel({ bookings, viewerRole }: UserContractsPanelProps) {
  // Filtrar reservas que tengan solicitud o contrato activo
  const contractBookings = bookings.filter(
    (b) => b && (b.contract || b.status === 'CONFIRMED' || b.status === 'COMPLETED' || b.status === 'OWNER_ACCEPTED' || b.status === 'REQUESTED')
  );

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
              Historial permanente de contratos de alquiler firmados en la plataforma.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold bg-[#FAF7F0] border border-[#E9E1D2] px-3.5 py-1.5 rounded-full text-[#13322E]">
          {contractBookings.length} {contractBookings.length === 1 ? 'contrato' : 'contratos'}
        </span>
      </div>

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
            const signedByTraveler = !!contract.signedByTraveler;
            const signedByOwner = !!contract.signedByOwner;
            const fullySigned = signedByTraveler && signedByOwner;
            const isSignedByMe = viewerRole === 'OWNER' ? signedByOwner : signedByTraveler;

            const counterPartyName =
              viewerRole === 'OWNER'
                ? `${b.traveler?.firstName || 'Viajero'} ${b.traveler?.lastName || ''}`
                : `${b.owner?.firstName || 'Propietario'} ${b.owner?.lastName || ''}`;

            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl border border-[#E9E1D2] bg-[#FAF7F0]/40 hover:bg-white hover:border-[#16B8AA] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#16B8AA]">
                      {b.code}
                    </span>
                    {fullySigned ? (
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

                  <p className="text-xs text-[#6B726E] font-medium">
                    Contraparte: <strong>{counterPartyName}</strong> · Fechas:{' '}
                    {new Date(b.pickupDate || b.createdAt).toLocaleDateString('es-ES')} -{' '}
                    {new Date(b.returnDate || b.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E9E1D2]">
                  <Link
                    href={`/reserva/${b.id}`}
                    className="inline-flex items-center space-x-1.5 rounded-full bg-[#13322E] hover:bg-[#254842] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#16B8AA]" />
                    <span>Ver / Firmar Contrato</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
