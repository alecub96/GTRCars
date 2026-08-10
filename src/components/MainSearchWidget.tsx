'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { CANARY_ISLANDS } from '@/lib/pricing';

interface MainSearchWidgetProps {
  selectedIsland?: string;
  onIslandChange?: (newIsland: string) => void;
}

export default function MainSearchWidget({ selectedIsland, onIslandChange }: MainSearchWidgetProps) {
  const [islandInternal, setIslandInternal] = useState('Gran Canaria');
  const [passengers, setPassengers] = useState(2);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();

  const activeIsland = selectedIsland !== undefined ? selectedIsland : islandInternal;

  const handleIslandSelect = (newVal: string) => {
    setIslandInternal(newVal);
    if (onIslandChange) {
      onIslandChange(newVal);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeIsland) params.set('island', activeIsland);
    if (passengers) params.set('passengers', passengers.toString());
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    router.push(`/buscar?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-xl border border-[#E2E8F0] max-w-4xl w-full grid grid-cols-1 md:grid-cols-4 gap-3 text-[#0F172A]"
    >
      {/* SELECCIONAR ISLA */}
      <div className="p-3 rounded-2xl hover:bg-[#F8FAFC] transition-colors flex items-center space-x-3 border border-transparent hover:border-[#E2E8F0]">
        <MapPin className="w-5 h-5 text-[#14B8A6] shrink-0" />
        <div className="w-full">
          <label className="block text-[10px] font-black tracking-wider uppercase text-[#94A3B8]">¿DÓNDE RECOGER TU CAMPER?</label>
          <select
            value={activeIsland}
            onChange={(e) => handleIslandSelect(e.target.value)}
            className="w-full bg-transparent font-extrabold text-sm focus:outline-none cursor-pointer text-[#0F172A]"
          >
            {CANARY_ISLANDS.map((is) => (
              <option key={is.id} value={is.name}>
                {is.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FECHAS */}
      <div className="p-3 rounded-2xl hover:bg-[#F8FAFC] transition-colors flex items-center space-x-3 border border-transparent hover:border-[#E2E8F0]">
        <Calendar className="w-5 h-5 text-[#14B8A6] shrink-0" />
        <div className="w-full grid grid-cols-2 gap-1">
          <div>
            <label className="block text-[10px] font-black tracking-wider uppercase text-[#94A3B8]">FECHA SALIDA</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent font-bold text-xs focus:outline-none text-[#0F172A]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black tracking-wider uppercase text-[#94A3B8]">DEVOLUCIÓN</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent font-bold text-xs focus:outline-none text-[#0F172A]"
            />
          </div>
        </div>
      </div>

      {/* VIAJEROS */}
      <div className="p-3 rounded-2xl hover:bg-[#F8FAFC] transition-colors flex items-center space-x-3 border border-transparent hover:border-[#E2E8F0]">
        <Users className="w-5 h-5 text-[#14B8A6] shrink-0" />
        <div className="w-full">
          <label className="block text-[10px] font-black tracking-wider uppercase text-[#94A3B8]">VIAJEROS</label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="w-full bg-transparent font-extrabold text-sm focus:outline-none cursor-pointer text-[#0F172A]"
          >
            <option value={1}>1 Viajero</option>
            <option value={2}>2 Viajeros</option>
            <option value={3}>3 Viajeros</option>
            <option value={4}>4 Viajeros</option>
            <option value={6}>6+ Viajeros</option>
          </select>
        </div>
      </div>

      {/* BOTÓN BUSCAR */}
      <button
        type="submit"
        className="h-full py-4 px-6 rounded-2xl bg-[#14B8A6] text-white hover:bg-[#0F766E] transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg group"
      >
        <Search className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
        <span>BUSCAR CAMPER</span>
      </button>
    </form>
  );
}
