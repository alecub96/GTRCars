'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CANARY_ISLANDS } from '@/lib/pricing';
import { Compass, CheckCircle2, Upload, MapPin, DollarSign, ChevronRight, ShieldCheck } from 'lucide-react';

export default function PublishCamperPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((response) => response.json()).then((data) => {
      const isOwner = data.user?.role === 'OWNER';
      setAuthorized(isOwner);
      if (!isOwner) window.location.href = data.user ? '/cuenta' : '/';
    }).catch(() => { setAuthorized(false); window.location.href = '/'; });
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    brand: 'Volkswagen',
    model: 'California Ocean T6.1',
    year: 2023,
    island: 'Gran Canaria',
    municipality: 'Las Palmas de Gran Canaria',
    passengers: 4,
    beds: 4,
    transmission: 'AUTOMATIC',
    fuelType: 'DIESEL',
    basePricePerDay: 90,
    includedKmPerDay: 150,
    securityDeposit: 600,
    cleaningFee: 30,
    description: '',
    rules: '',
    photoUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200',
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

      router.push(`/camper/${data.vehicle.slug}`);
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
              Paso {step} de 3 — Datos técnicos y precios de alquiler
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">Marca y Modelo</label>
                    <input
                      type="text"
                      required
                      value={`${formData.brand} ${formData.model}`}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
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
                <h3 className="font-serif text-xl font-bold text-[#13322E]">2. Capacidad y Precios</h3>

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

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-4 rounded-full border border-[#E9E1D2] font-bold text-xs uppercase tracking-wider hover:bg-[#F8FAFC]"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-4 rounded-full bg-[#16B8AA] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all"
                  >
                    {loading ? 'Publicando...' : 'PUBLICAR CAMPER AHORA'}
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
