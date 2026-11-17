'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, ExternalLink, RefreshCw, AlertCircle, ShieldCheck, Eye, Trash2, Fuel, Gauge, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AdminVehicleQueue() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'PENDING_REVIEW' | 'REJECTED'>('ALL');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadVehicles = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const query = activeTab !== 'ALL' ? `?status=${activeTab}` : '';
      const response = await fetch(`/api/admin/vehicles${query}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al cargar los superdeportivos');
      setVehicles(data.vehicles || []);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'No se pudo cargar la flota' });
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
      if (!response.ok) throw new Error(data.error || 'No se pudo actualizar el estado');

      setFeedback({ type: 'success', message: data.message || 'Estado actualizado con éxito' });
      await loadVehicles();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error al actualizar el vehículo' });
    } finally {
      setProcessingId(null);
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este vehículo de la plataforma?')) return;
    setProcessingId(vehicleId);
    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/vehicles?id=${vehicleId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo eliminar el vehículo');

      setFeedback({ type: 'success', message: data.message || 'Vehículo eliminado con éxito' });
      await loadVehicles();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error al eliminar el vehículo' });
    } finally {
      setProcessingId(null);
    }
  };

  const activeCount = vehicles.filter((v) => v.status === 'ACTIVE').length;
  const pendingCount = vehicles.filter((v) => v.status === 'PENDING_REVIEW').length;

  return (
    <section className="mb-10 rounded-2xl border border-neutral-300 bg-white p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-300 pb-5 mb-5 gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-rose-600">
            Control de Flota // Vault
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-sans">
            Superdeportivos & Parque Móvil
          </h2>
          <p className="text-xs text-neutral-700 font-medium mt-0.5 font-medium">
            Supervisa los superdeportivos propios y aprueba publicaciones de propietarios VIP.
          </p>
        </div>

        <button
          type="button"
          onClick={loadVehicles}
          disabled={loading}
          className="inline-flex items-center space-x-2 rounded-full border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer self-start sm:self-auto font-mono"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-rose-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* PESTAÑAS DE FILTRO */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-300 pb-3 font-mono">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-black text-white shadow-xs'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Toda la Flota ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'ACTIVE'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setActiveTab('PENDING_REVIEW')}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'PENDING_REVIEW'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Pendientes de Aprobación
        </button>
        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'REJECTED'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Rechazados
        </button>
      </div>

      {/* ALERTA FEEDBACK */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-bold flex items-center space-x-2 border animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-neutral-700 font-medium font-mono">
          <RefreshCw className="w-6 h-6 mx-auto mb-2 text-rose-600 animate-spin" />
          Cargando inventario de superdeportivos...
        </div>
      ) : vehicles.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-neutral-50 border border-neutral-300">
          <ShieldCheck className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-neutral-900">No hay vehículos en este filtro.</p>
          <p className="text-xs text-neutral-700 font-medium mt-1 font-medium">
            {activeTab === 'PENDING_REVIEW'
              ? 'Todas las publicaciones están actualmente al día y aprobadas.'
              : 'Selecciona "Toda la Flota" para ver los coches registrados.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => {
            const isProcessing = processingId === v.id;
            const photoUrl = v.photos?.[0]?.url || '/supercars/ferrari-488/ferrari-488-front.jpg';
            const isPlatform = v.ownershipType === 'PLATFORM';

            return (
              <div
                key={v.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl border border-neutral-300 bg-white hover:border-black transition-all gap-4"
              >
                <div className="flex items-start space-x-4 min-w-0">
                  <img
                    src={photoUrl}
                    alt={v.title}
                    className="w-24 h-18 rounded-xl object-cover border border-neutral-300 shrink-0 bg-neutral-100"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          v.status === 'PENDING_REVIEW'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : v.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-rose-100 text-rose-900 border border-rose-200'
                        }`}
                      >
                        {v.status === 'PENDING_REVIEW'
                          ? 'Pendiente de revisión'
                          : v.status === 'ACTIVE'
                          ? 'Activo // En Alquiler'
                          : 'Rechazado / Pausado'}
                      </span>

                      <span
                        className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isPlatform
                            ? 'bg-black text-white'
                            : 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                        }`}
                      >
                        {isPlatform ? 'GTR Cars // Flota Oficial' : 'Propietario VIP'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-neutral-900 truncate">
                      {v.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-700 font-medium font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-600" />
                        {v.island || 'Canarias'}
                      </span>
                      <span>·</span>
                      <strong className="text-neutral-900 font-sans font-bold">
                        {v.basePricePerDay} € <span className="text-[10px] font-normal text-neutral-700 font-medium">/ día</span>
                      </strong>
                      <span>·</span>
                      <span>Fianza: <strong className="text-neutral-900 font-sans">{v.securityDeposit || 0} €</strong></span>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Link
                    href={`/coche/${v.slug}`}
                    target="_blank"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-neutral-300 hover:border-black text-xs font-mono font-bold text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-neutral-700 font-medium" />
                    <span>Ver Ficha</span>
                    <ExternalLink className="w-3 h-3 text-neutral-600" />
                  </Link>

                  {v.status === 'PENDING_REVIEW' && (
                    <>
                      <button
                        type="button"
                        onClick={() => reviewVehicle(v.id, 'approve')}
                        disabled={isProcessing}
                        className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aprobar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => reviewVehicle(v.id, 'reject')}
                        disabled={isProcessing}
                        className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rechazar</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteVehicle(v.id)}
                    disabled={isProcessing}
                    className="p-2 text-neutral-600 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-all cursor-pointer"
                    title="Eliminar superdeportivo"
                  >
                    <Trash2 className="w-4 h-4" />
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
