'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Compass, LocateFixed } from 'lucide-react';
import { getCoordinatesForLocation } from '@/lib/supercar-locations';
import 'leaflet/dist/leaflet.css';

interface OwnerLocationMapPickerProps {
  island: string;
  municipality: string;
  initialLat?: number | null;
  initialLng?: number | null;
  initialAddressApprox?: string;
  onChange: (data: { latitude: number; longitude: number; addressApprox: string }) => void;
}

export default function OwnerLocationMapPicker({
  island,
  municipality,
  initialLat,
  initialLng,
  initialAddressApprox = '',
  onChange,
}: OwnerLocationMapPickerProps) {
  const defaultCoords = getCoordinatesForLocation(island);

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat ?? defaultCoords.lat,
    lng: initialLng ?? defaultCoords.lng,
  });

  const [addressApprox, setAddressApprox] = useState<string>(
    initialAddressApprox || municipality || island
  );

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Inicializar Leaflet directamente desde node_modules (100% local, sin CDN unpkg)
  useEffect(() => {
    if (!isMounted || !mapContainerRef.current || mapRef.current) return;

    let isCleanedUp = false;

    import('leaflet').then((leafletModule) => {
      if (isCleanedUp || !mapContainerRef.current) return;
      const L = leafletModule.default || leafletModule;

      try {
        const map = L.map(mapContainerRef.current, {
          center: [selectedCoords.lat, selectedCoords.lng],
          zoom: 12,
          scrollWheelZoom: true,
          zoomControl: true,
        });

        // OpenStreetMap oficial estándar con HTTPS garantizado
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c'],
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Pin de estilo deportivo de alto contraste
        const customIcon = L.divIcon({
          className: 'gtr-custom-pin',
          html: `
            <div style="background-color: #000; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.45); cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        });

        const marker = L.marker([selectedCoords.lat, selectedCoords.lng], {
          draggable: true,
          icon: customIcon,
        }).addTo(map);

        const circle = L.circle([selectedCoords.lat, selectedCoords.lng], {
          radius: 1200,
          color: '#000000',
          fillColor: '#000000',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '4, 6',
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          const next = {
            lat: Number(pos.lat.toFixed(6)),
            lng: Number(pos.lng.toFixed(6)),
          };
          setSelectedCoords(next);
          circle.setLatLng([next.lat, next.lng]);
          onChange({ latitude: next.lat, longitude: next.lng, addressApprox });
        });

        map.on('click', (e: any) => {
          const next = {
            lat: Number(e.latlng.lat.toFixed(6)),
            lng: Number(e.latlng.lng.toFixed(6)),
          };
          setSelectedCoords(next);
          marker.setLatLng([next.lat, next.lng]);
          circle.setLatLng([next.lat, next.lng]);
          onChange({ latitude: next.lat, longitude: next.lng, addressApprox });
        });

        mapRef.current = map;
        markerRef.current = marker;
        circleRef.current = circle;

        // Invalidate size en intervalos para asegurar que las teselas pinten inmediatamente
        map.invalidateSize();
        setTimeout(() => map.invalidateSize(), 150);
        setTimeout(() => map.invalidateSize(), 400);
      } catch (err) {
        console.error('Leaflet mount error:', err);
      }
    });

    return () => {
      isCleanedUp = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMounted]);

  // Al cambiar la ciudad seleccionada
  useEffect(() => {
    const coords = getCoordinatesForLocation(island);
    setSelectedCoords({ lat: coords.lat, lng: coords.lng });
    const newAddress = municipality || island;
    setAddressApprox(newAddress);
    onChange({ latitude: coords.lat, longitude: coords.lng, addressApprox: newAddress });

    if (mapRef.current) {
      mapRef.current.setView([coords.lat, coords.lng], 12);
      if (markerRef.current) markerRef.current.setLatLng([coords.lat, coords.lng]);
      if (circleRef.current) circleRef.current.setLatLng([coords.lat, coords.lng]);
      mapRef.current.invalidateSize();
    }
  }, [island]);

  const updateCoordinate = (key: 'lat' | 'lng', value: string) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    const next = { ...selectedCoords, [key]: numericValue };
    setSelectedCoords(next);
    onChange({ latitude: next.lat, longitude: next.lng, addressApprox });

    if (mapRef.current && markerRef.current && circleRef.current) {
      mapRef.current.setView([next.lat, next.lng], mapRef.current.getZoom() || 12);
      markerRef.current.setLatLng([next.lat, next.lng]);
      circleRef.current.setLatLng([next.lat, next.lng]);
    }
  };

  const useBrowserLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const next = {
          lat: Number(coords.latitude.toFixed(6)),
          lng: Number(coords.longitude.toFixed(6)),
        };
        setSelectedCoords(next);
        onChange({ latitude: next.lat, longitude: next.lng, addressApprox });
        if (mapRef.current && markerRef.current && circleRef.current) {
          mapRef.current.setView([next.lat, next.lng], 14);
          markerRef.current.setLatLng([next.lat, next.lng]);
          circleRef.current.setLatLng([next.lat, next.lng]);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">
            <Compass className="w-3.5 h-3.5 text-black" />
            <span>Punto de Custodia y Entrega</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-black font-sans">
            Geolocalización en {island || 'Base VIP'}
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            Haz clic en el mapa o arrastra el pin para ubicar la zona o hangar de entrega.
          </p>
        </div>

        <button
          type="button"
          onClick={useBrowserLocation}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs font-mono font-bold text-black hover:bg-black hover:text-white transition-all cursor-pointer shadow-xs shrink-0"
        >
          <LocateFixed className="h-4 w-4" />
          <span>Mi ubicación actual</span>
        </button>
      </div>

      {/* MAPA INTERACTIVO */}
      <div className="relative w-full rounded-2xl border border-gray-200 overflow-hidden shadow-xs bg-gray-100 h-[340px]">
        <div
          ref={mapContainerRef}
          className="w-full h-full cursor-crosshair"
          style={{ width: '100%', height: '340px', minHeight: '340px' }}
        />
      </div>

      {/* CAMPOS DE COORDENADAS Y REFERENCIA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-600 font-bold mb-1">
            Latitud
          </label>
          <input
            type="number"
            step="0.000001"
            value={selectedCoords.lat}
            onChange={(e) => updateCoordinate('lat', e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black font-bold focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-600 font-bold mb-1">
            Longitud
          </label>
          <input
            type="number"
            step="0.000001"
            value={selectedCoords.lng}
            onChange={(e) => updateCoordinate('lng', e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black font-bold focus:outline-none focus:border-black"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-600 font-bold mb-1">
          Zona o Punto de Entrega Concierge visible para clientes
        </label>
        <div className="relative">
          <input
            type="text"
            value={addressApprox}
            onChange={(e) => {
              setAddressApprox(e.target.value);
              onChange({ ...selectedCoords, latitude: selectedCoords.lat, longitude: selectedCoords.lng, addressApprox: e.target.value });
            }}
            placeholder="Ej. Aeropuerto Adolfo Suárez Madrid-Barajas (Terminal Ejecutiva T4)"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      </div>

      {/* AVISO DE PRIVACIDAD */}
      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600 flex items-start gap-3">
        <span className="font-bold text-black mt-0.5 shrink-0">🛡</span>
        <p className="text-[11px] leading-relaxed">
          <strong className="text-black">Protocolo de Privacidad y Discreción:</strong> La dirección exacta del hangar o garaje privado nunca se publica. Los clientes verificados solo ven el radio de proximidad general hasta confirmar la reserva y fianza.
        </p>
      </div>
    </div>
  );
}
