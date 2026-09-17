'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    console.error('GTR Cars global error:', error);
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

  return (
    <html lang="es">
      <body className="flex min-h-screen items-center justify-center bg-white px-4 text-white font-mono selection:bg-[#D4AF37] selection:text-black">
        <main className="max-w-lg rounded-3xl bg-gray-50 p-10 text-center shadow-2xl border border-gray-200">
          {isRecovering ? (
            <div className="space-y-4">
              <RefreshCw className="w-8 h-8 text-black animate-spin mx-auto" />
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-black">
                Sincronizando con GTR Cars...
              </p>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[.25em] text-black">GTR CARS // VAULT</p>
              <h1 className="mt-3 font-serif text-3xl font-bold text-black">Incidencia temporal de conexión</h1>
              <p className="mt-4 text-xs font-mono text-gray-500">Reintenta la carga para sincronizar la telemetría.</p>
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
                className="mt-7 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] px-6 py-3 text-xs font-mono font-bold text-black uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg"
              >
                Reintentar
              </button>
            </>
          )}
        </main>
      </body>
    </html>
  );
}
