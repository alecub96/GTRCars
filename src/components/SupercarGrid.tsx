'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Star, Zap, Gauge, Flame, CheckCircle, ArrowUpRight } from 'lucide-react';

const COMMUNITY_SUPERCARS = [
  {
    id: 'gt-1',
    slug: 'lamborghini-huracan-sto',
    brand: 'LAMBORGHINI',
    model: 'Huracán STO Squadra Corse',
    year: 2024,
    hp: 640,
    accel: '3.0s',
    topSpeed: 310,
    city: 'Madrid',
    price: 1950,
    image: '/supercars/huracan-sto.jpg',
    owner: { name: 'Raúl S.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  },
  {
    id: 'gt-2',
    slug: 'ferrari-296-gtb-assetto',
    brand: 'FERRARI',
    model: '296 GTB V6 Hybrid',
    year: 2024,
    hp: 830,
    accel: '2.9s',
    topSpeed: 330,
    city: 'Barcelona',
    price: 2100,
    image: '/supercars/ferrari-296.jpg',
    owner: { name: 'Mateo C.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', rating: 4.9, verified: true }
  },
  {
    id: 'gt-3',
    slug: 'aston-martin-dbs-superleggera',
    brand: 'ASTON MARTIN',
    model: 'DBS Superleggera V12',
    year: 2023,
    hp: 725,
    accel: '3.4s',
    topSpeed: 340,
    city: 'Marbella',
    price: 1650,
    image: '/supercars/aston-dbs.jpg',
    owner: { name: 'Ignacio D.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  },
  {
    id: 'gt-4',
    slug: 'porsche-911-gt3-rs-weissach',
    brand: 'PORSCHE',
    model: '911 GT3 RS Weissach',
    year: 2024,
    hp: 525,
    accel: '3.2s',
    topSpeed: 296,
    city: 'Valencia',
    price: 1850,
    image: '/supercars/porsche-gt3rs.jpg',
    owner: { name: 'Hugo F.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', rating: 4.95, verified: true }
  },
  {
    id: 'gt-5',
    slug: 'mclaren-765lt-spider',
    brand: 'MCLAREN',
    model: '765LT Spider Carbon',
    year: 2024,
    hp: 765,
    accel: '2.8s',
    topSpeed: 330,
    city: 'Tenerife',
    price: 2400,
    image: '/supercars/mclaren-765lt.jpg',
    owner: { name: 'Guillermo L.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  },
  {
    id: 'gt-6',
    slug: 'mercedes-amg-gt-black-series',
    brand: 'MERCEDES-AMG',
    model: 'AMG GT Black Series',
    year: 2023,
    hp: 730,
    accel: '3.2s',
    topSpeed: 325,
    city: 'Gran Canaria',
    price: 2600,
    image: '/supercars/amg-black-series.jpg',
    owner: { name: 'David M.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', rating: 5.0, verified: true }
  }
];

export default function SupercarGrid() {
  return (
    <section className="py-24 bg-[#080808] border-t border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                DISPONIBILIDAD INMEDIATA ENTRE PARTICULARES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              COLECCIÓN DE SUPERDEPORTIVOS
            </h2>
            <p className="text-xs sm:text-sm text-white/50 font-mono mt-1">
              Vehículos verificados bajo contrato de alquiler digital y fianza protegida.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/buscar"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 text-xs font-mono tracking-wider uppercase transition-all rounded-sm"
            >
              <span>VER COLECCIÓN COMPLETA</span>
              <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMUNITY_SUPERCARS.map((car) => (
            <div
              key={car.id}
              className="group bg-[#0E0E0E] border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-300 rounded-sm flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              <div>
                {/* PHOTO CONTAINER */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <Image
                    src={car.image}
                    alt={car.model}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
                      {car.brand}
                    </span>
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80 uppercase">
                      {car.city}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-1.5">
                    <span>AÑO {car.year}</span>
                    <span className="text-emerald-400 font-bold">VERIFICADO</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug truncate">
                    <Link href={`/camper/${car.slug}`}>
                      {car.model}
                    </Link>
                  </h3>

                  {/* SPECS HUD */}
                  <div className="grid grid-cols-3 gap-2 py-3.5 my-3 border-y border-white/10 text-center font-mono">
                    <div>
                      <span className="text-[9px] text-white/40 block">POTENCIA</span>
                      <span className="text-xs font-bold text-white">{car.hp} CV</span>
                    </div>
                    <div className="border-x border-white/10">
                      <span className="text-[9px] text-white/40 block">0-100 KM/H</span>
                      <span className="text-xs font-bold text-[#D4AF37]">{car.accel}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 block">V. MÁX</span>
                      <span className="text-xs font-bold text-white">{car.topSpeed} KM/H</span>
                    </div>
                  </div>

                  {/* OWNER BAR */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <img
                        src={car.owner.avatar}
                        alt={car.owner.name}
                        className="w-6 h-6 rounded-full border border-white/20 object-cover"
                      />
                      <span className="text-white/70">{car.owner.name}</span>
                    </div>
                    <span className="text-[#D4AF37] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#D4AF37]" /> {car.owner.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* FOOTER ACTION */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-2 pt-4">
                <div>
                  <span className="text-[9px] font-mono text-white/40 uppercase block">DESDE</span>
                  <span className="text-lg font-mono font-bold text-[#D4AF37]">{car.price}€</span>
                  <span className="text-[10px] font-mono text-white/50"> / DÍA</span>
                </div>

                <Link
                  href={`/camper/${car.slug}`}
                  className="px-4 py-2 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors rounded-sm"
                >
                  CONFIGURAR
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
