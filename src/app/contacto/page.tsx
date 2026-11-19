'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Headphones,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { analytics } from '@/lib/analytics';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Consulta sobre Alquiler de Superdeportivo',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg('');
    analytics.formSubmit('concierge_contact');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo enviar la solicitud. Verifica los campos e inténtalo de nuevo.');
      }
      analytics.formSuccess('concierge_contact');
      analytics.conversion('generate_lead', {
        lead_source: 'concierge_contact_form',
        subject: formData.subject,
      });
      setSuccess(true);
    } catch (err: any) {
      // Nunca borra la información ya introducida (#86, #87 WEB 250)
      setErrorMsg(err.message || 'Error temporal de conexión. Tus datos siguen en el formulario.');
      analytics.formError('concierge_contact', 'submit', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="relative py-16 sm:py-20 px-4 border-b border-gray-200 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-200 text-gray-800 text-xs font-mono font-bold uppercase tracking-widest rounded-full">
            <Headphones className="w-4 h-4 text-black" />
            <span>CONSERJERÍA VIP 24/7 GTR CARS</span>
          </div>

          <h1 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            Atención a Clientes &amp; Propietarios
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 font-mono max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo de conserjería especializado en superdeportivos está disponible las 24 horas para coordinar entregas en aeropuerto, hoteles 5* GL y reservas directas.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* CONTACT FORM */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-gray-200 rounded-3xl shadow-sm">
            <h2 className="text-lg font-black font-sans text-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" /> ENVÍA UNA SOLICITUD A CONSERJERÍA
            </h2>

            {errorMsg && (
              <div
                role="alert"
                className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-mono font-bold flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {success ? (
              <div className="p-8 bg-gray-50 border border-gray-200 rounded-2xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-black mx-auto" />
                <h3 className="font-mono font-black text-black uppercase text-lg">
                  SOLICITUD RECIBIDA CON ÉXITO
                </h3>
                <p className="text-xs text-gray-600 font-mono max-w-md mx-auto leading-relaxed">
                  Un agente de conserjería VIP revisará tu expediente y te responderá a <strong>{formData.email}</strong> o por teléfono en menos de 15 minutos.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3 font-mono">
                  <Link
                    href="/buscar"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all"
                  >
                    <span>Explorar Superdeportivos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setFormData({ ...formData, message: '' });
                    }}
                    className="px-5 py-3 rounded-full border border-gray-300 text-xs font-bold uppercase tracking-wider text-black hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="text-gray-700 uppercase tracking-widest block text-[10px] mb-1.5 font-bold">
                      NOMBRE COMPLETO *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Ej. Carlos Mendoza"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-black focus:border-black focus:bg-white outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="text-gray-700 uppercase tracking-widest block text-[10px] mb-1.5 font-bold">
                      TELÉFONO / WHATSAPP *
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      placeholder="+34 600 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-black focus:border-black focus:bg-white outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-gray-700 uppercase tracking-widest block text-[10px] mb-1.5 font-bold">
                    CORREO ELECTRÓNICO *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="nombre@dominio.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-black focus:border-black focus:bg-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="text-gray-700 uppercase tracking-widest block text-[10px] mb-1.5 font-bold">
                    MOTIVO DE LA CONSULTA
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-black focus:border-black focus:bg-white outline-none font-mono cursor-pointer font-medium"
                  >
                    <option>Consulta sobre Alquiler de Superdeportivo</option>
                    <option>Publicar un vehículo en el Garaje de Propietarios</option>
                    <option>Logística de entrega en Aeropuerto / Villa VIP</option>
                    <option>Gestión de Fianza y Protocolo de Seguridad</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-gray-700 uppercase tracking-widest block text-[10px] mb-1.5 font-bold">
                    MENSAJE / REQUERIMIENTOS *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Indica fechas, ciudad de entrega y modelos de interés (Ferrari, Lamborghini, Porsche, McLaren)..."
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-black focus:border-black focus:bg-white outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  data-analytics-cta="concierge_contact_submit"
                  className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-mono font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {loading ? 'ENVIANDO SOLICITUD...' : 'ENVIAR A CONSERJERÍA VIP'}
                </button>
              </form>
            )}
          </div>

          {/* CONTACT DETAILS & VIP PERKS */}
          <div className="lg:col-span-5 space-y-6 font-mono text-xs">
            <div className="bg-white p-8 border border-gray-200 rounded-3xl space-y-6 shadow-sm">
              <h3 className="font-black text-black uppercase tracking-wider text-sm border-b border-gray-200 pb-3 font-sans">
                LÍNEA DIRECTA CONSERJERÍA
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <PhoneCall className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">TELÉFONO DIRECTO</span>
                    <a href="tel:+34900800487" className="text-black font-bold hover:underline">
                      +34 900 800 GTR (487)
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">EMAIL CONSERJERÍA</span>
                    <a href="mailto:contacto@gtrcars.es" className="text-black font-bold hover:underline block">
                      contacto@gtrcars.es
                    </a>
                    <a href="mailto:vip@gtrcars.es" className="text-gray-600 font-bold hover:underline block text-[11px]">
                      vip@gtrcars.es
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">DISPONIBILIDAD</span>
                    <span className="text-black font-bold">24 horas / 7 días a la semana</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border border-gray-200 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span className="text-[10px] text-black font-bold uppercase tracking-widest block">
                  COMPROMISO DE CONFIDENCIALIDAD
                </span>
              </div>
              <p className="text-gray-600 font-mono text-xs leading-relaxed font-medium">
                Todos los datos de clientes, propietarios y ubicaciones de hangares privados están protegidos bajo estrictos acuerdos de confidencialidad (NDA) y custodia encriptada.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
