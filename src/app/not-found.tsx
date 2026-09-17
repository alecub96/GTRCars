import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Gauge, MapPin, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <section className="max-w-2xl text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 mx-auto">
            <Gauge className="h-10 w-10" />
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#D4AF37] block">
            ERROR 404 • PÁGINA NO ENCONTRADA
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Esta curva no lleva a ningún superdeportivo
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-md mx-auto leading-relaxed">
            Es posible que el enlace haya expirado, el vehículo esté reservado en el Vault o la dirección haya cambiado.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/"
              className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] px-7 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-black hover:brightness-110 transition-all shadow-lg"
            >
              Volver al Vault Principal
            </Link>
            <Link
              href="/#flota"
              className="rounded-xl border border-white/15 bg-neutral-900 hover:bg-neutral-800 px-7 py-3.5 text-xs font-mono font-bold text-white transition-all"
            >
              Explorar Flota Disponible
            </Link>
          </div>

          {/* DESTINOS POPULARES */}
          <div className="pt-8 border-t border-white/10 max-w-lg mx-auto">
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block mb-3">
              Bases de Custodia y Entrega VIP
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Gran Canaria (LPA)', 'Tenerife Sur (TFS)', 'Costa Adeje', 'Maspalomas'].map((island) => (
                <Link
                  key={island}
                  href={`/buscar?island=${encodeURIComponent(island.split(' ')[0])}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 hover:border-[#D4AF37]/50 text-xs font-mono text-neutral-300 transition-all"
                >
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>{island}</span>
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
