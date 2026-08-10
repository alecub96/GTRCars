import React from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  return (
    <header className="w-full relative z-40">
      {/* BARRA SUPERIOR BANNER */}
      <div className="bg-[#172725] text-[#f4efe7] text-[10px] font-semibold uppercase tracking-[0.28em] py-2.5 px-4 text-center">
        Tu isla. Tu ruta. Tu camper.
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 flex items-center justify-center group-hover:scale-105 transition-transform" aria-label="Monograma vaneando">
            <img src="/monograma-vaneando-transparente.png" alt="Monograma vaneando" className="w-11 h-11 object-contain" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#0F172A] block leading-none">
              vaneando<span className="text-[#b88a55]">.</span>
            </span>
            <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-[#14B8A6] block font-black mt-0.5">
              Canarias sobre ruedas
            </span>
          </div>
        </Link>

        {/* ENLACES CENTRALES */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-black uppercase tracking-wider text-[#0F172A]">
          <Link href="/buscar" className="hover:text-[#14B8A6] transition-colors">
            Campers
          </Link>
          <Link href="/guias" className="hover:text-[#14B8A6] transition-colors">
            Blog & Guías
          </Link>
          <Link href="/publicar-camper" className="hover:text-[#14B8A6] transition-colors">
            Propietarios
          </Link>
          <Link href="/seguridad" className="hover:text-[#14B8A6] transition-colors">
            Seguros
          </Link>
        </div>

        {/* BOTÓN ACCESO */}
        <div className="flex items-center space-x-3">
          <AuthModal />
        </div>
      </nav>
    </header>
  );
}
