'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Camera, CheckCircle2, ClipboardCheck, ShieldCheck } from 'lucide-react';

function CheckInDigitalForm() {
  const bookingId = useSearchParams().get('bookingId') || '';
  const [booking, setBooking] = useState<{ code: string; vehicle: string } | null>(null);
  const [existing, setExisting] = useState<{ createdAt: string } | null>(null);
  const [error, setError] = useState(() => bookingId ? '' : 'Abre el acta desde una reserva confirmada.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/checkin?bookingId=${encodeURIComponent(bookingId)}`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo cargar la reserva');
      setBooking(data.booking); setExisting(data.checkIn);
    }).catch((caught: Error) => setError(caught.message));
  }, [bookingId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('');
    const form = new FormData(event.currentTarget); form.set('bookingId', bookingId);
    try {
      const response = await fetch('/api/checkin', { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo registrar el acta');
      setExisting(data.checkIn);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'No se pudo registrar el acta'); }
    finally { setLoading(false); }
  }

  return <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar /><main className="mx-auto max-w-3xl px-4 py-12"><section className="space-y-8 rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-xl sm:p-8"><header className="border-b border-[#E9E1D2] pb-6 text-center"><ClipboardCheck className="mx-auto mb-3 h-10 w-10 text-[#16B8AA]" /><span className="text-[11px] font-black uppercase tracking-[.25em] text-[#D97706]">Acta digital de entrega</span><h1 className="mt-1 font-serif text-3xl font-bold">Check-in del vehículo</h1><p className="mt-2 text-xs text-[#6B726E]">{booking ? `${booking.code} · ${booking.vehicle}` : 'Vinculado a una reserva confirmada'}</p></header>
  {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
  {existing ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" /><h2 className="mt-4 font-serif text-2xl font-bold">Acta registrada correctamente</h2><p className="mt-2 text-sm text-[#6B726E]">Las evidencias están cifradas y disponibles únicamente para las partes de la reserva y administración.</p></div> : booking && <form onSubmit={submit} className="space-y-6"><div className="rounded-2xl border border-[#16B8AA]/30 bg-[#F0FDFA] p-4 text-xs leading-relaxed"><ShieldCheck className="mr-2 inline h-5 w-5 text-[#16B8AA]" />Completa el acta en presencia de ambas partes. El sistema conserva la fecha, el usuario autenticado y las fotografías originales.</div><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Kilometraje<input name="odometer" required type="number" min="0" max="10000000" className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm" /></label><label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Combustible<select name="fuelLevel" className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm"><option value="FULL">Lleno</option><option value="3/4">3/4</option><option value="1/2">1/2</option><option value="1/4">1/4</option><option value="EMPTY">Vacío</option></select></label><label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Agua limpia<select name="waterLevel" className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm"><option value="FULL">Lleno</option><option value="3/4">3/4</option><option value="1/2">1/2</option><option value="1/4">1/4</option><option value="EMPTY">Vacío</option></select></label><label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Limpieza<select name="cleanliness" className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm"><option value="EXCELLENT">Excelente</option><option value="GOOD">Buena</option><option value="FAIR">Aceptable</option></select></label></div><div className="grid gap-3 sm:grid-cols-3">{[['front','Frontal'],['dashboard','Cuadro y km'],['interior','Interior']] .map(([name,label]) => <label key={name} className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3 text-center"><Camera className="mb-2 h-6 w-6 text-[#16B8AA]" /><span className="text-xs font-bold">{label}</span><input name={name} required type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 max-w-full text-[10px]" /></label>)}</div><label className="block text-xs font-black uppercase tracking-wider text-[#6B726E]">Daños previos y observaciones<textarea name="notes" maxLength={3000} rows={4} className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm normal-case" /></label><button disabled={loading} className="w-full rounded-full bg-[#16B8AA] py-4 text-xs font-black uppercase tracking-widest text-white disabled:bg-slate-300">{loading ? 'Guardando acta…' : 'Registrar acta y evidencias'}</button></form>}</section></main></div>;
}

export default function CheckInDigitalPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#F7F6F2]"><Navbar /></div>}><CheckInDigitalForm /></Suspense>;
}
