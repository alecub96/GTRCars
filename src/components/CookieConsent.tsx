'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vaneando-cookie-consent');
    if (!consent) {
      setVisible(true);
    } else if (consent === 'all') {
      updateGoogleConsent(true);
    }
  }, []);

  const updateGoogleConsent = (granted: boolean) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
      });
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem('vaneando-cookie-consent', 'all');
    updateGoogleConsent(true);
    setVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('vaneando-cookie-consent', 'necessary');
    updateGoogleConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-4 bottom-4 z-[10000] mx-auto max-w-3xl rounded-3xl border border-[#E9E1D2] bg-white p-5 text-[#13322E] shadow-2xl animate-fade-in-up"
    >
      <h2 className="font-serif text-xl font-bold">Tu privacidad en Vaneando</h2>
      <p className="mt-2 text-xs sm:text-sm text-[#6B726E] leading-relaxed">
        Utilizamos cookies técnicas necesarias para la navegación, autenticación y gestión de reservas, así como analítica agregada para mejorar la experiencia insular. Consulta nuestra{' '}
        <Link href="/cookies" className="font-bold text-[#16B8AA] underline">
          política de cookies
        </Link>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleAcceptAll}
          className="rounded-full bg-[#16B8AA] hover:bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
        >
          Aceptar Todas
        </button>
        <button
          type="button"
          onClick={handleAcceptNecessary}
          className="rounded-full bg-[#13322E] hover:bg-[#1f4e48] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
        >
          Solo Necesarias
        </button>
        <Link
          href="/cookies"
          className="rounded-full border border-[#E9E1D2] bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-bold text-[#13322E] transition-all"
        >
          Preferencias
        </Link>
      </div>
    </aside>
  );
}
