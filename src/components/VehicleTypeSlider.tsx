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
      const scrollAmount = direction === 'left' ? -240 : 240;
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
    <div className="relative max-w-5xl mx-auto w-full my-3 px-2">
      {/* CONTENEDOR SLIDER HORIZONTAL CON ARRASTRE Y TÁCTIL */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3 overflow-x-auto py-2 px-1 no-scrollbar cursor-grab active:cursor-grabbing select-none touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {showAllOption && (
          <button
            type="button"
            onClick={() => handleSelect('')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl border text-xs font-bold shrink-0 transition-all shadow-sm cursor-pointer ${
              !currentType
                ? 'border-[#16B8AA] bg-[#16B8AA] text-white ring-2 ring-[#16B8AA]/30'
                : 'border-white/50 bg-white/95 text-[#13322E] hover:bg-white hover:border-[#16B8AA]'
            }`}
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Todas las opciones</span>
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
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold shrink-0 transition-all shadow-md cursor-pointer ${
                isActive
                  ? 'border-[#16B8AA] bg-[#16B8AA] text-white ring-2 ring-[#16B8AA]/30'
                  : 'border-white/60 bg-white/95 text-[#13322E] hover:bg-white hover:border-[#16B8AA]'
              }`}
            >
              <IconComponent className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
