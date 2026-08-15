'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminEmailDiagnostics() {
  const [configuration, setConfiguration] = useState<any>(null);
  const [targetEmail, setTargetEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkConfig = () => {
    setChecking(true);
    fetch('/api/admin/email-test', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No se pudo comprobar el correo');
        return data.configuration;
      })
      .then((data) => {
        setConfiguration(data);
      })
      .catch((error: Error) => {
        setMessage({ type: 'error', text: error.message });
      })
      .finally(() => setChecking(false));
  };

  useEffect(() => {
    checkConfig();
  }, []);

  async function testEmail() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/email-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail || undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo enviar el correo de prueba');

      setMessage({
        type: 'success',
        text: data.message || `Correo de prueba enviado con éxito a ${targetEmail || configuration?.user || 'tu email'}.`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error al enviar correo de prueba' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="my-10 rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1D2] pb-5 mb-5">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#13322E]">Correo Transaccional SMTP</h2>
            <p className="text-xs text-[#6B726E] font-medium mt-0.5">
              {checking
                ? 'Comprobando servidor de correo Hostinger...'
                : configuration?.configured
                ? `Activo y configurado como ${configuration.user} en ${configuration.host}:${configuration.port}`
                : `Variables SMTP activadas. Remitente: ${configuration?.from || 'contacto@vaneando.com'}`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={checkConfig}
          disabled={checking}
          className="inline-flex items-center space-x-2 rounded-full border border-[#E9E1D2] px-4 py-2 text-xs font-bold text-[#13322E] hover:bg-[#FAF7F0] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-[#16B8AA] ${checking ? 'animate-spin' : ''}`} />
          <span>Verificar SMTP</span>
        </button>
      </div>

      {message && (
        <div
          className={`mb-5 p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 border animate-in fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="email"
          placeholder="Introduce correo para recibir prueba (ej. contacto@vaneando.com)"
          value={targetEmail}
          onChange={(e) => setTargetEmail(e.target.value)}
          className="p-3.5 rounded-xl border border-[#E9E1D2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#16B8AA] flex-1"
        />

        <button
          onClick={testEmail}
          disabled={loading}
          className="inline-flex items-center justify-center space-x-2 rounded-full bg-[#13322E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0F766E] transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          <Send className="w-4 h-4 text-[#16B8AA]" />
          <span>{loading ? 'Enviando...' : 'Enviar Correo de Prueba'}</span>
        </button>
      </div>
    </section>
  );
}
