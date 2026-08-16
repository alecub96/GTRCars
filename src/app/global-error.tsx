'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    const errorStr = (error?.message || error?.name || '').toLowerCase();
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      errorStr.includes('loading chunk') ||
      errorStr.includes('loading css chunk') ||
      errorStr.includes('failed to fetch dynamically imported module');

    if (isChunkError && typeof window !== 'undefined') {
      const storageKey = 'vaneando_chunk_reload';
      const lastReload = sessionStorage.getItem(storageKey);
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
        sessionStorage.setItem(storageKey, now.toString());
        window.location.href = window.location.pathname + window.location.search;
      }
    }
  }, [error]);

  return (
    <html lang="es">
      <body className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 text-[#13322E]">
        <main className="max-w-lg rounded-[36px] bg-white p-10 text-center shadow-xl border border-[#E9E1D2]">
          <p className="text-[10px] font-black uppercase tracking-[.25em] text-[#16B8AA]">vaneando.</p>
          <h1 className="mt-3 font-serif text-3xl font-bold">Ha ocurrido una incidencia temporal.</h1>
          <p className="mt-4 text-sm text-[#6B726E]">Reintenta la carga para sincronizar la última versión limpia.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-7 rounded-full bg-[#16B8AA] px-6 py-3 text-xs font-bold text-white cursor-pointer">Reintentar</button>
        </main>
      </body>
    </html>
  );
}
