import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  LifeBuoy,
  Scale,
  Car,
  FileCheck2,
  Users2,
  HelpCircle,
  PhoneCall,
  UserCheck,
  Handshake,
} from 'lucide-react';

export const metadata = {
  title: 'Seguridad, seguros y gestión de fianzas',
  description: 'Condiciones de uso, seguro del vehículo particular, gestión directa de fianza entre viajero y propietario, y verificación de identidad en Canarias.',
};

export default function SecurityPage() {
  const faqs = [
    {
      q: '¿Cómo funciona el seguro del vehículo durante el alquiler?',
      a: 'Cada vehículo camperizado publicado en Vaneando cuenta con la póliza de seguro contratada por su propietario particular. Si el viajero desea disponer de un seguro adicional o cobertura específica para su viaje, deberá contratarlo por su cuenta de forma independiente.',
    },
    {
      q: '¿Cómo se gestiona y abona la fianza del alquiler?',
      a: 'La fianza se gestiona y liquida directamente entre el viajero y el propietario particular. Vaneando no cobra, retiene ni custodia el importe de la fianza en la plataforma. El importe estipulado en la ficha del vehículo es acordado y administrado de forma directa entre ambas partes.',
    },
    {
      q: '¿Qué ocurre en caso de pequeños desperfectos o daños?',
      a: 'Los eventuales desperfectos o costes no cubiertos por la póliza propia del vehículo son asumidos por el viajero con cargo a la fianza acordada directamente con el propietario, según lo estipulado entre ambas partes en el momento del Check-in y Check-out.',
    },
    {
      q: '¿Qué requisitos debe cumplir el conductor?',
      a: 'Disponer de permiso de conducir Clase B en vigor con la antigüedad requerida por el propietario y haber completado la verificación de identidad (DNI/Pasaporte) en Vaneando.',
    },
    {
      q: '¿Cómo se formaliza la entrega del vehículo?',
      a: 'Propietario y viajero revisan juntos el estado de la camper, kilometraje, nivel de combustible e inventario mediante el Acta Digital de entrega y devolución disponible en la plataforma.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      {/* 1. HERO INSTITUCIONAL */}
      <section className="relative bg-[#13322E] text-white py-16 sm:py-24 px-4 overflow-hidden border-b border-[#16B8AA]/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#16B8AA_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-[#16B8AA]/20 border border-[#16B8AA]/40 text-[#16B8AA] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4" />
            <span>Condiciones de Alquiler y Transparencia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Seguridad, Seguros y Gestión de Fianzas
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Información clara y transparente para viajeros y propietarios. Consulta cómo funciona el seguro del particular, la gestión directa de fianzas entre partes y el acta digital de revisión.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <Car className="w-4 h-4 text-[#16B8AA]" /> Seguro del Particular
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-[#16B8AA]" /> Fianza Directa Particular - Propietario
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#16B8AA]" /> Verificación de Identidad
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#16B8AA]" /> Acta Digital de Entrega
            </span>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* AVISO IMPORTANTE DE INTERMEDIACIÓN TECNOLÓGICA */}
        <div className="bg-amber-50/80 border border-amber-200 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-4 text-amber-950">
          <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-black shrink-0 text-base">
            ⚖️
          </div>
          <div className="space-y-1 text-xs leading-relaxed">
            <strong className="block text-sm font-bold text-amber-950">
              Vaneando es exclusivamente una plataforma tecnológica intermediaria
            </strong>
            <p className="text-amber-900/90 font-medium">
              Todos los contratos de alquiler, seguros del vehículo y acuerdos de fianza se celebran <strong>directa y exclusivamente entre particulares (viajero y propietario)</strong>. Vaneando no es propietario de los vehículos, no presta servicios de alquiler ni forma parte del contrato suscrito entre las partes.
            </p>
          </div>
        </div>

        {/* 2. PILARES CLAVE */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#16B8AA]">
              NORMAS Y CONDICIONES DE ALQUILER
            </span>
            <h2 className="text-3xl font-extrabold text-[#13322E] tracking-tight">
              ¿Cómo se organiza la seguridad en Vaneando?
            </h2>
            <p className="text-sm text-[#6B726E] font-medium">
              Relación transparente entre viajero y propietario particular para el uso de campers en Canarias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PILAR 1: SEGURO DEL VEHÍCULO */}
            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm space-y-4 hover:border-[#16B8AA] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center font-bold">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#13322E] tracking-tight">
                1. Seguro del Propietario Particular
              </h3>
              <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
                Cada vehículo mantiene la póliza de seguro que tenga contratada su propietario particular. Si el viajero desea contratar una cobertura adicional o seguro específico de viaje, debe realizarlo por su cuenta de forma independiente antes o durante el alquiler.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[#E9E1D2]/60 text-xs font-bold text-[#13322E]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
                  <span>El vehículo circula bajo la póliza contratada por su propietario.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
                  <span>Seguro adicional a cargo del viajero si desea mayor cobertura.</span>
                </li>
              </ul>
            </div>

            {/* PILAR 2: GESTIÓN DIRECTA DE FIANZA */}
            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm space-y-4 hover:border-[#16B8AA] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center font-bold">
                <Handshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#13322E] tracking-tight">
                2. Gestión Directa de la Fianza
              </h3>
              <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
                La fianza estipulada en el anuncio se acuerda y gestiona directamente entre el viajero y el propietario particular. Vaneando no retiene ni deposita el importe de la fianza en la plataforma; responde de los eventuales daños o desperfectos según lo pactado por ambas partes.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[#E9E1D2]/60 text-xs font-bold text-[#13322E]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Acuerdo y liquidación directa entre cliente y propietario.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Sin intermediación ni retención de saldo de fianza en Vaneando.</span>
                </li>
              </ul>
            </div>

            {/* PILAR 3: VERIFICACIÓN DE IDENTIDAD */}
            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm space-y-4 hover:border-[#16B8AA] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#13322E] text-[#16B8AA] flex items-center justify-center font-bold">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#13322E] tracking-tight">
                3. Identidad y Registro de Conductores
              </h3>
              <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
                Para dar seguridad a ambas partes, Vaneando requiere la verificación documental del conductor (DNI/Pasaporte y carnet de conducir en vigor) previa al inicio del viaje.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[#E9E1D2]/60 text-xs font-bold text-[#13322E]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
                  <span>Proceso de verificación de identidad cuando la reserva lo requiere.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
                  <span>Control de permiso Clase B y requisitos de antigüedad.</span>
                </li>
              </ul>
            </div>

            {/* PILAR 4: ACTA DIGITAL */}
            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm space-y-4 hover:border-[#16B8AA] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center font-bold">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#13322E] tracking-tight">
                4. Acta Digital de Entrega y Devolución
              </h3>
              <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
                Propietario y viajero documentan el estado de la camper, fotografías, nivel de combustible e inventario a la entrega (Check-in) y devolución (Check-out) desde la plataforma.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[#E9E1D2]/60 text-xs font-bold text-[#13322E]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Registro de fotos e inspección visual en la entrega y devolución.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Constancia fehaciente del estado del vehículo para ambas partes.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. PREGUNTAS FRECUENTES (FAQ) */}
        <section className="space-y-8">
          <div className="flex items-center space-x-3 border-b border-[#E9E1D2] pb-4">
            <HelpCircle className="w-6 h-6 text-[#16B8AA]" />
            <h2 className="text-2xl font-extrabold text-[#13322E] tracking-tight">
              Preguntas Frecuentes sobre Seguro y Fianza
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm space-y-3"
              >
                <h3 className="font-bold text-sm text-[#13322E] flex items-start gap-2">
                  <span className="text-[#16B8AA] font-black">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-[#6B726E] leading-relaxed font-medium pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. BANNER FINAL */}
        <section className="bg-[#13322E] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <Scale className="w-10 h-10 text-[#16B8AA] mx-auto opacity-90" />
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ¿Tienes alguna otra duda sobre tu reserva?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Consulta nuestros Términos y Condiciones o contacta con el equipo de soporte Vaneando.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/soporte"
                className="inline-flex items-center space-x-2 bg-[#16B8AA] hover:bg-[#0F766E] text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-md"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>Contactar con Soporte</span>
              </Link>
              <Link
                href="/terminos"
                className="inline-flex items-center space-x-2 border border-white/30 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-full transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Ver Términos y Condiciones</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
