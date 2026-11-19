'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Send } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface SocialShareButtonsProps {
  title?: string;
  url?: string;
  className?: string;
}

export default function SocialShareButtons({
  title = 'Alquiler de Superdeportivos | GTR Cars',
  url,
  className = '',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? url || window.location.href : 'https://gtrcars.es';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      trackEvent('social_share_click', { channel: 'copy' });
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  return (
    <div className={`flex items-center flex-wrap gap-2 font-mono ${className}`}>
      <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mr-1">
        <Share2 className="w-3.5 h-3.5 text-black" />
        <span>Compartir:</span>
      </span>

      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('whatsapp_clicked', { placement: 'share' })}
        aria-label="Compartir en WhatsApp"
        className="h-8 w-8 rounded-full bg-gray-100 hover:bg-black text-black hover:text-white flex items-center justify-center transition-all shadow-xs"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en Telegram"
        className="h-8 w-8 rounded-full bg-gray-100 hover:bg-black text-black hover:text-white flex items-center justify-center transition-all shadow-xs"
      >
        <Send className="w-4 h-4" />
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar enlace"
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:border-black text-xs font-bold text-black transition-all cursor-pointer shadow-xs"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">¡Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-gray-600" />
            <span>Copiar enlace</span>
          </>
        )}
      </button>
    </div>
  );
}
