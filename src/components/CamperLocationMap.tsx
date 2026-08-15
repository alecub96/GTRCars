'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Compass, Tent, Waves, Droplets, Mountain, Navigation, Info, ShieldCheck, ChevronRight } from 'lucide-react';

interface CamperLocationMapProps {
  island: string;
  municipality: string;
  vehicleTitle?: string;
}

interface POI {
  id: string;
  name: string;
  category: 'acampada' | 'playa' | 'agua' | 'mirador';
  island: string;
  lat: number;
  lng: number;
  description: string;
  facilities?: string[];
}

const CANARY_POIS: POI[] = [
  // GRAN CANARIA
  {
    id: 'gc-1',
    name: 'Presa de las Niñas',
    category: 'acampada',
    island: 'Gran Canaria',
    lat: 27.9152,
    lng: -15.6741,
    description: 'Área de acampada oficial con barbacoas, agua potable y zona recreativa entre pinares.',
    facilities: ['Agua potable', 'Mesas y sombras', 'Fuego controlado', 'W.C.']
  },
  {
    id: 'gc-2',
    name: 'Pinar de Tamadaba',
    category: 'acampada',
    island: 'Gran Canaria',
    lat: 28.0315,
    lng: -15.6881,
    description: 'Zona de acampada en la cumbre con vistas espectaculares al Teide y atardeceres únicos.',
    facilities: ['Vistas panorámicas', 'Senderos', 'Mesas de picnic']
  },
  {
    id: 'gc-3',
    name: 'Playa de Vargas (Agüimes)',
    category: 'playa',
    island: 'Gran Canaria',
    lat: 27.8421,
    lng: -15.3955,
    description: 'Playa y zona habitual de estacionamiento camper para amantes del windsurf y tranquilidad.',
    facilities: ['Acceso directo a playa', 'Zona de parking amplio']
  },
  {
    id: 'gc-4',
    name: 'Punto Limpio / Área Camper El Sebadal',
    category: 'agua',
    island: 'Gran Canaria',
    lat: 28.1450,
    lng: -15.4210,
    description: 'Punto autorizado de vaciado de aguas grises/negras y repostaje de agua limpia.',
    facilities: ['Vaciado de aguas', 'Toma de agua limpia']
  },
  {
    id: 'gc-5',
    name: 'Mirador del Pico de las Nieves',
    category: 'mirador',
    island: 'Gran Canaria',
    lat: 27.9622,
    lng: -15.5701,
    description: 'El punto más alto de Gran Canaria con vistas a los roques principales y cumbre.',
    facilities: ['Fotografía', 'Aparcamiento']
  },

  // TENERIFE
  {
    id: 'tf-1',
    name: 'Zona Recreativa Chío (Guía de Isora)',
    category: 'acampada',
    island: 'Tenerife',
    lat: 28.2110,
    lng: -16.7450,
    description: 'Zona de acampada oficial con servicios bajo el pinar de la corona forestal.',
    facilities: ['Agua no tratada', 'Barbacoas', 'Baños públicos']
  },
  {
    id: 'tf-2',
    name: 'Playa de El Médano / La Tejita',
    category: 'playa',
    island: 'Tenerife',
    lat: 28.0402,
    lng: -16.5391,
    description: 'Punto de encuentro clásico de la comunidad camper en el sur de Tenerife.',
    facilities: ['Deportes de viento', 'Chiringuitos', 'Ambiente nómada']
  },
  {
    id: 'tf-3',
    name: 'Área de Servicio Chafiras',
    category: 'agua',
    island: 'Tenerife',
    lat: 28.0280,
    lng: -16.6020,
    description: 'Estación con servicio especial de llenado de depósito de agua y punto limpio.',
    facilities: ['Agua a presión', 'Gasolinera 24h']
  },
  {
    id: 'tf-4',
    name: 'Mirador de Chipeque (Esperanza)',
    category: 'mirador',
    island: 'Tenerife',
    lat: 28.3750,
    lng: -16.4820,
    description: 'Impresionante mar de nubes con el Teide al fondo al atardecer.',
    facilities: ['Fotografía nocturna', 'Vistas Teide']
  },

  // LANZAROTE
  {
    id: 'lz-1',
    name: 'Playa de Famara',
    category: 'playa',
    island: 'Lanzarote',
    lat: 29.1120,
    lng: -13.5650,
    description: 'Extensa playa salvaje bajo los riscos de Famara, meca del surf.',
    facilities: ['Surf', 'Aparcamiento de tierra amplio']
  },
  {
    id: 'lz-2',
    name: 'Papagayo (Costa Papagayo)',
    category: 'playa',
    island: 'Lanzarote',
    lat: 28.8410,
    lng: -13.7880,
    description: 'Cala de aguas turquesas en el Monumento Natural de Los Ajaches.',
    facilities: ['Aguas cristalinas', 'Entorno protegido']
  },
  {
    id: 'lz-3',
    name: 'Mirador del Río',
    category: 'mirador',
    island: 'Lanzarote',
    lat: 29.2140,
    lng: -13.4810,
    description: 'Vistas espectaculares hacia la isla de La Graciosa.',
    facilities: ['Vistas panorámicas']
  },

  // FUERTEVENTURA
  {
    id: 'fv-1',
    name: 'Playa de Cofete',
    category: 'playa',
    island: 'Fuerteventura',
    lat: 28.1120,
    lng: -14.3750,
    description: 'Kilómetros de costa virgen en el Parque Natural de Jandía.',
    facilities: ['Naturaleza virgen', 'Ruta 4x4']
  },
  {
    id: 'fv-2',
    name: 'Punto Camper Puerto del Rosario',
    category: 'agua',
    island: 'Fuerteventura',
    lat: 28.5010,
    lng: -13.8630,
    description: 'Punto de servicio para autocaravanas y campers con punto de agua.',
    facilities: ['Toma de agua', 'Vaciado']
  },

  // LA PALMA, LA GOMERA, EL HIERRO
  {
    id: 'lp-1',
    name: 'El Junco (Puntagorda)',
    category: 'acampada',
    island: 'La Palma',
    lat: 28.7910,
    lng: -17.9750,
    description: 'Zona arbolada en el noroeste de La Palma apta para pernoctar.',
    facilities: ['Naturaleza', 'Tranquilidad']
  },
  {
    id: 'lg-1',
    name: 'El Cedro (Parque Garajonay)',
    category: 'acampada',
    island: 'La Gomera',
    lat: 28.1290,
    lng: -17.2150,
    description: 'Área recreativa y camping rodeado de laurisilva milenaria.',
    facilities: ['Senderos laurisilva', 'Agua']
  },
  {
    id: 'eh-1',
    name: 'Hoya del Morcillo',
    category: 'acampada',
    island: 'El Hierro',
    lat: 27.7020,
    lng: -17.9850,
    description: 'Única zona de acampada oficial en El Hierro rodeada de pinos.',
    facilities: ['Baños', 'Barbacoas', 'Agua']
  },
];

const MUNICIPALITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Las Palmas de Gran Canaria': { lat: 28.1235, lng: -15.4363 },
  'San Bartolomé de Tirajana': { lat: 27.7606, lng: -15.5860 },
  'Maspalomas': { lat: 27.7606, lng: -15.5860 },
  'Telde': { lat: 27.9940, lng: -15.4162 },
  'Agüimes': { lat: 27.9042, lng: -15.4461 },
  'Gáldar': { lat: 28.1470, lng: -15.6540 },
  'Arucas': { lat: 28.1180, lng: -15.5220 },
  'Santa Cruz de Tenerife': { lat: 28.4636, lng: -16.2518 },
  'San Cristóbal de La Laguna': { lat: 28.4874, lng: -16.3159 },
  'Adeje': { lat: 28.1200, lng: -16.7300 },
  'Arona': { lat: 28.1000, lng: -16.6800 },
  'Puerto de la Cruz': { lat: 28.4160, lng: -16.5500 },
  'Arrecife': { lat: 28.9630, lng: -13.5470 },
  'Tías': { lat: 28.9500, lng: -13.6500 },
  'Yaiza': { lat: 28.9550, lng: -13.7660 },
  'Puerto del Rosario': { lat: 28.5000, lng: -13.8600 },
  'La Oliva': { lat: 28.6830, lng: -13.9300 },
  'Pájara': { lat: 28.3500, lng: -14.1000 },
  'Santa Cruz de La Palma': { lat: 28.6830, lng: -17.7640 },
  'Los Llanos de Aridane': { lat: 28.6580, lng: -17.9180 },
  'San Sebastián de La Gomera': { lat: 28.0910, lng: -17.1130 },
  'Valverde': { lat: 27.8080, lng: -17.9150 },
};

const ISLAND_CENTERS: Record<string, { lat: number; lng: number }> = {
  'Gran Canaria': { lat: 27.9600, lng: -15.5800 },
  'Tenerife': { lat: 28.2915, lng: -16.6291 },
  'Lanzarote': { lat: 29.0469, lng: -13.5899 },
  'Fuerteventura': { lat: 28.3587, lng: -14.0536 },
  'La Palma': { lat: 28.6835, lng: -17.8339 },
  'La Gomera': { lat: 28.1173, lng: -17.2250 },
  'El Hierro': { lat: 27.7470, lng: -18.0163 },
  'La Graciosa': { lat: 29.2500, lng: -13.5000 },
};

export default function CamperLocationMap({
  island,
  municipality,
  vehicleTitle = 'Esta furgoneta camper',
}: CamperLocationMapProps) {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'acampada' | 'playa' | 'agua' | 'mirador'>('todos');
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

  // Obtener centro de la ubicación aproximada
  const defaultCenter = MUNICIPALITY_COORDS[municipality] || ISLAND_CENTERS[island] || ISLAND_CENTERS['Gran Canaria'];
  
  // Filtrar POIs por la isla elegida o cercanas
  const islandPois = CANARY_POIS.filter(
    (poi) => poi.island.toLowerCase() === island.toLowerCase()
  );
  
  const displayPois = activeCategory === 'todos'
    ? islandPois
    : islandPois.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-white rounded-3xl border border-[#E9E1D2] p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* ENCABEZADO Y EXPLICACIÓN DE ZONA APROXIMADA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D2]">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#16B8AA] mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Mapa de Recogida & Puntos Camper</span>
          </div>
          <h3 className="text-2xl font-bold text-[#13322E] tracking-tight">
            Ubicación aproximada y mapa del viajero
          </h3>
          <p className="text-xs text-[#6B726E] font-medium mt-1">
            Por privacidad del propietario, se indica una <strong>zona aproximada de entrega (~1.5 km)</strong> en {municipality} ({island}). La dirección exacta se facilita tras confirmar la reserva.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#FAF7F0] border border-[#E9E1D2] px-4 py-2.5 rounded-2xl shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#16B8AA]" />
          <span className="text-xs font-bold text-[#13322E]">{municipality}</span>
        </div>
      </div>

      {/* BOTONES DE FILTRO DE PUNTOS D INTERÉS CAMPER */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('todos')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeCategory === 'todos'
              ? 'bg-[#13322E] text-white shadow-sm'
              : 'bg-[#F7F6F2] text-[#6B726E] hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#16B8AA]" />
          <span>Ver Todo ({islandPois.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('acampada')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeCategory === 'acampada'
              ? 'bg-[#16B8AA] text-white shadow-sm'
              : 'bg-[#F7F6F2] text-[#6B726E] hover:bg-slate-100'
          }`}
        >
          <Tent className="w-3.5 h-3.5" />
          <span>⛺ Acampada / Camping</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('playa')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeCategory === 'playa'
              ? 'bg-[#0F766E] text-white shadow-sm'
              : 'bg-[#F7F6F2] text-[#6B726E] hover:bg-slate-100'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>🏖️ Playas Camper</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('agua')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeCategory === 'agua'
              ? 'bg-[#D97706] text-white shadow-sm'
              : 'bg-[#F7F6F2] text-[#6B726E] hover:bg-slate-100'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>💧 Agua & Servicios</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('mirador')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeCategory === 'mirador'
              ? 'bg-[#254842] text-white shadow-sm'
              : 'bg-[#F7F6F2] text-[#6B726E] hover:bg-slate-100'
          }`}
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>🌅 Miradores</span>
        </button>
      </div>

      {/* CONTENEDOR DEL MAPA INTERACTIVO Y VISTA PREVIA */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E9E1D2] bg-[#E5E3DF] min-h-[380px] flex flex-col justify-between p-6">
        
        {/* Iframe del mapa centrado en el municipio con vista satélite/callejero */}
        <iframe
          title={`Mapa zona aproximada ${municipality}`}
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full border-0 brightness-[0.96] contrast-[1.02]"
          loading="lazy"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            `${municipality}, ${island}, Canarias, España`
          )}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
        />

        {/* OVERLAY DE ZONA DE RECOGIDA APROXIMADA */}
        <div className="relative z-10 self-start max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E9E1D2] shadow-xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16B8AA] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16B8AA]"></span>
            </span>
            <span className="text-xs font-extrabold text-[#13322E] uppercase tracking-wider">
              Zona de entrega de {vehicleTitle}
            </span>
          </div>
          <p className="text-[11px] text-[#6B726E] leading-relaxed font-medium">
            Entorno de <strong>{municipality} ({island})</strong>. Se concreta la ubicación exacta o entrega en aeropuerto al confirmar.
          </p>
        </div>

        {/* TARJETA INFORMATIVA DE POI SELECCIONADO SI EXISTE */}
        {selectedPoi && (
          <div className="relative z-10 self-end max-w-md bg-white p-5 rounded-2xl border border-[#16B8AA] shadow-2xl space-y-2 animate-fade-in w-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA]">
                {selectedPoi.category === 'acampada' ? '⛺ Zona de Acampada' : selectedPoi.category === 'playa' ? '🏖️ Playa Pernocta' : selectedPoi.category === 'agua' ? '💧 Punto de Agua' : '🌅 Mirador'}
              </span>
              <button
                onClick={() => setSelectedPoi(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕ Cerrar
              </button>
            </div>
            <h4 className="font-bold text-sm text-[#13322E]">{selectedPoi.name}</h4>
            <p className="text-xs text-[#6B726E] font-medium leading-relaxed">{selectedPoi.description}</p>
            {selectedPoi.facilities && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedPoi.facilities.map((fac, i) => (
                  <span key={i} className="text-[9px] font-bold bg-[#FAF7F0] text-[#13322E] border border-[#E9E1D2] px-2 py-0.5 rounded-full">
                    {fac}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TARJETAS DE PUNTOS INTERESANTES CAMPER CERCANOS EN ESTA ISLA */}
      {islandPois.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
            Lugares de interés camper destacados en {island}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayPois.map((poi) => (
              <div
                key={poi.id}
                onClick={() => setSelectedPoi(poi)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-1.5 ${
                  selectedPoi?.id === poi.id
                    ? 'border-[#16B8AA] bg-[#FAF7F0] ring-2 ring-[#16B8AA]/20'
                    : 'border-[#E9E1D2] bg-white hover:border-[#16B8AA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#16B8AA]">
                    {poi.category === 'acampada' ? '⛺ Acampada' : poi.category === 'playa' ? '🏖️ Playa' : poi.category === 'agua' ? '💧 Agua/Vaciado' : '🌅 Mirador'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <h5 className="text-xs font-bold text-[#13322E] line-clamp-1">{poi.name}</h5>
                <p className="text-[11px] text-[#6B726E] font-medium line-clamp-2 leading-relaxed">
                  {poi.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
