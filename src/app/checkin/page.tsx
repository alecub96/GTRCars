'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Camera, CheckCircle2, ClipboardCheck, ShieldCheck, Sparkles } from 'lucide-react';

type BookingSummary = { code: string; vehicle: string; canSubmit: boolean };

function EvidenceFields() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        ['front', 'Frontal y Splitter'],
        ['dashboard', 'Cuadro y Telemetría km'],
        ['interior', 'Cockpit y Asientos'],
      ].map(([name, label]) => (
        <label
          key={name}
          className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-neutral-900/60 p-3 text-center hover:border-[#D4AF37]/50 transition-colors"
        >
          <Camera className="mb-2 h-6 w-6 text-[#D4AF37]" />
          <span className="text-xs font-mono font-bold text-white">{label}</span>
          <input
            name={name}
            required
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-2 max-w-full text-[10px] text-neutral-400 font-mono"
          />
        </label>
      ))}
    </div>
  );
}

function CheckInDigitalForm() {
  const bookingId = useSearchParams().get('bookingId') || '';
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [existing, setExisting] = useState<{ createdAt: string } | null>(null);
  const [error, setError] = useState(() => (bookingId ? '' : 'Abre el acta desde una reserva confirmada en el Vault.'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/checkin?bookingId=${encodeURIComponent(bookingId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No se pudo cargar la reserva');
        setBooking(data.booking);
        setExisting(data.checkIn);
      })
      .catch((caught: Error) => setError(caught.message));
  }, [bookingId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    form.set('bookingId', bookingId);
    try {
      const response = await fetch('/api/checkin', { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo registrar el acta');
      setExisting(data.checkIn);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo registrar el acta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-12 w-full">
        <section className="space-y-8 rounded-3xl border border-white/10 bg-[#0f0f12] p-6 shadow-2xl sm:p-8">
          <header className="border-b border-white/10 pb-6 text-center">
            <ClipboardCheck className="mx-auto mb-3 h-10 w-10 text-[#D4AF37]" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#D4AF37]/30">
              <Sparkles className="w-3 h-3" />
              ACTA DIGITAL DE ENTREGA VIP
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold text-white">Check-in de Superdeportivo</h1>
            <p className="mt-2 text-xs font-mono text-neutral-400">
              {booking ? `${booking.code} · ${booking.vehicle}` : 'Vinculado a una reserva de flota GTR Cars'}
            </p>
          </header>

          {error && (
            <p className="rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs font-mono text-red-400 font-bold">
              {error}
            </p>
          )}

          {existing ? (
            <div className="py-10 text-center font-mono space-y-3">
              <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" />
              <h2 className="font-serif text-2xl font-bold text-white">Acta VIP registrada correctamente</h2>
              <p className="text-xs text-neutral-400">
                Las evidencias y telemetría inicial quedan custodiadas en el Vault.
              </p>
            </div>
          ) : booking && !booking.canSubmit ? (
            <p className="rounded-2xl bg-amber-950/40 border border-amber-500/30 p-5 text-xs font-mono font-bold text-amber-300">
              El agente Concierge o propietario completará el acta de entrega con la telemetría inicial.
            </p>
          ) : (
            booking && (
              <form onSubmit={submit} className="space-y-6 font-mono">
                <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4 text-xs text-neutral-300 leading-relaxed flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#D4AF37] shrink-0" />
                  <span>
                    Completa el acta en presencia de ambas partes. Se registra fecha, firma digital y telemetría de salida.
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    Kilometraje de Salida
                    <input
                      name="odometer"
                      required
                      type="number"
                      min="0"
                      max="10000000"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-900 p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                    />
                  </label>
                  <LevelSelect name="fuelLevel" label="Combustible (98 Octanos)" />
                  <CleanlinessSelect />
                </div>

                <EvidenceFields />

                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Inspección Visual y Observaciones
                  <textarea
                    name="notes"
                    maxLength={3000}
                    rows={4}
                    placeholder="Estado de llantas, splitter frontal, nivel de aceite..."
                    className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-900 p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                  />
                </label>

                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] py-4 text-xs font-mono font-bold uppercase tracking-widest text-black hover:brightness-110 shadow-lg disabled:opacity-40 transition-all cursor-pointer"
                >
                  {loading ? 'GUARDANDO ACTA...' : 'FORMALIZAR ACTA DE SALIDA'}
                </button>
              </form>
            )
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function LevelSelect({ name, label }: { name: string; label: string }) {
  return (
    <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
      {label}
      <select
        name={name}
        className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-900 p-3 text-sm text-white focus:border-[#D4AF37] outline-none cursor-pointer"
      >
        <option value="FULL">100% Lleno (98 Octanos)</option>
        <option value="3/4">3/4 Depósito</option>
        <option value="1/2">1/2 Depósito</option>
        <option value="1/4">1/4 Depósito</option>
        <option value="EMPTY">Reserva</option>
      </select>
    </label>
  );
}

function CleanlinessSelect() {
  return (
    <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
      Detailing / Limpieza
      <select
        name="cleanliness"
        className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-900 p-3 text-sm text-white focus:border-[#D4AF37] outline-none cursor-pointer"
      >
        <option value="EXCELLENT">Detailing Impecable (Cerámico)</option>
        <option value="GOOD">Limpieza Óptima</option>
        <option value="FAIR">Aceptable</option>
      </select>
    </label>
  );
}

export default function CheckInDigitalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070707]">
          <Navbar />
        </div>
      }
    >
      <CheckInDigitalForm />
    </Suspense>
  );
}
