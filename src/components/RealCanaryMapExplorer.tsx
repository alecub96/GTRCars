'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Star,
  X,
  ChevronRight,
  Layers,
  Compass,
  Tent,
  Waves,
  ZoomIn,
  ZoomOut,
  Navigation,
} from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import ShareVehicleButton from './ShareVehicleButton';

export interface MapCamperItem {
  id: string;
  slug: string;
  title: string;
  island: string;
  municipality: string;
  basePricePerDay: number;
  passengers?: number;
  beds?: number;
  photos: { url: string }[];
  reviews: { rating: number }[];
  latitude?: number | null;
  longitude?: number | null;
  addressApprox?: string | null;
  isFeatured?: boolean;
}

interface RealCanaryMapExplorerProps {
  vehicles: MapCamperItem[];
  selectedIsland?: string;
  heightClass?: string;
}

const ISLAND_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Gran Canaria': { lat: 28.0000, lng: -15.5500, zoom: 11 },
  'Tenerife': { lat: 28.2915, lng: -16.6291, zoom: 10 },
  'Lanzarote': { lat: 29.0469, lng: -13.5899, zoom: 11 },
  'Fuerteventura': { lat: 28.3587, lng: -14.0536, zoom: 10 },
  'La Palma': { lat: 28.6835, lng: -17.8339, zoom: 11 },
  'La Gomera': { lat: 28.1173, lng: -17.2250, zoom: 12 },
  'El Hierro': { lat: 27.7470, lng: -18.0163, zoom: 12 },
  'La Graciosa': { lat: 29.2500, lng: -13.5000, zoom: 13 },
  'Canarias': { lat: 28.3000, lng: -15.8000, zoom: 8 },
};

const CAMPER_POIS = [
  { id: 'p1', name: 'Camping Playa de Vargas', island: 'Gran Canaria', lat: 27.8920, lng: -15.3940, type: 'camping' },
  { id: 'p2', name: 'Área Recreativa Tamadaba', island: 'Gran Canaria', lat: 28.0550, lng: -15.6880, type: 'camping' },
  { id: 'p3', name: 'Playa de Las Canteras', island: 'Gran Canaria', lat: 28.1380, lng: -15.4430, type: 'beach' },
  { id: 'p4', name: 'Playa de Papagayo', island: 'Lanzarote', lat: 28.8420, lng: -13.7880, type: 'beach' },
  { id: 'p5', name: 'Caleta de Famara', island: 'Lanzarote', lat: 29.1150, lng: -13.5620, type: 'beach' },
  { id: 'p6', name: 'El Medano', island: 'Tenerife', lat: 28.0450, lng: -16.5360, type: 'beach' },
  { id: 'p7', name: 'Parque Nacional del Teide', island: 'Tenerife', lat: 28.2720, lng: -16.6420, type: 'camping' },
  { id: 'p8', name: 'Dunas de Corralejo', island: 'Fuerteventura', lat: 28.6920, lng: -13.8430, type: 'beach' },
  { id: 'p9', name: 'Playa de Cofete', island: 'Fuerteventura', lat: 28.1150, lng: -14.3750, type: 'beach' },
];

export default function RealCanaryMapExplorer({
  vehicles,
  selectedIsland,
  heightClass = 'h-[80vh] min-h-[550px]',
}: RealCanaryMapExplorerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const poisLayerRef = useRef<any>(null);

  const [activeIsland, setActiveIsland] = useState<string>(selectedIsland || 'Canarias');
  const [selectedVehicle, setSelectedVehicle] = useState<MapCamperItem | null>(null);
  const [showPois, setShowPois] = useState<boolean>(true);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const [mapVehicles, setMapVehicles] = useState<MapCamperItem[]>(vehicles);

  // El mapa se refresca desde el mismo endpoint público que usa el buscador.
  // Así no depende de una respuesta server-side antigua al cambiar de isla.
  useEffect(() => {
    setMapVehicles(vehicles);
    fetch('/api/vehicles', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (Array.isArray(data?.vehicles)) setMapVehicles(data.vehicles);
      })
      .catch(() => {});
  }, [vehicles]);

  // 1. Cargar dinámicamente Leaflet CSS y JS sin bloquear la página
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Leaflet JS
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    } else {
      setLeafletLoaded(true);
    }
  }, []);

  // 2. Inicializar mapa Leaflet cuando el script esté listo
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const centerConfig = ISLAND_CENTERS[activeIsland] || ISLAND_CENTERS['Canarias'];

    const map = L.map(mapContainerRef.current, {
      center: [centerConfig.lat, centerConfig.lng],
      zoom: centerConfig.zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // OpenStreetMap no requiere token ni clave privada.
    const streetLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors',
      }
    );

    streetLayer.addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    poisLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // 3. Cambiar capa entre mapa de calles y satélite
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    const tileUrl =
      mapType === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const newLayer = L.tileLayer(tileUrl, { maxZoom: 19, subdomains: 'abc', attribution: '&copy; OpenStreetMap contributors' });
    newLayer.addTo(mapInstanceRef.current);
    newLayer.bringToBack();
  }, [mapType]);

  // 4. Dibujar marcadores de campers en el mapa
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    markersLayerRef.current.clearLayers();

    const visibleVehicles = activeIsland === 'Canarias'
      ? mapVehicles
      : mapVehicles.filter((vehicle) => vehicle.island === activeIsland);

    visibleVehicles.forEach((vehicle, idx) => {
      let lat = vehicle.latitude;
      let lng = vehicle.longitude;

      if (!lat || !lng) {
        const center = ISLAND_CENTERS[vehicle.island] || ISLAND_CENTERS['Gran Canaria'];
        const offsetLat = ((idx % 4) - 1.5) * 0.04;
        const offsetLng = (((idx * 2) % 4) - 1.5) * 0.04;
        lat = center.lat + offsetLat;
        lng = center.lng + offsetLng;
      }

      const isSelected = selectedVehicle?.id === vehicle.id;

      // Icono HTML personalizado estilo Idealista (píldora con precio)
      const customIcon = L.divIcon({
        className: 'custom-camper-pin',
        html: `
          <div style="
            background-color: ${isSelected ? '#16B8AA' : '#13322E'};
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 9999px;
            font-weight: 800;
            font-size: 13px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.3);
            border: 2px solid #ffffff;
            cursor: pointer;
            white-space: nowrap;
            transform: translate(-50%, -50%) scale(${isSelected ? '1.15' : '1'});
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>${vehicle.basePricePerDay}€</span>
            <small style="font-size: 9px; opacity: 0.85; font-weight: 500;">/día</small>
          </div>
        `,
        iconSize: [60, 30],
        iconAnchor: [30, 15],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedVehicle(vehicle);
        mapInstanceRef.current?.flyTo([lat, lng], 13, { duration: 0.8 });
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [mapVehicles, selectedVehicle, leafletLoaded, activeIsland]);

  // 5. Dibujar Puntos Camper (POIs)
  useEffect(() => {
    if (!mapInstanceRef.current || !poisLayerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    poisLayerRef.current.clearLayers();

    if (!showPois) return;

    CAMPER_POIS.forEach((poi) => {
      const poiIcon = L.divIcon({
        className: 'custom-poi-pin',
        html: `
          <div style="
            background: #ffffff;
            border: 1px solid #E9E1D2;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            ${poi.type === 'camping' ? 'Acampada' : 'Playa'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
      marker.bindTooltip(`<b>${poi.name}</b><br><small>${poi.type === 'camping' ? 'Área de acampada' : 'Playa permitida'}</small>`, {
        direction: 'top',
        offset: [0, -10],
      });
      poisLayerRef.current.addLayer(marker);
    });
  }, [showPois, leafletLoaded]);

  // 6. Cambiar el centro del mapa cuando se selecciona una isla
  const handleSelectIsland = (island: string) => {
    setActiveIsland(island);
    const target = ISLAND_CENTERS[island];
    if (target && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([target.lat, target.lng], target.zoom, { duration: 1.2 });
    }
  };

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
    }
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl overflow-hidden border border-[#E9E1D2] shadow-xl bg-[#EBE7DF]`}>
      {/* MAPA INTERACTIVO REAL */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />

      {/* 1. SELECTOR RÁPIDO DE ISLAS SUPERIOR */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pointer-events-auto bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#E9E1D2] shadow-lg max-w-[85vw] sm:max-w-none scrollbar-none">
          {['Canarias', 'Gran Canaria', 'Tenerife', 'Lanzarote', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro'].map((isl) => {
            const active = activeIsland === isl;
            return (
              <button
                key={isl}
                type="button"
                onClick={() => handleSelectIsland(isl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[#13322E] text-white shadow-sm'
                    : 'text-[#13322E] hover:bg-[#FAF7F0]'
                }`}
              >
                {isl}
              </button>
            );
          })}
        </div>

        {/* CONTROLES DE CAPA Y POIS (DERECHA) */}
        <div className="hidden sm:flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowPois(!showPois)}
            className={`px-3 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
              showPois
                ? 'bg-[#13322E] text-white'
                : 'bg-white/90 text-[#13322E] border border-[#E9E1D2]'
            }`}
          >
            <Tent className="w-3.5 h-3.5 text-[#16B8AA]" />
            <span>Puntos Camper</span>
          </button>

          <button
            type="button"
            onClick={() => setMapType(mapType === 'streets' ? 'satellite' : 'streets')}
            className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#E9E1D2] text-[#13322E] shadow-md hover:bg-white cursor-pointer"
            title="Cambiar a Satélite / Calles"
          >
            <Layers className="w-4 h-4 text-[#16B8AA]" />
          </button>
        </div>
      </div>

      {/* 2. BOTONES DE ZOOM LATERALES */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => handleZoom(1)}
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-[#E9E1D2] text-[#13322E] shadow-lg flex items-center justify-center hover:bg-white cursor-pointer"
          title="Acercar"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(-1)}
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-[#E9E1D2] text-[#13322E] shadow-lg flex items-center justify-center hover:bg-white cursor-pointer"
          title="Alejar"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* 3. CARD FLOTANTE DEL VEHÍCULO SELECCIONADO (ESTILO AIRBNB/IDEALISTA) */}
      {selectedVehicle && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-30 sm:w-96 bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-[#E9E1D2] animate-in slide-in-from-bottom-6">
          <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-20">
            <ShareVehicleButton
              vehicleTitle={selectedVehicle.title}
              slug={selectedVehicle.slug}
              island={selectedVehicle.island}
              price={selectedVehicle.basePricePerDay}
              variant="icon"
            />
            <FavoriteButton vehicleId={selectedVehicle.id} />
            <button
              type="button"
              onClick={() => setSelectedVehicle(null)}
              className="w-8 h-8 rounded-full bg-white/90 text-[#13322E] flex items-center justify-center hover:bg-slate-100 shadow-md cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex space-x-3">
            <img
              src={selectedVehicle.photos?.[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400'}
              alt={selectedVehicle.title}
              className="w-28 h-28 object-cover rounded-2xl border border-[#E9E1D2] shrink-0"
            />
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 text-[10px] font-black uppercase text-[#16B8AA] tracking-wider">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{selectedVehicle.municipality}, {selectedVehicle.island}</span>
                </div>
                <h4 className="font-bold text-sm text-[#13322E] line-clamp-1 mt-0.5">
                  {selectedVehicle.title}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-[#6B726E] mt-1">
                  <span className="font-extrabold text-[#13322E] text-base">{selectedVehicle.basePricePerDay}€ <span className="text-[10px] font-normal text-[#6B726E]">/ día</span></span>
                  <span>•</span>
                  <span>{selectedVehicle.passengers || 2} plazas</span>
                </div>
              </div>

              <Link
                href={`/camper/${selectedVehicle.slug}`}
                className="mt-2 w-full py-2 px-3 rounded-xl bg-[#16B8AA] hover:bg-[#0F766E] text-white text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-1 shadow-sm transition-all"
              >
                <span>Ver disponibilidad</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
