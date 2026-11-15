'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SupercarGrid, { type SupercarFilterState } from '@/components/SupercarGrid';
import BuscarFilters from '@/components/BuscarFilters';
import VehicleTypeSlider from '@/components/VehicleTypeSlider';

const QUICK_BRANDS = [
  'TODAS LAS MARCAS',
  'PORSCHE',
  'FERRARI',
  'LAMBORGHINI',
  'MCLAREN',
  'ASTON MARTIN',
  'MERCEDES-AMG',
  'AUDI',
  'BMW',
  'BENTLEY',
  'ROLLS-ROYCE',
];

export default function BuscarClient() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SupercarFilterState>(() => ({
    brand: searchParams?.get('brand') || '',
    countryCode: searchParams?.get('country') || '',
    city: searchParams?.get('city') || searchParams?.get('island') || '',
    bodyType: searchParams?.get('vehicleType') || searchParams?.get('bodyType') || '',
    power: searchParams?.get('power') || '',
    transmission: searchParams?.get('transmission') || '',
  }));

  useEffect(() => {
    if (!searchParams) return;
    setFilters((prev) => ({
      ...prev,
      brand: searchParams.get('brand') ?? prev.brand ?? '',
      countryCode: searchParams.get('country') ?? prev.countryCode ?? '',
      city: searchParams.get('city') || searchParams.get('island') || prev.city || '',
      bodyType: searchParams.get('vehicleType') || searchParams.get('bodyType') || prev.bodyType || '',
    }));
  }, [searchParams]);

  const handleSelectQuickBrand = (b: string) => {
    const nextBrand = b === 'TODAS LAS MARCAS' ? '' : b;
    setFilters((prev) => ({ ...prev, brand: nextBrand }));
  };

  const handleResetFilters = () => {
    setFilters({
      brand: '',
      countryCode: '',
      city: '',
      bodyType: '',
      power: '',
      transmission: '',
    });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white flex flex-col">
      <Navbar />

      {/* HEADER BUSCADOR PORSCHE STYLE */}
      <section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-gray-50">
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
            Filtra por carrocería, fabricante, potencia, aceleración y base VIP (Madrid, Marbella, Barcelona, Mallorca, Gran Canaria, Tenerife). Reserva con entrega directa y fianza protegida.
          </p>

          {/* SLIDER DE CARROCERÍA CON LOS ICONOS RECORTADOS */}
          <div className="pt-2">
            <VehicleTypeSlider
              selectedType={filters.bodyType || ''}
              onSelectType={(typeId) => setFilters((prev) => ({ ...prev, bodyType: typeId }))}
            />
          </div>

          {/* QUICK BRAND FILTERS */}
          <div className="flex flex-wrap gap-2 pt-2 font-mono">
            {QUICK_BRANDS.map((b) => {
              const isSelected =
                (b === 'TODAS LAS MARCAS' && !filters.brand) ||
                Boolean(filters.brand && filters.brand.toUpperCase() === b);

              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleSelectQuickBrand(b)}
                  className={`px-4 py-2 text-xs tracking-wider uppercase rounded-xl border transition-all cursor-pointer font-bold ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black shadow-xs'
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ASIDE FILTERS INTERACTIVO CON PAÍS Y CIUDAD */}
          <BuscarFilters
            filters={filters}
            onChangeFilters={(next) => setFilters(next)}
            onResetFilters={handleResetFilters}
          />

          {/* RESULTS GRID */}
          <div className="lg:col-span-3">
            <SupercarGrid
              filters={filters}
              strictFilter={true}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
