'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Gauge,
  Zap,
  Shield,
  Upload,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  DollarSign,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import {
  SupercarV8Silhouette,
  SpyderSilhouette,
  SedanDeportivoSilhouette,
  SuperSUVSilhouette,
} from '@/components/SupercarIcons';
import dynamic from 'next/dynamic';
import { analytics } from '@/lib/analytics';

const OwnerLocationMapPicker = dynamic(
  () => import('@/components/OwnerLocationMapPicker'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center text-xs font-mono text-gray-500 border border-gray-200">
        Cargando mapa interactivo...
      </div>
    ),
  }
);

const SUPERCAR_EQUIPMENT = [
  'Escape Deportivo Valvetronic',
  'Frenos Carbocerámicos (PCCB / CCM)',
  'Launch Control & Paquete Sport Chrono',
  'Eje Delantero Elevable (Front Lift System)',
  'Interior en Fibra de Carbono & Alcantara',
  'Asientos Baquet / Bucket Seats en Carbono',
  'Sistema de Sonido Premium Hi-Fi',
  'Apple CarPlay & Navegación Cockpit Digital',
  'Cámaras de Visión Perimétrica 360º',
  'Tracción Total Inteligente (AWD)',
  'Alerón Aerodinámico Activo / DRS',
  'Telemetría de Pista & Cronómetro',
];

const SUPERCAR_CATEGORIES = [
  { value: 'COUPE', label: 'Coupé', icon: SupercarV8Silhouette, desc: 'Porsche 911, Ferrari 296, Huracán, McLaren' },
  { value: 'CABRIO', label: 'Descapotable', icon: SpyderSilhouette, desc: 'Spyder, Cabriolet, Targa, Roadster' },
  { value: 'SEDAN_DEPORTIVO', label: 'Sedán Deportivo', icon: SedanDeportivoSilhouette, desc: 'Panamera, RS6, RS7, M5, AMG GT 4P' },
  { value: 'SUV_DEPORTIVO', label: 'Super SUV', icon: SuperSUVSilhouette, desc: 'Lamborghini Urus, Purosangue, DBX, Cayenne GT' },
] as const;

import {
  SUPERCAR_LOCATIONS,
  getCitiesByCountry,
} from '@/lib/supercar-locations';

export default function PublishSupercarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);

  useEffect(() => {
    analytics.track('vehicle_creation_start');
  }, []);

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          setAuthorized(true);
        } else {
          // Si no está logueado, permitir rellenar el formulario e invocar modal al intentar publicar
          setAuthorized(true);
        }
      })
      .catch(() => {
        setAuthorized(true);
      });
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    vehicleType: 'COUPE',
    year: new Date().getFullYear(),
    countryCode: 'ES',
    island: 'Madrid (Barajas / La Moraleja)',
    municipality: 'Madrid Centro / La Moraleja',
    passengers: 2,
    beds: 0,
    doors: 2,
    transmission: 'AUTOMATIC', // Opciones: 'AUTOMATIC' o 'MANUAL'
    drivetrain: 'RWD', // 'RWD', 'AWD', 'FWD'
    fuelType: 'GASOLINE',
    fuelConsumption: '',
    powerCv: 650,
    acceleration0100: 3.0 as number | null,
    accelerationUnknown: false,
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
      setError('Introduce la marca del vehículo (ej: Porsche, Ferrari, Lamborghini).');
      return false;
    }
    if (!formData.model || formData.model.trim().length < 1) {
      setError('Introduce el modelo del vehículo (ej: 911 GT3 RS, Huracán, SF90).');
      return false;
    }
    if (!formData.municipality || formData.municipality.trim().length < 2) {
      setError('Introduce la ciudad o base VIP donde se ubica el vehículo.');
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
      setError('La fianza de garantía debe ser de al menos 500€.');
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

    if (!currentUser) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('open-auth-modal', {
            detail: {
              mode: 'register',
              role: 'OWNER',
              subtitle: 'Identifícate o crea tu cuenta de propietario para publicar tu anuncio en el Vault.',
            },
          })
        );
      }
      setError('Debes iniciar sesión o registrarte como propietario para publicar el anuncio.');
      return;
    }

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

  if (authorized !== true) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="uppercase tracking-widest text-black font-bold">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-8">
          
          {/* CABECERA Y PASOS ESTILO PORSCHE CLEAN */}
          <div className="border-b border-gray-100 pb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-black text-[10px] font-mono tracking-widest uppercase mb-3 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              GTR CARS // PARTNERS VAULT
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black font-sans">
              Publicar Anuncio de Vehículo
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-2">
              Paso {step} de 3 — Completa los datos técnicos, tarifas y fotos para publicar tu coche
            </p>

            {/* BARRA DE PROGRESO DE PESTAÑAS */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 max-w-xl mx-auto font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`py-2 px-3 rounded-xl border font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  step === 1
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-black'
                }`}
              >
                <span>1. Datos</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className={`py-2 px-3 rounded-xl border font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  step === 2
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-black'
                }`}
              >
                <span>2. Prestaciones</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(3);
                }}
                className={`py-2 px-3 rounded-xl border font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  step === 3
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-black'
                }`}
              >
                <span>3. Tarifas & Fotos</span>
              </button>
            </div>
          </div>

          {/* ALERTA DE ERROR */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-mono border border-red-200 flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ======================================================== */}
            {/* PESTAÑA 1: DATOS TÉCNICOS & UBICACIÓN                   */}
            {/* ======================================================== */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-black font-sans uppercase tracking-wide flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-black" />
                    1. Categoría y Datos Básicos
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Selecciona el segmento y las especificaciones principales de tu vehículo.
                  </p>
                </div>

                {/* CATEGORÍA DE VEHÍCULO */}
                <fieldset>
                  <legend className="mb-3 text-xs font-mono uppercase tracking-wider text-gray-600 font-bold">
                    Categoría de Vehículo
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {SUPERCAR_CATEGORIES.map(({ value, label, icon: Icon, desc }) => {
                      const selected = formData.vehicleType === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setFormData({ ...formData, vehicleType: value })}
                          className={`group relative flex flex-col justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[140px] ${
                            selected
                              ? 'border-black bg-gray-50 text-black ring-1 ring-black shadow-sm'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-black'
                          }`}
                        >
                          {/* Indicador de selección */}
                          <div className="absolute top-3.5 right-3.5">
                            {selected ? (
                              <span className="h-2.5 w-2.5 rounded-full bg-black block" />
                            ) : (
                              <span className="h-2.5 w-2.5 rounded-full bg-gray-200 group-hover:bg-gray-400 block" />
                            )}
                          </div>

                          {/* Silueta grande y destacada en el recuadro */}
                          <div className="w-full h-16 sm:h-20 flex items-center justify-start pr-6 mb-2">
                            <Icon className={`h-full w-full object-contain object-left transition-all duration-200 ${selected ? 'scale-105 opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                          </div>

                          <div>
                            <span className="text-xs font-mono font-bold text-black block leading-tight">{label}</span>
                            <span className="text-[10px] font-mono text-gray-500 mt-1 block leading-tight">{desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* TÍTULO DEL ANUNCIO */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold">
                      Título del Anuncio (Ej: Porsche 911 GT3 RS Weissach Package)
                    </label>
                    <span className={`text-[10px] font-mono ${formData.title.length >= 5 ? 'text-emerald-600 font-bold' : 'text-amber-600'}`}>
                      {formData.title.length}/5 mín.
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Porsche 911 GT3 RS Weissach Package (Madrid)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                {/* MARCA, MODELO Y AÑO */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">Marca</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Porsche"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">Modelo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 911 GT3 RS"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">Año de Fabricación</label>
                    <input
                      type="number"
                      required
                      value={formData.year || ''}
                      onChange={(e) => handleNumberInput('year', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* ESPECIFICACIONES CLAVE: CV, CAJA, TRACCIÓN Y 0-100 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* POTENCIA (CV) */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Potencia (CV)
                    </label>
                    <input
                      type="number"
                      placeholder="Ej. 525"
                      value={formData.powerCv || ''}
                      onChange={(e) => handleNumberInput('powerCv', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black font-bold focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* CAJA DE CAMBIOS */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Caja de Cambios
                    </label>
                    <select
                      value={formData.transmission}
                      onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="AUTOMATIC">Automática (PDK / DKG / Secuencial)</option>
                      <option value="MANUAL">Manual</option>
                    </select>
                  </div>

                  {/* TRACCIÓN */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Tracción
                    </label>
                    <select
                      value={formData.drivetrain}
                      onChange={(e) => setFormData({ ...formData, drivetrain: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="RWD">Trasera (RWD)</option>
                      <option value="AWD">Total (AWD / 4x4)</option>
                      <option value="FWD">Delantera (FWD)</option>
                    </select>
                  </div>

                  {/* 0-100 KM/H CON OPCIÓN 'NO LO SÉ' */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold">
                        0 a 100 km/h
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-500 cursor-pointer select-none hover:text-black">
                        <input
                          type="checkbox"
                          checked={formData.accelerationUnknown}
                          onChange={(e) => {
                            const isUnknown = e.target.checked;
                            setFormData({
                              ...formData,
                              accelerationUnknown: isUnknown,
                              acceleration0100: isUnknown ? null : 3.0,
                            });
                          }}
                          className="rounded accent-black cursor-pointer w-3.5 h-3.5"
                        />
                        <span>No lo sé</span>
                      </label>
                    </div>
                    {formData.accelerationUnknown ? (
                      <div className="w-full p-3.5 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-xs font-mono text-gray-500 flex items-center justify-center">
                        No especificado
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Ej. 3.2"
                          value={formData.acceleration0100 ?? ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : Number(e.target.value);
                            setFormData({ ...formData, acceleration0100: val });
                          }}
                          className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400">
                          seg
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* UBICACIÓN: PAÍS, CIUDAD Y ZONA */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 1. PAÍS */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      País
                    </label>
                    <select
                      value={formData.countryCode}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        const availableCities = getCitiesByCountry(newCountry);
                        const defaultCity = availableCities[0]?.name || '';
                        setFormData({
                          ...formData,
                          countryCode: newCountry,
                          island: defaultCity,
                        });
                      }}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black cursor-pointer"
                    >
                      {SUPERCAR_LOCATIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. CIUDAD / BASE VIP (DEPENDIENTE DEL PAÍS) */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Ciudad / Base VIP
                    </label>
                    <select
                      value={formData.island}
                      onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black cursor-pointer"
                    >
                      {getCitiesByCountry(formData.countryCode).map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name} {city.popular ? '★' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. ZONA / BARRIO / AEROPUERTO */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Zona / Barrio / Aeropuerto
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. La Moraleja / Salamanca / Aeropuerto T4"
                      value={formData.municipality}
                      onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black"
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

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="w-full py-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Continuar a Prestaciones y Equipamiento</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ======================================================== */}
            {/* PESTAÑA 2: PRESTACIONES & ESPECIFICACIONES             */}
            {/* ======================================================== */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-black font-sans uppercase tracking-wide flex items-center gap-2">
                    <Zap className="w-5 h-5 text-black" />
                    2. Prestaciones de Conducción y Equipamiento
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Indica la potencia, transmisión y equipamiento del vehículo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">Velocidad Máx. (km/h)</label>
                    <input
                      type="number"
                      placeholder="Ej. 330"
                      value={formData.topSpeed || ''}
                      onChange={(e) => handleNumberInput('topSpeed', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black font-bold focus:border-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">Plazas Homologadas</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={formData.passengers || ''}
                      onChange={(e) => handleNumberInput('passengers', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:border-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Combustible / Propulsión
                    </label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:border-black outline-none cursor-pointer"
                    >
                      <option value="GASOLINE">Gasolina Premium 98</option>
                      <option value="HYBRID">Híbrido / Enchufable</option>
                      <option value="ELECTRIC">100% Eléctrico</option>
                      <option value="DIESEL">Diésel</option>
                    </select>
                  </div>
                </div>

                {/* EQUIPAMIENTOS SELECCIONABLES */}
                <fieldset>
                  <legend className="mb-2 text-xs font-mono uppercase tracking-wider text-gray-700 font-bold">
                    Equipamiento y Extras Destacados
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SUPERCAR_EQUIPMENT.map((item) => {
                      const isChecked = formData.features.includes(item);
                      return (
                        <label
                          key={item}
                          className={`rounded-xl border p-3 text-xs font-mono cursor-pointer transition-all flex items-center ${
                            isChecked
                              ? 'border-black bg-gray-50 text-black font-bold'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mr-3 accent-black"
                            checked={isChecked}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                features: isChecked
                                  ? formData.features.filter((v) => v !== item)
                                  : [...formData.features, item],
                              })
                            }
                          />
                          {item}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-4 rounded-xl border border-gray-300 font-mono font-bold text-xs uppercase tracking-wider text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Atrás</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 py-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Continuar a Tarifas y Condiciones</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* PESTAÑA 3: TARIFAS, CONDICIONES & FOTOGRAFÍAS           */}
            {/* ======================================================== */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-black font-sans uppercase tracking-wide flex items-center gap-2">
                    <Shield className="w-5 h-5 text-black" />
                    3. Tarifas, Fianza y Galería de Fotos
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Establece el precio por día, depósito de garantía y añade fotografías de calidad.
                  </p>
                </div>

                {/* PRECIO Y FIANZA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Precio Diario (€ / jornada)
                    </label>
                    <input
                      type="number"
                      required
                      min="50"
                      value={formData.basePricePerDay || ''}
                      onChange={(e) => handleNumberInput('basePricePerDay', e.target.value)}
                      placeholder="950"
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-lg font-mono font-extrabold text-black focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Fianza / Depósito de Seguridad (€)
                    </label>
                    <input
                      type="number"
                      required
                      min="500"
                      value={formData.securityDeposit || ''}
                      onChange={(e) => handleNumberInput('securityDeposit', e.target.value)}
                      placeholder="3000"
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-lg font-mono font-bold text-black focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* DESGLOSE ECONÓMICO TRANSPARENTE */}
                {formData.basePricePerDay > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-black font-bold">
                        Liquidación de Ingresos GTR Cars
                      </span>
                      <span className="text-[10px] font-mono bg-white text-black font-bold px-2.5 py-0.5 rounded-full border border-gray-200">
                        Transferencia Directa
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                        <span className="block text-[11px] text-gray-500 font-mono">
                          El cliente abonará:
                        </span>
                        <div className="flex items-baseline space-x-1.5 mt-0.5">
                          <strong className="text-xl font-bold font-mono text-black">
                            {(Math.round(formData.basePricePerDay * 1.097 * 100) / 100).toFixed(2)} €
                          </strong>
                          <span className="text-xs text-gray-500 font-mono">/ jornada</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-1">
                          (Tu tarifa + 9.7% tarifa de gestión de plataforma)
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                        <span className="block text-[11px] text-gray-500 font-mono">
                          Ingreso neto para el propietario:
                        </span>
                        <div className="flex items-baseline space-x-1.5 mt-0.5">
                          <strong className="text-xl font-bold font-mono text-black">
                            {Number(formData.basePricePerDay).toFixed(2)} €
                          </strong>
                          <span className="text-xs text-gray-500 font-mono">netos / jornada</span>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-mono mt-1 font-semibold">
                          0% de comisión para propietarios (Cobras el 100% de tu tarifa)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULO DE TARIFAS POR FECHA O EVENTOS */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                  <div>
                    <h4 className="text-sm font-mono font-bold text-black flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-black" />
                      <span>Tarifas especiales para eventos / temporada alta (Opcional)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      Ajusta el precio para fechas concretas, fines de semana o eventos.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-600 mb-1 font-bold">
                          Motivo / Evento
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Gran Premio / Fin de Año"
                          value={ruleName}
                          onChange={(e) => setRuleName(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-gray-300 bg-white text-xs font-mono text-black focus:border-black outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-600 mb-1 font-bold">
                          Desde
                        </label>
                        <input
                          type="date"
                          value={ruleStart}
                          onChange={(e) => setRuleStart(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-gray-300 bg-white text-xs font-mono text-black focus:border-black outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-600 mb-1 font-bold">
                          Hasta
                        </label>
                        <input
                          type="date"
                          value={ruleEnd}
                          onChange={(e) => setRuleEnd(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-gray-300 bg-white text-xs font-mono text-black focus:border-black outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-bold">
                          Tarifa diaria:
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="50"
                            value={rulePrice || ''}
                            onChange={(e) => setRulePrice(Number(e.target.value))}
                            className="w-24 p-2 rounded-lg border border-gray-300 bg-white text-xs font-mono font-bold text-black text-center"
                          />
                          <span className="text-xs font-mono text-gray-500">€/día</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPricingRule}
                        className="px-4 py-2 rounded-lg bg-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer"
                      >
                        + Añadir Tarifa
                      </button>
                    </div>
                  </div>

                  {pricingRules.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">
                        Tarifas especiales activas ({pricingRules.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {pricingRules.map((r) => (
                          <div
                            key={r.id}
                            className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between text-xs shadow-xs font-mono"
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
                                className="text-red-500 hover:text-red-700 font-bold text-xs p-1 cursor-pointer"
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

                {/* CONDICIONES DE KILOMETRAJE Y DÍAS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Km diarios inc.
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.includedKmPerDay || ''}
                      onChange={(e) => handleNumberInput('includedKmPerDay', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:border-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Km extra (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.extraKmPrice || ''}
                      onChange={(e) => handleNumberInput('extraKmPrice', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:border-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Mínimo días
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.minDays || ''}
                      onChange={(e) => handleNumberInput('minDays', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:border-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Máximo días
                    </label>
                    <input
                      type="number"
                      min={formData.minDays}
                      value={formData.maxDays || ''}
                      onChange={(e) => handleNumberInput('maxDays', e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:border-black outline-none"
                    />
                  </div>
                </div>

                {/* MODALIDAD Y POLÍTICA DE CANCELACIÓN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Modalidad de Reserva
                    </label>
                    <select
                      value={formData.bookingType}
                      onChange={(e) => setFormData({ ...formData, bookingType: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:border-black outline-none cursor-pointer"
                    >
                      <option value="REQUEST_TO_BOOK">Solicitud Concierge (Aprobación manual del propietario)</option>
                      <option value="INSTANT_BOOKING">Reserva Inmediata con Fianza</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                      Política de Cancelación
                    </label>
                    <select
                      value={formData.cancellationPolicy}
                      onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:border-black outline-none cursor-pointer"
                    >
                      <option value="STRICT">Estricta (Recomendada para alta gama)</option>
                      <option value="MODERATE">Moderada (7 días de antelación)</option>
                      <option value="FLEXIBLE">Flexible (48 horas de antelación)</option>
                    </select>
                  </div>
                </div>

                {/* DESCRIPCIÓN */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold">
                      Descripción del Vehículo
                    </label>
                    <span className={`text-[10px] font-mono ${formData.description.trim().length >= 20 ? 'text-emerald-600 font-bold' : 'text-amber-600'}`}>
                      {formData.description.trim().length}/20 mín.
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe el estado de conservación, historial, equipamiento y detalles especiales del vehículo..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black"
                  />
                </div>

                {/* REQUISITOS Y NORMAS */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold">
                      Requisitos de Conducción y Normas
                    </label>
                    <span className={`text-[10px] font-mono ${formData.rules.trim().length >= 10 ? 'text-emerald-600 font-bold' : 'text-amber-600'}`}>
                      {formData.rules.trim().length}/10 mín.
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Edad mínima recomendada (ej: +25 años, 3 años de permiso de conducir), prohibición de fumar o uso en tandas sin autorización previa..."
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm font-mono text-black focus:outline-none focus:border-black"
                  />
                </div>

                {/* GALERÍA DE FOTOS */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1">
                    Fotografías del Vehículo (Mínimo 5, Máximo 10)
                  </label>
                  <label className="flex min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center hover:bg-gray-100 transition-colors">
                    {photoPreviews.length ? (
                      <div className="grid w-full grid-cols-2 gap-2 p-3 sm:grid-cols-5">
                        {photoPreviews.map((preview, index) => (
                          <img
                            key={preview}
                            src={preview}
                            alt={`Foto ${index + 1}`}
                            className={`h-28 w-full rounded-xl object-cover ${index === coverPhotoIndex ? 'ring-4 ring-black' : 'border border-gray-200'}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <Upload className="w-8 h-8 text-black mx-auto" />
                        <span className="block text-sm font-mono font-bold text-black">
                          Pulsa para subir fotografías en alta resolución (JPG, PNG o WEBP)
                        </span>
                        <span className="block text-[11px] font-mono text-gray-500">Mínimo 5 fotos obligatorias (máx. 10 MB por imagen)</span>
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
                    <div className="mt-3 flex items-center justify-between text-xs font-mono text-gray-600">
                      <span>{photoPreviews.length} fotos seleccionadas</span>
                      <label>
                        Foto de portada:{' '}
                        <select
                          value={coverPhotoIndex}
                          onChange={(e) => setCoverPhotoIndex(Number(e.target.value))}
                          className="ml-2 rounded-lg border border-gray-300 bg-white p-1.5 text-black font-mono"
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

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs font-mono text-gray-700 flex items-center space-x-2.5">
                  <CheckCircle2 className="h-5 w-5 text-black shrink-0" />
                  <span>
                    El vehículo se publicará en el Garaje Privado y pasará a estar disponible para solicitudes de reserva y contratos entre clientes.
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-4 rounded-xl border border-gray-300 font-mono font-bold text-xs uppercase tracking-wider text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Atrás</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'PUBLICANDO ANUNCIO...' : 'PUBLICAR ANUNCIO DEL VEHÍCULO'}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
