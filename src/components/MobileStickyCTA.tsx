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

  // No mostrar en páginas de administración, checkin/checkout o pagos
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/reserva/') ||
    pathname?.startsWith('/checkin') ||
    pathname?.startsWith('/checkout')
  ) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#E9E1D2] p-3 shadow-2xl animate-fade-in-up">
      <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
        <Link
          href="/buscar"
          className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] text-white py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider shadow-md active:scale-95 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Buscar Campers</span>
        </Link>

        <Link
          href="/publicar-camper"
          className="inline-flex items-center justify-center space-x-1 rounded-full border border-[#13322E] bg-[#FAF7F0] hover:bg-[#13322E] hover:text-white text-[#13322E] py-2.5 px-3.5 text-xs font-bold transition-all active:scale-95 shadow-xs whitespace-nowrap"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Publicar</span>
        </Link>
      </div>
    </div>
  );
}
