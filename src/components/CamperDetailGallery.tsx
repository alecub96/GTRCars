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
      return [{ id: 'default', url: '/supercars/ferrari-488/ferrari-488-front.jpg' }];
    }
    return photos.map((p: any, idx) => {
      if (typeof p === 'string') return { id: String(idx), url: p };
      return { id: String(p?.id || idx), url: p?.url || '/supercars/ferrari-488/ferrari-488-front.jpg' };
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
      setMobileIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    } else if (distance < -minDistance) {
      setMobileIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="mb-10 w-full font-mono">
      {/* 1. VISTA MÓVIL */}
      <div
        className="relative block md:hidden w-full h-72 sm:h-80 rounded-3xl overflow-hidden bg-gray-100 select-none shadow-md"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={validPhotos[mobileIndex]?.url || validPhotos[0].url}
          alt={`${title} - Vista ${mobileIndex + 1}`}
          onClick={() => openLightbox(mobileIndex)}
          className="w-full h-full object-cover cursor-pointer"
        />

        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg pointer-events-none">
          <Camera className="w-3.5 h-3.5 text-white" />
          <span>
            {mobileIndex + 1} / {total}
          </span>
        </div>

        <button
          type="button"
          aria-label="Ampliar fotografía"
          onClick={() => openLightbox(mobileIndex)}
          className="absolute top-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-full text-black shadow-md hover:bg-white transition-all cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => setMobileIndex((prev) => (prev === 0 ? total - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={() => setMobileIndex((prev) => (prev === total - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center shadow-md cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

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

      {/* 2. VISTA ESCRITORIO */}
      {total === 1 ? (
        <div
          className="hidden md:block h-[420px] rounded-3xl overflow-hidden relative shadow-md group cursor-pointer bg-gray-100"
          onClick={() => openLightbox(0)}
        >
          <img
            src={validPhotos[0].url}
            alt={`${title} - Vista Principal`}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(0);
            }}
            className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md text-black border border-gray-200 hover:bg-black hover:text-white px-4 py-2 rounded-full font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Ampliar fotografía</span>
          </button>
        </div>
      ) : total === 2 ? (
        <div className="hidden md:grid grid-cols-2 gap-3 h-[420px] rounded-3xl overflow-hidden relative shadow-md">
          {validPhotos.slice(0, 2).map((photo, index) => (
            <div
              key={photo.id || index}
              onClick={() => openLightbox(index)}
              className="h-full relative group cursor-pointer overflow-hidden bg-gray-100"
            >
              <img
                src={photo.url}
                alt={`${title} - Vista ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md text-black border border-gray-200 hover:bg-black hover:text-white px-4 py-2.5 rounded-full font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            <span>Ver las 2 fotos</span>
          </button>
        </div>
      ) : (
        <div className="hidden md:grid grid-cols-4 gap-3 h-[440px] rounded-3xl overflow-hidden relative shadow-md">
          <div
            className="col-span-2 h-full relative group cursor-pointer overflow-hidden bg-gray-100"
            onClick={() => openLightbox(0)}
          >
            <img
              src={validPhotos[0].url}
              alt={`${title} - Vista Principal`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-3 h-full">
            {validPhotos.slice(1, 5).map((photo, index) => (
              <div
                key={photo.id || index}
                onClick={() => openLightbox(index + 1)}
                className="relative h-[214px] group cursor-pointer overflow-hidden bg-gray-100"
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

          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md text-black border border-gray-200 hover:bg-black hover:text-white px-4 py-2.5 rounded-full font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            <span>Ver galería completa ({total})</span>
          </button>
        </div>
      )}

      {/* 3. LIGHTBOX */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                GALERÍA OFICIAL GTR CARS
              </span>
              <span className="text-xs font-bold text-white/70">
                {lightboxIndex + 1} de {total}
              </span>
            </div>
            <button
              type="button"
              aria-label="Cerrar galería"
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={validPhotos[lightboxIndex]?.url || validPhotos[0].url}
              alt={`${title} - Vista ${lightboxIndex + 1}`}
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

          <div className="flex items-center justify-center space-x-2 overflow-x-auto py-2 max-w-4xl mx-auto">
            {validPhotos.map((p, i) => (
              <button
                key={p.id || i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  i === lightboxIndex
                    ? 'border-white scale-105 shadow-md'
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
