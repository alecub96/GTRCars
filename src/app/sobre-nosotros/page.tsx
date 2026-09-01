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

        {/* EQUIPO */}
        <section className="mb-16" aria-labelledby="equipo-heading">
          <div className="mb-8 text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#16B8AA]">El equipo detrás de Vaneando</span>
            <h2 id="equipo-heading" className="mt-2 font-serif text-2xl font-bold sm:text-3xl">Una idea nacida en Canarias</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="grid items-center overflow-hidden rounded-3xl border border-[#E9E1D2] bg-white shadow-sm">
            <img src="/alejandro-fundador.png" alt="Alejandro, fundador y CEO de Vaneando" className="h-full min-h-[280px] w-full object-cover object-center" />
            <div className="p-7 sm:p-10">
              <span className="text-xs font-black uppercase tracking-widest text-[#16B8AA]">Fundador y CEO</span>
              <h3 className="mt-2 font-serif text-3xl font-bold">Alejandro</h3>
              <p className="mt-4 text-sm leading-7 text-[#4A5568]">
                Soy Alejandro, creador de la idea de Vaneando. Me apasionan la naturaleza, el mundo del camping y las Islas Canarias. Creé esta plataforma para conectar a viajeros y propietarios locales y ayudar a descubrir el archipiélago de una forma más libre, cercana y responsable.
              </p>
              <p className="mt-4 text-sm leading-7 text-[#4A5568]">
                Vaneando nace de esa pasión: convertir cada camper en una puerta de entrada a nuestras islas y apoyar a quienes comparten su vehículo con la comunidad.
              </p>
            </div>
          </article>
          <article className="grid items-center overflow-hidden rounded-3xl border border-[#E9E1D2] bg-white shadow-sm">
            <img src="/leonardo-equipo.jpg" alt="Leonardo, programador y creador técnico de Vaneando" className="h-full min-h-[280px] w-full object-cover object-center" />
            <div className="p-7 sm:p-10">
              <span className="text-xs font-black uppercase tracking-widest text-[#16B8AA]">Programador y co-creador</span>
              <h3 className="mt-2 font-serif text-3xl font-bold">Leonardo</h3>
              <p className="mt-4 text-sm leading-7 text-[#4A5568]">
                Soy Leonardo, hermano de Alejandro y programador. Amante de la naturaleza y del campo, convertí la idea de Vaneando en una plataforma real para conectar a viajeros y propietarios en Canarias.
              </p>
              <p className="mt-4 text-sm leading-7 text-[#4A5568]">
                Mi objetivo es que la tecnología sea sencilla, segura y útil para disfrutar del mundo camper y de nuestro territorio.
              </p>
            </div>
          </article>
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
