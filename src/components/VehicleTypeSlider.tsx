'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  SupercarV8Silhouette,
  SpyderSilhouette,
  SedanDeportivoSilhouette,
  SuperSUVSilhouette,
} from '@/components/SupercarIcons';

export const VEHICLE_SLIDER_ITEMS = [
  { id: 'COUPE', label: 'Coupé', icon: SupercarV8Silhouette },
  { id: 'CABRIO', label: 'Descapotable', icon: SpyderSilhouette },
  { id: 'SEDAN_DEPORTIVO', label: 'Sedán Deportivo', icon: SedanDeportivoSilhouette },
  { id: 'SUV_DEPORTIVO', label: 'Super SUV', icon: SuperSUVSilhouette },
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
  const searchParams = useSearchParams();
  const sliderRef = useRef<HTMLDivElement>(null);

  const currentType =
    selectedType !== undefined ? selectedType : searchParams?.get('vehicleType') || '';

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const buildUrl = (id: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (id) {
      params.set('vehicleType', id);
    } else {
      params.delete('vehicleType');
    }
    const query = params.toString();
    return `/buscar${query ? `?${query}` : ''}`;
  };

  return (
    <div className="relative max-w-6xl mx-auto w-full my-2 px-2 sm:px-4">
      {/* BOTÓN FLECHA IZQUIERDA (MÓVIL / TABLET) */}
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Deslizar a la izquierda"
        className="lg:hidden absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-black shadow-md border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* CONTENEDOR SLIDER DE CATEGORÍAS */}
      <div
        ref={sliderRef}
        className="flex items-center justify-start lg:justify-center flex-nowrap gap-2 sm:gap-3 overflow-x-auto py-2 px-10 lg:px-2 scrollbar-none touch-pan-x scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {showAllOption && (
          onSelectType ? (
            <button
              type="button"
              onClick={() => onSelectType('')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border text-xs font-mono font-bold shrink-0 transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95 ${
                !currentType
                  ? 'border-black bg-black text-white ring-1 ring-black'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400 hover:text-black'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Todas las opciones</span>
            </button>
          ) : (
            <Link
              href={buildUrl('')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border text-xs font-mono font-bold shrink-0 transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95 ${
                !currentType
                  ? 'border-black bg-black text-white ring-1 ring-black'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400 hover:text-black'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Todas las opciones</span>
            </Link>
          )
        )}

        {VEHICLE_SLIDER_ITEMS.map(({ id, label, icon: IconComponent }) => {
          const isActive = currentType === id;

          return onSelectType ? (
            <button
              key={id}
              type="button"
              onClick={() => onSelectType(id)}
              className={`flex items-center space-x-2.5 px-4 py-1.5 rounded-2xl border text-xs font-mono font-bold shrink-0 transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'border-black bg-black text-white ring-1 ring-black'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400 hover:text-black'
              }`}
            >
              <IconComponent className={`h-5 w-auto object-contain ${isActive ? 'brightness-0 invert' : ''}`} alt={label} />
              <span>{label}</span>
            </button>
          ) : (
            <Link
              key={id}
              href={buildUrl(id)}
              className={`flex items-center space-x-2.5 px-4 py-1.5 rounded-2xl border text-xs font-mono font-bold shrink-0 transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'border-black bg-black text-white ring-1 ring-black'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400 hover:text-black'
              }`}
            >
              <IconComponent className={`h-5 w-auto object-contain ${isActive ? 'brightness-0 invert' : ''}`} alt={label} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* BOTÓN FLECHA DERECHA (MÓVIL / TABLET) */}
      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Deslizar a la derecha"
        className="lg:hidden absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-black shadow-md border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
