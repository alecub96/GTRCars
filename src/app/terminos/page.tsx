import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Uso | GTR Cars',
  description: 'Condiciones de uso y contratación de la plataforma GTR Cars para el alquiler de superdeportivos en las Islas Canarias.',
  robots: {
    index: false,
    follow: true,
  },
};

const items = [
  [
    '1. Qué es GTR Cars // Canary Hypercar Vault',
    'GTR Cars es una plataforma tecnológica y club privado de intermediación especializada en la reserva, custodia y alquiler de superdeportivos, hypercars y vehículos de altas prestaciones en las Islas Canarias (Gran Canaria, Tenerife y resto del archipiélago). Facilita el encuentro seguro entre clientes verificados y propietarios o gestores de flota.',
  ],
  [
    '2. Requisitos de Conducción y Registro',
    'Para reservar y conducir vehículos de nuestra flota, el conductor debe tener al menos 25 años de edad (o 23 según el segmento), carnet de conducir en vigor con al menos 2 años de antigüedad y aportar documentación de identidad veraz. La cuenta es personal e intransferible.',
  ],
  [
    '3. Homologación de Vehículos en el Vault',
    'Todos los superdeportivos listados en GTR Cars deben superar una inspección técnica rigurosa: estado de neumáticos, frenos carbocerámicos o de disco, mantenimiento en servicio oficial y seguro de cobertura total para flotas de altas prestaciones.',
  ],
  [
    '4. Reservas y Servicio Concierge',
    'Las solicitudes son validadas por nuestro equipo Concierge. Una reserva queda formalizada tras la verificación de documentación y el pago del depósito de fianza a través de pasarelas de pago seguras cifradas con Stripe.',
  ],
  [
    '5. Fianzas y Depósitos de Seguridad',
    'La fianza de garantía se pre-autoriza en tarjeta de crédito y responde de franquicias de seguro, combustible 98 octanos no repuesto o excesos de kilometraje contratados. Se libera automáticamente tras la inspección de devolución.',
  ],
  [
    '6. Inspección Digital, Telemetría y Entrega',
    'En el momento de la entrega (aeropuertos o villas privadas), se realiza un acta digital fotográfica de estado y lectura de kilometraje. El vehículo debe conducirse conforme a la normativa de tráfico y no está autorizada su utilización en tandas libres de circuito cerrado salvo evento corporativo expresamente concertado.',
  ],
  [
    '7. Cancelaciones y Políticas Flexibles',
    'Cada superdeportivo cuenta con su política de cancelación visible antes del pago (Estricta, Moderada o Flexible). Los reembolsos se liquidan por el mismo medio de pago utilizado.',
  ],
  [
    '8. Confidencialidad y Protección de Datos',
    'GTR Cars garantiza la máxima discreción y confidencialidad respecto a la identidad de sus clientes VIP y propietarios del Vault, cumpliendo estrictamente con el RGPD.',
  ],
  [
    '9. Legislación Aplicable y Contacto',
    'Estas condiciones se rigen por la legislación española. Para cualquier asistencia o consulta, contacta con Concierge en vip@gtrcars.vip.',
  ],
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <article className="rounded-3xl border border-white/10 bg-[#0f0f12] p-8 shadow-2xl sm:p-12">
          <div className="mb-8 border-b border-white/10 pb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase mb-3">
              <Shield className="w-3 h-3" />
              CONDICIONES DE CONTRATACIÓN
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Términos y Condiciones</h1>
            <p className="mt-2 text-xs font-mono text-neutral-400">
              GTR Cars // Canary Hypercar Vault — Reglas de servicio y alquiler de superdeportivos
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm font-mono leading-relaxed text-neutral-300">
            {items.map(([title, text]) => (
              <section key={title} className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-white text-[#D4AF37]">{title}</h2>
                <p>{text}</p>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
