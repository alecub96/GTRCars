'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Gauge, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Compass, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Sliders,
  Volume2,
  KeyRound,
  Shield,
  Award,
  Star
} from 'lucide-react';

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
    id: '1',
    slug: 'lamborghini-revuelto-v12-hybrid',
    name: 'Lamborghini Revuelto',
    brand: 'LAMBORGHINI',
    model: 'Revuelto V12 HPEV',
    tagline: 'From Now On: 1015 CV V12 Híbrido Enchufable',
    year: 2025,
    category: 'HYPERCAR',
    hp: 1015,
    accel: '2.5s',
    topSpeed: 350,
    engine: '6.5L V12 + 3 Motores Eléctricos',
    transmission: '8 velocidades doble embrague',
    drive: 'Tracción Total AWD',
    pricePerDay: 3200,
    securityDeposit: 9000,
    owner: {
      name: 'Carlos M.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      trips: 18,
      location: 'Madrid / Marbella'
    },
    colorName: 'Arancio Apodis',
    colorHex: '#FF5722',
    image: '/supercars/lambo-revuelto.jpg',
    badgeText: 'HYPERCAR V12'
  },
  {
    id: '2',
    slug: 'ferrari-sf90-stradale-assetto-fiorano',
    name: 'Ferrari SF90 Stradale',
    brand: 'FERRARI',
    model: 'SF90 Assetto Fiorano',
    tagline: 'Beyond Imagination: 1000 CV de pura precisión de Maranello',
    year: 2024,
    category: 'HYPERCAR',
    hp: 1000,
    accel: '2.5s',
    topSpeed: 340,
    engine: '4.0L V8 Bi-Turbo PHEV',
    transmission: 'F1 Doble Embrague 8 Vel',
    drive: 'e-4WD',
    pricePerDay: 2900,
    securityDeposit: 8000,
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
    image: '/supercars/ferrari-sf90.jpg',
    badgeText: 'ASSETTO FIORANO'
  },
  {
    id: '3',
    slug: 'porsche-911-gt3-rs-weissach',
    name: 'Porsche 911 GT3 RS',
    brand: 'PORSCHE',
    model: '992 GT3 RS Weissach Package',
    tagline: 'Aerodinámica de competición DRS y atmosférico 9.000 rpm',
    year: 2024,
    category: 'TRACK_SPECIAL',
    hp: 525,
    accel: '3.2s',
    topSpeed: 296,
    engine: '4.0L Boxer 6 Atmosférico',
    transmission: 'PDK 7 Velocidades',
    drive: 'Propulsión Trasera RWD',
    pricePerDay: 1850,
    securityDeposit: 5000,
    owner: {
      name: 'Marcos R.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      trips: 31,
      location: 'Madrid / Circuito Jarama'
    },
    colorName: 'Ice Grey Metallic',
    colorHex: '#BAC4C8',
    image: '/supercars/porsche-gt3rs.jpg',
    badgeText: 'WEISSACH DRS'
  },
  {
    id: '4',
    slug: 'mclaren-765lt-spider-carbon',
    name: 'McLaren 765LT Spider',
    brand: 'MCLAREN',
    model: '765LT MSO Carbon',
    tagline: 'Longtail: ligereza extrema y aceleración salvaje al aire libre',
    year: 2024,
    category: 'SUPERCAR',
    hp: 765,
    accel: '2.8s',
    topSpeed: 330,
    engine: '4.0L V8 Twin-Turbo',
    transmission: 'SSG 7 Velocidades',
    drive: 'Propulsión RWD',
    pricePerDay: 2400,
    securityDeposit: 7500,
    owner: {
      name: 'Alejandro G.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      trips: 15,
      location: 'Tenerife / Las Palmas'
    },
    colorName: 'Papaya Spark',
    colorHex: '#FF8000',
    image: '/supercars/mclaren-765lt.jpg',
    badgeText: 'MSO 1 DE 765'
  }
];

export default function SupercarConfiguratorHero() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedDelivery, setSelectedDelivery] = useState<'airport' | 'villa' | 'circuit'>('villa');
  const [selectedMileage, setSelectedMileage] = useState<'150km' | '300km' | 'unlimited'>('150km');
  const [soundActive, setSoundActive] = useState(false);

  const car = FEATURED_FLEET[selectedIndex];

  return (
    <div className="relative min-h-[92vh] w-full bg-[#050505] text-[#F5F5F5] overflow-hidden flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
      {/* BACKGROUND SPOTLIGHT & GRID EFFECT (Lamborghini Stage) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Radial stage lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1200px] h-[550px] bg-gradient-to-b from-[#D4AF37]/15 via-transparent to-transparent blur-[140px] rounded-full" />
        <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent" />
        
        {/* Fine geometric backdrop lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#151515_1px,transparent_1px),linear-gradient(to_bottom,#151515_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* TOP CONFIGURATOR HUD BAR */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3" /> P2P HYPERCAR VAULT
            </span>
            <span className="text-white/40 text-xs font-mono">|</span>
            <span className="text-xs text-white/70 font-mono tracking-wider uppercase">
              ALQUILER DIRECTO ENTRE PARTICULARES
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono">
            <span className="text-white/50 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Fianza Custodiada
            </span>
            <span className="text-white/50 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D4AF37]" /> Propietarios VIP Verificados
            </span>
          </div>
        </div>
      </div>

      {/* MAIN STAGE / CONFIGURATOR VIEW */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT: SPECS & BADGE */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                {car.brand}
              </span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs font-mono text-white/60 tracking-wider">
                {car.badgeText}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
              {car.name}
            </h1>
            
            <p className="mt-2 text-xs sm:text-sm text-white/60 font-light leading-relaxed">
              {car.tagline}
            </p>
          </div>

          {/* TELEMETRY HUD TILES */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="bg-[#111111]/80 border border-white/10 rounded-sm p-3 backdrop-blur-md hover:border-[#D4AF37]/50 transition-colors">
              <span className="text-[10px] font-mono uppercase text-white/50 block">POTENCIA</span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-xl sm:text-2xl font-black text-white">{car.hp}</span>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">CV</span>
              </div>
            </div>

            <div className="bg-[#111111]/80 border border-white/10 rounded-sm p-3 backdrop-blur-md hover:border-[#D4AF37]/50 transition-colors">
              <span className="text-[10px] font-mono uppercase text-white/50 block">0 - 100 KM/H</span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-xl sm:text-2xl font-black text-white">{car.accel}</span>
              </div>
            </div>

            <div className="bg-[#111111]/80 border border-white/10 rounded-sm p-3 backdrop-blur-md hover:border-[#D4AF37]/50 transition-colors">
              <span className="text-[10px] font-mono uppercase text-white/50 block">V. MÁXIMA</span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-xl sm:text-2xl font-black text-white">{car.topSpeed}</span>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">KM/H</span>
              </div>
            </div>
          </div>

          {/* MOTOR & TRACCIÓN INFO */}
          <div className="space-y-1.5 text-xs font-mono text-white/70 bg-[#0C0C0C] border border-white/5 p-3 rounded-sm">
            <div className="flex justify-between">
              <span className="text-white/40">MOTORIZACIÓN:</span>
              <span className="text-white font-medium">{car.engine}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">TRANSMISIÓN:</span>
              <span className="text-white font-medium">{car.transmission}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">TRACCIÓN:</span>
              <span className="text-white font-medium">{car.drive}</span>
            </div>
          </div>

          {/* PROPIETARIO CARD */}
          <div className="flex items-center justify-between p-3.5 bg-[#121212]/90 border border-white/10 rounded-sm backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <img 
                src={car.owner.avatar} 
                alt={car.owner.name}
                className="w-10 h-10 rounded-full border border-[#D4AF37]/60 object-cover" 
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-white">{car.owner.name}</span>
                  {car.owner.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/20" />
                  )}
                </div>
                <span className="text-[10px] text-white/50 font-mono block">
                  {car.owner.location} • {car.owner.trips} alquileres
                </span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[9px] font-mono text-emerald-400 block uppercase tracking-wider font-bold">
                DISPONIBLE
              </span>
              <span className="text-[11px] font-mono text-white/60 flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                {car.owner.rating}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER / RIGHT: 3D STUDIO VISUALIZER */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center relative order-1 lg:order-2">
          {/* STAGE LIGHT EMITTER */}
          <div className="relative w-full max-w-3xl aspect-[16/9] flex items-center justify-center">
            <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent opacity-50 rounded-full scale-110" />
            
            <Image
              src={car.image}
              alt={car.name}
              fill
              priority
              className="object-cover rounded-xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] hover:scale-[1.01] transition-transform duration-700"
            />

            {/* LIVE WATERMARK / BADGE */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono uppercase tracking-widest">
                STAGE 01 // HIGH-RESOLUTION STUDIO
              </span>
            </div>

            {/* SOUND TRIGGER SIMULATOR */}
            <button
              onClick={() => setSoundActive(!soundActive)}
              className="absolute bottom-4 right-4 z-20 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{soundActive ? 'V12 EXHAUST ACTIVE' : 'TEST SOUND'}</span>
            </button>
          </div>

          {/* VEHICLE SWITCHER DOCK (Configurator Style) */}
          <div className="w-full max-w-3xl mt-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
                SELECCIONA SUPERDEPORTIVO DE LA COMUNIDAD:
              </span>
              <span className="text-[11px] font-mono text-[#D4AF37]">
                0{selectedIndex + 1} / 0{FEATURED_FLEET.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {FEATURED_FLEET.map((fCar, idx) => (
                <button
                  key={fCar.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`p-3 text-left transition-all rounded-sm border cursor-pointer ${
                    selectedIndex === idx 
                      ? 'bg-[#181818] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                      : 'bg-[#0E0E0E] border-white/10 hover:border-white/30 text-white/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#D4AF37]">
                      {fCar.brand}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fCar.colorHex }} />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{fCar.name}</h4>
                  <span className="text-[10px] font-mono text-white/40 block mt-0.5">
                    Desde {fCar.pricePerDay}€ / día
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR (Booking & Delivery Options) */}
      <div className="relative z-20 border-t border-white/10 bg-[#090909]/95 backdrop-blur-xl py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Quick options */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest hidden sm:inline-block">
              ENTREGA VIP:
            </span>
            <button
              onClick={() => setSelectedDelivery('villa')}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-sm border transition-all cursor-pointer ${
                selectedDelivery === 'villa'
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-black/60 text-white/60 border-white/10 hover:border-white/30'
              }`}
            >
              Villa / Residencia Privada
            </button>
            <button
              onClick={() => setSelectedDelivery('airport')}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-sm border transition-all cursor-pointer ${
                selectedDelivery === 'airport'
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-black/60 text-white/60 border-white/10 hover:border-white/30'
              }`}
            >
              Terminal VIP Aeropuerto
            </button>
            <button
              onClick={() => setSelectedDelivery('circuit')}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-sm border transition-all cursor-pointer ${
                selectedDelivery === 'circuit'
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-black/60 text-white/60 border-white/10 hover:border-white/30'
              }`}
            >
              Paddock Circuito
            </button>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between w-full md:w-auto gap-6">
            <div className="text-right">
              <span className="text-[10px] font-mono text-white/50 uppercase block">TARIFA PROPIETARIO</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-mono">{car.pricePerDay}€</span>
                <span className="text-xs text-white/60 font-mono">/ DÍA</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={`/buscar?supercar=${car.slug}`}
                className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#F5C542] text-black font-black text-xs font-mono uppercase tracking-[0.15em] transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 flex items-center gap-2"
              >
                <span>SOLICITAR RESERVA</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
