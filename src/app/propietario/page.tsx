'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { BadgeCheck, Sparkles, Plus, BarChart3, WalletCards } from 'lucide-react';
import OwnerAvailabilityCalendar from '@/components/OwnerAvailabilityCalendar';
import OwnerBookingsPanel from '@/components/OwnerBookingsPanel';
import UserContractsPanel from '@/components/UserContractsPanel';
import { useRouter } from 'next/navigation';
import StripeConnectOnboarding from '@/components/StripeConnectOnboarding';

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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('anuncio=creado')) {
      setMsg('🎉 ¡Tu furgoneta camper ha sido enviada a revisión con éxito! Ya aparece en tu lista de anuncios abajo en estado "Pendiente de revisión".');
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

        setAuthorized(true);

        fetch('/api/vehicles?owner=me', { cache: 'no-store' })
          .then((res) => res.json())
          .then((vData) => {
            if (vData?.vehicles) setVehicles(vData.vehicles);
          })
          .catch((err) => console.error('Error cargando furgonetas:', err));

        fetch('/api/bookings', { cache: 'no-store' })
          .then((res) => res.json())
          .then((bData) => {
            if (bData?.bookings) setBookings(bData.bookings);
          })
          .catch((err) => console.error('Error cargando reservas:', err))
          .finally(() => setLoading(false));
      })
      .catch((error: Error) => {
        console.error('Propietario load error:', error);
        setAuthorized(true);
        setLoading(false);
      });
  }, [router]);

  if (serviceError) return <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar /><main className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="font-serif text-3xl font-bold">No podemos cargar el panel ahora mismo</h1><p className="mt-3 text-sm text-[#6B726E]">{serviceError}</p><button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-full bg-[#13322E] px-5 py-3 text-xs font-bold text-white">Reintentar</button></main></div>;
  if (authorized !== true) {
    return <div className="min-h-screen bg-[#F7F6F2]" />;
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
      if (!res.ok) throw new Error(data.error || 'Error al activar Usuario destacado');

      if (data.url) {
        window.open(data.url, '_self');
      } else {
        setMsg('✨ ¡Listo! Tu suscripción de Usuario destacado está activa por 2,99€/mes.');
        // Actualizar estado local
        setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, isFeatured: true } : v));
      }
    } catch (err: any) {
      setMsg(err.message || 'No se pudo activar Usuario destacado');
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
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      {showBankSetup && <StripeConnectOnboarding onClose={() => setShowBankSetup(false)} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-[#E9E1D2]">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#D97706]">
              PANEL DE PROPIETARIOS
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
              Gestión de Flota & Usuario destacado
            </h1>
          </div>

          <Link
            href="/publicar-camper"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-[#16B8AA] text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Nueva Camper</span>
          </Link>
        </div>

        <nav className="mb-8 grid gap-3 sm:grid-cols-2">
          <Link href="/propietario/estadisticas" className="flex items-center gap-4 rounded-2xl border border-[#E9E1D2] bg-white p-5"><BarChart3 className="h-7 w-7 text-[#16B8AA]" /><div><strong className="block">Estadísticas</strong><span className="text-xs text-[#6B726E]">Visualizaciones, interés, conversión y procedencia</span></div></Link>
          <Link href="/propietario/finanzas" className="flex items-center gap-4 rounded-2xl border border-[#E9E1D2] bg-white p-5"><WalletCards className="h-7 w-7 text-[#16B8AA]" /><div><strong className="block">Finanzas</strong><span className="text-xs text-[#6B726E]">Cobros, comisiones, neto y pendientes</span></div></Link>
        </nav>

        {msg && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center space-x-3">
            <BadgeCheck className="w-5 h-5 text-[#D97706] shrink-0" />
            <span>{msg}</span>
          </div>
        )}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E9E1D2] bg-white p-5">
          <div><strong className="block text-sm">Recibe tus reservas directamente en tu banco</strong><span className="text-xs text-[#6B726E]">Introduce tu IBAN en el proceso seguro de Stripe. No necesitas abrir ni gestionar una cuenta Stripe aparte.</span></div>
          <button onClick={handleStripeConnect} className="rounded-full bg-[#13322E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Configurar cuenta bancaria</button>
          {stripeMessage && <div className="w-full rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-800"><p>{stripeMessage}</p>{stripeSetupUrl && <a href={stripeSetupUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full bg-[#13322E] px-4 py-2 text-white">Completar configuración de cobros</a>}</div>}
        </div>

        {/* TARJETA INFORMATIVA DE USUARIO DESTACADO */}
        <div className="bg-gradient-to-r from-[#13322E] to-[#254842] rounded-3xl p-8 text-white mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center space-x-2 bg-[#D97706] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>USUARIO DESTACADO</span>
            </div>
            <h2 className="font-serif text-3xl font-bold mb-3">
              Más visibilidad para tu camper desde <span className="text-[#F2CC8F]">2,99€ / mes</span>
            </h2>
            <p className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed mb-6">
              Consigue la insignia por mérito al alcanzar <strong>20 reseñas de 5 estrellas</strong> o actívala mediante una suscripción mensual. La condición de Usuario destacado mejora la visibilidad de tus anuncios.
            </p>
          </div>
        </div>

        {/* LISTADO DE MIS CAMPERS Y CONTRATOS */}
        <OwnerBookingsPanel initialBookings={bookings} />

        <UserContractsPanel bookings={bookings} viewerRole="OWNER" />

        <OwnerAvailabilityCalendar vehicles={vehicles} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#13322E]">Mis Anuncios Publicados</h3>
            {vehicles.length > 0 && (
              <Link
                href="/publicar-camper"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#16B8AA] hover:underline"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir otra camper</span>
              </Link>
            )}
          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-3xl border border-[#E9E1D2] bg-white p-8 sm:p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF7F0] text-[#16B8AA] mb-4">
                <Plus className="h-7 w-7" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#13322E]">No has publicado anuncios aún</h4>
              <p className="mt-2 text-sm text-[#6B726E] max-w-md mx-auto font-medium">
                Comienza a alquilar tu furgoneta camper o autocaravana en Canarias y rentabilízala de forma totalmente segura.
              </p>
              <Link
                href="/publicar-camper"
                className="mt-6 inline-flex items-center space-x-2 rounded-full bg-[#16B8AA] px-7 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#0F766E] transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar mi primer anuncio</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <div key={v.id} className="bg-white rounded-3xl p-6 border border-[#E9E1D2] shadow-sm flex flex-col justify-between relative overflow-hidden">
                  {v.isFeatured && (
                    <div className="absolute top-4 right-4 bg-[#D97706] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                      <BadgeCheck className="w-3 h-3" />
                      <span>USUARIO DESTACADO</span>
                    </div>
                  )}

                  <div>
                    <img
                      src={v.photos?.[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800'}
                      alt={v.title}
                      className="w-full h-44 object-cover rounded-2xl mb-4"
                    />
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase text-[#16B8AA] tracking-wider">
                        {v.island} • {v.municipality}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          v.status === 'PENDING_REVIEW'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {v.status === 'PENDING_REVIEW' ? '⏳ Pendiente de revisión' : '✅ Activo'}
                      </span>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-[#13322E] mb-2 line-clamp-1">{v.title}</h4>
                    <p className="text-xs text-[#6B726E] font-medium mb-4">{v.basePricePerDay}€ / día</p>
                  </div>

                  <div className="pt-4 border-t border-[#E9E1D2] space-y-3">
                    <Link
                      href={`/camper/${v.slug || v.id}`}
                      target="_blank"
                      className="w-full py-2.5 rounded-full border border-[#E9E1D2] bg-[#FAF7F0] hover:bg-[#13322E] hover:text-white text-[#13322E] font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <span>Ver Ficha del Anuncio</span>
                    </Link>
                    {!v.isFeatured ? (
                      <button
                        onClick={() => handleActivateFeatured(v.id)}
                        disabled={featuredLoading === v.id}
                        className="w-full py-3 rounded-full bg-[#D97706] text-white font-black text-xs uppercase tracking-widest hover:bg-[#B45309] transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
                      >
                        <BadgeCheck className="w-4 h-4" />
                        <span>{featuredLoading === v.id ? 'Activando...' : 'ACTIVAR USUARIO DESTACADO (2,99€/MES)'}</span>
                      </button>
                    ) : (
                      <div className="py-2.5 px-4 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-center text-xs font-bold flex items-center justify-center space-x-2">
                        <Sparkles className="w-4 h-4 text-[#D97706]" />
                        <span>Usuario destacado activo</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
