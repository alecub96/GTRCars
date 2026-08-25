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
    event.preventDefault(); setLoading(true); setMessage('');
    const form = new FormData(); form.set('firstName', current.firstName); form.set('lastName', current.lastName); form.set('phone', current.phone || ''); if (file) form.set('avatar', file);
    const response = await fetch('/api/profile', { method: 'POST', body: form }); const data = await response.json();
    setMessage(response.ok ? 'Perfil actualizado correctamente' : data.error || 'No se pudo actualizar'); if (response.ok) setCurrent({ ...current, ...data.user }); setLoading(false);
  }
  return <form onSubmit={submit} className="rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm"><div className="flex flex-col gap-6 sm:flex-row"><label className="group relative mx-auto h-32 w-32 shrink-0 cursor-pointer overflow-hidden rounded-full bg-[#13322E] text-white shadow-lg sm:mx-0"><img src={preview || '/default-avatar.svg'} alt="Foto de perfil" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.svg'; }} /><span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"><Camera className="h-6 w-6" /></span><input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const selected = event.target.files?.[0]; if (selected) { setFile(selected); setPreview(URL.createObjectURL(selected)); } }} /></label><div className="grid flex-1 gap-4 sm:grid-cols-2"><label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Nombre<input required value={current.firstName} onChange={(event) => setCurrent({ ...current, firstName: event.target.value })} className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm normal-case" /></label><label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Apellidos<input required value={current.lastName} onChange={(event) => setCurrent({ ...current, lastName: event.target.value })} className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm normal-case" /></label><label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Teléfono<input value={current.phone || ''} onChange={(event) => setCurrent({ ...current, phone: event.target.value })} placeholder="Añade un teléfono" className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm normal-case" /></label><label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Correo<input disabled value={current.email} className="mt-1 w-full rounded-xl border border-[#E9E1D2] bg-slate-50 p-3 text-sm font-normal normal-case text-slate-500" /></label></div></div>{message && <p className="mt-4 flex items-center gap-2 text-xs font-bold text-[#0F766E]"><CheckCircle2 className="h-4 w-4" />{message}</p>}<button disabled={loading} className="mt-5 flex items-center gap-2 rounded-full bg-[#13322E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"><Save className="h-4 w-4" />{loading ? 'Guardando…' : 'Guardar perfil'}</button></form>;
}
