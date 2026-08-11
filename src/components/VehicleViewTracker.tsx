'use client';

import { useEffect } from 'react';

export default function VehicleViewTracker({ vehicleId, event = 'VIEW' }: { vehicleId: string; event?: 'VIEW' | 'IMPRESSION' }) {
  useEffect(() => {
    const key = `vaneando-${event.toLowerCase()}-${vehicleId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    fetch(`/api/vehicles/${vehicleId}/view`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event }), keepalive: true }).catch(() => undefined);
  }, [vehicleId, event]);
  return null;
}
