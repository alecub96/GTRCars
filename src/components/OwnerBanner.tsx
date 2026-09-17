'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Key, Sparkles, TrendingUp, Lock } from 'lucide-react';

export default function OwnerBanner() {
  return (
    <section className="py-24 bg-[#050505] text-white border-t border-white/10 relative overflow-hidden">
      {/* Background glowing polygon */}
      <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-[#D4AF37]/10 blur-[160px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#0C0C0C] border border-white/10 rounded-sm p-8 sm:p-14 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                  PROPIETARIOS DE SUPERDEPORTIVOS
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                RENTABILIZA TU SUPERDEPORTIVO CON MÁXIMA SEGURIDAD
              </h2>

              <p className="text-sm text-white/60 font-mono leading-relaxed max-w-xl">
                Pon tu deportivo a disposición de conductores certificados y verificados. 
                Tú decides la fianza, los días disponibles y seleccionas personalmente a cada cliente.
              </p>

              {/* 3 Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-[#141414] border border-white/5 rounded-sm">
                  <span className="text-xs font-mono text-[#D4AF37] font-bold block mb-1">01 / PUBLICACIÓN</span>
                  <p className="text-xs text-white/70 font-mono">Fija tu precio por jornada, fianza y kilometraje incluido.</p>
                </div>
                <div className="p-4 bg-[#141414] border border-white/5 rounded-sm">
                  <span className="text-xs font-mono text-[#D4AF37] font-bold block mb-1">02 / VERIFICACIÓN</span>
                  <p className="text-xs text-white/70 font-mono">Filtro biométrico y validación de carnet para cada conductor.</p>
                </div>
                <div className="p-4 bg-[#141414] border border-white/5 rounded-sm">
                  <span className="text-xs font-mono text-[#D4AF37] font-bold block mb-1">03 / INGRESOS VIP</span>
                  <p className="text-xs text-white/70 font-mono">Pagos y fianza custodiados hasta la entrega final del vehículo.</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/publicar-camper"
                  className="px-8 py-4 bg-[#D4AF37] hover:bg-[#F5C542] text-black font-black text-xs font-mono uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(212,175,55,0.25)] flex items-center gap-3"
                >
                  <span>PUBLICAR MI DEPORTIVO</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/seguridad"
                  className="px-6 py-4 bg-transparent hover:bg-white/5 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all"
                >
                  CONOCE NUESTRAS GARANTÍAS
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center space-y-4 bg-[#141414]/90 p-6 sm:p-8 border border-white/10 rounded-sm">
              <div className="flex items-center space-x-3 text-xs font-mono text-white/50 border-b border-white/10 pb-3">
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                <span>GARANTÍAS PARA PROPIETARIOS</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-white/80">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Depósitos de seguridad custodiados de hasta 15.000€ por reserva.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Contratos de cesión digitalizados con firma legal eIDAS.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Check-in fotográfico con registro de telemetría y neumáticos.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Atención telefónica de conserjería 24/7 para incidencias.</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
                  ESTIMACIÓN MEDIA PROPIETARIO
                </span>
                <span className="text-2xl font-mono font-black text-white mt-1 block">
                  3.500€ — 12.000€ / MES
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
