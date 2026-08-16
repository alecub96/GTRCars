'use client';

import React, { useEffect, useState } from 'react';
import DateRangeCalendar from '@/components/DateRangeCalendar';
import {
  CalendarSync,
  DollarSign,
  Trash2,
  Upload,
  Link as LinkIcon,
  Copy,
  Check,
  RefreshCw,
  Info,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';

interface Vehicle {
  id: string;
  title: string;
  slug?: string;
}

interface ExternalFeed {
  id: string;
  name: string;
  url: string;
  platform: string;
  lastSyncAt?: string;
  lastEventCount?: number;
}

export default function OwnerAvailabilityCalendar({ vehicles }: { vehicles: Vehicle[] }) {
  const [vehicleId, setVehicleId] = useState('');
  const selectedVehicleId = vehicles.some((v) => v.id === vehicleId)
    ? vehicleId
    : vehicles[0]?.id || '';

  const [blocks, setBlocks] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [feeds, setFeeds] = useState<ExternalFeed[]>([]);
  const [exportUrl, setExportUrl] = useState('');

  // Estados del formulario manual de bloqueo
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Estados de tarifas especiales
  const [ruleName, setRuleName] = useState('Temporada especial');
  const [rulePrice, setRulePrice] = useState('');
  const [ruleStart, setRuleStart] = useState('');
  const [ruleEnd, setRuleEnd] = useState('');

  // Estados del módulo de sincronización
  const [syncTab, setSyncTab] = useState<'url' | 'file' | 'export'>('url');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('AIRBNB');
  const [feedNameInput, setFeedNameInput] = useState('Mi calendario Airbnb');
  const [feedUrlInput, setFeedUrlInput] = useState('');
  const [isSubmittingFeed, setIsSubmittingFeed] = useState(false);
  const [isSyncingFile, setIsSyncingFile] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Cargar datos del vehículo seleccionado
  async function loadData(id: string) {
    if (!id) {
      setBlocks([]);
      setRules([]);
      setFeeds([]);
      return;
    }
    setMessage(null);

    try {
      const [availRes, priceRes, calRes] = await Promise.all([
        fetch(`/api/vehicles/${id}/availability`),
        fetch(`/api/vehicles/${id}/pricing`),
        fetch(`/api/vehicles/${id}/calendar`),
      ]);

      const availData = await availRes.json().catch(() => ({}));
      const priceData = await priceRes.json().catch(() => ({}));
      const calData = await calRes.json().catch(() => ({}));

      setBlocks(availData.blocks || []);
      setRules(priceData.rules || []);
      setFeeds(calData.feeds || []);
      if (calData.exportUrl) {
        setExportUrl(calData.exportUrl);
      } else {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vaneando.com';
        setExportUrl(`${origin}/api/vehicles/${id}/calendar?export=true`);
      }
    } catch (err) {
      console.error('Error loading calendar data:', err);
    }
  }

  useEffect(() => {
    if (!selectedVehicleId) return;
    void loadData(selectedVehicleId);
  }, [selectedVehicleId]);

  // Cambiar plataforma preestablecida
  const handlePlatformPreset = (platform: string, defaultName: string) => {
    setSelectedPlatform(platform);
    setFeedNameInput(defaultName);
  };

  // 1. Bloqueo manual de fechas
  async function addBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedVehicleId || !startDate || !endDate) return;

    try {
      const res = await fetch(`/api/vehicles/${selectedVehicleId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, reason: 'OWNER_BLOCK' }),
      });
      const data = await res.json();
      if (res.ok) {
        setBlocks((current) => [...current, data.block]);
        setStartDate('');
        setEndDate('');
        setMessage({ text: 'Periodo marcado como no disponible con éxito.', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Error al guardar el bloqueo', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Error de conexión con el servidor', type: 'error' });
    }
  }

  // Eliminar bloqueo de fechas
  async function removeBlock(blockId: string) {
    try {
      const res = await fetch(`/api/vehicles/${selectedVehicleId}/availability`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockId }),
      });
      if (res.ok) {
        setBlocks((current) => current.filter((b) => b.id !== blockId));
        setMessage({ text: 'Bloqueo eliminado correctamente.', type: 'success' });
      } else {
        const data = await res.json();
        setMessage({ text: data.error || 'No se pudo eliminar el bloqueo', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Error de conexión', type: 'error' });
    }
  }

  // 2. Vincular y sincronizar por URL (iCal Feed)
  async function handleAddFeed(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedVehicleId || !feedUrlInput.trim()) return;

    setIsSubmittingFeed(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/vehicles/${selectedVehicleId}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: feedUrlInput.trim(),
          name: feedNameInput.trim() || `Calendario ${selectedPlatform}`,
        }),
      });
      const data = await res.json();
      setIsSubmittingFeed(false);

      if (res.ok) {
        setFeedUrlInput('');
        setMessage({
          text: `¡Sincronización completada! ${data.message || `${data.imported} fechas importadas de ${data.platform}.`}`,
          type: 'success',
        });
        await loadData(selectedVehicleId);
      } else {
        setMessage({ text: data.error || 'Error al sincronizar el calendario externo', type: 'error' });
      }
    } catch (err: any) {
      setIsSubmittingFeed(false);
      setMessage({ text: `Error al conectar con el calendario: ${err.message || 'Comprueba la URL'}`, type: 'error' });
    }
  }

  // Re-sincronizar un feed existente
  async function handleSyncFeedAgain(feed: ExternalFeed) {
    setIsSubmittingFeed(true);
    setMessage({ text: `Actualizando calendario de ${feed.name}…`, type: 'info' });

    try {
      const res = await fetch(`/api/vehicles/${selectedVehicleId}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: feed.url,
          name: feed.name,
        }),
      });
      const data = await res.json();
      setIsSubmittingFeed(false);

      if (res.ok) {
        setMessage({
          text: `Sincronización actualizada: ${data.imported} fechas bloqueadas de ${feed.name}.`,
          type: 'success',
        });
        await loadData(selectedVehicleId);
      } else {
        setMessage({ text: data.error || 'Error al actualizar', type: 'error' });
      }
    } catch {
      setIsSubmittingFeed(false);
      setMessage({ text: 'Error al re-sincronizar', type: 'error' });
    }
  }

  // Desvincular feed
  async function handleDeleteFeed(feed: ExternalFeed) {
    if (!confirm(`¿Deseas desvincular el calendario "${feed.name}" y eliminar sus bloqueos asociados?`)) return;

    try {
      const res = await fetch(`/api/vehicles/${selectedVehicleId}/calendar`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedId: feed.id, platform: feed.platform }),
      });
      if (res.ok) {
        setMessage({ text: `Calendario "${feed.name}" desvinculado con éxito.`, type: 'success' });
        await loadData(selectedVehicleId);
      }
    } catch {
      setMessage({ text: 'Error al desvincular el feed', type: 'error' });
    }
  }

  // 3. Importar archivo .ics
  async function handleImportIcsFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedVehicleId) return;

    setIsSyncingFile(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/vehicles/${selectedVehicleId}/calendar`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setIsSyncingFile(false);

      if (res.ok) {
        setMessage({
          text: `¡Archivo .ics importado con éxito! Se han bloqueado ${data.imported} periodos (${data.platform}).`,
          type: 'success',
        });
        await loadData(selectedVehicleId);
      } else {
        setMessage({ text: data.error || 'Error al importar el archivo .ics', type: 'error' });
      }
    } catch {
      setIsSyncingFile(false);
      setMessage({ text: 'Error al subir el archivo', type: 'error' });
    }
    e.target.value = '';
  }

  // 4. Copiar URL de exportación oficial
  const handleCopyExportUrl = () => {
    if (!exportUrl) return;
    navigator.clipboard.writeText(exportUrl);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 3000);
  };

  // Tarifas especiales
  async function addRule(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedVehicleId) return;
    const res = await fetch(`/api/vehicles/${selectedVehicleId}/pricing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: ruleName, startDate: ruleStart, endDate: ruleEnd, pricePerDay: rulePrice }),
    });
    const data = await res.json();
    if (res.ok) {
      setRules((current) => [...current, data.rule].sort((a, b) => a.startDate.localeCompare(b.startDate)));
      setRuleStart('');
      setRuleEnd('');
      setRulePrice('');
      setMessage({ text: 'Tarifa especial guardada correctamente', type: 'success' });
    } else {
      setMessage({ text: data.error || 'Error al añadir tarifa', type: 'error' });
    }
  }

  async function removeRule(ruleId: string) {
    const res = await fetch(`/api/vehicles/${selectedVehicleId}/pricing`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleId }),
    });
    if (res.ok) {
      setRules((current) => current.filter((r) => r.id !== ruleId));
      setMessage({ text: 'Tarifa eliminada', type: 'success' });
    }
  }

  return (
    <section className="mb-12 rounded-3xl border border-[#E9E1D2] bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1D2] pb-6 mb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#13322E] flex items-center gap-2.5">
            <Calendar className="h-7 w-7 text-[#16B8AA]" />
            Disponibilidad y Sincronización Automática
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6B726E]">
            Vincula tus calendarios de Airbnb, Yescapa, Booking y Google Calendar para evitar reservas duplicadas y actualizar tu disponibilidad automáticamente.
          </p>
        </div>

        {vehicles.length > 0 && (
          <div className="w-full sm:w-auto min-w-[240px]">
            <label className="block text-[11px] font-black uppercase tracking-wider text-[#6B726E] mb-1">
              Seleccionar Camper
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full rounded-xl border border-[#E9E1D2] bg-[#FAF7F0] p-2.5 text-xs sm:text-sm font-bold text-[#13322E] focus:border-[#16B8AA] focus:outline-none cursor-pointer"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!vehicles.length ? (
        <p className="text-sm text-[#6B726E]">Publica tu primera camper para poder gestionar su calendario.</p>
      ) : (
        <div className="space-y-10">
          {/* MENSAJES DE ESTADO */}
          {message && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : message.type === 'info'
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              <span>{message.text}</span>
              <button
                type="button"
                onClick={() => setMessage(null)}
                className="text-xs font-bold underline ml-3 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          )}

          {/* MÓDULO DESTACADO: SINCRONIZACIÓN AUTOMÁTICA ICAL (AIRBNB, YESCAPA, ETC.) */}
          <div className="rounded-3xl border-2 border-teal-600/30 bg-gradient-to-br from-teal-50/50 via-white to-amber-50/20 p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16B8AA] text-white shadow-md">
                  <CalendarSync className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#13322E] flex items-center gap-2">
                    Sincronización con otras Plataformas
                    <span className="rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase px-2.5 py-0.5 tracking-wider">
                      iCal Automático
                    </span>
                  </h3>
                  <p className="text-xs text-[#6B726E]">
                    Conecta tus anuncios de Airbnb, Yescapa, Booking.com y Google Calendar en ambos sentidos.
                  </p>
                </div>
              </div>

              {/* SELECTOR DE PESTAÑAS */}
              <div className="flex items-center rounded-2xl bg-[#FAF7F0] p-1 border border-[#E9E1D2] w-fit">
                <button
                  type="button"
                  onClick={() => setSyncTab('url')}
                  className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    syncTab === 'url'
                      ? 'bg-[#13322E] text-white shadow-sm'
                      : 'text-[#6B726E] hover:text-[#13322E]'
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>Vincular URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSyncTab('file')}
                  className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    syncTab === 'file'
                      ? 'bg-[#13322E] text-white shadow-sm'
                      : 'text-[#6B726E] hover:text-[#13322E]'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Subir Archivo .ics</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSyncTab('export')}
                  className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    syncTab === 'export'
                      ? 'bg-[#13322E] text-white shadow-sm'
                      : 'text-[#6B726E] hover:text-[#13322E]'
                  }`}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Exportar a Airbnb</span>
                </button>
              </div>
            </div>

            {/* PESTAÑA 1: VINCULAR POR URL DE CALENDARIO */}
            {syncTab === 'url' && (
              <div className="space-y-6">
                {/* BOTONES PREESTABLECIDOS RÁPIDOS */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#6B726E] mb-2">
                    Plataforma a Vincular:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'AIRBNB', name: 'Airbnb', defaultName: 'Airbnb Calendar', color: 'hover:border-[#FF5A5F]' },
                      { id: 'YESCAPA', name: 'Yescapa', defaultName: 'Yescapa Camper', color: 'hover:border-[#008489]' },
                      { id: 'BOOKING', name: 'Booking.com', defaultName: 'Booking.com', color: 'hover:border-[#003580]' },
                      { id: 'GOOGLE', name: 'Google Calendar', defaultName: 'Google Calendar', color: 'hover:border-blue-500' },
                      { id: 'INDIE_CAMPERS', name: 'Indie Campers', defaultName: 'Indie Campers', color: 'hover:border-amber-600' },
                      { id: 'OTHER', name: 'Otra Plataforma', defaultName: 'Calendario Externo', color: 'hover:border-slate-500' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePlatformPreset(p.id, p.defaultName)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                          selectedPlatform === p.id
                            ? 'bg-[#16B8AA] text-white border-[#16B8AA] shadow-xs ring-2 ring-[#16B8AA]/30'
                            : `bg-white text-[#13322E] border-[#E9E1D2] ${p.color}`
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FORMULARIO DE IMPORTACIÓN POR ENLACE */}
                <form onSubmit={handleAddFeed} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-4">
                    <label className="block text-[11px] font-bold text-[#6B726E] mb-1">Nombre del Calendario</label>
                    <input
                      type="text"
                      required
                      value={feedNameInput}
                      onChange={(e) => setFeedNameInput(e.target.value)}
                      placeholder="Ej. Airbnb - Camper Las Palmas"
                      className="w-full rounded-xl border border-[#E9E1D2] bg-white p-3 text-xs sm:text-sm font-medium focus:border-[#16B8AA] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-[11px] font-bold text-[#6B726E] mb-1">
                      URL del feed iCal (.ics o webcal://)
                    </label>
                    <input
                      type="text"
                      required
                      value={feedUrlInput}
                      onChange={(e) => setFeedUrlInput(e.target.value)}
                      placeholder="https://www.airbnb.com/calendar/ical/123456.ics?s=..."
                      className="w-full rounded-xl border border-[#E9E1D2] bg-white p-3 text-xs sm:text-sm font-medium focus:border-[#16B8AA] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-end">
                    <button
                      type="submit"
                      disabled={isSubmittingFeed || !feedUrlInput.trim()}
                      className="w-full rounded-xl bg-[#16B8AA] hover:bg-[#0F766E] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      {isSubmittingFeed ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Sincronizando…</span>
                        </>
                      ) : (
                        <>
                          <CalendarSync className="h-4 w-4" />
                          <span>Vincular</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* LISTA DE FEEDS VINCULADOS */}
                {feeds.length > 0 && (
                  <div className="mt-4 border-t border-teal-200/60 pt-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#13322E] mb-3 flex items-center gap-1.5">
                      <span>🔗 Calendarios Conectados para este vehículo ({feeds.length})</span>
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {feeds.map((feed) => (
                        <div
                          key={feed.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E9E1D2] shadow-xs"
                        >
                          <div className="min-w-0 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              <strong className="text-xs sm:text-sm text-[#13322E] truncate block">{feed.name}</strong>
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                {feed.platform}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6B726E] mt-0.5 truncate">
                              {feed.lastSyncAt ? `Última sincronización: ${new Date(feed.lastSyncAt).toLocaleString('es-ES')}` : 'Activo'}
                            </p>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSyncFeedAgain(feed)}
                              disabled={isSubmittingFeed}
                              title="Sincronizar ahora"
                              className="p-2 rounded-xl text-[#16B8AA] hover:bg-teal-50 transition-colors cursor-pointer"
                            >
                              <RefreshCw className={`h-4 w-4 ${isSubmittingFeed ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFeed(feed)}
                              title="Desvincular calendario"
                              className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 2: SUBIR ARCHIVO .ICS */}
            {syncTab === 'file' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-[#E9E1D2] hover:border-[#16B8AA] transition-colors rounded-2xl p-6 text-center bg-white">
                  <Upload className="h-10 w-10 mx-auto text-[#16B8AA] mb-3" />
                  <h4 className="font-bold text-sm text-[#13322E] mb-1">
                    Arrastra o selecciona un archivo .ics / .ical
                  </h4>
                  <p className="text-xs text-[#6B726E] max-w-md mx-auto mb-4">
                    Exporta el archivo de calendario desde Airbnb (Precios y disponibilidad) o Yescapa e impórtalo aquí directamente.
                  </p>
                  <label className="inline-flex items-center gap-2 rounded-full bg-[#13322E] hover:bg-[#16B8AA] px-5 py-2.5 text-xs font-bold text-white transition-all cursor-pointer shadow-sm">
                    <Upload className="h-4 w-4" />
                    <span>{isSyncingFile ? 'Procesando archivo…' : 'Seleccionar archivo .ics'}</span>
                    <input
                      type="file"
                      accept=".ics,.ical,text/calendar"
                      disabled={isSyncingFile}
                      onChange={handleImportIcsFile}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E9E1D2] text-xs text-[#6B726E] space-y-1">
                  <p className="font-bold text-[#13322E] flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-[#16B8AA]" />
                    ¿Cómo exportar tu archivo .ics desde Airbnb o Yescapa?
                  </p>
                  <p>1. En <strong>Airbnb</strong>: Ve a <em>Anuncios &gt; Precios y disponibilidad &gt; Sincronización de calendarios &gt; Exportar calendario</em>.</p>
                  <p>2. En <strong>Yescapa</strong>: Ve a <em>Mi vehículo &gt; Calendario &gt; Exportar iCal</em>.</p>
                </div>
              </div>
            )}

            {/* PESTAÑA 3: EXPORTAR CALENDARIO DE VANEANDO A OTRAS PLATAFORMAS */}
            {syncTab === 'export' && (
              <div className="space-y-5 bg-white p-5 rounded-2xl border border-[#E9E1D2]">
                <div>
                  <h4 className="font-bold text-sm text-[#13322E] mb-1">
                    Tu enlace oficial de exportación iCal de Vaneando
                  </h4>
                  <p className="text-xs text-[#6B726E]">
                    Pega este enlace en Airbnb, Yescapa o Booking.com para que esas plataformas bloqueen automáticamente las fechas cuando recibas reservas en Vaneando.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={exportUrl}
                    className="w-full rounded-xl border border-[#E9E1D2] bg-[#FAF7F0] p-3 text-xs font-mono text-[#13322E] select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyExportUrl}
                    className="shrink-0 rounded-xl bg-[#16B8AA] hover:bg-[#0F766E] text-white px-4 py-3 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    {copiedExport ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copiar Enlace</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs text-[#6B726E]">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D2]">
                    <strong className="text-[#13322E] block mb-1">📍 Cómo pegarlo en Airbnb:</strong>
                    <span>Ve a tu anuncio en Airbnb &gt; Precios y disponibilidad &gt; Sincronizar calendarios &gt; Importar calendario y pega el enlace anterior.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D2]">
                    <strong className="text-[#13322E] block mb-1">🚐 Cómo pegarlo en Yescapa / Booking:</strong>
                    <span>En el menú de tu vehículo &gt; Calendario &gt; Importar iCal &gt; Pega la URL generada.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MÓDULO MANUAL: BLOQUEO DE FECHAS MANUAL */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#E9E1D2] p-6 bg-[#FAF7F0]/40 space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#13322E]">Marcar fechas no disponibles manualmente</h3>
                <p className="text-xs text-[#6B726E]">Selecciona los días que quieras reservar para uso personal o mantenimiento.</p>
              </div>

              <form onSubmit={addBlock} className="space-y-4">
                <DateRangeCalendar
                  startDate={startDate}
                  endDate={endDate}
                  blocked={blocks}
                  onChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                />
                <button
                  type="submit"
                  disabled={!startDate || !endDate}
                  className="w-full rounded-full bg-[#13322E] hover:bg-[#16B8AA] py-3 text-xs font-bold text-white transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  Bloquear este periodo
                </button>
              </form>
            </div>

            {/* MÓDULO: TARIFAS POR TEMPORADA */}
            <form onSubmit={addRule} className="rounded-3xl border border-[#E9E1D2] bg-white p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#16B8AA]" />
                  <h3 className="font-serif text-lg font-bold text-[#13322E]">Tarifas por fechas especiales</h3>
                </div>
                <span className="text-xs font-bold text-[#6B726E]">({rules.length}/5)</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#6B726E] mb-1">Nombre de la Temporada</label>
                  <input
                    required
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    placeholder="Ej. Temporada Alta Verano / Semana Santa"
                    className="w-full rounded-xl border border-[#E9E1D2] p-2.5 text-xs sm:text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B726E] mb-1">Precio Diario (€/día)</label>
                  <input
                    required
                    type="number"
                    min="10"
                    step="0.01"
                    value={rulePrice}
                    onChange={(e) => setRulePrice(e.target.value)}
                    placeholder="Ej. 85 €"
                    className="w-full rounded-xl border border-[#E9E1D2] p-2.5 text-xs sm:text-sm bg-white font-bold text-[#16B8AA]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B726E] mb-1">Fecha Inicio</label>
                  <input
                    required
                    type="date"
                    value={ruleStart}
                    onChange={(e) => setRuleStart(e.target.value)}
                    className="w-full rounded-xl border border-[#E9E1D2] p-2.5 text-xs sm:text-sm bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#6B726E] mb-1">Fecha Fin</label>
                  <input
                    required
                    type="date"
                    value={ruleEnd}
                    onChange={(e) => setRuleEnd(e.target.value)}
                    className="w-full rounded-xl border border-[#E9E1D2] p-2.5 text-xs sm:text-sm bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={rules.length >= 5 || !rulePrice || !ruleStart || !ruleEnd}
                className="w-full rounded-full bg-[#16B8AA] hover:bg-[#0F766E] py-2.5 text-xs font-bold text-white transition-all disabled:opacity-40 cursor-pointer shadow-sm"
              >
                Añadir Tarifa Especial
              </button>
            </form>
          </div>

          {/* LISTADOS: PERIODOS BLOQUEADOS & TARIFAS ACTIVAS */}
          <div className="grid gap-8 md:grid-cols-2 pt-6 border-t border-[#E9E1D2]">
            {/* LISTA DE PERIODOS NO DISPONIBLES */}
            <div>
              <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-[#13322E] flex items-center justify-between">
                <span>Periodos no disponibles ({blocks.length})</span>
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {blocks.length === 0 ? (
                  <p className="text-xs text-[#6B726E] bg-[#FAF7F0] p-4 rounded-2xl border border-[#E9E1D2]">
                    Tu camper está 100% disponible. Puedes bloquear fechas manualmente o vincular tu calendario de Airbnb.
                  </p>
                ) : (
                  blocks.map((block) => {
                    const isBooking = block.reason?.startsWith('BOOKING_');
                    const isSync = block.reason?.startsWith('SYNC_');
                    let tag = 'Bloqueo Manual';
                    let badgeColor = 'bg-amber-100 text-amber-900 border-amber-200';

                    if (isBooking) {
                      tag = 'Reserva Vaneando';
                      badgeColor = 'bg-blue-100 text-blue-900 border-blue-200';
                    } else if (isSync) {
                      if (block.reason?.includes('AIRBNB')) tag = 'Sincronizado Airbnb';
                      else if (block.reason?.includes('YESCAPA')) tag = 'Sincronizado Yescapa';
                      else if (block.reason?.includes('BOOKING')) tag = 'Sincronizado Booking';
                      else if (block.reason?.includes('GOOGLE')) tag = 'Google Calendar';
                      else tag = 'Calendario iCal';
                      badgeColor = 'bg-violet-100 text-violet-900 border-violet-200';
                    }

                    return (
                      <div
                        key={block.id}
                        className="flex items-center justify-between rounded-2xl border border-[#E9E1D2] bg-white p-3.5 shadow-xs"
                      >
                        <div>
                          <span className="text-xs font-bold text-[#13322E] block">
                            {new Date(block.startDate).toLocaleDateString('es-ES')} – {new Date(block.endDate).toLocaleDateString('es-ES')}
                          </span>
                          <span className={`inline-block mt-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${badgeColor}`}>
                            {tag}
                          </span>
                        </div>

                        {!isBooking && (
                          <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            aria-label="Eliminar bloqueo"
                            className="rounded-xl p-2 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* LISTA DE TARIFAS ACTIVAS */}
            <div>
              <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-[#13322E]">
                Tarifas por temporada ({rules.length})
              </h3>

              <div className="space-y-2">
                {rules.length === 0 ? (
                  <p className="text-xs text-[#6B726E] bg-[#FAF7F0] p-4 rounded-2xl border border-[#E9E1D2]">
                    Se aplicará la tarifa base configurada en el anuncio para todos los días del año.
                  </p>
                ) : (
                  rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 shadow-xs text-emerald-950"
                    >
                      <div>
                        <strong className="text-xs sm:text-sm block">{rule.name}</strong>
                        <span className="text-xs font-bold text-[#16B8AA]">{rule.pricePerDay} €/día</span>
                        <span className="text-[11px] text-[#6B726E] ml-2">
                          ({new Date(rule.startDate).toLocaleDateString('es-ES')} – {new Date(rule.endDate).toLocaleDateString('es-ES')})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeRule(rule.id)}
                        aria-label="Eliminar tarifa"
                        className="rounded-xl p-2 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
