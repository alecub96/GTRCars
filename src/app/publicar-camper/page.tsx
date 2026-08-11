'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CANARY_ISLANDS } from '@/lib/pricing';
import { BusFront, CarFront, Caravan, CheckCircle2, Mountain, Ship, Truck, Van } from 'lucide-react';

const EQUIPMENT = ['Aire acondicionado', 'Calefacción', 'Ducha interior', 'WC', 'Cocina', 'Frigorífico', 'Agua caliente', 'Placa solar', 'Toldo', 'Portabicicletas', 'Menaje', 'Ropa de cama'];
const VEHICLE_TYPES = [
  { value: 'CAMPER', label: 'Camper', icon: Van },
  { value: 'CAMPER_GRAN_VOLUMEN', label: 'Camper de gran volumen', icon: Truck },
  { value: 'TURISMO_CAMPERIZADO', label: 'Turismo camperizado', icon: CarFront },
  { value: 'CARAVANA', label: 'Caravana', icon: Caravan },
  { value: 'AUTOCARAVANA', label: 'Autocaravana', icon: BusFront },
  { value: '4X4_CAMPERIZADO', label: '4x4 camperizado', icon: Mountain },
  { value: 'BARCO', label: 'Barco', icon: Ship },
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
    fetch('/api/auth/me').then((response) => response.json()).then((data) => {
      const isOwner = data.user?.role === 'OWNER';
      setAuthorized(isOwner);
      if (!isOwner) window.location.href = data.user ? '/cuenta' : '/';
    }).catch(() => { setAuthorized(false); window.location.href = '/'; });
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    vehicleType: 'CAMPER',
    year: new Date().getFullYear(),
    island: 'Gran Canaria',
    municipality: 'Las Palmas de Gran Canaria',
    passengers: 4,
    beds: 4,
    doors: 4,
    transmission: 'AUTOMATIC',
    fuelType: 'DIESEL',
    fuelConsumption: '',
    basePricePerDay: 90,
    includedKmPerDay: 150,
    extraKmPrice: 0.25,
    unlimitedMileage: false,
    securityDeposit: 600,
    cleaningFee: 30,
    minDays: 2,
    maxDays: 30,
    bookingType: 'REQUEST_TO_BOOK',
    cancellationPolicy: 'FLEXIBLE',
    addressApprox: '',
    description: '',
    rules: '',
    photoUrl: '',
    features: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/vehicles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al publicar vehículo');

      if (photoFile) {
        const upload = new FormData(); upload.set('file', photoFile);
        const photoResponse = await fetch(`/api/vehicles/${data.vehicle.id}/photos`, { method: 'POST', body: upload });
        if (!photoResponse.ok) throw new Error((await photoResponse.json()).error || 'El anuncio se creó, pero no se pudo subir la foto');
      }

      router.push('/propietario?anuncio=creado');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authorized !== true) return <div className="min-h-screen bg-[#F7F6F2]" />;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-[#E9E1D2] shadow-xl space-y-8">
          
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

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#13322E]">1. Datos del Vehículo</h3>

                <fieldset>
                  <legend className="mb-3 text-xs font-black uppercase tracking-wider text-[#6B726E]">Tipo de vehículo</legend>
                  <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-3 scrollbar-thin sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-7">
                    {VEHICLE_TYPES.map(({ value, label, icon: Icon }) => {
                      const selected = formData.vehicleType === value;
                      return <button key={value} type="button" aria-pressed={selected} onClick={() => setFormData({ ...formData, vehicleType: value })} className={`flex min-w-[126px] snap-start flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${selected ? 'border-[#16B8AA] bg-[#F0FDFA] text-[#0F766E] ring-2 ring-[#16B8AA]/30' : 'border-[#E9E1D2] bg-white text-[#6B726E] hover:border-[#16B8AA]/60'}`}><Icon className="mb-2 h-9 w-9" strokeWidth={1.7} /><span className="text-[11px] font-bold leading-tight">{label}</span></button>;
                    })}
                  </div>
                </fieldset>
                
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Título del Anuncio</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. VW California Ocean T6.1 Las Palmas"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Isla</label>
                    <select
                      value={formData.island}
                      onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    >
                      {CANARY_ISLANDS.map((is) => (
                        <option key={is.id} value={is.name}>{is.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Municipio</label>
                    <input
                      type="text"
                      required
                      value={formData.municipality}
                      onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
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
                      className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
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
                      className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Año</label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-full bg-[#16B8AA] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all"
                >
                  Continuar a Equipamiento y Precios →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#13322E]">2. Capacidad y equipamiento</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Nº Viajeros</label>
                    <input
                      type="number"
                      value={formData.passengers}
                      onChange={(e) => setFormData({ ...formData, passengers: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Nº Camas</label>
                    <input
                      type="number"
                      value={formData.beds}
                      onChange={(e) => setFormData({ ...formData, beds: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Puertas<input type="number" min="2" max="8" value={formData.doors} onChange={(e) => setFormData({ ...formData, doors: Number(e.target.value) })} className="mt-1 w-full p-3 rounded-xl border border-[#E9E1D2] text-sm" /></label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Cambio<select value={formData.transmission} onChange={(e) => setFormData({ ...formData, transmission: e.target.value })} className="mt-1 w-full p-3 rounded-xl border border-[#E9E1D2] text-sm"><option value="MANUAL">Manual</option><option value="AUTOMATIC">Automático</option></select></label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Combustible<select value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })} className="mt-1 w-full p-3 rounded-xl border border-[#E9E1D2] text-sm"><option value="DIESEL">Diésel</option><option value="GASOLINE">Gasolina</option><option value="HYBRID">Híbrido</option><option value="ELECTRIC">Eléctrico</option></select></label>
                </div>

                <fieldset><legend className="mb-2 text-xs font-black uppercase tracking-wider text-[#6B726E]">Equipamiento incluido</legend><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{EQUIPMENT.map((item) => <label key={item} className={`rounded-xl border p-3 text-xs cursor-pointer ${formData.features.includes(item) ? 'border-[#16B8AA] bg-[#F0FDFA]' : 'border-[#E9E1D2]'}`}><input type="checkbox" className="mr-2" checked={formData.features.includes(item)} onChange={() => setFormData({ ...formData, features: formData.features.includes(item) ? formData.features.filter((value) => value !== item) : [...formData.features, item] })} />{item}</label>)}</div></fieldset>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 py-4 rounded-full border border-[#E9E1D2] font-bold text-xs uppercase tracking-wider">Atrás</button>
                  <button type="button" onClick={() => setStep(3)} className="w-2/3 py-4 rounded-full bg-[#16B8AA] text-white font-black text-xs uppercase tracking-widest">Continuar a tarifas y condiciones</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#13322E]">3. Tarifas, condiciones y presentación</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Precio / día (€)</label>
                    <input
                      type="number"
                      required
                      value={formData.basePricePerDay}
                      onChange={(e) => setFormData({ ...formData, basePricePerDay: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm font-bold text-[#16B8AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Fianza (€)</label>
                    <input
                      type="number"
                      required
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Km incluidos/día<input type="number" min="0" value={formData.includedKmPerDay} onChange={(e) => setFormData({ ...formData, includedKmPerDay: Number(e.target.value) })} className="mt-1 w-full p-3 rounded-xl border border-[#E9E1D2] text-sm" /></label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Km extra (€)<input type="number" min="0" step="0.01" value={formData.extraKmPrice} onChange={(e) => setFormData({ ...formData, extraKmPrice: Number(e.target.value) })} className="mt-1 w-full p-3 rounded-xl border border-[#E9E1D2] text-sm" /></label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Mínimo días<input type="number" min="1" value={formData.minDays} onChange={(e) => setFormData({ ...formData, minDays: Number(e.target.value) })} className="mt-1 w-full p-3 rounded-xl border border-[#E9E1D2] text-sm" /></label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Máximo días<input type="number" min={formData.minDays} value={formData.maxDays} onChange={(e) => setFormData({ ...formData, maxDays: Number(e.target.value) })} className="mt-1 w-full p-3 rounded-xl border border-[#E9E1D2] text-sm" /></label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Tipo de reserva<select value={formData.bookingType} onChange={(e) => setFormData({ ...formData, bookingType: e.target.value })} className="mt-1 w-full p-3 rounded-xl border border-[#E9E1D2] text-sm"><option value="REQUEST_TO_BOOK">Solicitud con aprobación</option><option value="INSTANT_BOOKING">Reserva inmediata</option></select></label>
                  <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Cancelación<select value={formData.cancellationPolicy} onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })} className="mt-1 w-full p-3 rounded-xl border border-[#E9E1D2] text-sm"><option value="FLEXIBLE">Flexible</option><option value="MODERATE">Moderada</option><option value="STRICT">Estricta</option></select></label>
                </div>

                <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E]">Punto aproximado de recogida<input required placeholder="Zona o barrio; la dirección exacta no será pública" value={formData.addressApprox} onChange={(e) => setFormData({ ...formData, addressApprox: e.target.value })} className="mt-1 w-full p-3 rounded-xl border border-[#E9E1D2] text-sm" /></label>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Descripción de la Camper</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe los puntos fuertes de tu camper, equipamiento de cocina, placas solares, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Normas y condiciones de uso</label>
                  <textarea rows={3} required placeholder="Mascotas, fumar, festivales, horarios de entrega, experiencia mínima..." value={formData.rules} onChange={(e) => setFormData({ ...formData, rules: e.target.value })} className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm" />
                </div>

                <div><label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Foto principal</label><label className="flex min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#16B8AA]/40 bg-[#F0FDFA] text-center">{photoPreview ? <img src={photoPreview} alt="Vista previa" className="h-56 w-full object-cover" /> : <span className="p-6 text-sm font-bold text-[#0F766E]">Pulsa para subir una foto JPG, PNG o WEBP</span>}<input type="file" required accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); } }} /></label><p className="mt-1 text-[11px] text-[#6B726E]">Máximo 5 MB. Podrás añadir más fotografías después.</p></div>

                <div className="rounded-2xl border border-[#16B8AA]/30 bg-[#F0FDFA] p-4 text-xs"><CheckCircle2 className="inline h-4 w-4 mr-2 text-[#16B8AA]" />El anuncio quedará pendiente de revisión. No aparecerá públicamente ni permitirá reservas hasta ser aprobado.</div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-4 rounded-full border border-[#E9E1D2] font-bold text-xs uppercase tracking-wider hover:bg-[#F8FAFC]"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-4 rounded-full bg-[#16B8AA] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all"
                  >
                    {loading ? 'Enviando...' : 'ENVIAR ANUNCIO A REVISIÓN'}
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
