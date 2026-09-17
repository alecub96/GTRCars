'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CANARY_ISLANDS } from '@/lib/pricing';
import {
  BusFront,
  CarFront,
  Caravan,
  CheckCircle2,
  Mountain,
  Ship,
  Truck,
  Upload,
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Eye,
  Camera,
  Layers,
  Fuel,
  Coins,
  MapPin,
  FileText,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import OwnerLocationMapPicker from '@/components/OwnerLocationMapPicker';

const EQUIPMENT = [
  'Aire acondicionado',
  'Calefacción',
  'Ducha interior',
  'Ducha exterior',
  'WC químico',
  'Cocina de gas',
  'Frigorífico con congelador',
  'Agua caliente',
  'Placa solar',
  'Toldo exterior',
  'Portabicicletas',
  'Menaje de cocina completo',
  'Ropa de cama',
  'Mesa y sillas de camping',
  'Oscurecedores térmicos',
  'Inversor 220V',
  'Conexiones USB',
];

const VEHICLE_TYPES = [
  { value: 'TURISMO_CAMPERIZADO', label: 'Camper Pequeña', icon: CarFront },
  { value: 'CAMPER_GRAN_VOLUMEN', label: 'Camper Gran Volumen', icon: Truck },
  { value: 'CARAVANA', label: 'Caravana', icon: Caravan },
  { value: 'AUTOCARAVANA', label: 'Autocaravana', icon: BusFront },
  { value: '4X4_CAMPERIZADO', label: '4x4 Camper', icon: Mountain },
  { value: 'BARCO', label: 'Barco / Velero', icon: Ship },
] as const;

export default function EditCamperPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const vehicleId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const [existingPhotos, setExistingPhotos] = useState<Array<{ id: string; url: string; orderIndex: number }>>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    vehicleType: 'TURISMO_CAMPERIZADO',
    year: 2022,
    island: 'Gran Canaria',
    municipality: 'Las Palmas de Gran Canaria',
    passengers: 2,
    beds: 2,
    doors: 4,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '7.0 L/100km',
    basePricePerDay: 70,
    includedKmPerDay: 150,
    extraKmPrice: 0.25,
    securityDeposit: 500,
    cleaningFee: 30,
    minDays: 2,
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

  // Cargar datos del usuario y del vehículo
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
              setError(vData.error || 'No se pudo cargar la información de la camper');
              setLoading(false);
              return;
            }

            const v = vData.vehicle;
            setFormData({
              title: v.title || '',
              brand: v.brand || '',
              model: v.model || '',
              vehicleType: v.vehicleType || 'TURISMO_CAMPERIZADO',
              year: v.year || 2022,
              island: v.island || 'Gran Canaria',
              municipality: v.municipality || 'Las Palmas de Gran Canaria',
              passengers: v.passengers || 2,
              beds: v.beds || 2,
              doors: v.doors || 4,
              transmission: v.transmission || 'MANUAL',
              fuelType: v.fuelType || 'DIESEL',
              fuelConsumption: v.fuelConsumption || '',
              basePricePerDay: v.basePricePerDay || 70,
              includedKmPerDay: v.includedKmPerDay || 150,
              extraKmPrice: v.extraKmPrice || 0.25,
              securityDeposit: v.securityDeposit || 500,
              cleaningFee: v.cleaningFee || 30,
              minDays: v.minDays || 2,
              maxDays: v.maxDays || 30,
              bookingType: v.bookingType || 'REQUEST_TO_BOOK',
              cancellationPolicy: v.cancellationPolicy || 'MODERATE',
              addressApprox: v.addressApprox || '',
              latitude: v.latitude || null,
              longitude: v.longitude || null,
              description: v.description || '',
              rules: v.rules || '',
              features: Array.isArray(v.features) ? v.features.map((f: any) => (typeof f === 'string' ? f : f.name)) : [],
              slug: v.slug || v.id,
            });

            if (Array.isArray(v.photos)) {
              setExistingPhotos(v.photos);
            }
          })
          .catch((err) => {
            console.error('Error cargando camper:', err);
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
        setSuccessMsg('Foto añadida con éxito');
      } else {
        setError(data.error || 'Error al subir la foto');
      }
    } catch {
      setError('Error al subir el archivo');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (existingPhotos.length <= 5) {
      alert('Un superdeportivo debe contar con al menos 5 fotografías en la galería.');
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

      setSuccessMsg('¡Tu anuncio ha sido actualizado correctamente!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSaving(false);
      setError(err.message || 'Error guardando los datos');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#16B8AA] border-t-transparent mb-4" />
          <p className="font-bold text-sm text-[#6B726E]">Cargando datos de tu camper…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* CABECERA SUPERIOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1D2] pb-6 mb-8">
          <div>
            <Link
              href="/propietario"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#6B726E] hover:text-[#13322E] mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a mi Panel de Propietario</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-[#13322E]">
              Editar Anuncio: {formData.title || 'Mi Camper'}
            </h1>
            <p className="text-xs text-[#6B726E] mt-1">
              Modifica las tarifas, fotos, normas y equipamiento de tu camper en tiempo real.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href={`/camper/${formData.slug || vehicleId}`}
              target="_blank"
              className="inline-flex items-center space-x-2 rounded-full border border-[#E9E1D2] bg-white px-5 py-2.5 text-xs font-bold text-[#13322E] hover:border-[#16B8AA] shadow-xs transition-all"
            >
              <Eye className="w-4 h-4 text-[#16B8AA]" />
              <span>Ver Anuncio Público</span>
            </Link>
          </div>
        </div>

        {/* MENSAJES DE ESTADO */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-medium flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN 1: INFORMACIÓN BÁSICA DEL VEHÍCULO */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#13322E] flex items-center gap-2 border-b border-[#E9E1D2] pb-4">
              <CarFront className="w-5 h-5 text-[#16B8AA]" />
              1. Información Básica del Vehículo
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1.5">
                  Título del Anuncio
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  placeholder="Ej. Volkswagen T2 Bulli Clásica Vintage con Techo Elevable"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-[#E9E1D2] bg-[#FAF7F0] p-3 text-sm font-bold focus:bg-white focus:border-[#16B8AA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Marca</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Ej. Volkswagen, Dacia, Fiat, Renault"
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white focus:border-[#16B8AA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Modelo</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Ej. T2 Bulli, Dokker Stepway, Rimor Seal"
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white focus:border-[#16B8AA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Tipo de Vehículo</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white focus:border-[#16B8AA] focus:outline-none cursor-pointer"
                >
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Año de Fabricación / Matriculación</label>
                <input
                  type="number"
                  min="1970"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white focus:border-[#16B8AA] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: UBICACIÓN EN CANARIAS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#13322E] flex items-center gap-2 border-b border-[#E9E1D2] pb-4">
              <MapPin className="w-5 h-5 text-[#16B8AA]" />
              2. Ubicación de Recogida y Entrega
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Isla</label>
                <select
                  value={formData.island}
                  onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white focus:border-[#16B8AA] focus:outline-none cursor-pointer"
                >
                  {CANARY_ISLANDS.map((is) => (
                    <option key={is.name} value={is.name}>
                      {is.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Municipio / Zona</label>
                <input
                  type="text"
                  required
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  placeholder="Ej. Las Palmas de Gran Canaria, La Laguna, Corralejo"
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white focus:border-[#16B8AA] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">
                  Punto de encuentro aproximado (Paseo marítimo, aeropuerto, mirador)
                </label>
                <input
                  type="text"
                  value={formData.addressApprox}
                  onChange={(e) => setFormData({ ...formData, addressApprox: e.target.value })}
                  placeholder="Ej. Aeropuerto Gran Canaria / Guanarteme"
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white focus:border-[#16B8AA] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#6B726E] mb-2">
                  Seleccionar ubicación exacta sobre el mapa (opcional)
                </label>
                <OwnerLocationMapPicker
                  initialLat={formData.latitude}
                  initialLng={formData.longitude}
                  island={formData.island}
                  municipality={formData.municipality}
                  initialAddressApprox={formData.addressApprox}
                  onChange={({ latitude, longitude, addressApprox }: { latitude: number; longitude: number; addressApprox: string }) => {
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

          {/* SECCIÓN 3: CAPACIDAD Y ESPECIFICACIONES */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#13322E] flex items-center gap-2 border-b border-[#E9E1D2] pb-4">
              <Fuel className="w-5 h-5 text-[#16B8AA]" />
              3. Capacidad y Mecánica
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Plazas homologadas</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white font-bold text-[#13322E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Plazas para dormir</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.beds}
                  onChange={(e) => setFormData({ ...formData, beds: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white font-bold text-[#13322E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Caja de cambios</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white cursor-pointer"
                >
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATIC">Automática</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Combustible</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm bg-white cursor-pointer"
                >
                  <option value="DIESEL">Diésel</option>
                  <option value="GASOLINA">Gasolina</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="ELECTRICO">Eléctrico</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: TARIFAS, FIANZA Y POLÍTICAS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#13322E] flex items-center gap-2 border-b border-[#E9E1D2] pb-4">
              <Coins className="w-5 h-5 text-[#16B8AA]" />
              4. Precios, Fianza y Condiciones
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#16B8AA] mb-1.5">
                  Precio Base Diario (€/día)
                </label>
                <input
                  type="number"
                  required
                  min="15"
                  step="1"
                  value={formData.basePricePerDay}
                  onChange={(e) => setFormData({ ...formData, basePricePerDay: Number(e.target.value) })}
                  className="w-full rounded-xl border-2 border-[#16B8AA]/40 p-3 text-lg font-black text-[#13322E] bg-teal-50/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Fianza de seguridad (€)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Gastos de limpieza (€)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={formData.cleaningFee}
                  onChange={(e) => setFormData({ ...formData, cleaningFee: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Km incluidos por día</label>
                <input
                  type="number"
                  min="0"
                  value={formData.includedKmPerDay}
                  onChange={(e) => setFormData({ ...formData, includedKmPerDay: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Precio por km extra (€/km)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={formData.extraKmPrice}
                  onChange={(e) => setFormData({ ...formData, extraKmPrice: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">Mínimo de días</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.minDays}
                  onChange={(e) => setFormData({ ...formData, minDays: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#E9E1D2] p-3 text-sm font-bold bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 5: FOTOGRAFÍAS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E9E1D2] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#13322E] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#16B8AA]" />
                5. Galería de Fotos del Anuncio ({existingPhotos.length})
              </h2>

              <label className="inline-flex items-center gap-2 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer shadow-sm">
                <Upload className="w-4 h-4" />
                <span>{uploadingPhoto ? 'Subiendo…' : 'Añadir Nueva Foto'}</span>
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
                  className="relative group rounded-2xl overflow-hidden border border-[#E9E1D2] bg-slate-100 aspect-4/3"
                >
                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-[#13322E] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                      Foto Principal
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#13322E] flex items-center gap-2 border-b border-[#E9E1D2] pb-4">
              <Layers className="w-5 h-5 text-[#16B8AA]" />
              6. Equipamiento y Comodidades Incluidas
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {EQUIPMENT.map((item) => {
                const isSelected = formData.features.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleFeature(item)}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#16B8AA] bg-teal-50/70 text-[#0F766E] ring-2 ring-[#16B8AA]/30'
                        : 'border-[#E9E1D2] bg-white text-[#13322E] hover:border-[#16B8AA]'
                    }`}
                  >
                    <span>{item}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN 7: DESCRIPCIÓN Y NORMAS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#13322E] flex items-center gap-2 border-b border-[#E9E1D2] pb-4">
              <FileText className="w-5 h-5 text-[#16B8AA]" />
              7. Descripción y Normas de la Camper
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">
                  Descripción Detallada del Anuncio
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la experiencia de viajar en tu camper, cómo está equipada, su autonomía..."
                  className="w-full rounded-2xl border border-[#E9E1D2] p-4 text-sm bg-[#FAF7F0] focus:bg-white focus:border-[#16B8AA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B726E] mb-1.5">
                  Normas del Vehículo (Mascotas, combustible, fumar, limpieza)
                </label>
                <textarea
                  rows={3}
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="Ej. Prohibido fumar en el interior. Mascotas bajo consulta previa. Devolver con depósito lleno."
                  className="w-full rounded-2xl border border-[#E9E1D2] p-4 text-sm bg-white focus:border-[#16B8AA] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* BOTÓN FINAL DE GUARDAR */}
          <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-[#E9E1D2] shadow-xl flex items-center justify-between gap-4">
            <Link
              href="/propietario"
              className="text-xs font-bold text-[#6B726E] hover:text-[#13322E] transition-colors"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 bg-[#16B8AA] hover:bg-[#0F766E] text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer disabled:opacity-50"
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
