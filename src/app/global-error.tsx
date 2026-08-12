'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 text-[#13322E]">
        <main className="max-w-lg rounded-[36px] bg-white p-10 text-center shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[.25em] text-[#16B8AA]">vaneando.</p>
          <h1 className="mt-3 font-serif text-4xl font-bold">Ha ocurrido una incidencia temporal.</h1>
          <p className="mt-4 text-sm text-[#6B726E]">Reintenta la carga. Si el problema continúa, vuelve a entrar desde vaneando.com.</p>
          <button type="button" onClick={reset} className="mt-7 rounded-full bg-[#16B8AA] px-6 py-3 text-xs font-bold text-white">Reintentar</button>
        </main>
      </body>
    </html>
  );
}
