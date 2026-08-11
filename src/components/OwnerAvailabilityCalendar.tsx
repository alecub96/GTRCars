'use client';

import { useEffect, useState } from 'react';
import DateRangeCalendar from '@/components/DateRangeCalendar';
import { CalendarSync, DollarSign, Trash2, Upload } from 'lucide-react';

export default function OwnerAvailabilityCalendar({ vehicles }: { vehicles: any[] }) {
  const [vehicleId, setVehicleId] = useState('');
  const [blocks, setBlocks] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [ruleStart, setRuleStart] = useState('');
  const [ruleEnd, setRuleEnd] = useState('');
  const [ruleName, setRuleName] = useState('Temporada especial');
  const [rulePrice, setRulePrice] = useState('');
  const [message, setMessage] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!vehicles.length) { setVehicleId(''); return; }
    if (!vehicles.some((vehicle) => vehicle.id === vehicleId)) setVehicleId(vehicles[0].id);
  }, [vehicles, vehicleId]);

  async function loadData(id: string) {
    if (!id) { setBlocks([]); setRules([]); return; }
    setMessage('');
    const [availability, pricing] = await Promise.all([fetch(`/api/vehicles/${id}/availability`), fetch(`/api/vehicles/${id}/pricing`)]);
    const availabilityData = await availability.json(); const pricingData = await pricing.json();
    setBlocks(availabilityData.blocks || []); setRules(pricingData.rules || []);
  }
  useEffect(() => { loadData(vehicleId); }, [vehicleId]);

  async function addBlock(event: React.FormEvent) {
    event.preventDefault(); if (!vehicleId) return;
    const response = await fetch(`/api/vehicles/${vehicleId}/availability`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ startDate, endDate, reason: 'OWNER_BLOCK' }) });
    const data = await response.json();
    if (response.ok) { setBlocks((current) => [...current, data.block]); setStartDate(''); setEndDate(''); setMessage('Fechas bloqueadas correctamente'); } else setMessage(data.error);
  }
  async function removeBlock(blockId: string) { const response = await fetch(`/api/vehicles/${vehicleId}/availability`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ blockId }) }); if (response.ok) setBlocks((current) => current.filter((block) => block.id !== blockId)); else setMessage((await response.json()).error); }
  async function addRule(event: React.FormEvent) { event.preventDefault(); const response = await fetch(`/api/vehicles/${vehicleId}/pricing`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: ruleName, startDate: ruleStart, endDate: ruleEnd, pricePerDay: rulePrice }) }); const data = await response.json(); if (response.ok) { setRules((current) => [...current, data.rule].sort((a, b) => a.startDate.localeCompare(b.startDate))); setRuleStart(''); setRuleEnd(''); setRulePrice(''); setMessage('Tarifa guardada'); } else setMessage(data.error); }
  async function removeRule(ruleId: string) { const response = await fetch(`/api/vehicles/${vehicleId}/pricing`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ruleId }) }); if (response.ok) setRules((current) => current.filter((rule) => rule.id !== ruleId)); else setMessage((await response.json()).error); }
  async function importCalendar(event: React.ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; setSyncing(true); const form = new FormData(); form.append('file', file); const response = await fetch(`/api/vehicles/${vehicleId}/calendar`, { method: 'POST', body: form }); const data = await response.json(); setSyncing(false); setMessage(response.ok ? `Calendario sincronizado: ${data.imported} fechas importadas.` : data.error); if (response.ok) loadData(vehicleId); event.target.value = ''; }

  return <section className="mb-12 rounded-3xl border border-[#E9E1D2] bg-white p-6"><h2 className="font-serif text-2xl font-bold">Disponibilidad y tarifas</h2><p className="mb-5 text-xs text-[#6B726E]">Marca días no disponibles, añade precios por temporada y sincroniza calendarios externos.</p>{!vehicles.length ? <p className="text-sm text-[#6B726E]">Publica una camper para gestionar su disponibilidad.</p> : <><div className="mb-5 grid gap-4 lg:grid-cols-[minmax(220px,1fr)_2fr]"><label className="text-xs font-black uppercase tracking-wider text-[#6B726E]">Camper<select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} className="mt-1 block w-full rounded-xl border border-[#E9E1D2] bg-white p-3 text-sm normal-case text-[#13322E]">{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.title}</option>)}</select></label><form onSubmit={addBlock} className="space-y-3"><DateRangeCalendar startDate={startDate} endDate={endDate} blocked={blocks} onChange={(start, end) => { setStartDate(start); setEndDate(end); }} /><button disabled={!startDate || !endDate} className="w-full rounded-full bg-[#13322E] px-4 py-3 text-xs font-bold text-white disabled:bg-slate-300">Marcar periodo como no disponible</button></form></div>
    <div className="mb-6 grid gap-4 lg:grid-cols-2"><form onSubmit={addRule} className="rounded-2xl border border-[#E9E1D2] bg-[#F7F6F2] p-4"><div className="mb-3 flex items-center gap-2"><DollarSign className="h-5 w-5 text-[#16B8AA]" /><strong className="text-sm">Tarifas por fechas <span className="font-normal text-[#6B726E]">({rules.length}/5)</span></strong></div><div className="grid gap-2 sm:grid-cols-2"><input required value={ruleName} onChange={(event) => setRuleName(event.target.value)} placeholder="Nombre: septiembre" className="rounded-xl border border-[#E9E1D2] p-3 text-sm" /><input required type="number" min="1" step="0.01" value={rulePrice} onChange={(event) => setRulePrice(event.target.value)} placeholder="€/día" className="rounded-xl border border-[#E9E1D2] p-3 text-sm" /><input required type="date" value={ruleStart} onChange={(event) => setRuleStart(event.target.value)} className="rounded-xl border border-[#E9E1D2] p-3 text-sm" /><input required type="date" value={ruleEnd} onChange={(event) => setRuleEnd(event.target.value)} className="rounded-xl border border-[#E9E1D2] p-3 text-sm" /></div><button disabled={rules.length >= 5} className="mt-3 rounded-full bg-[#16B8AA] px-4 py-2.5 text-xs font-bold text-white disabled:bg-slate-300">Añadir tarifa</button></form><div className="rounded-2xl border border-[#E9E1D2] p-4"><div className="flex items-center gap-2"><CalendarSync className="h-5 w-5 text-[#16B8AA]" /><strong className="text-sm">Sincronizar calendario</strong></div><p className="mt-2 text-xs text-[#6B726E]">Sube un archivo .ics exportado desde Booking, Yescapa u otro calendario. Sus eventos se marcarán como no disponibles.</p><label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#E9E1D2] px-4 py-2.5 text-xs font-bold hover:border-[#16B8AA]"><Upload className="h-4 w-4" />{syncing ? 'Importando…' : 'Subir archivo .ics'}<input type="file" accept=".ics,text/calendar" className="hidden" disabled={syncing} onChange={importCalendar} /></label></div></div>
    {message && <p className="mb-3 text-xs font-bold text-amber-700">{message}</p>}<div className="grid gap-6 md:grid-cols-2"><div><h3 className="mb-2 text-sm font-bold">Periodos bloqueados</h3><div className="space-y-2">{blocks.length === 0 ? <p className="text-sm text-[#6B726E]">No hay bloqueos para esta camper.</p> : blocks.map((block) => <div key={block.id} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${block.reason?.startsWith('BOOKING_') ? 'border-blue-200 bg-blue-50 text-blue-900' : block.reason?.startsWith('SYNC_') ? 'border-violet-200 bg-violet-50 text-violet-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}><span><strong>{new Date(block.startDate).toLocaleDateString('es-ES')} – {new Date(block.endDate).toLocaleDateString('es-ES')}</strong><small className="ml-2">{block.reason?.startsWith('BOOKING_') ? 'Reserva' : block.reason?.startsWith('SYNC_') ? 'Calendario sincronizado' : 'Bloqueo personal'}</small></span>{!block.reason?.startsWith('BOOKING_') && <button type="button" onClick={() => removeBlock(block.id)} aria-label="Desbloquear fechas" className="rounded-full p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>}</div>)}</div></div><div><h3 className="mb-2 text-sm font-bold">Tarifas activas</h3><div className="space-y-2">{rules.length === 0 ? <p className="text-sm text-[#6B726E]">Se usará la tarifa base.</p> : rules.map((rule) => <div key={rule.id} className="flex items-center justify-between rounded-xl border border-[#bbf7d0] bg-green-50 px-4 py-3 text-sm text-green-900"><span><strong>{rule.name}: {rule.pricePerDay} €/día</strong><small className="ml-2">{new Date(rule.startDate).toLocaleDateString('es-ES')} – {new Date(rule.endDate).toLocaleDateString('es-ES')}</small></span><button type="button" onClick={() => removeRule(rule.id)} aria-label="Eliminar tarifa" className="rounded-full p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div>)}</div></div></div></>}
  </section>;
}
