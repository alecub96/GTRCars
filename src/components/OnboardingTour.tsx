'use client';

import { ArrowRight, CheckCircle2, Compass, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const tours: Record<string, { title: string; text: string }[]> = {
  TRAVELER: [
    {
      title: 'Bienvenido al Garaje GTR Cars',
      text: 'Explora superdeportivos por destino o marca y selecciona tus fechas directamente en el calendario.',
    },
    {
      title: 'Reserva o Solicita Disponibilidad',
      text: 'Cada unidad indica su tarifa diaria transparente, fianza reembolsable y servicios de entrega VIP.',
    },
    {
      title: 'Contrato Digital eIDAS',
      text: 'Formaliza el contrato con firma electrónica legal y check-in fotográfico desde tu panel de reservas.',
    },
    {
      title: 'Conserjería 24/7',
      text: 'Comunícate de forma directa y segura con propietarios verificados o con nuestro equipo de soporte VIP.',
    },
  ],
  OWNER: [
    {
      title: 'Panel de Propietario GTR Cars',
      text: 'Tu panel centraliza tus superdeportivos, calendario de disponibilidad, solicitudes y liquidaciones con Stripe.',
    },
    {
      title: 'Publica y Homologa tu Unidad',
      text: 'Configura tarifas, fianza, kilometraje incluido y fotografías. Nuestro equipo verifica cada anuncio.',
    },
    {
      title: 'Control Total sobre Reservas',
      text: 'Revisa el perfil y verificación del conductor antes de aprobar cada solicitud de alquiler.',
    },
    {
      title: 'Telemetría y Finanzas',
      text: 'Consulta visualizaciones y solicita liquidaciones directas a tu cuenta bancaria.',
    },
  ],
};

export default function OnboardingTour({ role }: { role: string }) {
  const steps = tours[role];
  const [step, setStep] = useState(-1);
  useEffect(() => {
    if (!steps) return;
    const key = `gtrcars-tour-v3-${role}`;
    if (!localStorage.getItem(key)) setTimeout(() => setStep(0), 700);
  }, [role, steps]);
  if (!steps || step < 0) return null;
  const finish = () => {
    localStorage.setItem(`gtrcars-tour-v3-${role}`, 'done');
    setStep(-1);
  };
  const current = steps[step];
  return (
    <div className="fixed inset-0 z-[9998] flex items-end justify-center bg-black/50 p-4 backdrop-blur-xs sm:items-center font-sans">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-gray-200 p-7 shadow-2xl text-black">
        <button
          onClick={finish}
          aria-label="Omitir tutorial"
          className="absolute right-5 top-5 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-black cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
          {step === steps.length - 1 ? <CheckCircle2 className="h-6 w-6" /> : <Compass className="h-6 w-6" />}
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-gray-500">
          PROTOCOLO GTR CARS · {step + 1} DE {steps.length}
        </span>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-black">{current.title}</h2>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-gray-600 font-medium">{current.text}</p>
        <div className="mt-7 flex items-center justify-between font-mono">
          <div className="flex gap-1.5">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === step ? 'w-7 bg-black' : 'w-1.5 bg-gray-200'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => (step === steps.length - 1 ? finish() : setStep(step + 1))}
            className="flex items-center gap-2 rounded-full bg-black hover:bg-neutral-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
          >
            {step === steps.length - 1 ? 'Comenzar' : 'Siguiente'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
