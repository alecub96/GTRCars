'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
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
  FileText,
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
    <header className="w-full relative z-40 bg-white border-b border-gray-100">
      {/* NAVEGACIÓN PRINCIPAL LIMPIA ESTILO PORSCHE (FONDO BLANCO) */}
      <nav className="bg-white px-4 sm:px-10 py-3 sm:py-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* LOGO OFICIAL GTR CARS */}
        <Link href="/" className="group flex items-center py-0.5">
          <Image
            src="/brand/logo-primary.png"
            alt="GTR Cars"
            width={240}
            height={60}
            className="h-8 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            priority
            unoptimized
          />
        </Link>

        {/* ENLACES CENTRALES ESTILO PORSCHE (NEGRO/GRIS) */}
        <div className="hidden md:flex items-center space-x-6 text-xs font-mono font-bold tracking-widest text-gray-700">
          <Link href="/buscar" className="hover:text-black transition-colors flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-black" />
            <span>BUSCADOR</span>
          </Link>

          {/* SÓLO PARA MODO PILOTO VIP O ANÓNIMO */}
          {role !== 'OWNER' && (
            <>
              <Link href="/buscar" className="hover:text-black transition-colors">
                SUPERDEPORTIVOS
              </Link>
              {role === 'TRAVELER' && (
                <Link href="/cuenta" className="hover:text-black transition-colors">
                  MIS RESERVAS
                </Link>
              )}
            </>
          )}

          {/* SÓLO PARA USUARIO ANÓNIMO O PROPIETARIO */}
          {role === 'ANONYMOUS' && (
            <Link href="/publicar-coche" className="px-4 py-1.5 rounded-full border border-black text-black hover:bg-black hover:text-white transition-all font-bold">
              PUBLICAR MI COCHE
            </Link>
          )}

          {role === 'OWNER' && (
            <>
              <Link href="/propietario" className="text-black font-bold hover:text-gray-600 transition-colors">
                PANEL PROPIETARIO
              </Link>
              <Link href="/publicar-coche" className="px-4 py-1.5 rounded-full bg-black text-white font-bold hover:bg-neutral-800 transition-all">
                + AÑADIR VEHÍCULO
              </Link>
            </>
          )}

          <Link href="/blog" className="hover:text-black transition-colors">
            EXPERIENCIAS
          </Link>
          <Link href="/contrato" className="hover:text-black transition-colors flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-black" />
            <span>CONTRATO DIGITAL</span>
          </Link>
          <Link href="/seguridad" className="hover:text-black transition-colors">
            GARANTÍAS
          </Link>
          {role === 'ADMIN' && (
            <Link href="/admin" className="hover:text-black transition-colors">
              ADMINISTRACIÓN
            </Link>
          )}
          <Link href="/contacto" className="hover:text-black transition-colors">
            CONSERJERÍA
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
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-mono font-bold text-black hover:border-black hover:bg-gray-100 transition-all"
            >
              <LifeBuoy className="h-4 w-4 text-black" />
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
            className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-mono font-bold text-black hover:bg-gray-100 transition-all shadow-xs cursor-pointer"
          >
            {user ? (
              <>
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {user.firstName ? user.firstName[0] : 'U'}
                </div>
                <span className="font-sans font-bold max-w-[80px] truncate text-black">{user.firstName}</span>
                <Menu className="w-4 h-4 text-gray-700" />
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-black" />
                <span className="uppercase text-[11px] tracking-wider font-mono font-bold text-black">Menú</span>
                <Menu className="w-4 h-4 text-gray-700" />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* MENÚ MÓVIL ÚNICO Y COMPLETO (SLIDE-OVER DRAWER BLANCO PORSCHE) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden animate-in fade-in duration-200 font-sans">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm rounded-l-3xl bg-white border-l border-gray-200 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300 text-black">
            {/* CABECERA DEL MENÚ */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 font-mono">
              <div className="flex items-center space-x-2.5">
                <Image
                  src="/brand/isotype.png"
                  alt="GTR Cars"
                  width={30}
                  height={18}
                  className="h-5 w-auto object-contain"
                  unoptimized
                />
                <span className="text-xs font-black uppercase tracking-widest text-black">
                  GTR CARS // GARAJE
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENIDO DESPLAZABLE */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* TARJETA DE USUARIO Y CAMBIO DE MODO (SI ESTÁ LOGUEADO) */}
              {user ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-xs space-y-3 font-mono">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-black uppercase shadow-xs shrink-0">
                      {user.firstName ? user.firstName[0] : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 block">
                        {user.role === 'ADMIN' ? 'Administrador' : user.role === 'OWNER' ? 'Cuenta Propietario' : 'Cuenta Piloto VIP'}
                      </span>
                      <h4 className="font-bold text-sm text-black truncate font-sans">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* ACCESO PARA USUARIOS NO LOGUEADOS */
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-xs space-y-3 font-mono">
                  <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">
                    Acceso Garaje
                  </span>
                  <p className="text-xs text-gray-600 font-normal">
                    Accede a tu cuenta o prueba los paneles con un solo clic:
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openAuth('login')}
                      className="w-full py-3 rounded-full bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md cursor-pointer"
                    >
                      ACCEDER // IDENTIFICARME
                    </button>
                    <Link
                      onClick={() => setMobileOpen(false)}
                      href="/registro"
                      className="w-full py-2.5 rounded-full border border-gray-300 text-black font-black text-xs uppercase tracking-widest text-center hover:bg-gray-100 transition-all"
                    >
                      CREAR CUENTA (PILOTO O PROPIETARIO)
                    </Link>
                  </div>
                </div>
              )}

              {/* SECCIÓN PANELES DE USUARIO */}
              {user && (
                <div className="space-y-2 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-2 block">
                    Gestión Personal
                  </span>
                  <div className="grid gap-1 text-xs font-bold text-gray-700">
                    {user.role !== 'ADMIN' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/mensajes"
                        className="flex items-center space-x-3 rounded-xl p-3 hover:bg-gray-100 transition-colors hover:text-black"
                      >
                        <MessageSquare className="w-4 h-4 text-black" />
                        <span>Mensajería & Garaje</span>
                      </Link>
                    )}

                    <Link
                      onClick={() => setMobileOpen(false)}
                      href="/perfil"
                      className="flex items-center space-x-3 rounded-xl p-3 hover:bg-gray-100 transition-colors hover:text-black"
                    >
                      <UserCircle className="w-4 h-4 text-black" />
                      <span>Mi Perfil</span>
                    </Link>

                    {user.role === 'OWNER' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/propietario"
                        className="flex items-center space-x-3 rounded-xl p-3 bg-gray-100 text-black border border-gray-200 transition-colors"
                      >
                        <Truck className="w-4 h-4 text-black" />
                        <span>Panel de Propietario</span>
                      </Link>
                    )}

                    {user.role === 'TRAVELER' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/cuenta"
                        className="flex items-center space-x-3 rounded-xl p-3 bg-gray-100 text-black border border-gray-200 transition-colors"
                      >
                        <Compass className="w-4 h-4 text-black" />
                        <span>Mis Reservas Supercars</span>
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/admin"
                        className="flex items-center space-x-3 rounded-xl p-3 bg-gray-100 text-black border border-gray-200 transition-colors"
                      >
                        <KeyRound className="w-4 h-4 text-black" />
                        <span>Panel de Administración</span>
                      </Link>
                    )}

                    {user.role !== 'OWNER' && user.role !== 'ADMIN' && (
                      <Link
                        onClick={() => setMobileOpen(false)}
                        href="/verificacion"
                        className="flex items-center space-x-3 rounded-xl p-3 hover:bg-gray-100 transition-colors hover:text-black"
                      >
                        <ShieldCheck className="w-4 h-4 text-black" />
                        <span>Verificación de Licencia VIP</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* SECCIÓN NAVEGACIÓN GENERAL */}
              <div className="space-y-2 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-2 block">
                  Explorar Plataforma
                </span>
                <div className="grid gap-1 text-xs font-bold text-gray-700">
                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/buscar"
                    className="flex items-center space-x-3 rounded-xl p-3 hover:bg-gray-100 transition-colors hover:text-black"
                  >
                    <Search className="w-4 h-4 text-black" />
                    <span>Explorar Garaje</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/contrato"
                    className="flex items-center space-x-3 rounded-xl p-3 hover:bg-gray-100 transition-colors hover:text-black"
                  >
                    <FileText className="w-4 h-4 text-black" />
                    <span>Generador de Contrato Digital</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/seguridad"
                    className="flex items-center space-x-3 rounded-xl p-3 hover:bg-gray-100 transition-colors hover:text-black"
                  >
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>Protocolo de Garantía & Pagos</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/sobre-nosotros"
                    className="flex items-center space-x-3 rounded-xl p-3 hover:bg-gray-100 transition-colors hover:text-black"
                  >
                    <User className="w-4 h-4 text-black" />
                    <span>Sobre GTRCars</span>
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    href="/contacto"
                    className="flex items-center space-x-3 rounded-xl p-3 hover:bg-gray-100 transition-colors hover:text-black"
                  >
                    <Mail className="w-4 h-4 text-black" />
                    <span>Concierge 24/7</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* PIE DEL MENÚ: CERRAR SESIÓN */}
            {user && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 p-3 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-mono font-bold text-xs cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
