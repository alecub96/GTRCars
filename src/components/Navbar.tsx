'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import OnboardingTour from '@/components/OnboardingTour';
import LanguageSelector from '@/components/LanguageSelector';
import {
  LifeBuoy,
  Menu,
  X,
  Search,
  BookOpen,
  ShieldCheck,
  UserCircle,
  Compass,
  Truck,
  Mail,
  MessageSquare,
  KeyRound,
  RefreshCw,
  LogOut,
  User,
  HeartHandshake,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const fetchUser = () => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setRole(data.user.role);
        } else {
          setUser(null);
          setRole('ANONYMOUS');
        }
      })
      .catch(() => {
        setUser(null);
        setRole('ANONYMOUS');
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Prevenir scroll de fondo cuando el menú móvil esté abierto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setUser(null);
    setRole('ANONYMOUS');
    setMobileOpen(false);
    router.push('/');
    router.refresh();
  };

  const openAuth = (mode: 'login' | 'register') => {
    setMobileOpen(false);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
    }, 60);
  };

  return (
    <header className="w-full relative z-40">
      {/* BARRA SUPERIOR BANNER CON ACCESO DIRECTO DEMO */}
      <div className="bg-[#050505] text-[#D4AF37] text-[10px] font-mono tracking-[0.15em] uppercase py-2 px-3 sm:px-4 flex items-center justify-between border-b border-white/5">
        <span className="hidden sm:inline">GTR CARS // ALQUILER DE SUPERDEPORTIVOS E HYPERCARS EN GRAN CANARIA Y TENERIFE</span>
        <span className="sm:hidden">GTR CARS // HYPERCAR P2P</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuth('login')}
            className="text-[9px] font-bold uppercase text-[#D4AF37] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-3 h-3 text-[#D4AF37]" />
            Acceso Demo
          </button>
        </div>
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="bg-[#090909]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shadow-2xl">
        {/* LOGO OFICIAL GTR CARS */}
        <Link href="/" className="group flex items-center space-x-3">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform bg-black">
            <img
              src="/favicon.png"
              alt="GTR Cars Emblem"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-black text-xl tracking-[0.15em] text-white uppercase block leading-none font-sans">
              GTR CARS<span className="text-[#D4AF37]">.</span>
            </span>
            <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]/80 block mt-0.5">
              CANARY HYPERCAR VAULT
            </span>
          </div>
        </Link>

        {/* ENLACES CENTRALES (DESKTOP) */}
        <div className="hidden md:flex items-center space-x-7 text-xs font-mono font-bold uppercase tracking-wider text-white/80">
          {(role === 'TRAVELER' || role === 'ANONYMOUS') && (
            <Link href="/buscar" className="hover:text-[#D4AF37] transition-colors">
              SUPERDEPORTIVOS
            </Link>
          )}
          {role === 'TRAVELER' && (
            <Link href="/cuenta" className="hover:text-[#D4AF37] transition-colors">
              MIS RESERVAS
            </Link>
          )}
          {(role === 'TRAVELER' || role === 'ANONYMOUS') && (
            <Link href="/publicar-camper" className="rounded-sm bg-[#D4AF37] px-4 py-2 text-black font-black hover:bg-[#F5C542] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              PUBLICAR MI COCHE
            </Link>
          )}
          <Link href="/blog" className="hover:text-[#D4AF37] transition-colors">
            BLOG & RUTAS
          </Link>
          <Link href="/seguridad" className="hover:text-[#D4AF37] transition-colors">
            GARANTÍAS & SEGUROS
          </Link>
          {role === 'OWNER' && (
            <>
              <Link href="/propietario" className="text-[#D4AF37] hover:brightness-110 transition-colors">
                PANEL PROPIETARIO
              </Link>
              <Link href="/publicar-camper" className="rounded-sm bg-[#D4AF37] px-4 py-2 text-black font-black hover:bg-[#F5C542] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                + AÑADIR SUPERCAR
              </Link>
            </>
          )}
          {role === 'ADMIN' && (
            <Link href="/admin" className="hover:text-[#D4AF37] transition-colors">
              ADMINISTRACIÓN
            </Link>
          )}
          <Link href="/contacto" className="hover:text-[#D4AF37] transition-colors">
            CONSERJERÍA 24/7
          </Link>
        </div>

        {/* CONTROLES DERECHA (DESKTOP) */}
        <div className="hidden md:flex items-center space-x-3">
          <LanguageSelector />
          {role && role !== 'ANONYMOUS' && role !== 'ADMIN' && (
            <Link
              href="/soporte"
              aria-label="Contactar con soporte"
              title="Contactar con soporte"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-mono font-bold text-white hover:border-[#D4AF37]/50 hover:bg-white/[0.08] transition-all"
            >
              <LifeBuoy className="h-4 w-4 text-[#D4AF37]" />
              <span>Soporte VIP</span>
            </Link>
          )}
          <AuthModal />
        </div>

        {/* BOTÓN ÚNICO UNIFICADO PARA MÓVIL */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú principal"
            className="flex items-center space-x-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-mono font-bold text-white hover:bg-white/[0.08] transition-all shadow-sm cursor-pointer"
          >
            {user ? (
              <>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black flex items-center justify-center text-[10px] font-black uppercase">
                  {user.firstName ? user.firstName[0] : 'U'}
                </div>
                <span className="font-sans font-bold max-w-[80px] truncate">{user.firstName}</span>
                <Menu className="w-4 h-4 text-white/70" />
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span className="uppercase text-[11px] tracking-wider font-mono font-bold">Menú</span>
                <Menu className="w-4 h-4 text-white/70" />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* MENÚ MÓVIL ÚNICO Y COMPLETO (SLIDE-OVER DRAWER DARK LUXURY) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden animate-in fade-in duration-200 font-sans">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm rounded-l-3xl bg-[#070707] border-l border-white/10 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300 text-white">
            {/* CABECERA DEL MENÚ */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#0f0f12] font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                  GT CARS // VAULT
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENIDO DESPLAZABLE */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* TARJETA DE USUARIO Y CAMBIO DE MODO (SI ESTÁ LOGUEADO) */}
              {user ? (
                <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-4 shadow-xl space-y-3 font-mono">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black flex items-center justify-center text-sm font-black uppercase shadow-sm shrink-0">
                      {user.firstName ? user.firstName[0] : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                        {user.role === 'ADMIN' ? 'Administrador' : user.role === 'OWNER' ? 'Cuenta Propietario' : 'Cuenta Piloto VIP'}
                      </span>
                      <h4 className="font-bold text-sm text-white truncate font-sans">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-[11px] text-white/40 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* ACCESO PARA USUARIOS NO LOGUEADOS */
                <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0f0f12] p-5 shadow-xl space-y-3 font-mono">
                  <span className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-wider block">
                    Acceso Vault & Demostración
                  </span>
                  <p className="text-xs text-white/60 font-normal">
                    Accede a tu cuenta o prueba los paneles con un solo clic:
                  </p>
                  <button
                    onClick={() => openAuth('login')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer"
                  >
                    ACCEDER // IDENTIFICARME
                  </button>
                </div>
              )}

              {/* SECCIÓN MI CUENTA (SI ESTÁ LOGUEADO) */}
              {user && (
                <div className="space-y-2 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] px-2 block">
                    Gestión Personal
                  </span>
                  <div className="grid gap-1 text-xs font-bold text-white/80">
                    {user.role !== 'ADMIN' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/mensajes"
                        className="flex items-center space-x-3 rounded-xl p-3 hover:bg-white/[0.05] transition-colors hover:text-white"
                      >
                        <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                        <span>Mensajería & Vault</span>
                      </Link>
                    )}

                    <Link
                      onClick={() => setMobileOpen(false)}
                      href="/perfil"
                      className="flex items-center space-x-3 rounded-xl p-3 hover:bg-white/[0.05] transition-colors hover:text-white"
                    >
                      <UserCircle className="w-4 h-4 text-[#D4AF37]" />
                      <span>Mi Perfil</span>
                    </Link>

                    {user.role === 'OWNER' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/propietario"
                        className="flex items-center space-x-3 rounded-xl p-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 transition-colors"
                      >
                        <Truck className="w-4 h-4 text-[#D4AF37]" />
                        <span>Panel de Propietario</span>
                      </Link>
                    )}

                    {user.role === 'TRAVELER' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/cuenta"
                        className="flex items-center space-x-3 rounded-xl p-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 transition-colors"
                      >
                        <Compass className="w-4 h-4 text-[#D4AF37]" />
                        <span>Mis Reservas Supercars</span>
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/admin"
                        className="flex items-center space-x-3 rounded-xl p-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 transition-colors"
                      >
                        <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                        <span>Panel de Administración</span>
                      </Link>
                    )}

                    {user.role !== 'OWNER' && user.role !== 'ADMIN' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/verificacion"
                        className="flex items-center space-x-3 rounded-xl p-3 hover:bg-white/[0.05] transition-colors hover:text-white"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        <span>Verificación de Licencia VIP</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* SECCIÓN NAVEGACIÓN GENERAL */}
              <div className="space-y-2 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] px-2 block">
                  Explorar Plataforma
                </span>
                <div className="grid gap-1 text-xs font-bold text-white/80">
                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/buscar"
                    className="flex items-center space-x-3 rounded-xl p-3 hover:bg-white/[0.05] transition-colors hover:text-white"
                  >
                    <Search className="w-4 h-4 text-[#D4AF37]" />
                    <span>Explorar Vault</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/seguridad"
                    className="flex items-center space-x-3 rounded-xl p-3 hover:bg-white/[0.05] transition-colors hover:text-white"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Protocolo de Garantía & Escrow</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/sobre-nosotros"
                    className="flex items-center space-x-3 rounded-xl p-3 hover:bg-white/[0.05] transition-colors hover:text-white"
                  >
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span>Sobre GT Cars</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/contacto"
                    className="flex items-center space-x-3 rounded-xl p-3 hover:bg-white/[0.05] transition-colors hover:text-white"
                  >
                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                    <span>VIP Concierge 24/7</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* PIE DEL MENÚ: CERRAR SESIÓN */}
            {user && (
              <div className="p-4 border-t border-white/10 bg-[#0f0f12]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-950/70 transition-colors font-mono font-bold text-xs cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {role && role !== 'ANONYMOUS' && role !== 'ADMIN' && <OnboardingTour role={role} />}
    </header>
  );
}
