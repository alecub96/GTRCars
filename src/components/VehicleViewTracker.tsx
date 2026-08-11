'use client';

import { useEffect } from 'react';

export default function VehicleViewTracker({ vehicleId }: { vehicleId: string }) {
  useEffect(() => {
    const key = `vaneando-view-${vehicleId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    fetch(`/api/vehicles/${vehicleId}/view`, { method: 'POST', keepalive: true }).catch(() => undefined);
  }, [vehicleId]);
  return null;
}
