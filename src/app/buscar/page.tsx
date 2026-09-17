import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SupercarGrid from '@/components/SupercarGrid';
import { SlidersHorizontal, Search, ShieldCheck, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buscador de Superdeportivos e Hypercars en Canarias | GTR Cars',
  description: 'Explora y reserva superdeportivos en Gran Canaria y Tenerife: Lamborghini, Ferrari, Porsche, McLaren y más.',
};

export default async function BuscarPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] font-sans antialiased selection:bg-[#D4AF37] selection:text-black flex flex-col">
      <Navbar />

      {/* HEADER BUSCADOR DARK LUXURY */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#090909]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
              VAULT EXPLORER // DISPONIBILIDAD INMEDIATA CANARIAS
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white">
            Buscador de Superdeportivos
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-2xl leading-relaxed">
            Filtra por fabricante, potencia, aceleración e isla (Gran Canaria / Tenerife). Reserva con entrega VIP directa y fianza protegida.
          </p>

          {/* QUICK BRAND FILTERS */}
          <div className="flex flex-wrap gap-2 pt-4 font-mono">
            {['TODAS LAS MARCAS', 'LAMBORGHINI', 'FERRARI', 'PORSCHE', 'MCLAREN', 'ASTON MARTIN', 'MERCEDES-AMG'].map((brand, idx) => (
              <button
                key={brand}
                className={`px-4 py-2 text-xs tracking-wider uppercase rounded-xl border transition-all cursor-pointer ${
                  idx === 0
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black font-bold border-[#D4AF37]'
                    : 'bg-[#121212] text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
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
          <aside className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/10 h-fit space-y-6 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" /> FILTROS AVANZADOS
              </span>
            </div>

            {/* LOCATION */}
            <div className="space-y-2">
              <label className="text-neutral-400 uppercase tracking-widest block text-[10px]">ISLA / BASE VIP</label>
              <select className="w-full p-3 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono focus:border-[#D4AF37] outline-none cursor-pointer">
                <option>Todas las Islas</option>
                <option>Gran Canaria (LPA / Maspalomas)</option>
                <option>Tenerife (TFS / Costa Adeje)</option>
                <option>Lanzarote / Fuerteventura</option>
              </select>
            </div>

            {/* POTENCIA */}
            <div className="space-y-2">
              <label className="text-neutral-400 uppercase tracking-widest block text-[10px]">POTENCIA MÍNIMA</label>
              <select className="w-full p-3 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono focus:border-[#D4AF37] outline-none cursor-pointer">
                <option>Cualquier potencia</option>
                <option>+ 500 CV</option>
                <option>+ 700 CV (Supercars V8/V10)</option>
                <option>+ 800 CV (Hypercars Híbridos/V12)</option>
              </select>
            </div>

            {/* PRECIO RANGO */}
            <div className="space-y-2">
              <label className="text-neutral-400 uppercase tracking-widest block text-[10px]">TARIFA JORNADA (€)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mín €"
                  className="p-3 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-[#D4AF37] outline-none"
                />
                <input
                  type="number"
                  placeholder="Máx €"
                  className="p-3 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>

            <button className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B38B21] hover:brightness-110 text-black font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg">
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
