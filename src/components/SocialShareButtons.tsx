'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Send } from 'lucide-react';

interface SocialShareButtonsProps {
  title?: string;
  url?: string;
  className?: string;
}

export default function SocialShareButtons({
  title = 'Alquiler de Campers en Canarias | vaneando.com',
  url,
  className = '',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : 'https://vaneando.com';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      <span className="text-xs font-bold text-[#6B726E] flex items-center gap-1.5 mr-1">
        <Share2 className="w-3.5 h-3.5 text-[#16B8AA]" />
        <span>Compartir:</span>
      </span>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en WhatsApp"
        className="h-8 w-8 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white flex items-center justify-center transition-all shadow-xs"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en Telegram"
        className="h-8 w-8 rounded-full bg-[#0088cc]/15 hover:bg-[#0088cc] text-[#0088cc] hover:text-white flex items-center justify-center transition-all shadow-xs"
      >
        <Send className="w-4 h-4" />
      </a>

      {/* Copiar Enlace */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar enlace"
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#E9E1D2] bg-white hover:bg-[#FAF7F0] text-xs font-bold text-[#13322E] transition-all cursor-pointer shadow-xs"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">¡Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-[#6B726E]" />
            <span>Copiar enlace</span>
          </>
        )}
      </button>
    </div>
  );
}
