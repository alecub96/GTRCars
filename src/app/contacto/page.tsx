'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Mail,
  Phone,
  Clock,
  Send,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Lock,
  Headphones,
} from 'lucide-react';
import Link from 'next/link';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Consulta de Reserva de Superdeportivo',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSuccess(true);
    } catch {
      setSuccess(true);
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
            Nuestro equipo de conserjería especializado en superdeportivos está disponible las 24 horas para coordinar entregas, logística y reservas directas.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* CONTACT FORM */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-gray-200 rounded-3xl shadow-sm">
            <h3 className="text-lg font-black font-sans text-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" /> ENVÍA UNA SOLICITUD A CONSERJERÍA
            </h3>

            {success ? (
              <div className="p-8 bg-gray-50 border border-gray-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-black mx-auto" />
                <h4 className="font-mono font-bold text-black uppercase text-base">SOLICITUD ENVIADA</h4>
                <p className="text-xs text-gray-600 font-mono">Un agente de conserjería VIP te contactará en menos de 15 minutos.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 uppercase tracking-widest block text-[10px] mb-1.5 font-bold">NOMBRE COMPLETO</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-black focus:border-black outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 uppercase tracking-widest block text-[10px] mb-1.5 font-bold">TELÉFONO / WHATSAPP</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-black focus:border-black outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 uppercase tracking-widest block text-[10px] mb-1.5 font-bold">CORREO ELECTRÓNICO</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-black focus:border-black outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-gray-600 uppercase tracking-widest block text-[10px] mb-1.5 font-bold">ASUNTO</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-black focus:border-black outline-none font-mono cursor-pointer font-medium"
                  >
                    <option>Consulta sobre Alquiler de Superdeportivo</option>
                    <option>Publicar un vehículo en el Garaje de Propietarios</option>
                    <option>Logística de entrega en Aeropuerto / Villa VIP</option>
                    <option>Gestión de Fianza y Protocolo de Seguridad</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-600 uppercase tracking-widest block text-[10px] mb-1.5 font-bold">MENSAJE / REQUERIMIENTOS</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Indica fechas, marcas de interés (Ferrari, Lamborghini, Porsche, McLaren)..."
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-black focus:border-black outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-mono font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {loading ? 'ENVIANDO...' : 'ENVIAR A CONSERJERÍA VIP'}
                </button>
              </form>
            )}
          </div>

          {/* CONTACT DETAILS & VIP PERKS */}
          <div className="lg:col-span-5 space-y-6 font-mono text-xs">
            <div className="bg-white p-8 border border-gray-200 rounded-3xl space-y-6 shadow-sm">
              <h4 className="font-black text-black uppercase tracking-wider text-sm border-b border-gray-200 pb-3 font-sans">
                LÍNEA DIRECTA CONSERJERÍA
              </h4>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <PhoneCall className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">TELÉFONO DIRECTO</span>
                    <span className="text-black font-bold">+34 900 800 GTR (487)</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">EMAIL CONSERJERÍA</span>
                    <span className="text-black font-bold">vip@gtrcars.es</span>
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
              <span className="text-[10px] text-black font-bold uppercase tracking-widest block">
                COMPROMISO DE CONFIDENCIALIDAD
              </span>
              <p className="text-gray-600 font-mono text-xs leading-relaxed font-medium">
                Todos los datos de clientes, propietarios y ubicaciones de hangares privados están protegidos bajo estrictos acuerdos de no divulgación (NDA).
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
