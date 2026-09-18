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
                <SlidersHorizontal className="w-4 h-4 text-black" /> FILTROS DE BÚSQUEDA
              </span>
            </div>

            {/* 1. MARCA */}
            <div className="space-y-2">
              <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">MARCA</label>
              <select className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer">
                <option value="">Todas las Marcas</option>
                <option value="porsche">Porsche</option>
                <option value="ferrari">Ferrari</option>
                <option value="lamborghini">Lamborghini</option>
                <option value="mclaren">McLaren</option>
                <option value="aston-martin">Aston Martin</option>
                <option value="mercedes-amg">Mercedes-AMG</option>
                <option value="audi-sport">Audi Sport</option>
                <option value="bmw-m">BMW M</option>
                <option value="corvette">Chevrolet Corvette</option>
                <option value="ford-gt">Ford GT</option>
              </select>
            </div>

            {/* 2. PAÍS */}
            <div className="space-y-2">
              <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">PAÍS</label>
              <select className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer">
                <option value="">Todos los Países</option>
                <option value="es">España</option>
                <option value="uk">Reino Unido (UK)</option>
                <option value="ae">Emiratos Árabes (Dubái)</option>
                <option value="us">Estados Unidos (EE.UU.)</option>
                <option value="de">Alemania</option>
                <option value="fr">Francia</option>
                <option value="it">Italia</option>
              </select>
            </div>

            {/* 3. CIUDAD */}
            <div className="space-y-2">
              <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">CIUDAD / BASE VIP</label>
              <select className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer">
                <option value="">Todas las Ciudades</option>
                <option value="gran-canaria">Gran Canaria (LPA / Maspalomas)</option>
                <option value="tenerife">Tenerife (TFS / TFN / Costa Adeje)</option>
                <option value="madrid">Madrid (MAD / La Moraleja)</option>
                <option value="barcelona">Barcelona (BCN / Pedralbes)</option>
                <option value="marbella">Marbella / Puerto Banús</option>
                <option value="mallorca-ibiza">Baleares (Mallorca / Ibiza)</option>
                <option value="londres">Londres (Mayfair / Knightsbridge)</option>
                <option value="dubai">Dubái (Downtown / Marina)</option>
                <option value="miami">Miami (South Beach / Brickell)</option>
              </select>
            </div>

            {/* 4. POTENCIA */}
            <div className="space-y-2">
              <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">POTENCIA</label>
              <select className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer">
                <option value="">Cualquier Potencia</option>
                <option value="500">+ 500 CV</option>
                <option value="600">+ 600 CV</option>
                <option value="700">+ 700 CV (Supercars V8 / V10)</option>
                <option value="800">+ 800 CV (Hypercars)</option>
                <option value="1000">+ 1.000 CV (V12 / Híbridos de Alto Rendimiento)</option>
              </select>
            </div>

            {/* 5. CAJA DE CAMBIOS */}
            <div className="space-y-2">
              <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">CAJA DE CAMBIOS</label>
              <select className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer">
                <option value="">Cualquier Transmisión</option>
                <option value="AUTOMATIC">Automático</option>
                <option value="MANUAL">Manual</option>
              </select>
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
