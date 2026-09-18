'use client';

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { SUPERCAR_LOCATIONS, getCitiesByCountry } from '@/lib/supercar-locations';

export default function BuscarFilters() {
  const [countryCode, setCountryCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [bodyType, setBodyType] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [power, setPower] = useState<string>('');
  const [transmission, setTransmission] = useState<string>('');

  const availableCities = countryCode
    ? getCitiesByCountry(countryCode)
    : SUPERCAR_LOCATIONS.flatMap((c) => c.cities);

  const handleCountryChange = (newCountry: string) => {
    setCountryCode(newCountry);
    setCity('');
  };

  return (
    <aside className="bg-gray-50 rounded-3xl p-6 border border-gray-200 h-fit space-y-6 font-mono text-xs shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <span className="text-black font-bold uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-black" /> FILTROS DE BÚSQUEDA
        </span>
      </div>

      {/* 1. CARROCERÍA */}
      <div className="space-y-2">
        <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">CARROCERÍA</label>
        <select
          value={bodyType}
          onChange={(e) => setBodyType(e.target.value)}
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
          onChange={(e) => setCity(e.target.value)}
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
          onChange={(e) => setBrand(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer"
        >
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

      {/* 5. POTENCIA */}
      <div className="space-y-2">
        <label className="text-gray-700 uppercase tracking-widest block text-[10px] font-bold">POTENCIA</label>
        <select
          value={power}
          onChange={(e) => setPower(e.target.value)}
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
          onChange={(e) => setTransmission(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-mono focus:border-black outline-none cursor-pointer"
        >
          <option value="">Cualquier Transmisión</option>
          <option value="AUTOMATIC">Automático (PDK / DKG)</option>
          <option value="MANUAL">Manual</option>
        </select>
      </div>

      <button
        type="button"
        className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm"
      >
        APLICAR FILTROS
      </button>
    </aside>
  );
}
