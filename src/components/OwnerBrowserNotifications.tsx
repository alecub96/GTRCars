'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

export default function OwnerBrowserNotifications({ audience = 'owner' }: { audience?: 'owner' | 'admin' }) {
  const [enabled, setEnabled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    setEnabled(typeof Notification !== 'undefined' && Notification.permission === 'granted');
    if (typeof Notification !== 'undefined' && Notification.permission === 'default' && !sessionStorage.getItem('vaneando-push-prompt')) {
      const timer = window.setTimeout(() => setShowPrompt(true), 900);
      sessionStorage.setItem('vaneando-push-prompt', '1');
      return () => window.clearTimeout(timer);
    }
    if (typeof Notification === 'undefined' || Notification.permission === 'denied') return;
    if (Notification.permission === 'granted') registerPush();
    let firstRun = true;
    const check = async () => {
      try {
        if (audience === 'admin') return;
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
  }, [audience]);

  async function registerPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const response = await fetch('/api/notifications/subscribe');
    const { publicKey } = await response.json();
    if (!publicKey) return;
    const registration = await navigator.serviceWorker.register('/sw.js');
    const raw = atob(publicKey.replace(/-/g, '+').replace(/_/g, '/'));
    const applicationServerKey = Uint8Array.from(raw, (char) => char.charCodeAt(0));
    const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
    await fetch('/api/notifications/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subscription) });
  }

  async function enable() {
    if (typeof Notification === 'undefined') return;
    const permission = await Notification.requestPermission();
    setEnabled(permission === 'granted');
    if (permission === 'granted') await registerPush();
  }

  if (enabled) return <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16B8AA]"><Bell className="h-3.5 w-3.5" /> Avisos del navegador activos</span>;
  const supported = typeof Notification !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
  if (!supported) return <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900">Para recibir avisos en este móvil, añade Vaneando a la pantalla de inicio y activa las notificaciones del sistema.</div>;
  return <>
    <button type="button" onClick={enable} className="rounded-full bg-[#16B8AA] px-4 py-2.5 text-xs font-black text-white shadow-sm">Activar avisos de reservas</button>
    {showPrompt && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#13322E]/45 p-4 sm:items-center"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-3xl bg-white p-6 text-[#13322E] shadow-2xl"><div className="mb-3 text-3xl"></div><h2 className="font-serif text-2xl font-bold">Activa tus avisos de Vaneando</h2><p className="mt-2 text-sm leading-6 text-[#6B726E]">Recibirás avisos importantes de reservas y actividad de la plataforma aunque no tengas Vaneando abierto.</p><div className="mt-5 flex gap-3"><button type="button" onClick={async () => { await enable(); setShowPrompt(false); }} className="flex-1 rounded-full bg-[#13322E] px-4 py-3 text-xs font-black text-white">Activar avisos</button><button type="button" onClick={() => setShowPrompt(false)} className="rounded-full border border-[#E9E1D2] px-4 py-3 text-xs font-bold">Ahora no</button></div></div></div>}
  </>;
}
