'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Eye, MousePointerClick, Inbox, CheckCircle2, TrendingUp, Globe2, Truck, ArrowRight, ShieldCheck, BarChart3, RefreshCw } from 'lucide-react';

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
          if (res.status === 403) throw new Error('Debes estar en Modo Propietario para ver las estadísticas de tus campers.');
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
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* CABECERA PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#16B8AA]">
              Rendimiento Real de tu Flota
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#13322E] mt-1">
              Estadísticas de tus anuncios
            </h1>
            <p className="mt-2 text-sm text-[#6B726E] font-medium">
              Métricas transparentes en tiempo real. Las visitas propias y de administradores quedan excluidas.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/propietario/finanzas"
              className="inline-flex items-center space-x-2 bg-white border border-[#E9E1D2] hover:border-[#16B8AA] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#13322E] shadow-sm transition-all"
            >
              <span>Ver Finanzas</span>
              <ArrowRight className="w-4 h-4 text-[#16B8AA]" />
            </Link>
            <Link
              href="/publicar-camper"
              className="inline-flex items-center space-x-2 bg-[#16B8AA] hover:bg-[#0F766E] text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Publicar Nueva Camper</span>
            </Link>
          </div>
        </div>

        {/* ALERTA DE ERROR/MODO */}
        {errorMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <Link href="/propietario" className="underline font-black uppercase text-[10px] text-amber-900 hover:text-black">
              Ir al Panel General
            </Link>
          </div>
        )}

        {/* 1. TARJETAS KPI RESUMEN */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B726E] mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider">Apariciones</span>
              <Eye className="w-4 h-4 text-[#16B8AA]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#13322E]">
                {loading ? '...' : stats.impressions}
              </strong>
              <span className="block text-[11px] text-[#6B726E] font-medium mt-1">Veces en búsquedas</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B726E] mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider">Visitas Ficha</span>
              <MousePointerClick className="w-4 h-4 text-[#16B8AA]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#13322E]">
                {loading ? '...' : stats.views}
              </strong>
              <span className="block text-[11px] text-[#6B726E] font-medium mt-1">Clics en tu camper</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B726E] mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider">Solicitudes</span>
              <Inbox className="w-4 h-4 text-[#16B8AA]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#13322E]">
                {loading ? '...' : stats.requests}
              </strong>
              <span className="block text-[11px] text-[#6B726E] font-medium mt-1">Peteticiones recibidas</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B726E] mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider">Confirmadas</span>
              <CheckCircle2 className="w-4 h-4 text-[#16B8AA]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#13322E]">
                {loading ? '...' : stats.confirmed}
              </strong>
              <span className="block text-[11px] text-[#6B726E] font-medium mt-1">Reservas pagadas</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-[#6B726E] mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider">Conversión</span>
              <TrendingUp className="w-4 h-4 text-[#16B8AA]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#16B8AA]">
                {loading ? '...' : `${stats.conversion}%`}
              </strong>
              <span className="block text-[11px] text-[#6B726E] font-medium mt-1">Efectividad de visitas</span>
            </div>
          </div>
        </div>

        {/* 2. SECCIONES DETALLADAS POR VEHÍCULO Y PROCEDENCIA */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DESGLOSE POR CAMPER */}
          <div className="bg-white rounded-3xl border border-[#E9E1D2] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E1D2]">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-[#16B8AA]" />
                <h2 className="font-serif text-2xl font-bold text-[#13322E]">Rendimiento por Anuncio</h2>
              </div>
              <span className="text-xs font-bold text-[#6B726E]">
                {stats.perVehicle?.length || 0} {stats.perVehicle?.length === 1 ? 'camper' : 'campers'}
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-[#6B726E] font-medium">Cargando datos de flota...</div>
            ) : stats.perVehicle && stats.perVehicle.length > 0 ? (
              <div className="divide-y divide-[#E9E1D2]/60 mt-2">
                {stats.perVehicle.map((vehicle: any) => (
                  <div key={vehicle.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-[#13322E]">{vehicle.title}</h3>
                      <span className="text-xs font-bold text-[#16B8AA] bg-[#16B8AA]/10 px-2.5 py-1 rounded-full">
                        {vehicle.conversion}% conv.
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center pt-1">
                      <div className="bg-[#FAF7F0] p-2 rounded-xl border border-[#E9E1D2]">
                        <span className="block text-[9px] font-black uppercase text-[#6B726E]">Apariciones</span>
                        <strong className="text-sm text-[#13322E]">{vehicle.impressions}</strong>
                      </div>
                      <div className="bg-[#FAF7F0] p-2 rounded-xl border border-[#E9E1D2]">
                        <span className="block text-[9px] font-black uppercase text-[#6B726E]">Visitas</span>
                        <strong className="text-sm text-[#13322E]">{vehicle.views}</strong>
                      </div>
                      <div className="bg-[#FAF7F0] p-2 rounded-xl border border-[#E9E1D2]">
                        <span className="block text-[9px] font-black uppercase text-[#6B726E]">Solicitudes</span>
                        <strong className="text-sm text-[#13322E]">{vehicle.requests}</strong>
                      </div>
                      <div className="bg-[#FAF7F0] p-2 rounded-xl border border-[#E9E1D2]">
                        <span className="block text-[9px] font-black uppercase text-[#6B726E]">Confirmadas</span>
                        <strong className="text-sm text-[#13322E]">{vehicle.confirmed}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-[#6B726E]">
                <BarChart3 className="w-10 h-10 text-[#16B8AA] mx-auto mb-3 opacity-60" />
                <p className="font-bold text-[#13322E]">Todavía no tienes campers publicadas o registradas.</p>
                <p className="text-xs mt-1">Publica tu primera furgoneta para empezar a recibir visitas y solicitudes.</p>
                <Link
                  href="/publicar-camper"
                  className="mt-4 inline-block bg-[#16B8AA] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Publicar Camper
                </Link>
              </div>
            )}
          </div>

          {/* PROCEDENCIA DE LOS VIAJEROS */}
          <div className="bg-white rounded-3xl border border-[#E9E1D2] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E9E1D2]">
                <div className="flex items-center space-x-3">
                  <Globe2 className="w-5 h-5 text-[#16B8AA]" />
                  <h2 className="font-serif text-2xl font-bold text-[#13322E]">Procedencia de Visitantes</h2>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-sm text-[#6B726E] font-medium">Analizando geolocalización...</div>
              ) : stats.countries && stats.countries.length > 0 ? (
                <div className="divide-y divide-[#E9E1D2]/60 mt-2">
                  {stats.countries.map(([country, total]: [string, number]) => (
                    <div key={country} className="py-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#13322E]">{country}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-[#16B8AA] bg-[#16B8AA]/10 px-3 py-1 rounded-full">
                          {total} {total === 1 ? 'visita' : 'visitas'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-[#6B726E]">
                  <Globe2 className="w-10 h-10 text-[#16B8AA] mx-auto mb-3 opacity-60" />
                  <p className="font-bold text-[#13322E]">Aún no hay visitas externas registradas.</p>
                  <p className="text-xs mt-1">Comparte el enlace de tus anuncios en redes sociales o guías para atraer viajeros internacionales.</p>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2] text-xs text-[#6B726E] font-medium">
              <strong>Consejo de optimización:</strong> Mantén tu calendario actualizado y añade fotos de alta resolución para multiplicar tus visitas por 3.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
