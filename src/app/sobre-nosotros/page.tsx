'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  Gauge,
  Trophy,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* HERO SOBRE NOSOTROS */}
        <section className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GTR CARS // CANARY HYPERCAR VAULT</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Pasión por la Ingeniería y el Rendimiento en Canarias
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-mono leading-relaxed max-w-2xl mx-auto">
            Nacimos con un propósito exclusivo: reunir la colección privada de superdeportivos más prestigiosa de las Islas Canarias, conectando a conductores apasionados con máquinas legendarias bajo los más altos estándares de custodia y discreción.
          </p>
        </section>

        {/* HISTORIA Y MISIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              NUESTRA FILOSOFÍA
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              ¿Por qué creamos GTR Cars?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed">
              Las Islas Canarias cuentan con algunas de las mejores carreteras de montaña y microclimas del mundo, pero hasta ahora no existía un servicio especializado que ofreciera superdeportivos en perfecto estado de homologación, telemetría y entrega VIP puerta a puerta.
            </p>
            <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed">
              GTR Cars representa el estándar de oro en alquiler de altas prestaciones: Ferrari, Lamborghini, Porsche GT y McLaren disponibles con servicio Concierge 24/7 en Gran Canaria y Tenerife.
            </p>
          </div>

          <div className="bg-[#0f0f12] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center font-mono">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                <strong className="block font-serif text-3xl font-bold text-[#D4AF37]">800+ CV</strong>
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Hypercars V8 / V12</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                <strong className="block font-serif text-3xl font-bold text-[#D4AF37]">100%</strong>
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Inspección Oficial</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                <strong className="block font-serif text-3xl font-bold text-[#D4AF37]">24/7</strong>
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Concierge VIP</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                <strong className="block font-serif text-3xl font-bold text-[#D4AF37]">&lt; 5 min</strong>
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Entrega en Aeropuerto</span>
              </div>
            </div>
          </div>
        </div>

        {/* PILARES */}
        <section className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">Pilares de Excelencia</h3>
            <p className="text-xs font-mono text-neutral-400 mt-1">Garantía de rendimiento, seguridad y discreción.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#0f0f12] rounded-3xl p-6 border border-white/10 shadow-xl space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold">
                <Gauge className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-white font-mono">Puesta a Punto de Circuito</h4>
              <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                Neumáticos de alto agarre, frenos carbocerámicos inspeccionados y combustible 98 octanos siempre garantizado.
              </p>
            </div>

            <div className="bg-[#0f0f12] rounded-3xl p-6 border border-white/10 shadow-xl space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-white font-mono">Cobertura y Seguridad VIP</h4>
              <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                Pólizas exclusivas para flotas exóticas con asistencia de grúa de plataforma baja 24/7 en todas las islas.
              </p>
            </div>

            <div className="bg-[#0f0f12] rounded-3xl p-6 border border-white/10 shadow-xl space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-white font-mono">Club Exclusivo Vault</h4>
              <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                Custodia profesional y rentabilidad para propietarios de superdeportivos con gestión integral de flotas.
              </p>
            </div>
          </div>
        </section>

        {/* BANNER FINAL CTA */}
        <div className="bg-gradient-to-br from-[#17171d] via-[#101014] to-black text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl border border-[#D4AF37]/40 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase border border-[#D4AF37]/30">
            <Flame className="w-3 h-3" />
            VIVE LA EXPERIENCIA GTR CARS
          </div>
          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            ¿Preparado para sentir la potencia en Canarias?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto font-mono">
            Explora nuestra flota y reserva tu Ferrari, Lamborghini, McLaren o Porsche con confirmación directa.
          </p>
          <div className="pt-2">
            <Link
              href="/#flota"
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-lg hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <span>Ver Catálogo del Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
