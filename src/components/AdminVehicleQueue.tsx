'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, ExternalLink, RefreshCw, AlertCircle, ShieldCheck, Eye, Trash2, Pencil } from 'lucide-react';

export default function AdminVehicleQueue() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED' | 'ALL'>('PENDING_REVIEW');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadVehicles = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const query = activeTab !== 'ALL' ? `?status=${activeTab}` : '';
      const response = await fetch(`/api/admin/vehicles${query}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al cargar los anuncios');
      setVehicles(data.vehicles || []);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'No se pudieron cargar los anuncios' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [activeTab]);

  const reviewVehicle = async (vehicleId: string, action: 'approve' | 'reject') => {
    setProcessingId(vehicleId);
    setFeedback(null);

    try {
      const response = await fetch('/api/admin/vehicles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, action }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo realizar la acción');

      setFeedback({ type: 'success', message: data.message || 'Acción completada con éxito' });
      await loadVehicles();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'No se pudo actualizar el anuncio' });
    } finally {
      setProcessingId(null);
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar este anuncio de prueba definitivamente?')) return;
    setProcessingId(vehicleId);
    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/vehicles?id=${vehicleId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo eliminar el anuncio');

      setFeedback({ type: 'success', message: data.message || 'Anuncio eliminado con éxito' });
      await loadVehicles();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'No se pudo eliminar el anuncio' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="mb-10 rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E9E1D2] pb-5 mb-5 gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D97706]">
            Control de Calidad
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#13322E]">Moderación de Anuncios</h2>
          <p className="text-xs text-[#6B726E] mt-0.5 font-medium">
            Aprueba o rechaza publicaciones de campers para que aparezcan públicamente en Canarias.
          </p>
        </div>

        <button
          type="button"
          onClick={loadVehicles}
          disabled={loading}
          className="inline-flex items-center space-x-2 rounded-full border border-[#E9E1D2] px-4 py-2 text-xs font-bold text-[#13322E] hover:bg-[#FAF7F0] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-[#16B8AA] ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* PESTAÑAS DE FILTRO */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#E9E1D2] pb-3">
        <button
          onClick={() => setActiveTab('PENDING_REVIEW')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'PENDING_REVIEW'
              ? 'bg-[#D97706] text-white shadow-sm'
              : 'bg-[#F7F6F2] text-[#6B726E] hover:bg-[#E9E1D2]'
          }`}
        >
          Pendientes de revisión
        </button>
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'ACTIVE'
              ? 'bg-[#16B8AA] text-white shadow-sm'
              : 'bg-[#F7F6F2] text-[#6B726E] hover:bg-[#E9E1D2]'
          }`}
        >
          Aprobados y Activos
        </button>
        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'REJECTED'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-[#F7F6F2] text-[#6B726E] hover:bg-[#E9E1D2]'
          }`}
        >
          Rechazados
        </button>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-[#13322E] text-white shadow-sm'
              : 'bg-[#F7F6F2] text-[#6B726E] hover:bg-[#E9E1D2]'
          }`}
        >
          Todos
        </button>
      </div>

      {/* ALERTA FEEDBACK */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 border animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#6B726E]">
          <RefreshCw className="w-6 h-6 mx-auto mb-2 text-[#16B8AA] animate-spin" />
          Cargando cola de anuncios...
        </div>
      ) : vehicles.length === 0 ? (
        <div className="py-10 text-center rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2]">
          <ShieldCheck className="w-8 h-8 text-[#16B8AA] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#13322E]">No hay anuncios en esta sección.</p>
          <p className="text-xs text-[#6B726E] mt-1 font-medium">
            {activeTab === 'PENDING_REVIEW'
              ? 'Todas las campers publicadas han sido moderadas.'
              : 'Selecciona otra pestaña para revisar el histórico.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {vehicles.map((v) => {
            const isProcessing = processingId === v.id;
            return (
              <div
                key={v.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-[#E9E1D2] bg-[#FAF7F0]/50 hover:bg-white hover:shadow-md transition-all gap-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={v.photos?.[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400'}
                    alt={v.title}
                    className="w-24 h-20 rounded-xl object-cover border border-[#E9E1D2] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          v.status === 'PENDING_REVIEW'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : v.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-red-100 text-red-900 border border-red-200'
                        }`}
                      >
                        {v.status === 'PENDING_REVIEW'
                          ? '⏳ Pendiente de revisión'
                          : v.status === 'ACTIVE'
                          ? '✅ Aprobado y Activo'
                          : '❌ Rechazado'}
                      </span>
                      <span className="text-[10px] font-bold text-[#6B726E] uppercase">
                        {v.island} • {v.municipality}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-[#13322E] line-clamp-1">{v.title}</h4>
                    <p className="text-xs text-[#6B726E] font-medium">
                      Propietario:{' '}
                      {v.owner ? (
                        <>
                          <strong className="text-[#13322E]">
                            {v.owner.firstName || ''} {v.owner.lastName || ''}
                          </strong>{' '}
                          ({v.owner.email || 'Sin email'})
                          {v.owner.phone ? ` • Tel: ${v.owner.phone}` : ''}
                        </>
                      ) : (
                        <span className="italic text-slate-400">Propietario no disponible</span>
                      )}
                    </p>
                    <p className="text-xs font-bold text-[#16B8AA]">{v.basePricePerDay}€ / día</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-[#E9E1D2]">
                  <a
                    href={`/camper/${encodeURIComponent(v.slug || v.id)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-[#E9E1D2] bg-white text-xs font-bold text-[#13322E] hover:bg-[#13322E] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#16B8AA]" />
                    <span>Ver Ficha</span>
                  </a>

                  <a
                    href={`/propietario/editar/${encodeURIComponent(v.id)}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-[#16B8AA]/40 bg-[#16B8AA]/10 text-xs font-bold text-[#0F766E] hover:bg-[#16B8AA] hover:text-white transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </a>

                  {v.status !== 'ACTIVE' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => reviewVehicle(v.id, 'approve')}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#16B8AA] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0F766E] hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>{isProcessing ? 'Aprobando...' : 'Aprobar'}</span>
                    </button>
                  )}

                  {v.status !== 'REJECTED' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => reviewVehicle(v.id, 'reject')}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>{isProcessing ? 'Rechazando...' : 'Rechazar'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => deleteVehicle(v.id)}
                    title="Eliminar anuncio permanentemente"
                    className="inline-flex items-center justify-center p-2 rounded-full border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:scale-110 active:scale-90 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
