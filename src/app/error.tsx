'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw, RefreshCw } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    console.error('Vaneando route error:', error);
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

  if (isRecovering) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 text-[#13322E]">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#16B8AA] animate-spin mx-auto" />
          <p className="text-xs font-black uppercase tracking-widest text-[#16B8AA]">
            Sincronizando con la última versión de Vaneando...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 text-[#13322E]">
      <section className="w-full max-w-lg rounded-[36px] border border-[#E9E1D2] bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <AlertTriangle />
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[.25em] text-[#16B8AA]">
          Incidencia temporal
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold">No hemos podido cargar esta sección.</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#6B726E]">
          Tus datos no se han perdido. Reintenta la operación o vuelve al inicio mientras recuperamos la conexión.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
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
            className="flex items-center gap-2 rounded-full bg-[#16B8AA] px-5 py-3 text-xs font-bold text-white cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Reintentar
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-[#E9E1D2] px-5 py-3 text-xs font-bold"
          >
            <Home className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
