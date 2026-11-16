'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowUpRight, RotateCcw } from 'lucide-react';
import { getCitiesByCountry } from '@/lib/supercar-locations';

export interface SupercarItem {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  hp: number;
  accel: string;
  topSpeed: number;
  city: string;
  countryCode: string;
  bodyType: string;
  transmission: 'AUTOMATIC' | 'MANUAL';
  price: number;
  image: string;
  isCustomPhoto?: boolean;
  owner: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
}

export const COMMUNITY_SUPERCARS: SupercarItem[] = [
  {
    id: '4ead6554-3909-4785-b6a5-ca61b37ae6ec',
    slug: 'ferrari-488-gtb-rosso-corsa',
    brand: 'FERRARI',
    model: '488 GTB Rosso Corsa Bi-Colore',
    year: 2019,
    hp: 670,
    accel: '3.0s',
    topSpeed: 330,
    city: 'Tenerife / Gran Canaria',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 1290,
    image: '/supercars/ferrari-488/ferrari-488-front.jpg',
    isCustomPhoto: true,
    owner: { name: 'GTR Cars Official', avatar: '/brand/app-icon.png', rating: 5.0, verified: true }
  },
  {
    id: 'c18a7e4e-7aa4-41cd-8f74-ec1d62f4b535',
    slug: 'porsche-taycan-volcano-grey',
    brand: 'PORSCHE',
    model: 'Taycan Volcano Grey Metallic',
    year: 2022,
    hp: 408,
    accel: '5.4s',
    topSpeed: 230,
    city: 'Tenerife / Gran Canaria',
    countryCode: 'ES',
    bodyType: 'SEDAN',
    transmission: 'AUTOMATIC',
    price: 690,
    image: '/supercars/porsche-taycan/porsche-taycan-front.jpg',
    isCustomPhoto: true,
    owner: { name: 'GTR Cars Official', avatar: '/brand/app-icon.png', rating: 5.0, verified: true }
  }
];

export interface SupercarFilterState {
  brand?: string;
  countryCode?: string;
  city?: string;
  bodyType?: string;
  power?: string;
  transmission?: string;
}

interface SupercarGridProps {
  selectedBrand?: string | null;
  filters?: SupercarFilterState;
  strictFilter?: boolean;
  onResetFilters?: () => void;
}

function mapDbVehicleToSupercar(v: any): SupercarItem {
  const featNames: string[] = (v.features || []).map((f: any) => String(f?.name || ''));
  let hp = 650;
  let accel = '3.0s';
  let topSpeed = 325;

  for (const fn of featNames) {
    const hpMatch = fn.match(/Potencia:\s*(\d+)\s*CV/i);
    if (hpMatch) hp = Number(hpMatch[1]);
    const accelMatch = fn.match(/0-100\s*km\/h:\s*([\d.,]+)\s*s/i);
    if (accelMatch) accel = `${accelMatch[1]}s`;
    const speedMatch = fn.match(/Velocidad\s*M[áa]x:\s*(\d+)\s*km\/h/i);
    if (speedMatch) topSpeed = Number(speedMatch[1]);
  }

  const photoUrl = v.photos?.[0]?.url || '/supercars/brands/porsche.png';
  const ownerName = v.owner
    ? `${v.owner.firstName || 'Propietario'} ${v.owner.lastName ? v.owner.lastName[0] + '.' : ''}`.trim()
    : 'Propietario VIP';
  const avgRating =
    Array.isArray(v.reviews) && v.reviews.length > 0
      ? Number((v.reviews.reduce((a: number, r: any) => a + Number(r.rating || 5), 0) / v.reviews.length).toFixed(2))
      : 5.0;

  return {
    id: String(v.id),
    slug: String(v.slug || v.id),
    brand: String(v.brand || 'SUPERCAR').toUpperCase(),
    model: String(v.title || `${v.brand || ''} ${v.model || ''}`.trim() || 'Superdeportivo'),
    year: Number(v.year || 2024),
    hp,
    accel,
    topSpeed,
    city: String(v.island || v.municipality || 'Madrid'),
    countryCode: 'ES',
    bodyType: String(v.vehicleType || 'COUPE'),
    transmission: v.transmission === 'MANUAL' ? 'MANUAL' : 'AUTOMATIC',
    price: Number(v.basePricePerDay || 950),
    image: photoUrl,
    isCustomPhoto: Boolean(v.photos?.[0]?.url && !v.photos[0].url.startsWith('/supercars/brands/')),
    owner: {
      name: ownerName,
      avatar: v.owner?.avatarUrl || '/default-avatar.svg',
      rating: avgRating,
      verified: true,
    },
  };
}

function matchesBrand(carBrand: string, carModel: string, filterBrand?: string | null): boolean {
  if (!filterBrand) return true;
  const cleanFilter = filterBrand.trim().toLowerCase().replace(/-/g, ' ');
  if (!cleanFilter || cleanFilter === 'todas las marcas') return true;
  const target = `${carBrand} ${carModel}`.toLowerCase().replace(/-/g, ' ');
  if (cleanFilter.includes('mercedes') && target.includes('mercedes')) return true;
  if (cleanFilter.includes('aston') && target.includes('aston')) return true;
  if (cleanFilter.includes('audi') && target.includes('audi')) return true;
  if (cleanFilter.includes('bmw') && target.includes('bmw')) return true;
  if (cleanFilter.includes('corvette') && (target.includes('corvette') || target.includes('chevrolet'))) return true;
  if (cleanFilter.includes('ford') && target.includes('ford')) return true;
  return target.includes(cleanFilter) || cleanFilter.includes(carBrand.toLowerCase().replace(/-/g, ' '));
}

export default function SupercarGrid({
  selectedBrand,
  filters,
  strictFilter = false,
  onResetFilters,
}: SupercarGridProps = {}) {
  const [dbCars, setDbCars] = useState<SupercarItem[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/vehicles')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.vehicles || !Array.isArray(data.vehicles)) return;
        const mapped = data.vehicles.map(mapDbVehicleToSupercar);
        setDbCars(mapped);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Combinar vehículos reales de la BD (primero) con el catálogo base sin duplicar slugs
  const allCars = React.useMemo(() => {
    const seenSlugs = new Set<string>();
    const combined: SupercarItem[] = [];
    for (const c of [...dbCars, ...COMMUNITY_SUPERCARS]) {
      if (!seenSlugs.has(c.slug)) {
        seenSlugs.add(c.slug);
        combined.push(c);
      }
    }
    return combined;
  }, [dbCars]);

  const activeBrand = filters?.brand || selectedBrand || '';

  const filteredCars = React.useMemo(() => {
    return allCars.filter((car) => {
      // 1. Marca
      if (activeBrand && !matchesBrand(car.brand, car.model, activeBrand)) {
        return false;
      }
      // 2. Carrocería
      if (filters?.bodyType && car.bodyType !== filters.bodyType) {
        return false;
      }
      // 3. País
      if (filters?.countryCode) {
        const countryCities = getCitiesByCountry(filters.countryCode).map((ct) => ct.name.toLowerCase());
        const carCityLower = car.city.toLowerCase();
        const inCountry =
          car.countryCode === filters.countryCode ||
          countryCities.some((cn) => cn.includes(carCityLower) || carCityLower.includes(cn.split('(')[0].trim()));
        if (!inCountry) return false;
      }
      // 4. Ciudad
      if (filters?.city) {
        const filterCityClean = filters.city.split('(')[0].trim().toLowerCase();
        const carCityClean = car.city.toLowerCase();
        if (!carCityClean.includes(filterCityClean) && !filterCityClean.includes(carCityClean)) {
          return false;
        }
      }
      // 5. Potencia mínima
      if (filters?.power) {
        const minHp = Number(filters.power);
        if (!Number.isNaN(minHp) && car.hp < minHp) {
          return false;
        }
      }
      // 6. Transmisión
      if (filters?.transmission && car.transmission !== filters.transmission) {
        return false;
      }
      return true;
    });
  }, [allCars, activeBrand, filters]);

  // Si hay una marca seleccionada (en el carrusel hero o en buscador),
  // se muestran estrictamente los superdeportivos que coinciden con esa marca.
  const displayCars = React.useMemo(() => {
    if (strictFilter) {
      return filteredCars;
    }
    if (activeBrand) {
      return allCars.filter((c) => matchesBrand(c.brand, c.model, activeBrand));
    }
    return allCars;
  }, [strictFilter, filteredCars, allCars, activeBrand]);

  return (
    <section className={`${strictFilter ? 'py-0' : 'py-24 border-t border-gray-100'} bg-white text-black relative`}>
      <div className={strictFilter ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-gray-200">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gray-500 block">
                SELECCIÓN GT CARS & GTR CARS PREMIUM
              </span>
              {activeBrand && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black text-white text-[9px] font-mono font-bold uppercase">
                  <span>FILTRO: {activeBrand}</span>
                  {onResetFilters && (
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="ml-1 text-gray-300 hover:text-white cursor-pointer"
                      title="Quitar filtro"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
              {strictFilter && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold uppercase">
                  {displayCars.length} {displayCars.length === 1 ? 'UNIDAD DISPONIBLE' : 'UNIDADES DISPONIBLES'}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black font-sans">
              COLECCIÓN DE SUPERDEPORTIVOS
            </h2>
            <p className="text-xs font-mono text-gray-600 mt-1 max-w-lg font-medium">
              Flota exclusiva de propietarios particulares: desde GT Cars de circuito hasta Hypercars V12 en Madrid, Marbella, Barcelona, Baleares y Canarias.
            </p>
          </div>

          {!strictFilter && (
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              {activeBrand && onResetFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-4 py-2 border border-gray-300 hover:border-black text-xs font-mono tracking-wider uppercase transition-all rounded-full font-bold cursor-pointer"
                >
                  VER TODOS LOS ANUNCIOS
                </button>
              )}
              <Link
                href="/buscar"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-black hover:text-white border border-gray-200 text-xs font-mono tracking-wider uppercase transition-all rounded-full font-bold"
              >
                <span>VER GARAJE COMPLETO</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* ESTADO SIN RESULTADOS EN BUSCADOR O FILTRO */}
        {displayCars.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-10 sm:p-12 text-center space-y-4 font-mono max-w-2xl mx-auto my-6">
            <p className="text-sm font-bold text-black uppercase tracking-wider">
              {activeBrand ? `No hay anuncios de ${activeBrand} disponibles actualmente` : 'No hay unidades exactas con esa combinación'}
            </p>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              {activeBrand
                ? `Actualmente el catálogo cuenta con el Ferrari 488 GTB Rosso Corsa para reserva inmediata en Canarias. Puedes publicar tu ${activeBrand} o explorar la flota disponible.`
                : 'Prueba a limpiar los filtros para ver todas las unidades disponibles en el Garaje o solicita tu configuración a medida en Conserjería VIP.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onResetFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-mono font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>VER ANUNCIOS DISPONIBLES</span>
                </button>
              )}
              {activeBrand && (
                <Link
                  href="/publicar-coche"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-black bg-white hover:bg-gray-100 text-black text-xs font-mono font-bold uppercase tracking-widest rounded-full transition-all"
                >
                  <span>PUBLICAR MI {activeBrand}</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* CARDS GRID */
          <div className={`grid grid-cols-1 md:grid-cols-2 ${strictFilter ? 'xl:grid-cols-3' : 'lg:grid-cols-3'} gap-8`}>
            {displayCars.map((car) => {
              const isHighlighted = !strictFilter && Boolean(activeBrand && matchesBrand(car.brand, car.model, activeBrand));

              return (
                <Link
                  key={car.id}
                  href={`/coche/${car.slug}`}
                  className={`group bg-gray-50 border transition-all duration-500 rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer block ${
                    isHighlighted
                      ? 'border-black ring-1 ring-black shadow-xl'
                      : 'border-gray-200 hover:border-black hover:shadow-2xl'
                  }`}
                >
                  <div>
                    {/* PHOTO CONTAINER */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-white flex items-center justify-center p-4 border-b border-gray-100">
                      <div className="relative w-full h-full">
                        <Image
                          src={car.image}
                          alt={car.model}
                          fill
                          unoptimized={car.isCustomPhoto}
                          className={`${
                            car.isCustomPhoto ? 'object-cover rounded-xl' : 'object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.12)]'
                          } group-hover:scale-105 transition-transform duration-700`}
                        />
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-3 py-1 bg-black text-[9px] font-mono font-bold tracking-widest text-white uppercase rounded-full shadow-sm">
                          {car.brand}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 border border-gray-200 text-[9px] font-mono font-bold text-gray-700 uppercase rounded-full shadow-sm">
                          {car.city}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1.5 font-bold">
                        <span>AÑO {car.year} · {car.transmission === 'MANUAL' ? 'MANUAL' : 'AUTOMÁTICO'}</span>
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">VERIFICADO</span>
                      </div>

                      <h3 className="text-lg font-black text-black group-hover:text-neutral-600 transition-colors leading-snug truncate font-sans">
                        {car.model}
                      </h3>

                      {/* SPECS HUD */}
                      <div className="grid grid-cols-3 gap-2 py-3.5 my-3 border-y border-gray-200 text-center font-mono">
                        <div>
                          <span className="text-[9px] text-gray-400 block font-bold">POTENCIA</span>
                          <span className="text-xs font-bold text-black">{car.hp} CV</span>
                        </div>
                        <div className="border-x border-gray-200">
                          <span className="text-[9px] text-gray-400 block font-bold">0-100 KM/H</span>
                          <span className="text-xs font-bold text-black">{car.accel}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block font-bold">V. MÁX</span>
                          <span className="text-xs font-bold text-black">{car.topSpeed} KM/H</span>
                        </div>
                      </div>

                      {/* OWNER BAR */}
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center space-x-2">
                          <img
                            src={car.owner.avatar}
                            alt={car.owner.name}
                            className="w-6 h-6 rounded-full border border-gray-300 object-cover"
                          />
                          <span className="text-gray-700 font-bold">{car.owner.name}</span>
                        </div>
                        <span className="text-black font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-black text-black" /> {car.owner.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER ACTION */}
                  <div className="p-5 flex items-center justify-between border-t border-gray-200 bg-gray-100 group-hover:bg-gray-200/70 transition-colors">
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block font-bold">DESDE</span>
                      <span className="text-lg font-mono font-black text-black">{car.price}€</span>
                      <span className="text-[10px] font-mono text-gray-500 font-bold"> / DÍA</span>
                    </div>

                    <span className="px-4 py-2 bg-black group-hover:bg-gray-800 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors rounded-full shadow-sm">
                      SELECCIONAR
                    </span>
                  </div>

                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
