'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw, Scale } from 'lucide-react';
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
  booking: {
    id: string;
    code: string;
    totalAmount: number;
    vehicle: { title: string };
    traveler: { firstName: string; lastName: string };
    owner: { firstName: string; lastName: string };
  };
};

const statusLabels: Record<string, string> = {
  OPEN: 'Abierta',
  UNDER_REVIEW: 'En revisión',
  AWAITING_TRAVELER: 'Esperando viajero',
  AWAITING_OWNER: 'Esperando propietario',
  RESOLVED: 'Resuelta',
  REJECTED: 'Rechazada',
};

export default function AdminIncidentQueue() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState<Record<string, { status: string; resolution: string }>>({});

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/incidents', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudieron cargar las incidencias');
      setIncidents(data.incidents);
      setDrafts(Object.fromEntries(data.incidents.map((incident: Incident) => [incident.id, {
        status: incident.status,
        resolution: incident.resolution || '',
      }])));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudieron cargar las incidencias');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/incidents', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No se pudieron cargar las incidencias');
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        setIncidents(data.incidents);
        setDrafts(Object.fromEntries(data.incidents.map((incident: Incident) => [incident.id, {
          status: incident.status,
          resolution: incident.resolution || '',
        }])));
      })
      .catch((caught: unknown) => {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'No se pudieron cargar las incidencias');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function save(incidentId: string) {
    const draft = drafts[incidentId];
    if (!draft) return;
    setSavingId(incidentId);
    setError('');
    try {
      const response = await fetch('/api/admin/incidents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId, ...draft }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo guardar la decisión');
      setIncidents((current) => current.map((incident) => (
        incident.id === incidentId ? { ...incident, ...data.incident } : incident
      )));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo guardar la decisión');
    } finally {
      setSavingId('');
    }
  }

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-[#E9E1D2] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9E1D2] p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-amber-50 p-3 text-amber-700"><Scale className="h-5 w-5" /></div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Incidencias y disputas</h2>
            <p className="text-sm text-[#6B726E]">Revisa pruebas, pide información y deja una resolución trazable.</p>
          </div>
        </div>
        <button type="button" onClick={() => void load()} className="flex items-center gap-2 rounded-full border border-[#E9E1D2] px-4 py-2 text-xs font-bold">
          <RefreshCw className="h-4 w-4" /> Actualizar
        </button>
      </div>

      {error && <p className="m-5 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
      {loading ? (
        <p className="p-8 text-center text-sm text-[#6B726E]">Cargando incidencias…</p>
      ) : incidents.length === 0 ? (
        <div className="p-8 text-center">
          <AlertTriangle className="mx-auto h-7 w-7 text-[#16B8AA]" />
          <p className="mt-2 text-sm font-bold">No hay incidencias abiertas ni históricas.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E9E1D2]">
          {incidents.map((incident) => {
            const draft = drafts[incident.id] || { status: incident.status, resolution: incident.resolution || '' };
            return (
              <article key={incident.id} className="grid gap-5 p-6 lg:grid-cols-[1fr_320px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA]">{incident.booking.code}</span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase text-amber-800">{statusLabels[incident.status] || incident.status}</span>
                    <span className="rounded-full bg-[#F7F6F2] px-2.5 py-1 text-[10px] font-black uppercase text-[#6B726E]">{incident.type}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold tracking-tight">{incident.booking.vehicle.title}</h3>
                  <p className="mt-1 text-xs text-[#6B726E]">
                    Viajero: {incident.booking.traveler.firstName} {incident.booking.traveler.lastName} · Propietario: {incident.booking.owner.firstName} {incident.booking.owner.lastName}
                  </p>
                  <p className="mt-4 text-sm font-bold">{incident.title}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#4F5753]">{incident.description}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs">
                    <span>Importe reclamado: <strong>{incident.claimedAmount.toFixed(2)} €</strong></span>
                    <span>Reserva: <strong>{incident.booking.totalAmount.toFixed(2)} €</strong></span>
                    <span>{new Date(incident.createdAt).toLocaleString('es-ES')}</span>
                  </div>
                  <Link href={`/reserva/${incident.booking.id}`} className="mt-4 inline-block text-xs font-bold text-[#0F766E] underline">Abrir reserva y evidencias</Link>
                </div>

                <div className="space-y-3 rounded-2xl bg-[#F7F6F2] p-4">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B726E]">
                    Estado
                    <select
                      value={draft.status}
                      onChange={(event) => setDrafts((current) => ({ ...current, [incident.id]: { ...draft, status: event.target.value } }))}
                      className="mt-1 w-full rounded-xl border border-[#E9E1D2] bg-white p-3 text-sm normal-case tracking-normal"
                    >
                      <option value="OPEN">Abierta</option>
                      <option value="UNDER_REVIEW">En revisión</option>
                      <option value="AWAITING_TRAVELER">Esperando viajero</option>
                      <option value="AWAITING_OWNER">Esperando propietario</option>
                      <option value="RESOLVED">Resuelta</option>
                      <option value="REJECTED">Rechazada</option>
                    </select>
                  </label>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B726E]">
                    Resolución o siguiente paso
                    <textarea
                      value={draft.resolution}
                      onChange={(event) => setDrafts((current) => ({ ...current, [incident.id]: { ...draft, resolution: event.target.value } }))}
                      placeholder="Describe la decisión o qué información falta…"
                      className="mt-1 min-h-24 w-full rounded-xl border border-[#E9E1D2] bg-white p-3 text-sm font-normal normal-case tracking-normal"
                    />
                  </label>
                  <button type="button" disabled={savingId === incident.id} onClick={() => void save(incident.id)} className="w-full rounded-full bg-[#13322E] px-4 py-3 text-xs font-bold text-white disabled:opacity-50">
                    {savingId === incident.id ? 'Guardando…' : 'Guardar seguimiento'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
