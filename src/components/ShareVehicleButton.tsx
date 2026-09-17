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
      if (slug) return `${window.location.origin}/coche/${slug}`;
      return window.location.href;
    }
    return `https://gtrcars.es/coche/${slug || ''}`;
  };

  const getShareText = () => {
    const priceText = price ? ` por ${price}€/día` : '';
    const islandText = island ? ` en ${island}` : '';
    return `Descubre esta unidad de superdeportivo${islandText}${priceText} en GTRCars: ${vehicleTitle}`;
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
          className={`h-10 w-10 rounded-xl bg-white hover:bg-gray-100 text-gray-700 hover:text-black border border-gray-200 flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer ${className}`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleShareClick}
          aria-label="Compartir este superdeportivo"
          className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 hover:border-gray-400 text-black text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer ${className}`}
        >
          <Share2 className="w-3.5 h-3.5 text-black" />
          <span>Compartir</span>
        </button>
      )}

      {/* MODAL DE COMPARTIR FALLBACK */}
      {showModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in font-sans"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-5 animate-fade-in-up text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 font-mono">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-black" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-black">Compartir Superdeportivo</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 line-clamp-2 font-mono">
              {vehicleTitle}
            </p>

            {/* OPCIONES DE COMPARTIR */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 text-emerald-700 font-bold text-xs transition-all"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-gray-50 hover:bg-sky-50 border border-gray-200 text-sky-700 font-bold text-xs transition-all"
              >
                <Send className="w-5 h-5 text-sky-600" />
                <span>Telegram</span>
              </a>
            </div>

            {/* COPIAR ENLACE DIRECTO */}
            <div className="pt-2 font-mono">
              <button
                type="button"
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-gray-100 text-black border border-gray-300'
                    : 'bg-black text-white hover:bg-gray-800'
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
                    <span>Copiar Enlace</span>
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
