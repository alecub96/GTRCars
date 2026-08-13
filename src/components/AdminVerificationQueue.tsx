'use client';

import { FileCheck2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

type VerificationDocument = {
  id: string;
  type: string;
  fileUrl: string;
  user: { firstName: string; lastName: string; email: string };
};

export default function AdminVerificationQueue() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/verification', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo cargar la cola documental');
      setDocuments(data.documents || []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo cargar la cola documental');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/verification', { cache: 'no-store' }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo cargar la cola documental');
      return data.documents || [];
    }).then((data) => { if (!cancelled) setDocuments(data); }).catch((caught: Error) => { if (!cancelled) setError(caught.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function review(documentId: string, status: 'VERIFIED' | 'REJECTED') {
    const note = (notes[documentId] || '').trim();
    if (status === 'REJECTED' && !note) {
      setError('Indica el motivo antes de rechazar un documento.');
      return;
    }
    setError('');
    const response = await fetch('/api/admin/verification', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, status, notes: note || undefined }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'No se pudo guardar la revisión');
      return;
    }
    setDocuments((current) => current.filter((document) => document.id !== documentId));
  }

  return <section className="mt-10 rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl font-bold">Documentos pendientes de revisión</h2><p className="text-xs text-[#6B726E]">Los originales cifrados solo se descifran para la persona titular y administración.</p></div><button type="button" onClick={() => void load()} className="flex items-center gap-2 rounded-full border border-[#E9E1D2] px-4 py-2 text-xs font-bold"><RefreshCw className="h-4 w-4" />Actualizar</button></div>
    {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
    {loading ? <p className="text-sm text-[#6B726E]">Cargando documentos…</p> : documents.length === 0 ? <p className="text-sm text-[#6B726E]">No hay verificaciones pendientes.</p> : <div className="space-y-4">{documents.map((document) => <article key={document.id} className="rounded-2xl border border-slate-100 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><strong>{document.user.firstName} {document.user.lastName}</strong><p className="text-xs text-slate-500">{document.user.email} · {document.type}</p><a href={document.fileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#0F766E] underline"><FileCheck2 className="h-4 w-4" />Ver documento cifrado</a></div><div className="flex gap-2"><button type="button" onClick={() => void review(document.id, 'VERIFIED')} className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800">Aprobar</button><button type="button" onClick={() => void review(document.id, 'REJECTED')} className="rounded-full bg-red-100 px-3 py-2 text-xs font-bold text-red-800">Rechazar</button></div></div><textarea value={notes[document.id] || ''} onChange={(event) => setNotes((current) => ({ ...current, [document.id]: event.target.value }))} maxLength={1000} placeholder="Notas de revisión; obligatorias si rechazas…" className="mt-3 min-h-20 w-full rounded-xl border border-[#E9E1D2] p-3 text-sm" /></article>)}</div>}
  </section>;
}
