'use client';

import { Camera, CheckCircle2, Save } from 'lucide-react';
import { useState } from 'react';

export default function ProfileEditor({ user }: { user: any }) {
  const [current, setCurrent] = useState(user);
  const [preview, setPreview] = useState(user.avatarUrl || '/default-avatar.svg');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const form = new FormData();
    form.set('firstName', current.firstName);
    form.set('lastName', current.lastName);
    form.set('phone', current.phone || '');
    if (file) form.set('avatar', file);

    const response = await fetch('/api/profile', { method: 'POST', body: form });
    const data = await response.json();
    setMessage(response.ok ? 'Perfil actualizado correctamente en la bóveda' : data.error || 'No se pudo actualizar');
    if (response.ok) setCurrent({ ...current, ...data.user });
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row items-center sm:items-start">
        <label className="group relative mx-auto h-32 w-32 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white text-black border border-gray-300 hover:border-black transition-all shadow-sm sm:mx-0">
          <img
            src={preview || '/default-avatar.svg'}
            alt="Foto de perfil"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-avatar.svg';
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
          </span>
          <input
            type="file"
            accept="image/*,.heic,.heif"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected) {
                setFile(selected);
                setPreview(URL.createObjectURL(selected));
              }
            }}
          />
        </label>

        <div className="grid flex-1 gap-4 sm:grid-cols-2 w-full font-mono">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            Nombre
            <input
              required
              value={current.firstName}
              onChange={(event) => setCurrent({ ...current, firstName: event.target.value })}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-sans text-black focus:border-black focus:outline-none"
            />
          </label>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            Apellidos
            <input
              required
              value={current.lastName}
              onChange={(event) => setCurrent({ ...current, lastName: event.target.value })}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-sans text-black focus:border-black focus:outline-none"
            />
          </label>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            Teléfono de Contacto VIP
            <input
              value={current.phone || ''}
              onChange={(event) => setCurrent({ ...current, phone: event.target.value })}
              placeholder="+34 600 000 000"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-sans text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
            />
          </label>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            Correo Electrónico (No Modificable)
            <input
              disabled
              value={current.email}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm font-sans text-gray-500 cursor-not-allowed"
            />
          </label>
        </div>
      </div>

      {message && (
        <p className="mt-5 flex items-center gap-2 text-xs font-mono font-bold text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </p>
      )}

      <button
        disabled={loading}
        className="mt-6 flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-xs font-mono font-black uppercase tracking-wider text-white hover:bg-neutral-800 transition-all shadow-md cursor-pointer disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {loading ? 'Guardando...' : 'Guardar Cambios de Perfil'}
      </button>
    </form>
  );
}
