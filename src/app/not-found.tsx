import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Gauge, MapPin, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <section className="max-w-2xl text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-black border border-gray-200 mx-auto">
            <Gauge className="h-10 w-10" />
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gray-500 block">
            ERROR 404 • PÁGINA NO ENCONTRADA
          </span>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black font-sans">
            Esta curva no lleva a ningún superdeportivo
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 font-mono max-w-md mx-auto leading-relaxed">
            Es posible que el enlace haya expirado, el vehículo haya cambiado de titularidad o la dirección haya sido reubicada.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/"
              className="rounded-xl bg-black px-7 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all shadow-sm"
            >
              Volver al Garaje Principal
            </Link>
            <Link
              href="/buscar"
              className="rounded-xl border border-gray-300 bg-white hover:bg-gray-50 px-7 py-3.5 text-xs font-mono font-bold text-black transition-all shadow-sm"
            >
              Explorar Colección Disponible
            </Link>
          </div>

          {/* DESTINOS POPULARES */}
          <div className="pt-8 border-t border-gray-200 max-w-lg mx-auto">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-3">
              Bases de Custodia y Entrega VIP
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Madrid (MAD)', 'Barcelona (BCN)', 'Gran Canaria (LPA)', 'Tenerife Sur (TFS)', 'Londres (LHR)'].map((base) => (
                <Link
                  key={base}
                  href={`/buscar?city=${encodeURIComponent(base.split(' ')[0])}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 hover:border-black text-xs font-mono text-gray-700 transition-all font-bold"
                >
                  <MapPin className="w-3 h-3 text-black" />
                  <span>{base}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
