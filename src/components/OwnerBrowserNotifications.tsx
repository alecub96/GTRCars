'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

export default function OwnerBrowserNotifications({ audience = 'owner' }: { audience?: 'owner' | 'admin' }) {
  const [enabled, setEnabled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    setEnabled(typeof Notification !== 'undefined' && Notification.permission === 'granted');
    if (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'default' &&
      !sessionStorage.getItem('gtrcars-push-prompt')
    ) {
      const timer = window.setTimeout(() => setShowPrompt(true), 900);
      sessionStorage.setItem('gtrcars-push-prompt', '1');
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
        const known = new Set(JSON.parse(localStorage.getItem('gtrcars-owner-bookings') || '[]'));
        const fresh = pending.filter((booking: { id: string }) => !known.has(booking.id));
        pending.forEach((booking: { id: string }) => known.add(booking.id));
        localStorage.setItem('gtrcars-owner-bookings', JSON.stringify([...known].slice(-100)));
        if (!firstRun && Notification.permission === 'granted') {
          fresh.forEach((booking: { id: string; code: string; vehicle?: { title?: string } }) =>
            new Notification('Nueva solicitud en GTR Cars', {
              body: `${booking.vehicle?.title || 'Tu superdeportivo'} · ${booking.code}`,
              icon: '/icon-192.png',
            })
          );
        }
        firstRun = false;
      } catch {}
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
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });
  }

  async function enable() {
    if (typeof Notification === 'undefined') return;
    const permission = await Notification.requestPermission();
    setEnabled(permission === 'granted');
    if (permission === 'granted') await registerPush();
  }

  if (enabled)
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-black">
        <Bell className="h-3.5 w-3.5 text-black" /> Avisos del navegador activos
      </span>
    );
  const supported = typeof Notification !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
  if (!supported)
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-mono font-bold text-gray-700">
        Añade GTR Cars a tu pantalla de inicio para recibir alertas push en tiempo real.
      </div>
    );
  return (
    <>
      <button
        type="button"
        onClick={enable}
        className="rounded-full bg-black hover:bg-neutral-800 px-4 py-2.5 text-xs font-mono font-black text-white shadow-sm cursor-pointer"
      >
        Activar avisos de reservas
      </button>
      {showPrompt && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center font-sans">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-3xl bg-white border border-gray-200 p-6 text-black shadow-2xl"
          >
            <h2 className="text-xl font-black uppercase tracking-tight">Activa tus avisos de GTR Cars</h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600">
              Recibirás notificaciones instantáneas de nuevas reservas, mensajes y verificaciones en tiempo real.
            </p>
            <div className="mt-5 flex gap-3 font-mono">
              <button
                type="button"
                onClick={async () => {
                  await enable();
                  setShowPrompt(false);
                }}
                className="flex-1 rounded-full bg-black hover:bg-neutral-800 px-4 py-3 text-xs font-black uppercase tracking-wider text-white cursor-pointer"
              >
                Activar avisos
              </button>
              <button
                type="button"
                onClick={() => setShowPrompt(false)}
                className="rounded-full border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700 hover:text-black cursor-pointer"
              >
                Ahora no
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
