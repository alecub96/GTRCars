'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Camera, CheckCircle2, ClipboardCheck, ShieldCheck } from 'lucide-react';

type BookingSummary = { code: string; vehicle: string; checkInOdometer?: number; canSubmit: boolean };
type ExistingCheckout = { createdAt: string; extraKm: number; extraKmFee: number };

function CheckOutForm() {
  const bookingId = useSearchParams().get('bookingId') || '';
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [existing, setExisting] = useState<ExistingCheckout | null>(null);
  const [error, setError] = useState(() => bookingId ? '' : 'Abre el acta desde una reserva en curso.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/checkout?bookingId=${encodeURIComponent(bookingId)}`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo cargar la reserva');
      setBooking(data.booking);
      setExisting(data.checkOut);
    }).catch((caught: Error) => setError(caught.message));
  }, [bookingId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    form.set('bookingId', bookingId);
    try {
      const response = await fetch('/api/checkout', { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo registrar el acta');
      setExisting(data.checkOut);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo registrar el acta');
    } finally {
      setLoading(false);
    }
  }

  return <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar /><main className="mx-auto max-w-3xl px-4 py-12"><section className="space-y-8 rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-xl sm:p-8">
    <header className="border-b border-[#E9E1D2] pb-6 text-center"><ClipboardCheck className="mx-auto mb-3 h-10 w-10 text-[#16B8AA]" /><span className="text-[11px] font-black uppercase tracking-[.25em] text-[#D97706]">Acta digital de devolución</span><h1 className="mt-1 font-serif text-3xl font-bold">Check-out del vehículo</h1><p className="mt-2 text-xs text-[#6B726E]">{booking ? `${booking.code} · ${booking.vehicle}` : 'Vinculado a una reserva en curso'}</p></header>
    {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
    {existing ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" /><h2 className="mt-4 font-serif text-2xl font-bold">Devolución registrada</h2><p className="mt-2 text-sm text-[#6B726E]">La reserva ha finalizado y las evidencias quedan disponibles para posibles incidencias.</p>{existing.extraKmFee > 0 && <p className="mt-3 text-sm font-bold text-amber-800">Exceso: {existing.extraKm} km · {existing.extraKmFee.toFixed(2)} €</p>}</div> : booking && !booking.canSubmit ? <p className="rounded-2xl bg-amber-50 p-5 text-sm font-bold text-amber-900">El propietario debe completar el acta de devolución. Aquí podrás consultarla cuando quede registrada.</p> : booking && <form onSubmit={submit} className="space-y-6">
      <div className="rounded-2xl border border-[#16B8AA]/30 bg-[#F0FDFA] p-4 text-xs leading-relaxed"><ShieldCheck className="mr-2 inline h-5 w-5 text-[#16B8AA]" />Revisa el vehículo con ambas partes. El kilometraje no puede ser inferior al de entrega{booking.checkInOdometer != null ? ` (${booking.checkInOdometer} km)` : ''}. El exceso se calcula automáticamente.</div>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Kilometraje<input name="odometer" required type="number" min={booking.checkInOdometer || 0} max="10000000" className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm" /></label><LevelSelect name="fuelLevel" label="Combustible" /><LevelSelect name="waterLevel" label="Agua limpia" /><CleanlinessSelect /></div>
      <EvidenceFields />
      <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E]">Daños, cargos u observaciones<textarea name="notes" maxLength={3000} rows={4} className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm normal-case" /></label>
      <button disabled={loading} className="w-full rounded-full bg-[#16B8AA] py-4 text-xs font-black uppercase tracking-widest text-white disabled:bg-slate-300">{loading ? 'Guardando acta…' : 'Finalizar devolución'}</button>
    </form>}
  </section></main></div>;
}

function EvidenceFields() { return <div className="grid gap-3 sm:grid-cols-3">{[['front', 'Frontal'], ['dashboard', 'Cuadro y km'], ['interior', 'Interior']].map(([name, label]) => <label key={name} className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3 text-center"><Camera className="mb-2 h-6 w-6 text-[#16B8AA]" /><span className="text-xs font-bold">{label}</span><input name={name} required type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 max-w-full text-[10px]" /></label>)}</div>; }
function LevelSelect({ name, label }: { name: string; label: string }) { return <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">{label}<select name={name} className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm"><option value="FULL">Lleno</option><option value="3/4">3/4</option><option value="1/2">1/2</option><option value="1/4">1/4</option><option value="EMPTY">Vacío</option></select></label>; }
function CleanlinessSelect() { return <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Limpieza<select name="cleanliness" className="mt-1 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm"><option value="EXCELLENT">Excelente</option><option value="GOOD">Buena</option><option value="FAIR">Aceptable</option></select></label>; }

export default function CheckOutPage() { return <Suspense fallback={<div className="min-h-screen bg-[#F7F6F2]"><Navbar /></div>}><CheckOutForm /></Suspense>; }
