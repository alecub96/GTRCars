'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw, RefreshCw } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    console.error('GTR Cars route error:', error);
    const errorStr = (error?.message || error?.name || '').toLowerCase();
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      errorStr.includes('loading chunk') ||
      errorStr.includes('loading css chunk') ||
      errorStr.includes('failed to fetch dynamically imported module') ||
      errorStr.includes('dynamically imported');

    if (isChunkError && typeof window !== 'undefined') {
      setIsRecovering(true);
      const storageKey = 'gtrcars_chunk_reload';
      const lastReload = sessionStorage.getItem(storageKey);
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 4000) {
        sessionStorage.setItem(storageKey, now.toString());
        const cleanPath = window.location.pathname;
        const search = window.location.search;
        const separator = search ? '&' : '?';
        window.location.replace(`${cleanPath}${search}${separator}_v=${now}`);
      }
    }
  }, [error]);

  if (isRecovering) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] px-4 text-white">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
            Sincronizando telemetría con GTR Cars...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070707] px-4 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0f0f12] p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="mt-6 text-[10px] font-mono font-bold uppercase tracking-[.25em] text-[#D4AF37]">
          Incidencia Temporal
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-white">
          No hemos podido cargar esta sección
        </h1>
        <p className="mt-4 text-xs font-mono leading-relaxed text-neutral-400">
          Tus datos y reservas no se han perdido. Reintenta la conexión o vuelve al Vault principal.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                const now = Date.now();
                const search = window.location.search;
                const sep = search ? '&' : '?';
                window.location.replace(`${window.location.pathname}${search}${sep}_r=${now}`);
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] px-6 py-3 text-xs font-mono font-bold text-black hover:brightness-110 transition-all cursor-pointer shadow-lg"
          >
            <RotateCcw className="h-4 w-4" />
            Reintentar
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-neutral-900 px-6 py-3 text-xs font-mono font-bold text-white hover:bg-neutral-800 transition-all"
          >
            <Home className="h-4 w-4" />
            Volver al Inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
