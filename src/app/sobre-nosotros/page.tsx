'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  MapPin,
  Users,
  Compass,
  Sparkles,
  Palmtree,
  ArrowRight,
} from 'lucide-react';

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Breadcrumbs items={[{ name: 'Sobre Nosotros', url: '/sobre-nosotros' }]} />

        {/* HERO SOBRE NOSOTROS */}
        <section className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#16B8AA]/10 text-[#0F766E] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Palmtree className="w-4 h-4" />
            <span>Una Iniciativa 100% Canaria</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Canarias sobre ruedas, con alma local
          </h1>
          <p className="text-sm sm:text-base text-[#6B726E] leading-relaxed font-medium">
            Nacimos con un propósito claro: democratizar el alquiler de furgonetas camperizadas y autocaravanas en las Islas Canarias, eliminando comisiones abusivas y apoyando directamente la economía de los propietarios locales.
          </p>
        </section>

        {/* HISTORIA Y MISIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
          <div className="space-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#16B8AA]">
              NUESTRA HISTORIA
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              ¿Por qué creamos Vaneando?
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-medium">
              Durante años, las grandes plataformas internacionales han cobrado comisiones de hasta el 25% a viajeros y propietarios en Canarias sin ofrecer un soporte cercano ni conocer la realidad insular (normativas de pernocta, carreteras de cumbre o conexiones de ferry).
            </p>
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-medium">
              Vaneando es una plataforma creada y gestionada en Canarias, diseñada para que tanto locales como visitantes vivan una experiencia auténtica y respetuosa con nuestro archipiélago.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E1D2] shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2]">
                <strong className="block font-serif text-3xl font-bold text-[#16B8AA]">8</strong>
                <span className="text-[11px] font-bold text-[#6B726E] uppercase">Islas Conectadas</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2]">
                <strong className="block font-serif text-3xl font-bold text-[#16B8AA]">100%</strong>
                <span className="text-[11px] font-bold text-[#6B726E] uppercase">Propietarios Verificados</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2]">
                <strong className="block font-serif text-3xl font-bold text-[#16B8AA]">0€</strong>
                <span className="text-[11px] font-bold text-[#6B726E] uppercase">Comisiones Ocultas</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2]">
                <strong className="block font-serif text-3xl font-bold text-[#16B8AA]">&lt;15m</strong>
                <span className="text-[11px] font-bold text-[#6B726E] uppercase">Tiempo de Respuesta</span>
              </div>
            </div>
          </div>
        </div>

        {/* VALORES FUNDAMENTALES */}
        <section className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">Nuestros Pilares</h3>
            <p className="text-xs text-[#6B726E] mt-1">Cómo cuidamos de nuestra comunidad y de nuestras islas.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E9E1D2] shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-[#13322E]">Seguridad & Legalidad</h4>
              <p className="text-xs text-[#6B726E] leading-relaxed">
                Contratos digitales con validez legal europea eIDAS y verificación estricta de identidades y DNI/NIE.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E9E1D2] shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Heart className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-[#13322E]">Turismo Sostenible</h4>
              <p className="text-xs text-[#6B726E] leading-relaxed">
                Fomentamos el respeto por los espacios naturales protegidos, el uso de puntos limpios y el consumo en negocios locales.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E9E1D2] shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-[#13322E]">Comunidad Directa</h4>
              <p className="text-xs text-[#6B726E] leading-relaxed">
                Trato humano y directo de particular a particular, con consejos locales de primera mano para tu ruta.
              </p>
            </div>
          </div>
        </section>

        {/* BANNER FINAL CTA */}
        <div className="bg-[#13322E] text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl space-y-4">
          <h3 className="font-serif text-2xl sm:text-4xl font-bold">
            ¿Listo para descubrir Canarias a tu ritmo?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
            Explora nuestra flota de furgonetas camperizadas y autocaravanas verificadas en todas las islas.
          </p>
          <div className="pt-2">
            <Link
              href="/buscar"
              className="inline-flex items-center space-x-2 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Buscar mi Camper Ideal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
