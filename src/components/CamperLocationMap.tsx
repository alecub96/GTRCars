'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  Info,
} from 'lucide-react';

interface CamperLocationMapProps {
  island: string;
  municipality: string;
  vehicleTitle?: string;
  vehicleType?: string;
  latitude?: number | null;
  longitude?: number | null;
  addressApprox?: string | null;
}

interface POI {
  id: string;
  name: string;
  category: 'ruta' | 'entrega' | 'mirador';
  island: string;
  lat: number;
  lng: number;
  description: string;
}

const MUNICIPALITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'San Bartolomé de Tirajana': { lat: 27.7600, lng: -15.5800 },
  'Maspalomas': { lat: 27.7600, lng: -15.5860 },
  'Las Palmas de Gran Canaria': { lat: 28.1235, lng: -15.4363 },
  'Telde': { lat: 27.9940, lng: -15.4180 },
  'Mogán': { lat: 27.8170, lng: -15.7640 },
  'Santa Cruz de Tenerife': { lat: 28.4636, lng: -16.2518 },
  'San Cristóbal de La Laguna': { lat: 28.4870, lng: -16.3150 },
  'Arona': { lat: 28.0990, lng: -16.6800 },
  'Adeje': { lat: 28.1220, lng: -16.7260 },
  'Costa Adeje / Aeropuerto Sur (TFS)': { lat: 28.0890, lng: -16.7290 },
  'Madrid': { lat: 40.4378, lng: -3.6795 },
  'Marbella': { lat: 36.4898, lng: -4.9526 },
  'Barcelona': { lat: 41.3874, lng: 2.1686 },
  'Mallorca': { lat: 39.5696, lng: 2.6502 },
  'Ibiza': { lat: 38.9067, lng: 1.4206 },
  'Puerto del Rosario': { lat: 28.5004, lng: -13.8627 },
  'Corralejo': { lat: 28.7300, lng: -13.8680 },
  'Arrecife': { lat: 28.9630, lng: -13.5477 },
};

const SUPERCAR_POIS: POI[] = [
  {
    id: 'gc-1',
    name: 'Cumbre de Tejeda & Pico de las Nieves (GC-600)',
    category: 'ruta',
    island: 'Gran Canaria',
    lat: 27.9715,
    lng: -15.5718,
    description: 'Tramo de montaña de asfalto impecable a 1.949 metros de altitud con vistas panorámicas al Roque Nublo.',
  },
  {
    id: 'gc-2',
    name: 'Marina Puerto de Mogán & Costa Sur (GC-500)',
    category: 'entrega',
    island: 'Gran Canaria',
    lat: 27.8168,
    lng: -15.7642,
    description: 'Ruta costera panorámica hacia el puerto deportivo de Mogán y hoteles 5* Gran Lujo de Meloneras.',
  },
  {
    id: 'gc-3',
    name: 'Terminal Ejecutiva Aeropuerto Gran Canaria (LPA)',
    category: 'entrega',
    island: 'Gran Canaria',
    lat: 27.9319,
    lng: -15.3866,
    description: 'Punto oficial de entrega VIP directa en terminal privada con briefing técnico.',
  },
  {
    id: 'tf-1',
    name: 'Ascensión Parque Nacional del Teide (TF-21)',
    category: 'ruta',
    island: 'Tenerife',
    lat: 28.2540,
    lng: -16.6250,
    description: 'Una de las mejores carreteras de conducción de Europa a 2.356 m con curvas técnicas y rectas volcánicas.',
  },
  {
    id: 'tf-2',
    name: 'Costa Adeje & Bahía del Duque 5* GL',
    category: 'entrega',
    island: 'Tenerife',
    lat: 28.0910,
    lng: -16.7370,
    description: 'Zona residencial y hotelera de lujo para entrega personalizada en villa o resort.',
  },
  {
    id: 'tf-3',
    name: 'Aeropuerto Tenerife Sur (TFS) — Recepción VIP',
    category: 'entrega',
    island: 'Tenerife',
    lat: 28.0445,
    lng: -16.5725,
    description: 'Entrega inmediata a pie de terminal para clientes internacionales.',
  },
];

export default function CamperLocationMap({
  island,
  municipality,
  vehicleTitle = 'Superdeportivo GTR Cars',
  latitude,
  longitude,
  addressApprox,
}: CamperLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [leafletReady, setLeafletReady] = useState(false);

  const vehicleCoords = React.useMemo(() => {
    if (latitude && longitude) {
      return { lat: latitude, lng: longitude };
    }
    const fromMap = MUNICIPALITY_COORDINATES[municipality] || MUNICIPALITY_COORDINATES[island];
    if (fromMap) return fromMap;

    if (island === 'Gran Canaria') return { lat: 27.9500, lng: -15.5500 };
    if (island === 'Tenerife') return { lat: 28.1220, lng: -16.7260 };
    if (island === 'Madrid') return { lat: 40.4378, lng: -3.6795 };
    if (island === 'Marbella') return { lat: 36.4898, lng: -4.9526 };
    if (island === 'Barcelona') return { lat: 41.3874, lng: 2.1686 };
    if (island === 'Mallorca') return { lat: 39.5696, lng: 2.6502 };
    if (island === 'Ibiza') return { lat: 38.9067, lng: 1.4206 };
    return { lat: 28.1220, lng: -16.7260 };
  }, [latitude, longitude, municipality, island]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).L) {
      setLeafletReady(true);
      return;
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletReady(true);
      document.body.appendChild(script);
    } else {
      setLeafletReady(true);
    }
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapContainerRef.current, {
      center: [vehicleCoords.lat, vehicleCoords.lng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    const streetLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { maxZoom: 19, subdomains: 'abcd' }
    );
    streetLayer.addTo(map);

    L.circle([vehicleCoords.lat, vehicleCoords.lng], {
      radius: 1800,
      color: '#0A0A0A',
      fillColor: '#0A0A0A',
      fillOpacity: 0.1,
      weight: 2,
      dashArray: '6, 6',
    }).addTo(map);

    const supercarPinIcon = L.divIcon({
      className: 'custom-supercar-detail-pin',
      html: `
        <div style="
          position: relative;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            left: 50%;
            bottom: 48px;
            transform: translateX(-50%);
            white-space: nowrap;
            background: #0A0A0A;
            color: #ffffff;
            padding: 8px 14px;
            border: 1px solid #27272A;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
            font-family: monospace;
            font-size: 11px;
            line-height: 1.3;
            text-align: center;
          ">
            <strong style="display: block; font-weight: 800; text-transform: uppercase;">BASE GTR CARS</strong>
            <span>${municipality} (${island})</span>
          </div>
          <div style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #0A0A0A;
            border: 3px solid #FFFFFF;
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-weight: 900;
            font-size: 11px;
          ">
            GTR
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    L.marker([vehicleCoords.lat, vehicleCoords.lng], { icon: supercarPinIcon }).addTo(map);

    const islandPois = SUPERCAR_POIS.filter((p) => p.island.toLowerCase() === island.toLowerCase());
    islandPois.forEach((poi) => {
      const poiIcon = L.divIcon({
        className: 'custom-poi-pin',
        html: `
          <div style="
            background: #ffffff;
            color: #0A0A0A;
            border: 1.5px solid #0A0A0A;
            border-radius: 9999px;
            padding: 3px 8px;
            font-family: monospace;
            font-weight: 800;
            font-size: 10px;
            white-space: nowrap;
            box-shadow: 0 2px 10px rgba(0,0,0,0.18);
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            ${poi.category === 'ruta' ? 'RUTA VIP' : 'ENTREGA VIP'}
          </div>
        `,
        iconSize: [70, 24],
        iconAnchor: [35, 12],
      });

      const m = L.marker([poi.lat, poi.lng], { icon: poiIcon }).addTo(map);
      m.on('click', () => setSelectedPoi(poi));
      m.bindTooltip(`<b>${poi.name}</b>`, { direction: 'top', offset: [0, -10] });
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletReady, vehicleCoords, island, municipality, vehicleTitle]);

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
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const newLayer = L.tileLayer(tileUrl, { maxZoom: 19, subdomains: 'abcd' });
    newLayer.addTo(mapInstanceRef.current);
    newLayer.bringToBack();
  }, [mapType]);

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
    }
  };

  const recenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([vehicleCoords.lat, vehicleCoords.lng], 13, { duration: 0.8 });
    }
  };

  const islandPois = SUPERCAR_POIS.filter((p) => p.island.toLowerCase() === island.toLowerCase());

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 font-mono text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black uppercase tracking-wider text-black flex items-center space-x-2 font-sans">
            <span className="text-gray-400 font-mono">05 //</span>
            <span>Área de Entrega &amp; Rutas ({island})</span>
          </h3>
          <p className="text-xs text-gray-600 mt-1 font-sans">
            Base de operaciones en <strong>{municipality} ({island})</strong> con entrega a domicilio o terminal ejecutiva.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={recenterMap}
            className="px-3.5 py-2 rounded-xl bg-gray-100 border border-gray-200 text-xs font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Centrar Base</span>
          </button>

          <button
            type="button"
            onClick={() => setMapType(mapType === 'streets' ? 'satellite' : 'streets')}
            className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-black hover:bg-black hover:text-white cursor-pointer transition-all"
            title="Cambiar Satélite / Mapa"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-start space-x-3 text-xs text-gray-700 font-sans">
        <Info className="w-4 h-4 text-black shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-black font-mono uppercase tracking-wider">Protocolo VIP de Entrega:</strong> El superdeportivo se entrega en <strong>{municipality}</strong> ({addressApprox || 'Terminal Ejecutiva / Hotel 5* GL previa coordinación'}). La ubicación exacta de custodia se facilita al formalizar la reserva.
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-gray-100 h-[380px] shadow-md">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

        <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-1.5 font-mono">
          <button
            type="button"
            aria-label="Acercar mapa"
            onClick={() => handleZoom(1)}
            className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 text-black shadow-md flex items-center justify-center hover:bg-black hover:text-white cursor-pointer transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Alejar mapa"
            onClick={() => handleZoom(-1)}
            className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 text-black shadow-md flex items-center justify-center hover:bg-black hover:text-white cursor-pointer transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {selectedPoi && (
          <div className="absolute bottom-4 left-4 right-14 z-30 max-w-sm bg-white/98 backdrop-blur-xl p-4 rounded-2xl border border-gray-300 shadow-2xl space-y-1.5 text-black font-sans">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {selectedPoi.category === 'ruta' ? 'Ruta Escénica GT' : 'Punto de Entrega VIP'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPoi(null)}
                className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
              >
                Cerrar
              </button>
            </div>
            <h4 className="font-bold text-sm text-black">{selectedPoi.name}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{selectedPoi.description}</p>
          </div>
        )}
      </div>

      {islandPois.length > 0 && (
        <div className="space-y-3 pt-2 font-mono">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Rutas panorámicas y puntos de entrega VIP en {island}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {islandPois.map((poi) => (
              <div
                key={poi.id}
                onClick={() => {
                  setSelectedPoi(poi);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([poi.lat, poi.lng], 13, { duration: 0.8 });
                  }
                }}
                className="p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-black transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                  <span>{poi.category === 'ruta' ? 'Tramo Recomendado' : 'Logística VIP'}</span>
                </div>
                <h5 className="font-bold text-sm text-black line-clamp-1 font-sans">
                  {poi.name}
                </h5>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed font-sans">
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
