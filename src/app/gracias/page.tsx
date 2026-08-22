'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CheckCircle2, Search, Compass, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center flex flex-col justify-center items-center">
        {/* ICONO DE ÉXITO */}
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto shadow-md animate-float">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#16B8AA] text-white p-1.5 rounded-full shadow-xs">
            <HeartHandshake className="w-4 h-4" />
          </div>
        </div>

        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#16B8AA] mb-2 block">
          ¡GRACIAS POR CONTACTARNOS!
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Hemos recibido tu solicitud
        </h1>

        <p className="text-sm sm:text-base text-[#6B726E] max-w-lg mx-auto leading-relaxed mb-8 font-medium">
          Nuestro equipo local en las Islas Canarias revisará tu mensaje y te responderá en un plazo máximo de <strong>15 a 30 minutos</strong> en horario de atención.
        </p>

        {/* ACCIONES RÁPIDAS */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-sm mb-8 space-y-4 text-left">
          <h3 className="font-serif text-lg font-bold text-[#13322E] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#16B8AA]" />
            Mientras tanto, ¿qué te gustaría hacer?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/buscar"
              className="p-4 rounded-2xl border border-[#E9E1D2] bg-[#FAF7F0] hover:bg-white hover:border-[#16B8AA] transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <strong className="block text-xs sm:text-sm text-[#13322E]">Explorar campers</strong>
                <span className="text-[11px] text-[#6B726E]">Gran Canaria, Tenerife, Fuerteventura...</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#16B8AA] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/guias"
              className="p-4 rounded-2xl border border-[#E9E1D2] bg-[#FAF7F0] hover:bg-white hover:border-[#16B8AA] transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <strong className="block text-xs sm:text-sm text-[#13322E]">Guías y Rutas</strong>
                <span className="text-[11px] text-[#6B726E]">Dónde pernoctar en Canarias</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#16B8AA] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 rounded-full bg-[#13322E] hover:bg-[#16B8AA] text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Volver a la Página Principal</span>
        </Link>
      </main>
    </div>
  );
}
