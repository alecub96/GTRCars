'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { DollarSign, ArrowUpRight, ShieldCheck, Wallet, RefreshCw, Layers } from 'lucide-react';
import AdminVerificationQueue from '@/components/AdminVerificationQueue';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-[#E2E8F0]">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#D97706]">
              PANEL DE CONTROL ADMINISTRADOR
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
              Pasarela de Liquidaciones & Comisiones
            </h1>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-bold bg-[#14B8A6]/10 text-[#14B8A6] px-4 py-2 rounded-full border border-[#14B8A6]/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Cuenta de Recaudación Principal Activa</span>
          </div>
        </div>

        {/* MÉTRICAS FINANCIERAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#64748B]">
              Volumen Total Recaudado (Viajeros)
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#0F172A] mt-1">
              {data?.metrics?.totalVolume ? `${data.metrics.totalVolume.toFixed(2)}€` : '0.00€'}
            </h3>
            <p className="text-[11px] text-[#64748B] mt-2">Fondos ingresados en la cuenta de la plataforma</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center mb-4">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#64748B]">
              Tu Comisión Neta Ganada (4.5% + 10%)
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#14B8A6] mt-1">
              {data?.metrics?.totalPlatformCommission ? `${data.metrics.totalPlatformCommission.toFixed(2)}€` : '0.00€'}
            </h3>
            <p className="text-[11px] text-[#64748B] mt-2">Descontada automáticamente antes de la liquidación</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#64748B]">
              Total Pendiente de Transferir a Propietarios
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#D97706] mt-1">
              {data?.metrics?.totalOwnerPayoutsPending ? `${data.metrics.totalOwnerPayoutsPending.toFixed(2)}€` : '0.00€'}
            </h3>
            <p className="text-[11px] text-[#64748B] mt-2">Para transferir a cuentas bancarias de propietarios</p>
          </div>
        </div>

        <AdminVerificationQueue />

        {/* TABLA DE RESERVAS Y LIQUIDACIÓN POR PROPIETARIO */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E2E8F0]">
            <h3 className="font-serif text-xl font-bold">Desglose de Reservas & Liquidaciones a Propietarios</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-black uppercase tracking-wider text-[#64748B]">
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
              <tbody className="divide-y divide-[#E2E8F0] font-medium text-[#0F172A]">
                {data?.payouts && data.payouts.length > 0 ? (
                  data.payouts.map((p: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-4 font-bold">
                        <span className="block text-[#14B8A6]">{p.bookingCode}</span>
                        <span className="text-[11px] text-[#64748B] font-normal">{p.vehicleTitle} ({p.island})</span>
                      </td>
                      <td className="p-4">{p.travelerName}</td>
                      <td className="p-4 font-bold">{p.ownerName}</td>
                      <td className="p-4 text-right font-bold">{p.totalCollectedFromTraveler.toFixed(2)}€</td>
                      <td className="p-4 text-right font-bold text-[#14B8A6]">+{p.platformCommissionTaken.toFixed(2)}€</td>
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
                    <td colSpan={7} className="p-8 text-center text-[#64748B]">
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
