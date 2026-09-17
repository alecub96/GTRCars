'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Key, Sparkles, TrendingUp, Lock } from 'lucide-react';

export default function OwnerBanner() {
  return (
    <section className="py-20 bg-gray-50 text-black border-t border-gray-200 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-14 relative overflow-hidden shadow-lg">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-black" />
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 font-bold">
                  PROPIETARIOS DE SUPERDEPORTIVOS
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-tight font-sans">
                RENTABILIZA TU SUPERDEPORTIVO CON MÁXIMA SEGURIDAD
              </h2>

              <p className="text-sm text-gray-600 font-mono leading-relaxed max-w-xl font-medium">
                Pon tu deportivo a disposición de conductores certificados y verificados. 
                Tú decides la fianza, los días disponibles y seleccionas personalmente a cada cliente.
              </p>

              {/* 3 Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-xs font-mono text-black font-bold block mb-1">01 / PUBLICACIÓN</span>
                  <p className="text-xs text-gray-600 font-mono">Fija tu precio por jornada, fianza y kilometraje incluido.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-xs font-mono text-black font-bold block mb-1">02 / VERIFICACIÓN</span>
                  <p className="text-xs text-gray-600 font-mono">Filtro biométrico y validación de carnet para cada conductor.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-xs font-mono text-black font-bold block mb-1">03 / LIQUIDACIÓN RÁPIDA</span>
                  <p className="text-xs text-gray-600 font-mono">Pago retenido de forma segura y transferido en un plazo de 5 días hábiles tras finalizar el alquiler.</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/publicar-camper"
                  className="px-8 py-4 bg-black hover:bg-gray-800 text-white font-black text-xs font-mono uppercase tracking-[0.2em] transition-all shadow-md rounded-full flex items-center gap-3"
                >
                  <span>PUBLICAR MI DEPORTIVO</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
                <Link
                  href="/seguridad"
                  className="px-6 py-4 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all rounded-full"
                >
                  CONOCE NUESTRAS GARANTÍAS
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center space-y-4 bg-gray-50 p-6 sm:p-8 border border-gray-200 rounded-xl">
              <div className="flex items-center space-x-3 text-xs font-mono text-gray-500 font-bold border-b border-gray-200 pb-3">
                <Lock className="w-4 h-4 text-black" />
                <span>GARANTÍAS PARA PROPIETARIOS</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-gray-700 font-medium">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>Depósitos de seguridad custodiados de hasta 15.000€ por reserva.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>Contratos de cesión digitalizados con firma legal eIDAS.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>Check-in fotográfico con registro de telemetría y neumáticos.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>Atención telefónica de conserjería 24/7 para incidencias.</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                  ESTIMACIÓN MEDIA PROPIETARIO
                </span>
                <span className="text-2xl font-mono font-black text-black mt-1 block">
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
