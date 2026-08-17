'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import OnboardingTour from '@/components/OnboardingTour';
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
  KeyRound,
  RefreshCw,
  LogOut,
  User,
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

  const handleMobileSwitchRole = async () => {
    if (!user || switching) return;
    const targetRole = user.role === 'OWNER' ? 'TRAVELER' : 'OWNER';
    setSwitching(true);

    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cambiar de modo');

      setUser(data.user);
      setRole(data.user.role);
      setMobileOpen(false);

      window.dispatchEvent(
        new CustomEvent('role-switched', { detail: { targetRole: data.user.role } })
      );

      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      if (currentPath === '/cuenta' || currentPath === '/propietario') {
        window.location.href = targetRole === 'TRAVELER' ? '/cuenta' : '/propietario';
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error('Error switching role:', err);
    } finally {
      setSwitching(false);
    }
  };

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
            className="h-8 sm:h-11 w-auto transition-transform group-hover:scale-[1.02]"
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

        {/* CONTROLES DERECHA (DESKTOP) */}
        <div className="hidden md:flex items-center space-x-3">
          {role && role !== 'ANONYMOUS' && role !== 'ADMIN' && (
            <Link
              href="/soporte"
              aria-label="Contactar con soporte"
              title="Contactar con soporte"
              className="flex items-center gap-1.5 rounded-full border border-[#E9E1D2] bg-white px-3 py-2 text-xs font-bold text-[#13322E] hover:border-[#16B8AA]"
            >
              <LifeBuoy className="h-4 w-4 text-[#16B8AA]" />
              <span>Soporte</span>
            </Link>
          )}
          <AuthModal />
        </div>

        {/* BOTÓN ÚNICO UNIFICADO PARA MÓVIL */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú principal"
            className="flex items-center space-x-2 rounded-full border border-[#E9E1D2] bg-[#FAF7F0] px-3.5 py-1.5 text-xs font-bold text-[#13322E] hover:bg-[#E9E1D2] transition-all shadow-sm cursor-pointer"
          >
            {user ? (
              <>
                <div className="w-6 h-6 rounded-full bg-[#16B8AA] text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {user.firstName ? user.firstName[0] : 'U'}
                </div>
                <span className="font-extrabold max-w-[80px] truncate">{user.firstName}</span>
                <Menu className="w-4 h-4 text-[#13322E]" />
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-[#16B8AA]" />
                <span className="uppercase text-[11px] tracking-wider font-extrabold">Menú</span>
                <Menu className="w-4 h-4 text-[#13322E]" />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* MENÚ MÓVIL ÚNICO Y COMPLETO (SLIDE-OVER DRAWER) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            {/* CABECERA DEL MENÚ */}
            <div className="px-5 py-4 border-b border-[#E9E1D2] flex items-center justify-between bg-[#FAF7F0]">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#13322E]">
                  Menú Vaneando
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="p-2 rounded-full text-slate-500 hover:text-[#13322E] hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENIDO DESPLAZABLE */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* TARJETA DE USUARIO Y CAMBIO DE MODO (SI ESTÁ LOGUEADO) */}
              {user ? (
                <div className="rounded-3xl border border-[#E9E1D2] bg-[#FAF7F0] p-4 shadow-sm space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#16B8AA] text-white flex items-center justify-center text-sm font-black uppercase shadow-sm shrink-0">
                      {user.firstName ? user.firstName[0] : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#16B8AA] block">
                        {user.role === 'ADMIN' ? 'Administrador' : user.role === 'OWNER' ? 'Modo Propietario Activo' : 'Modo Viajero Activo'}
                      </span>
                      <h4 className="font-bold text-sm text-[#13322E] truncate">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-[11px] text-[#6B726E] truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* BOTÓN PRINCIPAL DE CAMBIO DE MODO EN MÓVIL */}
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={handleMobileSwitchRole}
                      disabled={switching}
                      className="w-full py-2.5 px-3.5 rounded-2xl bg-[#13322E] text-white font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-md hover:bg-[#0F766E] transition-all cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-2">
                        <RefreshCw className={`w-3.5 h-3.5 text-[#16B8AA] ${switching ? 'animate-spin' : ''}`} />
                        <span>{user.role === 'OWNER' ? 'Pasar a Modo Viajero' : 'Pasar a Modo Propietario'}</span>
                      </div>
                      <span className="text-[10px] text-[#16B8AA] font-extrabold">CAMBIAR</span>
                    </button>
                  )}
                </div>
              ) : (
                /* ACCESO PARA USUARIOS NO LOGUEADOS */
                <div className="rounded-3xl border border-[#E9E1D2] bg-[#FAF7F0] p-5 text-center shadow-sm space-y-3">
                  <p className="text-xs text-[#6B726E] font-medium">
                    Accede a tu cuenta o regístrate para gestionar tus viajes y campers.
                  </p>
                  <button
                    onClick={() => openAuth('login')}
                    className="w-full py-3 rounded-full bg-[#16B8AA] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-md cursor-pointer"
                  >
                    Iniciar Sesión / Registrarse
                  </button>
                </div>
              )}

              {/* SECCIÓN MI CUENTA (SI ESTÁ LOGUEADO) */}
              {user && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B726E] px-2 block">
                    Gestión Personal
                  </span>
                  <div className="grid gap-1 text-xs font-bold text-[#13322E]">
                    {user.role !== 'ADMIN' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/mensajes"
                        className="flex items-center space-x-3 rounded-2xl p-3 hover:bg-[#FAF7F0] transition-colors"
                      >
                        <Mail className="w-4 h-4 text-[#16B8AA]" />
                        <span>Mensajes de reservas</span>
                      </Link>
                    )}

                    <Link
                      onClick={() => setMobileOpen(false)}
                      href="/perfil"
                      className="flex items-center space-x-3 rounded-2xl p-3 hover:bg-[#FAF7F0] transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-[#16B8AA]" />
                      <span>Mi perfil</span>
                    </Link>

                    {user.role === 'OWNER' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/propietario"
                        className="flex items-center space-x-3 rounded-2xl p-3 bg-teal-50/60 text-[#0F766E] border border-teal-100 transition-colors"
                      >
                        <Truck className="w-4 h-4 text-[#16B8AA]" />
                        <span>Panel de Propietario</span>
                      </Link>
                    )}

                    {user.role === 'TRAVELER' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/cuenta"
                        className="flex items-center space-x-3 rounded-2xl p-3 bg-teal-50/60 text-[#0F766E] border border-teal-100 transition-colors"
                      >
                        <Compass className="w-4 h-4 text-[#16B8AA]" />
                        <span>Mis reservas y viajes</span>
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/admin"
                        className="flex items-center space-x-3 rounded-2xl p-3 bg-amber-50 text-amber-900 border border-amber-200 transition-colors"
                      >
                        <KeyRound className="w-4 h-4 text-[#D97706]" />
                        <span>Panel de Administración</span>
                      </Link>
                    )}

                    {user.role !== 'OWNER' && user.role !== 'ADMIN' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/verificacion"
                        className="flex items-center space-x-3 rounded-2xl p-3 hover:bg-[#FAF7F0] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#16B8AA]" />
                        <span>Verificación de Licencia</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* SECCIÓN NAVEGACIÓN GENERAL */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B726E] px-2 block">
                  Explorar Vaneando
                </span>
                <div className="grid gap-1 text-xs font-extrabold text-[#13322E]">
                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/buscar"
                    className="flex items-center space-x-3 rounded-2xl p-3 hover:bg-[#FAF7F0] transition-colors"
                  >
                    <Search className="w-4 h-4 text-[#16B8AA]" />
                    <span>Explorar Campers</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/guias"
                    className="flex items-center space-x-3 rounded-2xl p-3 hover:bg-[#FAF7F0] transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-[#16B8AA]" />
                    <span>Blog & Guías de Canarias</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/seguridad"
                    className="flex items-center space-x-3 rounded-2xl p-3 hover:bg-[#FAF7F0] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#16B8AA]" />
                    <span>Seguros y Garantía</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/soporte"
                    className="flex items-center space-x-3 rounded-2xl p-3 hover:bg-[#FAF7F0] transition-colors"
                  >
                    <LifeBuoy className="w-4 h-4 text-[#16B8AA]" />
                    <span>Soporte y Atención al Cliente</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* PIE DEL MENÚ: CERRAR SESIÓN */}
            {user && (
              <div className="p-4 border-t border-[#E9E1D2] bg-white">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 p-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-bold text-xs cursor-pointer"
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
