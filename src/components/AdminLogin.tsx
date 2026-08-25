'use client';

import React, { useState } from 'react';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'No se pudo iniciar sesión. Comprueba tus datos.');
      } else if (data.user?.role !== 'ADMIN') {
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout' }),
        });
        setError('Esta cuenta no dispone de privilegios de administrador para acceder a esta área.');
      } else {
        window.location.reload();
      }
    } catch {
      setError('Error de conexión con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-12">
      <form onSubmit={login} className="w-full rounded-3xl border border-[#E9E1D2] bg-white p-8 sm:p-10 shadow-2xl">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#13322E] text-white shadow-md">
          <ShieldCheck className="h-7 w-7 text-[#16B8AA]" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-[.25em] text-[#16B8AA]">
          Acceso Restringido
        </span>
        <h1 className="mt-2 text-3xl font-serif font-bold tracking-tight text-[#13322E]">
          Administración de Vaneando
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6B726E] leading-relaxed">
          Introduce tus credenciales autorizadas para acceder al centro de operaciones y control de la plataforma.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-bold text-red-700 leading-relaxed">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E]">
            Correo administrativo
            <input
              required
              type="email"
              placeholder="admin@vaneando.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#E9E1D2] bg-[#FAF7F0] p-3 text-xs sm:text-sm font-medium text-[#13322E] normal-case focus:border-[#16B8AA] focus:bg-white focus:outline-none"
            />
          </label>

          <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E]">
            Contraseña
            <input
              required
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#E9E1D2] bg-[#FAF7F0] p-3 text-xs sm:text-sm font-medium text-[#13322E] normal-case focus:border-[#16B8AA] focus:bg-white focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#13322E] hover:bg-[#16B8AA] disabled:opacity-50 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md active:scale-98 cursor-pointer mt-2"
          >
            <KeyRound className="h-4 w-4" />
            <span>{loading ? 'Comprobando credenciales…' : 'Entrar al panel'}</span>
          </button>
        </div>

        <p className="mt-6 flex items-center gap-2 text-[11px] text-[#6B726E] pt-4 border-t border-[#E9E1D2]">
          <Lock className="h-3.5 w-3.5 text-[#16B8AA]" />
          <span>La ruta es siempre vaneando.com/admin</span>
        </p>
      </form>
    </main>
  );
}
