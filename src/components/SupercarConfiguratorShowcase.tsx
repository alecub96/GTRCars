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

  // Derive target specs
  const displayModel = (model || title || 'SUPERCAR').toUpperCase();
  const targetHp = hp || 720;
  const targetSpeed = topSpeed || 330;
  const targetAccelNum = parseFloat(accel || '2.9');

  // ANIMATED VALUES FOR APPLE-STYLE ROLLER EFFECT INSIDE ANNOUNCEMENTS
  const [animatedHp, setAnimatedHp] = useState(0);
  const [animatedSpeed, setAnimatedSpeed] = useState(0);
  const [animatedAccel, setAnimatedAccel] = useState(0);

  useEffect(() => {
    const duration = 700; // ms
    const steps = 35;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Easing function (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedHp(Math.round(targetHp * easeProgress));
      setAnimatedSpeed(Math.round(targetSpeed * easeProgress));
      setAnimatedAccel(parseFloat((targetAccelNum * easeProgress).toFixed(1)));

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedHp(targetHp);
        setAnimatedSpeed(targetSpeed);
        setAnimatedAccel(targetAccelNum);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [targetHp, targetSpeed, targetAccelNum]);

  const nextPhoto = () => setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  const prevPhoto = () => setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));

  return (
    <div className="relative w-full bg-white border-b border-gray-100 select-none overflow-hidden text-black font-sans">
      
      {/* 1. TOP BAR CONFIGURATOR CONTROLS */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-8 pt-4 pb-2">
        <Link
          href="/buscar"
          className="flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-black hover:text-white border border-gray-200 text-black rounded-full transition-all shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-mono uppercase tracking-wider rounded-full">
            <Globe className="w-3.5 h-3.5 text-black" />
            <span>{island} {municipality ? `// ${municipality}` : ''}</span>
          </div>

          <button
            onClick={() => setLightboxOpen(true)}
            className="flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-black hover:text-white border border-gray-200 text-black rounded-full transition-all shadow-xs"
            title="Pantalla completa"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN VEHICLE STAGE / BACKGROUND PHOTO WITH OVERLAY HUD */}
      <div className="relative w-full h-[62vh] sm:h-[75vh] min-h-[500px] max-h-[820px] flex items-center justify-center bg-black overflow-hidden">
        
        {/* Dynamic Photo */}
        <img
          key={currentPhoto}
          src={currentPhoto}
          alt={`${title} - Foto ${currentIndex + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-700"
        />

        {/* Gradiente superior suave para garantizar 100% de contraste del texto blanco */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* OVERLAY HUD: BIG TITLE & TELEMETRY EN BLANCO DIRECTAMENTE SOBRE LA FOTO */}
        <div className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-12 pt-6 pb-6 max-w-7xl mx-auto pointer-events-none">
          
          {/* BIG MODEL NAME EN BLANCO */}
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white font-sans drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            {displayModel}
          </h1>

          {/* TELEMETRY SPECS HUD EN BLANCO */}
          <div className="mt-4 flex items-center space-x-8 sm:space-x-14 font-mono">
            <div>
              <span className="text-[10px] sm:text-xs text-white/70 uppercase tracking-widest block font-bold drop-shadow-md">
                POTENCIA
              </span>
              <span className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight tabular-nums drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {animatedHp} <span className="text-sm sm:text-xl text-white/70 font-bold">CV</span>
              </span>
            </div>

            <div className="border-l border-white/20 pl-8 sm:pl-14">
              <span className="text-[10px] sm:text-xs text-white/70 uppercase tracking-widest block font-bold drop-shadow-md">
                VELOCIDAD MÁX.
              </span>
              <span className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight tabular-nums drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {animatedSpeed} <span className="text-sm sm:text-xl text-white/70 font-bold">KM/H</span>
              </span>
            </div>

            <div className="border-l border-white/20 pl-8 sm:pl-14">
              <span className="text-[10px] sm:text-xs text-white/70 uppercase tracking-widest block font-bold drop-shadow-md">
                0-100 KM/H
              </span>
              <span className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight tabular-nums drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {animatedAccel.toFixed(1)} S
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION ARROWS */}
        {total > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-4 sm:left-8 z-30 p-3 bg-white/90 hover:bg-black hover:text-white text-black rounded-full backdrop-blur-md border border-gray-200 transition-all shadow-md cursor-pointer"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 sm:right-8 z-30 p-3 bg-white/90 hover:bg-black hover:text-white text-black rounded-full backdrop-blur-md border border-gray-200 transition-all shadow-md cursor-pointer"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* 4. BOTTOM CONFIGURATOR DOCK */}
      <div className="relative z-20 px-4 sm:px-8 py-4 bg-white/95 backdrop-blur-md border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
        
        {/* PHOTO / ANGLE SELECTOR DOCK */}
        <div className="flex items-center space-x-3 overflow-x-auto py-1">
          {validPhotos.map((photo, idx) => (
            <button
              key={photo.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-12 w-20 sm:h-14 sm:w-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                currentIndex === idx
                  ? 'border-black shadow-md scale-105'
                  : 'border-gray-200 opacity-60 hover:opacity-100'
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
        <div className="flex items-center space-x-5 ml-auto">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">DESDE</span>
            <span className="text-2xl font-mono font-black text-black">{pricePerDay}€</span>
            <span className="text-[10px] font-mono text-gray-500"> / DÍA</span>
          </div>

          <a
            href="#reserva-widget"
            className="px-8 py-4 bg-black hover:bg-gray-800 text-white font-black text-xs font-mono uppercase tracking-[0.2em] transition-all rounded-full shadow-md"
          >
            SELECCIONAR & RESERVAR
          </a>
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
