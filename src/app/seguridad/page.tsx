import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  LifeBuoy,
  Scale,
  Car,
  FileCheck2,
  Users2,
  Clock,
  HelpCircle,
  Building2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'Seguridad, Coberturas y Garantías Legales | vaneando.',
  description: 'Información legal, coberturas de seguro de alquiler, gestión de fianzas protegidas, verificación de identidad y protocolo de asistencia 24h en Canarias.',
};

export default function SecurityPage() {
  const faqs = [
    {
      q: '¿Qué cubre el seguro durante el periodo de alquiler?',
      a: 'Cada vehículo camperizado o autocaravana publicado en Vaneando cuenta con póliza de seguro en vigor adaptada al alquiler con cobertura en la Comunidad Autónoma de Canarias. Cubre Responsabilidad Civil Obligatoria y Complementaria, Asistencia en Carretera 24/7 en las 8 islas, seguro de ocupantes y daños propios sujetos a la franquicia fijada por el propietario.',
    },
    {
      q: '¿Cómo se gestiona y protege la fianza de la camper?',
      a: 'La fianza no se ingresa en la cuenta personal del propietario. Se realiza una preautorización bancaria custodiada de forma segura mediante pasarela financiera certificada por el Banco de España (Stripe). Tras completar el Check-out digital sin incidencias, la retención se libera automáticamente.',
    },
    {
      q: '¿Es válido el seguro para trasladar la camper entre islas en Ferry?',
      a: 'Sí. Las pólizas contratadas cubren la circulación y asistencia en carretera en todo el archipiélago canario (Gran Canaria, Tenerife, Lanzarote, Fuerteventura, La Palma, La Gomera, El Hierro y La Graciosa), siempre que el cruce marítimo se efectúe en navieras oficiales (Fred. Olsen Express o Naviera Armas).',
    },
    {
      q: '¿Qué requisitos debe cumplir el conductor para estar cubierto?',
      a: 'Tener al menos 21 años (o 25 según especifique el propietario en la ficha del vehículo), disponer de permiso de conducir Clase B en vigor con un mínimo de 2 años de antigüedad y haber completado la verificación de identidad digital (DNI/Pasaporte) en Vaneando antes del check-in.',
    },
    {
      q: '¿Qué ocurre en caso de siniestro, avería o daños menores?',
      a: 'Dispones del servicio de asistencia 24 horas y del acta digital de entrega y devolución. Ante cualquier eventualidad, las partes registran la incidencia en la plataforma adjuntando fotos y evidencias. Nuestro equipo legal evalúa el caso con criterios transparentes conforme a la normativa vigente.',
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
            <span>Marco Legal & Cobertura Garantizada</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Seguridad, Pólizas de Seguro y Garantías en Canarias
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Transparencia total para viajeros y propietarios. Conoce las coberturas obligatorias, la custodia regulada de fianzas, la verificación de conductores y la asistencia 24/7 en el archipiélago.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16B8AA]" /> Póliza de Alquiler en Canarias
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#16B8AA]" /> Custodia Segura de Fianza
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#16B8AA]" /> Asistencia en Carretera 24h
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#16B8AA]" /> Contrato Digital Verificado
            </span>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL A TODO ANCHO */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* 2. PILARES DE SEGURIDAD LEGAL */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#16B8AA]">
              REGLAMENTO Y PROTECCIÓN
            </span>
            <h2 className="text-3xl font-extrabold text-[#13322E] tracking-tight">
              Los 4 Pilares de la Garantía Vaneando
            </h2>
            <p className="text-sm text-[#6B726E] font-medium">
              Todo alquiler celebrado en la plataforma cumple con la normativa civil y mercantil aplicable al transporte sin conductor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PILAR 1: COBERTURA DE SEGURO */}
            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm space-y-4 hover:border-[#16B8AA] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center font-bold">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#13322E] tracking-tight">
                1. Seguro Específico para Alquiler Camper
              </h3>
              <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
                Cada camper o autocaravana en Vaneando cuenta con una póliza contratada en regla adaptada al alquiler de vehículos entre particulares. La póliza garantiza la cobertura de daños a terceros, auxilio en carretera y protección contra siniestros durante todas las fechas reservadas.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[#E9E1D2]/60 text-xs font-bold text-[#13322E]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
                  <span>Responsabilidad Civil Ilimitada según legislación de tráfico.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
                  <span>Asistencia mecánica, grúa y rescate 24/7 en las 8 Islas Canarias.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
                  <span>Protección para conductor y acompañantes ante imprevistos.</span>
                </li>
              </ul>
            </div>

            {/* PILAR 2: CUSTODIA REGULADA DE FIANZA */}
            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm space-y-4 hover:border-[#16B8AA] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#13322E] tracking-tight">
                2. Custodia Segura de la Fianza (Preautorización)
              </h3>
              <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
                Para evitar abusos y garantizar imparcialidad, el dinero de la fianza <strong>nunca se ingresa en la cuenta personal del propietario</strong> durante la reserva. Se mantiene retenido mediante una preautorización segura supervisada por entidades de pago autorizadas por el Banco de España.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[#E9E1D2]/60 text-xs font-bold text-[#13322E]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Bloqueo bancario temporal sin transferencia inmediata.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Liberación automática tras el Check-out digital sin averías.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Resolución de arbitraje transparente en caso de partes de dañado.</span>
                </li>
              </ul>
            </div>

            {/* PILAR 3: VERIFICACIÓN DE CONDUCTORES */}
            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm space-y-4 hover:border-[#16B8AA] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#13322E] text-[#16B8AA] flex items-center justify-center font-bold">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#13322E] tracking-tight">
                3. Identidad y Permisos Verificados
              </h3>
              <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
                Todos los viajeros que conducen una camper en Vaneando superan un proceso de verificación documental obligatoria antes de iniciar el viaje. Esto asegura que la persona al volante cuenta con la licencia necesaria y cumple con los requisitos de edad del seguro.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[#E9E1D2]/60 text-xs font-bold text-[#13322E]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
                  <span>Validación de DNI/Pasaporte y Permiso de Conducir Clase B.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
                  <span>Registro de conductores autorizados en el contrato de alquiler.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0" />
                  <span>Control de antigüedad de carnet (mínimo 2 años requeridos).</span>
                </li>
              </ul>
            </div>

            {/* PILAR 4: FIRMA Y ACTA DIGITAL */}
            <div className="bg-white p-8 rounded-3xl border border-[#E9E1D2] shadow-sm space-y-4 hover:border-[#16B8AA] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center font-bold">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#13322E] tracking-tight">
                4. Contrato Digital y Acta de Check-in/out
              </h3>
              <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
                El proceso de entrega y devolución queda blindado legalmente mediante el Acta Digital. Ambas partes revisan y aceptan con sello temporal el estado exterior, interior, fotos, kilometraje e inventario de accesorios antes de iniciar la ruta.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[#E9E1D2]/60 text-xs font-bold text-[#13322E]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Firma electrónica con validez jurídica según Reglamento eIDAS (UE).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Registro fotográfico geolocalizado en el check-in y devolución.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Evidencia fehaciente ante reclamaciones o desacuerdos.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. PASO A PASO EN CASO DE INCIDENCIA EN CARRETERA */}
        <section className="bg-white rounded-3xl border border-[#E9E1D2] p-8 sm:p-12 shadow-sm space-y-8">
          <div className="border-b border-[#E9E1D2] pb-6">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#D97706]">
              ASISTENCIA Y PROTOCOLO DÍA A DÍA
            </span>
            <h2 className="text-3xl font-extrabold text-[#13322E] tracking-tight mt-1">
              ¿Qué hacer si ocurre una incidencia durante el viaje?
            </h2>
            <p className="text-sm text-[#6B726E] font-medium mt-2">
              En caso de avería fortuita, pinchazo o accidente en carretera, el protocolo Vaneando garantiza respuesta inmediata en cualquier isla de Canarias.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2] space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#13322E] text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-sm text-[#13322E]">1. Contacta con Asistencia</h4>
              <p className="text-xs text-[#6B726E] font-medium leading-relaxed">
                Llama al teléfono de asistencia 24h indicado en el contrato digital de tu reserva para solicitar grúa o asistencia técnica in situ.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2] space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#13322E] text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-sm text-[#13322E]">2. Avisa al Propietario</h4>
              <p className="text-xs text-[#6B726E] font-medium leading-relaxed">
                Comunica lo ocurrido a través de la mensajería oficial de Vaneando para mantener informado al propietario en todo momento.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2] space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#13322E] text-white text-xs font-black flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-sm text-[#13322E]">3. Rellena el Parte</h4>
              <p className="text-xs text-[#6B726E] font-medium leading-relaxed">
                Si ha intervenido otro vehículo, completa el Parte Europeo de Accidente que encontrarás en la guantera de la camper.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2] space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#13322E] text-white text-xs font-black flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-sm text-[#13322E]">4. Tramitación Vaneando</h4>
              <p className="text-xs text-[#6B726E] font-medium leading-relaxed">
                El equipo de soporte y mediación gestiona la tramitación del siniestro y la devolución o regularización del saldo con total claridad.
              </p>
            </div>
          </div>
        </section>

        {/* 4. PREGUNTAS FRECUENTES DE SEGURO Y GARANTÍAS (FAQ) */}
        <section className="space-y-8">
          <div className="flex items-center space-x-3 border-b border-[#E9E1D2] pb-4">
            <HelpCircle className="w-6 h-6 text-[#16B8AA]" />
            <h2 className="text-2xl font-extrabold text-[#13322E] tracking-tight">
              Preguntas Frecuentes sobre Seguro y Seguridad Legal
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

        {/* 5. BANNER FINAL DE ATENCIÓN Y CONTACTO LEGAL */}
        <section className="bg-[#13322E] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <Scale className="w-10 h-10 text-[#16B8AA] mx-auto opacity-90" />
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ¿Tienes alguna duda legal o sobre la póliza de un vehículo?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Nuestro equipo de soporte y atención al cliente está disponible para orientarte antes de reservar o publicar tu camper en Canarias.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/soporte"
                className="inline-flex items-center space-x-2 bg-[#16B8AA] hover:bg-[#0F766E] text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-md"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>Contactar con Soporte Vaneando</span>
              </Link>
              <Link
                href="/terminos"
                className="inline-flex items-center space-x-2 border border-white/30 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-full transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Ver Términos y Condiciones completas</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
