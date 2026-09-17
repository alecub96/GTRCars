import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SupercarGrid from '@/components/SupercarGrid';
import { SlidersHorizontal, Search, ShieldCheck, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buscador de Superdeportivos e Hypercars | GTR Cars',
  description: 'Explora y reserva superdeportivos en Madrid, Barcelona, Gran Canaria, Tenerife y Londres: Lamborghini, Ferrari, Porsche, McLaren y más.',
};

export default async function BuscarPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white flex flex-col">
      <Navbar />

      {/* HEADER BUSCADOR PORSCHE STYLE */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-600 font-bold">
              EXPLORADOR GLOBAL // DISPONIBILIDAD INMEDIATA
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black font-sans">
            Buscador de Superdeportivos
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-mono max-w-2xl leading-relaxed">
            Filtra por fabricante, potencia, aceleración y base VIP (Madrid, Barcelona, Gran Canaria, Tenerife, Londres). Reserva con entrega VIP directa y fianza protegida.
          </p>

          {/* QUICK BRAND FILTERS */}
          <div className="flex flex-wrap gap-2 pt-4 font-mono">
            {['TODAS LAS MARCAS', 'LAMBORGHINI', 'FERRARI', 'PORSCHE', 'MCLAREN', 'ASTON MARTIN', 'MERCEDES-AMG'].map((brand, idx) => (
              <button
                key={brand}
                className={`px-4 py-2 text-xs tracking-wider uppercase rounded-xl border transition-all cursor-pointer font-bold ${
                  idx === 0
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black shadow-sm'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ASIDE FILTERS */}
          <aside className="bg-gray-50 rounded-3xl p-6 border border-gray-200 h-fit space-y-6 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <span className="text-black font-bold uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-black" /> FILTROS AVANZADOS
              </span>
            </div>

            {/* LOCATION */}
            <div className="space-y-2">
              <label className="text-gray-500 uppercase tracking-widest block text-[10px] font-bold">CIUDAD / BASE VIP</label>
              <select className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer">
                <option>Todas las Bases VIP</option>
                <option>Madrid (MAD / La Moraleja)</option>
                <option>Barcelona (BCN / Pedralbes)</option>
                <option>Gran Canaria (LPA / Maspalomas)</option>
                <option>Tenerife (TFS / Costa Adeje)</option>
                <option>Londres (LHR / Mayfair / Chelsea)</option>
                <option>Marbella / Puerto Banús</option>
                <option>Mallorca / Ibiza</option>
              </select>
            </div>

            {/* POTENCIA */}
            <div className="space-y-2">
              <label className="text-gray-500 uppercase tracking-widest block text-[10px] font-bold">POTENCIA MÍNIMA</label>
              <select className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer">
                <option>Cualquier potencia</option>
                <option>+ 500 CV</option>
                <option>+ 700 CV (Supercars V8/V10)</option>
                <option>+ 800 CV (Hypercars Híbridos/V12)</option>
              </select>
            </div>

            {/* PRECIO RANGO */}
            <div className="space-y-2">
              <label className="text-gray-500 uppercase tracking-widest block text-[10px] font-bold">TARIFA JORNADA (€)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mín €"
                  className="p-3 bg-white border border-gray-300 rounded-xl text-black font-mono text-xs focus:border-black outline-none"
                />
                <input
                  type="number"
                  placeholder="Máx €"
                  className="p-3 bg-white border border-gray-300 rounded-xl text-black font-mono text-xs focus:border-black outline-none"
                />
              </div>
            </div>

            <button className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm">
              APLICAR FILTROS
            </button>
          </aside>

          {/* RESULTS GRID */}
          <div className="lg:col-span-3">
            <SupercarGrid />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
