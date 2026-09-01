import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import OwnerIncomeCalculator from '@/components/OwnerIncomeCalculator';
import { CheckCircle2, ShieldCheck, CalendarDays, BarChart3, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alquilar mi camper en Canarias y generar ingresos | Vaneando',
  description: 'Calcula cuánto puedes ganar alquilando tu camper en Canarias. Publica gratis, gestiona calendario y reservas, y cobra con condiciones claras.',
  alternates: { canonical: 'https://vaneando.com/alquilar-mi-camper' },
  openGraph: { title: '¿Tienes una camper parada? Empieza a generar ingresos', description: 'Alquila tu camper en Canarias con Vaneando y gestiona tus reservas desde un único panel.', url: 'https://vaneando.com/alquilar-mi-camper', type: 'website' },
};

const benefits = [
  ['Comisión clara del 9,7%', 'Conoce el coste de la plataforma y calcula tu neto antes de publicar.'],
  ['Tu calendario, bajo control', 'Abre y bloquea fechas, define tarifas y decide cuándo quieres recibir reservas.'],
  ['Pagos protegidos', 'El viajero paga dentro de la plataforma y los cobros quedan registrados.'],
  ['Contratos digitales', 'Formaliza cada alquiler con información y firmas disponibles para ambas partes.'],
  ['Panel de estadísticas', 'Consulta visualizaciones, solicitudes, conversiones e ingresos de tus anuncios.'],
  ['Soporte y mensajería', 'Mantén las conversaciones y acuerdos importantes dentro de Vaneando.'],
];
const trustItems = [
  { Icon: ShieldCheck, text: 'Identidad y seguridad' },
  { Icon: CalendarDays, text: 'Calendario flexible' },
  { Icon: BarChart3, text: 'Datos para decidir' },
  { Icon: CheckCircle2, text: 'Sin permanencia' },
];

export default function OwnerAcquisitionPage() {
  const faqSchema = [
    ['¿Cuánto puedo ganar alquilando mi camper en Canarias?', 'Depende del precio diario, la temporada, la disponibilidad y las condiciones de tu vehículo. Usa la calculadora para obtener una estimación orientativa.'],
    ['¿Publicar mi camper tiene algún coste?', 'Publicar el anuncio es gratuito. La comisión se aplica cuando existe una reserva según las condiciones comunicadas por la plataforma.'],
    ['¿Tengo que aceptar todas las reservas?', 'No. Tú decides las fechas, el precio y si aceptas cada solicitud.'],
    ['¿Puedo publicar una camper en cualquier isla?', 'Sí. Puedes publicar en Gran Canaria, Tenerife, Lanzarote, Fuerteventura, La Palma, La Gomera, El Hierro o La Graciosa.'],
  ].map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }));

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqSchema }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://vaneando.com' }, { '@type': 'ListItem', position: 2, name: 'Alquilar mi camper', item: 'https://vaneando.com/alquilar-mi-camper' }] }) }} />
        <section className="bg-[#13322E] px-4 py-16 text-white sm:py-24"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div><span className="text-xs font-black uppercase tracking-[.25em] text-[#F2CC8F]">Para propietarios de Canarias</span><h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-6xl">Calcula cuánto puede generar tu camper.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">Publica tu camper, autocaravana o furgoneta en una plataforma local. Tú decides el precio, las fechas y las condiciones; Vaneando te ayuda a encontrar viajeros y gestionar la reserva.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="#calculadora" className="inline-flex items-center gap-2 rounded-full bg-[#16B8AA] px-6 py-3 text-sm font-black text-white hover:bg-[#0F766E]">Ver mi estimación <ArrowRight className="h-4 w-4" /></Link><Link href="/publicar-camper" className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">Publicar gratis</Link></div></div>
          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm"><p className="text-sm font-bold text-[#F2CC8F]">Una forma sencilla de empezar</p><ol className="mt-5 space-y-5">{['Crea tu anuncio en unos minutos', 'Configura precio, calendario y ubicación aproximada', 'Recibe solicitudes y habla con el viajero en la plataforma', 'Cobra según las condiciones de tu reserva'].map((item, i) => <li key={item} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#16B8AA] text-xs font-black">{i + 1}</span><span className="pt-1 text-sm text-white/85">{item}</span></li>)}</ol></div>
        </div></section>
        <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 sm:py-16">
          <section id="calculadora" aria-label="Calculadora de ingresos para propietarios"><OwnerIncomeCalculator /></section>
          <section id="como-funciona"><div className="max-w-2xl"><span className="text-xs font-black uppercase tracking-[.25em] text-[#16B8AA]">Lo que obtienes</span><h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Todo lo necesario para alquilar con tranquilidad</h2></div><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{benefits.map(([title, text]) => <article key={title} className="rounded-2xl border border-[#E9E1D2] bg-white p-6 shadow-sm"><CheckCircle2 className="h-6 w-6 text-[#16B8AA]" /><h3 className="mt-4 font-serif text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#6B726E]">{text}</p></article>)}</div></section>
          <section className="grid gap-5 md:grid-cols-4">{trustItems.map(({ Icon, text }) => <div key={text} className="rounded-2xl border border-[#E9E1D2] bg-white p-5"><Icon className="h-6 w-6 text-[#16B8AA]" /><strong className="mt-3 block text-sm">{text}</strong></div>)}</section>
          <section className="rounded-3xl border border-[#E9E1D2] bg-white p-7 sm:p-10"><h2 className="font-serif text-3xl font-bold">Resuelve tus dudas antes de publicar</h2><div className="mt-6 grid gap-6 md:grid-cols-2"><div><h3 className="font-bold">¿Tengo que aceptar todas las reservas?</h3><p className="mt-2 text-sm leading-6 text-[#6B726E]">No. Puedes revisar cada solicitud, hablar con el viajero y mantener tu calendario actualizado. La plataforma te ayuda a organizar la operación, pero la decisión sobre disponibilidad sigue siendo tuya.</p></div><div><h3 className="font-bold">¿Qué pasa si todavía no tengo datos bancarios?</h3><p className="mt-2 text-sm leading-6 text-[#6B726E]">Puedes completar el anuncio y recibir reservas. Los cobros destinados a ti quedan retenidos hasta que completes la configuración de cobros y verificación correspondiente.</p></div><div><h3 className="font-bold">¿Puedo publicar en cualquier isla?</h3><p className="mt-2 text-sm leading-6 text-[#6B726E]">Sí. Selecciona Gran Canaria, Tenerife, Lanzarote, Fuerteventura, La Palma, La Gomera, El Hierro o La Graciosa y define una zona aproximada de entrega.</p></div><div><h3 className="font-bold">¿Cuánto cuesta empezar?</h3><p className="mt-2 text-sm leading-6 text-[#6B726E]">Publicar el anuncio es gratuito. La comisión del 9,7% se aplica cuando existe una reserva según las condiciones comunicadas por la plataforma.</p></div></div></section>
          <section className="text-center"><h2 className="font-serif text-3xl font-bold">Tu camper puede estar trabajando cuando tú no la usas</h2><p className="mx-auto mt-3 max-w-2xl text-[#6B726E]">Empieza con una ficha honesta, fotografías actuales y un calendario realista. Después, mejora el anuncio con los datos que te proporcionen los viajeros.</p><Link href="/publicar-camper" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#16B8AA] px-7 py-3 font-black text-white hover:bg-[#0F766E]">Publicar mi camper gratis <ArrowRight className="h-4 w-4" /></Link><p className="mt-4 text-xs text-[#6B726E]">También puedes leer la <Link className="font-bold text-[#16B8AA]" href="/guias/alquilar-mi-camper-en-canarias-guia-propietarios">guía para propietarios</Link>.</p></section>
        </div>
      </main>
    </div>
  );
}
