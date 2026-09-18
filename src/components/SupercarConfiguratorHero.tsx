'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { playPaddleShiftSound, playSoftTickSound } from '@/lib/sound';

interface Supercar {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  tagline: string;
  year: number;
  category: 'HYPERCAR' | 'SUPERCAR' | 'TRACK_SPECIAL' | 'GRAND_TOURER';
  hp: number;
  accel: string;
  topSpeed: number;
  engine: string;
  transmission: string;
  drive: string;
  pricePerDay: number;
  securityDeposit: number;
  watermarkText: string;
  owner: {
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
    trips: number;
    location: string;
  };
  colorName: string;
  colorHex: string;
  image: string;
  badgeText: string;
}

const FEATURED_FLEET: Supercar[] = [
  {
    id: 'porsche',
    slug: 'porsche-911-gt3-touring',
    name: '911 GT3 TOURING',
    brand: 'PORSCHE',
    model: '992 GT3 Touring Manual',
    tagline: 'Esencia pura: motor atmosférico a 9.000 rpm, cambio manual y estética limpia sin alerón fijo',
    year: 2024,
    category: 'TRACK_SPECIAL',
    hp: 510,
    accel: '3.9 S',
    topSpeed: 320,
    engine: '4.0L Boxer 6 Atmosférico',
    transmission: 'Manual GT Deportivo 6 Vel',
    drive: 'Propulsión Trasera RWD',
    pricePerDay: 1750,
    securityDeposit: 4500,
    watermarkText: 'PORSCHE',
    owner: {
      name: 'Raúl E.',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.99,
      trips: 28,
      location: 'Mallorca / Ibiza'
    },
    colorName: 'Jet Black Metallic',
    colorHex: '#111111',
    image: '/supercars/brands/porsche.png',
    badgeText: '6-SPEED MANUAL'
  },
  {
    id: 'ferrari',
    slug: 'ferrari-sf90-stradale',
    name: 'SF90 STRADALE',
    brand: 'FERRARI',
    model: 'SF90 Assetto Fiorano',
    tagline: '1.000 CV de pura ingeniería híbrida nacida directamente de la Scuderia Ferrari',
    year: 2024,
    category: 'HYPERCAR',
    hp: 1000,
    accel: '2.5 S',
    topSpeed: 340,
    engine: '4.0L V8 Bi-Turbo PHEV',
    transmission: 'F1 Doble Embrague 8 Vel',
    drive: 'e-4WD',
    pricePerDay: 2900,
    securityDeposit: 8000,
    watermarkText: 'FERRARI',
    owner: {
      name: 'Javier V.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.98,
      trips: 24,
      location: 'Barcelona / Costa Brava'
    },
    colorName: 'Rosso Corsa',
    colorHex: '#D40000',
    image: '/supercars/brands/ferrari.png',
    badgeText: 'ASSETTO FIORANO'
  },
  {
    id: 'lamborghini',
    slug: 'lamborghini-revuelto-v12',
    name: 'REVUELTO V12',
    brand: 'LAMBORGHINI',
    model: 'Revuelto V12 HPEV Hybrid',
    tagline: 'V12 atmosférico híbrido de 1.015 CV con aerodinámica activa y monocasco de carbono',
    year: 2025,
    category: 'HYPERCAR',
    hp: 1015,
    accel: '2.5 S',
    topSpeed: 350,
    engine: '6.5L V12 + 3 Motores Eléctricos',
    transmission: '8 Vel Doble Embrague',
    drive: 'Tracción Total AWD',
    pricePerDay: 3300,
    securityDeposit: 9500,
    watermarkText: 'LAMBORGHINI',
    owner: {
      name: 'Carlos M.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      trips: 18,
      location: 'Madrid / Marbella'
    },
    colorName: 'Blu Eleos',
    colorHex: '#1D4ED8',
    image: '/supercars/brands/lamborghini.png',
    badgeText: 'HYPERCAR V12'
  },
  {
    id: 'mclaren',
    slug: 'mclaren-750s-spider',
    name: '750S SPIDER',
    brand: 'MCLAREN',
    model: '750S Spider Carbon Edition',
    tagline: 'Monocasco ultra ligero con 750 CV, alerón aerofreno y aceleración fulgurante',
    year: 2024,
    category: 'SUPERCAR',
    hp: 750,
    accel: '2.8 S',
    topSpeed: 332,
    engine: '4.0L V8 Twin-Turbo',
    transmission: 'SSG 7 Velocidades',
    drive: 'Propulsión Trasera RWD',
    pricePerDay: 2500,
    securityDeposit: 7500,
    watermarkText: 'MCLAREN',
    owner: {
      name: 'Alejandro G.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      trips: 15,
      location: 'Tenerife / Las Palmas'
    },
    colorName: 'Papaya Orange',
    colorHex: '#EA580C',
    image: '/supercars/brands/mclaren.png',
    badgeText: 'CARBON MONOCELL'
  },
  {
    id: 'mercedes',
    slug: 'mercedes-amg-gt-black-series',
    name: 'AMG GT BLACK',
    brand: 'MERCEDES-BENZ',
    model: 'AMG GT Black Series Flat-Plane V8',
    tagline: 'V8 biturbo de 730 CV y carga aerodinámica masiva directa de la categoría GT3',
    year: 2024,
    category: 'TRACK_SPECIAL',
    hp: 730,
    accel: '3.2 S',
    topSpeed: 325,
    engine: '4.0L V8 Biturbo Flat-Plane',
    transmission: 'AMG SPEEDSHIFT DCT 7G',
    drive: 'Propulsión Trasera RWD',
    pricePerDay: 2350,
    securityDeposit: 7000,
    watermarkText: 'MERCEDES-BENZ',
    owner: {
      name: 'Alberto B.',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      trips: 17,
      location: 'Bilbao / Santander'
    },
    colorName: 'Magno Graphite',
    colorHex: '#374151',
    image: '/supercars/brands/mercedes-benz.png',
    badgeText: 'NORDSCHLEIFE RECORD'
  },
  {
    id: 'aston-martin',
    slug: 'aston-martin-dbs-superleggera',
    name: 'DBS V12',
    brand: 'ASTON MARTIN',
    model: 'DBS Superleggera V12 Bi-Turbo',
    tagline: 'Gran Turismo definitivo: 725 CV británicos esculpidos en fibra de carbono',
    year: 2024,
    category: 'GRAND_TOURER',
    hp: 725,
    accel: '3.4 S',
    topSpeed: 340,
    engine: '5.2L V12 Twin-Turbo',
    transmission: 'ZF 8 Velocidades',
    drive: 'Propulsión Trasera RWD',
    pricePerDay: 2100,
    securityDeposit: 6000,
    watermarkText: 'ASTON MARTIN',
    owner: {
      name: 'Gonzalo S.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      trips: 19,
      location: 'Madrid / Salamanca'
    },
    colorName: 'British Green',
    colorHex: '#1E3A2F',
    image: '/supercars/brands/aston-martin.png',
    badgeText: 'TWIN TURBO V12'
  },
  {
    id: 'audi',
    slug: 'audi-r8-v10-performance',
    name: 'R8 V10 GT',
    brand: 'AUDI',
    model: 'R8 V10 Performance GT RWD',
    tagline: 'El legendario motor V10 atmosférico en su despedida más radical y purista',
    year: 2024,
    category: 'SUPERCAR',
    hp: 620,
    accel: '3.1 S',
    topSpeed: 331,
    engine: '5.2L FSI V10 Atmosférico',
    transmission: 'S tronic 7 Velocidades',
    drive: 'Propulsión Trasera RWD',
    pricePerDay: 1900,
    securityDeposit: 5500,
    watermarkText: 'AUDI',
    owner: {
      name: 'Marcos T.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.96,
      trips: 21,
      location: 'Zaragoza / Madrid'
    },
    colorName: 'Suzuka Grey',
    colorHex: '#9CA3AF',
    image: '/supercars/brands/audi.png',
    badgeText: 'V10 PERFORMANCE'
  },
  {
    id: 'bmw',
    slug: 'bmw-m4-csl',
    name: 'M4 CSL',
    brand: 'BMW',
    model: 'M4 Competition Sport Lightweight',
    tagline: 'Edición limitada CSL con 550 CV, dieta estricta de carbono y ajustes de circuito',
    year: 2024,
    category: 'TRACK_SPECIAL',
    hp: 550,
    accel: '3.7 S',
    topSpeed: 307,
    engine: '3.0L M TwinPower Turbo 6L',
    transmission: 'M Steptronic 8 Vel con Drivelogic',
    drive: 'Propulsión Trasera RWD',
    pricePerDay: 1600,
    securityDeposit: 4500,
    watermarkText: 'BMW',
    owner: {
      name: 'David P.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.95,
      trips: 16,
      location: 'Sevilla / Málaga'
    },
    colorName: 'Frozen Brooklyn Grey',
    colorHex: '#64748B',
    image: '/supercars/brands/bmew.png',
    badgeText: 'CSL LIMITED'
  },
  {
    id: 'bentley',
    slug: 'bentley-continental-gt-speed',
    name: 'CONTINENTAL GT',
    brand: 'BENTLEY',
    model: 'Continental GT Speed W12',
    tagline: 'El pináculo del gran turismo artesanal: 659 CV con tracción total activa',
    year: 2024,
    category: 'GRAND_TOURER',
    hp: 659,
    accel: '3.6 S',
    topSpeed: 335,
    engine: '6.0L W12 TSI Twin-Turbo',
    transmission: 'Doble Embrague 8 Vel',
    drive: 'Tracción Total AWD',
    pricePerDay: 2250,
    securityDeposit: 6500,
    watermarkText: 'BENTLEY',
    owner: {
      name: 'Felipe M.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      trips: 13,
      location: 'Madrid / Marbella'
    },
    colorName: 'Verdant Green',
    colorHex: '#14532D',
    image: '/supercars/brands/bentley.png',
    badgeText: 'W12 SPEED'
  },
  {
    id: 'rolls-royce',
    slug: 'rolls-royce-spectre-v12',
    name: 'SPECTRE',
    brand: 'ROLLS-ROYCE',
    model: 'Spectre Ultra-Luxury Coupé',
    tagline: 'Lujo absoluto e insonorización perfecta en la silueta coupé más imponente del mundo',
    year: 2024,
    category: 'GRAND_TOURER',
    hp: 585,
    accel: '4.5 S',
    topSpeed: 250,
    engine: 'Twin Electric Powertrain 900 Nm',
    transmission: 'Direct Drive',
    drive: 'Tracción Total AWD',
    pricePerDay: 3500,
    securityDeposit: 10000,
    watermarkText: 'ROLLS-ROYCE',
    owner: {
      name: 'Lucas B.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      trips: 11,
      location: 'Madrid / Puerto Banús'
    },
    colorName: 'Anthracite Dark',
    colorHex: '#1F2937',
    image: '/supercars/brands/rolls-royce.png',
    badgeText: 'ULTRA LUXURY'
  },
  {
    id: 'chevrolet',
    slug: 'chevrolet-corvette-z06',
    name: 'CORVETTE Z06',
    brand: 'CHEVROLET',
    model: 'Corvette Z06 5.5L Flat-Plane',
    tagline: 'El V8 atmosférico de producción más potente del mundo: 670 CV a 8.600 rpm',
    year: 2024,
    category: 'TRACK_SPECIAL',
    hp: 670,
    accel: '2.6 S',
    topSpeed: 314,
    engine: '5.5L LT6 V8 Flat-Plane Crank',
    transmission: 'Tremec 8 Vel Doble Embrague',
    drive: 'Propulsión Trasera RWD',
    pricePerDay: 1950,
    securityDeposit: 5500,
    watermarkText: 'CHEVROLET',
    owner: {
      name: 'Sergio L.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.98,
      trips: 14,
      location: 'Madrid / Las Rozas'
    },
    colorName: 'Accelerate Yellow',
    colorHex: '#CA8A04',
    image: '/supercars/brands/chevrolet.png',
    badgeText: 'LT6 FLAT-PLANE'
  },
  {
    id: 'dodge',
    slug: 'dodge-challenger-srt-demon',
    name: 'SRT HELLCAT',
    brand: 'DODGE',
    model: 'Challenger SRT Super Stock Hellcat',
    tagline: 'Puro músculo americano: 807 CV sobrealimentados por compresor volumétrico',
    year: 2024,
    category: 'SUPERCAR',
    hp: 807,
    accel: '3.2 S',
    topSpeed: 326,
    engine: '6.2L HEMI V8 Supercharged',
    transmission: 'TorqueFlite 8 Velocidades',
    drive: 'Propulsión Trasera RWD',
    pricePerDay: 1800,
    securityDeposit: 5000,
    watermarkText: 'DODGE',
    owner: {
      name: 'Manuel K.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.97,
      trips: 20,
      location: 'Alicante / Benidorm'
    },
    colorName: 'Plum Crazy Dark',
    colorHex: '#581C87',
    image: '/supercars/brands/dodge.png',
    badgeText: 'HEMI SUPERCHARGED'
  },
  {
    id: 'ford',
    slug: 'ford-gt-carbon-edition',
    name: 'FORD GT',
    brand: 'FORD',
    model: 'Ford GT Carbon Series EcoBoost',
    tagline: 'Superdeportivo ganador de Le Mans con chasis monocasco de fibra de carbono',
    year: 2024,
    category: 'HYPERCAR',
    hp: 660,
    accel: '2.9 S',
    topSpeed: 348,
    engine: '3.5L Twin-Turbo EcoBoost V6',
    transmission: 'Getrag 7 Vel Doble Embrague',
    drive: 'Propulsión Trasera RWD',
    pricePerDay: 2800,
    securityDeposit: 8500,
    watermarkText: 'FORD',
    owner: {
      name: 'Adrián R.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      trips: 12,
      location: 'Barcelona / Sitges'
    },
    colorName: 'Liquid Red',
    colorHex: '#991B1B',
    image: '/supercars/brands/ford.png',
    badgeText: 'LE MANS DNA'
  }
];

interface SupercarConfiguratorHeroProps {
  onSelectBrand?: (brand: string) => void;
}

export default function SupercarConfiguratorHero({ onSelectBrand }: SupercarConfiguratorHeroProps = {}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const total = FEATURED_FLEET.length;
  const currentCar = FEATURED_FLEET[selectedIndex];

  const handleSelectCar = (index: number) => {
    setSelectedIndex(index);
    if (onSelectBrand) {
      onSelectBrand(FEATURED_FLEET[index].brand);
    }
  };

  const prevCar = () => {
    playPaddleShiftSound('prev');
    const newIdx = selectedIndex === 0 ? total - 1 : selectedIndex - 1;
    handleSelectCar(newIdx);
  };

  const nextCar = () => {
    playPaddleShiftSound('next');
    const newIdx = selectedIndex === total - 1 ? 0 : selectedIndex + 1;
    handleSelectCar(newIdx);
  };

  // Soporte para gestos táctiles (Swipe en móvil)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextCar();
      else prevCar();
    }
    setTouchStartX(null);
  };

  const getFontSize = (text: string) => {
    const len = text.length;
    if (len <= 4) return 'text-[20vw] sm:text-[18vw]';
    if (len <= 7) return 'text-[14vw] sm:text-[14vw]';
    if (len <= 9) return 'text-[11vw] sm:text-[11vw]';
    if (len <= 11) return 'text-[9vw] sm:text-[9.5vw]';
    return 'text-[7.5vw] sm:text-[8vw]';
  };

  return (
    <section className="relative w-full bg-white text-black overflow-hidden flex flex-col items-center justify-center selection:bg-black selection:text-white pt-1 sm:pt-6 pb-2 sm:pb-6 min-h-[42vh] sm:min-h-[70vh] md:min-h-[75vh]">
      
      {/* 1. MARCA EN EL FONDO (Tipografía sutil y ajustada a móvil) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 px-2 sm:px-8">
        <span 
          className={`font-black uppercase tracking-tight text-gray-400/70 sm:text-gray-400/85 select-none leading-none font-sans transition-all duration-700 text-center whitespace-nowrap -translate-y-4 sm:-translate-y-16 ${getFontSize(currentCar.watermarkText)}`}
        >
          {currentCar.watermarkText}
        </span>
      </div>

      {/* H1 para SEO accesible sin invadir el diseño limpio */}
      <h1 className="sr-only">
        GT Cars Premium & GTR Cars — Alquiler de Superdeportivos en Canarias, Madrid, Barcelona y Londres
      </h1>

      {/* 2. CENTRO: CARRUSEL TIPO RUEDA DE APPLE / LIBRO 3D CON SOPORTE SWIPE */}
      <div 
        className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-center overflow-hidden sm:overflow-visible touch-pan-y my-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Flecha izquierda */}
        <button
          onClick={prevCar}
          aria-label="Coche anterior"
          className="absolute left-1 sm:left-6 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-black hover:text-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-sm group"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-white transition-colors" />
        </button>

        {/* Contenedor 3D de coches (centro nítido, laterales con desplazamiento optimizado para móvil) */}
        <div 
          className="relative w-full max-w-4xl h-[160px] sm:h-[320px] md:h-[400px] flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          {FEATURED_FLEET.map((car, idx) => {
            // Calcular distancia circular respecto al seleccionado
            let diff = idx - selectedIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isCenter = diff === 0;
            const isNear = Math.abs(diff) <= 2;

            if (!isNear) return null;

            // En móvil desplazamos un poco más lateralmente para dar espacio al centro
            const translateX = diff * 62; 
            const scale = isCenter ? 1 : Math.max(0.65, 1 - Math.abs(diff) * 0.25);
            const rotateY = diff * -25;
            const blur = isCenter ? 0 : Math.abs(diff) * 4;
            const opacity = isCenter ? 1 : Math.max(0.2, 0.65 - Math.abs(diff) * 0.25);
            const zIndex = isCenter ? 20 : 10 - Math.abs(diff);

            return (
              <div
                key={car.id}
                onClick={() => handleSelectCar(idx)}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out select-none ${
                  isCenter ? 'cursor-default' : 'cursor-pointer'
                }`}
                style={{
                  transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                  filter: `blur(${blur}px)`,
                  opacity,
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="relative w-full h-full max-w-[82%] sm:max-w-3xl flex items-center justify-center">
                  <Image
                    src={car.image}
                    alt={car.brand}
                    fill
                    sizes="(max-width: 768px) 85vw, 850px"
                    priority={isCenter}
                    className="object-contain filter drop-shadow-[0_14px_18px_rgba(0,0,0,0.12)] transition-transform duration-700"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Flecha derecha */}
        <button
          onClick={nextCar}
          aria-label="Siguiente coche"
          className="absolute right-1 sm:right-6 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-black hover:text-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-sm group"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-white transition-colors" />
        </button>

      </div>

      {/* 3. SELECTOR ESTILO PORSCHE // CARRUSEL 3D SINCRONIZADO CON LOS COCHES */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 mt-0 sm:mt-2 flex items-center justify-center">
        {/* Cápsula de navegación Porsche */}
        <div className="relative w-full max-w-sm sm:max-w-md h-9 sm:h-12 bg-gray-100/95 backdrop-blur-md rounded-full border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center">
          
          {FEATURED_FLEET.map((fCar, idx) => {
            let diff = idx - selectedIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isCenter = diff === 0;
            const isVisible = Math.abs(diff) <= 2;

            if (!isVisible) return null;

            // En móvil cada paso desplaza 100px, en desktop 115px
            const translateX = diff * 102;
            const scale = isCenter ? 1 : Math.max(0.72, 1 - Math.abs(diff) * 0.18);
            const opacity = isCenter ? 1 : Math.max(0.3, 0.7 - Math.abs(diff) * 0.25);
            const zIndex = isCenter ? 20 : 10 - Math.abs(diff);

            return (
              <button
                key={fCar.id}
                onClick={() => {
                  playSoftTickSound();
                  handleSelectCar(idx);
                }}
                className={`absolute px-3.5 sm:px-5 py-1 sm:py-2 text-[9px] sm:text-xs font-mono uppercase tracking-wider transition-all duration-700 ease-out rounded-full whitespace-nowrap cursor-pointer select-none ${
                  isCenter
                    ? 'bg-black text-white font-bold shadow-md'
                    : 'text-gray-600 hover:text-black hover:bg-gray-200/60 font-semibold'
                }`}
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
              >
                {fCar.brand}
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
}

