'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import { Star, MapPin, Compass, ArrowRight, Quote, Heart } from 'lucide-react';

const STORIES: any[] = [
  {
    id: 'ayoze-tenerife',
    title: 'De furgoneta parada a generar más de 2.200€ al mes en Tenerife',
    author: 'Ayoze Hernández',
    role: 'Propietario en Tenerife',
    island: 'Tenerife • San Cristóbal de La Laguna',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800',
    quote: 'Tenía mi camper parada entre semana por el trabajo. Alquilarla en Vaneando me ha permitido cubrir el seguro, el mantenimiento anual y obtener ingresos limpios con total tranquilidad gracias a los contratos digitales.',
    badge: 'Caso Propietario',
  },
  {
    id: 'laura-fuerteventura',
    title: '10 días de surf y atardeceres secretos entre Fuerteventura y Lanzarote',
    author: 'Laura & Dani',
    role: 'Viajeros desde Madrid',
    island: 'Fuerteventura & Lanzarote',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
    quote: 'Dormir en El Cotillo escuchando las olas y cruzar en ferry a Famara con la camper fue la mejor experiencia de nuestras vidas. Guacimara nos dejó la furgoneta impecable con recomendaciones que no salen en ninguna guía.',
    badge: 'Ruta Viajera',
  },
  {
    id: 'yeray-gran-canaria',
    title: 'Recorrer la cumbre de Gran Canaria y despertar en Tamadaba',
    author: 'Elena & Carlos',
    role: 'Viajeros locales',
    island: 'Gran Canaria • Tejeda y Tamadaba',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    quote: 'Alquilamos la Volkswagen T2 clásica de Yeray para celebrar nuestro aniversario. La entrega en el aeropuerto fue rápida y la sensación de conducir con calma por las carreteras de cumbre es inigualable.',
    badge: 'Experiencia Local',
  },
];
const SHOW_VERIFIED_STORIES = false;

export default function HistoriasPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Breadcrumbs items={[{ name: 'Historias de Éxito', url: '/historias' }]} />

        {/* CABECERA */}
        <section className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#16B8AA]/10 text-[#0F766E] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Comunidad Vaneando</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Historias de la comunidad en Canarias
          </h1>
          <p className="text-xs sm:text-sm text-[#6B726E] font-medium leading-relaxed">
            Publicaremos experiencias verificadas cuando existan reservas y autorizaciones suficientes para compartirlas.
          </p>
        </section>

        {/* LISTADO DE HISTORIAS */}
        <div className="space-y-8 mb-16">
          {!SHOW_VERIFIED_STORIES && (
            <div className="rounded-3xl border border-[#E9E1D2] bg-white p-10 text-center shadow-sm">
              <h2 className="font-serif text-2xl font-bold">Todavía no hay historias verificadas</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-[#6B726E]">No mostramos testimonios, ingresos ni experiencias inventadas. Explora los vehículos publicados o vuelve más adelante.</p>
              <Link href="/buscar" className="mt-6 inline-flex rounded-full bg-[#13322E] px-6 py-3 text-xs font-bold text-white">Explorar vehículos</Link>
            </div>
          )}
          {SHOW_VERIFIED_STORIES && STORIES.map((story) => (
            <article
              key={story.id}
              className="bg-white rounded-3xl border border-[#E9E1D2] overflow-hidden shadow-sm hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 items-center"
            >
              <div className="md:col-span-5 h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100 relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#13322E] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {story.badge}
                </span>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-1.5 text-xs text-[#16B8AA] font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{story.island}</span>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#13322E] leading-snug">
                  {story.title}
                </h2>

                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2] relative">
                  <Quote className="w-5 h-5 text-[#16B8AA]/40 absolute top-3 right-3" />
                  <p className="text-xs sm:text-sm text-[#4A5568] italic leading-relaxed">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <strong className="block text-xs font-bold text-[#13322E]">{story.author}</strong>
                    <span className="text-[11px] text-[#6B726E]">{story.role}</span>
                  </div>

                  <Link
                    href="/buscar"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#16B8AA] hover:text-[#0F766E]"
                  >
                    <span>Ver campers disponibles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* BANNER INFERIOR */}
        <div className="bg-[#13322E] text-white rounded-3xl p-8 text-center space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            ¿Tienes una furgoneta camper en Canarias?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
            Únete a nuestra comunidad de propietarios locales y empieza a recibir solicitudes verificadas hoy mismo.
          </p>
          <Link
            href="/publicar-camper"
            className="inline-flex items-center space-x-2 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] text-white px-7 py-3 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <span>Publicar mi Camper Gratis</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
