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
    id: 'gt-1',
    slug: 'porsche-911-gt3-touring',
    brand: 'PORSCHE',
    model: '911 GT3 Touring Manual',
    year: 2024,
    hp: 510,
    accel: '3.9s',
    topSpeed: 320,
    city: 'Mallorca / Ibiza',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'MANUAL',
    price: 1750,
    image: '/supercars/brands/porsche.png',
    owner: { name: 'Raúl E.', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80', rating: 4.99, verified: true }
  },
  {
    id: 'gt-2',
    slug: 'ferrari-sf90-stradale-assetto-fiorano',
    brand: 'FERRARI',
    model: 'SF90 Assetto Fiorano',
    year: 2024,
    hp: 1000,
    accel: '2.5s',
    topSpeed: 340,
    city: 'Barcelona',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 2900,
    image: '/supercars/brands/ferrari.png',
    owner: { name: 'Javier V.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', rating: 4.98, verified: true }
  },
  {
    id: 'gt-3',
    slug: 'lamborghini-revuelto-v12-hybrid',
    brand: 'LAMBORGHINI',
    model: 'Revuelto V12 HPEV Hybrid',
    year: 2025,
    hp: 1015,
    accel: '2.5s',
    topSpeed: 350,
    city: 'Marbella',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 3300,
    image: '/supercars/brands/lamborghini.png',
    owner: { name: 'Carlos M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  },
  {
    id: 'gt-4',
    slug: 'mclaren-765lt-spider-carbon',
    brand: 'MCLAREN',
    model: '750S Spider Carbon',
    year: 2024,
    hp: 750,
    accel: '2.8s',
    topSpeed: 332,
    city: 'Tenerife',
    countryCode: 'ES',
    bodyType: 'CABRIO',
    transmission: 'AUTOMATIC',
    price: 2500,
    image: '/supercars/brands/mclaren.png',
    owner: { name: 'Alejandro G.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  },
  {
    id: 'gt-5',
    slug: 'mercedes-amg-gt-black-series',
    brand: 'MERCEDES-BENZ',
    model: 'AMG GT Black Series',
    year: 2024,
    hp: 730,
    accel: '3.2s',
    topSpeed: 325,
    city: 'Gran Canaria',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 2350,
    image: '/supercars/brands/mercedes-benz.png',
    owner: { name: 'Alberto B.', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  },
  {
    id: 'gt-6',
    slug: 'aston-martin-dbs-superleggera',
    brand: 'ASTON MARTIN',
    model: 'DBS Superleggera V12',
    year: 2024,
    hp: 725,
    accel: '3.4s',
    topSpeed: 340,
    city: 'Madrid',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 2100,
    image: '/supercars/brands/aston-martin.png',
    owner: { name: 'Gonzalo S.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  },
  {
    id: 'gt-7',
    slug: 'audi-r8-v10-performance',
    brand: 'AUDI',
    model: 'R8 V10 Performance GT RWD',
    year: 2024,
    hp: 620,
    accel: '3.1s',
    topSpeed: 331,
    city: 'Madrid',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 1900,
    image: '/supercars/brands/audi.png',
    owner: { name: 'Marcos T.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', rating: 4.96, verified: true }
  },
  {
    id: 'gt-8',
    slug: 'bmw-m4-csl',
    brand: 'BMW',
    model: 'M4 Competition Sport Lightweight',
    year: 2024,
    hp: 550,
    accel: '3.7s',
    topSpeed: 307,
    city: 'Marbella',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 1600,
    image: '/supercars/brands/bmew.png',
    owner: { name: 'David P.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', rating: 4.95, verified: true }
  },
  {
    id: 'gt-9',
    slug: 'bentley-continental-gt-speed',
    brand: 'BENTLEY',
    model: 'Continental GT Speed W12',
    year: 2024,
    hp: 659,
    accel: '3.6s',
    topSpeed: 335,
    city: 'Marbella',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 2250,
    image: '/supercars/brands/bentley.png',
    owner: { name: 'Felipe M.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  },
  {
    id: 'gt-10',
    slug: 'rolls-royce-spectre-v12',
    brand: 'ROLLS-ROYCE',
    model: 'Spectre Ultra-Luxury Coupé',
    year: 2024,
    hp: 585,
    accel: '4.5s',
    topSpeed: 250,
    city: 'Madrid',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 3500,
    image: '/supercars/brands/rolls-royce.png',
    owner: { name: 'Lucas B.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  },
  {
    id: 'gt-11',
    slug: 'chevrolet-corvette-z06',
    brand: 'CHEVROLET',
    model: 'Corvette Z06 5.5L Flat-Plane',
    year: 2024,
    hp: 670,
    accel: '2.6s',
    topSpeed: 314,
    city: 'Madrid',
    countryCode: 'ES',
    bodyType: 'CABRIO',
    transmission: 'AUTOMATIC',
    price: 1950,
    image: '/supercars/brands/chevrolet.png',
    owner: { name: 'Sergio L.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', rating: 4.98, verified: true }
  },
  {
    id: 'gt-12',
    slug: 'dodge-challenger-srt-demon',
    brand: 'DODGE',
    model: 'Challenger SRT Super Stock Hellcat',
    year: 2024,
    hp: 807,
    accel: '3.2s',
    topSpeed: 326,
    city: 'Alicante',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 1800,
    image: '/supercars/brands/dodge.png',
    owner: { name: 'Manuel K.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', rating: 4.97, verified: true }
  },
  {
    id: 'gt-13',
    slug: 'ford-gt-carbon-edition',
    brand: 'FORD',
    model: 'Ford GT Carbon Series EcoBoost',
    year: 2024,
    hp: 660,
    accel: '2.9s',
    topSpeed: 348,
    city: 'Barcelona',
    countryCode: 'ES',
    bodyType: 'COUPE',
    transmission: 'AUTOMATIC',
    price: 2800,
    image: '/supercars/brands/ford.png',
    owner: { name: 'Adrián R.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
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

  // En la Home (strictFilter = false), ponemos primero los de la marca seleccionada en el carrusel
  // y después el resto de la colección para que siempre se vea una galería completa e imponente.
  // En /buscar (strictFilter = true), mostramos exactamente los que cumplen los filtros activos.
  const displayCars = React.useMemo(() => {
    if (strictFilter) {
      return filteredCars;
    }
    if (activeBrand) {
      const matching = allCars.filter((c) => matchesBrand(c.brand, c.model, activeBrand));
      const others = allCars.filter((c) => !matchesBrand(c.brand, c.model, activeBrand));
      return [...matching, ...others];
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
                <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[9px] font-mono font-bold uppercase">
                  MARCA: {activeBrand}
                </span>
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
            <div className="mt-4 md:mt-0">
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

        {/* ESTADO SIN RESULTADOS EN BUSCADOR */}
        {displayCars.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-12 text-center space-y-4 font-mono">
            <p className="text-sm font-bold text-black uppercase tracking-wider">
              No hay unidades exactas con esa combinación de filtros
            </p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Prueba a limpiar los filtros para ver todas las unidades disponibles en el Garaje o solicita tu configuración a medida en Conserjería VIP.
            </p>
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-mono font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>MOSTRAR TODOS LOS SUPERDEPORTIVOS</span>
              </button>
            )}
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
