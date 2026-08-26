'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
  category?: 'viajeros' | 'propietarios' | 'seguridad';
}

const FAQS: FAQItem[] = [
  {
    category: 'viajeros',
    question: '¿Cómo funciona el alquiler de campers entre particulares en Vaneando?',
    answer: 'Vaneando conecta anuncios de vehículos con viajeros en las Islas Canarias. Puedes buscar por isla, filtrar por tipo de vehículo o plazas y revisar las condiciones del anuncio antes de contactar. El contrato y el pago aplicables se muestran según la reserva.',
  },
  {
    category: 'viajeros',
    question: '¿Qué incluye el precio por día y qué fianza se solicita?',
    answer: 'Cada anuncio detalla con total transparencia el precio por día, los kilómetros diarios incluidos (generalmente entre 150 km y kilometraje ilimitado), el menaje de cocina y la fianza. La fianza se retiene de forma temporal y se desbloquea tras la devolución sin incidencias del vehículo.',
  },
  {
    category: 'viajeros',
    question: '¿Puedo recoger la furgoneta en el aeropuerto o en otra isla?',
    answer: 'Sí. La gran mayoría de propietarios ofrecen entrega directa y flexible en los aeropuertos principales (Gran Canaria LPA, Tenerife Norte TFN, Tenerife Sur TFS, Lanzarote ACE, Fuerteventura FUE) o en puntos acordados. Puedes consultar el punto de entrega en la ficha de cada camper.',
  },
  {
    category: 'propietarios',
    question: '¿Cuánto puedo ganar alquilando mi camper en Canarias?',
    answer: 'Dependiendo del tipo de vehículo y la temporada, los propietarios en Vaneando generan entre 1.200€ y 3.500€ al mes. Las tarifas oscilan entre 60€/día para minicampers y más de 120€/día para autocaravanas y furgonetas gran volumen.',
  },
  {
    category: 'propietarios',
    question: '¿Cómo se formaliza el contrato y la revisión del vehículo?',
    answer: 'Vaneando genera automáticamente un contrato de arrendamiento digital con validez legal según el Reglamento Europeo eIDAS 910/2014. Además, dispones de una suite de fotos de inspección digital (check-in / check-out) para registrar el cuentakilómetros, nivel de combustible y estado del vehículo antes y después de cada viaje.',
  },
  {
    category: 'seguridad',
    question: '¿Qué ocurre si necesito cancelar una reserva?',
    answer: 'Cada anuncio cuenta con una política de cancelación clara (Flexible, Moderada o Estricta). En caso de causas justificadas o imprevistos de fuerza mayor, tanto el viajero como el propietario reciben reembolsos y notificaciones por correo de forma inmediata y automatizada.',
  },
];

export default function FAQAccordion({ items = FAQS }: { items?: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filterCategory, setFilterCategory] = useState<'todas' | 'viajeros' | 'propietarios' | 'seguridad'>('todas');

  const filteredFaqs = filterCategory === 'todas'
    ? items
    : items.filter((f) => f.category === filterCategory);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="my-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-[#16B8AA]/10 text-[#0F766E] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Resolvemos tus dudas</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#13322E]">
          Preguntas Frecuentes
        </h2>
        <p className="text-xs sm:text-sm text-[#6B726E]">
          Todo lo que necesitas saber para alquilar o rentabilizar tu camper en las Islas Canarias.
        </p>

        {/* SELECTOR DE CATEGORÍA */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
          {[
            { id: 'todas', label: 'Todas las preguntas' },
            { id: 'viajeros', label: 'Para Viajeros' },
            { id: 'propietarios', label: 'Para Propietarios' },
            { id: 'seguridad', label: 'Seguros y Pagos' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterCategory(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-[#13322E] text-white shadow-sm'
                  : 'bg-white border border-[#E9E1D2] text-[#6B726E] hover:text-[#13322E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* LISTADO DE PREGUNTAS */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-[#16B8AA] bg-white shadow-md'
                  : 'border-[#E9E1D2] bg-white hover:border-[#16B8AA]/40'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#13322E] cursor-pointer select-none"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#16B8AA] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#4A5568] leading-relaxed border-t border-[#F0ECE1] animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
