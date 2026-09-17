'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Eye, MousePointerClick, Inbox, CheckCircle2, TrendingUp, Globe2, ArrowRight, ShieldCheck, BarChart3, Sparkles, Gauge } from 'lucide-react';

const DEFAULT_STATS = {
  impressions: 0,
  views: 0,
  requests: 0,
  confirmed: 0,
  conversion: 0,
  countries: [],
  perVehicle: [],
};

export default function OwnerStatsPage() {
  const [stats, setStats] = useState<any>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/owner/analytics')
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) throw new Error('Debes iniciar sesión como Propietario para ver la telemetría de tus superdeportivos.');
          throw new Error('No se pudieron obtener las estadísticas en este momento.');
        }
        return res.json();
      })
      .then((data) => {
        if (data?.stats) {
          setStats(data.stats);
        } else {
          setStats(DEFAULT_STATS);
        }
      })
      .catch((err) => {
        console.warn('Analytics fetch warning:', err);
        setErrorMsg(err.message);
        setStats(DEFAULT_STATS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* CABECERA PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#D4AF37]/30">
              <Sparkles className="w-3 h-3" />
              TELEMETRÍA &amp; RENDIMIENTO DEL VAULT
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-1">
              Estadísticas de tus Superdeportivos
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-mono">
              Métricas de visualizaciones, solicitudes VIP y ratio de conversión en tiempo real.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/propietario/finanzas"
              className="inline-flex items-center space-x-2 bg-[#0f0f12] border border-white/15 hover:border-[#D4AF37] px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white shadow-md transition-all"
            >
              <span>Ver Liquidaciones</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
            <Link
              href="/publicar-camper"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
            >
              <Gauge className="w-4 h-4" />
              <span>Homologar Nuevo Vehículo</span>
            </Link>
          </div>
        </div>

        {/* ALERTA DE ERROR/MODO */}
        {errorMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <Link href="/propietario" className="underline font-bold uppercase text-[10px] text-[#D4AF37]">
              Ir al Vault Propietario
            </Link>
          </div>
        )}

        {/* 1. TARJETAS KPI RESUMEN */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10 font-mono">
          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-[10px] uppercase tracking-wider">Apariciones</span>
              <Eye className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-white">
                {loading ? '...' : stats.impressions}
              </strong>
              <span className="block text-[11px] text-neutral-400 mt-1">Impresiones en el catálogo</span>
            </div>
          </div>

          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-[10px] uppercase tracking-wider">Visitas Cockpit</span>
              <MousePointerClick className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-white">
                {loading ? '...' : stats.views}
              </strong>
              <span className="block text-[11px] text-neutral-400 mt-1">Clics en ficha técnica</span>
            </div>
          </div>

          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-[10px] uppercase tracking-wider">Solicitudes VIP</span>
              <Inbox className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-white">
                {loading ? '...' : stats.requests}
              </strong>
              <span className="block text-[11px] text-neutral-400 mt-1">Peticiones de concierge</span>
            </div>
          </div>

          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-[10px] uppercase tracking-wider">Confirmadas</span>
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-white">
                {loading ? '...' : stats.confirmed}
              </strong>
              <span className="block text-[11px] text-neutral-400 mt-1">Reservas formalizadas</span>
            </div>
          </div>

          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between col-span-2 lg:col-span-1 bg-gradient-to-br from-neutral-900 to-black">
            <div className="flex items-center justify-between text-[#D4AF37] mb-3">
              <span className="text-[10px] uppercase tracking-wider font-bold">Conversión</span>
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#D4AF37]">
                {loading ? '...' : `${stats.conversion}%`}
              </strong>
              <span className="block text-[11px] text-neutral-400 mt-1">Efectividad de reserva</span>
            </div>
          </div>
        </div>

        {/* 2. SECCIONES DETALLADAS POR VEHÍCULO Y PROCEDENCIA */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono">
          {/* DESGLOSE POR SUPERDEPORTIVO */}
          <div className="bg-[#0f0f12] rounded-3xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <Gauge className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-2xl font-bold text-white">Rendimiento por Modelo</h2>
              </div>
              <span className="text-xs text-neutral-400">
                {stats.perVehicle?.length || 0} {stats.perVehicle?.length === 1 ? 'vehículo' : 'vehículos'}
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-neutral-400">Cargando telemetría de flota...</div>
            ) : stats.perVehicle && stats.perVehicle.length > 0 ? (
              <div className="divide-y divide-white/5 mt-2">
                {stats.perVehicle.map((vehicle: any) => (
                  <div key={vehicle.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-white">{vehicle.title}</h3>
                      <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                        {vehicle.conversion}% conv.
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center pt-1">
                      <div className="bg-black/60 p-2 rounded-xl border border-white/10">
                        <span className="block text-[9px] uppercase text-neutral-400">Apariciones</span>
                        <strong className="text-sm text-white">{vehicle.impressions}</strong>
                      </div>
                      <div className="bg-black/60 p-2 rounded-xl border border-white/10">
                        <span className="block text-[9px] uppercase text-neutral-400">Visitas</span>
                        <strong className="text-sm text-white">{vehicle.views}</strong>
                      </div>
                      <div className="bg-black/60 p-2 rounded-xl border border-white/10">
                        <span className="block text-[9px] uppercase text-neutral-400">Solicitudes</span>
                        <strong className="text-sm text-white">{vehicle.requests}</strong>
                      </div>
                      <div className="bg-black/60 p-2 rounded-xl border border-white/10">
                        <span className="block text-[9px] uppercase text-neutral-400">Confirmadas</span>
                        <strong className="text-sm text-white">{vehicle.confirmed}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-neutral-400 space-y-3">
                <BarChart3 className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-60" />
                <p className="font-bold text-white">Todavía no tienes superdeportivos homologados en el Vault.</p>
                <p className="text-xs text-neutral-400">Publica tu primer Ferrari, Porsche o Lamborghini para recibir solicitudes VIP.</p>
                <Link
                  href="/publicar-camper"
                  className="mt-4 inline-block bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110"
                >
                  Homologar Superdeportivo
                </Link>
              </div>
            )}
          </div>

          {/* PROCEDENCIA DE LOS VISITANTES */}
          <div className="bg-[#0f0f12] rounded-3xl border border-white/10 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <Globe2 className="w-5 h-5 text-[#D4AF37]" />
                  <h2 className="font-serif text-2xl font-bold text-white">Procedencia de Clientes VIP</h2>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-sm text-neutral-400">Analizando procedencia...</div>
              ) : stats.countries && stats.countries.length > 0 ? (
                <div className="divide-y divide-white/5 mt-2">
                  {stats.countries.map(([country, total]: [string, number]) => (
                    <div key={country} className="py-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{country}</span>
                      <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                        {total} {total === 1 ? 'visita' : 'visitas'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-neutral-400 space-y-2">
                  <Globe2 className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-60" />
                  <p className="font-bold text-white">Aún no hay visitas internacionales registradas.</p>
                  <p className="text-xs text-neutral-400">Tus vehículos se promocionan activamente en los principales hubs turísticos de Reino Unido, Alemania y España.</p>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-neutral-400">
              <strong className="text-[#D4AF37]">Optimización del Vault:</strong> Mantén actualizado el calendario y activa fotografías de alta resolución para maximizar tus reservas.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
