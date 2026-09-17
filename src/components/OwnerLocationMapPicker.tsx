'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Compass, ShieldCheck, LocateFixed } from 'lucide-react';

interface OwnerLocationMapPickerProps {
  island: string;
  municipality: string;
  initialLat?: number | null;
  initialLng?: number | null;
  initialAddressApprox?: string;
  onChange: (data: { latitude: number; longitude: number; addressApprox: string }) => void;
}

const ISLAND_BOUNDS: Record<string, { lat: number; lng: number; bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number } }> = {
  'Gran Canaria': {
    lat: 27.9600,
    lng: -15.5800,
    bounds: { minLat: 27.70, maxLat: 28.20, minLng: -15.85, maxLng: -15.35 },
  },
  'Tenerife': {
    lat: 28.2915,
    lng: -16.6291,
    bounds: { minLat: 28.00, maxLat: 28.60, minLng: -16.95, maxLng: -16.10 },
  },
  'Lanzarote': {
    lat: 29.0469,
    lng: -13.5899,
    bounds: { minLat: 28.80, maxLat: 29.30, minLng: -13.90, maxLng: -13.40 },
  },
  'Fuerteventura': {
    lat: 28.3587,
    lng: -14.0536,
    bounds: { minLat: 28.05, maxLat: 28.75, minLng: -14.50, maxLng: -13.80 },
  },
  'La Palma': {
    lat: 28.6835,
    lng: -17.8339,
    bounds: { minLat: 28.45, maxLat: 28.90, minLng: -18.05, maxLng: -17.70 },
  },
  'La Gomera': {
    lat: 28.1173,
    lng: -17.2250,
    bounds: { minLat: 28.00, maxLat: 28.25, minLng: -17.35, maxLng: -17.05 },
  },
  'El Hierro': {
    lat: 27.7470,
    lng: -18.0163,
    bounds: { minLat: 27.60, maxLat: 27.90, minLng: -18.20, maxLng: -17.85 },
  },
  'La Graciosa': {
    lat: 29.2500,
    lng: -13.5000,
    bounds: { minLat: 29.20, maxLat: 29.30, minLng: -13.55, maxLng: -13.45 },
  },
};

const MUNICIPALITY_PRESETS: Record<string, { lat: number; lng: number; label: string }[]> = {
  'Gran Canaria': [
    { lat: 28.1235, lng: -15.4363, label: 'Las Palmas de Gran Canaria (Triana / Puerto)' },
    { lat: 27.9319, lng: -15.3866, label: 'Aeropuerto Gran Canaria (LPA VIP Lounge)' },
    { lat: 27.7606, lng: -15.5860, label: 'Maspalomas / Meloneras Resort' },
    { lat: 27.8180, lng: -15.7640, label: 'Puerto Rico / Anfi del Mar' },
    { lat: 28.1470, lng: -15.6540, label: 'Gáldar / Agaete' },
  ],
  'Tenerife': [
    { lat: 28.4636, lng: -16.2518, label: 'Santa Cruz de Tenerife (Muelle VIP)' },
    { lat: 28.0444, lng: -16.5725, label: 'Aeropuerto Tenerife Sur (TFS VIP)' },
    { lat: 28.0550, lng: -16.7150, label: 'Costa Adeje / Playa del Duque' },
    { lat: 28.4874, lng: -16.3159, label: 'La Laguna / Aeropuerto TFN' },
    { lat: 28.4160, lng: -16.5500, label: 'Puerto de la Cruz' },
  ],
  'Lanzarote': [
    { lat: 28.9630, lng: -13.5470, label: 'Arrecife / Marina Lanzarote' },
    { lat: 28.9450, lng: -13.6050, label: 'Aeropuerto César Manrique (ACE VIP)' },
    { lat: 28.8600, lng: -13.8200, label: 'Playa Blanca / Marina Rubicón' },
  ],
  'Fuerteventura': [
    { lat: 28.5000, lng: -13.8600, label: 'Puerto del Rosario / Aeropuerto FUE' },
    { lat: 28.7300, lng: -13.8700, label: 'Corralejo Resort' },
    { lat: 28.0500, lng: -14.3500, label: 'Morro Jable / Jandía' },
  ],
};

export default function OwnerLocationMapPicker({
  island,
  municipality,
  initialLat,
  initialLng,
  initialAddressApprox = '',
  onChange,
}: OwnerLocationMapPickerProps) {
  const currentIslandConfig = ISLAND_BOUNDS[island] || ISLAND_BOUNDS['Gran Canaria'];
  
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat || currentIslandConfig.lat,
    lng: initialLng || currentIslandConfig.lng,
  });
  const [addressApprox, setAddressApprox] = useState<string>(initialAddressApprox || municipality);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const cssId = 'owner-location-leaflet-css';
    const scriptId = 'owner-location-leaflet-js';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initialiseMap = () => {
      if (!mapContainerRef.current || mapRef.current || !(window as any).L) return;
      const L = (window as any).L;
      const map = L.map(mapContainerRef.current, { scrollWheelZoom: true }).setView(
        [selectedCoords.lat, selectedCoords.lng],
        10,
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      map.on('click', (event: any) => {
        const next = { lat: Number(event.latlng.lat.toFixed(6)), lng: Number(event.latlng.lng.toFixed(6)) };
        setSelectedCoords(next);
        onChange({ latitude: next.lat, longitude: next.lng, addressApprox });
      });
      mapRef.current = map;
      setMapReady(true);
    };

    const existing = document.getElementById(scriptId);
    if (existing) {
      initialiseMap();
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initialiseMap;
      document.body.appendChild(script);
    }
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = (window as any).L;
    if (!map || !L) return;
    map.setView([selectedCoords.lat, selectedCoords.lng]);
    markerRef.current?.remove();
    circleRef.current?.remove();
    markerRef.current = L.marker([selectedCoords.lat, selectedCoords.lng], { draggable: true })
      .addTo(map)
      .bindTooltip('Arrastra el pin al punto de entrega VIP', { permanent: true, direction: 'top' });
    markerRef.current.on('dragend', () => {
      const position = markerRef.current.getLatLng();
      const next = { lat: Number(position.lat.toFixed(6)), lng: Number(position.lng.toFixed(6)) };
      setSelectedCoords(next);
      onChange({ latitude: next.lat, longitude: next.lng, addressApprox });
    });
    circleRef.current = L.circle([selectedCoords.lat, selectedCoords.lng], { radius: 1500, color: '#D4AF37', fillColor: '#D4AF37', fillOpacity: 0.18 }).addTo(map);
  }, [selectedCoords, mapReady]);

  useEffect(() => {
    const newConfig = ISLAND_BOUNDS[island] || ISLAND_BOUNDS['Gran Canaria'];
    setSelectedCoords({ lat: newConfig.lat, lng: newConfig.lng });
    onChange({ latitude: newConfig.lat, longitude: newConfig.lng, addressApprox });
  }, [island]);

  const handleSelectPreset = (preset: { lat: number; lng: number; label: string }) => {
    setSelectedCoords({ lat: preset.lat, lng: preset.lng });
    setAddressApprox(preset.label);
    onChange({ latitude: preset.lat, longitude: preset.lng, addressApprox: preset.label });
  };

  const presets = MUNICIPALITY_PRESETS[island] || [];

  const updateCoordinate = (key: 'lat' | 'lng', value: string) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    const next = { ...selectedCoords, [key]: numericValue };
    setSelectedCoords(next);
    onChange({ latitude: next.lat, longitude: next.lng, addressApprox });
  };

  const useBrowserLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { minLat, maxLat, minLng, maxLng } = currentIslandConfig.bounds;
      if (coords.latitude < minLat || coords.latitude > maxLat || coords.longitude < minLng || coords.longitude > maxLng) return;
      const next = { lat: Number(coords.latitude.toFixed(6)), lng: Number(coords.longitude.toFixed(6)) };
      setSelectedCoords(next);
      onChange({ latitude: next.lat, longitude: next.lng, addressApprox });
    });
  };

  return (
    <div className="space-y-4 bg-[#0f0f12] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl">
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>Geolocalización de Entrega Vault</span>
        </div>
        <h3 className="text-lg font-serif font-bold text-white">
          Ubicación aproximada de entrega ({island})
        </h3>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          Arrastra el pin hasta la <strong>zona o hangar de custodia</strong> de tu superdeportivo.
        </p>
      </div>

      {/* PUNTOS RÁPIDOS HABITUALES */}
      {presets.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider block">
            Puntos habituales de entrega VIP en {island}:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all border cursor-pointer ${
                  addressApprox === preset.label
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm'
                    : 'bg-neutral-900 text-neutral-300 border-white/10 hover:border-[#D4AF37]/50'
                }`}
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAPA INTERACTIVO */}
      <div ref={mapContainerRef} className="relative z-0 h-64 sm:h-72 w-full rounded-2xl border border-white/10 overflow-hidden cursor-crosshair shadow-inner" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
          Latitud
          <input type="number" step="0.000001" value={selectedCoords.lat} onChange={(event) => updateCoordinate('lat', event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-900 p-3 text-sm font-mono font-semibold text-white focus:border-[#D4AF37] outline-none" />
        </label>
        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
          Longitud
          <input type="number" step="0.000001" value={selectedCoords.lng} onChange={(event) => updateCoordinate('lng', event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-900 p-3 text-sm font-mono font-semibold text-white focus:border-[#D4AF37] outline-none" />
        </label>
        <button type="button" onClick={useBrowserLocation} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-3 text-xs font-mono font-bold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors">
          <LocateFixed className="h-4 w-4" /> Usar mi ubicación
        </button>
      </div>

      {/* DESCRIPCIÓN DE LA ZONA / REFERENCIA */}
      <div>
        <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
          Zona o punto de entrega concierge visible para clientes
        </label>
        <input
          type="text"
          value={addressApprox}
          onChange={(e) => {
            setAddressApprox(e.target.value);
            onChange({ latitude: selectedCoords.lat, longitude: selectedCoords.lng, addressApprox: e.target.value });
          }}
          placeholder="Ej: Terminal VIP Aeropuerto de Gran Canaria / Hotel Resort Costa Adeje"
          className="w-full p-3 rounded-xl border border-white/15 bg-neutral-900 text-xs font-mono text-white focus:border-[#D4AF37] outline-none"
        />
      </div>

      {/* AVISO DE PRIVACIDAD */}
      <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-white/10 text-[11px] font-mono text-neutral-300 flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
        <p>
          <strong>Protocolo de Privacidad y Discreción:</strong> La dirección exacta del garaje o hangar nunca se revela públicamente. Los clientes únicamente verán el radio de recogida hasta formalizar la fianza y verificación de identidad.
        </p>
      </div>
    </div>
  );
}
