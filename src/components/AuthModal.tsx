'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, X, LogIn, UserPlus, LogOut, ShieldCheck, Truck, KeyRound, RefreshCw, Compass, Mail, UserCircle, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { analytics } from '@/lib/analytics';

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [role, setRole] = useState<'TRAVELER' | 'OWNER'>('TRAVELER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [roleNotice, setRoleNotice] = useState<'TRAVELER' | 'OWNER' | null>(null);
  const [switchError, setSwitchError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [customSubtitle, setCustomSubtitle] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  useEffect(() => { if (isOpen && mode === 'register') analytics.track(role === 'OWNER' ? 'owner_registration_start' : 'registration_start'); }, [isOpen, mode, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const isForgotPassword = mode === 'forgot';
      const res = await fetch(isForgotPassword ? '/api/auth/password-reset/request' : '/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isForgotPassword
          ? { email }
          : { action: mode, email, password, firstName, lastName, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        const message = data.debug ? `${data.error || 'Ocurrió un error'} (${data.debug})` : (data.error || 'Ocurrió un error');
        throw new Error(message);
      }

      if (isForgotPassword) {
        setSuccessMessage(data.message);
        return;
      }

      setUser(data.user);
      analytics.track(mode === 'register' && role === 'OWNER' ? 'owner_registration_success' : mode === 'register' ? 'registration_success' : 'login_success');
      if (mode === 'register') analytics.conversion('conversion', { conversion_type: 'registration' });
      setIsOpen(false);

      // Comprobar si el usuario tenía una reserva en curso antes de identificarse
      if (typeof window !== 'undefined') {
        const pendingStr = sessionStorage.getItem('pending_booking');
        if (pendingStr) {
          try {
            const pending = JSON.parse(pendingStr);
            sessionStorage.removeItem('pending_booking');
            const bookRes = await fetch('/api/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                vehicleId: pending.vehicleId,
                startDate: pending.startDate,
                endDate: pending.endDate,
                selectedExtraIds: pending.selectedExtraIds,
              }),
            });
            const bookData = await bookRes.json();
            if (bookRes.ok && bookData?.booking?.id) {
              window.location.href = `/reserva/${bookData.booking.id}`;
              return;
            }
          } catch (e) {
            console.error('Error auto-procesando reserva pendiente:', e);
          }
        }
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'owner' | 'client') => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: type === 'owner' ? 'demo-owner' : 'demo-client' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al acceder en modo demo');

      setUser(data.user);
      setIsOpen(false);
      if (type === 'owner') {
        window.location.href = '/propietario';
      } else {
        window.location.href = '/cuenta';
      }
    } catch (err: any) {
      setError(err.message || 'Error en acceso demo');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setUser(null);
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      if (e.detail?.mode) setMode(e.detail.mode);
      if (e.detail?.subtitle) setCustomSubtitle(e.detail.subtitle);
      else setCustomSubtitle(null);
      setIsOpen(true);
    };

    const handleRoleSwitched = (e: any) => {
      if (e.detail?.targetRole) {
        setRoleNotice(e.detail.targetRole);
      }
    };

    window.addEventListener('open-auth-modal', handleOpenModal);
    window.addEventListener('role-switched', handleRoleSwitched);
    return () => {
      window.removeEventListener('open-auth-modal', handleOpenModal);
      window.removeEventListener('role-switched', handleRoleSwitched);
    };
  }, []);

  useEffect(() => {
    if (roleNotice) {
      const timer = setTimeout(() => setRoleNotice(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [roleNotice]);

  return (
    <>
      {roleNotice && (
        <div className="fixed top-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-[999999] pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300 font-sans">
          <div className="rounded-2xl sm:rounded-3xl bg-white text-black border-gray-200 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-gray-200 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gray-100 text-black border border-gray-200">
                <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="flex-1 min-w-0 font-mono">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black block">
                  Protocolo Actualizado
                </span>
                <h3 className="text-sm sm:text-base font-bold text-black tracking-tight truncate font-sans">
                  Ahora en modo {roleNotice === 'OWNER' ? 'propietario' : 'conductor VIP'}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 truncate mt-0.5">
                  {roleNotice === 'OWNER'
                    ? 'Gestiona tus superdeportivos, disponibilidad y finanzas.'
                    : 'Explora el Vault de superdeportivos y gestiona tus reservas.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRoleNotice(null)}
              className="p-1.5 rounded-full text-gray-400 hover:text-black shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {user ? (
        /* MENÚ DESPLEGABLE DE PERFIL PARA ESCRITORIO (ESTILO CLARO MINIMALISTA PORSCHE) */
        <div className="relative hidden md:inline-block font-mono">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-full bg-white text-black border border-gray-200 hover:border-black hover:bg-gray-50 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-black text-black flex items-center justify-center text-[10px] font-black uppercase shrink-0">
              {user.firstName ? user.firstName[0] : 'U'}
            </div>
            <span className="hidden sm:inline font-sans text-xs font-bold text-black">{user.firstName}</span>
            <span className="hidden sm:inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100 text-black border border-gray-300">
              {user.role === 'ADMIN' ? 'Admin' : user.role === 'OWNER' ? 'Propietario' : 'Piloto VIP'}
            </span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-3xl shadow-2xl p-5 z-[9999] text-black animate-fade-in font-sans">
              <div className="border-b border-gray-100 pb-3 mb-3 px-1 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {user.role === 'ADMIN' ? 'Administrador' : user.role === 'OWNER' ? 'Cuenta Propietario' : 'Cuenta Piloto VIP'}
                </span>
                <p className="font-bold text-sm text-black truncate font-sans">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>

              <div className="space-y-1 text-xs font-mono text-gray-700">
                {user.role !== 'ADMIN' && (
                  <Link
                    href="/mensajes"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-800 hover:text-black font-medium"
                  >
                    <MessageSquare className="w-4 h-4 text-black" />
                    <span>Mensajería & Garaje</span>
                  </Link>
                )}

                <Link
                  href="/perfil"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-800 hover:text-black font-medium"
                >
                  <UserCircle className="w-4 h-4 text-black" />
                  <span>Mi Perfil</span>
                </Link>

                {user.role === 'TRAVELER' && (
                  <Link
                    href="/cuenta"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-800 hover:text-black font-medium"
                  >
                    <Compass className="w-4 h-4 text-black" />
                    <span>Mis Reservas Supercars</span>
                  </Link>
                )}

                {user.role === 'OWNER' && (
                  <Link
                    href="/propietario"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-800 hover:text-black font-medium"
                  >
                    <Truck className="w-4 h-4 text-black" />
                    <span>Panel de Propietario</span>
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-800 hover:text-black font-medium"
                  >
                    <KeyRound className="w-4 h-4 text-black" />
                    <span>Panel de Administración</span>
                  </Link>
                )}

                {user.role !== 'OWNER' && user.role !== 'ADMIN' && (
                  <Link
                    href="/verificacion"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-800 hover:text-black font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>Verificación de Licencia VIP</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors text-left font-mono font-bold border-t border-gray-100 mt-2 pt-3 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* BOTÓN Y MODAL DE INICIO DE SESIÓN / REGISTRO (DARK LUXURY) */
        <>
          <button
            onClick={() => { setMode('login'); setIsOpen(true); }}
            className="hidden md:inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 rounded-full bg-black text-black hover:bg-gray-800 transition-all shadow-md cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>ACCESO // GARAJE</span>
          </button>

          {isOpen && mounted && createPortal(
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[999999] overflow-y-auto bg-black/50 backdrop-blur-xs p-4 sm:p-6 flex min-h-full items-center justify-center cursor-pointer font-sans"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in my-auto text-left cursor-default text-black"
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* LOGO DE MARCA */}
                <div className="flex items-center space-x-3 mb-6">
                  <Image
                    src="/brand/isotype-transparent.png"
                    alt="GTR Cars"
                    width={38}
                    height={23}
                    className="h-6 w-auto object-contain"
                  />
                  <div>
                    <span className="text-sm font-black tracking-widest uppercase font-sans text-black block leading-none">
                      GTR CARS
                    </span>
                    <span className="text-[8px] font-mono tracking-widest text-gray-400 uppercase">
                      PEER-TO-PEER SPORTS CAR RENTAL
                    </span>
                  </div>
                </div>

                {/* ACCESO DEMO DIRECTO 1-CLICK */}
                <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-black flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-black" />
                      Accesos Rápidos Demo
                    </span>
                    <span className="text-[9px] font-mono text-gray-400 uppercase">Sin contraseña</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Prueba la experiencia completa con cuentas preconfiguradas de rol único:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('owner')}
                      disabled={loading}
                      className="group p-3 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 hover:border-black text-left transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-gray-500">Propietario Demo</span>
                        <Truck className="w-3.5 h-3.5 text-black" />
                      </div>
                      <p className="text-xs font-bold text-black transition-colors">Carlos M.</p>
                      <p className="text-[10px] text-gray-500 truncate">Flota Revuelto, SF90 & GT3 RS</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDemoLogin('client')}
                      disabled={loading}
                      className="group p-3 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 hover:border-black text-left transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-gray-500">Piloto VIP Demo</span>
                        <Compass className="w-3.5 h-3.5 text-black" />
                      </div>
                      <p className="text-xs font-bold text-black transition-colors">Alejandro B.</p>
                      <p className="text-[10px] text-gray-500 truncate">Reservas activas & Favoritos</p>
                    </button>
                  </div>
                </div>

                {/* PESTAÑAS DE REGISTRO E INICIO DE SESIÓN */}
                <div className="flex border-b border-gray-200 mb-6 font-mono">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
                      mode === 'login'
                        ? 'border-black text-black font-black'
                        : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setError(''); setSuccessMessage(''); }}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
                      mode === 'register'
                        ? 'border-black text-black font-black'
                        : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                  >
                    Registrar Cuenta
                  </button>
                </div>

                {customSubtitle && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-black text-xs font-mono flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-black shrink-0" />
                    <span>{customSubtitle}</span>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono text-center">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono text-center">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 font-mono">
                  {mode === 'register' && (
                    <>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => setRole('TRAVELER')}
                          className={`py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                            role === 'TRAVELER'
                              ? 'bg-black text-black border-black font-black'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                          }`}
                        >
                          Piloto VIP
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('OWNER')}
                          className={`py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                            role === 'OWNER'
                              ? 'bg-black text-black border-black font-black'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                          }`}
                        >
                          Propietario
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Nombre</label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-black text-sm font-sans focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Apellidos</label>
                          <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-black text-sm font-sans focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="piloto@gtrcars.es"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-black text-sm font-sans placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  {mode !== 'forgot' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Contraseña</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-black text-sm font-sans focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-black text-black font-mono font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md mt-3 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{loading ? 'AUTENTICANDO...' : mode === 'login' ? 'INICIAR SESIÓN' : mode === 'register' ? 'REGISTRARME EN GARAJE' : 'ENVIAR ENLACE'}</span>
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-500 font-mono">
                  {mode === 'login' && (
                    <button onClick={() => { setMode('forgot'); setError(''); setSuccessMessage(''); }} className="font-bold text-black hover:underline cursor-pointer">
                      ¿Has olvidado tu contraseña?
                    </button>
                  )}
                  {mode === 'forgot' && (
                    <button onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }} className="font-bold text-black hover:underline cursor-pointer">
                      Volver a iniciar sesión
                    </button>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </>
  );
}
