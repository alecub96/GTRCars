'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { DollarSign, ArrowUpRight, ShieldCheck, Wallet, RefreshCw, Layers } from 'lucide-react';
import AdminVerificationQueue from '@/components/AdminVerificationQueue';
import AdminEmailDiagnostics from '@/components/AdminEmailDiagnostics';
import Link from 'next/link';
import AdminVehicleQueue from '@/components/AdminVehicleQueue';
import AdminLogin from '@/components/AdminLogin';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((response) => response.json()).then((auth) => {
      const isAdmin = auth.user?.role === 'ADMIN';
      setAuthorized(isAdmin);
      return isAdmin ? fetch('/api/admin/dashboard') : null;
    })
      .then((res) => res?.json())
      .then((d) => {
        if (d) setData(d);
        setLoading(false);
      });
  }, []);

  if (authorized === null) return <div className="min-h-screen bg-[#F7F6F2]" />;
  if (authorized === false) return <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar /><AdminLogin /></div>;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-[#E9E1D2]">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#D97706]">
              PANEL DE CONTROL ADMINISTRADOR
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
              Pasarela de Liquidaciones & Comisiones
            </h1>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-bold bg-[#16B8AA]/10 text-[#16B8AA] px-4 py-2 rounded-full border border-[#16B8AA]/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Cuenta de Recaudación Principal Activa</span>
          </div>
          <Link href="/soporte" className="mt-3 md:mt-0 rounded-full bg-[#13322E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Chat con usuarios</Link>
        </div>

        {/* MÉTRICAS FINANCIERAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
              Volumen Total Recaudado (Viajeros)
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#13322E] mt-1">
              {data?.metrics?.totalVolume ? `${data.metrics.totalVolume.toFixed(2)}€` : '0.00€'}
            </h3>
            <p className="text-[11px] text-[#6B726E] mt-2">Fondos ingresados en la cuenta de la plataforma</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center mb-4">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
              Tu Comisión Neta Ganada (4.5% + 10%)
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#16B8AA] mt-1">
              {data?.metrics?.totalPlatformCommission ? `${data.metrics.totalPlatformCommission.toFixed(2)}€` : '0.00€'}
            </h3>
            <p className="text-[11px] text-[#6B726E] mt-2">Descontada automáticamente antes de la liquidación</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
              Total Pendiente de Transferir a Propietarios
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#D97706] mt-1">
              {data?.metrics?.totalOwnerPayoutsPending ? `${data.metrics.totalOwnerPayoutsPending.toFixed(2)}€` : '0.00€'}
            </h3>
            <p className="text-[11px] text-[#6B726E] mt-2">Para transferir a cuentas bancarias de propietarios</p>
          </div>
        </div>

        <AdminVehicleQueue />
        <AdminVerificationQueue />
        <AdminEmailDiagnostics />

        {/* TABLA DE RESERVAS Y LIQUIDACIÓN POR PROPIETARIO */}
        <div className="bg-white rounded-3xl border border-[#E9E1D2] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E9E1D2]">
            <h3 className="font-serif text-xl font-bold">Desglose de Reservas & Liquidaciones a Propietarios</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E9E1D2] font-black uppercase tracking-wider text-[#6B726E]">
                <tr>
                  <th className="p-4">Código / Camper</th>
                  <th className="p-4">Viajero</th>
                  <th className="p-4">Propietario Beneficiario</th>
                  <th className="p-4 text-right">Cobrado al Viajero</th>
                  <th className="p-4 text-right">Tu Comisión</th>
                  <th className="p-4 text-right">A Transferir al Propietario</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E1D2] font-medium text-[#13322E]">
                {data?.payouts && data.payouts.length > 0 ? (
                  data.payouts.map((p: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-4 font-bold">
                        <span className="block text-[#16B8AA]">{p.bookingCode}</span>
                        <span className="text-[11px] text-[#6B726E] font-normal">{p.vehicleTitle} ({p.island})</span>
                      </td>
                      <td className="p-4">{p.travelerName}</td>
                      <td className="p-4 font-bold">{p.ownerName}</td>
                      <td className="p-4 text-right font-bold">{p.totalCollectedFromTraveler.toFixed(2)}€</td>
                      <td className="p-4 text-right font-bold text-[#16B8AA]">+{p.platformCommissionTaken.toFixed(2)}€</td>
                      <td className="p-4 text-right font-bold text-[#D97706]">{p.ownerPayoutAmount.toFixed(2)}€</td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#6B726E]">
                      No hay reservas procesadas en el sistema aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
