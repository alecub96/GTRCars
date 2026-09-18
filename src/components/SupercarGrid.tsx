'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Star, Zap, Gauge, Flame, CheckCircle, ArrowUpRight } from 'lucide-react';

const COMMUNITY_SUPERCARS = [
  {
    id: 'gt-1',
    slug: 'porsche-911-gt3-touring',
    brand: 'PORSCHE',
    model: '911 GT3 Touring Manual',
    year: 2024,
    hp: 510,
    accel: '3.9s',
    topSpeed: 320,
    city: 'Mallorca',
    price: 1750,
    image: '/supercars/brands/porsche.png',
    owner: { name: 'Raúl E.', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80', rating: 4.99, verified: true }
  },
  {
    id: 'gt-2',
    slug: 'ferrari-sf90-stradale',
    brand: 'FERRARI',
    model: 'SF90 Assetto Fiorano',
    year: 2024,
    hp: 1000,
    accel: '2.5s',
    topSpeed: 340,
    city: 'Barcelona',
    price: 2900,
    image: '/supercars/brands/ferrari.png',
    owner: { name: 'Javier V.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', rating: 4.98, verified: true }
  },
  {
    id: 'gt-3',
    slug: 'lamborghini-revuelto-v12',
    brand: 'LAMBORGHINI',
    model: 'Revuelto V12 HPEV Hybrid',
    year: 2025,
    hp: 1015,
    accel: '2.5s',
    topSpeed: 350,
    city: 'Marbella',
    price: 3300,
    image: '/supercars/brands/lamborghini.png',
    owner: { name: 'Carlos M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  },
  {
    id: 'gt-4',
    slug: 'mclaren-750s-spider',
    brand: 'MCLAREN',
    model: '750S Spider Carbon',
    year: 2024,
    hp: 750,
    accel: '2.8s',
    topSpeed: 332,
    city: 'Tenerife',
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
    city: 'Bilbao',
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
    price: 2100,
    image: '/supercars/brands/aston-martin.png',
    owner: { name: 'Gonzalo S.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  }
];

interface SupercarGridProps {
  selectedBrand?: string | null;
}

export default function SupercarGrid({ selectedBrand }: SupercarGridProps = {}) {
  // Filtrar coches si hay una marca seleccionada
  const filteredCars = selectedBrand
    ? COMMUNITY_SUPERCARS.filter(
        (car) =>
          car.brand.toLowerCase().includes(selectedBrand.toLowerCase()) ||
          selectedBrand.toLowerCase().includes(car.brand.toLowerCase())
      )
    : COMMUNITY_SUPERCARS;

  // Si para esa marca específica no hay en el mock inicial, mostramos el garaje completo o los coincidentes
  const displayCars = filteredCars.length > 0 ? filteredCars : COMMUNITY_SUPERCARS;

  return (
    <section className="py-24 bg-white border-t border-gray-100 text-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gray-500 block">
                SELECCIÓN GT CARS & GTR CARS PREMIUM
              </span>
              {selectedBrand && (
                <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[9px] font-mono font-bold uppercase">
                  FILTRO: {selectedBrand}
                </span>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black font-sans">
              COLECCIÓN DE SUPERDEPORTIVOS
            </h2>
            <p className="text-xs font-mono text-gray-600 mt-1 max-w-lg font-medium">
              Flota exclusiva de propietarios particulares: desde GT Cars de circuito hasta Hypercars V12 en Gran Canaria, Tenerife y principales hubs europeos.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/buscar"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-black hover:text-white border border-gray-200 text-xs font-mono tracking-wider uppercase transition-all rounded-full font-bold"
            >
              <span>VER GARAJE COMPLETO</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCars.map((car) => (
            <Link
              key={car.id}
              href={`/coche/${car.slug}`}
              className="group bg-gray-50 border border-gray-200 hover:border-black hover:shadow-2xl transition-all duration-500 rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer block"
            >
              <div>
                {/* PHOTO CONTAINER (PNG recortado sobre lienzo limpio) */}
                <div className="relative aspect-[16/10] overflow-hidden bg-white flex items-center justify-center p-4 border-b border-gray-100">
                  <div className="relative w-full h-full">
                    <Image
                      src={car.image}
                      alt={car.model}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_12px_18px_rgba(0,0,0,0.12)]"
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
                    <span>AÑO {car.year}</span>
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
          ))}
        </div>

      </div>
    </section>
  );
}
