'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import OnboardingTour from '@/components/OnboardingTour';
import { LifeBuoy, Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => setRole(data.user?.role || 'ANONYMOUS'))
      .catch(() => setRole('ANONYMOUS'));
  }, []);

  return (
    <header className="w-full relative z-40">
      {/* BARRA SUPERIOR BANNER */}
      <div className="bg-[#13322E] text-[#f4efe7] text-[10px] font-semibold tracking-[0.12em] py-2.5 px-4 text-center">
        Dejemos de usar apps de empresas externas, apoyemos el comercio local. Una app de Canarias para Canarias.
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#E9E1D2] px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        {/* LOGO */}
        <Link href="/" className="group">
          <Image src="/vaneando-lockup.svg" width={260} height={72} priority alt="vaneando — Canarias sobre ruedas" className="h-12 w-auto transition-transform group-hover:scale-[1.02] sm:h-14" />
        </Link>

        {/* ENLACES CENTRALES */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-black uppercase tracking-wider text-[#13322E]">
          {(role === 'TRAVELER' || role === 'ANONYMOUS') && (
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
          {role && role !== 'ANONYMOUS' && <Link href="/soporte" aria-label="Contactar con soporte" title="Contactar con soporte" className="flex items-center gap-2 rounded-full border border-[#E9E1D2] bg-white px-3 py-2 text-xs font-bold text-[#13322E] hover:border-[#16B8AA]"><LifeBuoy className="h-4 w-4 text-[#16B8AA]" /><span className="hidden lg:inline">Soporte</span></Link>}
          <AuthModal />
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir navegación" className="rounded-full border border-[#E9E1D2] p-2 text-[#13322E] md:hidden">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </nav>
      {mobileOpen && <div className="absolute left-0 right-0 z-50 border-b border-[#E9E1D2] bg-white p-4 shadow-xl md:hidden"><div className="grid gap-2 text-sm font-bold">{(role === 'TRAVELER' || role === 'ANONYMOUS') && <Link onClick={() => setMobileOpen(false)} href="/buscar" className="rounded-xl p-3 hover:bg-[#F7F6F2]">Buscar campers</Link>}{role === 'OWNER' && <Link onClick={() => setMobileOpen(false)} href="/propietario" className="rounded-xl p-3 hover:bg-[#F7F6F2]">Panel de propietario</Link>}{role === 'ADMIN' && <Link onClick={() => setMobileOpen(false)} href="/admin" className="rounded-xl p-3 hover:bg-[#F7F6F2]">Administración</Link>}<Link onClick={() => setMobileOpen(false)} href="/guias" className="rounded-xl p-3 hover:bg-[#F7F6F2]">Blog y guías</Link><Link onClick={() => setMobileOpen(false)} href="/seguridad" className="rounded-xl p-3 hover:bg-[#F7F6F2]">Seguridad y seguros</Link>{role && role !== 'ANONYMOUS' && <Link onClick={() => setMobileOpen(false)} href="/soporte" className="rounded-xl p-3 hover:bg-[#F7F6F2]">Contactar con soporte</Link>}</div></div>}
      {role && role !== 'ANONYMOUS' && <OnboardingTour role={role} />}
    </header>
  );
}
