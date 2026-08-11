'use client';

import { useEffect, useState } from 'react';

export default function OwnerAvailabilityCalendar({ vehicles }: { vehicles: any[] }) {
  const [vehicleId, setVehicleId] = useState('');
  const [blocks, setBlocks] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!vehicles.length) { setVehicleId(''); return; }
    if (!vehicles.some((vehicle) => vehicle.id === vehicleId)) setVehicleId(vehicles[0].id);
  }, [vehicles, vehicleId]);

  useEffect(() => {
    if (!vehicleId) { setBlocks([]); return; }
    setMessage('');
    fetch(`/api/vehicles/${vehicleId}/availability`)
      .then((response) => response.json())
      .then((data) => setBlocks(data.blocks || []));
  }, [vehicleId]);

  async function addBlock(event: React.FormEvent) {
    event.preventDefault();
    if (!vehicleId) return;
    const response = await fetch(`/api/vehicles/${vehicleId}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate, reason: 'OWNER_BLOCK' }),
    });
    const data = await response.json();
    if (response.ok) {
      setBlocks((current) => [...current, data.block]);
      setStartDate('');
      setEndDate('');
      setMessage('Fechas bloqueadas correctamente');
    } else setMessage(data.error);
  }

  return (
    <section className="mb-12 rounded-3xl border border-[#E9E1D2] bg-white p-6">
      <h2 className="font-serif text-2xl font-bold">Disponibilidad de la flota</h2>
      <p className="mb-5 text-xs text-[#6B726E]">Selecciona una camper y bloquea las fechas en las que no podrá reservarse.</p>
      {!vehicles.length ? <p className="text-sm text-[#6B726E]">Publica una camper para gestionar su disponibilidad.</p> : (
        <>
          <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(220px,1fr)_2fr]">
            <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">
              Camper
              <select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} className="mt-1 block w-full rounded-xl border border-[#E9E1D2] bg-white p-3 text-sm normal-case text-[#13322E]">
                {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.title}</option>)}
              </select>
            </label>
            <form onSubmit={addBlock} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Desde<input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1 block w-full rounded-xl border border-[#E9E1D2] p-3 text-sm normal-case text-[#13322E]" /></label>
              <label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Hasta<input required type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1 block w-full rounded-xl border border-[#E9E1D2] p-3 text-sm normal-case text-[#13322E]" /></label>
              <button className="rounded-full bg-[#13322E] px-4 py-3 text-xs font-bold text-white">Bloquear fechas</button>
            </form>
          </div>
          {message && <p className="mb-3 text-xs font-bold text-amber-700">{message}</p>}
          <div className="space-y-2">{blocks.length === 0 ? <p className="text-sm text-[#6B726E]">No hay bloqueos para esta camper.</p> : blocks.map((block) => <div key={block.id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm">{new Date(block.startDate).toLocaleDateString()} – {new Date(block.endDate).toLocaleDateString()}</div>)}</div>
        </>
      )}
    </section>
  );
}
