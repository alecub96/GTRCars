'use client';

import { AlertTriangle, CheckCircle2, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type Incident = {
  id: string;
  type: string;
  status: string;
  title: string;
  description: string;
  claimedAmount: number;
  resolution: string | null;
  createdAt: string;
};

const incidentTypes = [
  ['DAMAGE', 'Daños'],
  ['DELAY', 'Retraso'],
  ['FUEL', 'Combustible'],
  ['CLEANING', 'Limpieza'],
  ['MILEAGE', 'Kilometraje'],
  ['ACCIDENT', 'Accidente'],
  ['CANCELLATION', 'Cancelación'],
  ['DOCUMENTATION', 'Documentación'],
  ['OTHER', 'Otro'],
] as const;

const statusLabels: Record<string, string> = {
  OPEN: 'Abierta',
  UNDER_REVIEW: 'En revisión',
  AWAITING_TRAVELER: 'Esperando al viajero',
  AWAITING_OWNER: 'Esperando al propietario',
  RESOLVED: 'Resuelta',
  REJECTED: 'Rechazada',
};

export default function BookingIncidentPanel({ bookingId, bookingStatus, canReport }: { bookingId: string; bookingStatus: string; canReport: boolean }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('DAMAGE');
  const [description, setDescription] = useState('');
  const [claimedAmount, setClaimedAmount] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const eligible = ['CONFIRMED', 'CHECKIN_PENDING', 'ACTIVE', 'CHECKOUT_PENDING', 'COMPLETED', 'DISPUTED'].includes(bookingStatus);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/incidents?bookingId=${encodeURIComponent(bookingId)}`, { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No se pudieron cargar las incidencias');
        return data.incidents as Incident[];
      })
      .then((data) => { if (!cancelled) setIncidents(data); })
      .catch((caught: unknown) => { if (!cancelled) setError(caught instanceof Error ? caught.message : 'No se pudieron cargar las incidencias'); });
    return () => { cancelled = true; };
  }, [bookingId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          type,
          description,
          claimedAmount: claimedAmount ? Number(claimedAmount) : 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo abrir la incidencia');
      setIncidents((current) => [data.incident, ...current]);
      setOpen(false);
      setDescription('');
      setClaimedAmount('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo abrir la incidencia');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[.2em] text-amber-700">Protección de la reserva</span>
          <h2 className="font-serif text-2xl font-bold">Incidencias y reclamaciones</h2>
          <p className="mt-1 text-sm text-[#6B726E]">Deja constancia formal para que administración pueda hacer seguimiento.</p>
        </div>
        {canReport && eligible && (
          <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full bg-[#13322E] px-5 py-3 text-xs font-bold text-white">
            <Plus className="h-4 w-4" /> Abrir incidencia
          </button>
        )}
      </div>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
      {incidents.length > 0 && (
        <div className="mt-5 grid gap-3">
          {incidents.map((incident) => (
            <article key={incident.id} className="rounded-2xl bg-[#F7F6F2] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-sm">{incident.title}</strong>
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${incident.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {statusLabels[incident.status] || incident.status}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[#4F5753]">{incident.description}</p>
              {incident.claimedAmount > 0 && <p className="mt-2 text-xs">Importe reclamado: <strong>{incident.claimedAmount.toFixed(2)} €</strong></p>}
              {incident.resolution && <p className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-900"><CheckCircle2 className="mr-1 inline h-4 w-4" /><strong>Resolución:</strong> {incident.resolution}</p>}
            </article>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#13322E]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Abrir incidencia">
          <form onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><AlertTriangle className="mb-2 h-7 w-7 text-amber-600" /><h3 className="font-serif text-3xl font-bold">Abrir incidencia</h3><p className="text-sm text-[#6B726E]">Describe los hechos de forma precisa. Podrás aportar evidencias desde la reserva.</p></div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="rounded-full border border-[#E9E1D2] p-2"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider">Tipo<select value={type} onChange={(event) => setType(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm normal-case">{incidentTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="block text-xs font-bold uppercase tracking-wider">Descripción<textarea required minLength={20} maxLength={5000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Explica cuándo ocurrió, qué sucedió y qué solución solicitas…" className="mt-2 min-h-36 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm font-normal normal-case" /></label>
              <label className="block text-xs font-bold uppercase tracking-wider">Importe reclamado (opcional)<input type="number" min="0" max="100000" step="0.01" value={claimedAmount} onChange={(event) => setClaimedAmount(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm font-normal normal-case" /></label>
            </div>
            <button disabled={saving} className="mt-5 w-full rounded-full bg-[#13322E] py-4 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Registrando…' : 'Registrar y avisar a administración'}</button>
          </form>
        </div>
      )}
    </section>
  );
}
