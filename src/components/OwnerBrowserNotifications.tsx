'use client';

import { useEffect, useState } from 'react';

export default function OwnerBrowserNotifications() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(typeof Notification !== 'undefined' && Notification.permission === 'granted');
    if (typeof Notification === 'undefined' || Notification.permission === 'denied') return;
    let firstRun = true;
    const check = async () => {
      try {
        const response = await fetch('/api/bookings?as=owner', { cache: 'no-store' });
        const data = await response.json();
        const pending = (data.bookings || []).filter((booking: { status: string }) => booking.status === 'REQUESTED');
        const known = new Set(JSON.parse(localStorage.getItem('vaneando-owner-bookings') || '[]'));
        const fresh = pending.filter((booking: { id: string }) => !known.has(booking.id));
        pending.forEach((booking: { id: string }) => known.add(booking.id));
        localStorage.setItem('vaneando-owner-bookings', JSON.stringify([...known].slice(-100)));
        if (!firstRun && Notification.permission === 'granted') fresh.forEach((booking: { id: string; code: string; vehicle?: { title?: string } }) => new Notification('Nueva solicitud en Vaneando', { body: `${booking.vehicle?.title || 'Tu camper'} · ${booking.code}`, icon: '/icon-192.png' }));
        firstRun = false;
      } catch { /* La notificación no debe interrumpir el panel. */ }
    };
    check();
    const timer = window.setInterval(check, 30000);
    return () => window.clearInterval(timer);
  }, []);

  async function enable() {
    if (typeof Notification === 'undefined') return;
    const permission = await Notification.requestPermission();
    setEnabled(permission === 'granted');
  }

  if (enabled) return <span className="text-xs font-bold text-[#16B8AA]">🔔 Avisos del navegador activos</span>;
  if (typeof Notification === 'undefined') return null;
  return <button type="button" onClick={enable} className="rounded-full border border-[#16B8AA] px-3 py-2 text-xs font-bold text-[#13322E]">Activar avisos en este dispositivo</button>;
}
