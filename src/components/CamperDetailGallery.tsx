'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Grid, Camera, ZoomIn } from 'lucide-react';

interface PhotoItem {
  id?: string;
  url: string;
  orderIndex?: number;
}

interface CamperDetailGalleryProps {
  photos: PhotoItem[];
  title: string;
}

export default function CamperDetailGallery({ photos, title }: CamperDetailGalleryProps) {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const validPhotos = React.useMemo(() => {
    if (!Array.isArray(photos) || photos.length === 0) {
      return [{ id: 'default', url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200' }];
    }
    return photos.map((p: any, idx) => {
      if (typeof p === 'string') return { id: String(idx), url: p };
      return { id: String(p?.id || idx), url: p?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200' };
    });
  }, [photos]);

  const total = validPhotos.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, total]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  // Swipe táctil en móvil
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
    const minDistance = 40;

    if (distance > minDistance) {
      // Siguiente
      setMobileIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    } else if (distance < -minDistance) {
      // Anterior
      setMobileIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="mb-10 w-full">
      {/* 1. VISTA MÓVIL (CARRUSEL DESLIZABLE TÁCTIL) */}
      <div
        className="relative block md:hidden w-full h-72 sm:h-80 rounded-3xl overflow-hidden bg-[#EBE7DF] select-none shadow-md"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={validPhotos[mobileIndex]?.url || validPhotos[0].url}
          alt={`${title} - Foto ${mobileIndex + 1}`}
          onClick={() => openLightbox(mobileIndex)}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* CONTADOR FLOTANTE */}
        <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg pointer-events-none">
          <Camera className="w-3.5 h-3.5 text-[#16B8AA]" />
          <span>
            {mobileIndex + 1} / {total}
          </span>
        </div>

        {/* BOTÓN VER TODAS */}
        <button
          type="button"
          onClick={() => openLightbox(mobileIndex)}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full text-[#13322E] shadow-md hover:bg-white transition-all cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* FLECHAS MÓVILES */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => setMobileIndex((prev) => (prev === 0 ? total - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-[#13322E] flex items-center justify-center shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileIndex((prev) => (prev === total - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-[#13322E] flex items-center justify-center shadow-md cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* INDICADORES DE PUNTOS */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 pointer-events-none">
            {validPhotos.slice(0, 8).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === mobileIndex ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. VISTA ESCRITORIO (EDITORIAL ADAPTABLE SEGÚN CANTIDAD DE FOTOS) */}
      {total === 1 ? (
        <div
          className="hidden md:block h-[420px] rounded-3xl overflow-hidden relative shadow-md group cursor-pointer bg-[#EBE7DF]"
          onClick={() => openLightbox(0)}
        >
          <img
            src={validPhotos[0].url}
            alt={`${title} - Foto Principal`}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(0);
            }}
            className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md text-[#13322E] border border-[#E9E1D2] hover:bg-[#13322E] hover:text-white px-4 py-2 rounded-full font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Ampliar foto</span>
          </button>
        </div>
      ) : total === 2 ? (
        <div className="hidden md:grid grid-cols-2 gap-3 h-[420px] rounded-3xl overflow-hidden relative shadow-md">
          {validPhotos.slice(0, 2).map((photo, index) => (
            <div
              key={photo.id || index}
              onClick={() => openLightbox(index)}
              className="h-full relative group cursor-pointer overflow-hidden bg-[#EBE7DF]"
            >
              <img
                src={photo.url}
                alt={`${title} - Foto ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md text-[#13322E] border border-[#E9E1D2] hover:bg-[#13322E] hover:text-white px-4 py-2.5 rounded-full font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            <span>Ver las 2 fotos</span>
          </button>
        </div>
      ) : (
        <div className="hidden md:grid grid-cols-4 gap-3 h-[440px] rounded-3xl overflow-hidden relative shadow-md">
          {/* FOTO PRINCIPAL (IZQUIERDA) */}
          <div
            className="col-span-2 h-full relative group cursor-pointer overflow-hidden bg-[#EBE7DF]"
            onClick={() => openLightbox(0)}
          >
            <img
              src={validPhotos[0].url}
              alt={`${title} - Foto Principal`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* FOTOS SECUNDARIAS (DERECHA) */}
          <div className="col-span-2 grid grid-cols-2 gap-3 h-full">
            {validPhotos.slice(1, 5).map((photo, index) => (
              <div
                key={photo.id || index}
                onClick={() => openLightbox(index + 1)}
                className="relative h-[214px] group cursor-pointer overflow-hidden bg-[#EBE7DF]"
              >
                <img
                  src={photo.url}
                  alt={`${title} - Vista ${index + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* BOTÓN FLOTANTE "VER TODAS LAS FOTOS" */}
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md text-[#13322E] border border-[#E9E1D2] hover:bg-[#13322E] hover:text-white px-4 py-2.5 rounded-full font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            <span>Ver todas las fotos ({total})</span>
          </button>
        </div>
      )}

      {/* 3. LIGHTBOX / MODAL PANTALLA COMPLETA */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* CABECERA LIGHTBOX */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#16B8AA]">
                Galería de fotos
              </span>
              <span className="text-sm font-bold text-white/80">
                {lightboxIndex + 1} de {total}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* IMAGEN CENTRAL EN GRANDE CON FLECHAS */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={validPhotos[lightboxIndex]?.url || validPhotos[0].url}
              alt={`${title} - Foto ${lightboxIndex + 1}`}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
            />

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev === 0 ? total - 1 : prev - 1))}
                  aria-label="Foto anterior"
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev === total - 1 ? 0 : prev + 1))}
                  aria-label="Foto siguiente"
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* TIRA DE MINIATURAS EN EL PIE */}
          <div className="flex items-center justify-center space-x-2 overflow-x-auto py-2 custom-scrollbar max-w-4xl mx-auto">
            {validPhotos.map((p, i) => (
              <button
                key={p.id || i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  i === lightboxIndex
                    ? 'border-[#16B8AA] scale-105 shadow-md'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={p.url} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
