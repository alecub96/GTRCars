'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => setRole(data.user?.role || 'ANONYMOUS'))
      .catch(() => setRole('ANONYMOUS'));
  }, []);

  return (
    <header className="w-full relative z-40">
      {/* BARRA SUPERIOR BANNER */}
      <div className="bg-[#13322E] text-[#f4efe7] text-[10px] font-semibold uppercase tracking-[0.28em] py-2.5 px-4 text-center">
        Tu isla. Tu ruta. Tu camper.
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#E9E1D2] px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        {/* LOGO */}
        <Link href="/" className="group">
          <img src="/vaneando-lockup.svg" alt="vaneando — Canarias sobre ruedas" className="h-12 w-auto transition-transform group-hover:scale-[1.02] sm:h-14" />
        </Link>

        {/* ENLACES CENTRALES */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-black uppercase tracking-wider text-[#13322E]">
          {(role === 'TRAVELER' || role === 'ANONYMOUS' || role === null) && (
            <Link href="/buscar" className="hover:text-[#16B8AA] transition-colors">
              Campers
            </Link>
          )}
          <Link href="/guias" className="hover:text-[#16B8AA] transition-colors">
            Blog & Guías
          </Link>
          {role === 'OWNER' && (
            <Link href="/propietario" className="hover:text-[#16B8AA] transition-colors">
              Propietarios
            </Link>
          )}
          {role === 'ADMIN' && (
            <Link href="/admin" className="hover:text-[#16B8AA] transition-colors">
              Administración
            </Link>
          )}
          <Link href="/seguridad" className="hover:text-[#16B8AA] transition-colors">
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
