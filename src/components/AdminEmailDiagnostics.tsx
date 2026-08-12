'use client';

import { useEffect, useState } from 'react';

export default function AdminEmailDiagnostics() {
  const [configuration, setConfiguration] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/email-test')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No se pudo comprobar el correo');
        return data.configuration;
      })
      .then((data) => { if (!cancelled) setConfiguration(data); })
      .catch((error: Error) => { if (!cancelled) setMessage(error.message); });
    return () => { cancelled = true; };
  }, []);

  async function testEmail() {
    setLoading(true);
    setMessage('');
    const response = await fetch('/api/admin/email-test', { method: 'POST' });
    const data = await response.json();
    setMessage(data.message || data.error || 'No se pudo completar la prueba');
    setLoading(false);
  }

  return (
    <section className="my-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold">Correo transaccional</h2>
          <p className="text-xs text-slate-500">
            {configuration?.configured
              ? `Configurado como ${configuration.user} en ${configuration.host}:${configuration.port}`
              : `Faltan variables: ${configuration?.missing?.join(', ') || 'SMTP_USER y/o SMTP_PASSWORD'}.`}
          </p>
        </div>
        <button onClick={testEmail} disabled={loading || !configuration?.configured} className="rounded-full bg-[#13322E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-40">
          {loading ? 'Enviando...' : 'Enviar correo de prueba'}
        </button>
      </div>
      {message && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs font-bold">{message}</p>}
    </section>
  );
}
