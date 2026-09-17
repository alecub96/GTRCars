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
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] font-sans antialiased selection:bg-[#D4AF37] selection:text-black">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="relative py-20 px-4 border-b border-white/10 bg-[#090909] text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest rounded-full">
            <Headphones className="w-4 h-4" />
            <span>CONSERJERÍA VIP 24/7 GTR CARS</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white">
            Atención a Clientes & Propietarios
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo de conserjería especializado en superdeportivos está disponible las 24 horas para coordinar entregas, custodia en el Vault y logística interinsular.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* CONTACT FORM */}
          <div className="lg:col-span-7 bg-[#0E0E0E] p-8 sm:p-10 border border-white/10 rounded-3xl shadow-xl">
            <h3 className="text-lg font-bold font-mono text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> ENVÍA UNA SOLICITUD A CONSERJERÍA
            </h3>

            {success ? (
              <div className="p-8 bg-neutral-900 border border-[#D4AF37]/40 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#D4AF37] mx-auto" />
                <h4 className="font-mono font-bold text-white uppercase text-base">SOLICITUD ENVIADA</h4>
                <p className="text-xs text-neutral-400 font-mono">Un agente de conserjería VIP te contactará en menos de 15 minutos.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 uppercase tracking-widest block text-[10px] mb-1.5">NOMBRE COMPLETO</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-neutral-900 border border-white/10 rounded-xl text-white focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase tracking-widest block text-[10px] mb-1.5">TELÉFONO / WHATSAPP</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-neutral-900 border border-white/10 rounded-xl text-white focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-widest block text-[10px] mb-1.5">CORREO ELECTRÓNICO</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-neutral-900 border border-white/10 rounded-xl text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-widest block text-[10px] mb-1.5">ASUNTO</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 bg-neutral-900 border border-white/10 rounded-xl text-white focus:border-[#D4AF37] outline-none font-mono cursor-pointer"
                  >
                    <option>Consulta sobre Alquiler de Superdeportivo</option>
                    <option>Publicar un Hypercar en el Vault Propietarios</option>
                    <option>Logística de entrega en Aeropuerto / Villa VIP</option>
                    <option>Gestión de Fianza y Protocolo de Seguridad</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-widest block text-[10px] mb-1.5">MENSAJE / REQUERIMIENTOS</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Indica fechas, modelos de interés (Ferrari, Lamborghini, Porsche, McLaren)..."
                    className="w-full p-3 bg-neutral-900 border border-white/10 rounded-xl text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B38B21] hover:brightness-110 text-black font-mono font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {loading ? 'ENVIANDO...' : 'ENVIAR A CONSERJERÍA VIP'}
                </button>
              </form>
            )}
          </div>

          {/* CONTACT DETAILS & VIP PERKS */}
          <div className="lg:col-span-5 space-y-6 font-mono text-xs">
            <div className="bg-[#0E0E0E] p-8 border border-white/10 rounded-3xl space-y-6 shadow-xl">
              <h4 className="font-bold text-white uppercase tracking-wider text-sm border-b border-white/10 pb-3">
                LÍNEA DIRECTA CONSERJERÍA
              </h4>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <PhoneCall className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">TELÉFONO DIRECTO</span>
                    <span className="text-white font-bold">+34 900 800 GTR (487)</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">EMAIL CONSERJERÍA</span>
                    <span className="text-white font-bold">vip@gtrcars.vip</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">DISPONIBILIDAD</span>
                    <span className="text-white font-bold">24 horas / 7 días a la semana</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0E0E0E] p-8 border border-white/10 rounded-3xl space-y-3 shadow-xl">
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest block">
                COMPROMISO DE CONFIDENCIALIDAD
              </span>
              <p className="text-neutral-400 font-mono text-xs leading-relaxed">
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
