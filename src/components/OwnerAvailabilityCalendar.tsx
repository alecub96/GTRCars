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
  Calendar,
  Layers,
  Sparkles,
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
  const [ruleName, setRuleName] = useState('Temporada Alta GP / Eventos');
  const [rulePrice, setRulePrice] = useState('');
  const [ruleStart, setRuleStart] = useState('');
  const [ruleEnd, setRuleEnd] = useState('');

  // Estados del módulo de sincronización
  const [syncTab, setSyncTab] = useState<'url' | 'file' | 'export'>('url');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('AIRBNB');
  const [feedNameInput, setFeedNameInput] = useState('Calendario Externo');
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
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gtrcars.es';
        setExportUrl(`${origin}/api/calendar/export/${id}`);
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
    <section className="mb-12 rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-black text-[10px] font-mono tracking-widest uppercase mb-2">
            <Sparkles className="w-3 h-3" />
            TELEMETRÍA &amp; DISPONIBILIDAD
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black flex items-center gap-2.5">
            <Calendar className="h-7 w-7 text-black" />
            Disponibilidad y Sincronización Automática
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Vincula tus calendarios externos o sincroniza iCal con plataformas privadas y concierge para evitar solapamientos de reservas.
          </p>
        </div>

        {vehicles.length > 0 && (
          <div className="w-full sm:w-auto min-w-[240px]">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
              Seleccionar Superdeportivo
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-neutral-900 p-2.5 text-xs sm:text-sm font-mono text-black focus:border-[#D4AF37] focus:outline-none cursor-pointer"
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
        <p className="text-sm text-gray-500">Publica tu primer superdeportivo para poder gestionar su calendario.</p>
      ) : (
        <div className="space-y-10">
          {/* MENSAJES DE ESTADO */}
          {message && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-mono flex items-center justify-between shadow-lg border ${
                message.type === 'success'
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                  : message.type === 'info'
                  ? 'bg-blue-950/40 text-blue-400 border-blue-500/30'
                  : 'bg-red-950/40 text-red-400 border-red-500/30'
              }`}
            >
              <span>{message.text}</span>
              <button
                type="button"
                onClick={() => setMessage(null)}
                className="text-xs font-bold underline ml-3 cursor-pointer text-gray-700 hover:text-black"
              >
                Cerrar
              </button>
            </div>
          )}

          {/* MÓDULO DESTACADO: SINCRONIZACIÓN AUTOMÁTICA ICAL */}
          <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-[#17171d] via-[#101014] to-black p-5 sm:p-7 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white hover:bg-neutral-800 shadow-lg">
                  <CalendarSync className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-black flex items-center gap-2">
                    Sincronización con otras Plataformas
                    <span className="rounded-full bg-[#D4AF37]/20 text-black text-[10px] font-mono uppercase px-2.5 py-0.5 tracking-wider border border-gray-200">
                      iCal Automático
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Conecta tus flujos de concierge, Airbnb Luxe, Booking.com y Google Calendar en ambos sentidos.
                  </p>
                </div>
              </div>

              {/* SELECTOR DE PESTAÑAS */}
              <div className="flex items-center rounded-2xl bg-neutral-900/80 p-1 border border-gray-200 w-fit">
                <button
                  type="button"
                  onClick={() => setSyncTab('url')}
                  className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    syncTab === 'url'
                      ? 'bg-black text-white hover:bg-neutral-800 shadow-sm'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>Vincular URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSyncTab('file')}
                  className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    syncTab === 'file'
                      ? 'bg-black text-white hover:bg-neutral-800 shadow-sm'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Subir Archivo .ics</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSyncTab('export')}
                  className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    syncTab === 'export'
                      ? 'bg-black text-white hover:bg-neutral-800 shadow-sm'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Exportar Feed</span>
                </button>
              </div>
            </div>

            {/* PESTAÑA 1: VINCULAR POR URL DE CALENDARIO */}
            {syncTab === 'url' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-2">
                    Plataforma a Vincular:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'AIRBNB', name: 'Airbnb Luxe', defaultName: 'Airbnb Luxe Calendar' },
                      { id: 'BOOKING', name: 'Booking.com', defaultName: 'Booking.com Calendar' },
                      { id: 'GOOGLE', name: 'Google Calendar', defaultName: 'Google VIP Events' },
                      { id: 'CONCIERGE', name: 'Concierge / Privado', defaultName: 'Flota Privada' },
                      { id: 'OTHER', name: 'Otra Plataforma', defaultName: 'Calendario Externo' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePlatformPreset(p.id, p.defaultName)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all border cursor-pointer ${
                          selectedPlatform === p.id
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm font-black'
                            : 'bg-neutral-900 text-gray-600 border-gray-200 hover:border-black'
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
                    <label className="block text-[11px] font-mono text-gray-500 mb-1">Nombre del Calendario</label>
                    <input
                      type="text"
                      required
                      value={feedNameInput}
                      onChange={(e) => setFeedNameInput(e.target.value)}
                      placeholder="Ej. Concierge Tenerife - GT3 RS"
                      className="w-full rounded-xl border border-gray-200 bg-neutral-900 p-3 text-xs sm:text-sm font-mono text-black focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-[11px] font-mono text-gray-500 mb-1">
                      URL del feed iCal (.ics o webcal://)
                    </label>
                    <input
                      type="text"
                      required
                      value={feedUrlInput}
                      onChange={(e) => setFeedUrlInput(e.target.value)}
                      placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                      className="w-full rounded-xl border border-gray-200 bg-neutral-900 p-3 text-xs sm:text-sm font-mono text-black focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-end">
                    <button
                      type="submit"
                      disabled={isSubmittingFeed || !feedUrlInput.trim()}
                      className="w-full rounded-xl bg-black text-white hover:bg-neutral-800 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5 shadow-md cursor-pointer hover:brightness-110"
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
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
                      <span>Calendarios conectados para este vehículo ({feeds.length})</span>
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {feeds.map((feed) => (
                        <div
                          key={feed.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900 border border-gray-200 shadow-md"
                        >
                          <div className="min-w-0 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                              <strong className="text-xs sm:text-sm text-black truncate block font-mono">{feed.name}</strong>
                              <span className="text-[9px] font-mono uppercase tracking-wider bg-white/10 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200">
                                {feed.platform}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5 truncate font-mono">
                              {feed.lastSyncAt ? `Última sincronización: ${new Date(feed.lastSyncAt).toLocaleString('es-ES')}` : 'Activo'}
                            </p>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSyncFeedAgain(feed)}
                              disabled={isSubmittingFeed}
                              title="Sincronizar ahora"
                              className="p-2 rounded-xl text-black hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              <RefreshCw className={`h-4 w-4 ${isSubmittingFeed ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFeed(feed)}
                              title="Desvincular calendario"
                              className="p-2 rounded-xl text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
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
                <div className="border-2 border-dashed border-gray-200 hover:border-[#D4AF37] transition-colors rounded-2xl p-6 text-center bg-neutral-900/60">
                  <Upload className="h-10 w-10 mx-auto text-black mb-3" />
                  <h4 className="font-bold text-sm text-black mb-1 font-mono">
                    Arrastra o selecciona un archivo .ics / .ical
                  </h4>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mb-4 font-mono">
                    Exporta el archivo de calendario desde tu software de gestión o plataforma externa e impórtalo aquí directamente.
                  </p>
                  <label className="inline-flex items-center gap-2 rounded-full bg-black text-white hover:bg-neutral-800 px-6 py-2.5 text-xs font-mono font-bold transition-all cursor-pointer shadow-lg hover:brightness-110">
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

                <div className="bg-neutral-900/80 p-4 rounded-2xl border border-gray-200 text-xs text-gray-500 space-y-1 font-mono">
                  <p className="font-bold text-black flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-black" />
                    ¿Cómo exportar tu archivo .ics de otros calendarios?
                  </p>
                  <p>1. En <strong>Google Calendar</strong>: Ajustes &gt; Configuración de mis calendarios &gt; Exportar calendario.</p>
                  <p>2. En <strong>Otras plataformas</strong>: Ve a Ajustes &gt; Calendario &gt; Exportar iCal (.ics).</p>
                </div>
              </div>
            )}

            {/* PESTAÑA 3: EXPORTAR CALENDARIO DE GTR CARS */}
            {syncTab === 'export' && (
              <div className="space-y-5 bg-neutral-900/60 p-5 rounded-2xl border border-gray-200">
                <div>
                  <h4 className="font-bold text-sm text-black mb-1 font-mono">
                    Enlace oficial de exportación iCal de GTR Cars
                  </h4>
                  <p className="text-xs text-gray-500 font-mono">
                    Pega este enlace en tus otros calendarios para que bloqueen automáticamente las fechas cuando se confirme una reserva en GTR Cars.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={exportUrl}
                    className="w-full rounded-xl border border-gray-200 bg-black/80 p-3 text-xs font-mono text-black select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyExportUrl}
                    className="shrink-0 rounded-xl bg-black text-white hover:bg-neutral-800 px-4 py-3 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer hover:brightness-110"
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
              </div>
            )}
          </div>

          {/* MÓDULO MANUAL: BLOQUEO DE FECHAS MANUAL */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 p-6 bg-neutral-900/50 space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-black">Marcar fechas no disponibles manualmente</h3>
                <p className="text-xs text-gray-500 font-mono">Selecciona los días que quieras reservar para uso personal, rodajes o mantenimiento técnico.</p>
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
                  className="w-full rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-black py-3 text-xs font-mono font-bold text-black transition-all disabled:opacity-40 cursor-pointer border border-gray-200"
                >
                  Bloquear este periodo
                </button>
              </form>
            </div>

            {/* MÓDULO: TARIFAS POR TEMPORADA */}
            <form onSubmit={addRule} className="rounded-3xl border border-gray-200 bg-neutral-900/50 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-black" />
                  <h3 className="font-serif text-lg font-bold text-black">Tarifas por fechas especiales</h3>
                </div>
                <span className="text-xs font-mono font-bold text-gray-500">({rules.length}/5)</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-gray-500 mb-1">Nombre de la Temporada</label>
                  <input
                    required
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    placeholder="Ej. Rally Islas Canarias / Temporada Alta"
                    className="w-full rounded-xl border border-gray-200 bg-black/80 p-2.5 text-xs sm:text-sm font-mono text-black focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-500 mb-1">Precio Diario (€/día)</label>
                  <input
                    required
                    type="number"
                    min="50"
                    step="1"
                    value={rulePrice}
                    onChange={(e) => setRulePrice(e.target.value)}
                    placeholder="Ej. 1200 €"
                    className="w-full rounded-xl border border-gray-200 bg-black/80 p-2.5 text-xs sm:text-sm font-mono text-black font-bold focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-500 mb-1">Fecha Inicio</label>
                  <input
                    required
                    type="date"
                    value={ruleStart}
                    onChange={(e) => setRuleStart(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-black/80 p-2.5 text-xs sm:text-sm font-mono text-black focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-gray-500 mb-1">Fecha Fin</label>
                  <input
                    required
                    type="date"
                    value={ruleEnd}
                    onChange={(e) => setRuleEnd(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-black/80 p-2.5 text-xs sm:text-sm font-mono text-black focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={rules.length >= 5 || !rulePrice || !ruleStart || !ruleEnd}
                className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] hover:brightness-110 py-3 text-xs font-mono font-bold text-black transition-all disabled:opacity-40 cursor-pointer shadow-lg uppercase tracking-wider"
              >
                Añadir Tarifa Especial
              </button>
            </form>
          </div>

          {/* LISTADOS: PERIODOS BLOQUEADOS & TARIFAS ACTIVAS */}
          <div className="grid gap-8 md:grid-cols-2 pt-6 border-t border-gray-200">
            {/* LISTA DE PERIODOS NO DISPONIBLES */}
            <div>
              <h3 className="mb-3 text-sm font-mono uppercase tracking-wider text-black flex items-center justify-between">
                <span>Periodos no disponibles ({blocks.length})</span>
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {blocks.length === 0 ? (
                  <p className="text-xs font-mono text-gray-500 bg-neutral-900/60 p-4 rounded-2xl border border-gray-200">
                    Tu superdeportivo está 100% disponible. Puedes bloquear fechas manualmente o vincular tu calendario externo.
                  </p>
                ) : (
                  blocks.map((block) => {
                    const isBooking = block.reason?.startsWith('BOOKING_');
                    const isSync = block.reason?.startsWith('SYNC_');
                    let tag = 'Bloqueo Manual';
                    let badgeColor = 'bg-amber-500/20 text-amber-800 border-amber-500/30';

                    if (isBooking) {
                      tag = 'Reserva GTR Cars';
                      badgeColor = 'bg-[#D4AF37]/20 text-black border-gray-200';
                    } else if (isSync) {
                      if (block.reason?.includes('AIRBNB')) tag = 'Sincronizado Airbnb Luxe';
                      else if (block.reason?.includes('BOOKING')) tag = 'Sincronizado Booking';
                      else if (block.reason?.includes('GOOGLE')) tag = 'Google Calendar';
                      else tag = 'Calendario iCal';
                      badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                    }

                    return (
                      <div
                        key={block.id}
                        className="flex items-center justify-between rounded-2xl border border-gray-200 bg-neutral-900 p-3.5 shadow-sm"
                      >
                        <div>
                          <span className="text-xs font-mono font-bold text-black block">
                            {new Date(block.startDate).toLocaleDateString('es-ES')} – {new Date(block.endDate).toLocaleDateString('es-ES')}
                          </span>
                          <span className={`inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border ${badgeColor}`}>
                            {tag}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (isBooking) {
                              if (window.confirm('¿Deseas desbloquear estas fechas en tu calendario? Si la reserva no está pagada, se liberará el vehículo.')) {
                                removeBlock(block.id);
                              }
                            } else {
                              removeBlock(block.id);
                            }
                          }}
                          aria-label="Eliminar bloqueo"
                          title="Eliminar bloqueo y liberar fechas"
                          className="rounded-xl p-2 text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* LISTA DE TARIFAS ACTIVAS */}
            <div>
              <h3 className="mb-3 text-sm font-mono uppercase tracking-wider text-black">
                Tarifas por temporada ({rules.length})
              </h3>

              <div className="space-y-2">
                {rules.length === 0 ? (
                  <p className="text-xs font-mono text-gray-500 bg-neutral-900/60 p-4 rounded-2xl border border-gray-200">
                    Se aplicará la tarifa base configurada en el anuncio para todos los días del año.
                  </p>
                ) : (
                  rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-[#D4AF37]/5 p-3.5 shadow-sm text-black"
                    >
                      <div>
                        <strong className="text-xs sm:text-sm block font-mono">{rule.name}</strong>
                        <span className="text-xs font-mono font-bold text-black">{rule.pricePerDay} €/día</span>
                        <span className="text-[11px] font-mono text-gray-500 ml-2">
                          ({new Date(rule.startDate).toLocaleDateString('es-ES')} – {new Date(rule.endDate).toLocaleDateString('es-ES')})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeRule(rule.id)}
                        aria-label="Eliminar tarifa"
                        className="rounded-xl p-2 text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
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
