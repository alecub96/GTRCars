'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { BadgeCheck, Sparkles, Plus, BarChart3, WalletCards, Pencil, ShieldCheck, KeyRound, Gauge, Trophy, Star } from 'lucide-react';
import OwnerAvailabilityCalendar from '@/components/OwnerAvailabilityCalendar';
import OwnerBookingsPanel from '@/components/OwnerBookingsPanel';
import OwnerBrowserNotifications from '@/components/OwnerBrowserNotifications';
import UserContractsPanel from '@/components/UserContractsPanel';
import { useRouter } from 'next/navigation';
import StripeConnectOnboarding from '@/components/StripeConnectOnboarding';

const DEMO_OWNER_VEHICLES = [
  {
    id: 'demo-vehicle-001',
    slug: 'lamborghini-revuelto-2024',
    title: 'Lamborghini Revuelto V12 Híbrido HPEV',
    island: 'Tenerife / Las Palmas',
    municipality: 'Adeje / Maspalomas',
    basePricePerDay: 2200,
    status: 'ACTIVE',
    isFeatured: true,
    photos: [{ url: '/supercars/lambo_revuelto.jpg' }],
  },
  {
    id: 'demo-vehicle-002',
    slug: 'ferrari-sf90-stradale',
    title: 'Ferrari SF90 Stradale Assetto Fiorano',
    island: 'Gran Canaria',
    municipality: 'Las Palmas',
    basePricePerDay: 1950,
    status: 'ACTIVE',
    isFeatured: true,
    photos: [{ url: '/supercars/ferrari_sf90.jpg' }],
  },
  {
    id: 'demo-vehicle-003',
    slug: 'porsche-911-gt3-rs-weissach',
    title: 'Porsche 911 GT3 RS Weissach Package',
    island: 'Tenerife',
    municipality: 'Santa Cruz de Tenerife',
    basePricePerDay: 1450,
    status: 'ACTIVE',
    isFeatured: false,
    photos: [{ url: '/supercars/porsche_gt3rs.jpg' }],
  },
];

const DEMO_OWNER_BOOKINGS = [
  {
    id: 'demo-booking-owner-001',
    code: 'GT-SF90-4491',
    status: 'REQUESTED',
    pickupDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    returnDate: new Date(Date.now() + 86400000 * 6).toISOString(),
    totalDays: 3,
    totalAmount: 5850,
    ownerPayout: 4972,
    vehicle: { title: 'Ferrari SF90 Stradale Assetto Fiorano' },
    traveler: { firstName: 'Marc', lastName: 'Gené', email: 'marc.piloto@vip.com' },
    conversations: [{ id: 'demo-conv-owner-1' }],
  },
  {
    id: 'demo-booking-owner-002',
    code: 'GT-REV-9012',
    status: 'CONFIRMED',
    pickupDate: new Date(Date.now() + 86400000 * 8).toISOString(),
    returnDate: new Date(Date.now() + 86400000 * 11).toISOString(),
    totalDays: 3,
    totalAmount: 6600,
    ownerPayout: 5610,
    vehicle: { title: 'Lamborghini Revuelto V12 Híbrido HPEV' },
    traveler: { firstName: 'Fernando', lastName: 'A.', email: 'fernando.vip@vault.com' },
    conversations: [{ id: 'demo-conv-owner-2' }],
  },
];

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stripeMessage, setStripeMessage] = useState('');
  const [stripeSetupUrl, setStripeSetupUrl] = useState('');
  const [showBankSetup, setShowBankSetup] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const [payoutReady, setPayoutReady] = useState<boolean | null>(true);

  useEffect(() => {
    fetch('/api/owner/bank-account', { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setPayoutReady(data ? Boolean(data.iban && data.bankHolder) : true))
      .catch(() => setPayoutReady(true));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('anuncio=creado')) {
      setMsg('¡Tu superdeportivo ha sido registrado en el Vault con éxito! Ya aparece en tu lista de anuncios.');
    }
  }, []);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'No se pudo comprobar la sesión');
        return data;
      })
      .then(async (data) => {
        if (!data.user) {
          window.location.href = '/';
          return;
        }

        if (data.user.role === 'TRAVELER') {
          window.location.href = '/cuenta';
          return;
        }

        setAuthorized(true);

        const isDemo = data.user.id?.includes('demo') || data.user.email?.includes('propietario');

        fetch('/api/vehicles?owner=me', { cache: 'no-store' })
          .then((res) => res.json())
          .then((vData) => {
            if (vData?.vehicles && vData.vehicles.length > 0) {
              setVehicles(vData.vehicles);
            } else if (isDemo) {
              setVehicles(DEMO_OWNER_VEHICLES);
            }
          })
          .catch((err) => {
            console.error('Error cargando superdeportivos:', err);
            if (isDemo) setVehicles(DEMO_OWNER_VEHICLES);
          });

        fetch('/api/bookings', { cache: 'no-store' })
          .then((res) => res.json())
          .then((bData) => {
            if (bData?.bookings && bData.bookings.length > 0) {
              setBookings(bData.bookings);
            } else if (isDemo) {
              setBookings(DEMO_OWNER_BOOKINGS);
            }
          })
          .catch((err) => {
            console.error('Error cargando reservas:', err);
            if (isDemo) setBookings(DEMO_OWNER_BOOKINGS);
          })
          .finally(() => setLoading(false));
      })
      .catch((error: Error) => {
        console.error('Propietario load error:', error);
        setAuthorized(true);
        setVehicles(DEMO_OWNER_VEHICLES);
        setBookings(DEMO_OWNER_BOOKINGS);
        setLoading(false);
      });
  }, [router]);

  if (serviceError) {
    return (
      <div className="min-h-screen bg-[#070707] text-white">
        <Navbar />
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-3xl font-bold font-mono text-white">No podemos sincronizar con el Vault ahora mismo</h1>
          <p className="mt-3 text-sm text-white/60">{serviceError}</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-[#D4AF37] px-6 py-3 text-xs font-mono font-black text-black">
            Reintentar Conexión
          </button>
        </main>
      </div>
    );
  }

  if (authorized !== true) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070707] px-6 text-center text-white font-mono">
        <div>
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#D4AF37]" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">Cargando Bóveda de Propietario...</p>
        </div>
      </div>
    );
  }

  const handleActivateFeatured = async (vehicleId: string) => {
    setFeaturedLoading(vehicleId);
    setMsg('');

    try {
      const res = await fetch('/api/featured/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al activar Destacado');

      if (data.url) {
        window.open(data.url, '_self');
      } else {
        setMsg('¡Listo! Tu superdeportivo ha sido posicionado en la cabecera principal del Vault.');
        setVehicles(vehicles.map((v) => (v.id === vehicleId ? { ...v, isFeatured: true } : v)));
      }
    } catch (err: any) {
      setMsg(err.message || 'No se pudo activar Destacado');
    } finally {
      setFeaturedLoading(null);
    }
  };

  const handleStripeConnect = async () => {
    setStripeMessage('');
    setStripeSetupUrl('');
    setShowBankSetup(true);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black font-sans">
      <Navbar />
      {showBankSetup && <StripeConnectOnboarding onClose={() => setShowBankSetup(false)} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* CABECERA PANEL DE PROPIETARIO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8 border-b border-white/10 font-mono gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                PANEL DE PROPIETARIO // CONTROL DE FLOTA VIP
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-sans">
              Garaje Privado & Rendimiento
            </h1>
            <p className="mt-2 text-sm text-white/60 font-sans max-w-2xl">
              Supervisión de entregas, ingresos en custodia bancaria, contratos y disponibilidad de tus vehículos.
            </p>
          </div>

          <Link
            href="/publicar-camper"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black px-6 py-3.5 rounded-xl font-mono font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Publicar Superdeportivo</span>
          </Link>
        </div>

        {/* MÉTRICAS DE FLOTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-mono">
          <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Supercars Registrados</span>
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-[#D4AF37]" />
              <strong className="text-2xl text-white font-black">{vehicles.length}</strong>
              <span className="text-xs text-white/50">en garaje</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Solicitudes Entrantes</span>
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <strong className="text-2xl text-amber-400 font-black">
                {bookings.filter((b) => b.status === 'REQUESTED').length}
              </strong>
              <span className="text-xs text-white/50">pendientes</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Reservas Confirmadas</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <strong className="text-2xl text-emerald-400 font-black">
                {bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'ACTIVE').length}
              </strong>
              <span className="text-xs text-white/50">activas</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Valoración Garaje</span>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              <strong className="text-2xl text-[#D4AF37] font-black flex items-center gap-1">
                5.0
                <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              </strong>
              <span className="text-xs text-white/50">Propietario VIP</span>
            </div>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS */}
        <nav className="mb-8 grid gap-4 sm:grid-cols-2 font-mono">
          <Link
            href="/propietario/estadisticas"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0f0f12] p-5 hover:border-[#D4AF37]/50 transition-all group"
          >
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-[#D4AF37]/40">
              <BarChart3 className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-sm text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                Telemetría & Estadísticas
              </strong>
              <span className="text-xs text-white/50 font-sans">Visualizaciones del Vault, clics de piloto y conversión</span>
            </div>
          </Link>
          <Link
            href="/propietario/finanzas"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0f0f12] p-5 hover:border-[#D4AF37]/50 transition-all group"
          >
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-[#D4AF37]/40">
              <WalletCards className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-sm text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                Finanzas & Transferencias
              </strong>
              <span className="text-xs text-white/50 font-sans">Liquidaciones bancarias directas, fianzas retenidas y cobros netos</span>
            </div>
          </Link>
        </nav>

        {msg && (
          <div className="mb-8 p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold flex items-center space-x-3">
            <BadgeCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* CONFIGURACIÓN BANCARIA STRIPE CONNECT */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0f0f12] p-5 font-mono">
          <div>
            <strong className="block text-sm text-white uppercase tracking-wider">
              Cobros Seguros Directos a tu Cuenta Bancaria
            </strong>
            <span className="text-xs text-white/50 font-sans">
              Liquidaciones automáticas de cada jornada tras la entrega del superdeportivo.
            </span>
          </div>
          <button
            onClick={handleStripeConnect}
            className="rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white hover:border-[#D4AF37]/40 transition-all cursor-pointer"
          >
            Configurar IBAN de Cobro
          </button>
        </div>

        {/* NOTIFICACIONES Y RESERVAS */}
        <div className="mb-4 flex justify-end">
          <OwnerBrowserNotifications />
        </div>

        <div className="space-y-8">
          <OwnerBookingsPanel initialBookings={bookings} />

          <UserContractsPanel bookings={bookings} viewerRole="OWNER" />

          <OwnerAvailabilityCalendar vehicles={vehicles} />
        </div>

        {/* LISTADO DE SUPERDEPORTIVOS EN GARAJE */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block">Flota Privada</span>
              <h3 className="text-2xl font-black uppercase text-white font-sans">Mis Superdeportivos Publicados</h3>
            </div>
            {vehicles.length > 0 && (
              <Link
                href="/publicar-camper"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D4AF37] hover:underline"
              >
                <Plus className="w-4 h-4" />
                <span>+ Añadir otro vehículo</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-[#0f0f12] rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/40 transition-all"
              >
                {v.isFeatured && (
                  <div className="absolute top-4 right-4 z-10 bg-[#D4AF37] text-black text-[9px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>DESTACADO VIP</span>
                  </div>
                )}

                <div>
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-black">
                    <img
                      src={v.photos?.[0]?.url || '/supercars/lambo_revuelto.jpg'}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-transparent to-transparent opacity-60" />
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2 font-mono">
                    <span className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-wider">
                      {v.island} • {v.municipality || 'Canarias'}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        v.status === 'PENDING_REVIEW'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {v.status === 'PENDING_REVIEW' ? 'En Validación' : 'Bóveda Activa'}
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-white mb-2 line-clamp-1 font-sans">{v.title}</h4>
                  <p className="text-sm font-mono font-bold text-[#D4AF37] mb-4">
                    {v.basePricePerDay} € <span className="text-xs text-white/50 font-normal">/ jornada</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2.5 font-mono">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/propietario/editar/${v.id}`}
                      className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Pencil className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Editar</span>
                    </Link>

                    <Link
                      href={`/camper/${v.slug || v.id}`}
                      target="_blank"
                      className="w-full py-2.5 rounded-xl border border-white/10 bg-black hover:bg-white/[0.04] text-white/80 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
                    >
                      <span>Ver en Vault</span>
                    </Link>
                  </div>

                  {!v.isFeatured ? (
                    <button
                      onClick={() => handleActivateFeatured(v.id)}
                      disabled={featuredLoading === v.id}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{featuredLoading === v.id ? 'Activando...' : 'DESTACAR EN BÓVEDA'}</span>
                    </button>
                  ) : (
                    <div className="py-2.5 px-4 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-center text-xs font-bold flex items-center justify-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Posicionamiento VIP Activo</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
