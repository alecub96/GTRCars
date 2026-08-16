'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    console.error('Vaneando global error:', error);
    const errorStr = (error?.message || error?.name || '').toLowerCase();
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      errorStr.includes('loading chunk') ||
      errorStr.includes('loading css chunk') ||
      errorStr.includes('failed to fetch dynamically imported module') ||
      errorStr.includes('dynamically imported');

    if (isChunkError && typeof window !== 'undefined') {
      setIsRecovering(true);
      const storageKey = 'vaneando_chunk_reload';
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
      <body className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 text-[#13322E]">
        <main className="max-w-lg rounded-[36px] bg-white p-10 text-center shadow-xl border border-[#E9E1D2]">
          {isRecovering ? (
            <div className="space-y-4">
              <RefreshCw className="w-8 h-8 text-[#16B8AA] animate-spin mx-auto" />
              <p className="text-xs font-black uppercase tracking-widest text-[#16B8AA]">
                Sincronizando con la última versión de Vaneando...
              </p>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-black uppercase tracking-[.25em] text-[#16B8AA]">vaneando.</p>
              <h1 className="mt-3 font-serif text-3xl font-bold">Ha ocurrido una incidencia temporal.</h1>
              <p className="mt-4 text-sm text-[#6B726E]">Reintenta la carga para sincronizar la última versión limpia.</p>
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
                className="mt-7 rounded-full bg-[#16B8AA] px-6 py-3 text-xs font-bold text-white cursor-pointer"
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
