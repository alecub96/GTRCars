'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Crown, Sparkles, Check, Truck, Calendar, Plus, ShieldCheck } from 'lucide-react';
import OwnerAvailabilityCalendar from '@/components/OwnerAvailabilityCalendar';

export default function OwnerDashboardPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vipLoading, setVipLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stripeMessage, setStripeMessage] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        const isOwner = data.user?.role === 'OWNER';
        setAuthorized(isOwner);
        if (!isOwner) window.location.href = data.user ? '/cuenta' : '/';
      })
      .catch(() => { setAuthorized(false); window.location.href = '/'; });

    if (authorized === false) return;
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data.vehicles || []);
        setLoading(false);
      });
    fetch('/api/bookings').then((res) => res.json()).then((data) => setBookings(data.bookings || []));
  }, [authorized]);

  if (authorized !== true) {
    return <div className="min-h-screen bg-[#F7F6F2]" />;
  }

  const handleActivateVip = async (vehicleId: string) => {
    setVipLoading(vehicleId);
    setMsg('');

    try {
      const res = await fetch('/api/vip/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al activar VIP');

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMsg('👑 ¡Felicidades! Membresía VIP activada (2,99€/mes). Tu camper ahora ocupa las primeras 5 posiciones rotativas en tu isla.');
        // Actualizar estado local
        setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, isVip: true } : v));
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setVipLoading(null);
    }
  };

  const handleStripeConnect = async () => {
    setStripeMessage('');
    const response = await fetch('/api/stripe/connect', { method: 'POST' });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
    else setStripeMessage(data.error || 'No se pudo iniciar la configuración de cobros');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-[#E9E1D2]">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#D97706]">
              PANEL DE PROPIETARIOS
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
              Gestión de Flota & Visibilidad VIP
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

        {msg && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center space-x-3">
            <Crown className="w-5 h-5 text-[#D97706] shrink-0" />
            <span>{msg}</span>
          </div>
        )}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E9E1D2] bg-white p-5">
          <div><strong className="block text-sm">Cobra tus reservas de forma segura</strong><span className="text-xs text-[#6B726E]">Configura tu cuenta Stripe Connect para recibir liquidaciones.</span></div>
          <button onClick={handleStripeConnect} className="rounded-full bg-[#13322E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Configurar cobros</button>
          {stripeMessage && <p className="w-full text-xs font-bold text-amber-700">{stripeMessage}</p>}
        </div>

        {/* TARJETA INFORMATIVA PLAN VIP DE 2,99€/MES */}
        <div className="bg-gradient-to-r from-[#13322E] to-[#254842] rounded-3xl p-8 text-white mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center space-x-2 bg-[#D97706] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              <Crown className="w-3.5 h-3.5" />
              <span>MEMBRESÍA PROPIETARIO VIP</span>
            </div>
            <h2 className="font-serif text-3xl font-bold mb-3">
              Multiplica x5 tus reservas por solo <span className="text-[#F2CC8F]">2,99€ / mes</span>
            </h2>
            <p className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed mb-6">
              Los vehículos con suscripción VIP activa se mantienen fijados de forma permanente en las <strong>5 primeras posiciones</strong> de tu isla. Los anuncios VIP rotan equitativamente día a día para garantizar la máxima visibilidad a todos los propietarios suscriptores.
            </p>
          </div>
        </div>

        {/* LISTADO DE MIS CAMPERS */}
        <section className="mb-12 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#13322E]">Solicitudes de reserva</h3>
          {bookings.length === 0 ? <p className="text-sm text-[#6B726E]">No tienes solicitudes pendientes.</p> : bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl p-4 border border-[#E9E1D2] flex flex-wrap items-center justify-between gap-3">
              <div><strong>{booking.code}</strong><p className="text-xs text-[#6B726E]">{booking.vehicle.title} · {booking.traveler.firstName} · {booking.status}</p></div>
              {booking.status === 'REQUESTED' && <div className="flex gap-2"><button onClick={async () => { await fetch(`/api/bookings/${booking.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'accept' }) }); setBookings(bookings.map((b) => b.id === booking.id ? { ...b, status: 'OWNER_ACCEPTED' } : b)); }} className="px-4 py-2 rounded-full bg-[#16B8AA] text-white text-xs font-bold">Aceptar</button><button onClick={async () => { await fetch(`/api/bookings/${booking.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject' }) }); setBookings(bookings.map((b) => b.id === booking.id ? { ...b, status: 'OWNER_REJECTED' } : b)); }} className="px-4 py-2 rounded-full bg-red-50 text-red-700 text-xs font-bold">Rechazar</button></div>}
            </div>
          ))}
        </section>

        <OwnerAvailabilityCalendar vehicles={vehicles} />

        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#13322E]">Mis Anuncios Publicados</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-white rounded-3xl p-6 border border-[#E9E1D2] shadow-sm flex flex-col justify-between relative overflow-hidden">
                {v.isVip && (
                  <div className="absolute top-4 right-4 bg-[#D97706] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                    <Crown className="w-3 h-3" />
                    <span>DESTACADO VIP TOP 5</span>
                  </div>
                )}

                <div>
                  <img
                    src={v.photos[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800'}
                    alt={v.title}
                    className="w-full h-44 object-cover rounded-2xl mb-4"
                  />
                  <span className="text-[10px] font-black uppercase text-[#16B8AA] tracking-wider block mb-1">
                    {v.island} • {v.municipality}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#13322E] mb-2 line-clamp-1">{v.title}</h4>
                  <p className="text-xs text-[#6B726E] font-medium mb-4">{v.basePricePerDay}€ / día</p>
                </div>

                <div className="pt-4 border-t border-[#E9E1D2] space-y-3">
                  {!v.isVip ? (
                    <button
                      onClick={() => handleActivateVip(v.id)}
                      disabled={vipLoading === v.id}
                      className="w-full py-3 rounded-full bg-[#D97706] text-white font-black text-xs uppercase tracking-widest hover:bg-[#B45309] transition-all flex items-center justify-center space-x-2 shadow-md"
                    >
                      <Crown className="w-4 h-4" />
                      <span>{vipLoading === v.id ? 'Activando...' : 'ACTIVAR VIP (2,99€/MES)'}</span>
                    </button>
                  ) : (
                    <div className="py-2.5 px-4 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-center text-xs font-bold flex items-center justify-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#D97706]" />
                      <span>Suscripción VIP Activa</span>
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
