'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import OnboardingTour from '@/components/OnboardingTour';
import { LifeBuoy, Menu, X, Search, BookOpen, ShieldCheck, UserCircle, Compass, Truck } from 'lucide-react';
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
      <div className="bg-[#13322E] text-[#f4efe7] text-[10px] sm:text-[11px] font-semibold tracking-wider py-2 px-3 sm:px-4 text-center leading-tight">
        Dejemos de usar apps de empresas externas, apoyemos el comercio local. Una app de Canarias para Canarias.
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#E9E1D2] px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-between shadow-sm">
        {/* LOGO */}
        <Link href="/" className="group shrink-0">
          <Image
            src="/vaneando-lockup.svg"
            width={240}
            height={60}
            priority
            alt="vaneando — Canarias sobre ruedas"
            className="h-8 sm:h-12 w-auto transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* ENLACES CENTRALES (DESKTOP) */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-black uppercase tracking-wider text-[#13322E]">
          {(role === 'TRAVELER' || role === 'ANONYMOUS') && (
            <Link href="/buscar" className="hover:text-[#16B8AA] transition-colors">
              Campers
            </Link>
          )}
          {role !== 'ADMIN' && (
            <Link href="/guias" className="hover:text-[#16B8AA] transition-colors">
              Blog & Guías
            </Link>
          )}
          {role === 'OWNER' && (
            <Link href="/propietario" className="hover:text-[#16B8AA] transition-colors">
              Panel de propietario
            </Link>
          )}
          {role === 'ADMIN' && (
            <Link href="/admin" className="hover:text-[#16B8AA] transition-colors">
              Administración
            </Link>
          )}
          {role !== 'ADMIN' && (
            <Link href="/seguridad" className="hover:text-[#16B8AA] transition-colors">
              Seguros
            </Link>
          )}
        </div>

        {/* BOTÓN ACCESO Y MENÚ MÓVIL */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {role && role !== 'ANONYMOUS' && role !== 'ADMIN' && (
            <Link
              href="/soporte"
              aria-label="Contactar con soporte"
              title="Contactar con soporte"
              className="flex items-center gap-1.5 rounded-full border border-[#E9E1D2] bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-[#13322E] hover:border-[#16B8AA]"
            >
              <LifeBuoy className="h-4 w-4 text-[#16B8AA]" />
              <span className="hidden lg:inline">Soporte</span>
            </Link>
          )}
          <AuthModal />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir navegación"
            className="rounded-full border border-[#E9E1D2] p-2 text-[#13322E] hover:bg-[#F7F6F2] transition-colors md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5 text-[#16B8AA]" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* MENÚ DESPLEGABLE MÓVIL (MOBILE DRAWER) */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[105px] z-50 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          <div className="bg-white border-b border-[#E9E1D2] p-5 shadow-2xl space-y-3 rounded-b-3xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D2]">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#16B8AA]">
                Navegación Vaneando
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-[#13322E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-2 text-xs font-extrabold text-[#13322E]">
              {(role === 'TRAVELER' || role === 'ANONYMOUS') && (
                <Link
                  onClick={() => setMobileOpen(false)}
                  href="/buscar"
                  className="flex items-center space-x-3 rounded-2xl p-3 bg-[#FAF7F0] border border-[#E9E1D2] hover:border-[#16B8AA]"
                >
                  <Search className="w-4 h-4 text-[#16B8AA]" />
                  <span>Explorar y Buscar Campers</span>
                </Link>
              )}

              {role === 'OWNER' && (
                <Link
                  onClick={() => setMobileOpen(false)}
                  href="/propietario"
                  className="flex items-center space-x-3 rounded-2xl p-3 bg-[#FAF7F0] border border-[#E9E1D2] hover:border-[#16B8AA]"
                >
                  <Truck className="w-4 h-4 text-[#16B8AA]" />
                  <span>Panel de Propietario</span>
                </Link>
              )}

              {role === 'TRAVELER' && (
                <Link
                  onClick={() => setMobileOpen(false)}
                  href="/cuenta"
                  className="flex items-center space-x-3 rounded-2xl p-3 bg-[#FAF7F0] border border-[#E9E1D2]"
                >
                  <Compass className="w-4 h-4 text-[#16B8AA]" />
                  <span>Mis Reservas y Viajes</span>
                </Link>
              )}

              {role !== 'ADMIN' && (
                <>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/guias"
                    className="flex items-center space-x-3 rounded-2xl p-3 hover:bg-[#FAF7F0]"
                  >
                    <BookOpen className="w-4 h-4 text-[#16B8AA]" />
                    <span>Blog & Guías de Canarias</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/seguridad"
                    className="flex items-center space-x-3 rounded-2xl p-3 hover:bg-[#FAF7F0]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#16B8AA]" />
                    <span>Seguros y Garantía</span>
                  </Link>
                </>
              )}

              {role && role !== 'ANONYMOUS' && role !== 'ADMIN' && (
                <Link
                  onClick={() => setMobileOpen(false)}
                  href="/soporte"
                  className="flex items-center space-x-3 rounded-2xl p-3 hover:bg-[#FAF7F0]"
                >
                  <LifeBuoy className="w-4 h-4 text-[#16B8AA]" />
                  <span>Soporte y Atención al Cliente</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {role && role !== 'ANONYMOUS' && role !== 'ADMIN' && <OnboardingTour role={role} />}
    </header>
  );
}
