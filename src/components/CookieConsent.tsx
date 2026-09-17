'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

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
  const updateClarityConsent = (granted: boolean) => { if (typeof window !== 'undefined' && (window as any).clarity) (window as any).clarity('consent', granted); };

  useEffect(() => {
    const consent = localStorage.getItem('vaneando-cookie-consent');
    if (!consent) {
      setVisible(true);
    } else if (consent === 'all') {
      updateGoogleConsent(true);
      updateClarityConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('vaneando-cookie-consent', 'all');
    updateGoogleConsent(true);
    updateClarityConsent(true);
    window.dispatchEvent(new Event('vaneando-consent-updated'));
    setVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('vaneando-cookie-consent', 'necessary');
    updateGoogleConsent(false);
    updateClarityConsent(false);
    window.dispatchEvent(new Event('vaneando-consent-updated'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Preferencias de privacidad y telemetría"
      className="fixed inset-x-4 bottom-4 z-[10000] mx-auto max-w-3xl rounded-3xl border border-white/15 bg-[#0f0f12]/95 backdrop-blur-xl p-5 text-white shadow-2xl animate-fade-in-up font-sans"
    >
      <div className="flex items-center space-x-2 font-mono text-[10px] text-[#D4AF37] uppercase tracking-widest mb-1">
        <span>// PRIVACIDAD & PROTOCOLO TELEMETRÍA</span>
      </div>
      <h2 className="text-lg font-bold text-white tracking-tight">Privacidad y Telemetría en GT Cars</h2>
      <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed font-light">
        Utilizamos cookies técnicas necesarias para la navegación, autenticación en el Vault y gestión de reservas, así como analítica agregada para optimizar la experiencia de conducción. Consulta nuestra{' '}
        <Link href="/cookies" className="font-bold text-[#D4AF37] underline hover:text-white transition-colors">
          política de cookies
        </Link>.
      </p>
      <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 font-mono">
        <button
          type="button"
          onClick={handleAcceptNecessary}
          className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
        >
          Solo Técnicas
        </button>
        <button
          type="button"
          onClick={handleAcceptAll}
          className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-md hover:brightness-110 transition-all cursor-pointer"
        >
          Aceptar Todo
        </button>
      </div>
    </aside>
  );
}
