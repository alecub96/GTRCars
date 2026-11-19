'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle2, Search, FileText, ArrowRight, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export default function GraciasPage() {
  useEffect(() => {
    analytics.conversion('thank_you_page_view', { page: '/gracias' });
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center flex flex-col justify-center items-center">
        {/* ICONO DE CONFIRMACIÓN */}
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-black text-white mx-auto shadow-lg">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1.5 rounded-full shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-gray-500 mb-2 block">
          OPERACIÓN CONFIRMADA // CONSERJERÍA GTR CARS
        </span>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4 text-black">
          Hemos recibido tu solicitud
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 font-mono max-w-lg mx-auto leading-relaxed mb-8 font-medium">
          Nuestro equipo de Conserjería VIP 24/7 ya está procesando tu expediente. Recibirás respuesta directa en un plazo máximo de <strong>15 minutos</strong>.
        </p>

        {/* SIGUIENTES PASOS ÚTILES (#66, #67, #100 WEB 250) */}
        <div className="w-full bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8 space-y-4 text-left">
          <h2 className="text-sm font-mono font-black uppercase tracking-wider text-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" />
            Siguientes pasos recomendados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono">
            <Link
              href="/buscar"
              className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-black transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <strong className="block text-xs sm:text-sm text-black font-sans font-black uppercase">
                  Explorar Colección Vault
                </strong>
                <span className="text-[11px] text-gray-500">
                  Ferrari, Porsche, Lamborghini, McLaren
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            <Link
              href="/contrato"
              className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-black transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <strong className="block text-xs sm:text-sm text-black font-sans font-black uppercase">
                  Contrato Digital eIDAS
                </strong>
                <span className="text-[11px] text-gray-500">
                  Revisa las garantías y protocolo de entrega
                </span>
              </div>
              <FileText className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>

          <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-gray-600">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-black" />
              Atención urgente 24/7: <a href="tel:+34900800487" className="font-bold text-black underline">+34 900 800 487</a>
            </span>
            <Link href="/blog" className="font-bold text-black hover:underline">
              Ver Rutas VIP y Experiencias →
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 rounded-full bg-black hover:bg-neutral-800 text-white px-8 py-4 text-xs font-mono font-black uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Volver al Garaje Principal</span>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
