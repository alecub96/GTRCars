import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
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

export const metadata = {
  title: 'Garantías, Seguros y Protocolo de Fianza | GTCars',
  description: 'Protocolo de máxima seguridad para el alquiler de superdeportivos entre particulares. Fianzas bancarias custodiadas y verificación biométrica.',
};

export default function SecurityPage() {
  const faqs = [
    {
      q: '¿Cómo funciona la fianza y el depósito de seguridad?',
      a: 'La fianza (desde 5.000€ hasta 15.000€ según la categoría del vehículo) se retiene de forma segura mediante autorización bancaria temporal antes de la entrega y se libera automáticamente tras el Check-out conforme.',
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
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] font-sans antialiased selection:bg-[#D4AF37] selection:text-black">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative py-20 px-4 border-b border-white/10 bg-[#090909] text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest rounded-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>PROTOCOLO DE MÁXIMA SEGURIDAD GTCARS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            GARANTÍAS Y PROTECCIÓN DE SUPERDEPORTIVOS
          </h1>

          <p className="text-xs sm:text-sm text-white/50 font-mono max-w-2xl mx-auto leading-relaxed">
            Diseñado específicamente para proteger el valor de las piezas más exclusivas del mundo del motor. Alquiler directo entre particulares con total respaldo legal y bancario.
          </p>
        </div>
      </section>

      {/* 3 PILLARS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 bg-[#0E0E0E] border border-white/10 rounded-sm space-y-4">
            <Lock className="w-8 h-8 text-[#D4AF37]" />
            <h3 className="text-lg font-bold text-white font-mono uppercase">01 / FIANZA CUSTODIADA</h3>
            <p className="text-xs text-white/60 font-mono leading-relaxed">
              Retención de depósito bancario de hasta 15.000€ retenido en depósito de garantía durante todo el periodo del alquiler.
            </p>
          </div>

          <div className="p-8 bg-[#0E0E0E] border border-white/10 rounded-sm space-y-4">
            <UserCheck className="w-8 h-8 text-[#D4AF37]" />
            <h3 className="text-lg font-bold text-white font-mono uppercase">02 / BIOMETRÍA Y FILTRO VIP</h3>
            <p className="text-xs text-white/60 font-mono leading-relaxed">
              Verificación de identidad oficial, análisis de antecedentes de conducción y validación biométrica facial obligatoria.
            </p>
          </div>

          <div className="p-8 bg-[#0E0E0E] border border-white/10 rounded-sm space-y-4">
            <FileText className="w-8 h-8 text-[#D4AF37]" />
            <h3 className="text-lg font-bold text-white font-mono uppercase">03 / CONTRATOS LEGALES eIDAS</h3>
            <p className="text-xs text-white/60 font-mono leading-relaxed">
              Firma digital avanzada con validez jurídica plena en la Unión Europea y registro fotográfico en cadena de bloques.
            </p>
          </div>

        </div>

        {/* FAQS SECTION */}
        <div className="mt-20 border-t border-white/10 pt-16 max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold font-mono text-center text-white uppercase tracking-wider mb-8">
            PREGUNTAS FRECUENTES SOBRE GARANTÍAS
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 bg-[#0E0E0E] border border-white/10 rounded-sm space-y-2 font-mono">
                <h4 className="text-sm font-bold text-[#D4AF37] uppercase">{faq.q}</h4>
                <p className="text-xs text-white/70 leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#030303] text-white/50 py-12 border-t border-white/10 font-mono text-xs text-center">
        <p>© 2026 GTCars Vault — Protocolo de Alquiler de Superdeportivos.</p>
      </footer>
    </div>
  );
}
