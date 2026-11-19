'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

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

  const updateClarityConsent = (granted: boolean) => {
    if (typeof window !== 'undefined' && (window as any).clarity) {
      (window as any).clarity('consent', granted);
    }
  };

  useEffect(() => {
    const consent = localStorage.getItem('gtrcars-cookie-consent');
    if (!consent) {
      setVisible(true);
    } else if (consent === 'all') {
      updateGoogleConsent(true);
      updateClarityConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('gtrcars-cookie-consent', 'all');
    updateGoogleConsent(true);
    updateClarityConsent(true);
    window.dispatchEvent(new Event('gtrcars-consent-updated'));
    setVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('gtrcars-cookie-consent', 'necessary');
    updateGoogleConsent(false);
    updateClarityConsent(false);
    window.dispatchEvent(new Event('gtrcars-consent-updated'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-label="Preferencias de privacidad y cookies"
      className="fixed inset-x-4 bottom-4 z-[10000] mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white/98 backdrop-blur-xl p-5 sm:p-6 text-black shadow-2xl animate-fade-in-up font-sans"
    >
      <div className="flex items-center space-x-2 font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-black" />
        <span>PRIVACIDAD RGPD &amp; TELEMETRÍA GTR CARS</span>
      </div>
      <h2 className="text-base sm:text-lg font-black text-black tracking-tight uppercase">
        Control de Cookies y Privacidad
      </h2>
      <p className="mt-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
        Utilizamos cookies técnicas indispensables para la autenticación segura, custodia de pagos con Stripe y gestión de reservas, así como analítica (GA4 y Microsoft Clarity) para optimizar tu experiencia. Consulta nuestra{' '}
        <Link href="/cookies" className="font-bold text-black underline hover:text-gray-700 transition-colors">
          Política de Cookies
        </Link>{' '}
        y{' '}
        <Link href="/privacidad" className="font-bold text-black underline hover:text-gray-700 transition-colors">
          Privacidad
        </Link>.
      </p>
      <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 font-mono">
        <button
          type="button"
          onClick={handleAcceptNecessary}
          className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-black hover:border-black hover:bg-gray-50 transition-all cursor-pointer"
        >
          Solo Necesarias
        </button>
        <button
          type="button"
          onClick={handleAcceptAll}
          className="rounded-full bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition-all cursor-pointer"
        >
          Aceptar Todas
        </button>
      </div>
    </aside>
  );
}
