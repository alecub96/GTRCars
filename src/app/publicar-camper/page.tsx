'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CANARY_ISLANDS } from '@/lib/pricing';
import { BusFront, CarFront, Caravan, CheckCircle2, Mountain, Ship, Truck, Upload, AlertCircle, FileText, ShieldAlert } from 'lucide-react';

const EQUIPMENT = [
  'Aire acondicionado',
  'Calefacción',
  'Ducha interior',
  'WC',
  'Cocina',
  'Frigorífico',
  'Agua caliente',
  'Placa solar',
  'Toldo',
  'Portabicicletas',
  'Menaje',
  'Ropa de cama',
];

const VEHICLE_TYPES = [
  { value: 'TURISMO_CAMPERIZADO', label: 'Camper Pequeña', icon: CarFront },
  { value: 'CAMPER_GRAN_VOLUMEN', label: 'Camper Gran Volumen', icon: Truck },
  { value: 'CARAVANA', label: 'Caravana', icon: Caravan },
  { value: 'AUTOCARAVANA', label: 'Autocaravana', icon: BusFront },
  { value: '4X4_CAMPERIZADO', label: '4x4 Camper', icon: Mountain },
  { value: 'BARCO', label: 'Barco / Velero', icon: Ship },
] as const;

export default function PublishCamperPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => {
        const isLoggedIn = Boolean(data.user);
        setAuthorized(isLoggedIn);
        if (!isLoggedIn) window.location.href = '/';
      })
      .catch(() => {
        setAuthorized(false);
        window.location.href = '/';
      });
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    vehicleType: 'TURISMO_CAMPERIZADO',
    year: new Date().getFullYear(),
    island: 'Gran Canaria',
    municipality: 'Las Palmas de Gran Canaria',
    passengers: 4,
    beds: 4,
    doors: 4,
    transmission: 'AUTOMATIC',
    fuelType: 'DIESEL',
    fuelConsumption: '',
    basePricePerDay: 65,
    includedKmPerDay: 150,
    extraKmPrice: 0.25,
    unlimitedMileage: false,
    securityDeposit: 400,
    cleaningFee: 30,
    minDays: 2,
    maxDays: 30,
    bookingType: 'REQUEST_TO_BOOK',
    cancellationPolicy: 'MODERATE',
    addressApprox: '',
    description: '',
    rules: '',
    features: [] as string[],
  });

  // HELPER PARA EVITAR CEROS A LA IZQUIERDA EN NÚMEROS (Ej. 065 -> 65)
  const handleNumberInput = (field: keyof typeof formData, rawVal: string) => {
    const cleanStr = rawVal.replace(/^0+(?=\d)/, '');
    const val = cleanStr === '' ? 0 : Number(cleanStr);
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const validateStep1 = () => {
    setError('');
    if (!formData.title || formData.title.trim().length < 5) {
      setError('El título del anuncio debe tener al menos 5 caracteres.');
      return false;
    }
    if (!formData.brand || formData.brand.trim().length < 2) {
      setError('Introduce la marca del vehículo (ejemplo: Volkswagen, Fiat).');
      return false;
    }
    if (!formData.model || formData.model.trim().length < 1) {
      setError('Introduce el modelo del vehículo (ejemplo: California).');
      return false;
    }
    if (!formData.municipality || formData.municipality.trim().length < 2) {
      setError('Introduce el municipio donde se encuentra la camper.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    setError('');
    if (formData.basePricePerDay < 10) {
      setError('El precio por día debe ser de al menos 10€.');
      return false;
    }
    if (formData.description.trim().length < 40) {
      setError(`La descripción debe tener al menos 40 caracteres (llevas ${formData.description.trim().length}/40).`);
      return false;
    }
    if (formData.rules.trim().length < 10) {
      setError(`Las normas y condiciones deben tener al menos 10 caracteres (llevas ${formData.rules.trim().length}/10).`);
      return false;
    }
    if (!photoFile) {
      setError('Debes adjuntar al menos una foto principal de la camper.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/vehicles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al publicar camper');

      if (photoFile) {
        const upload = new FormData();
        upload.set('file', photoFile);
        const photoResponse = await fetch(`/api/vehicles/${data.vehicle.id}/photos`, { method: 'POST', body: upload });
        if (!photoResponse.ok) {
          const photoData = await photoResponse.json();
          throw new Error(photoData.error || 'El anuncio se creó, pero no se pudo subir la foto.');
        }
      }

      window.location.href = '/propietario?anuncio=creado';
    } catch (err: any) {
      setError(err.message || 'No se pudo enviar el anuncio a revisión.');
    } finally {
      setLoading(false);
    }
  };

  if (authorized !== true) return <div className="min-h-screen bg-[#F7F6F2]" />;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-xl space-y-8">
          {/* CABECERA PASOS */}
          <div className="border-b border-[#E9E1D2] pb-6 text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D97706]">
              Onboarding Propietarios
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13322E] mt-1">
              Publica tu Camper en Canarias
            </h1>
            <p className="text-xs text-[#6B726E] font-medium mt-2">
              Paso {step} de 3 — Completa una ficha fiable para enviarla a revisión
            </p>
          </div>

          {/* ALERTA DE ERROR */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PASO 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-bold text-[#13322E]">1. Datos del Vehículo</h3>

                <fieldset>
                  <legend className="mb-3 text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Tipo de vehículo
                  </legend>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {VEHICLE_TYPES.map(({ value, label, icon: Icon }) => {
                      const selected = formData.vehicleType === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setFormData({ ...formData, vehicleType: value })}
                          className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition cursor-pointer ${
                            selected
                              ? 'border-[#16B8AA] bg-[#F0FDFA] text-[#0F766E] ring-2 ring-[#16B8AA]/30 font-bold'
                              : 'border-[#E9E1D2] bg-white text-[#6B726E] hover:border-[#16B8AA]/60'
                          }`}
                        >
                          <Icon className="mb-2 h-7 w-7 text-[#16B8AA]" strokeWidth={1.7} />
                          <span className="text-[11px] font-bold leading-tight">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E]">
                      Título del Anuncio
                    </label>
                    <span className={`text-[10px] font-bold ${formData.title.length >= 5 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      Mínimo 5 caracteres ({formData.title.length}/5)
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ej. VW California Ocean T6.1 Las Palmas"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Isla</label>
                    <select
                      value={formData.island}
                      onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    >
                      {CANARY_ISLANDS.map((is) => (
                        <option key={is.id} value={is.name}>
                          {is.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Municipio</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Telde, Las Palmas"
                      value={formData.municipality}
                      onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Marca</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Volkswagen"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Modelo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. California Ocean"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Año</label>
                    <input
                      type="number"
                      required
                      value={formData.year || ''}
                      onChange={(e) => handleNumberInput('year', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="w-full py-4 rounded-full bg-[#16B8AA] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all cursor-pointer shadow-md"
                >
                  Continuar a Equipamiento y Precios →
                </button>
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-bold text-[#13322E]">2. Capacidad y equipamiento</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Nº Viajeros</label>
                    <input
                      type="number"
                      value={formData.passengers || ''}
                      onChange={(e) => handleNumberInput('passengers', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Nº Camas</label>
                    <input
                      type="number"
                      value={formData.beds || ''}
                      onChange={(e) => handleNumberInput('beds', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Puertas
                    <input
                      type="number"
                      min="2"
                      max="8"
                      value={formData.doors || ''}
                      onChange={(e) => handleNumberInput('doors', e.target.value)}
                      className="mt-1 w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium"
                    />
                  </label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Cambio
                    <select
                      value={formData.transmission}
                      onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      className="mt-1 w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium"
                    >
                      <option value="MANUAL">Manual</option>
                      <option value="AUTOMATIC">Automático</option>
                    </select>
                  </label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Combustible
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                      className="mt-1 w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium"
                    >
                      <option value="DIESEL">Diésel</option>
                      <option value="GASOLINE">Gasolina</option>
                      <option value="HYBRID">Híbrido</option>
                      <option value="ELECTRIC">Eléctrico</option>
                    </select>
                  </label>
                </div>

                <fieldset>
                  <legend className="mb-2 text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Equipamiento incluido
                  </legend>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {EQUIPMENT.map((item) => (
                      <label
                        key={item}
                        className={`rounded-xl border p-3 text-xs font-bold cursor-pointer transition-colors ${
                          formData.features.includes(item)
                            ? 'border-[#16B8AA] bg-[#F0FDFA] text-[#0F766E]'
                            : 'border-[#E9E1D2] bg-white text-[#13322E]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mr-2 accent-[#16B8AA]"
                          checked={formData.features.includes(item)}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              features: formData.features.includes(item)
                                ? formData.features.filter((v) => v !== item)
                                : [...formData.features, item],
                            })
                          }
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-4 rounded-full border border-[#E9E1D2] font-bold text-xs uppercase tracking-wider hover:bg-[#F8FAFC] cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 py-4 rounded-full bg-[#16B8AA] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all cursor-pointer shadow-md"
                  >
                    Continuar a tarifas y condiciones →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-bold text-[#13322E]">3. Tarifas, condiciones y presentación</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                      Precio / día (€)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.basePricePerDay || ''}
                      onChange={(e) => handleNumberInput('basePricePerDay', e.target.value)}
                      placeholder="65"
                      className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-base font-extrabold text-[#16B8AA] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                      Fianza (€)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.securityDeposit || ''}
                      onChange={(e) => handleNumberInput('securityDeposit', e.target.value)}
                      placeholder="400"
                      className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-base font-bold text-[#13322E] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Km incluidos/día
                    <input
                      type="number"
                      min="0"
                      value={formData.includedKmPerDay || ''}
                      onChange={(e) => handleNumberInput('includedKmPerDay', e.target.value)}
                      className="mt-1 w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium"
                    />
                  </label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Km extra (€)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.extraKmPrice || ''}
                      onChange={(e) => handleNumberInput('extraKmPrice', e.target.value)}
                      className="mt-1 w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium"
                    />
                  </label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Mínimo días
                    <input
                      type="number"
                      min="1"
                      value={formData.minDays || ''}
                      onChange={(e) => handleNumberInput('minDays', e.target.value)}
                      className="mt-1 w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium"
                    />
                  </label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Máximo días
                    <input
                      type="number"
                      min={formData.minDays}
                      value={formData.maxDays || ''}
                      onChange={(e) => handleNumberInput('maxDays', e.target.value)}
                      className="mt-1 w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Tipo de reserva
                    <select
                      value={formData.bookingType}
                      onChange={(e) => setFormData({ ...formData, bookingType: e.target.value })}
                      className="mt-1 w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-bold"
                    >
                      <option value="REQUEST_TO_BOOK">Solicitud con aprobación</option>
                      <option value="INSTANT_BOOKING">Reserva inmediata</option>
                    </select>
                  </label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
                    Cancelación
                    <select
                      value={formData.cancellationPolicy}
                      onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                      className="mt-1 w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-bold"
                    >
                      <option value="FLEXIBLE">Flexible</option>
                      <option value="MODERATE">Moderada</option>
                      <option value="STRICT">Estricta</option>
                    </select>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                    Punto aproximado de recogida
                  </label>
                  <input
                    required
                    placeholder="Zona o barrio (ej. Las Canteras, Telde); la dirección exacta no será pública"
                    value={formData.addressApprox}
                    onChange={(e) => setFormData({ ...formData, addressApprox: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium"
                  />
                </div>

                {/* DESCRIPCIÓN CON CONTADOR Y MÍNIMO DE CARACTERES */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E]">
                      Descripción de la Camper
                    </label>
                    <span
                      className={`text-[10px] font-bold ${
                        formData.description.trim().length >= 40 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      Mínimo 40 caracteres ({formData.description.trim().length}/40)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe los puntos fuertes de tu camper, equipamiento de cocina, placas solares, estado mecánico, etc. (mínimo 40 caracteres)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  />
                </div>

                {/* NORMAS CON CONTADOR Y MÍNIMO DE CARACTERES */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E]">
                      Normas y condiciones de uso
                    </label>
                    <span
                      className={`text-[10px] font-bold ${
                        formData.rules.trim().length >= 10 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      Mínimo 10 caracteres ({formData.rules.trim().length}/10)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Mascotas, fumar, festivales, horarios de entrega, experiencia mínima de conducción..."
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  />
                </div>

                {/* FOTO PRINCIPAL */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                    Foto principal (Requerida)
                  </label>
                  <label className="flex min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#16B8AA]/40 bg-[#F0FDFA] text-center hover:bg-[#E6FFFA] transition-colors">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Vista previa" className="h-56 w-full object-cover" />
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <Upload className="w-8 h-8 text-[#16B8AA] mx-auto" />
                        <span className="block text-sm font-bold text-[#0F766E]">
                          Pulsa para subir una foto JPG, PNG o WEBP
                        </span>
                        <span className="block text-[11px] text-[#6B726E]">Máximo 5 MB</span>
                      </div>
                    )}
                    <input
                      type="file"
                      required
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setPhotoFile(file);
                          setPhotoPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="rounded-2xl border border-[#16B8AA]/30 bg-[#F0FDFA] p-4 text-xs font-medium text-[#0F766E] flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-[#16B8AA] shrink-0" />
                  <span>
                    El anuncio quedará en revisión inicial. Una vez aprobado aparecerá públicamente para recibir reservas.
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-4 rounded-full border border-[#E9E1D2] font-bold text-xs uppercase tracking-wider hover:bg-[#F8FAFC] cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-4 rounded-full bg-[#16B8AA] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Enviando anuncio...' : 'ENVIAR ANUNCIO A REVISIÓN'}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
