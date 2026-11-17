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
  BarChart3,
  ExternalLink,
  Calendar,
  KeyRound,
  Database,
  Lock,
} from 'lucide-react';
import AdminVehicleQueue from '@/components/AdminVehicleQueue';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminConversationsAudit from '@/components/AdminConversationsAudit';
import AdminVerificationQueue from '@/components/AdminVerificationQueue';
import AdminIncidentQueue from '@/components/AdminIncidentQueue';
import AdminEmailDiagnostics from '@/components/AdminEmailDiagnostics';
import AdminLogin from '@/components/AdminLogin';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import OwnerBrowserNotifications from '@/components/OwnerBrowserNotifications';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'bookings' | 'users' | 'conversations' | 'verifications' | 'incidents' | 'finances' | 'system'>('vehicles');

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

        const adminEmails = ['admin@gtrcars.es', 'contacto@gtrcars.es', 'alecub96@hotmail.com'];
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

  if (authorized === null) return <div className="min-h-screen bg-neutral-50" />;
  if (authorized === false) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        <Navbar />
        <AdminLogin />
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="min-h-screen bg-slate-50 text-neutral-900 font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* CABECERA PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-neutral-300">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-rose-600">
                GTR CARS // SISTEMA CENTRAL
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">
              Centro de Operaciones & Control
            </h1>
            <p className="text-xs text-neutral-600 mt-1.5 font-medium font-mono">
              Panel ejecutivo de supervisión de flota, validaciones de pilotos y conciliación bancaria Stripe en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto font-mono text-xs">
            {/* ESTADO BASE DE DATOS */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase DB: Conectada</span>
            </div>

            {/* ESTADO STRIPE */}
            <div
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-bold border ${
                metrics.stripeConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{metrics.stripeConfigured ? 'Stripe Connect: Live' : 'Stripe: Pendiente'}</span>
            </div>

            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 text-neutral-700 hover:border-black hover:text-black transition-all cursor-pointer font-bold shadow-xs"
            >
              <RefreshCw className={`w-3 h-3 text-rose-600 ${loading ? 'animate-spin' : ''}`} />
              <span>Refrescar</span>
            </button>
          </div>
        </div>

        {/* MÉTRICAS EN TIEMPO REAL CON SENTIDO OPERATIVO */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 font-mono">
          {/* 1. FLOTA DISPONIBLE */}
          <button
            type="button"
            onClick={() => setActiveTab('vehicles')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'vehicles'
                ? 'border-black bg-white ring-2 ring-black/5 shadow-md'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-rose-600" />
                Flota
              </span>
              {(metrics.pendingVehiclesCount || 0) > 0 && (
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" title="Vehículos por revisar" />
              )}
            </div>
            <div className="text-2xl font-black text-neutral-950 font-sans">
              {metrics.activeVehiclesCount ?? metrics.totalVehiclesCount ?? 2}
            </div>
            <p className="text-[10px] text-neutral-700 font-medium mt-0.5 truncate">
              {metrics.pendingVehiclesCount > 0 ? `${metrics.pendingVehiclesCount} por aprobar` : 'Coches operativos'}
            </p>
          </button>

          {/* 2. RESERVAS */}
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-black bg-white ring-2 ring-black/5 shadow-md'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Alquileres
              </span>
            </div>
            <div className="text-2xl font-black text-neutral-950 font-sans">
              {metrics.totalBookings || 0}
            </div>
            <p className="text-[10px] text-neutral-700 font-medium mt-0.5 truncate">
              {metrics.activeBookings || 0} en curso
            </p>
          </button>

          {/* 3. USUARIOS Y PILOTOS */}
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'border-black bg-white ring-2 ring-black/5 shadow-md'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Comunidad
              </span>
            </div>
            <div className="text-2xl font-black text-neutral-950 font-sans">
              {metrics.totalUsersCount || 0}
            </div>
            <p className="text-[10px] text-neutral-700 font-medium mt-0.5 truncate">
              {metrics.verifiedDriversCount || 0} verificados
            </p>
          </button>

          {/* 4. VALIDACIÓN LICENCIAS */}
          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'verifications'
                ? 'border-black bg-white ring-2 ring-black/5 shadow-md'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-sky-600" />
                Licencias
              </span>
              {(metrics.pendingVerificationsCount || 0) > 0 && (
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              )}
            </div>
            <div className="text-2xl font-black text-neutral-950 font-sans">
              {metrics.pendingVerificationsCount || 0}
            </div>
            <p className="text-[10px] text-neutral-700 font-medium mt-0.5 truncate">
              DNI/Carnet pendientes
            </p>
          </button>

          {/* 5. FINANZAS Y FACTURACIÓN */}
          <button
            type="button"
            onClick={() => setActiveTab('finances')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'finances'
                ? 'border-black bg-white ring-2 ring-black/5 shadow-md'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Volumen
              </span>
            </div>
            <div className="text-2xl font-black text-neutral-950 font-sans">
              {metrics.totalVolume ? `${metrics.totalVolume.toFixed(0)}€` : '0€'}
            </div>
            <p className="text-[10px] text-neutral-700 font-medium mt-0.5 truncate">
              {metrics.platformEarnings ? `${metrics.platformEarnings.toFixed(0)}€ comisiones` : 'Sin cobros'}
            </p>
          </button>

          {/* 6. INCIDENCIAS FLOTA */}
          <button
            type="button"
            onClick={() => setActiveTab('incidents')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'incidents'
                ? 'border-black bg-white ring-2 ring-black/5 shadow-md'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Incidencias
              </span>
              {(metrics.pendingIncidentsCount || 0) > 0 && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </div>
            <div className="text-2xl font-black text-neutral-950 font-sans">
              {metrics.pendingIncidentsCount || 0}
            </div>
            <p className="text-[10px] text-neutral-700 font-medium mt-0.5 truncate">Partes abiertos</p>
          </button>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN PRINCIPAL */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-300 mb-8 pb-3 font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vehicles'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
            }`}
          >
            Flota de Superdeportivos ({metrics.activeVehiclesCount ?? metrics.totalVehiclesCount ?? 2})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
            }`}
          >
            Reservas & Expedientes ({metrics.totalBookings || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
            }`}
          >
            Pilotos & Propietarios ({metrics.totalUsersCount || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'verifications'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
            }`}
          >
            Licencias DNI ({metrics.pendingVerificationsCount || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finances')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'finances'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
            }`}
          >
            Bóveda Stripe & Liquidaciones
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('conversations')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'conversations'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
            }`}
          >
            Auditoría de Mensajes ({metrics.totalConversationsCount || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('incidents')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'incidents'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
            }`}
          >
            Incidencias ({metrics.pendingIncidentsCount || 0})
          </button>

          <Link
            href="/soporte"
            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-neutral-300 text-neutral-700 hover:border-black transition-all whitespace-nowrap ml-auto"
          >
            Bandeja de Soporte en Vivo →
          </Link>
        </div>

        {/* 1. SECCIÓN: FLOTA DE SUPERDEPORTIVOS */}
        {activeTab === 'vehicles' && (
          <section className="space-y-6">
            <AdminVehicleQueue />
          </section>
        )}

        {/* 2. SECCIÓN: RESERVAS Y EXPEDIENTES REALES */}
        {activeTab === 'bookings' && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-300 pb-5 mb-5 gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-rose-600">
                    Expedientes de Alquiler // Base de Datos
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-sans">
                    Reservas & Alquileres de Superdeportivos
                  </h2>
                  <p className="text-xs text-neutral-700 font-medium mt-0.5 font-medium">
                    Listado cronológico de solicitudes y reservas procesadas en tiempo real.
                  </p>
                </div>
              </div>

              {recentBookings.length === 0 ? (
                <div className="py-16 text-center rounded-2xl bg-neutral-50 border border-neutral-300">
                  <Calendar className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                  <p className="text-base font-bold text-neutral-900">Aún no hay reservas registradas en la base de datos.</p>
                  <p className="text-xs text-neutral-700 font-medium mt-1 max-w-md mx-auto">
                    Cuando un cliente complete un alquiler desde la web, aparecerá aquí automáticamente con el código de reserva, fianza retenida en Stripe y estado de la entrega.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-neutral-50 border-b border-neutral-300 text-neutral-700 font-medium uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Superdeportivo</th>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">Fechas</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Fianza Vault</th>
                        <th className="py-3 px-4 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {recentBookings.map((b: any) => (
                        <tr key={b.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-neutral-900">{b.code}</td>
                          <td className="py-3.5 px-4 font-sans font-bold text-neutral-900">{b.vehicleTitle}</td>
                          <td className="py-3.5 px-4 text-neutral-600">{b.travelerName}</td>
                          <td className="py-3.5 px-4 text-neutral-700 font-medium">
                            {new Date(b.pickupDate).toLocaleDateString('es-ES')} - {new Date(b.returnDate).toLocaleDateString('es-ES')}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-neutral-900">{b.totalAmount} €</td>
                          <td className="py-3.5 px-4 text-neutral-600">{b.securityDeposit} €</td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 3. SECCIÓN: CLIENTES Y USUARIOS */}
        {activeTab === 'users' && (
          <section className="space-y-6">
            <AdminUserManagement />
          </section>
        )}

        {/* 4. SECCIÓN: VALIDACIÓN DE LICENCIAS DNI */}
        {activeTab === 'verifications' && (
          <section className="space-y-6">
            <AdminVerificationQueue />
          </section>
        )}

        {/* 5. SECCIÓN: FINANZAS Y STRIPE CONNECT */}
        {activeTab === 'finances' && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-neutral-300 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 font-medium">
                  Volumen Bruto Procesado
                </span>
                <h3 className="text-3xl font-black text-neutral-900 mt-1 font-mono">
                  {metrics.totalVolume ? `${metrics.totalVolume.toFixed(2)} €` : '0.00 €'}
                </h3>
                <p className="text-xs text-neutral-700 font-medium mt-2 font-medium">
                  Pagos liquidados mediante pasarela segura Stripe.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-300 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 font-medium">
                  Comisión Plataforma GTR Cars
                </span>
                <h3 className="text-3xl font-black text-rose-600 mt-1 font-mono">
                  {metrics.platformEarnings ? `${metrics.platformEarnings.toFixed(2)} €` : '0.00 €'}
                </h3>
                <p className="text-xs text-neutral-700 font-medium mt-2 font-medium">
                  Margen neto recaudado por intermediación y servicios.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-300 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 font-medium">
                  Liquidaciones a Propietarios VIP
                </span>
                <h3 className="text-3xl font-black text-neutral-900 mt-1 font-mono">
                  {metrics.pendingOwnerPayouts ? `${metrics.pendingOwnerPayouts.toFixed(2)} €` : '0.00 €'}
                </h3>
                <p className="text-xs text-neutral-700 font-medium mt-2 font-medium">
                  Transferencias automáticas vía cuentas Stripe Connect.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 6. SECCIÓN: AUDITORÍA DE CONVERSACIONES RGPD */}
        {activeTab === 'conversations' && (
          <section className="space-y-6">
            <AdminConversationsAudit />
          </section>
        )}

        {/* 7. SECCIÓN: INCIDENCIAS FLOTA */}
        {activeTab === 'incidents' && (
          <section className="space-y-6">
            <AdminIncidentQueue />
          </section>
        )}
      </main>
    </div>
  );
}
