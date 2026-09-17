'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CANARY_ISLANDS } from '@/lib/pricing';
import {
  Gauge,
  Zap,
  Shield,
  Upload,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Trophy,
  Compass,
} from 'lucide-react';
import {
  HypercarSilhouette,
  SupercarV8Silhouette,
  TrackGTSilhouette,
  GranTurismoSilhouette,
  SpyderSilhouette,
  SuperSUVSilhouette,
} from '@/components/SupercarIcons';
import OwnerLocationMapPicker from '@/components/OwnerLocationMapPicker';
import { analytics } from '@/lib/analytics';

const SUPERCAR_EQUIPMENT = [
  'Escape Deportivo Valvetronic',
  'Frenos Carbocerámicos (PCCB/CCM)',
  'Launch Control',
  'Suspensión Neumática con Eje Elevable (Front Lift)',
  'Telemetría de Circuito & Lap Timer',
  'Interior en Fibra de Carbono & Alcantara',
  'Asientos Baquet de Competición',
  'Sistema de Sonido Premium (Burmester/B&O)',
  'Apple CarPlay / Cockpit Digital',
  'Cámaras 360º de Maniobra',
  'Tracción Total Inteligente (AWD)',
  'Alerón Aerodinámico Activo / DRS',
];

const SUPERCAR_CATEGORIES = [
  { value: 'HYPERCAR', label: 'Hypercar V12 / Híbrido', icon: HypercarSilhouette, desc: 'Ferrari SF90, Revuelto, Aventador' },
  { value: 'SUPERCAR_V8_V10', label: 'Superdeportivo V8 / V10', icon: SupercarV8Silhouette, desc: 'Ferrari 296, Huracán, 765LT, R8' },
  { value: 'TRACK_TOY', label: 'Track Focused / GT', icon: TrackGTSilhouette, desc: 'Porsche 911 GT3 RS, AMG Black Series' },
  { value: 'GRAN_TURISMO', label: 'Gran Turismo V8 / V12', icon: GranTurismoSilhouette, desc: 'Aston Martin DBS, Bentley GT, Roma' },
  { value: 'SPYDER_CABRIO', label: 'Spyder / Descapotable', icon: SpyderSilhouette, desc: 'F8 Spider, Huracán Spyder, 911 Cabrio' },
  { value: 'SUV_LUXURY', label: 'Super SUV Deportivo', icon: SuperSUVSilhouette, desc: 'Lamborghini Urus, Purosangue, DBX' },
] as const;

export default function PublishSupercarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);

  useEffect(() => { analytics.track('vehicle_creation_start'); }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => {
        const isLoggedIn = Boolean(data.user);
        setAuthorized(isLoggedIn);
        if (!isLoggedIn) window.location.href = '/login?callbackUrl=/publicar-camper';
      })
      .catch(() => {
        setAuthorized(false);
        window.location.href = '/login?callbackUrl=/publicar-camper';
      });
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    vehicleType: 'SUPERCAR_V8_V10',
    year: new Date().getFullYear(),
    island: 'Gran Canaria',
    municipality: 'Las Palmas de Gran Canaria',
    passengers: 2,
    beds: 0,
    doors: 2,
    transmission: 'AUTOMATIC',
    fuelType: 'GASOLINE',
    fuelConsumption: '',
    powerCv: 650,
    acceleration0100: 3.0,
    topSpeed: 330,
    basePricePerDay: 950,
    includedKmPerDay: 150,
    extraKmPrice: 3.5,
    unlimitedMileage: false,
    securityDeposit: 3000,
    cleaningFee: 50,
    minDays: 1,
    maxDays: 30,
    bookingType: 'REQUEST_TO_BOOK',
    cancellationPolicy: 'STRICT',
    addressApprox: '',
    latitude: null as number | null,
    longitude: null as number | null,
    description: '',
    rules: '',
    features: [] as string[],
  });

  // GESTIÓN DE TARIFAS POR TEMPORADA / EVENTOS
  const [pricingRules, setPricingRules] = useState<Array<{ id: string; name: string; startDate: string; endDate: string; pricePerDay: number }>>([]);
  const [ruleName, setRuleName] = useState('');
  const [ruleStart, setRuleStart] = useState('');
  const [ruleEnd, setRuleEnd] = useState('');
  const [rulePrice, setRulePrice] = useState<number>(1200);

  const handleAddPricingRule = () => {
    if (!ruleStart || !ruleEnd) {
      setError('Selecciona las fechas de inicio y fin para la tarifa especial.');
      return;
    }
    if (new Date(ruleEnd) <= new Date(ruleStart)) {
      setError('La fecha de fin debe ser posterior a la de inicio.');
      return;
    }
    if (rulePrice < 50) {
      setError('El precio de la tarifa especial debe ser al menos de 50€/día.');
      return;
    }
    setError('');
    const newRule = {
      id: Math.random().toString(36).substring(7),
      name: ruleName.trim() || 'Tarifa Evento / Temporada Alta',
      startDate: ruleStart,
      endDate: ruleEnd,
      pricePerDay: Number(rulePrice),
    };
    setPricingRules([...pricingRules, newRule]);
    setRuleName('');
    setRuleStart('');
    setRuleEnd('');
    setRulePrice(formData.basePricePerDay ? Math.round(formData.basePricePerDay * 1.25) : 1200);
  };

  const handleRemovePricingRule = (id: string) => {
    setPricingRules(pricingRules.filter((r) => r.id !== id));
  };

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
      setError('Introduce la marca del superdeportivo (ej: Porsche, Ferrari, Lamborghini).');
      return false;
    }
    if (!formData.model || formData.model.trim().length < 1) {
      setError('Introduce el modelo del vehículo (ej: 911 GT3 RS, Huracán STO).');
      return false;
    }
    if (!formData.municipality || formData.municipality.trim().length < 2) {
      setError('Introduce la zona donde se ubica el vehículo.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    setError('');
    if (formData.basePricePerDay < 50) {
      setError('El precio por día debe ser de al menos 50€.');
      return false;
    }
    if (formData.securityDeposit < 500) {
      setError('La fianza recomendada para vehículos de alta gama es de al menos 500€.');
      return false;
    }
    if (!formData.description || formData.description.trim().length < 20) {
      setError('Escribe una descripción de al menos 20 caracteres sobre las especificaciones y estado del vehículo.');
      return false;
    }
    if (formData.rules.trim().length < 10) {
      setError(`Las normas y requisitos deben tener al menos 10 caracteres (llevas ${formData.rules.trim().length}/10).`);
      return false;
    }
    if (photoFiles.length < 5) {
      setError(`Debes adjuntar al menos 5 fotos de alta resolución (${photoFiles.length}/5).`);
      return false;
    }
    if (photoFiles.length > 10) {
      setError('Puedes adjuntar como máximo 10 fotos.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    setError('');
    analytics.formSubmit('owner_vehicle_publish');

    try {
      const res = await fetch('/api/vehicles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pricingRules: pricingRules.map((r) => ({
            name: r.name,
            startDate: r.startDate,
            endDate: r.endDate,
            pricePerDay: r.pricePerDay,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al publicar vehículo');

      for (let index = 0; index < photoFiles.length; index += 1) {
        const upload = new FormData();
        upload.set('file', photoFiles[index]);
        upload.set('caption', ['Exterior Frontal', 'Interior Cockpit', 'Trasera & Motor', 'Detalle Llanta / Frenos', 'Lateral'][index] || 'Foto adicional');
        upload.set('isCover', String(index === coverPhotoIndex));
        const photoResponse = await fetch(`/api/vehicles/${data.vehicle.id}/photos`, { method: 'POST', body: upload });
        if (!photoResponse.ok) {
          const photoData = await photoResponse.json();
          throw new Error(photoData.error || 'El vehículo se registró, pero ocurrió un fallo al subir la fotografía.');
        }
      }

      analytics.track('vehicle_creation_success');
      analytics.track('vehicle_publish_success');
      window.location.href = '/propietario?anuncio=creado';
    } catch (err: any) {
      setError(err.message || 'No se pudo enviar el anuncio a revisión.');
    } finally {
      setLoading(false);
    }
  };

  if (authorized !== true) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-black">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-2xl backdrop-blur-2xl space-y-8">
          {/* CABECERA PASOS */}
          <div className="border-b border-gray-200 pb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-black text-[10px] font-mono tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              GTR CARS // PARTNERS VAULT
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Publica tu Superdeportivo en Canarias
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-2">
              Paso {step} de 3 — Protocolo de homologación e inspección técnica para propietarios
            </p>
          </div>

          {/* ALERTA DE ERROR */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-950/40 text-red-400 text-xs font-mono border border-red-500/30 flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PASO 1: DATOS TÉCNICOS & TELEMETRÍA */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-black flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-black" />
                    1. Categoría y Telemetría del Vehículo
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Selecciona el segmento de ingeniería y datos de rendimiento para el configurador.
                  </p>
                </div>

                <fieldset>
                  <legend className="mb-3 text-xs font-mono uppercase tracking-wider text-gray-500">
                    Segmento Superdeportivo
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {SUPERCAR_CATEGORIES.map(({ value, label, icon: Icon, desc }) => {
                      const selected = formData.vehicleType === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setFormData({ ...formData, vehicleType: value })}
                          className={`group flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            selected
                              ? 'border-[#D4AF37] bg-gray-100 text-black ring-1 ring-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                              : 'border-gray-200 bg-neutral-900/80 text-gray-500 hover:border-white/30 hover:bg-neutral-900 hover:text-black'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-3">
                            <Icon className={`w-16 h-8 transition-all ${selected ? 'text-black scale-105' : 'text-gray-600 group-hover:text-black'}`} />
                            {selected ? (
                              <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-white/10 group-hover:bg-white/30" />
                            )}
                          </div>
                          <span className="text-xs font-mono font-bold text-black block leading-tight">{label}</span>
                          <span className="text-[10px] font-mono text-gray-500 mt-1 block leading-tight">{desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500">
                      Título del Anuncio (Ej: Ferrari 296 GTB V6 Hybrid Assetto Fiorano)
                    </label>
                    <span className={`text-[10px] font-mono ${formData.title.length >= 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {formData.title.length}/5 mín.
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Porsche 911 GT3 RS Weissach Package (Gran Canaria)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Isla</label>
                    <select
                      value={formData.island}
                      onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      {CANARY_ISLANDS.map((is) => (
                        <option key={is.id} value={is.name}>
                          {is.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Municipio / Zona</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Las Palmas / Meloneras / Costa Adeje"
                      value={formData.municipality}
                      onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <OwnerLocationMapPicker
                  island={formData.island}
                  municipality={formData.municipality}
                  initialLat={formData.latitude}
                  initialLng={formData.longitude}
                  initialAddressApprox={formData.addressApprox}
                  onChange={({ latitude, longitude, addressApprox }) => {
                    setFormData((prev) => ({
                      ...prev,
                      latitude,
                      longitude,
                      addressApprox,
                    }));
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Marca</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Porsche"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Modelo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 911 GT3 RS"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Año</label>
                    <input
                      type="number"
                      required
                      value={formData.year || ''}
                      onChange={(e) => handleNumberInput('year', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="w-full py-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer shadow-lg"
                >
                  Continuar a Prestaciones y Equipamiento →
                </button>
              </div>
            )}

            {/* PASO 2: PRESTACIONES & ESPECIFICACIONES */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-black flex items-center gap-2">
                    <Zap className="w-5 h-5 text-black" />
                    2. Prestaciones de Conducción y Equipamiento
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Detalla la potencia y paquete aerodinámico del superdeportivo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Potencia (CV)</label>
                    <input
                      type="number"
                      placeholder="Ej. 525"
                      value={formData.powerCv || ''}
                      onChange={(e) => handleNumberInput('powerCv', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black font-bold focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">0-100 km/h (s)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Ej. 3.2"
                      value={formData.acceleration0100 || ''}
                      onChange={(e) => handleNumberInput('acceleration0100', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Plazas</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.passengers || ''}
                      onChange={(e) => handleNumberInput('passengers', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    Caja de Cambios
                    <select
                      value={formData.transmission}
                      onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      className="mt-1 w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:border-[#D4AF37] outline-none cursor-pointer"
                    >
                      <option value="AUTOMATIC">Automático / Doble Embrague (PDK/DCT)</option>
                      <option value="MANUAL">Manual Deportivo con Rev-Match</option>
                    </select>
                  </label>
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    Motorización
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                      className="mt-1 w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:border-[#D4AF37] outline-none cursor-pointer"
                    >
                      <option value="GASOLINE">Gasolina Atmosférico / Turbo (98 Octanos)</option>
                      <option value="HYBRID">Híbrido Enchufable de Altas Prestaciones (PHEV)</option>
                      <option value="ELECTRIC">100% Eléctrico (Dual/Tri-Motor)</option>
                    </select>
                  </label>
                </div>

                <fieldset>
                  <legend className="mb-2 text-xs font-mono uppercase tracking-wider text-gray-500">
                    Equipamiento y Opcionales de Circuito
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SUPERCAR_EQUIPMENT.map((item) => (
                      <label
                        key={item}
                        className={`rounded-xl border p-3 text-xs font-mono cursor-pointer transition-all flex items-center ${
                          formData.features.includes(item)
                            ? 'border-[#D4AF37] bg-gray-100 text-black font-bold'
                            : 'border-gray-200 bg-neutral-900/60 text-gray-500 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mr-3 accent-[#D4AF37]"
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
                    className="w-1/3 py-4 rounded-xl border border-white/15 font-mono font-bold text-xs uppercase tracking-wider text-gray-600 hover:bg-white/5 cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 py-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer shadow-lg"
                  >
                    Continuar a Tarifas y Condiciones →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: TARIFAS, FIANZA & CONDICIONES */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-black flex items-center gap-2">
                    <Shield className="w-5 h-5 text-black" />
                    3. Tarifas, Fianza y Galería de Fotos
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Establece el precio por jornada y el depósito de garantía.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
                      Precio Diario (€ / jornada)
                    </label>
                    <input
                      type="number"
                      required
                      min="50"
                      value={formData.basePricePerDay || ''}
                      onChange={(e) => handleNumberInput('basePricePerDay', e.target.value)}
                      placeholder="950"
                      className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-lg font-mono font-extrabold text-black focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
                      Fianza / Depósito de Seguridad (€)
                    </label>
                    <input
                      type="number"
                      required
                      min="500"
                      value={formData.securityDeposit || ''}
                      onChange={(e) => handleNumberInput('securityDeposit', e.target.value)}
                      placeholder="3000"
                      className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-lg font-mono font-bold text-black focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* DESGLOSE ECONÓMICO EN TIEMPO REAL */}
                {formData.basePricePerDay > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-neutral-900/80 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-black">
                        Liquidación de Ingresos GTR Cars
                      </span>
                      <span className="text-[10px] font-mono bg-[#D4AF37]/20 text-black font-bold px-2.5 py-0.5 rounded-full border border-gray-200">
                        Transferencia Bancaria Directa
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                        <span className="block text-[11px] text-gray-500 font-mono">
                          El cliente abonará:
                        </span>
                        <div className="flex items-baseline space-x-1.5 mt-0.5">
                          <strong className="text-xl font-bold font-mono text-black">
                            {(Math.round(formData.basePricePerDay * 1.045 * 100) / 100).toFixed(2)} €
                          </strong>
                          <span className="text-xs text-gray-500 font-mono">/ jornada</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono mt-1">
                          (Tu tarifa + tarifa de concierge y seguro de cobertura total)
                        </p>
                      </div>

                      <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                        <span className="block text-[11px] text-gray-500 font-mono">
                          Ingreso neto para el propietario:
                        </span>
                        <div className="flex items-baseline space-x-1.5 mt-0.5">
                          <strong className="text-xl font-bold font-mono text-black">
                            {(Math.round(formData.basePricePerDay * 0.90 * 100) / 100).toFixed(2)} €
                          </strong>
                          <span className="text-xs text-gray-500 font-mono">netos / jornada</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono mt-1">
                          (Tras el 10% de gestión y custodia de plataforma)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULO INTERACTIVO DE TARIFAS POR EVENTOS */}
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-mono font-bold text-black flex items-center gap-1.5">
                        <span>Tarifas especiales para eventos / temporada alta</span>
                      </h4>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                        Personaliza el precio para semanas de Rallyes, concentraciones de superdeportivos o festivos.
                      </p>
                    </div>
                  </div>

                  {/* FORMULARIO PARA AÑADIR NUEVA TARIFA */}
                  <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                          Motivo / Evento
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Rally Islas Canarias / Fin de Año"
                          value={ruleName}
                          onChange={(e) => setRuleName(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-white/15 bg-neutral-900 text-xs font-mono text-black focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                          Desde
                        </label>
                        <input
                          type="date"
                          value={ruleStart}
                          onChange={(e) => setRuleStart(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-white/15 bg-neutral-900 text-xs font-mono text-black focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                          Hasta
                        </label>
                        <input
                          type="date"
                          value={ruleEnd}
                          onChange={(e) => setRuleEnd(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-white/15 bg-neutral-900 text-xs font-mono text-black focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-gray-600">
                          Tarifa en estas fechas:
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="50"
                            value={rulePrice || ''}
                            onChange={(e) => setRulePrice(Number(e.target.value))}
                            className="w-24 p-2 rounded-lg border border-white/15 bg-neutral-900 text-xs font-mono font-bold text-black text-center"
                          />
                          <span className="text-xs font-mono text-gray-500">€/día</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPricingRule}
                        className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
                      >
                        + Añadir Tarifa
                      </button>
                    </div>
                  </div>

                  {/* LISTA DE TARIFAS CONFIGURADAS */}
                  {pricingRules.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">
                        Tarifas especiales activas ({pricingRules.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {pricingRules.map((r) => (
                          <div
                            key={r.id}
                            className="p-3 bg-neutral-900 rounded-xl border border-gray-200 flex items-center justify-between text-xs shadow-sm font-mono"
                          >
                            <div>
                              <span className="font-bold text-black block">{r.name}</span>
                              <span className="text-[10px] text-gray-500">
                                {new Date(r.startDate).toLocaleDateString()} al {new Date(r.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-extrabold text-black text-sm">{r.pricePerDay} €/día</span>
                              <button
                                type="button"
                                onClick={() => handleRemovePricingRule(r.id)}
                                className="text-red-400 hover:text-red-300 font-bold text-xs p-1"
                                title="Eliminar tarifa"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    Km diarios inc.
                    <input
                      type="number"
                      min="0"
                      value={formData.includedKmPerDay || ''}
                      onChange={(e) => handleNumberInput('includedKmPerDay', e.target.value)}
                      className="mt-1 w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:border-[#D4AF37] outline-none"
                    />
                  </label>
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    Km extra (€)
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.extraKmPrice || ''}
                      onChange={(e) => handleNumberInput('extraKmPrice', e.target.value)}
                      className="mt-1 w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:border-[#D4AF37] outline-none"
                    />
                  </label>
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    Mínimo días
                    <input
                      type="number"
                      min="1"
                      value={formData.minDays || ''}
                      onChange={(e) => handleNumberInput('minDays', e.target.value)}
                      className="mt-1 w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:border-[#D4AF37] outline-none"
                    />
                  </label>
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    Máximo días
                    <input
                      type="number"
                      min={formData.minDays}
                      value={formData.maxDays || ''}
                      onChange={(e) => handleNumberInput('maxDays', e.target.value)}
                      className="mt-1 w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:border-[#D4AF37] outline-none"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    Modalidad de Reserva
                    <select
                      value={formData.bookingType}
                      onChange={(e) => setFormData({ ...formData, bookingType: e.target.value })}
                      className="mt-1 w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:border-[#D4AF37] outline-none cursor-pointer"
                    >
                      <option value="REQUEST_TO_BOOK">Solicitud Concierge con Validación</option>
                      <option value="INSTANT_BOOKING">Reserva Inmediata con Fianza</option>
                    </select>
                  </label>
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    Política de Cancelación
                    <select
                      value={formData.cancellationPolicy}
                      onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                      className="mt-1 w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:border-[#D4AF37] outline-none cursor-pointer"
                    >
                      <option value="STRICT">Estricta (Recomendada para Superdeportivos)</option>
                      <option value="MODERATE">Moderada (7 días de antelación)</option>
                      <option value="FLEXIBLE">Flexible (48 horas de antelación)</option>
                    </select>
                  </label>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500">
                      Descripción del Superdeportivo
                    </label>
                    <span className={`text-[10px] font-mono ${formData.description.trim().length >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {formData.description.trim().length}/20 mín.
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe el estado de conservación, configuración de fábrica, sonido del escape, mantenimiento en servicio oficial, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500">
                      Requisitos de Conducción y Normas
                    </label>
                    <span className={`text-[10px] font-mono ${formData.rules.trim().length >= 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {formData.rules.trim().length}/10 mín.
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Edad mínima (ej: +25 años, 3 años de carnet), prohibición de circuito cerrado sin autorización, combustible 98 octanos obligatorio..."
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-white/15 bg-neutral-900 text-sm font-mono text-black focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* GALERÍA OBLIGATORIA */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
                    Fotografías del Vehículo (Mínimo 5, Máximo 10)
                  </label>
                  <label className="flex min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#D4AF37]/40 bg-gray-100 text-center hover:bg-black/90 transition-colors">
                    {photoPreviews.length ? (
                      <div className="grid w-full grid-cols-2 gap-2 p-3 sm:grid-cols-5">
                        {photoPreviews.map((preview, index) => (
                          <img
                            key={preview}
                            src={preview}
                            alt={`Foto ${index + 1}`}
                            className={`h-28 w-full rounded-xl object-cover ${index === coverPhotoIndex ? 'ring-4 ring-[#D4AF37]' : ''}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <Upload className="w-8 h-8 text-black mx-auto" />
                        <span className="block text-sm font-mono font-bold text-black">
                          Pulsa para subir fotografías de alta calidad (JPG, PNG o WEBP)
                        </span>
                        <span className="block text-[11px] font-mono text-gray-500">Máximo 10 MB por imagen</span>
                      </div>
                    )}
                    <input
                      type="file"
                      required
                      multiple
                      maxLength={10}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        const files = Array.from(event.target.files || []);
                        if (files.length > 10) {
                          setError('Puedes adjuntar como máximo 10 fotos.');
                          return;
                        }
                        setPhotoFiles(files);
                        setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
                        setCoverPhotoIndex(0);
                      }}
                    />
                  </label>
                  {photoPreviews.length > 0 && (
                    <div className="mt-3 flex items-center justify-between text-xs font-mono text-gray-500">
                      <span>{photoPreviews.length} fotos seleccionadas</span>
                      <label>
                        Portada:{' '}
                        <select
                          value={coverPhotoIndex}
                          onChange={(e) => setCoverPhotoIndex(Number(e.target.value))}
                          className="ml-2 rounded-lg border border-white/15 bg-neutral-900 p-1.5 text-black"
                        >
                          {photoPreviews.map((_, index) => (
                            <option key={index} value={index}>
                              Foto {index + 1}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#D4AF37]/5 p-4 text-xs font-mono text-gray-600 flex items-center space-x-2.5">
                  <CheckCircle2 className="h-5 w-5 text-black shrink-0" />
                  <span>
                    El superdeportivo entrará en fase de verificación y auditoría por el equipo de GTR Cars antes de su activación pública en el Vault.
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-4 rounded-xl border border-white/15 font-mono font-bold text-xs uppercase tracking-wider text-gray-600 hover:bg-white/5 cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'PUBLICANDO SUPERDEPORTIVO...' : 'HOMOLOGAR Y REGISTRAR EN EL VAULT'}</span>
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
