'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Tent,
  Waves,
  Droplets,
  Mountain,
  Layers,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
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
  category: 'acampada' | 'playa' | 'agua' | 'mirador';
  island: string;
  lat: number;
  lng: number;
  description: string;
  facilities?: string[];
}

const MUNICIPALITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Gran Canaria
  'San Bartolomé de Tirajana': { lat: 27.7600, lng: -15.5800 },
  'Maspalomas': { lat: 27.7600, lng: -15.5860 },
  'Las Palmas de Gran Canaria': { lat: 28.1235, lng: -15.4363 },
  'Telde': { lat: 27.9940, lng: -15.4180 },
  'Agüimes': { lat: 27.9040, lng: -15.4460 },
  'Agaete': { lat: 28.1000, lng: -15.7000 },
  'Mogán': { lat: 27.8800, lng: -15.7200 },
  'Arucas': { lat: 28.1180, lng: -15.5220 },
  'Gáldar': { lat: 28.1440, lng: -15.6540 },
  'Santa Brígida': { lat: 28.0330, lng: -15.4980 },
  'Tejeda': { lat: 27.9950, lng: -15.6140 },

  // Tenerife
  'Santa Cruz de Tenerife': { lat: 28.4636, lng: -16.2518 },
  'San Cristóbal de La Laguna': { lat: 28.4870, lng: -16.3150 },
  'Arona': { lat: 28.0990, lng: -16.6800 },
  'Adeje': { lat: 28.1220, lng: -16.7260 },
  'Puerto de la Cruz': { lat: 28.4160, lng: -16.5450 },
  'Granadilla de Abona': { lat: 28.1250, lng: -16.5760 },
  'Los Cristianos': { lat: 28.0520, lng: -16.7170 },
  'La Orotava': { lat: 28.3900, lng: -16.5230 },

  // Fuerteventura
  'Puerto del Rosario': { lat: 28.5004, lng: -13.8627 },
  'La Oliva': { lat: 28.6100, lng: -13.9290 },
  'Corralejo': { lat: 28.7300, lng: -13.8680 },
  'Pájara': { lat: 28.3500, lng: -14.1070 },
  'Costa Calma': { lat: 28.1600, lng: -14.2270 },

  // Lanzarote
  'Arrecife': { lat: 28.9630, lng: -13.5477 },
  'Teguise': { lat: 29.0600, lng: -13.5600 },
  'Tías': { lat: 28.9530, lng: -13.6500 },
  'Yaiza': { lat: 28.9500, lng: -13.7660 },
  'Playa Blanca': { lat: 28.8650, lng: -13.8300 },

  // La Palma
  'Santa Cruz de La Palma': { lat: 28.6835, lng: -17.7646 },
  'Los Llanos de Aridane': { lat: 28.6580, lng: -17.9180 },
  'El Paso': { lat: 28.6500, lng: -17.8800 },

  // La Gomera
  'San Sebastián de La Gomera': { lat: 28.0916, lng: -17.1133 },
  'Valle Gran Rey': { lat: 28.1240, lng: -17.3330 },

  // El Hierro
  'Valverde': { lat: 27.8090, lng: -17.9150 },
  'Frontera': { lat: 27.7540, lng: -18.0100 },
};

const CANARY_POIS: POI[] = [
  // Gran Canaria
  {
    id: 'gc-1',
    name: 'Presa de las Niñas',
    category: 'acampada',
    island: 'Gran Canaria',
    lat: 27.9152,
    lng: -15.6741,
    description: 'Área de acampada oficial con barbacoas, agua potable y zona recreativa entre pinares.',
    facilities: ['Agua potable', 'Mesas y sombras', 'Fuego controlado', 'W.C.'],
  },
  {
    id: 'gc-2',
    name: 'Pinar de Tamadaba',
    category: 'acampada',
    island: 'Gran Canaria',
    lat: 28.0315,
    lng: -15.6881,
    description: 'Zona de acampada en la cumbre con vistas espectaculares al Teide y atardeceres únicos.',
    facilities: ['Vistas panorámicas', 'Senderos', 'Mesas de picnic'],
  },
  {
    id: 'gc-3',
    name: 'Playa de Vargas (Agüimes)',
    category: 'playa',
    island: 'Gran Canaria',
    lat: 27.8421,
    lng: -15.4052,
    description: 'Playa y zona habitual de estacionamiento camper para windsurf y pernocta tranquila.',
    facilities: ['Camping cercano', 'Acceso directo a playa', 'Duchas'],
  },
  {
    id: 'gc-4',
    name: 'Playa de Las Canteras (Aparcamiento)',
    category: 'playa',
    island: 'Gran Canaria',
    lat: 28.1380,
    lng: -15.4430,
    description: 'Punto estratégico en Las Palmas para disfrutar del paseo marítimo y surf en la Cícer.',
    facilities: ['Servicios urbanos', 'Restaurantes', 'Duchas públicas'],
  },
  // Tenerife
  {
    id: 'tf-1',
    name: 'El Médano (Playa Sur)',
    category: 'playa',
    island: 'Tenerife',
    lat: 28.0450,
    lng: -16.5360,
    description: 'Punto de encuentro camper por excelencia en Tenerife sur. Ideal para deportes de viento.',
    facilities: ['Duchas en paseo', 'Ambiente nómada', 'Supermercados'],
  },
  {
    id: 'tf-2',
    name: 'Área Recreativa Las Raíces',
    category: 'acampada',
    island: 'Tenerife',
    lat: 28.4230,
    lng: -16.3680,
    description: 'Zona boscosa en la subida al Teide con mesas, agua y permisos del Cabildo.',
    facilities: ['Agua potable', 'Fogones', 'Baños'],
  },
  // Fuerteventura
  {
    id: 'fv-1',
    name: 'Dunas de Corralejo',
    category: 'playa',
    island: 'Fuerteventura',
    lat: 28.6920,
    lng: -13.8430,
    description: 'Vistas panorámicas a Isla de Lobos y aguas turquesas.',
    facilities: ['Acceso fácil', 'Vistas directas a Lobos'],
  },
  // Lanzarote
  {
    id: 'lz-1',
    name: 'Caleta de Famara',
    category: 'playa',
    island: 'Lanzarote',
    lat: 29.1150,
    lng: -13.5620,
    description: 'Meca del surf en Canarias con el imponente Risco de Famara como telón de fondo.',
    facilities: ['Escuelas de surf', 'Atardeceres mágicos', 'Pueblo marinero'],
  },
];

export default function CamperLocationMap({
  island,
  municipality,
  vehicleTitle = 'Camper',
  vehicleType = '',
  latitude,
  longitude,
  addressApprox,
}: CamperLocationMapProps) {
  const vehicleIllustration = vehicleType.includes('BARCO')
    ? '/illustrations/vehicle-types/nautica.png'
    : vehicleType.includes('4X4')
      ? '/illustrations/vehicle-types/4x4.png'
      : vehicleType.includes('AUTOCARAVANA')
        ? '/illustrations/vehicle-types/autocaravana.png'
        : vehicleType.includes('CARAVANA')
          ? '/illustrations/vehicle-types/caravan.png'
          : vehicleType.includes('GRAN_VOLUMEN')
            ? '/illustrations/vehicle-types/camper-gran-volumen.png'
            : '/illustrations/vehicle-types/camper-pequena.png';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [leafletReady, setLeafletReady] = useState(false);

  // Calcular centro exacto del vehículo / municipio
  const vehicleCoords = React.useMemo(() => {
    if (latitude && longitude) {
      return { lat: latitude, lng: longitude };
    }
    const fromMap = MUNICIPALITY_COORDINATES[municipality];
    if (fromMap) return fromMap;

    // Fallbacks por isla
    if (island === 'Gran Canaria') return { lat: 27.9500, lng: -15.5500 };
    if (island === 'Tenerife') return { lat: 28.3000, lng: -16.5500 };
    if (island === 'Fuerteventura') return { lat: 28.4000, lng: -14.0500 };
    if (island === 'Lanzarote') return { lat: 29.0200, lng: -13.6000 };
    if (island === 'La Palma') return { lat: 28.6800, lng: -17.8300 };
    if (island === 'La Gomera') return { lat: 28.1100, lng: -17.2200 };
    return { lat: 27.7500, lng: -18.0100 };
  }, [latitude, longitude, municipality, island]);

  // Cargar Leaflet dinámicamente
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

  // Inicializar Leaflet Map
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

    // 1. CÍRCULO DE RADIO APROXIMADO DE RECOGIDA (1.5 km)
    L.circle([vehicleCoords.lat, vehicleCoords.lng], {
      radius: 1800,
      color: '#16B8AA',
      fillColor: '#16B8AA',
      fillOpacity: 0.15,
      weight: 2,
      dashArray: '6, 6',
    }).addTo(map);

    // 2. PIN PRINCIPAL DE LA CAMPER
    const camperPinIcon = L.divIcon({
      className: 'custom-camper-detail-pin',
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
            bottom: 72px;
            transform: translateX(-50%);
            white-space: nowrap;
            background: #ffffff;
            color: #13322E;
            padding: 8px 12px;
            border: 1px solid #E9E1D2;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(19, 50, 46, 0.14);
            font-family: inherit;
            font-size: 13px;
            line-height: 1.25;
            text-align: center;
          ">
            <strong style="display: block; font-weight: 700;">Zona de entrega</strong>
            <span>${municipality} (${island})</span>
          </div>
          <div style="
            position: absolute;
            width: 54px;
            height: 54px;
            border-radius: 50%;
            background-color: rgba(22, 184, 170, 0.35);
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            background-color: #13322E;
            color: #ffffff;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 18px rgba(0,0,0,0.35);
            border: 3px solid #ffffff;
          ">
            <img src="${vehicleIllustration}" alt="${vehicleTitle}" style="width: 46px; height: 46px; object-fit: contain;" />
          </div>
        </div>
      `,
      iconSize: [66, 66],
      iconAnchor: [33, 58],
    });

    const camperMarker = L.marker([vehicleCoords.lat, vehicleCoords.lng], { icon: camperPinIcon }).addTo(map);

    // 3. POIS CERCANOS EN LA ISLA
    const islandPois = CANARY_POIS.filter((p) => p.island.toLowerCase() === island.toLowerCase());
    islandPois.forEach((poi) => {
      const poiIcon = L.divIcon({
        className: 'custom-poi-pin',
        html: `
          <div style="
            background: #ffffff;
            border: 1px solid #E9E1D2;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.18);
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            ${poi.category === 'acampada' ? 'Acampada' : 'Playa'}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
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
  }, [leafletReady, vehicleCoords, island, municipality]);

  // Cambiar capa Satélite / Calles
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

  const islandPois = CANARY_POIS.filter((p) => p.island.toLowerCase() === island.toLowerCase());

  return (
    <div className="space-y-4 pt-6 border-t border-[#E9E1D2]">
      {/* CABECERA CON UBICACIÓN CLARA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#13322E] flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-[#16B8AA]" />
            <span>Zona de recogida y pernocta</span>
          </h3>
          <p className="text-xs text-[#6B726E] font-medium mt-0.5">
            Ubicación aproximada en <strong>{municipality} ({island})</strong> por motivos de privacidad.
          </p>
        </div>

        {/* CONTROLES DE CAPAS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={recenterMap}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E9E1D2] text-xs font-bold text-[#13322E] shadow-sm hover:bg-[#FAF7F0] flex items-center gap-1.5 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-[#16B8AA]" />
            <span>Centrar en la camper</span>
          </button>

          <button
            type="button"
            onClick={() => setMapType(mapType === 'streets' ? 'satellite' : 'streets')}
            className="p-1.5 rounded-xl bg-white border border-[#E9E1D2] text-[#13322E] shadow-sm hover:bg-[#FAF7F0] cursor-pointer"
            title="Cambiar a Satélite / Calles"
          >
            <Layers className="w-4 h-4 text-[#16B8AA]" />
          </button>
        </div>
      </div>

      {/* AVISO DE PRIVACIDAD Y ENTREGA LIMPIO */}
      <div className="p-3.5 bg-[#FAF7F0] rounded-2xl border border-[#E9E1D2] flex items-start space-x-3 text-xs text-[#13322E]">
        <Info className="w-4 h-4 text-[#16B8AA] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Punto de encuentro:</strong> Se recoge habitualmente en <strong>{municipality}</strong> ({addressApprox || 'zona centro o aeropuerto previa coordinación'}). La dirección exacta o entrega directa en el aeropuerto se facilita al confirmar la reserva con el propietario.
        </p>
      </div>

      {/* MAPA INTERACTIVO REAL */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E9E1D2] bg-[#E5E3DF] h-[400px] shadow-md">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

        {/* CONTROLES DE ZOOM */}
        <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => handleZoom(1)}
            className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md border border-[#E9E1D2] text-[#13322E] shadow-lg flex items-center justify-center hover:bg-white cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-1)}
            className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md border border-[#E9E1D2] text-[#13322E] shadow-lg flex items-center justify-center hover:bg-white cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* TARJETA INFORMATIVA DE POI SELECCIONADO EN EL MAPA */}
        {selectedPoi && (
          <div className="absolute bottom-4 left-4 right-14 z-30 max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#16B8AA] shadow-2xl space-y-1.5 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA]">
                {selectedPoi.category === 'acampada' ? 'Zona de Acampada' : 'Playa de Pernocta'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPoi(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
            <h4 className="font-bold text-sm text-[#13322E]">{selectedPoi.name}</h4>
            <p className="text-xs text-[#6B726E] leading-relaxed">{selectedPoi.description}</p>
          </div>
        )}
      </div>

      {/* LUGARES DE INTERÉS CAMPER RECOMENDADOS */}
      {islandPois.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
            Lugares de interés camper cercanos en {island}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {islandPois.map((poi) => (
              <div
                key={poi.id}
                onClick={() => {
                  setSelectedPoi(poi);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([poi.lat, poi.lng], 13, { duration: 0.8 });
                  }
                }}
                className="p-3.5 bg-white rounded-2xl border border-[#E9E1D2] hover:border-[#16B8AA] transition-all cursor-pointer shadow-sm hover:shadow group"
              >
                <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase text-[#16B8AA] mb-1">
                  <span>{poi.category === 'acampada' ? 'Acampada' : 'Playa'}</span>
                </div>
                <h5 className="font-bold text-sm text-[#13322E] group-hover:text-[#16B8AA] transition-colors line-clamp-1">
                  {poi.name}
                </h5>
                <p className="text-xs text-[#6B726E] line-clamp-2 mt-0.5 leading-relaxed">
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
