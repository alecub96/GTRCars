'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, X, LogIn, UserPlus, LogOut, ShieldCheck, Truck, KeyRound, RefreshCw, Compass, MessageSquare } from 'lucide-react';
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
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

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
        throw new Error(data.error || 'Ocurrió un error');
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

      if (targetRole === 'TRAVELER') {
        router.push('/cuenta');
      } else {
        router.push('/propietario');
      }
      router.refresh();
    } catch (err: any) {
      alert(err.message);
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

  return (
    <>
      {user ? (
        /* MENÚ DESPLEGABLE DE PERFIL CON BOTÓN DE CONMUTACIÓN DE MODO Y ACCESO A MENSAJES */
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#F4F9F8] text-[#13322E] border border-[#E9E1D2] hover:bg-[#E9E1D2] transition-all shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-[#16B8AA] text-white flex items-center justify-center text-[10px] font-black uppercase">
              {user.firstName ? user.firstName[0] : 'U'}
            </div>
            <span>{user.firstName}</span>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#16B8AA]/10 text-[#16B8AA]">
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
                    <span>{user.role === 'OWNER' ? 'Pasar a Modo Alquiler (Viajero)' : 'Pasar a Modo Propietario'}</span>
                  </div>
                </button>
              )}

              <div className="space-y-1 text-xs font-bold text-slate-700">
                <Link
                  href="/soporte"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#16B8AA]" />
                  <span>{user.role === 'ADMIN' ? 'Chat con usuarios' : 'Contactar con soporte'}</span>
                </Link>

                {user.role !== 'ADMIN' && <Link
                  href="/mensajes"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#16B8AA]" />
                  <span>Mensajes de reservas</span>
                </Link>}

                {user.role !== 'ADMIN' && <Link
                  href="/cuenta"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <Compass className="w-4 h-4 text-[#16B8AA]" />
                  <span>Mi Perfil y Mis Reservas</span>
                </Link>}

                {user.role === 'OWNER' && <Link
                  href="/propietario"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <Truck className="w-4 h-4 text-[#16B8AA]" />
                  <span>Panel de mis Campers</span>
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
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full bg-[#16B8AA] text-white hover:bg-[#0F766E] transition-all shadow-sm"
          >
            <User className="w-4 h-4" />
            <span>Acceder</span>
          </button>

          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
              <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 relative shadow-2xl animate-fade-in my-auto">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#16B8AA]">
                    NOMAD CANARIAS
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-[#13322E] mt-1">
                    {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Crear Cuenta' : 'Recuperar Contraseña'}
                  </h3>
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
                          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
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
                          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
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
                    className="w-full py-3.5 rounded-full bg-[#13322E] text-white font-black text-xs uppercase tracking-widest hover:bg-[#254842] transition-colors shadow-md mt-2 flex items-center justify-center space-x-2"
                  >
                    {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{loading ? 'Procesando...' : mode === 'login' ? 'INICIAR SESIÓN' : mode === 'register' ? 'CREAR CUENTA' : 'ENVIAR ENLACE'}</span>
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500 font-medium">
                  {mode === 'login' ? (
                    <div className="space-y-2">
                      <p>
                        ¿No tienes cuenta aún?{' '}
                        <button onClick={() => setMode('register')} className="font-bold text-[#16B8AA] hover:underline">
                          Regístrate aquí
                        </button>
                      </p>
                      <button onClick={() => { setMode('forgot'); setError(''); setSuccessMessage(''); }} className="font-bold text-[#16B8AA] hover:underline">
                        ¿Has olvidado tu contraseña?
                      </button>
                    </div>
                  ) : mode === 'register' ? (
                    <p>
                      ¿Ya tienes cuenta?{' '}
                      <button onClick={() => setMode('login')} className="font-bold text-[#16B8AA] hover:underline">
                        Inicia sesión aquí
                      </button>
                    </p>
                  ) : (
                    <button onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }} className="font-bold text-[#16B8AA] hover:underline">
                      Volver a iniciar sesión
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
