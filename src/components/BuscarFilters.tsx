'use client';

import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { SUPERCAR_LOCATIONS, getCitiesByCountry } from '@/lib/supercar-locations';
import type { SupercarFilterState } from '@/components/SupercarGrid';

interface BuscarFiltersProps {
  filters?: SupercarFilterState;
  onChangeFilters?: (next: SupercarFilterState) => void;
  onResetFilters?: () => void;
}

export default function BuscarFilters({
  filters,
  onChangeFilters,
  onResetFilters,
}: BuscarFiltersProps = {}) {
  const [countryCode, setCountryCode] = useState<string>(filters?.countryCode || '');
  const [city, setCity] = useState<string>(filters?.city || '');
  const [bodyType, setBodyType] = useState<string>(filters?.bodyType || '');
  const [brand, setBrand] = useState<string>(filters?.brand || '');
  const [power, setPower] = useState<string>(filters?.power || '');
  const [transmission, setTransmission] = useState<string>(filters?.transmission || '');

  useEffect(() => {
    if (!filters) return;
    setCountryCode(filters.countryCode || '');
    setCity(filters.city || '');
    setBodyType(filters.bodyType || '');
    setBrand(filters.brand || '');
    setPower(filters.power || '');
    setTransmission(filters.transmission || '');
  }, [filters]);

  const availableCities = countryCode
    ? getCitiesByCountry(countryCode)
    : SUPERCAR_LOCATIONS.flatMap((c) => c.cities);

  const emitFilters = (next: Partial<SupercarFilterState>) => {
    const merged: SupercarFilterState = {
      countryCode,
      city,
      bodyType,
      brand,
      power,
      transmission,
      ...next,
    };
    onChangeFilters?.(merged);
  };

  const handleCountryChange = (newCountry: string) => {
    setCountryCode(newCountry);
    setCity('');
    emitFilters({ countryCode: newCountry, city: '' });
  };

  const hasActiveFilters = Boolean(countryCode || city || bodyType || brand || power || transmission);

  const handleReset = () => {
    setCountryCode('');
    setCity('');
    setBodyType('');
    setBrand('');
    setPower('');
    setTransmission('');
    onResetFilters?.();
  };

  return (
    <aside className="bg-gray-50 rounded-3xl p-6 border border-gray-200 h-fit space-y-6 font-mono text-xs shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <span className="text-black font-bold uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-black" /> FILTROS DE BÚSQUEDA
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[10px] font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* 1. CARROCERÍA */}
      <div className="space-y-2">
        <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">CARROCERÍA</label>
        <select
          value={bodyType}
          onChange={(e) => {
            setBodyType(e.target.value);
            emitFilters({ bodyType: e.target.value });
          }}
          className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer"
        >
          <option value="">Todas las Carrocerías</option>
          <option value="COUPE">Coupé</option>
          <option value="CABRIO">Descapotable / Spyder</option>
          <option value="SEDAN_DEPORTIVO">Sedán Deportivo</option>
          <option value="SUV_DEPORTIVO">Super SUV</option>
        </select>
      </div>

      {/* 2. PAÍS */}
      <div className="space-y-2">
        <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">PAÍS</label>
        <select
          value={countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer"
        >
          <option value="">Todos los Países</option>
          {SUPERCAR_LOCATIONS.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3. CIUDAD (VINCULADA AL PAÍS) */}
      <div className="space-y-2">
        <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">CIUDAD / BASE VIP</label>
        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            emitFilters({ city: e.target.value });
          }}
          className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer"
        >
          <option value="">
            {countryCode ? 'Todas las Ciudades del país' : 'Todas las Ciudades globales'}
          </option>
          {availableCities.map((ct) => (
            <option key={ct.id} value={ct.name}>
              {ct.name} {ct.popular ? '★' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* 4. MARCA */}
      <div className="space-y-2">
        <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">MARCA</label>
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            emitFilters({ brand: e.target.value });
          }}
          className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer"
        >
          <option value="">Todas las Marcas</option>
          <option value="PORSCHE">Porsche</option>
          <option value="FERRARI">Ferrari</option>
          <option value="LAMBORGHINI">Lamborghini</option>
          <option value="MCLAREN">McLaren</option>
          <option value="ASTON MARTIN">Aston Martin</option>
          <option value="MERCEDES-AMG">Mercedes-AMG</option>
          <option value="AUDI">Audi Sport</option>
          <option value="BMW">BMW M</option>
          <option value="BENTLEY">Bentley</option>
          <option value="ROLLS-ROYCE">Rolls-Royce</option>
          <option value="CHEVROLET">Chevrolet Corvette</option>
          <option value="DODGE">Dodge SRT</option>
          <option value="FORD">Ford GT</option>
        </select>
      </div>

      {/* 5. POTENCIA */}
      <div className="space-y-2">
        <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">POTENCIA</label>
        <select
          value={power}
          onChange={(e) => {
            setPower(e.target.value);
            emitFilters({ power: e.target.value });
          }}
          className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer"
        >
          <option value="">Cualquier Potencia</option>
          <option value="500">+ 500 CV</option>
          <option value="600">+ 600 CV</option>
          <option value="700">+ 700 CV (Supercars V8 / V10)</option>
          <option value="800">+ 800 CV (Hypercars)</option>
          <option value="1000">+ 1.000 CV (V12 / Híbridos)</option>
        </select>
      </div>

      {/* 6. CAJA DE CAMBIOS */}
      <div className="space-y-2">
        <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">CAJA DE CAMBIOS</label>
        <select
          value={transmission}
          onChange={(e) => {
            setTransmission(e.target.value);
            emitFilters({ transmission: e.target.value });
          }}
          className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer"
        >
          <option value="">Cualquier Transmisión</option>
          <option value="AUTOMATIC">Automático (PDK / DKG)</option>
          <option value="MANUAL">Manual</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => emitFilters({})}
        className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm"
      >
        APLICAR FILTROS
      </button>
    </aside>
  );
}
