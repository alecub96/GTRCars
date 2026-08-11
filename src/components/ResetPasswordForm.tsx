'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo restablecer la contraseña');
      setSuccess(true);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'No se pudo restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold">Contraseña actualizada</h1>
        <p className="text-slate-600">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <Link href="/" className="inline-block rounded-full bg-[#0F172A] px-6 py-3 text-xs font-black uppercase tracking-widest text-white">Volver a vaneando.</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="font-serif text-3xl font-bold text-center">Nueva contraseña</h1>
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-xs font-bold text-red-700">{error}</p>}
      <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nueva contraseña" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" />
      <input type="password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repite la contraseña" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" />
      <button disabled={loading || !token} className="w-full rounded-full bg-[#0F172A] py-3.5 text-xs font-black uppercase tracking-widest text-white disabled:opacity-50">
        {loading ? 'Guardando...' : 'Guardar contraseña'}
      </button>
    </form>
  );
}
