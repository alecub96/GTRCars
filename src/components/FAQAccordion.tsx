'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
  category?: 'viajeros' | 'propietarios' | 'seguridad';
}

const FAQS: FAQItem[] = [
  {
    category: 'viajeros',
    question: '¿Cómo funciona el alquiler de superdeportivos entre propietarios verificados en GTR Cars?',
    answer:
      'GTR Cars conecta a propietarios certificados de superdeportivos, GT Cars e hypercars con conductores verificados en Madrid, Marbella, Barcelona, Mallorca, Ibiza, Gran Canaria, Tenerife y Londres. Seleccionas las fechas en la ficha del vehículo, revisas el desglose transparente y formalizas el contrato digital eIDAS y el pago custodiado por Stripe Connect.',
  },
  {
    category: 'viajeros',
    question: '¿Qué incluye el precio por día y cómo funciona la fianza reembolsable?',
    answer:
      'Cada ficha detalla la tarifa diaria oficial, el kilometraje incluido (habitualmente entre 150 y 250 km/día), el seguro y el depósito de garantía reembolsable. La fianza queda reflejada en el contrato digital con el acta fotográfica de entrega (Anexo I) y se libera tras devolver la unidad sin incidencias.',
  },
  {
    category: 'viajeros',
    question: '¿Ofrecéis entrega VIP en aeropuerto, hotel 5* Gran Lujo o villa privada?',
    answer:
      'Sí. Nuestro servicio de Conserjería VIP 24/7 coordina entregas personalizadas en terminales ejecutivas de aeropuertos (MAD, AGP, BCN, PMI, IBZ, LPA, TFS, TFN, LHR), hoteles 5* GL y puertos deportivos como Puerto Banús, Port Adriano o Marina Botafoch.',
  },
  {
    category: 'propietarios',
    question: '¿Cuánto puedo rentabilizar mi superdeportivo publicándolo en el Garaje GTR Cars?',
    answer:
      'Dependiendo del modelo (Porsche 911 GT3, Ferrari 488/296/SF90, Lamborghini Huracán/Revuelto, McLaren) y de los días que habilites tu calendario, los propietarios generan entre 3.500 € y 12.000 € netos al mes manteniendo el control total sobre quién conduce su vehículo.',
  },
  {
    category: 'propietarios',
    question: '¿Cómo se formaliza el contrato digital eIDAS y el acta de inspección pre-entrega?',
    answer:
      'GTR Cars genera un contrato de arrendamiento digital con firma electrónica avanzada conforme al Reglamento Europeo eIDAS (UE 910/2014). Antes de entregar las llaves, ambas partes registran en el Anexo I el kilometraje, nivel de combustible y 8 fotografías de alta resolución de carrocería, llantas, neumáticos y frenos carbono-cerámicos.',
  },
  {
    category: 'seguridad',
    question: '¿Cómo se protege el pago y qué ocurre en caso de cancelación?',
    answer:
      'Todos los pagos se procesan mediante encriptación bancaria con Stripe Connect y permanecen custodiados hasta que el servicio concluye satisfactoriamente. Cada vehículo indica claramente su política de cancelación antes de confirmar la reserva.',
  },
];

export default function FAQAccordion({ items = FAQS }: { items?: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filterCategory, setFilterCategory] = useState<'todas' | 'viajeros' | 'propietarios' | 'seguridad'>('todas');

  const filteredFaqs =
    filterCategory === 'todas' ? items : items.filter((f) => f.category === filterCategory);

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
    <section className="my-12 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-gray-100 text-black border border-gray-200 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Protocolo &amp; Garantías GTR Cars</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
          Preguntas Frecuentes
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 font-mono">
          Respuestas claras sobre requisitos, fianzas, entregas VIP y rentabilidad para propietarios.
        </p>

        <div className="flex items-center justify-center flex-wrap gap-2 pt-4 font-mono">
          {[
            { id: 'todas', label: 'Todas las preguntas' },
            { id: 'viajeros', label: 'Pilotos & Clientes' },
            { id: 'propietarios', label: 'Propietarios' },
            { id: 'seguridad', label: 'Contratos & Pagos' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterCategory(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:text-black hover:border-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-black bg-white shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-black cursor-pointer select-none"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-black shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-fade-in">
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
