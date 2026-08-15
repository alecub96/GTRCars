'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Star,
  Compass,
  Tent,
  Waves,
  Droplets,
  Mountain,
  LayoutGrid,
  Map as MapIcon,
  X,
  ChevronRight,
  ShieldCheck,
  Fuel,
  Users,
  Bed,
} from 'lucide-react';
import FavoriteButton from './FavoriteButton';

export interface VehicleSearchItem {
  id: string;
  slug: string;
  title: string;
  island: string;
  municipality: string;
  basePricePerDay: number;
  passengers?: number;
  beds?: number;
  transmission?: string;
  photos: { url: string }[];
  reviews: { rating: number }[];
  isFeatured?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  addressApprox?: string | null;
}

interface SearchMapExplorerProps {
  vehicles: VehicleSearchItem[];
  selectedIsland?: string;
}

const ISLAND_COORDINATES: Record<string, { lat: number; lng: number; zoom: number; bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number } }> = {
  'Gran Canaria': {
    lat: 27.9600,
    lng: -15.5800,
    zoom: 11,
    bounds: { minLat: 27.70, maxLat: 28.20, minLng: -15.85, maxLng: -15.35 },
  },
  'Tenerife': {
    lat: 28.2915,
    lng: -16.6291,
    zoom: 10,
    bounds: { minLat: 28.00, maxLat: 28.60, minLng: -16.95, maxLng: -16.10 },
  },
  'Lanzarote': {
    lat: 29.0469,
    lng: -13.5899,
    zoom: 11,
    bounds: { minLat: 28.80, maxLat: 29.30, minLng: -13.90, maxLng: -13.40 },
  },
  'Fuerteventura': {
    lat: 28.3587,
    lng: -14.0536,
    zoom: 10,
    bounds: { minLat: 28.05, maxLat: 28.75, minLng: -14.50, maxLng: -13.80 },
  },
  'La Palma': {
    lat: 28.6835,
    lng: -17.8339,
    zoom: 11,
    bounds: { minLat: 28.45, maxLat: 28.90, minLng: -18.05, maxLng: -17.70 },
  },
  'La Gomera': {
    lat: 28.1173,
    lng: -17.2250,
    zoom: 11,
    bounds: { minLat: 28.00, maxLat: 28.25, minLng: -17.35, maxLng: -17.05 },
  },
  'El Hierro': {
    lat: 27.7470,
    lng: -18.0163,
    zoom: 11,
    bounds: { minLat: 27.60, maxLat: 27.90, minLng: -18.20, maxLng: -17.85 },
  },
  'La Graciosa': {
    lat: 29.2500,
    lng: -13.5000,
    zoom: 12,
    bounds: { minLat: 29.20, maxLat: 29.30, minLng: -13.55, maxLng: -13.45 },
  },
  'Canarias': {
    lat: 28.3000,
    lng: -15.8000,
    zoom: 8,
    bounds: { minLat: 27.50, maxLat: 29.40, minLng: -18.25, maxLng: -13.35 },
  },
};

const MUNICIPALITY_FALLBACK: Record<string, { lat: number; lng: number }> = {
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
  'Puerto del Rosario': { lat: 28.5000, lng: -13.8600 },
  'Corralejo': { lat: 28.7300, lng: -13.8700 },
  'Santa Cruz de La Palma': { lat: 28.6830, lng: -17.7640 },
  'Los Llanos de Aridane': { lat: 28.6580, lng: -17.9180 },
  'San Sebastián de La Gomera': { lat: 28.0910, lng: -17.1130 },
  'Valverde': { lat: 27.8080, lng: -17.9150 },
};

const CAMPER_POIS = [
  { id: 'poi-1', name: 'Presa de las Niñas (GC)', category: 'acampada', island: 'Gran Canaria', lat: 27.9152, lng: -15.6741 },
  { id: 'poi-2', name: 'Tamadaba (GC)', category: 'acampada', island: 'Gran Canaria', lat: 28.0315, lng: -15.6881 },
  { id: 'poi-3', name: 'Playa de Vargas (GC)', category: 'playa', island: 'Gran Canaria', lat: 27.8421, lng: -15.3955 },
  { id: 'poi-4', name: 'Chío Corona Forestal (TF)', category: 'acampada', island: 'Tenerife', lat: 28.2110, lng: -16.7450 },
  { id: 'poi-5', name: 'Playa El Médano (TF)', category: 'playa', island: 'Tenerife', lat: 28.0402, lng: -16.5391 },
  { id: 'poi-6', name: 'Playa de Famara (LZ)', category: 'playa', island: 'Lanzarote', lat: 29.1120, lng: -13.5650 },
  { id: 'poi-7', name: 'Cofete (FV)', category: 'playa', island: 'Fuerteventura', lat: 28.1120, lng: -14.3750 },
];

export default function SearchMapExplorer({
  vehicles,
  selectedIsland,
}: SearchMapExplorerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'split'>('grid');
  const [activeVehicle, setActiveVehicle] = useState<VehicleSearchItem | null>(null);
  const [showPois, setShowPois] = useState(true);

  const islandConfig = useMemo(() => {
    return ISLAND_COORDINATES[selectedIsland || ''] || ISLAND_COORDINATES['Canarias'];
  }, [selectedIsland]);

  // Posicionamiento de cada vehículo en el mapa con coordenadas reales o aproximadas por municipio
  const mappedVehicles = useMemo(() => {
    return vehicles.map((v, index) => {
      let lat = v.latitude;
      let lng = v.longitude;

      if (!lat || !lng) {
        const fb = MUNICIPALITY_FALLBACK[v.municipality] || ISLAND_COORDINATES[v.island] || { lat: 28.0, lng: -15.5 };
        // Añadir ligera dispersión para que los marcadores en el mismo municipio no se solapen exactamente
        const offsetLat = ((index % 5) - 2) * 0.015;
        const offsetLng = (((index * 3) % 5) - 2) * 0.015;
        lat = fb.lat + offsetLat;
        lng = fb.lng + offsetLng;
      }

      return { ...v, mapLat: lat, mapLng: lng };
    });
  }, [vehicles]);

  // Convertir coordenadas geográficas a porcentaje X, Y relativo al mapa visual
  const getCoordinatesPercent = (lat: number, lng: number) => {
    const { minLat, maxLat, minLng, maxLng } = islandConfig.bounds;
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  return (
    <div className="space-y-6">
      {/* BARRA SUPERIOR DE SELECTOR DE MODO (GRID / MAPA ESTILO IDEALISTA) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E9E1D2] shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#13322E] flex items-center space-x-2">
            <span>{vehicles.length} campers encontradas</span>
            {selectedIsland && <span className="text-xs font-bold text-[#16B8AA] bg-[#16B8AA]/10 px-2.5 py-0.5 rounded-full">{selectedIsland}</span>}
          </h2>
          <p className="text-xs text-[#6B726E] font-medium">
            Explora las furgonetas en lista o visualízalas geolocalizadas sobre el mapa de las Islas Canarias.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* BOTÓN MODO LISTA / CUADRÍCULA */}
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#13322E] text-white shadow-sm'
                : 'bg-[#FAF7F0] text-[#13322E] border border-[#E9E1D2] hover:bg-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Lista</span>
          </button>

          {/* BOTÓN MODO MAPA IDEALISTA */}
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-[#16B8AA] text-white shadow-sm'
                : 'bg-[#FAF7F0] text-[#13322E] border border-[#E9E1D2] hover:bg-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Ver en Mapa 🗺️</span>
          </button>

          {/* BOTÓN DIVIDIDO (PC) */}
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden lg:inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-[#D97706] text-white shadow-sm'
                : 'bg-[#FAF7F0] text-[#13322E] border border-[#E9E1D2] hover:bg-white'
            }`}
          >
            <span>Dividido</span>
          </button>
        </div>
      </div>

      {/* VISTA 1: SOLO MAPA O VISTA DIVIDIDA */}
      {(viewMode === 'map' || viewMode === 'split') && (
        <div className={`relative bg-[#E5E3DF] rounded-3xl border border-[#E9E1D2] overflow-hidden shadow-inner ${viewMode === 'split' ? 'h-[620px]' : 'h-[75vh] min-h-[500px]'}`}>
          
          {/* MAPA INTERACTIVO CON FONDO SATELITAL / TOPOGRÁFICO DE CANARIAS */}
          <div className="absolute inset-0 bg-[radial-gradient(#16b8aa_1px,transparent_1px)] [background-size:16px_16px] bg-[#EBE7DF]">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#13322E] via-transparent to-transparent" />
            
            {/* LÍNEAS DE COSTA / SILUETA DE ISLA REPRESENTATIVA */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <Compass className="w-96 h-96 text-[#13322E]" />
            </div>
          </div>

          {/* CONTROLES FLOTANTES EN EL MAPA */}
          <div className="absolute top-4 left-4 z-30 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowPois(!showPois)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer ${
                showPois
                  ? 'bg-[#13322E] text-white'
                  : 'bg-white text-[#13322E] border border-[#E9E1D2]'
              }`}
            >
              <Tent className="w-3.5 h-3.5 text-[#16B8AA]" />
              <span>{showPois ? 'Ocultar Puntos Camper' : 'Ver Puntos Camper (⛺ 🏖️)'}</span>
            </button>
          </div>

          {/* MARCADORES DE PUNTOS CAMPER (POIS) */}
          {showPois && CAMPER_POIS.map((poi) => {
            const { x, y } = getCoordinatesPercent(poi.lat, poi.lng);
            return (
              <div
                key={poi.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md border border-[#E9E1D2] flex items-center justify-center text-xs hover:scale-125 transition-transform">
                  {poi.category === 'acampada' ? '⛺' : '🏖️'}
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[#13322E] text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg z-40">
                  {poi.name}
                </div>
              </div>
            );
          })}

          {/* MARCADORES DE VEHÍCULOS CON PRECIO (ESTILO IDEALISTA) */}
          {mappedVehicles.map((v) => {
            const { x, y } = getCoordinatesPercent(v.mapLat, v.mapLng);
            const isSelected = activeVehicle?.id === v.id;

            return (
              <div
                key={v.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setActiveVehicle(v)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-110 z-40' : 'hover:scale-105'
                }`}
              >
                {/* BADGE DE PRECIO INTERACTIVO */}
                <div
                  className={`px-3 py-1.5 rounded-full font-black text-xs shadow-lg border flex items-center space-x-1 transition-all ${
                    isSelected
                      ? 'bg-[#13322E] text-white border-white ring-4 ring-[#16B8AA]/40'
                      : v.isFeatured
                      ? 'bg-[#D97706] text-white border-white'
                      : 'bg-white text-[#13322E] border-[#E9E1D2] hover:bg-[#16B8AA] hover:text-white'
                  }`}
                >
                  <span>{v.basePricePerDay}€</span>
                  <span className="text-[9px] opacity-80 font-normal">/día</span>
                </div>
              </div>
            );
          })}

          {/* CARD FLOTANTE DEL VEHÍCULO SELECCIONADO EN EL MAPA */}
          {activeVehicle && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm bg-white rounded-3xl p-4 shadow-2xl border border-[#E9E1D2] animate-in slide-in-from-bottom-4">
              <button
                type="button"
                onClick={() => setActiveVehicle(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#FAF7F0] text-[#13322E] flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex space-x-3">
                <img
                  src={activeVehicle.photos?.[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400'}
                  alt={activeVehicle.title}
                  className="w-28 h-24 object-cover rounded-2xl border border-[#E9E1D2] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 text-[10px] font-black uppercase text-[#16B8AA] tracking-wider">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{activeVehicle.municipality}, {activeVehicle.island}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#13322E] truncate mt-0.5">
                    {activeVehicle.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-[#6B726E] mt-1">
                    <span className="font-bold text-[#16B8AA] text-sm">{activeVehicle.basePricePerDay}€ <span className="text-[10px] font-normal text-[#6B726E]">/ día</span></span>
                    <span>•</span>
                    <span>{activeVehicle.passengers || 2} plazas</span>
                  </div>
                  <Link
                    href={`/camper/${activeVehicle.slug}`}
                    className="mt-2 inline-flex items-center space-x-1 text-xs font-bold text-[#16B8AA] hover:underline"
                  >
                    <span>Ver ficha completa</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: CUADRÍCULA DE VEHÍCULOS (MODO DEFAULT Y PARTE DE VISTA DIVIDIDA) */}
      {(viewMode === 'grid' || viewMode === 'split') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            const avgRating =
              vehicle.reviews?.length > 0
                ? vehicle.reviews.reduce((acc, r) => acc + r.rating, 0) / vehicle.reviews.length
                : 0;

            return (
              <div
                key={vehicle.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E9E1D2] bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div>
                  <div className="relative mb-3 h-48 w-full overflow-hidden rounded-2xl bg-[#EBE7DF]">
                    <img
                      src={vehicle.photos?.[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600'}
                      alt={vehicle.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <FavoriteButton vehicleId={vehicle.id} />
                    </div>
                    {vehicle.isFeatured && (
                      <span className="absolute top-3 left-3 rounded-full bg-[#D97706] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                        Destacado
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#6B726E]">
                      <span className="font-bold text-[#16B8AA] uppercase text-[10px] tracking-wider">
                        {vehicle.island} • {vehicle.municipality}
                      </span>
                      {avgRating > 0 && (
                        <div className="flex items-center space-x-1 font-bold text-[#13322E]">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{avgRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-[#13322E] line-clamp-1">
                      <Link href={`/camper/${vehicle.slug}`} className="hover:text-[#16B8AA] transition-colors">
                        {vehicle.title}
                      </Link>
                    </h3>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E9E1D2] pt-3">
                  <div>
                    <span className="text-base font-black text-[#13322E]">{vehicle.basePricePerDay} €</span>
                    <span className="text-xs text-[#6B726E] font-medium"> / día</span>
                  </div>
                  <Link
                    href={`/camper/${vehicle.slug}`}
                    className="rounded-full bg-[#13322E] px-4 py-2 text-xs font-bold text-white hover:bg-[#16B8AA] transition-all"
                  >
                    Ver camper
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
