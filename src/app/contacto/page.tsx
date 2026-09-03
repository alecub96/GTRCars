'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { analytics } from '@/lib/analytics';

export default function ContactoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    island: 'Gran Canaria',
    subject: 'Alquiler de camper',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    analytics.formSubmit('contact');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar el formulario.');
      }

      setSuccess(true);
      analytics.formSuccess('contact');
      analytics.conversion('contact_success');
      setTimeout(() => {
        router.push('/gracias?origen=contacto');
      }, 1200);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Error de conexión. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Breadcrumbs items={[{ name: 'Contacto y Soporte', url: '/contacto' }]} />

        {/* CABECERA */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#16B8AA]/10 text-[#0F766E] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <MessageCircle className="w-4 h-4" />
            <span>Soporte Local Canario</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Estamos para ayudarte
          </h1>
          <p className="text-xs sm:text-sm text-[#6B726E] font-medium leading-relaxed">
            ¿Tienes dudas sobre cómo alquilar, publicar tu camper o necesitas asistencia con tu reserva? Escríbenos y te responderemos con la cercanía y rapidez que mereces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* INFORMACIÓN DE CONTACTO & GARANTÍAS */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9E1D2] shadow-sm space-y-6">
              <h2 className="font-serif text-xl font-bold border-b border-[#E9E1D2] pb-3">
                Canales de Atención
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-[#13322E]">Correo Electrónico</strong>
                    <a href="mailto:contacto@vaneando.com" className="text-[#16B8AA] hover:underline font-medium">
                      contacto@vaneando.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-[#13322E]">Compromiso de Respuesta</strong>
                    <span className="text-[#6B726E]">Menos de 15 minutos en horario diurno (8:00 - 22:00)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-[#13322E]">Sede Principal</strong>
                    <span className="text-[#6B726E]">Las Palmas de Gran Canaria, Gran Canaria</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TARJETA DE COMPROMISO */}
            <div className="bg-gradient-to-br from-[#13322E] to-[#1e4842] text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-[#16B8AA]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">Garantía Vaneando</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Sin robots ni call centers externos. Te atiende directamente el equipo fundador de Vaneando desde las islas.
              </p>
            </div>
          </div>

          {/* FORMULARIO DE CONTACTO */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-sm">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#13322E]">
                  ¡Mensaje Enviado con Éxito!
                </h3>
                <p className="text-xs text-[#6B726E] max-w-sm mx-auto">
                  Redirigiéndote a la confirmación…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6B726E] mb-1.5">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Laura Cabrera"
                      className="w-full rounded-xl border border-[#E9E1D2] bg-[#FAF7F0] focus:bg-white p-3 text-xs sm:text-sm font-medium focus:border-[#16B8AA] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6B726E] mb-1.5">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="w-full rounded-xl border border-[#E9E1D2] bg-[#FAF7F0] focus:bg-white p-3 text-xs sm:text-sm font-medium focus:border-[#16B8AA] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6B726E] mb-1.5">
                      Teléfono / WhatsApp (Opcional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+34 600 000 000"
                      className="w-full rounded-xl border border-[#E9E1D2] bg-[#FAF7F0] focus:bg-white p-3 text-xs sm:text-sm font-medium focus:border-[#16B8AA] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6B726E] mb-1.5">
                      Isla de Interés
                    </label>
                    <select
                      value={formData.island}
                      onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                      className="w-full rounded-xl border border-[#E9E1D2] bg-[#FAF7F0] focus:bg-white p-3 text-xs sm:text-sm font-medium focus:border-[#16B8AA] focus:outline-none cursor-pointer"
                    >
                      <option value="Gran Canaria">Gran Canaria</option>
                      <option value="Tenerife">Tenerife</option>
                      <option value="Lanzarote">Lanzarote</option>
                      <option value="Fuerteventura">Fuerteventura</option>
                      <option value="La Palma">La Palma</option>
                      <option value="La Gomera">La Gomera</option>
                      <option value="El Hierro">El Hierro</option>
                      <option value="La Graciosa">La Graciosa</option>
                      <option value="Todas las islas">Todas las islas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B726E] mb-1.5">
                    Motivo de la Consulta *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-[#E9E1D2] bg-[#FAF7F0] focus:bg-white p-3 text-xs sm:text-sm font-medium focus:border-[#16B8AA] focus:outline-none cursor-pointer"
                  >
                    <option value="Alquiler de camper">Quiero alquilar una camper</option>
                    <option value="Publicar mi furgoneta">Quiero publicar y rentabilizar mi furgoneta</option>
                    <option value="Duda con reserva activa">Tengo una duda con una reserva existente</option>
                    <option value="Seguros y coberturas">Pregunta sobre seguros o fianzas</option>
                    <option value="Prensa y colaboraciones">Colaboración / Prensa / Sugerencias</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B726E] mb-1.5">
                    Mensaje o Consulta *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos con detalle en qué podemos ayudarte..."
                    className="w-full rounded-2xl border border-[#E9E1D2] bg-[#FAF7F0] focus:bg-white p-4 text-xs sm:text-sm font-medium focus:border-[#16B8AA] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-[#6B726E]">
                    Tus datos se tratan bajo nuestra{' '}
                    <Link href="/privacidad" className="underline hover:text-[#16B8AA]">
                      política de privacidad
                    </Link>.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center space-x-2 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] text-white px-7 py-3.5 text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Enviando…' : 'Enviar Mensaje'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
