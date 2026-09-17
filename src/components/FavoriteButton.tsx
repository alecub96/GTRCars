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
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:border-gray-400 flex items-center justify-center shadow-xs hover:scale-105 transition-all cursor-pointer"
    >
      <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-black text-black' : 'text-gray-500 hover:text-black'}`} />
    </button>
  );
}
