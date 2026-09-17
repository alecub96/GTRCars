'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  Scale,
  Award,
  Sparkles,
  KeyRound,
  Shield,
  HelpCircle,
  PhoneCall,
  UserCheck,
} from 'lucide-react';



export default function SecurityPage() {
  const faqs = [
    {
      q: '¿Cómo funciona la fianza y el cobro del alquiler?',
      a: 'La fianza se fija en el anuncio y se gestiona directamente entre las partes (propietario y conductor). Por su parte, GTRCars procesa el cobro del alquiler al cliente, lo retiene de forma segura durante todo el viaje y lo transfiere al propietario en un plazo de 5 días hábiles tras la finalización del servicio.',
    },
    {
      q: '¿Qué requisitos debe cumplir el conductor?',
      a: 'Tener al menos 25 años, disponer de permiso de conducir Clase B en vigor con un mínimo de 3 años de antigüedad y superar el proceso de verificación biométrica de identidad.',
    },
    {
      q: '¿Cómo se formaliza la entrega y el estado del vehículo?',
      a: 'Tanto propietario como cliente completan un Check-in fotográfico digital en alta definición mediante nuestra app, registrando el estado milimétrico de carrocería, llantas, profundidad de neumáticos y telemetría.',
    },
    {
      q: '¿Qué coberturas tiene el vehículo?',
      a: 'Todos los vehículos cuentan con seguro a todo riesgo y asistencia en carretera premium 24/7 con grúa de plataforma baja especializada para superdeportivos.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative py-16 sm:py-20 px-4 border-b border-gray-200 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-200 text-gray-800 text-xs font-mono font-bold uppercase tracking-widest rounded-full">
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>PROTOCOLO DE MÁXIMA SEGURIDAD GTR CARS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black font-sans">
            GARANTÍAS Y PROTECCIÓN DE SUPERDEPORTIVOS
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 font-mono max-w-2xl mx-auto leading-relaxed">
            Diseñado específicamente para proteger el valor de las piezas más exclusivas del mundo del motor. Alquiler directo entre particulares con total respaldo legal y bancario.
          </p>
        </div>
      </section>

      {/* 3 PILLARS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 bg-white border border-gray-200 rounded-2xl space-y-4 shadow-sm">
            <Lock className="w-8 h-8 text-black" />
            <h3 className="text-lg font-black text-black font-sans uppercase">01 / FIANZA DIRECTA &amp; PAGO RETENIDO</h3>
            <p className="text-xs text-gray-600 font-mono leading-relaxed font-medium">
              La fianza se acuerda y gestiona directamente entre las partes. GTRCars retiene el importe del alquiler y lo liquida en un plazo de 5 días hábiles tras finalizar el servicio conforme.
            </p>
          </div>

          <div className="p-8 bg-white border border-gray-200 rounded-2xl space-y-4 shadow-sm">
            <UserCheck className="w-8 h-8 text-black" />
            <h3 className="text-lg font-black text-black font-sans uppercase">02 / BIOMETRÍA Y FILTRO VIP</h3>
            <p className="text-xs text-gray-600 font-mono leading-relaxed font-medium">
              Verificación de identidad oficial, análisis de antecedentes de conducción y validación biométrica facial obligatoria.
            </p>
          </div>

          <div className="p-8 bg-white border border-gray-200 rounded-2xl space-y-4 shadow-sm">
            <FileText className="w-8 h-8 text-black" />
            <h3 className="text-lg font-black text-black font-sans uppercase">03 / CONTRATOS LEGALES eIDAS</h3>
            <p className="text-xs text-gray-600 font-mono leading-relaxed font-medium">
              Firma digital avanzada con validez jurídica plena en la Unión Europea y registro fotográfico en cadena de bloques.
            </p>
          </div>

        </div>

        {/* FAQS SECTION */}
        <div className="mt-20 border-t border-gray-200 pt-16 max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-black font-sans text-center text-black uppercase tracking-wider mb-8">
            PREGUNTAS FRECUENTES SOBRE GARANTÍAS
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 font-mono">
                <h4 className="text-sm font-bold text-black uppercase">{faq.q}</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
