'use client';

import React, { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CarFront, Truck, Caravan, BusFront, Mountain, Ship, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  CarFront,
  Truck,
  Caravan,
  BusFront,
  Mountain,
  Ship,
};

export const VEHICLE_SLIDER_ITEMS = [
  { id: 'TURISMO_CAMPERIZADO', label: 'Camper Pequeña', iconName: 'CarFront' },
  { id: 'CAMPER_GRAN_VOLUMEN', label: 'Gran Volumen', iconName: 'Truck' },
  { id: 'CARAVANA', label: 'Caravana', iconName: 'Caravan' },
  { id: 'AUTOCARAVANA', label: 'Autocaravana', iconName: 'BusFront' },
  { id: '4X4_CAMPERIZADO', label: '4x4 Camper', iconName: 'Mountain' },
  { id: 'BARCO', label: 'Barco / Velero', iconName: 'Ship' },
];

interface VehicleTypeSliderProps {
  selectedType?: string;
  onSelectType?: (typeId: string) => void;
  showAllOption?: boolean;
}

export default function VehicleTypeSlider({
  selectedType,
  onSelectType,
  showAllOption = true,
}: VehicleTypeSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const currentType = selectedType !== undefined ? selectedType : searchParams?.get('vehicleType') || '';

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleSelect = (id: string) => {
    if (onSelectType) {
      onSelectType(id);
    } else {
      const currentParams = new URLSearchParams(searchParams ? searchParams.toString() : '');
      if (id) {
        currentParams.set('vehicleType', id);
      } else {
        currentParams.delete('vehicleType');
      }
      router.push(`/buscar?${currentParams.toString()}`);
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto w-full my-2 px-2 sm:px-4">
      {/* BOTÓN FLECHA IZQUIERDA (MÓVIL / TABLET) */}
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Deslizar a la izquierda"
        className="lg:hidden absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-[#13322E] shadow-md border border-[#E9E1D2] flex items-center justify-center hover:bg-[#16B8AA] hover:text-white transition-all cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* CONTENEDOR SLIDER: ALINEADO SIN CORTES LATERALES */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex items-center justify-start lg:justify-center flex-nowrap gap-2 sm:gap-2.5 overflow-x-auto py-2 px-10 lg:px-2 scrollbar-none cursor-grab active:cursor-grabbing select-none touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {showAllOption && (
          <button
            type="button"
            onClick={() => handleSelect('')}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3.5 py-2 sm:py-2.5 rounded-2xl border text-[11px] sm:text-xs font-bold shrink-0 transition-all shadow-sm cursor-pointer whitespace-nowrap ${
              !currentType
                ? 'border-[#16B8AA] bg-[#16B8AA] text-white ring-2 ring-[#16B8AA]/30'
                : 'border-white/70 bg-white/95 text-[#13322E] hover:bg-white hover:border-[#16B8AA]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Todas las opciones</span>
          </button>
        )}

        {VEHICLE_SLIDER_ITEMS.map(({ id, label, iconName }) => {
          const IconComponent = ICON_MAP[iconName] || CarFront;
          const isActive = currentType === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3.5 py-2 sm:py-2.5 rounded-2xl border text-[11px] sm:text-xs font-bold shrink-0 transition-all shadow-sm cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-[#16B8AA] bg-[#16B8AA] text-white ring-2 ring-[#16B8AA]/30'
                  : 'border-white/70 bg-white/95 text-[#13322E] hover:bg-white hover:border-[#16B8AA]'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* BOTÓN FLECHA DERECHA (MÓVIL / TABLET) */}
      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Deslizar a la derecha"
        className="lg:hidden absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-[#13322E] shadow-md border border-[#E9E1D2] flex items-center justify-center hover:bg-[#16B8AA] hover:text-white transition-all cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
