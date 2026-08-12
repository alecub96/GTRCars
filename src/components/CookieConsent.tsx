'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  // localStorage solo está disponible después de hidratar el componente cliente.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setVisible(localStorage.getItem('vaneando-cookie-consent') !== 'accepted'); }, []);
  if (!visible) return null;
  return <aside role="dialog" aria-label="Preferencias de cookies" className="fixed inset-x-4 bottom-4 z-[10000] mx-auto max-w-3xl rounded-3xl border border-[#E9E1D2] bg-white p-5 text-[#13322E] shadow-2xl"><h2 className="font-serif text-xl font-bold">Tu privacidad importa</h2><p className="mt-2 text-sm text-[#6B726E]">Usamos cookies necesarias para iniciar sesión, mantener tu reserva y proteger la plataforma. Consulta nuestra <Link href="/cookies" className="font-bold text-[#0F766E] underline">política de cookies</Link>.</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => { localStorage.setItem('vaneando-cookie-consent', 'accepted'); setVisible(false); }} className="rounded-full bg-[#13322E] px-5 py-2.5 text-xs font-bold text-white">Aceptar cookies necesarias</button><Link href="/cookies" className="rounded-full border border-[#E9E1D2] px-5 py-2.5 text-xs font-bold">Ver preferencias</Link></div></aside>;
}
