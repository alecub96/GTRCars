'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MainSearchWidget from '@/components/MainSearchWidget';
import { CANARY_ISLANDS } from '@/lib/pricing';
import { Star, ChevronRight, MapPin, ShieldCheck, HeartHandshake, KeyRound } from 'lucide-react';
import VehicleViewTracker from '@/components/VehicleViewTracker';
import Image from 'next/image';

const ISLAND_HERO_IMAGES: Record<string, string> = {
  'Gran Canaria': '/Islas/gran%20canaria.webp',
  'Tenerife': '/Islas/Tenerife.webp',
  'Lanzarote': '/Islas/lanzarote.webp',
  'Fuerteventura': '/Islas/fuerteventura.webp',
  'La Palma': '/Islas/la%20palma.webp',
  'La Gomera': '/Islas/la%20gomera.webp',
  'El Hierro': '/Islas/el%20hierro.webp',
  'La Graciosa': '/Islas/la%20graciosa.webp',
};
interface HeroSectionProps {
  initialVehicles: any[];
}

export default function HomeClientHero({ initialVehicles }: HeroSectionProps) {
  const [selectedIsland, setSelectedIsland] = useState<string>('Gran Canaria');
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => setRole(data.user?.role || 'ANONYMOUS'))
      .catch(() => setRole('ANONYMOUS'));
  }, []);

  const currentHeroImage = ISLAND_HERO_IMAGES[selectedIsland] || ISLAND_HERO_IMAGES['Gran Canaria'];

  return (
    <div className="min-h-screen bg-[#F4EFE7] text-[#13322E] font-sans antialiased selection:bg-[#b88a55] selection:text-white">
      <Navbar />

      {/* 1. HERO CON CAMBIO DINÁMICO DE IMAGEN DE FONDO SEGÚN LA ISLA */}
      <section className="relative z-20 min-h-[85vh] flex items-center justify-center overflow-visible px-4 py-16 transition-all duration-700">
        <div className="absolute inset-0 z-0">
          <img
            key={selectedIsland}
            src={currentHeroImage}
            alt={`Camper viajando por ${selectedIsland}`}
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full scale-[0.78] object-contain object-center brightness-[0.82] transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F6F2] via-black/20 to-black/50" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-[0.25em] mb-6 border border-white/30">
            CANARIAS SOBRE RUEDAS
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-4">
            Donde empieza <br />
            <span className="italic font-normal font-serif text-[#d2a36e]">el viaje.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Libertad absoluta para despertar frente al Atlántico en <strong className="font-extrabold text-white">{selectedIsland}</strong>.
          </p>

          {role === 'OWNER' ? (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-white/30 bg-[#13322E]/80 p-6 text-center text-white shadow-2xl backdrop-blur-md">
              <p className="text-sm font-medium text-white/85">Estás en modo propietario. Gestiona tu flota y tus reservas desde tu panel.</p>
              <Link href="/propietario" className="rounded-full bg-[#16B8AA] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#0F766E]">Ir al panel de propietario</Link>
            </div>
          ) : (
            <MainSearchWidget
              selectedIsland={selectedIsland}
              onIslandChange={(newIsland) => setSelectedIsland(newIsland)}
            />
          )}
        </div>
      </section>

      {/* 2. CAMPERS DESTACADAS CON DISEÑO LIMPIO */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D97706]">VEHÍCULOS VERIFICADOS</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#13322E] mt-1">Campers y Autocaravanas Destacadas</h2>
          </div>
          {role !== 'OWNER' && <Link
            href="/buscar"
            className="hidden sm:flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#16B8AA] hover:text-[#0F766E] transition-colors"
          >
            <span>Ver todas las campers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initialVehicles.map((vehicle: any) => {
            const avgRating =
              vehicle.reviews?.length > 0
                ? vehicle.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / vehicle.reviews.length
                : 5.0;

            return (
              <Link
                key={vehicle.id}
                href={`/camper/${vehicle.slug}`}
                className="group bg-[#F4F9F8] rounded-3xl overflow-hidden border border-[#E9E1D2] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <VehicleViewTracker vehicleId={vehicle.id} event="IMPRESSION" />
                <div className="p-5">
                  <div className="relative h-60 rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={vehicle.photos[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800'}
                      alt={vehicle.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#16B8AA] tracking-wider">
                      {vehicle.island}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6B726E] mb-2 font-bold">
                    <span>{vehicle.brand} {vehicle.model}</span>
                    <div className="flex items-center space-x-1 text-[#13322E]">
                      <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                      <span>{avgRating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#13322E] group-hover:text-[#16B8AA] transition-colors line-clamp-1 mb-2">
                    {vehicle.title}
                  </h3>

                  <p className="text-xs text-[#6B726E] line-clamp-2 font-medium leading-relaxed mb-4">
                    {vehicle.description}
                  </p>
                </div>

                <div className="p-5 pt-0 border-t border-[#E9E1D2]/80 flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-[#6B726E]">Hasta {vehicle.passengers} personas</span>
                  <div className="text-right">
                    <span className="text-xs text-[#6B726E] font-medium">Desde </span>
                    <span className="font-serif text-xl font-bold text-[#16B8AA]">{vehicle.basePricePerDay}€</span>
                    <span className="text-xs text-[#6B726E] font-medium"> /día</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. EXPLORAR POR ISLA */}
      <section className="py-16 bg-white border-t border-[#E9E1D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#D97706]">DESTINOS AUTÉNTICOS</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#13322E] mt-1">Explora las 8 Islas Canarias</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {CANARY_ISLANDS.map((isla) => (
              <button
                key={isla.id}
                onClick={() => setSelectedIsland(isla.name)}
                className={`group relative h-40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border bg-[#F7F6F2] text-left sm:h-48 ${
                  selectedIsland === isla.name ? 'ring-4 ring-[#16B8AA] border-transparent' : 'border-[#E9E1D2]'
                }`}
              >
                <img
                  src={ISLAND_HERO_IMAGES[isla.name] || ISLAND_HERO_IMAGES['Gran Canaria']}
                  alt={`Alquiler camper en ${isla.name}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain p-4 sm:p-5 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center space-x-1.5 text-xs text-[#F2CC8F] font-bold mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isla.airport}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold tracking-tight">{isla.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN PROPIETARIOS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#13322E] rounded-3xl p-8 sm:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl z-10">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#16B8AA]">Propietarios en Canarias</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mt-2 mb-6">
              ¿Tienes una camper en las islas?
            </h2>
            <p className="text-white/80 font-medium text-base sm:text-lg mb-8 leading-relaxed">
              Rentabiliza tu furgoneta o autocaravana de forma totalmente segura cuando no la estés utilizando. Cubrimos el seguro a todo riesgo y la verificación de viajeros.
            </p>
            <Link
              href="/publicar-camper"
              className="inline-flex items-center space-x-3 bg-[#16B8AA] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-lg"
            >
              <span>PUBLICAR MI CAMPER</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-10 md:mt-0 relative w-full md:w-1/2 h-64 md:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800"
              alt="Propietario de camper entregando llaves"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#13322E] text-white pt-16 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <span className="font-serif text-3xl font-medium tracking-tight text-white block">vaneando<span className="text-[#b88a55]">.</span></span>
            <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-[#16B8AA] block font-black mt-0.5 mb-4">
              Canarias
            </span>
            <p className="text-xs text-white/60 font-medium leading-relaxed">
              La plataforma de alquiler de campers entre particulares y profesionales en las 8 Islas Canarias.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#16B8AA] mb-4">Ubicaciones</h4>
            <ul className="space-y-2 text-xs text-white/70 font-medium">
              <li><Link href="/alquiler-camper/gran-canaria" className="hover:text-white">Gran Canaria</Link></li>
              <li><Link href="/alquiler-camper/tenerife" className="hover:text-white">Tenerife</Link></li>
              <li><Link href="/alquiler-camper/lanzarote" className="hover:text-white">Lanzarote</Link></li>
              <li><Link href="/alquiler-camper/fuerteventura" className="hover:text-white">Fuerteventura</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#16B8AA] mb-4">Información</h4>
            <ul className="space-y-2 text-xs text-white/70 font-medium">
              <li><Link href="/terminos" className="hover:text-white">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-white">Política de Privacidad</Link></li>
              <li><Link href="/seguridad" className="hover:text-white">Seguros & Coberturas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#16B8AA] mb-4">Contacto</h4>
            <p className="text-xs text-white/70 font-medium mb-2">Atención 24/7 en Canarias</p>
            <p className="text-sm font-serif font-bold text-white">contacto@vaneando.com</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 text-center text-xs text-white/40 font-medium">
          © 2026 Vaneando. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
