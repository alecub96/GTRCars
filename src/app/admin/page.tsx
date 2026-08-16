'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, ArrowUpRight, ShieldCheck, Wallet, UserRound } from 'lucide-react';
import AdminVerificationQueue from '@/components/AdminVerificationQueue';
import AdminEmailDiagnostics from '@/components/AdminEmailDiagnostics';
import Link from 'next/link';
import AdminVehicleQueue from '@/components/AdminVehicleQueue';
import AdminLogin from '@/components/AdminLogin';
import AdminIncidentQueue from '@/components/AdminIncidentQueue';
import AdminRefundButton from '@/components/AdminRefundButton';
import Navbar from '@/components/Navbar';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [serviceError, setServiceError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((auth) => {
        if (!auth?.user) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        const adminEmails = ['admin@vaneando.com', 'vaneando@vaneando.com'];
        const isAdmin = auth.user.role === 'ADMIN' || adminEmails.includes(auth.user.email?.toLowerCase());
        setAuthorized(isAdmin);

        if (isAdmin) {
          fetch('/api/admin/dashboard')
            .then((res) => res.json())
            .then((d) => {
              if (d && d.metrics) setData(d);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setAuthorized(false);
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
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">
              Pasarela de Liquidaciones & Comisiones
            </h1>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-bold bg-[#16B8AA]/10 text-[#16B8AA] px-4 py-2 rounded-full border border-[#16B8AA]/30">
            <ShieldCheck className="w-4 h-4" />
            <span>{data?.metrics?.stripeConfigured ? 'Stripe configurado' : 'Stripe pendiente de configuración'}</span>
          </div>
          <Link href="/soporte" className="mt-3 md:mt-0 rounded-full bg-[#13322E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Bandeja de soporte</Link>
        </div>

        <section className="mb-8 flex flex-col gap-4 rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#13322E] text-[#16B8AA]"><UserRound className="h-6 w-6" /></div><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#16B8AA]">Perfil administrador</p><h2 className="text-2xl font-bold tracking-tight">Tu cuenta y preferencias</h2><p className="text-sm text-[#6B726E]">Gestiona tu perfil, seguridad y sesiones desde un espacio separado del panel financiero.</p></div></div>
          <Link href="/perfil" className="rounded-full border border-[#13322E] px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#13322E] hover:bg-[#13322E] hover:text-white transition-all">Abrir mi perfil</Link>
        </section>

        {/* CENTRO DE ALERTAS Y ACCIONES PENDIENTES */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-3xl border transition-all ${
            (data?.metrics?.pendingVehiclesCount || 0) > 0
              ? 'bg-amber-50/80 border-amber-300 shadow-sm'
              : 'bg-white border-[#E9E1D2]'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D97706]">Moderación</span>
              {(data?.metrics?.pendingVehiclesCount || 0) > 0 && (
                <span className="animate-pulse flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              )}
            </div>
            <h4 className="text-2xl font-black text-[#13322E]">{data?.metrics?.pendingVehiclesCount || 0}</h4>
            <p className="text-xs text-[#6B726E] font-medium mt-1">Campers pendientes de aprobación</p>
          </div>

          <div className={`p-5 rounded-3xl border transition-all ${
            (data?.metrics?.pendingVerificationsCount || 0) > 0
              ? 'bg-sky-50/80 border-sky-300 shadow-sm'
              : 'bg-white border-[#E9E1D2]'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700">Identidad DNI</span>
              {(data?.metrics?.pendingVerificationsCount || 0) > 0 && (
                <span className="animate-pulse flex h-2.5 w-2.5 rounded-full bg-sky-500" />
              )}
            </div>
            <h4 className="text-2xl font-black text-[#13322E]">{data?.metrics?.pendingVerificationsCount || 0}</h4>
            <p className="text-xs text-[#6B726E] font-medium mt-1">Documentos por validar</p>
          </div>

          <div className={`p-5 rounded-3xl border transition-all ${
            (data?.metrics?.pendingIncidentsCount || 0) > 0
              ? 'bg-red-50/80 border-red-300 shadow-sm'
              : 'bg-white border-[#E9E1D2]'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700">Incidencias</span>
              {(data?.metrics?.pendingIncidentsCount || 0) > 0 && (
                <span className="animate-pulse flex h-2.5 w-2.5 rounded-full bg-red-500" />
              )}
            </div>
            <h4 className="text-2xl font-black text-[#13322E]">{data?.metrics?.pendingIncidentsCount || 0}</h4>
            <p className="text-xs text-[#6B726E] font-medium mt-1">Partes de viaje abiertos</p>
          </div>

          <Link href="/soporte" className="p-5 rounded-3xl border border-[#E9E1D2] bg-white hover:bg-[#FAF7F0] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA]">Soporte</span>
              <span className="text-xs font-bold text-[#16B8AA] group-hover:translate-x-1 transition-transform">Ver chat →</span>
            </div>
            <div>
              <h4 className="text-2xl font-black text-[#13322E]">{data?.metrics?.unreadMessagesCount || 0}</h4>
              <p className="text-xs text-[#6B726E] font-medium mt-1">Mensajes de usuarios</p>
            </div>
          </Link>
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
            <h3 className="text-3xl font-extrabold text-[#13322E] mt-1 tracking-tight">
              {data?.metrics?.totalVolume ? `${data.metrics.totalVolume.toFixed(2)}€` : '0.00€'}
            </h3>
            <p className="text-[11px] text-[#6B726E] mt-2">Solo pagos confirmados por Stripe; las solicitudes aún no cuentan como ingresos.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center mb-4">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
              Tu Comisión Neta Ganada (4.5% + 10%)
            </span>
            <h3 className="text-3xl font-extrabold text-[#16B8AA] mt-1 tracking-tight">
              {data?.metrics?.totalPlatformCommission ? `${data.metrics.totalPlatformCommission.toFixed(2)}€` : '0.00€'}
            </h3>
            <p className="text-[11px] text-[#6B726E] mt-2">Comisiones de reservas cuyo pago ya se ha confirmado.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
              Total Pendiente de Transferir a Propietarios
            </span>
            <h3 className="text-3xl font-extrabold text-[#D97706] mt-1 tracking-tight">
              {data?.metrics?.totalOwnerPayoutsPending ? `${data.metrics.totalOwnerPayoutsPending.toFixed(2)}€` : '0.00€'}
            </h3>
            <p className="text-[11px] text-[#6B726E] mt-2">Importe de reservas pagadas pendiente de liquidación.</p>
          </div>
        </div>

        <AdminVehicleQueue />
        <AdminVerificationQueue />
        <AdminIncidentQueue />
        <AdminEmailDiagnostics />

        {/* TABLA DE RESERVAS Y LIQUIDACIÓN POR PROPIETARIO */}
        <div className="bg-white rounded-3xl border border-[#E9E1D2] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E9E1D2]">
            <h3 className="text-xl font-bold tracking-tight">Pagos confirmados y liquidaciones</h3>
            <p className="mt-1 text-sm text-[#6B726E]">Esta tabla solo muestra reservas con un pago confirmado. Desde «Ver reserva» puedes revisar el contrato, el estado y las acciones disponibles para administración.</p>
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
                  <th className="p-4 text-center">Acciones</th>
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
                      <td className="p-4 text-center">
                        <Link href={`/reserva/${p.bookingId}`} className="font-bold text-[#0F766E] underline">Ver reserva</Link>
                        <AdminRefundButton bookingId={p.bookingId} bookingCode={p.bookingCode} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[#6B726E]">
                      Todavía no hay pagos confirmados. Las solicitudes y reservas pendientes no aparecen como ingresos hasta que Stripe confirme el pago.
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
