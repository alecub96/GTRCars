'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Users, Search, ChevronDown, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { CANARY_ISLANDS } from '@/lib/pricing';
import DateRangeCalendar from '@/components/DateRangeCalendar';

interface MainSearchWidgetProps {
  selectedIsland?: string;
  onIslandChange?: (newIsland: string) => void;
  selectedVehicleType?: string;
  onVehicleTypeChange?: (newType: string) => void;
}

const ISLAND_EMOJIS: Record<string, string> = {
  'Gran Canaria': '🏝️',
  'Tenerife': '🌋',
  'Lanzarote': '🌋',
  'Fuerteventura': '🏖️',
  'La Palma': '🌲',
  'La Gomera': '🌲',
  'El Hierro': '🌊',
  'La Graciosa': '⛵',
};

export default function MainSearchWidget({ selectedIsland, onIslandChange, selectedVehicleType, onVehicleTypeChange }: MainSearchWidgetProps) {
  const [islandInternal, setIslandInternal] = useState('Gran Canaria');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [hasPet, setHasPet] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isIslandOpen, setIslandOpen] = useState(false);
  const [isPassengersOpen, setIsPassengersOpen] = useState(false);

  const islandRef = useRef<HTMLDivElement>(null);
  const passengersRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const activeIsland = selectedIsland !== undefined ? selectedIsland : islandInternal;
  const totalPassengers = adults + children;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (islandRef.current && !islandRef.current.contains(event.target as Node)) {
        setIslandOpen(false);
      }
      if (passengersRef.current && !passengersRef.current.contains(event.target as Node)) {
        setIsPassengersOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIslandSelect = (newVal: string) => {
    setIslandInternal(newVal);
    if (onIslandChange) {
      onIslandChange(newVal);
    }
    setIslandOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeIsland) params.set('island', activeIsland);
    if (selectedVehicleType) params.set('vehicleType', selectedVehicleType);
    if (totalPassengers) params.set('passengers', totalPassengers.toString());
    if (hasPet) params.set('petFriendly', 'true');
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    router.push(`/buscar?${params.toString()}`);
  };

  const passengerLabelText = () => {
    let text = `${adults} ${adults === 1 ? 'Adulto' : 'Adultos'}`;
    if (children > 0) text += `, ${children} ${children === 1 ? 'Niño' : 'Niños'}`;
    if (hasPet) text += ' 🐾';
    return text;
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-xl rounded-[28px] p-3 sm:p-4 shadow-2xl border border-[#E9E1D2] max-w-4xl w-full grid grid-cols-1 md:grid-cols-4 gap-2 text-[#13322E] relative z-30"
    >
      {/* 1. SELECCIONAR ISLA PERSONALIZADO */}
      <div ref={islandRef} className="relative w-full">
        <button
          type="button"
          onClick={() => {
            setIslandOpen(!isIslandOpen);
            setIsPassengersOpen(false);
          }}
          className={`w-full p-3 rounded-2xl transition-all flex items-center space-x-3 text-left border cursor-pointer ${
            isIslandOpen
              ? 'bg-white border-[#16B8AA] ring-4 ring-[#16B8AA]/10 shadow-sm'
              : 'border-transparent hover:bg-[#F8FAFC] hover:border-[#E9E1D2]'
          }`}
        >
          <MapPin className="w-5 h-5 text-[#16B8AA] shrink-0" />
          <div className="w-full min-w-0 flex-1">
            <label className="block text-[9px] font-black tracking-wider uppercase text-[#94A3B8] cursor-pointer">
              ¿DÓNDE RECOGER?
            </label>
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#13322E] truncate">
                {ISLAND_EMOJIS[activeIsland] || '🏝️'} {activeIsland}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${isIslandOpen ? 'rotate-180 text-[#16B8AA]' : ''}`} />
            </div>
          </div>
        </button>

        {/* DESPLEGABLE FLOTANTE DE ISLAS */}
        {isIslandOpen && (
          <div className="absolute top-full left-0 mt-2 w-full sm:w-72 bg-white rounded-2xl shadow-2xl border border-[#E9E1D2] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 border-b border-[#E9E1D2]/60 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA]">Selecciona tu Isla</span>
              <Sparkles className="w-3.5 h-3.5 text-[#16B8AA]" />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {CANARY_ISLANDS.map((is) => {
                const isSelected = activeIsland === is.name;
                return (
                  <button
                    key={is.id}
                    type="button"
                    onClick={() => handleIslandSelect(is.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#16B8AA]/10 text-[#16B8AA] border border-[#16B8AA]/30'
                        : 'text-[#13322E] hover:bg-[#F7F6F2]'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-base">{ISLAND_EMOJIS[is.name] || '🏝️'}</span>
                      <span>{is.name}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#16B8AA]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. FECHAS */}
      <div className="p-3 rounded-2xl hover:bg-[#F8FAFC] transition-colors flex items-center space-x-3 border border-transparent hover:border-[#E9E1D2]">
        <DateRangeCalendar variant="popover" startDate={startDate} endDate={endDate} onChange={(start, end) => { setStartDate(start); setEndDate(end); }} />
      </div>

      {/* 3. VIAJEROS Y MASCOTAS PERSONALIZADO */}
      <div ref={passengersRef} className="relative w-full">
        <button
          type="button"
          onClick={() => {
            setIsPassengersOpen(!isPassengersOpen);
            setIslandOpen(false);
          }}
          className={`w-full p-3 rounded-2xl transition-all flex items-center space-x-3 text-left border cursor-pointer ${
            isPassengersOpen
              ? 'bg-white border-[#16B8AA] ring-4 ring-[#16B8AA]/10 shadow-sm'
              : 'border-transparent hover:bg-[#F8FAFC] hover:border-[#E9E1D2]'
          }`}
        >
          <Users className="w-5 h-5 text-[#16B8AA] shrink-0" />
          <div className="w-full min-w-0 flex-1">
            <label className="block text-[9px] font-black tracking-wider uppercase text-[#94A3B8] cursor-pointer">
              VIAJEROS
            </label>
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#13322E] truncate">
                {passengerLabelText()}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${isPassengersOpen ? 'rotate-180 text-[#16B8AA]' : ''}`} />
            </div>
          </div>
        </button>

        {/* DESPLEGABLE FLOTANTE DE VIAJEROS CON CONTADORES */}
        {isPassengersOpen && (
          <div className="absolute top-full right-0 mt-2 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E9E1D2] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-[#13322E]">
            <div className="space-y-4">
              {/* ADULTOS */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#13322E]">Adultos</h4>
                  <p className="text-[10px] text-[#6B726E]">Edad 18+ años</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-full border border-[#E9E1D2] flex items-center justify-center text-[#13322E] hover:bg-[#F7F6F2] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-sm w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-[#E9E1D2] flex items-center justify-center text-[#13322E] hover:bg-[#F7F6F2] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* NIÑOS */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E9E1D2]/60">
                <div>
                  <h4 className="text-xs font-bold text-[#13322E]">Niños</h4>
                  <p className="text-[10px] text-[#6B726E]">De 0 a 17 años</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    disabled={children <= 0}
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-[#E9E1D2] flex items-center justify-center text-[#13322E] hover:bg-[#F7F6F2] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-sm w-4 text-center">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-[#E9E1D2] flex items-center justify-center text-[#13322E] hover:bg-[#F7F6F2] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* MASCOTAS */}
              <div className="pt-3 border-t border-[#E9E1D2]/60">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <h4 className="text-xs font-bold text-[#13322E] flex items-center gap-1.5">
                      <span>Mascota a bordo</span> 🐾
                    </h4>
                    <p className="text-[10px] text-[#6B726E]">Buscar campers Pet-Friendly</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasPet}
                    onChange={(e) => setHasPet(e.target.checked)}
                    className="w-5 h-5 accent-[#16B8AA] rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* BOTÓN APLICAR */}
              <button
                type="button"
                onClick={() => setIsPassengersOpen(false)}
                className="w-full mt-2 bg-[#16B8AA] hover:bg-[#0F766E] text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
              >
                Aplicar Viajeros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTÓN BUSCAR */}
      <button
        type="submit"
        style={{ backgroundColor: '#16B8AA', color: '#FFFFFF' }}
        className="h-full py-4 px-6 rounded-2xl !bg-[#16B8AA] !text-white hover:!bg-[#0F766E] transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg group cursor-pointer"
      >
        <Search className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
        <span className="text-white font-black">BUSCAR CAMPER</span>
      </button>
    </form>
  );
}
