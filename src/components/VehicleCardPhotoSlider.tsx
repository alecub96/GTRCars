'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import Link from 'next/link';

interface PhotoItem {
  id?: string;
  url: string;
  orderIndex?: number;
}

interface VehicleCardPhotoSliderProps {
  photos: PhotoItem[];
  title: string;
  slug: string;
  isFeatured?: boolean;
}

export default function VehicleCardPhotoSlider({
  photos,
  title,
  slug,
  isFeatured,
}: VehicleCardPhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const validPhotos =
    Array.isArray(photos) && photos.length > 0
      ? photos
      : [{ id: 'default', url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600' }];

  const total = validPhotos.length;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  // Soporte de deslizamiento táctil (Swipe) en móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      // Swipe hacia la izquierda -> Siguiente foto
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    } else if (distance < -minSwipeDistance) {
      // Swipe hacia la derecha -> Foto anterior
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    }
  };

  return (
    <div
      className="relative mb-3 h-52 sm:h-48 w-full overflow-hidden rounded-2xl bg-[#EBE7DF] select-none group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Link href={`/camper/${slug}`} className="block h-full w-full">
        <img
          src={validPhotos[currentIndex]?.url || validPhotos[0].url}
          alt={`${title} - Foto ${currentIndex + 1}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* BADGE DESTACADO */}
      {isFeatured && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-[#D97706] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm pointer-events-none">
          Destacado
        </span>
      )}

      {/* CONTADOR DE FOTOS (SI HAY MÁS DE 1) */}
      {total > 1 && (
        <div className="absolute bottom-2.5 right-3 z-10 flex items-center space-x-1 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-sm pointer-events-none">
          <Camera className="w-3 h-3 text-[#16B8AA]" />
          <span>
            {currentIndex + 1}/{total}
          </span>
        </div>
      )}

      {/* FLECHAS DE NAVEGACIÓN ANTERIOR / SIGUIENTE (SI HAY MÁS DE 1 FOTO) */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#13322E] shadow-md transition-all hover:bg-white hover:scale-110 opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#13322E] shadow-md transition-all hover:bg-white hover:scale-110 opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* PUNTOS INDICADORES DE FOTO */}
      {total > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex space-x-1 pointer-events-none">
          {validPhotos.slice(0, 6).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/60'
              }`}
            />
          ))}
          {total > 6 && <div className="h-1.5 w-1.5 rounded-full bg-white/40" />}
        </div>
      )}
    </div>
  );
}
