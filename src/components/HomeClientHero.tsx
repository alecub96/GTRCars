'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MainSearchWidget from '@/components/MainSearchWidget';
import VehicleTypeSlider from '@/components/VehicleTypeSlider';
import { CANARY_ISLANDS } from '@/lib/pricing';
import { Star, ChevronRight, MapPin, ShieldCheck, HeartHandshake, KeyRound } from 'lucide-react';
import VehicleViewTracker from '@/components/VehicleViewTracker';
import Image from 'next/image';

const ISLAND_HERO_IMAGES: Record<string, string> = {
  'Gran Canaria': '/Islas/gran%20canaria.webp',
  'Tenerife': '/Islas/tenerife.webp',
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
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => setRole(data.user?.role || 'ANONYMOUS'))
      .catch(() => setRole('ANONYMOUS'));
  }, []);

  const currentHeroImage = ISLAND_HERO_IMAGES[selectedIsland] || ISLAND_HERO_IMAGES['Gran Canaria'];

  return (
    <div className="min-h-screen bg-[#F4EFE7] text-[#13322E] font-sans antialiased selection:bg-[#b88a55] selection:text-white overflow-x-hidden w-full max-w-full">
      <Navbar />

      {/* 1. HERO CON CAMBIO DINÁMICO DE IMAGEN DE FONDO SEGÚN LA ISLA */}
      <section className="relative z-20 min-h-[85vh] flex items-center justify-center overflow-hidden px-3 sm:px-4 py-10 transition-all duration-700 w-full max-w-full">
        <div className="absolute inset-0 z-0">
          <img
            key={selectedIsland}
            src={currentHeroImage}
            alt={`Camper viajando por ${selectedIsland}`}
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 m-auto max-h-[88%] max-w-[88%] scale-[0.88] sm:scale-[0.92] object-contain object-center brightness-[0.88] transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F6F2] via-black/25 to-black/55" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-2 sm:px-4 -mt-4 w-full max-w-full">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-[0.25em] mb-4 border border-white/30 shadow-md">
            CANARIAS SOBRE RUEDAS
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
            Donde empieza <br />
            <span className="italic font-semibold font-serif text-[#F2CC8F] drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">el viaje.</span>
          </h1>

          <p className="mb-6 text-xs sm:text-base text-white/95 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] px-2">
            Libertad absoluta para despertar frente al Atlántico en <strong className="font-extrabold text-[#F2CC8F] underline decoration-[#16B8AA] decoration-2 underline-offset-4">{selectedIsland}</strong>.
          </p>

          {role === 'OWNER' ? (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-white/30 bg-[#13322E]/80 p-6 text-center text-white shadow-2xl backdrop-blur-md">
              <p className="text-sm font-medium text-white/85">Estás en modo propietario. Gestiona tu flota y tus reservas desde tu panel.</p>
              <Link href="/propietario" className="rounded-full bg-[#16B8AA] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#0F766E]">Ir al panel de propietario</Link>
            </div>
          ) : (
            <div className="space-y-4 relative">
              <div className="flex justify-center">
                <Link
                  href={`/mapa?island=${encodeURIComponent(selectedIsland)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#13322E]/80 hover:bg-[#16B8AA] backdrop-blur-md text-white text-xs font-black uppercase tracking-wider transition-all border border-white/30 shadow-xl hover:scale-105"
                >
                  <span>🗺️ Ver Mapa Interactivo de {selectedIsland}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Pines & Precios</span>
                </Link>
              </div>

              <MainSearchWidget
                selectedIsland={selectedIsland}
                onIslandChange={(newIsland) => setSelectedIsland(newIsland)}
                selectedVehicleType={selectedVehicleType}
                onVehicleTypeChange={(newType) => setSelectedVehicleType(newType)}
              />
              <div className="pt-2">
                <VehicleTypeSlider
                  selectedType={selectedVehicleType}
                  onSelectType={(newType) => setSelectedVehicleType(newType)}
                  showAllOption={true}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. BARRA DE CONFIANZA Y VALORACIÓN (ESTILO YESCAPA) */}
      <section className="bg-white border-y border-[#E9E1D2] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center space-x-3 mx-auto sm:mx-0">
            <div className="flex -space-x-2">
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Viajero Vaneando" width={40} height={40} loading="lazy" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Viajero Vaneando" width={40} height={40} loading="lazy" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Viajero Vaneando" width={40} height={40} loading="lazy" />
            </div>
            <div>
              <div className="flex items-center space-x-1 justify-center sm:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
                ))}
                <span className="font-bold text-sm text-[#13322E] ml-1">4.9 / 5</span>
              </div>
              <p className="text-xs text-[#6B726E] font-medium">Basado en opiniones reales en las Islas Canarias</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-[#13322E] mx-auto sm:mx-0">
            <span className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-[#16B8AA]" /><span>0% Comisiones Ocultas</span></span>
            <span className="flex items-center space-x-2"><HeartHandshake className="w-4 h-4 text-[#16B8AA]" /><span>Directo con Propietarios Locales</span></span>
            <span className="flex items-center space-x-2"><KeyRound className="w-4 h-4 text-[#16B8AA]" /><span>Entrega en Aeropuerto</span></span>
          </div>
        </div>
      </section>

      {/* 3. CAMPERS DESTACADAS CON DISEÑO LIMPIO */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#13322E]">Campers y Autocaravanas Destacadas en Canarias</h2>
            <p className="text-xs text-[#6B726E] font-medium mt-1">Vehículos revisados, equipados con cocina y fianza gestionada directamente entre particulares.</p>
          </div>
          {role !== 'OWNER' && (
            <Link
              href="/buscar"
              className="hidden sm:inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest bg-[#16B8AA] text-white px-5 py-3 rounded-full hover:bg-[#0F766E] transition-all shadow-md mt-4 sm:mt-0"
            >
              <span>Ver todas las campers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
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

      {/* 4. GUÍA DE SELECCIÓN DE VEHÍCULO (ELEGIR EL VEHÍCULO ADECUADO - ESTILO YESCAPA) */}
      <section className="py-20 bg-white border-t border-[#E9E1D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#16B8AA]">Guía de Elección</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#13322E] mt-2 mb-4">
              Elegir el vehículo adecuado para tu road trip
            </h2>
            <p className="text-sm sm:text-base text-[#6B726E] font-medium leading-relaxed">
              ¿Eres de furgoneta compacta, camper gran volumen, autocaravana familiar o 4x4 con tienda de techo? Te explicamos las ventajas de cada opción para recorrer Canarias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F7F6F2] p-8 rounded-3xl border border-[#E9E1D2] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#16B8AA]">Ágil & Discreta</span>
                <h3 className="font-serif text-2xl font-bold text-[#13322E] mt-2 mb-3">Furgoneta Camper Pequeña</h3>
                <p className="text-xs text-[#6B726E] font-medium leading-relaxed mb-6">
                  Fácil de aparcar en cualquier cala o pueblo costero. Ideal para parejas y amantes del surf que buscan máxima agilidad de conducción por carreteras de montaña.
                </p>
              </div>
              <Link href="/buscar?vehicleType=CAMPER" className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#16B8AA] hover:underline">
                Alquilar Camper Pequeña →
              </Link>
            </div>

            <div className="bg-[#F7F6F2] p-8 rounded-3xl border border-[#E9E1D2] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#D97706]">Autónoma con Ducha</span>
                <h3 className="font-serif text-2xl font-bold text-[#13322E] mt-2 mb-3">Camper Gran Volumen</h3>
                <p className="text-xs text-[#6B726E] font-medium leading-relaxed mb-6">
                  Perfecta combinación entre practicidad y espacio. Incluye ducha interior, baño químico, cocina completa y altura para ponerse de pie.
                </p>
              </div>
              <Link href="/buscar?vehicleType=CAMPER" className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#D97706] hover:underline">
                Alquilar Gran Volumen →
              </Link>
            </div>

            <div className="bg-[#F7F6F2] p-8 rounded-3xl border border-[#E9E1D2] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#13322E]">Confort Familiar</span>
                <h3 className="font-serif text-2xl font-bold text-[#13322E] mt-2 mb-3">Autocaravana Familiar</h3>
                <p className="text-xs text-[#6B726E] font-medium leading-relaxed mb-6">
                  Máximo confort para familias de 4 a 6 personas. Camas fijas, amplio salón, garaje para equipaje y máxima independencia en ruta.
                </p>
              </div>
              <Link href="/buscar?vehicleType=AUTOCARAVANA" className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#13322E] hover:underline">
                Alquilar Autocaravana →
              </Link>
            </div>

            <div className="bg-[#F7F6F2] p-8 rounded-3xl border border-[#E9E1D2] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#16B8AA]">Aventura Total</span>
                <h3 className="font-serif text-2xl font-bold text-[#13322E] mt-2 mb-3">4x4 con Tienda de Techo</h3>
                <p className="text-xs text-[#6B726E] font-medium leading-relaxed mb-6">
                  Para quienes quieren llegar a los rincones más inaccesibles y pistas de tierra de Fuerteventura o Lanzarote con tracción a las cuatro ruedas.
                </p>
              </div>
              <Link href="/buscar?vehicleType=FOUR_BY_FOUR" className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#16B8AA] hover:underline">
                Alquilar 4x4 Camperizado →
              </Link>
            </div>

            <div className="bg-[#F7F6F2] p-8 rounded-3xl border border-[#E9E1D2] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#D97706]">Estancia Fija</span>
                <h3 className="font-serif text-2xl font-bold text-[#13322E] mt-2 mb-3">Caravana Tradicional</h3>
                <p className="text-xs text-[#6B726E] font-medium leading-relaxed mb-6">
                  Engánchala a tu vehículo o solicítala instalada en tu camping favorito de las islas para disfrutar de unas vacaciones cómodas.
                </p>
              </div>
              <Link href="/buscar?vehicleType=CARAVANA" className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#D97706] hover:underline">
                Alquilar Caravana →
              </Link>
            </div>

            <div className="bg-[#F7F6F2] p-8 rounded-3xl border border-[#E9E1D2] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#13322E]">Experiencia Náutica</span>
                <h3 className="font-serif text-2xl font-bold text-[#13322E] mt-2 mb-3">Velero o Barco Habitable</h3>
                <p className="text-xs text-[#6B726E] font-medium leading-relaxed mb-6">
                  Despierta mecido por el mar en las marinos y calas de Gran Canaria, Tenerife o La Graciosa. La opción náutica exclusiva de Vaneando.
                </p>
              </div>
              <Link href="/buscar?vehicleType=BARCO" className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#13322E] hover:underline">
                Ver Barcos Habitales →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN DE VIAJES POR TEMÁTICA O NECESIDAD */}
      <section className="py-16 bg-[#FAF7F0] border-t border-[#E9E1D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#D97706]">Filtros por Experiencia</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#13322E] mt-1">El viaje perfecto para cada ocasión</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/buscar?passengers=4" className="bg-white p-6 rounded-3xl border border-[#E9E1D2] text-center hover:border-[#16B8AA] transition-colors shadow-sm">
              <span className="text-3xl mb-2 block">👨‍👩‍👧‍👦</span>
              <h3 className="font-bold text-sm text-[#13322E]">Viajes con Niños</h3>
              <p className="text-[11px] text-[#6B726E] mt-1 font-medium">Campers amplias de 4 a 6 plazas</p>
            </Link>
            <Link href="/buscar?pets=true" className="bg-white p-6 rounded-3xl border border-[#E9E1D2] text-center hover:border-[#16B8AA] transition-colors shadow-sm">
              <span className="text-3xl mb-2 block">🐾</span>
              <h3 className="font-bold text-sm text-[#13322E]">Pet-Friendly</h3>
              <p className="text-[11px] text-[#6B726E] mt-1 font-medium">Viaja con tu mascota libremente</p>
            </Link>
            <Link href="/buscar?surf=true" className="bg-white p-6 rounded-3xl border border-[#E9E1D2] text-center hover:border-[#16B8AA] transition-colors shadow-sm">
              <span className="text-3xl mb-2 block">🏄</span>
              <h3 className="font-bold text-sm text-[#13322E]">Surf Trip en Camper</h3>
              <p className="text-[11px] text-[#6B726E] mt-1 font-medium">Con soportes para tablas y ducha exterior</p>
            </Link>
            <Link href="/buscar?maxPrice=70" className="bg-white p-6 rounded-3xl border border-[#E9E1D2] text-center hover:border-[#16B8AA] transition-colors shadow-sm">
              <span className="text-3xl mb-2 block">💶</span>
              <h3 className="font-bold text-sm text-[#13322E]">Campers Económicas</h3>
              <p className="text-[11px] text-[#6B726E] mt-1 font-medium">Furgonetas por menos de 70€/día</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. EXPLORAR POR ISLA */}
      <section className="py-20 bg-white border-t border-[#E9E1D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#16B8AA]">Archipiélago Canario</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#13322E] mt-2 mb-3">Explora las ocho islas canarias</h2>
            <p className="text-sm text-[#6B726E] font-medium leading-relaxed">
              Haz clic en cualquier isla para seleccionar sus furgonetas camperizadas y autocaravanas disponibles.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {CANARY_ISLANDS.map((isla) => (
              <button
                key={isla.id}
                onClick={() => {
                  setSelectedIsland(isla.name);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group flex flex-col items-center justify-center p-2 transition-all duration-300 text-center cursor-pointer bg-transparent border-0"
              >
                <div className="relative w-full h-40 sm:h-48 flex items-center justify-center">
                  <img
                    src={ISLAND_HERO_IMAGES[isla.name] || ISLAND_HERO_IMAGES['Gran Canaria']}
                    alt={`Alquiler camper en ${isla.name}`}
                    loading="lazy"
                    decoding="async"
                    className={`max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-110 ${
                      selectedIsland === isla.name ? 'scale-105 brightness-105' : 'opacity-90 hover:opacity-100'
                    }`}
                  />
                </div>
                <div className="mt-3">
                  <h3
                    className={`font-serif text-xl sm:text-2xl font-bold transition-colors ${
                      selectedIsland === isla.name
                        ? 'text-[#16B8AA] underline decoration-[#16B8AA] decoration-2 underline-offset-4'
                        : 'text-[#13322E] group-hover:text-[#16B8AA]'
                    }`}
                  >
                    {isla.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. OPINIONES DE LA COMUNIDAD (HISTORIAS SOBRE RUEDAS EN CANARIAS) */}
      <section className="py-20 bg-[#F7F6F2] border-t border-[#E9E1D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#13322E] mb-4">
              Vuestras opiniones: una historia sobre ruedas
            </h2>
            <p className="text-sm text-[#6B726E] font-medium leading-relaxed">
              Viajeros que han descubierto la magia de despertar frente al mar en Gran Canaria, Tenerife, Fuerteventura y Lanzarote.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
                  ))}
                </div>
                <p className="text-xs text-[#13322E] font-medium leading-relaxed mb-6 italic">
                  &ldquo;Alquilar la camper en Gran Canaria a través de Vaneando fue la mejor decisión. El propietario nos entregó la furgoneta directamente en el aeropuerto LPA con recomendaciones secretas de pernocta.&rdquo;
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-[#E9E1D2]">
                <img className="w-10 h-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Laura M." />
                <div>
                  <h4 className="font-bold text-sm text-[#13322E]">Laura M.</h4>
                  <span className="text-[10px] text-[#6B726E]">Viaje por Gran Canaria · Marzo 2026</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
                  ))}
                </div>
                <p className="text-xs text-[#13322E] font-medium leading-relaxed mb-6 italic">
                  &ldquo;Ahorramos más del 50% en comparación con reservar hotel y coche de alquiler en Tenerife. La camper estaba impecable, con tablas de surf e inventario completo de cocina.&rdquo;
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-[#E9E1D2]">
                <img className="w-10 h-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Markus S." />
                <div>
                  <h4 className="font-bold text-sm text-[#13322E]">Markus S. (Alemania)</h4>
                  <span className="text-[10px] text-[#6B726E]">Viaje por Tenerife · Febrero 2026</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
                  ))}
                </div>
                <p className="text-xs text-[#13322E] font-medium leading-relaxed mb-6 italic">
                  &ldquo;Transparencia absoluta. La fianza se liberó inmediatamente al devolver el vehículo y el trato con el propietario canario fue cercano y familiar. Repetiremos 100%.&rdquo;
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-[#E9E1D2]">
                <img className="w-10 h-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Elena y Carlos" />
                <div>
                  <h4 className="font-bold text-sm text-[#13322E]">Elena y Carlos</h4>
                  <span className="text-[10px] text-[#6B726E]">Viaje por Fuerteventura · Enero 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECCIÓN PROPIETARIOS CON PASOS EXPLICATIVOS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#13322E] rounded-3xl p-8 sm:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl z-10">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#16B8AA]">Propietarios en Canarias</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mt-2 mb-6">
              ¿Tienes una camper en las islas? Alquila con total confianza
            </h2>
            <p className="text-white/80 font-medium text-base sm:text-lg mb-8 leading-relaxed">
              Rentabiliza tu furgoneta o autocaravana con total tranquilidad cuando no la estés utilizando. Plataforma con verificación de identidad, contratos digitales entre particulares y gestión de calendario.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8 text-left text-xs">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <span className="font-black text-[#F2CC8F] text-base block">01</span>
                <span className="font-bold block mt-1">Crea tu anuncio</span>
                <span className="text-[10px] text-white/70 font-medium">Disponibilidad y precios a tu medida.</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <span className="font-black text-[#F2CC8F] text-base block">02</span>
                <span className="font-bold block mt-1">Recibe solicitudes</span>
                <span className="text-[10px] text-white/70 font-medium">Revisa el perfil y acepta reservas.</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <span className="font-black text-[#F2CC8F] text-base block">03</span>
                <span className="font-bold block mt-1">¡Rentabiliza!</span>
                <span className="text-[10px] text-white/70 font-medium">Ingresos protegidos en tu cuenta.</span>
              </div>
            </div>

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

      {/* 9. FOOTER ENRIQUECIDO ESTILO YESCAPA */}
      <footer className="bg-[#13322E] text-white pt-16 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <span className="font-serif text-3xl font-medium tracking-tight text-white block">vaneando<span className="text-[#b88a55]">.</span></span>
            <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-[#16B8AA] block font-black mt-0.5 mb-4">
              Canarias sobre ruedas
            </span>
            <p className="text-xs text-white/60 font-medium leading-relaxed max-w-sm mb-4">
              La plataforma oficial de alquiler de campers, autocaravanas, caravanas, 4x4 y barcos entre particulares en las 8 Islas Canarias.
            </p>
            <div className="flex items-center space-x-3 text-xs text-white/70">
              <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">💳 Pagos Seguros SSL</span>
              <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">⚖️ Fianza entre Particulares</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#16B8AA] mb-4">Destinos en Canarias</h4>
            <ul className="space-y-2 text-xs text-white/70 font-medium">
              <li><Link href="/alquiler-camper/gran-canaria" className="hover:text-white">Alquiler Camper Gran Canaria</Link></li>
              <li><Link href="/alquiler-camper/tenerife" className="hover:text-white">Alquiler Camper Tenerife</Link></li>
              <li><Link href="/alquiler-camper/lanzarote" className="hover:text-white">Alquiler Camper Lanzarote</Link></li>
              <li><Link href="/alquiler-camper/fuerteventura" className="hover:text-white">Alquiler Camper Fuerteventura</Link></li>
              <li><Link href="/alquiler-camper/la-palma" className="hover:text-white">Alquiler Camper La Palma</Link></li>
              <li><Link href="/alquiler-camper/la-gomera" className="hover:text-white">Alquiler Camper La Gomera</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#16B8AA] mb-4">Tipos de Vehículo</h4>
            <ul className="space-y-2 text-xs text-white/70 font-medium">
              <li><Link href="/buscar?vehicleType=CAMPER" className="hover:text-white">Furgoneta Camper Pequeña</Link></li>
              <li><Link href="/buscar?vehicleType=CAMPER" className="hover:text-white">Camper Gran Volumen</Link></li>
              <li><Link href="/buscar?vehicleType=AUTOCARAVANA" className="hover:text-white">Autocaravana Perfilada</Link></li>
              <li><Link href="/buscar?vehicleType=AUTOCARAVANA" className="hover:text-white">Autocaravana Capuchina</Link></li>
              <li><Link href="/buscar?vehicleType=FOUR_BY_FOUR" className="hover:text-white">4x4 con Tienda de Techo</Link></li>
              <li><Link href="/buscar?vehicleType=BARCO" className="hover:text-white">Barcos & Veleros Habitables</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#16B8AA] mb-4">Blog & Guías</h4>
            <ul className="space-y-2 text-xs text-white/70 font-medium">
              <li><Link href="/guias/hotel-vs-camper-gran-canaria-ahorro-experiencia" className="hover:text-white">Hotel vs Camper Gran Canaria</Link></li>
              <li><Link href="/guias/vaneando-vs-yescapa-indie-campers-roadsurfer-canarias" className="hover:text-white">Vaneando vs Yescapa</Link></li>
              <li><Link href="/guias/pernocta-legal-zonas-acampada-gran-canaria-tenerife" className="hover:text-white">Mapa de Pernocta Legal</Link></li>
              <li><Link href="/guias/alquiler-4x4-camperizado-caravana-barco-canarias" className="hover:text-white">Guía de 6 Categorías</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-medium gap-4">
          <p>© 2026 Vaneando. La plataforma oficial de alquiler entre particulares en Canarias.</p>
          <div className="flex space-x-4">
            <Link href="/terminos" className="hover:text-white">Términos</Link>
            <Link href="/privacidad" className="hover:text-white">Privacidad</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
