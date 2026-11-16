import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, FileSignature, Gauge, ChevronRight, Sparkles } from 'lucide-react';

const VIP_DESTINATIONS = [
  {
    city: 'Madrid',
    tag: 'Barajas T4 · Salamanca · La Moraleja',
    desc: 'Alquiler de Ferrari, Lamborghini y Porsche con entrega privada en terminal ejecutiva o domicilio.',
    href: '/alquiler-superdeportivos/madrid',
  },
  {
    city: 'Marbella',
    tag: 'Puerto Banús · Milla de Oro · Málaga AGP',
    desc: 'Superdeportivos descapotables, Spider y Hypercars en la Costa del Sol con servicio Concierge 24/7.',
    href: '/alquiler-superdeportivos/marbella',
  },
  {
    city: 'Barcelona',
    tag: 'El Prat BCN · Paseo de Gracia · Sitges',
    desc: 'Flota GT y Berlinettas V8/V10 para eventos corporativos, rutas por la Costa Brava y Circuit.',
    href: '/alquiler-superdeportivos/barcelona',
  },
  {
    city: 'Mallorca & Ibiza',
    tag: 'Son Sant Joan PMI · Puerto Portals · Marina Botafoch',
    desc: 'Conduce un Porsche 911 Cabriolet o Ferrari Spider frente al Mediterráneo o al pie de tu embarcación.',
    href: '/alquiler-superdeportivos/mallorca',
  },
  {
    city: 'Gran Canaria',
    tag: 'Meloneras · Maspalomas · Aeropuerto LPA',
    desc: 'Rutas costeras y de montaña durante todo el año con entrega directa en hoteles 5* GL y villas.',
    href: '/alquiler-superdeportivos/gran-canaria',
  },
  {
    city: 'Tenerife',
    tag: 'Costa Adeje · Las Américas · El Teide TFS',
    desc: 'Experiencia de conducción de altura rumbo al Parque Nacional del Teide a los mandos de un V10 o Flat-6.',
    href: '/alquiler-superdeportivos/tenerife',
  },
];

const OFFICIAL_BRANDS = [
  { name: 'Porsche', sub: '911 GT3 RS · Touring · Turbo S', href: '/marca/porsche' },
  { name: 'Ferrari', sub: '488 GTB · SF90 Stradale · 296 GTB', href: '/marca/ferrari' },
  { name: 'Lamborghini', sub: 'Revuelto V12 · Huracán STO · Urus S', href: '/marca/lamborghini' },
  { name: 'McLaren', sub: '750S Spider · 765LT · Artura', href: '/marca/mclaren' },
  { name: 'Aston Martin', sub: 'DBS Superleggera · Vantage V8', href: '/marca/aston-martin' },
  { name: 'Mercedes-AMG', sub: 'GT Black Series · G63 AMG', href: '/marca/mercedes-amg' },
  { name: 'Audi Sport', sub: 'R8 V10 Performance · RS6 Avant', href: '/marca/audi' },
  { name: 'BMW M', sub: 'M4 Competition xDrive · M3 CS', href: '/marca/bmw' },
  { name: 'Bentley', sub: 'Continental GT Speed W12', href: '/marca/bentley' },
  { name: 'Rolls-Royce', sub: 'Spectre · Cullinan Black Badge', href: '/marca/rolls-royce' },
  { name: 'Chevrolet', sub: 'Corvette C8 Z06 Track Pack', href: '/marca/chevrolet' },
  { name: 'Ford Performance', sub: 'Mustang Dark Horse V8 5.0', href: '/marca/ford' },
];

export const HOME_SEO_FAQS = [
  {
    q: '¿Cuánto cuesta alquilar un superdeportivo en España con GTR Cars?',
    a: 'Las tarifas oficiales en GTR Cars comienzan desde 490 €/día en deportivos V8 (como Ford Mustang Dark Horse o BMW M4 Competition), entre 790 € y 1.290 €/día para modelos como Ferrari 488 GTB Rosso Corsa, Porsche 911 GT3 o Audi R8 V10, y desde 1.750 € hasta 2.950 €/día para hypercars de referencia como Ferrari SF90 Stradale o Lamborghini Revuelto V12.',
  },
  {
    q: '¿Qué requisitos se necesitan para alquilar un Ferrari, Lamborghini o Porsche?',
    a: 'Para reservar cualquier vehículo de la colección GTR Cars se requiere tener al menos 25 años de edad, carnet de conducir tipo B vigente con más de 3 años de antigüedad, documento de identidad (DNI, NIE o Pasaporte en vigor) y superar nuestra validación biométrica digital en menos de 2 minutos.',
  },
  {
    q: '¿Cómo funcionan la fianza, el seguro y el contrato digital?',
    a: 'Todos los vehículos incluyen seguro a todo riesgo con franquicia adaptada a cada unidad y asistencia en carretera VIP 24h. Antes de la entrega se firma el Contrato Digital de Arrendamiento con validez jurídica europea eIDAS y se realiza un acta fotográfica 360° de llantas, carrocería y telemetría.',
  },
  {
    q: '¿Realizáis entregas en aeropuertos, hoteles y puertos deportivos?',
    a: 'Sí. Nuestro servicio Concierge entrega y recoge el vehículo de forma personalizada en terminales de aviación ejecutiva y comercial (Madrid-Barajas, Málaga-Costa del Sol, Barcelona-El Prat, Palma de Mallorca, Ibiza, Gran Canaria y Tenerife Sur), así como en hoteles 5 estrellas Gran Lujo, villas privadas y marinas como Puerto Banús o Puerto Portals.',
  },
  {
    q: '¿Cómo puedo rentabilizar mi propio superdeportivo en GTR Cars Vault?',
    a: 'Si eres propietario de un deportivo o superdeportivo, puedes publicarlo gratuitamente en GTR Cars. Tú decides la tarifa diaria, la fianza y qué solicitudes aceptas. GTR Cars verifica la identidad de cada conductor, aporta el contrato legal eIDAS y custodia el cobro del alquiler de forma segura.',
  },
];

export default function HomeSeoSection() {
  return (
    <section
      aria-labelledby="seo-directory-heading"
      className="bg-white border-t border-gray-200 py-20 px-4 sm:px-6 lg:px-8 text-black"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* 1. BLOQUE EDITORIAL E INGENIERÍA DE ALQUILER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-800">
              <Sparkles className="w-3.5 h-3.5 text-[#E10600]" />
              <span>Plataforma Líder de Alquiler de Superdeportivos en España</span>
            </div>
            <h2
              id="seo-directory-heading"
              className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black leading-tight"
            >
              Alquiler de Superdeportivos, GT Cars e Hypercars con Garantía eIDAS
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>GTR Cars</strong> conecta a conductores apasionados con las colecciones privadas y flotas más exclusivas de Europa. A diferencia de los rent-a-car convencionales, en GTR Cars reservas <strong>exactamente la unidad configurada en ficha</strong>: desde un <strong>Porsche 911 GT3 RS (992)</strong> o un <strong>Ferrari SF90 Stradale de 1.000 CV</strong> hasta el nuevo <strong>Lamborghini Revuelto V12 Hybrid</strong>, con kilometraje verificado, neumáticos homologados y telemetría auditada.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Cada reserva está respaldada por nuestro protocolo de seguridad de triple capa: <strong>verificación biométrica KYC</strong> del conductor, <strong>contrato digital vinculante eIDAS</strong> con check-in fotográfico milimétrico antes de arrancar y <strong>custodia segura del pago</strong> hasta la finalización conforme del servicio.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <ShieldCheck className="w-6 h-6 text-black" />
              <h3 className="text-xs font-black uppercase tracking-wider text-black">
                Unidad Exacta Garantizada
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sin sorpresas de &ldquo;o similar&rdquo;. Recibes el chasis, color, escape deportivo y especificación exacta que seleccionas en el catálogo.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <FileSignature className="w-6 h-6 text-black" />
              <h3 className="text-xs font-black uppercase tracking-wider text-black">
                Contrato Digital eIDAS
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Firma electrónica avanzada en 60 segundos desde tu móvil con acta pericial fotográfica de entrega y devolución.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <MapPin className="w-6 h-6 text-[#E10600]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-black">
                Entrega Concierge 24/7
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Recepción en pista o terminal VIP de aeropuerto, hoteles 5* Gran Lujo, villas privadas y puertos deportivos.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <Gauge className="w-6 h-6 text-black" />
              <h3 className="text-xs font-black uppercase tracking-wider text-black">
                Hasta 1.015 CV de Potencia
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Motores V12 atmosféricos, V10, V8 Biturbo y Flat-6 revisados bajo estándares oficiales de fabricante.
              </p>
            </div>
          </div>
        </div>

        {/* 2. DESTINOS VIP DE ALQUILER (INTERNAL LINKING HUB POR CIUDAD) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">
                COBERTURA NACIONAL E INTERNACIONAL
              </p>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mt-1">
                Destinos VIP de Alquiler de Coches Deportivos
              </h2>
            </div>
            <Link
              href="/buscar"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black hover:underline"
            >
              <span>Explorar mapa completo</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIP_DESTINATIONS.map((dest) => (
              <Link
                key={dest.city}
                href={dest.href}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-black border border-gray-200 hover:border-black transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black uppercase tracking-tight text-black group-hover:text-white transition-colors">
                      Alquiler Superdeportivos {dest.city}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 group-hover:text-gray-300 font-bold">
                    {dest.tag}
                  </p>
                  <p className="text-xs text-gray-600 group-hover:text-gray-300 leading-relaxed">
                    {dest.desc}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-black group-hover:text-white pt-2 border-t border-gray-200/80 group-hover:border-white/15">
                  Ver disponibilidad en {dest.city} →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. DIRECTORIO POR MARCA OFICIAL (INTERNAL LINKING HUB POR MARCA) */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">
              INGENIERÍA DE COMPETICIÓN
            </p>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mt-1">
              Catálogo Oficial por Fabricante
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {OFFICIAL_BRANDS.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="p-4 rounded-xl border border-gray-200 hover:border-black bg-white hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black">
                    Alquilar {brand.name}
                  </h3>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <p className="text-[10px] font-mono text-gray-500 mt-1 truncate">
                  {brand.sub}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. PREGUNTAS FRECUENTES (FAQ SEMÁNTICO CON DATOS ESTRUCTURADOS) */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">
              RESOLUCIÓN DE DUDAS FRECUENTES
            </p>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mt-1">
              Preguntas Frecuentes sobre el Alquiler de Superdeportivos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HOME_SEO_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2"
              >
                <h3 className="text-sm font-black uppercase tracking-tight text-black">
                  {faq.q}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
