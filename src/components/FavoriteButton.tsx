'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

export default function FavoriteButton({ vehicleId }: { vehicleId: string }) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { fetch('/api/favorites').then((r) => r.ok ? r.json() : null).then((data) => setSaved(Boolean(data?.favorites?.some((f: any) => f.vehicleId === vehicleId)))).catch(() => {}); }, [vehicleId]);
  async function toggle() {
    setBusy(true);
    const response = await fetch('/api/favorites', { method: saved ? 'DELETE' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vehicleId }) });
    if (response.ok) setSaved(!saved);
    setBusy(false);
  }
  return <button type="button" onClick={toggle} disabled={busy} aria-label={saved ? 'Quitar de favoritos' : 'Añadir a favoritos'} className="w-11 h-11 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-105 transition-transform"><Heart className={`w-5 h-5 ${saved ? 'fill-[#b88a55] text-[#b88a55]' : 'text-[#13322E]'}`} /></button>;
}
