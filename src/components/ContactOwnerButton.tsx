'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, ShieldCheck } from 'lucide-react';

interface ContactOwnerButtonProps {
  ownerId: string;
  ownerName?: string;
  vehicleId: string;
  vehicleTitle?: string;
  isOwner?: boolean;
  variant?: 'button' | 'outline' | 'card';
  className?: string;
}

export default function ContactOwnerButton({
  ownerId,
  ownerName = 'el propietario',
  vehicleId,
  vehicleTitle = 'este vehículo',
  isOwner = false,
  variant = 'button',
  className = '',
}: ContactOwnerButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleClick = async () => {
    if (isOwner) {
      setNotice('Este es tu propio anuncio. Los viajeros utilizarán este botón para consultarte dudas.');
      setTimeout(() => setNotice(null), 4000);
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (!data?.user) {
        // Abrir modal de autenticación para que inicie sesión o se registre
        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
        return;
      }

      if (data.user.id === ownerId) {
        setNotice('Este es tu propio anuncio.');
        setTimeout(() => setNotice(null), 4000);
        return;
      }

      // Redirigir a la bandeja de mensajes con los parámetros de la camper
      router.push(`/mensajes?vehicleId=${encodeURIComponent(vehicleId)}&recipientId=${encodeURIComponent(ownerId)}`);
    } catch (err) {
      console.error('Error opening chat with owner:', err);
      router.push(`/mensajes?vehicleId=${encodeURIComponent(vehicleId)}&recipientId=${encodeURIComponent(ownerId)}`);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'card') {
    return (
      <div className="w-full font-mono">
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`w-full py-3.5 px-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs group cursor-pointer ${className}`}
        >
          <MessageSquare className="w-4 h-4 text-[#D4AF37] transition-colors" />
          <span className="uppercase tracking-wider">Contactar a {ownerName}</span>
        </button>
        {notice && (
          <p className="mt-2 text-[11px] font-semibold text-amber-300 bg-amber-950/40 p-2 rounded-xl border border-amber-500/30 text-center animate-fade-in">
            {notice}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'outline') {
    return (
      <div className="font-mono">
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`inline-flex items-center space-x-2 py-2.5 px-4 rounded-xl border border-white/15 bg-white/[0.03] text-white/80 hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer ${className}`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Consultar al Propietario</span>
        </button>
        {notice && (
          <p className="mt-2 text-[11px] font-semibold text-amber-300 bg-amber-950/40 p-2 rounded-xl border border-amber-500/30 text-center">
            {notice}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="font-mono">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center space-x-2 py-3 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md active:scale-95 cursor-pointer ${className}`}
      >
        <MessageSquare className="w-4 h-4" />
        <span>Enviar Mensaje</span>
      </button>
      {notice && (
        <p className="mt-2 text-[11px] font-semibold text-amber-300 bg-amber-950/40 p-2 rounded-xl border border-amber-500/30 text-center">
          {notice}
        </p>
      )}
    </div>
  );
}
