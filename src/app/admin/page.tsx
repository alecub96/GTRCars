'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  ShieldCheck,
  Wallet,
  Car,
  FileCheck,
  AlertTriangle,
  MessageSquare,
  Activity,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import AdminVehicleQueue from '@/components/AdminVehicleQueue';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminVerificationQueue from '@/components/AdminVerificationQueue';
import AdminIncidentQueue from '@/components/AdminIncidentQueue';
import AdminEmailDiagnostics from '@/components/AdminEmailDiagnostics';
import AdminLogin from '@/components/AdminLogin';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'users' | 'verifications' | 'incidents' | 'finances' | 'system'>('vehicles');

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard', { cache: 'no-store' });
      const d = await res.json();
      if (d && d.metrics) setData(d);
    } catch (err) {
      console.error('Error dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
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
          void fetchDashboardData();
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
  if (authorized === false) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
        <Navbar />
        <AdminLogin />
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* CABECERA PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E9E1D2]">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#16B8AA]">
              Administración Central Vaneando
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-1 text-[#13322E]">
              Centro de Operaciones & Control
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-full border ${
                metrics.stripeConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{metrics.stripeConfigured ? 'Stripe Connect Activo' : 'Stripe Config Pendiente'}</span>
            </div>

            <Link
              href="/soporte"
              className="inline-flex items-center space-x-2 rounded-full bg-[#13322E] hover:bg-[#16B8AA] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Bandeja de Soporte</span>
              {(metrics.unreadMessagesCount || 0) > 0 && (
                <span className="bg-[#16B8AA] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {metrics.unreadMessagesCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS Y RESUMEN OPERATIVO */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('vehicles')}
            className={`p-4 sm:p-5 rounded-3xl border text-left transition-all cursor-pointer ${
              activeTab === 'vehicles'
                ? 'border-[#16B8AA] bg-white ring-2 ring-[#16B8AA]/10 shadow-md'
                : 'border-[#E9E1D2] bg-white/70 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA] flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                Moderación
              </span>
              {(metrics.pendingVehiclesCount || 0) > 0 && (
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#13322E]">
              {metrics.pendingVehiclesCount || 0}
            </div>
            <p className="text-xs text-[#6B726E] mt-0.5">Campers por revisar</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            className={`p-4 sm:p-5 rounded-3xl border text-left transition-all cursor-pointer ${
              activeTab === 'verifications'
                ? 'border-[#16B8AA] bg-white ring-2 ring-[#16B8AA]/10 shadow-md'
                : 'border-[#E9E1D2] bg-white/70 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                Identidad DNI
              </span>
              {(metrics.pendingVerificationsCount || 0) > 0 && (
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500 animate-pulse" />
              )}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#13322E]">
              {metrics.pendingVerificationsCount || 0}
            </div>
            <p className="text-xs text-[#6B726E] mt-0.5">Conductores pendientes</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('incidents')}
            className={`p-4 sm:p-5 rounded-3xl border text-left transition-all cursor-pointer ${
              activeTab === 'incidents'
                ? 'border-[#16B8AA] bg-white ring-2 ring-[#16B8AA]/10 shadow-md'
                : 'border-[#E9E1D2] bg-white/70 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Incidencias
              </span>
              {(metrics.pendingIncidentsCount || 0) > 0 && (
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#13322E]">
              {metrics.pendingIncidentsCount || 0}
            </div>
            <p className="text-xs text-[#6B726E] mt-0.5">Partes de viaje abiertos</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finances')}
            className={`p-4 sm:p-5 rounded-3xl border text-left transition-all cursor-pointer ${
              activeTab === 'finances'
                ? 'border-[#16B8AA] bg-white ring-2 ring-[#16B8AA]/10 shadow-md'
                : 'border-[#E9E1D2] bg-white/70 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                Finanzas
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#13322E]">
              {metrics.totalVolume ? `${metrics.totalVolume.toFixed(0)}€` : '0€'}
            </div>
            <p className="text-xs text-[#6B726E] mt-0.5">Volumen procesado</p>
          </button>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="flex items-center space-x-2 border-b border-[#E9E1D2] mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('vehicles')}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vehicles'
                ? 'bg-[#13322E] text-white shadow-sm'
                : 'bg-white border border-[#E9E1D2] text-[#13322E] hover:bg-[#FAF7F0]'
            }`}
          >
            🚐 Moderación de Campers ({metrics.pendingVehiclesCount || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[#13322E] text-white shadow-sm'
                : 'bg-white border border-[#E9E1D2] text-[#13322E] hover:bg-[#FAF7F0]'
            }`}
          >
            👥 Clientes & Usuarios
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'verifications'
                ? 'bg-[#13322E] text-white shadow-sm'
                : 'bg-white border border-[#E9E1D2] text-[#13322E] hover:bg-[#FAF7F0]'
            }`}
          >
            🪪 Verificaciones DNI ({metrics.pendingVerificationsCount || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('incidents')}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'incidents'
                ? 'bg-[#13322E] text-white shadow-sm'
                : 'bg-white border border-[#E9E1D2] text-[#13322E] hover:bg-[#FAF7F0]'
            }`}
          >
            ⚠️ Incidencias ({metrics.pendingIncidentsCount || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finances')}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'finances'
                ? 'bg-[#13322E] text-white shadow-sm'
                : 'bg-white border border-[#E9E1D2] text-[#13322E] hover:bg-[#FAF7F0]'
            }`}
          >
            💰 Finanzas & Comisiones
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-[#13322E] text-white shadow-sm'
                : 'bg-white border border-[#E9E1D2] text-[#13322E] hover:bg-[#FAF7F0]'
            }`}
          >
            ⚙️ Diagnóstico & Correo
          </button>
        </div>

        {/* CONTENIDO DE CADA SECCIÓN */}
        {activeTab === 'vehicles' && (
          <section className="space-y-6">
            <AdminVehicleQueue />
          </section>
        )}

        {activeTab === 'users' && (
          <section className="space-y-6">
            <AdminUserManagement />
          </section>
        )}

        {activeTab === 'verifications' && (
          <section className="space-y-6">
            <AdminVerificationQueue />
          </section>
        )}

        {activeTab === 'incidents' && (
          <section className="space-y-6">
            <AdminIncidentQueue />
          </section>
        )}

        {activeTab === 'finances' && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                  Volumen Total Recaudado (Viajeros)
                </span>
                <h3 className="text-3xl font-extrabold text-[#13322E] mt-1 tracking-tight">
                  {metrics.totalVolume ? `${metrics.totalVolume.toFixed(2)}€` : '0.00€'}
                </h3>
                <p className="text-xs text-[#6B726E] mt-2">
                  Pagos confirmados por Stripe a través de Vaneando.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#16B8AA] flex items-center justify-center mb-4">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                  Tu Comisión Neta Ganada (4.5% + 10%)
                </span>
                <h3 className="text-3xl font-extrabold text-[#16B8AA] mt-1 tracking-tight">
                  {metrics.platformEarnings ? `${metrics.platformEarnings.toFixed(2)}€` : '0.00€'}
                </h3>
                <p className="text-xs text-[#6B726E] mt-2">
                  Margen bruto obtenido de comisiones de alquiler.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                  Total a Transferir a Propietarios
                </span>
                <h3 className="text-3xl font-extrabold text-[#D97706] mt-1 tracking-tight">
                  {metrics.pendingOwnerPayouts ? `${metrics.pendingOwnerPayouts.toFixed(2)}€` : '0.00€'}
                </h3>
                <p className="text-xs text-[#6B726E] mt-2">
                  Importe retenido a liquidar tras finalizar el alquiler.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'system' && (
          <section className="space-y-8">
            <AdminEmailDiagnostics />
          </section>
        )}
      </main>
    </div>
  );
}
