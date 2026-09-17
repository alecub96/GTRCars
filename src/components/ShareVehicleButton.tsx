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
    return `Descubre esta unidad de superdeportivo${islandText}${priceText} en GT Cars Vault: ${vehicleTitle}`;
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = getFullUrl();
    const shareText = getShareText();
    trackEvent('vehicle_share', { channel: 'share' in navigator ? 'native' : 'fallback' });

    // Intentar Web Share API nativa
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: vehicleTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    // Modal fallback
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
          aria-label="Compartir este superdeportivo"
          title="Compartir"
          className={`h-10 w-10 rounded-xl bg-white/[0.05] backdrop-blur-md hover:bg-white/[0.1] text-white hover:text-[#D4AF37] border border-white/10 flex items-center justify-center transition-all shadow-md active:scale-90 cursor-pointer ${className}`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleShareClick}
          aria-label="Compartir este superdeportivo"
          className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#D4AF37]/50 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer ${className}`}
        >
          <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Compartir</span>
        </button>
      )}

      {/* MODAL DE COMPARTIR FALLBACK */}
      {showModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-sans"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#0f0f12] p-6 shadow-2xl border border-white/15 space-y-5 animate-fade-in-up text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Compartir Supercar</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-white/60 line-clamp-2 font-mono">
              {vehicleTitle}
            </p>

            {/* OPCIONES DE COMPARTIR */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/[0.03] hover:bg-emerald-500/20 border border-white/10 text-emerald-400 font-bold text-xs transition-all"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/[0.03] hover:bg-sky-500/20 border border-white/10 text-sky-400 font-bold text-xs transition-all"
              >
                <Send className="w-5 h-5 text-sky-400" />
                <span>Telegram</span>
              </a>
            </div>

            {/* COPIAR ENLACE DIRECTO */}
            <div className="pt-2 font-mono">
              <button
                type="button"
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-white/10 text-[#D4AF37] border border-[#D4AF37]/50'
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black hover:brightness-110'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Enlace copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Enlace de Vault</span>
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
