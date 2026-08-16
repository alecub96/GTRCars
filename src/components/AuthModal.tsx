'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { User, X, LogIn, UserPlus, LogOut, ShieldCheck, Truck, KeyRound, RefreshCw, Compass, Mail, UserCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

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
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchRole = async () => {
    const targetRole = user.role === 'OWNER' ? 'TRAVELER' : 'OWNER';
    setSwitching(true);
    setSwitchError('');

    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cambiar de modo');

      setUser(data.user);
      setIsOpen(false);
      setRoleNotice(targetRole);

      setTimeout(() => {
        window.location.href = targetRole === 'TRAVELER' ? '/cuenta' : '/propietario';
      }, 1000);
    } catch (err: any) {
      setSwitchError(err.message || 'No se pudo cambiar de modo');
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
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      if (e.detail?.mode) setMode(e.detail.mode);
      setIsOpen(true);
    };
    window.addEventListener('open-auth-modal', handleOpenModal);
    return () => window.removeEventListener('open-auth-modal', handleOpenModal);
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
        <div className="fixed top-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-[999999] pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="rounded-2xl sm:rounded-3xl bg-[#13322E] text-white p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-[#16B8AA]/40 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#16B8AA]/20 text-[#16B8AA]">
                <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#16B8AA] block">
                  Modo actualizado
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  Ahora estás en modo {roleNotice === 'OWNER' ? 'propietario' : 'viajero'}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#A0AEC0] font-medium truncate mt-0.5">
                  {roleNotice === 'OWNER'
                    ? 'Gestiona tus campers, calendario y finanzas.'
                    : 'Explora campers y gestiona tus viajes.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRoleNotice(null)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {user ? (
        /* MENÚ DESPLEGABLE DE PERFIL PARA ESCRITORIO (EN MÓVIL SE USA EL MENÚ UNIFICADO) */
        <div className="relative hidden md:inline-block">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center space-x-1.5 sm:space-x-2 text-xs font-bold uppercase tracking-wider px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#F4F9F8] text-[#13322E] border border-[#E9E1D2] hover:bg-[#E9E1D2] transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-[#16B8AA] text-white flex items-center justify-center text-[10px] font-black uppercase shrink-0">
              {user.firstName ? user.firstName[0] : 'U'}
            </div>
            <span className="hidden sm:inline">{user.firstName}</span>
            <span className="hidden sm:inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#16B8AA]/10 text-[#16B8AA]">
              {user.role === 'ADMIN' ? 'Administrador' : user.role === 'OWNER' ? 'Modo Propietario' : 'Modo Viajero'}
            </span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 z-[9999] text-[#13322E] animate-fade-in">
              <div className="border-b border-slate-100 pb-3 mb-3 px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA]">
                  {user.role === 'ADMIN' ? 'Administrador' : user.role === 'OWNER' ? 'Modo Propietario Activo' : 'Modo Viajero Activo'}
                </span>
                <p className="font-bold text-sm text-[#13322E] truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>

              {/* BOTÓN PROMINENTE DE CAMBIO DE MODO */}
              {user.role !== 'ADMIN' && (
                <button
                  onClick={handleSwitchRole}
                  disabled={switching}
                  className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-[#13322E] to-[#254842] text-white font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-md hover:opacity-95 transition-opacity"
                >
                  <div className="flex items-center space-x-2">
                    <RefreshCw className={`w-4 h-4 text-[#16B8AA] ${switching ? 'animate-spin' : ''}`} />
                    <span>{user.role === 'OWNER' ? 'Pasar a Modo Viajero' : 'Pasar a Modo Propietario'}</span>
                  </div>
                </button>
              )}
              {switchError && <p role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">{switchError}</p>}

              <div className="space-y-1 text-xs font-bold text-slate-700">
                {user.role !== 'ADMIN' && (
                  <Link
                    href="/mensajes"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#16B8AA]" />
                    <span>Mensajes de reservas</span>
                  </Link>
                )}

                <Link
                  href="/perfil"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-[#16B8AA]" />
                  <span>Mi perfil</span>
                </Link>

                {user.role === 'TRAVELER' && <Link href="/cuenta" onClick={() => setIsOpen(false)} className="flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"><Compass className="w-4 h-4 text-[#16B8AA]" /><span>Mis reservas y viajes</span></Link>}

                {user.role === 'OWNER' && <Link
                  href="/propietario"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <Truck className="w-4 h-4 text-[#16B8AA]" />
                  <span>Panel de propietario</span>
                </Link>}

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <KeyRound className="w-4 h-4 text-[#D97706]" />
                    <span>Panel de Administración</span>
                  </Link>
                )}

                {user.role !== 'OWNER' && user.role !== 'ADMIN' && <Link
                  href="/verificacion"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-[#16B8AA]" />
                  <span>Verificación de Licencia</span>
                </Link>}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-red-50 text-red-600 transition-colors text-left font-bold border-t border-slate-100 mt-2 pt-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* BOTÓN Y MODAL DE INICIO DE SESIÓN / REGISTRO */
        <>
          <button
            onClick={() => { setMode('register'); setIsOpen(true); }}
            className="hidden md:inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full bg-[#16B8AA] text-white hover:bg-[#0F766E] transition-all shadow-sm cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Acceder / Registrarse</span>
          </button>

          {isOpen && mounted && createPortal(
            <div className="fixed inset-0 z-[999999] overflow-y-auto bg-black/65 backdrop-blur-sm p-4 sm:p-6 flex min-h-full items-center justify-center">
              <div className="relative w-full max-w-md bg-white border border-[#E9E1D2] rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in my-auto text-left">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* PESTAÑAS DE REGISTRO E INICIO DE SESIÓN */}
                <div className="flex border-b border-[#E9E1D2] mb-6">
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setError(''); setSuccessMessage(''); }}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                      mode === 'register'
                        ? 'border-[#16B8AA] text-[#16B8AA]'
                        : 'border-transparent text-[#6B726E] hover:text-[#13322E]'
                    }`}
                  >
                    Crear Cuenta
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                      mode === 'login'
                        ? 'border-[#16B8AA] text-[#16B8AA]'
                        : 'border-transparent text-[#6B726E] hover:text-[#13322E]'
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-center">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'register' && (
                    <>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => setRole('TRAVELER')}
                          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                            role === 'TRAVELER'
                              ? 'bg-[#16B8AA] text-white border-[#16B8AA]'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          Viajero
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('OWNER')}
                          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                            role === 'OWNER'
                              ? 'bg-[#16B8AA] text-white border-[#16B8AA]'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          Propietario
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Nombre</label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Apellidos</label>
                          <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@canariascampers.es"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                    />
                  </div>

                  {mode !== 'forgot' && (
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Contraseña</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-full bg-[#13322E] text-white font-black text-xs uppercase tracking-widest hover:bg-[#254842] transition-colors shadow-md mt-2 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{loading ? 'Procesando...' : mode === 'login' ? 'INICIAR SESIÓN' : mode === 'register' ? 'CREAR CUENTA' : 'ENVIAR ENLACE'}</span>
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500 font-medium">
                  {mode === 'login' && (
                    <button onClick={() => { setMode('forgot'); setError(''); setSuccessMessage(''); }} className="font-bold text-[#16B8AA] hover:underline cursor-pointer">
                      ¿Has olvidado tu contraseña?
                    </button>
                  )}
                  {mode === 'forgot' && (
                    <button onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }} className="font-bold text-[#16B8AA] hover:underline cursor-pointer">
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
