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
      <div className="w-full">
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-2xl border border-[#16B8AA]/40 bg-[#F4F9F8] hover:bg-[#16B8AA] hover:text-white text-[#13322E] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs group cursor-pointer ${className}`}
        >
          <MessageSquare className="w-4 h-4 text-[#16B8AA] group-hover:text-white transition-colors" />
          <span>Contactar a {ownerName}</span>
        </button>
        {notice && (
          <p className="mt-2 text-[11px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 text-center animate-fade-in">
            {notice}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'outline') {
    return (
      <div>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`inline-flex items-center space-x-2 py-2 px-3.5 rounded-full border border-[#16B8AA] bg-white text-[#16B8AA] hover:bg-[#16B8AA] hover:text-white font-bold text-xs transition-all shadow-xs cursor-pointer ${className}`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Preguntar al propietario</span>
        </button>
        {notice && (
          <p className="mt-2 text-[11px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 text-center">
            {notice}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`w-full py-3.5 px-4 rounded-full bg-[#13322E] hover:bg-[#16B8AA] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 cursor-pointer ${className}`}
      >
        <MessageSquare className="w-4 h-4 text-[#16B8AA] group-hover:text-white" />
        <span>Enviar mensaje a {ownerName}</span>
      </button>
      {notice && (
        <p className="mt-2 text-[11px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 text-center">
          {notice}
        </p>
      )}
    </div>
  );
}
