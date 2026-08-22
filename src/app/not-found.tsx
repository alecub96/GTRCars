import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Compass, Search, MapPin, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <section className="max-w-2xl text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#16B8AA]/10 text-[#16B8AA] mx-auto animate-float">
            <Compass className="h-10 w-10" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#D97706] block">
            ERROR 404 • PÁGINA NO ENCONTRADA
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Esta carretera no lleva a ninguna camper
          </h1>

          <p className="text-sm sm:text-base text-[#6B726E] max-w-md mx-auto leading-relaxed">
            Es posible que el enlace haya caducado, la camper haya cambiado de dirección o la página se haya movido.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/"
              className="rounded-full bg-[#13322E] hover:bg-[#16B8AA] px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white transition-all shadow-md active:scale-95"
            >
              Volver al Inicio
            </Link>
            <Link
              href="/buscar"
              className="rounded-full border border-[#E9E1D2] bg-white hover:bg-[#FAF7F0] px-7 py-3.5 text-xs font-bold text-[#13322E] transition-all shadow-xs"
            >
              Explorar Campers en Canarias
            </Link>
          </div>

          {/* DESTINOS POPULARES */}
          <div className="pt-8 border-t border-[#E9E1D2] max-w-lg mx-auto">
            <span className="text-xs font-bold text-[#6B726E] uppercase tracking-wider block mb-3">
              Destinos Populares en las Islas
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Gran Canaria', 'Tenerife', 'Fuerteventura', 'Lanzarote', 'La Palma'].map((island) => (
                <Link
                  key={island}
                  href={`/buscar?island=${encodeURIComponent(island)}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#E9E1D2] hover:border-[#16B8AA] text-xs font-bold text-[#13322E] transition-all shadow-2xs"
                >
                  <MapPin className="w-3 h-3 text-[#16B8AA]" />
                  <span>{island}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
