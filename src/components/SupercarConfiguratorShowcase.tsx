'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Globe, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Maximize2, 
  X,
  Volume2
} from 'lucide-react';

interface PhotoItem {
  id?: string;
  url: string;
  orderIndex?: number;
}

interface SupercarConfiguratorShowcaseProps {
  photos: PhotoItem[];
  title: string;
  brand: string;
  model: string;
  year?: number;
  hp?: number;
  accel?: string;
  topSpeed?: number;
  pricePerDay: number;
  island?: string;
  municipality?: string;
  engine?: string;
  transmission?: string;
  drive?: string;
  consumption?: string;
  co2?: string;
}

export default function SupercarConfiguratorShowcase({
  photos,
  title,
  brand = 'LAMBORGHINI',
  model = 'TEMERARIO',
  year = 2025,
  hp = 920,
  accel = '2.7 S',
  topSpeed = 343,
  pricePerDay = 2500,
  island = 'Madrid',
  municipality,
  engine = '4.0L V8 Twin-Turbo Híbrido',
  consumption = '14,0 l/100 km (WLTP)',
  co2 = '272-252 g/km (WLTP)'
}: SupercarConfiguratorShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const validPhotos = React.useMemo(() => {
    if (!Array.isArray(photos) || photos.length === 0) {
      return [{ id: '1', url: '/supercars/lambo-revuelto.jpg' }];
    }
    return photos.map((p: any, idx) => {
      if (typeof p === 'string') return { id: String(idx), url: p };
      return { id: String(p?.id || idx), url: p?.url || '/supercars/lambo-revuelto.jpg' };
    });
  }, [photos]);

  const total = validPhotos.length;
  const currentPhoto = validPhotos[currentIndex]?.url || validPhotos[0]?.url;

  // Derive specs if not present
  const displayModel = (model || title || 'SUPERCAR').toUpperCase();
  const displayHp = hp || 720;
  const displaySpeed = topSpeed || 330;
  const displayAccel = accel || '2.9 S';

  const nextPhoto = () => setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  const prevPhoto = () => setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));

  return (
    <div className="relative w-full bg-[#080808] border-b border-white/10 select-none overflow-hidden text-white font-sans">
      
      {/* 1. TOP BAR CONFIGURATOR CONTROLS */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-8 pt-4 pb-2">
        <Link
          href="/buscar"
          className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-sm transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-white/10 text-white/70 text-[11px] font-mono uppercase tracking-wider rounded-sm">
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{island} {municipality ? `// ${municipality}` : ''}</span>
          </div>

          <button
            onClick={() => setLightboxOpen(true)}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-sm transition-all"
            title="Pantalla completa"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. OVERLAY HUD: BIG TITLE & TELEMETRY (Lamborghini Configurator Style) */}
      <div className="relative z-20 px-6 sm:px-12 pt-2 pb-6 max-w-7xl mx-auto pointer-events-none">
        
        {/* BIG MODEL NAME */}
        <h1 className="text-4xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-sans">
          {displayModel}
        </h1>

        {/* TELEMETRY SPECS HUD (Floating directly over the background photo) */}
        <div className="mt-4 flex items-center space-x-8 sm:space-x-14 font-mono">
          <div>
            <span className="text-[10px] sm:text-xs text-white/60 uppercase tracking-widest block font-bold">
              POWER
            </span>
            <span className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {displayHp} <span className="text-sm sm:text-xl text-[#D4AF37]">CV</span>
            </span>
          </div>

          <div className="border-l border-white/20 pl-8 sm:pl-14">
            <span className="text-[10px] sm:text-xs text-white/60 uppercase tracking-widest block font-bold">
              MAX SPEED
            </span>
            <span className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {displaySpeed} <span className="text-sm sm:text-xl text-[#D4AF37]">KM/H</span>
            </span>
          </div>

          <div className="border-l border-white/20 pl-8 sm:pl-14">
            <span className="text-[10px] sm:text-xs text-white/60 uppercase tracking-widest block font-bold">
              0-100 KM/H
            </span>
            <span className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {displayAccel}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN VEHICLE STAGE / BACKGROUND PHOTO (Dynamic based on selected index or uploaded photo) */}
      <div className="relative w-full h-[52vh] sm:h-[68vh] min-h-[420px] max-h-[750px] flex items-center justify-center -mt-24 sm:-mt-32">
        
        {/* Atmospheric Dark Studio Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#080808] via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

        {/* Dynamic Photo */}
        <img
          key={currentPhoto}
          src={currentPhoto}
          alt={`${title} - Foto ${currentIndex + 1}`}
          className="w-full h-full object-contain sm:object-cover object-center transition-all duration-700 brightness-[0.92] contrast-[1.05]"
        />

        {/* NAVIGATION ARROWS */}
        {total > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-4 sm:left-8 z-30 p-3 bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white rounded-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 sm:right-8 z-30 p-3 bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white rounded-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* 4. BOTTOM CONFIGURATOR DOCK (Hexagonal Color/Angle Selectors & Booking CTA) */}
      <div className="relative z-20 px-4 sm:px-8 py-4 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        
        {/* PHOTO / ANGLE SELECTOR DOCK (Hexagonal pill style like Lamborghini configurator) */}
        <div className="flex items-center space-x-3 overflow-x-auto py-1">
          {validPhotos.map((photo, idx) => (
            <button
              key={photo.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-12 w-20 sm:h-14 sm:w-24 rounded-sm overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                currentIndex === idx
                  ? 'border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                  : 'border-white/20 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={photo.url}
                alt={`Miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 bg-black/80 px-1.5 py-0.5 text-[9px] font-mono text-white">
                0{idx + 1}
              </span>
            </button>
          ))}
        </div>

        {/* ACTION CTA (INICIAR RESERVA / CONFIGURACIÓN) */}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-white/50 uppercase block">DESDE</span>
            <span className="text-xl font-mono font-bold text-[#D4AF37]">{pricePerDay}€</span>
            <span className="text-[10px] font-mono text-white/50"> / DÍA</span>
          </div>

          <a
            href="#reserva-widget"
            className="px-8 py-4 bg-[#D4AF37] hover:bg-[#F5C542] text-black font-black text-xs font-mono uppercase tracking-[0.2em] transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] rounded-sm"
          >
            INICIAR CONFIGURACIÓN & RESERVA
          </a>
        </div>
      </div>

      {/* 5. LEGAL / WLTP BAR (Lamborghini Aesthetic) */}
      <div className="bg-[#050505] px-4 sm:px-8 py-2.5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-white/40 tracking-wider gap-2">
        <p>
          Consumo de energía (combinado ponderado): {consumption}; emisiones de CO₂ (combinadas ponderadas): {co2}
        </p>
        <div className="flex space-x-4 uppercase text-white/60">
          <span>FIANZA CUSTODIADA</span>
          <span>•</span>
          <span>CONTRATO eIDAS</span>
          <span>•</span>
          <span>PROPIETARIO VERIFICADO</span>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in">
          <div className="flex justify-between items-center text-white">
            <span className="font-mono text-xs text-[#D4AF37] tracking-widest">
              {displayModel} // FOTO {currentIndex + 1} DE {total}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4">
            <img
              src={currentPhoto}
              alt={title}
              className="max-h-[85vh] max-w-[95vw] object-contain"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={prevPhoto}
              className="px-6 py-2 bg-white/10 hover:bg-[#D4AF37] hover:text-black font-mono text-xs uppercase tracking-wider rounded-sm transition-all"
            >
              ANTERIOR
            </button>
            <button
              onClick={nextPhoto}
              className="px-6 py-2 bg-white/10 hover:bg-[#D4AF37] hover:text-black font-mono text-xs uppercase tracking-wider rounded-sm transition-all"
            >
              SIGUIENTE
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
