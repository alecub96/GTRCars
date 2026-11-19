'use client';

import { CheckCircle2, ExternalLink, FileCheck2, RefreshCw, ScanFace, ShieldAlert, UserCheck, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type VerificationDocument = {
  id: string;
  userId: string;
  type: string;
  fileUrl: string;
  notes?: string | null;
  createdAt?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
  };
};

const DOC_TYPE_LABELS: Record<string, string> = {
  FACIAL_SELFIE: 'Captura Facial en Vivo (Selfie Frente)',
  DNI_NIE_FRONT: 'Anverso DNI / NIE',
  DNI_NIE_BACK: 'Reverso DNI / NIE',
  PASSPORT_FRONT: 'Anverso Pasaporte',
  PASSPORT_BACK: 'Reverso Pasaporte',
  EU_ID_FRONT: 'Anverso Documento UE',
  EU_ID_BACK: 'Reverso Documento UE',
  DRIVING_LICENSE: 'Permiso de Conducir Clase B',
};

export default function AdminVerificationQueue() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [processingUser, setProcessingUser] = useState<string | null>(null);

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
    void load();
  }, []);

  // Agrupar documentos por cliente para comparar Rostro en Vivo vs DNI y Carné lado a lado
  const groupedByUser = useMemo(() => {
    const map = new Map<
      string,
      {
        user: VerificationDocument['user'];
        docs: VerificationDocument[];
      }
    >();
    documents.forEach((doc) => {
      const uid = doc.user?.id || doc.userId;
      const existing = map.get(uid);
      if (existing) {
        existing.docs.push(doc);
      } else {
        map.set(uid, { user: doc.user, docs: [doc] });
      }
    });
    return Array.from(map.entries());
  }, [documents]);

  async function reviewUserDossier(userId: string, status: 'VERIFIED' | 'REJECTED') {
    const note = (notes[userId] || '').trim();
    if (status === 'REJECTED' && !note) {
      setError('Indica el motivo en el campo de notas antes de rechazar la verificación del cliente.');
      return;
    }
    setError('');
    setProcessingUser(userId);
    try {
      const response = await fetch('/api/admin/verification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status, notes: note || undefined }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo guardar la revisión');
      }
      setDocuments((current) => current.filter((d) => (d.user?.id || d.userId) !== userId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessingUser(null);
    }
  }

  async function reviewSingleDocument(documentId: string, status: 'VERIFIED' | 'REJECTED') {
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

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-900">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-600 block">
            COTEJO BIOMÉTRICO &amp; DOCUMENTAL
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            Verificación Facial y Documentos de Conductores
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Compara la captura facial en vivo (selfie de frente) con la fotografía del documento de identidad y permiso de conducir antes de homologar al cliente.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="flex items-center gap-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-600 py-8 text-center">Cargando expedientes de verificación…</p>
      ) : groupedByUser.length === 0 ? (
        <div className="py-12 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
          <UserCheck className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No hay verificaciones faciales o documentales pendientes.</p>
          <p className="text-xs text-slate-500">
            Cuando un viajero suba su DNI, carné y foto facial de frente desde /verificacion aparecerá aquí para cotejo.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByUser.map(([userId, { user, docs }]) => {
            const selfieDoc = docs.find((d) => d.type === 'FACIAL_SELFIE');
            const frontDoc = docs.find((d) => d.type.endsWith('_FRONT'));
            const hasBiometricSelfie = Boolean(selfieDoc);

            return (
              <article
                key={userId}
                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-5"
              >
                {/* CABECERA DEL CLIENTE */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-lg font-black text-slate-950">
                        {user.firstName} {user.lastName}
                      </strong>
                      {hasBiometricSelfie ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase">
                          <ScanFace className="w-3.5 h-3.5" />
                          Selfie Facial Incluido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Sin Selfie Facial
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-600 mt-0.5">
                      {user.email} {user.phone ? `· ${user.phone}` : ''} · {docs.length} archivos en revisión
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={processingUser === userId}
                      onClick={() => void reviewUserDossier(userId, 'VERIFIED')}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Aprobar Identidad y Rostro</span>
                    </button>
                    <button
                      type="button"
                      disabled={processingUser === userId}
                      onClick={() => void reviewUserDossier(userId, 'REJECTED')}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 hover:bg-red-100 px-4 py-2.5 text-xs font-bold text-red-800 cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rechazar Expediente</span>
                    </button>
                  </div>
                </div>

                {/* COMPARADOR VISUAL LADO A LADO: SELFIE FACIAL EN VIVO vs ANVERSO DNI */}
                {(selfieDoc || frontDoc) && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-3">
                      COMPARATIVA DE COINCIDENCIA FACIAL (ROSTRO EN VIVO VS DOCUMENTO)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <ScanFace className="w-4 h-4 text-rose-600" />
                          1. Captura Facial de Frente (Cámara en Vivo)
                        </span>
                        {selfieDoc ? (
                          <a href={selfieDoc.fileUrl} target="_blank" rel="noreferrer" className="block group">
                            <img
                              src={selfieDoc.fileUrl}
                              alt="Captura facial del cliente"
                              className="w-full h-52 object-cover rounded-xl border border-slate-200 group-hover:border-slate-950 transition-all"
                            />
                          </a>
                        ) : (
                          <div className="w-full h-52 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-500">
                            No se adjuntó captura facial
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FileCheck2 className="w-4 h-4 text-slate-900" />
                          2. Fotografía en Documento de Identidad
                        </span>
                        {frontDoc ? (
                          <a href={frontDoc.fileUrl} target="_blank" rel="noreferrer" className="block group">
                            <img
                              src={frontDoc.fileUrl}
                              alt="Anverso documento de identidad"
                              className="w-full h-52 object-cover rounded-xl border border-slate-200 group-hover:border-slate-950 transition-all"
                            />
                          </a>
                        ) : (
                          <div className="w-full h-52 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-500">
                            Documento frontal pendiente
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* LISTA DETALLADA DE LOS 4 ARCHIVOS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-2xl border border-slate-200 bg-white p-3.5 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                          {DOC_TYPE_LABELS[doc.type] || doc.type}
                        </span>
                        {doc.notes && (
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{doc.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-950 hover:text-rose-600 underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Abrir original
                        </a>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => void reviewSingleDocument(doc.id, 'VERIFIED')}
                            className="rounded-lg bg-emerald-100 hover:bg-emerald-200 px-2 py-1 text-[10px] font-bold text-emerald-900 cursor-pointer"
                          >
                            OK
                          </button>
                          <button
                            type="button"
                            onClick={() => void reviewSingleDocument(doc.id, 'REJECTED')}
                            className="rounded-lg bg-red-100 hover:bg-red-200 px-2 py-1 text-[10px] font-bold text-red-900 cursor-pointer"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* NOTAS DE REVISIÓN */}
                <div>
                  <input
                    type="text"
                    value={notes[userId] || ''}
                    onChange={(event) =>
                      setNotes((current) => ({ ...current, [userId]: event.target.value }))
                    }
                    maxLength={1000}
                    placeholder="Observaciones de verificación (obligatorias en caso de rechazar el expediente)…"
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-slate-950 outline-none"
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
