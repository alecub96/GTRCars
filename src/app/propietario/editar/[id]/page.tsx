'use client';

import React, { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CANARY_ISLANDS } from '@/lib/pricing';
import {
  CarFront,
  CheckCircle2,
  Gauge,
  Upload,
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  Camera,
  Layers,
  Fuel,
  Coins,
  MapPin,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import OwnerLocationMapPicker from '@/components/OwnerLocationMapPicker';

const EQUIPMENT = [
  'Frenos Carbono-Cerámicos CCMR',
  'Sistema de Escape Deportivo Activo',
  'Launch Control & Modos Race/Track',
  'Suspensión Magnetorreológica / PASM',
  'Paquete Exterior Fibra de Carbono',
  'Asientos Bucket en Fibra de Carbono',
  'Interior en Alcántara & Cuero Nappa',
  'Sistema de Elevación Eje Delantero (Front Lift)',
  'Telemetría Track Precision / Manettino',
  'Apple CarPlay & Sistema Audio High-End',
  'Faros Matrix LED / PDLS Plus',
  'Cámara 360º & Sensores de Parking',
  'Entrega VIP en Aeropuerto o Hotel 5* GL',
];

const VEHICLE_TYPES = [
  { value: 'SUPERCAR_V8_V10', label: 'Supercar Berlinetta (V8 / V10)', icon: CarFront },
  { value: 'HYPERCAR', label: 'Hypercar (V12 / Hybrid)', icon: Gauge },
  { value: 'TRACK_TOY', label: 'Track GT / RS', icon: Gauge },
  { value: 'GRAN_TURISMO', label: 'Gran Turismo / Luxury GT', icon: CarFront },
  { value: 'SPYDER_CABRIO', label: 'Spyder / Cabrio Open-Air', icon: CarFront },
  { value: 'SUV_LUXURY', label: 'Super SUV High-Performance', icon: CarFront },
] as const;

const DESTINATIONS = [
  ...CANARY_ISLANDS.map((i) => i.name),
  'Madrid',
  'Marbella',
  'Barcelona',
  'Mallorca',
  'Ibiza',
  'Londres',
];

export default function EditSupercarPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const vehicleId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [, setAuthorized] = useState<boolean | null>(null);

  const [existingPhotos, setExistingPhotos] = useState<Array<{ id: string; url: string; orderIndex: number }>>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    vehicleType: 'SUPERCAR_V8_V10',
    year: 2023,
    island: 'Tenerife',
    municipality: 'Costa Adeje',
    passengers: 2,
    beds: 0,
    doors: 2,
    transmission: 'AUTOMATIC',
    fuelType: 'GASOLINA',
    fuelConsumption: '3.9L V8 Twin-Turbo',
    basePricePerDay: 1290,
    includedKmPerDay: 150,
    extraKmPrice: 3.5,
    securityDeposit: 4500,
    cleaningFee: 50,
    minDays: 1,
    maxDays: 30,
    bookingType: 'REQUEST_TO_BOOK',
    cancellationPolicy: 'MODERATE',
    addressApprox: '',
    latitude: null as number | null,
    longitude: null as number | null,
    description: '',
    rules: '',
    features: [] as string[],
    slug: '',
  });

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.user) {
          window.location.href = '/';
          return;
        }
        setAuthorized(true);

        fetch(`/api/vehicles/${vehicleId}`, { cache: 'no-store' })
          .then((res) => res.json())
          .then((vData) => {
            if (!vData.success || !vData.vehicle) {
              setError(vData.error || 'No se pudo cargar la información del superdeportivo');
              setLoading(false);
              return;
            }

            const v = vData.vehicle;
            setFormData({
              title: v.title || '',
              brand: v.brand || '',
              model: v.model || '',
              vehicleType: v.vehicleType || 'SUPERCAR_V8_V10',
              year: v.year || 2023,
              island: v.island || 'Tenerife',
              municipality: v.municipality || 'Costa Adeje',
              passengers: v.passengers || 2,
              beds: v.beds || 0,
              doors: v.doors || 2,
              transmission: v.transmission || 'AUTOMATIC',
              fuelType: v.fuelType || 'GASOLINA',
              fuelConsumption: v.fuelConsumption || '',
              basePricePerDay: v.basePricePerDay || 1290,
              includedKmPerDay: v.includedKmPerDay || 150,
              extraKmPrice: v.extraKmPrice || 3.5,
              securityDeposit: v.securityDeposit || 4500,
              cleaningFee: v.cleaningFee || 50,
              minDays: v.minDays || 1,
              maxDays: v.maxDays || 30,
              bookingType: v.bookingType || 'REQUEST_TO_BOOK',
              cancellationPolicy: v.cancellationPolicy || 'MODERATE',
              addressApprox: v.addressApprox || '',
              latitude: v.latitude || null,
              longitude: v.longitude || null,
              description: v.description || '',
              rules: v.rules || '',
              features: Array.isArray(v.features)
                ? v.features.map((f: any) => (typeof f === 'string' ? f : f.name))
                : [],
              slug: v.slug || v.id,
            });

            if (Array.isArray(v.photos)) {
              setExistingPhotos(v.photos);
            }
          })
          .catch(() => {
            setError('Error de conexión cargando los datos.');
          })
          .finally(() => setLoading(false));
      })
      .catch(() => {
        setAuthorized(false);
        window.location.href = '/';
      });
  }, [vehicleId]);

  const toggleFeature = (feat: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feat)
        ? prev.features.filter((f) => f !== feat)
        : [...prev.features, feat],
    }));
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError('');

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/photos`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.photo) {
        setExistingPhotos((prev) => [...prev, data.photo]);
        setSuccessMsg('Fotografía añadida con éxito');
      } else {
        setError(data.error || 'Error al subir la fotografía');
      }
    } catch {
      setError('Error al subir el archivo');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (existingPhotos.length <= 3) {
      alert('El anuncio debe mantener al menos 3 fotografías oficiales.');
      return;
    }
    if (!confirm('¿Deseas eliminar esta fotografía?')) return;

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId }),
      });
      if (res.ok) {
        setExistingPhotos((prev) => prev.filter((p) => p.id !== photoId));
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSaving(true);

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: formData.features,
          photos: existingPhotos,
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (!res.ok) {
        throw new Error(data.error || 'No se pudieron guardar los cambios');
      }

      setSuccessMsg('¡Ficha del superdeportivo actualizada correctamente!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSaving(false);
      setError(err.message || 'Error guardando los datos');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent mb-4" />
          <p className="font-mono font-bold text-xs uppercase tracking-widest text-gray-500">
            Sincronizando ficha técnica del superdeportivo…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* CABECERA SUPERIOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div>
            <Link
              href="/propietario"
              className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-gray-500 hover:text-black mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Garaje de Propietario</span>
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">
              Editar Unidad: {formData.title || 'Superdeportivo'}
            </h1>
            <p className="text-xs font-mono text-gray-500 mt-1">
              Actualiza tarifas, fianza, fotografías y especificaciones de tu unidad en tiempo real.
            </p>
          </div>

          <div className="flex items-center space-x-3 font-mono">
            <Link
              href={`/coche/${formData.slug || vehicleId}`}
              target="_blank"
              className="inline-flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-black hover:border-black shadow-xs transition-all"
            >
              <Eye className="w-4 h-4 text-black" />
              <span>Ver Ficha Pública</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm font-mono font-bold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-mono font-bold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2 border-b border-gray-100 pb-4">
              <CarFront className="w-5 h-5 text-black" />
              1. Identificación del Superdeportivo
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Título Oficial del Anuncio
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  placeholder="Ej. Ferrari 488 GTB Rosso Corsa Bi-Colore"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm font-bold text-black focus:bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Marca</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Ej. Ferrari, Porsche, Lamborghini, McLaren"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Modelo</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Ej. 488 GTB, 911 GT3 RS, Huracán STO"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Categoría</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white focus:border-black focus:outline-none cursor-pointer"
                >
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Año</label>
                <input
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white focus:border-black focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: UBICACIÓN */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2 border-b border-gray-100 pb-4">
              <MapPin className="w-5 h-5 text-black" />
              2. Base de Custodia y Entrega VIP
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Ciudad / Isla</label>
                <select
                  value={formData.island}
                  onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white focus:border-black focus:outline-none cursor-pointer"
                >
                  {Array.from(new Set(DESTINATIONS)).map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Zona / Aeropuerto / Marina</label>
                <input
                  type="text"
                  required
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  placeholder="Ej. Costa Adeje / Aeropuerto Sur (TFS), Puerto Banús"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold uppercase text-gray-600 mb-1.5">
                  Punto de entrega VIP preferente (Terminal ejecutiva, Hotel 5* GL)
                </label>
                <input
                  type="text"
                  value={formData.addressApprox}
                  onChange={(e) => setFormData({ ...formData, addressApprox: e.target.value })}
                  placeholder="Ej. Terminal Ejecutiva Aeropuerto TFS / Costa Adeje"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold uppercase text-gray-600 mb-2">
                  Ubicación aproximada sobre el mapa (opcional)
                </label>
                <OwnerLocationMapPicker
                  initialLat={formData.latitude}
                  initialLng={formData.longitude}
                  island={formData.island}
                  municipality={formData.municipality}
                  initialAddressApprox={formData.addressApprox}
                  onChange={({
                    latitude,
                    longitude,
                    addressApprox,
                  }: {
                    latitude: number;
                    longitude: number;
                    addressApprox: string;
                  }) => {
                    setFormData((prev) => ({
                      ...prev,
                      latitude,
                      longitude,
                      addressApprox: addressApprox || prev.addressApprox,
                    }));
                  }}
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: ESPECIFICACIONES MECÁNICAS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2 border-b border-gray-100 pb-4">
              <Fuel className="w-5 h-5 text-black" />
              3. Mecánica y Transmisión
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Plazas</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white font-bold text-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Transmisión</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white cursor-pointer"
                >
                  <option value="AUTOMATIC">Automática / Doble Embrague (PDK / F1)</option>
                  <option value="MANUAL">Manual GT</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Propulsión / Combustible</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white cursor-pointer"
                >
                  <option value="GASOLINA">Gasolina 98 Octanos</option>
                  <option value="HIBRIDO">Híbrido High-Performance (PHEV)</option>
                  <option value="ELECTRICO">100% Eléctrico (800V)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: TARIFAS, FIANZA Y POLÍTICAS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2 border-b border-gray-100 pb-4">
              <Coins className="w-5 h-5 text-black" />
              4. Tarifas, Fianza y Kilometraje
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <label className="block font-black uppercase text-black mb-1.5">
                  Tarifa Diaria (€/día)
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  step="10"
                  value={formData.basePricePerDay}
                  onChange={(e) => setFormData({ ...formData, basePricePerDay: Number(e.target.value) })}
                  className="w-full rounded-xl border-2 border-black p-3 text-lg font-black text-black bg-gray-50"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Fianza Reembolsable (€)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Detallado y Entrega Técnica (€)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={formData.cleaningFee}
                  onChange={(e) => setFormData({ ...formData, cleaningFee: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Km incluidos por día</label>
                <input
                  type="number"
                  min="0"
                  value={formData.includedKmPerDay}
                  onChange={(e) => setFormData({ ...formData, includedKmPerDay: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Suplemento km extra (€/km)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.extraKmPrice}
                  onChange={(e) => setFormData({ ...formData, extraKmPrice: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">Mínimo de jornadas</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.minDays}
                  onChange={(e) => setFormData({ ...formData, minDays: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm font-bold bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 5: FOTOGRAFÍAS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <Camera className="w-5 h-5 text-black" />
                5. Galería Oficial ({existingPhotos.length})
              </h2>

              <label className="inline-flex items-center gap-2 rounded-full bg-black hover:bg-neutral-800 px-4 py-2 text-xs font-mono font-bold text-white transition-all cursor-pointer shadow-sm">
                <Upload className="w-4 h-4" />
                <span>{uploadingPhoto ? 'Subiendo…' : 'Añadir Fotografía'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingPhoto}
                  onChange={handleUploadPhoto}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingPhotos.map((photo, index) => (
                <div
                  key={photo.id || index}
                  className="relative group rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 aspect-4/3"
                >
                  <img
                    src={photo.url}
                    alt={`Fotografía ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                      Portada
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-sm"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN 6: EQUIPAMIENTO */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2 border-b border-gray-100 pb-4">
              <Layers className="w-5 h-5 text-black" />
              6. Especificaciones &amp; Equipamiento Performance
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono">
              {EQUIPMENT.map((item) => {
                const isSelected = formData.features.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleFeature(item)}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-black bg-gray-100 text-black'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-black hover:text-black'
                    }`}
                  >
                    <span>{item}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN 7: DESCRIPCIÓN Y NORMAS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2 border-b border-gray-100 pb-4">
              <FileText className="w-5 h-5 text-black" />
              7. Descripción Técnica y Protocolo de Conducción
            </h2>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">
                  Descripción Detallada de la Unidad
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la configuración de fábrica, motorización, sonido, estado de neumáticos y opciones..."
                  className="w-full rounded-2xl border border-gray-300 p-4 text-sm bg-gray-50 focus:bg-white focus:border-black focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-600 mb-1.5">
                  Requisitos y Condiciones de Uso (Edad mínima, combustible 98, circuito)
                </label>
                <textarea
                  rows={3}
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="Ej. Edad mínima 25 años y 3 años de carnet B.Repostaje exclusivo Gasolina 98 octanos. Prohibido uso en trackday sin autorización."
                  className="w-full rounded-2xl border border-gray-300 p-4 text-sm bg-white focus:border-black focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* BOTÓN FINAL DE GUARDAR */}
          <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-gray-200 shadow-xl flex items-center justify-between gap-4 font-mono">
            <Link
              href="/propietario"
              className="text-xs font-bold text-gray-600 hover:text-black transition-colors"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando Cambios…' : 'Guardar y Publicar Cambios'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
