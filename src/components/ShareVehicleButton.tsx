'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Send, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ShareVehicleButtonProps {
  vehicleTitle: string;
  slug?: string;
  island?: string;
  price?: number;
  variant?: 'button' | 'icon';
  className?: string;
}

export default function ShareVehicleButton({
  vehicleTitle,
  slug,
  island,
  price,
  variant = 'button',
  className = '',
}: ShareVehicleButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    if (typeof window !== 'undefined') {
      if (slug) return `${window.location.origin}/camper/${slug}`;
      return window.location.href;
    }
    return `https://vaneando.com/camper/${slug || ''}`;
  };

  const getShareText = () => {
    const priceText = price ? ` por ${price}€/día` : '';
    const islandText = island ? ` en ${island}` : '';
    return `¡Mira esta camper${islandText}${priceText} en Vaneando!: ${vehicleTitle}`;
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = getFullUrl();
    const shareText = getShareText();
    trackEvent('vehicle_share', { channel: 'share' in navigator ? 'native' : 'fallback' });

    // Intentar Web Share API nativa (WhatsApp, Instagram, AirDrop, Telegram en móviles)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: vehicleTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        // Si el usuario cancela, no hacemos nada; si da error, abrimos modal fallback
        if (err?.name === 'AbortError') return;
      }
    }

    // Modal fallback para escritorio o navegadores sin Web Share
    setShowModal(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getFullUrl());
      trackEvent('social_share_click', { channel: 'copy', placement: 'vehicle' });
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  const encodedUrl = encodeURIComponent(getFullUrl());
  const encodedText = encodeURIComponent(getShareText());

  return (
    <>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={handleShareClick}
          aria-label="Compartir este vehículo"
          title="Compartir"
          className={`h-9 w-9 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#13322E] hover:text-[#16B8AA] flex items-center justify-center transition-all shadow-md active:scale-90 cursor-pointer ${className}`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleShareClick}
          aria-label="Compartir este anuncio"
          className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-full border border-[#E9E1D2] bg-white hover:bg-slate-50 text-[#13322E] hover:text-[#16B8AA] text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${className}`}
        >
          <Share2 className="w-3.5 h-3.5 text-[#16B8AA]" />
          <span>Compartir</span>
        </button>
      )}

      {/* MODAL DE COMPARTIR FALLBACK */}
      {showModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#E9E1D2] space-y-5 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E9E1D2] pb-3">
              <div className="flex items-center space-x-2 text-[#13322E]">
                <Share2 className="w-5 h-5 text-[#16B8AA]" />
                <h3 className="font-serif text-lg font-bold">Compartir anuncio</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B726E] line-clamp-2">
              {vehicleTitle}
            </p>

            {/* OPCIONES DE COMPARTIR */}
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs transition-all"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-3 rounded-2xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] font-bold text-xs transition-all"
              >
                <Send className="w-5 h-5" />
                <span>Telegram</span>
              </a>
            </div>

            {/* COPIAR ENLACE DIRECTO */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-[#13322E] text-[#16B8AA]'
                    : 'bg-[#16B8AA] hover:bg-[#0F766E] text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Enlace copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar enlace del anuncio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
