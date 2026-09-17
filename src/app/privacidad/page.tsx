import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad | GTR Cars',
  description: 'Cómo protegemos tus datos y garantizamos la máxima discreción en la plataforma GTR Cars en Canarias.',
  robots: {
    index: false,
    follow: true,
  },
};

const sections = [
  [
    '1. Responsable del Tratamiento',
    <>
      El responsable del tratamiento es <strong>GTR Cars // Canary Hypercar Vault</strong>. Para cualquier consulta o ejercicio de derechos ARCO, puedes escribir a{' '}
      <a className="font-bold text-[#D4AF37] underline" href="mailto:vip@gtrcars.vip">
        vip@gtrcars.vip
      </a>.
    </>,
  ],
  [
    '2. Datos que Tratamos',
    <>
      Tratamos datos identificativos y de contacto, credenciales de acceso, documentación de verificación de identidad (DNI/Pasaporte y Permiso de Conducir con cifrado AES-256), datos de telemetría y geolocalización de entrega de vehículos, y registros de transacciones mediante pasarela bancaria Stripe.
    </>,
  ],
  [
    '3. Finalidad del Tratamiento',
    <>
      Utilizamos tu información para validar la elegibilidad de conducción de superdeportivos, formalizar actas digitales de entrega, procesar preautorizaciones de fianza, gestionar el servicio de Concierge VIP y asegurar el cumplimiento de las pólizas de seguro de flota. No comercializamos datos personales bajo ningún concepto.
    </>,
  ],
  [
    '4. Protocolo de Discreción y Confidencialidad VIP',
    <>
      GTR Cars mantiene un protocolo estricto de privacidad para clientes de alto perfil, celebridades y propietarios del Vault. La información de entrega y contratos se procesa bajo estricto secreto profesional.
    </>,
  ],
  [
    '5. Destinatarios y Seguridad Técnica',
    <>
      Los datos se almacenan en servidores con cifrado en reposo y en tránsito (TLS 1.3 / AES-256). Solo se comparten con proveedores indispensables: entidades de pago (Stripe), aseguradoras de flotas de alta gama y autoridades competentes en cumplimiento de la normativa legal.
    </>,
  ],
  [
    '6. Derechos del Usuario',
    <>
      Puedes solicitar el acceso, rectificación, portabilidad o supresión de tus datos en cualquier momento contactando a nuestro delegado de protección de datos en{' '}
      <a className="font-bold text-[#D4AF37] underline" href="mailto:vip@gtrcars.vip">
        vip@gtrcars.vip
      </a>.
    </>,
  ],
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <article className="rounded-3xl border border-white/10 bg-[#0f0f12] p-8 shadow-2xl sm:p-12">
          <div className="mb-8 border-b border-white/10 pb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase mb-3">
              <Lock className="w-3 h-3" />
              CONFIDENCIALIDAD &amp; PROTECCIÓN DE DATOS
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Política de Privacidad</h1>
            <p className="mt-2 text-xs font-mono text-neutral-400">
              GTR Cars // Canary Hypercar Vault — Compromiso de confidencialidad y RGPD
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm font-mono leading-relaxed text-neutral-300">
            {sections.map(([title, body], index) => (
              <section key={index} className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-white text-[#D4AF37]">{title}</h2>
                <div>{body}</div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
