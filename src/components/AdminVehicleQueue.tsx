'use client';
import { useEffect, useState } from 'react';

export default function AdminVehicleQueue() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const load = () => fetch('/api/admin/vehicles').then((response) => response.json()).then((data) => setVehicles(data.vehicles || []));
  useEffect(() => { void load(); }, []);
  async function review(vehicleId: string, action: 'approve' | 'reject') { const response = await fetch('/api/admin/vehicles', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vehicleId, action }) }); if (response.ok) load(); }
  return <section className="mb-10 rounded-3xl border border-[#E9E1D2] bg-white p-6"><h2 className="font-serif text-2xl font-bold">Moderación de anuncios</h2><p className="text-sm text-[#6B726E]">Revisa la ficha y la documentación antes de hacerla pública.</p>{vehicles.length === 0 ? <p className="mt-5 rounded-xl bg-[#F7F6F2] p-4 text-sm">No hay anuncios pendientes.</p> : vehicles.map((vehicle) => <div key={vehicle.id} className="mt-5 flex flex-wrap items-center gap-4 border-t border-[#E9E1D2] pt-5"><img src={vehicle.photos[0]?.url} alt="" className="h-20 w-28 rounded-xl object-cover" /><div className="min-w-0 flex-1"><strong>{vehicle.title}</strong><p className="text-xs text-[#6B726E]">{vehicle.brand} {vehicle.model} · {vehicle.island} · {vehicle.owner.firstName} {vehicle.owner.lastName}</p><p className="text-xs">Estado: {vehicle.status}</p></div><a href={`/camper/${vehicle.slug}`} className="rounded-full border border-[#E9E1D2] px-4 py-2 text-xs font-bold">Ver ficha</a><button onClick={() => review(vehicle.id, 'approve')} className="rounded-full bg-[#16B8AA] px-4 py-2 text-xs font-bold text-white">Aprobar</button><button onClick={() => review(vehicle.id, 'reject')} className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-700">Rechazar</button></div>)}</section>;
}
