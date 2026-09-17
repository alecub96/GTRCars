'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, PlusCircle, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileStickyCTA() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Solo mostrar en móvil tras hacer un poco de scroll para no tapar el hero
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // No mostrar en páginas de administración, chat/mensajes, soporte, checkin/checkout o pagos
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/mensajes') ||
    pathname?.startsWith('/soporte') ||
    pathname?.startsWith('/reserva/') ||
    pathname?.startsWith('/checkin') ||
    pathname?.startsWith('/checkout')
  ) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-[#070707]/95 backdrop-blur-xl border-t border-white/10 p-3 shadow-2xl animate-fade-in-up font-mono">
      <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
        <Link
          href="/buscar"
          className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black py-3 px-4 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Explorar Vault</span>
        </Link>

        <Link
          href="/publicar-camper"
          className="inline-flex items-center justify-center space-x-1 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white py-3 px-3.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-xs whitespace-nowrap"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Publicar</span>
        </Link>
      </div>
    </div>
  );
}
