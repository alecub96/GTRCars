import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SupercarGrid from '@/components/SupercarGrid';
import BuscarFilters from '@/components/BuscarFilters';
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
          {/* ASIDE FILTERS INTERACTIVO CON PAÍS Y CIUDAD */}
          <BuscarFilters />

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
