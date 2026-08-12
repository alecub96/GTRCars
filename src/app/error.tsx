'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Vaneando route error:', error); }, [error]);
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 text-[#13322E]">
      <section className="w-full max-w-lg rounded-[36px] border border-[#E9E1D2] bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><AlertTriangle /></div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[.25em] text-[#16B8AA]">Incidencia temporal</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">No hemos podido cargar esta sección.</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#6B726E]">Tus datos no se han perdido. Reintenta la operación o vuelve al inicio mientras recuperamos la conexión.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={reset} className="flex items-center gap-2 rounded-full bg-[#16B8AA] px-5 py-3 text-xs font-bold text-white"><RotateCcw className="h-4 w-4" />Reintentar</button>
          <Link href="/" className="flex items-center gap-2 rounded-full border border-[#E9E1D2] px-5 py-3 text-xs font-bold"><Home className="h-4 w-4" />Volver al inicio</Link>
        </div>
        {error.digest && <p className="mt-6 text-[10px] text-[#6B726E]">Referencia: {error.digest}</p>}
      </section>
    </main>
  );
}
