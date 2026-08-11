'use client';

import { ArrowRight, CheckCircle2, Compass, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const tours: Record<string, { title: string; text: string }[]> = {
  TRAVELER: [
    { title: 'Bienvenido a modo viajero', text: 'Busca una camper por isla y selecciona las fechas directamente en el calendario.' },
    { title: 'Solicita o reserva', text: 'Los anuncios indican si requieren aprobación del propietario o permiten reserva inmediata.' },
    { title: 'Todo en tu cuenta', text: 'Consulta viajes y cancelaciones en Mis reservas; tus datos y reputación están en Mi perfil.' },
    { title: 'Habla con seguridad', text: 'Mensajes de reservas conecta con propietarios. Soporte es un canal independiente con nuestro equipo.' },
  ],
  OWNER: [
    { title: 'Bienvenido a modo propietario', text: 'Tu panel de campers concentra anuncios, calendario, solicitudes y liquidaciones.' },
    { title: 'Completa tu anuncio', text: 'Añade fotos, equipamiento, tarifas y normas. El equipo administrador lo revisará antes de publicarlo.' },
    { title: 'Gestiona cada solicitud', text: 'Revisa viajero, fechas e importe antes de aceptar o rechazar. Las confirmadas quedan separadas.' },
    { title: 'Mide tu actividad', text: 'Estadísticas muestra interés y conversión; Finanzas separa volumen, comisión y neto.' },
  ],
};

export default function OnboardingTour({ role }: { role: string }) {
  const steps = tours[role];
  const [step, setStep] = useState(-1);
  useEffect(() => {
    if (!steps) return;
    const key = `vaneando-tour-v2-${role}`;
    if (!localStorage.getItem(key)) setTimeout(() => setStep(0), 700);
  }, [role, steps]);
  if (!steps || step < 0) return null;
  const finish = () => { localStorage.setItem(`vaneando-tour-v2-${role}`, 'done'); setStep(-1); };
  const current = steps[step];
  return <div className="fixed inset-0 z-[9998] flex items-end justify-center bg-[#13322E]/30 p-4 backdrop-blur-[2px] sm:items-center"><div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white p-7 shadow-2xl"><button onClick={finish} aria-label="Omitir tutorial" className="absolute right-5 top-5 rounded-full p-2 text-[#6B726E] hover:bg-[#F7F6F2]"><X className="h-4 w-4" /></button><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA]">{step === steps.length - 1 ? <CheckCircle2 className="h-6 w-6" /> : <Compass className="h-6 w-6" />}</div><span className="text-[10px] font-black uppercase tracking-[.22em] text-[#16B8AA]">Guía rápida · {step + 1} de {steps.length}</span><h2 className="mt-2 font-serif text-3xl font-bold text-[#13322E]">{current.title}</h2><p className="mt-3 text-sm leading-relaxed text-[#6B726E]">{current.text}</p><div className="mt-7 flex items-center justify-between"><div className="flex gap-1.5">{steps.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === step ? 'w-7 bg-[#16B8AA]' : 'w-1.5 bg-[#E9E1D2]'}`} />)}</div><button onClick={() => step === steps.length - 1 ? finish() : setStep(step + 1)} className="flex items-center gap-2 rounded-full bg-[#13322E] px-5 py-3 text-xs font-bold text-white">{step === steps.length - 1 ? 'Terminar' : 'Siguiente'}<ArrowRight className="h-4 w-4" /></button></div></div></div>;
}
