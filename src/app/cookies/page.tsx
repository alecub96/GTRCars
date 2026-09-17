import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Cookie } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies | GTR Cars',
  description: 'Información sobre el uso de cookies y almacenamiento local en la plataforma GTR Cars.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <article className="rounded-3xl border border-white/10 bg-[#0f0f12] p-8 shadow-2xl sm:p-12">
          <div className="mb-8 border-b border-white/10 pb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase mb-3">
              <Cookie className="w-3 h-3" />
              TRANSPARENCIA &amp; PRIVACIDAD
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Política de Cookies</h1>
            <p className="mt-2 text-xs font-mono text-neutral-400">Última actualización: Septiembre de 2026 // GTR Cars</p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm font-mono leading-relaxed text-neutral-300">
            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">1.</span> Qué son las Cookies
              </h2>
              <p>
                Son pequeños identificadores digitales que se guardan en tu dispositivo para mantener una sesión segura, recordar preferencias de telemetría y entender cómo se utiliza el portal de GTR Cars.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">2.</span> Cookies Técnicas y de Seguridad
              </h2>
              <p>
                Son estrictamente necesarias para iniciar sesión, mantener la autenticación del rol de cliente o propietario de superdeportivo, proteger formularios contra ataques CSRF, procesar la pasarela de fianza con Stripe y conservar las reservas de vehículos.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">3.</span> Cookies de Preferencias
              </h2>
              <p>
                Permiten recordar el idioma seleccionado (Español o English), filtros de potencia y segmento de superdeportivo, y vistas del configurador.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">4.</span> Servicios de Terceros
              </h2>
              <p>
                Los proveedores de pago seguro (Stripe), mapas de entrega (Leaflet/OpenStreetMap) y analítica agregada pueden establecer identificadores para garantizar la prestación del servicio.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">5.</span> Gestión de Preferencias
              </h2>
              <p>
                Puedes configurar o borrar las cookies desde los ajustes de privacidad de tu navegador web en cualquier momento.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">6.</span> Contacto
              </h2>
              <p>
                Para cualquier consulta sobre protección de datos o cookies, puedes escribir al equipo de Concierge en{' '}
                <a className="font-bold text-[#D4AF37] underline" href="mailto:vip@gtrcars.vip">
                  vip@gtrcars.vip
                </a>.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
