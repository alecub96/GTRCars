'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Search,
  RefreshCw,
  Eye,
  X,
  Lock,
  Car,
  User,
  ExternalLink,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

interface AdminConversationItem {
  id: string;
  vehicle?: {
    id: string;
    title: string;
    slug: string;
    island: string;
    basePricePerDay: number;
    photos?: { url: string }[];
  };
  traveler: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string | null;
  };
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string | null;
  };
  booking?: {
    id: string;
    code: string;
    status: string;
  } | null;
  _count?: {
    messages: number;
  };
  messages?: {
    content: string;
    createdAt: string;
    senderId: string;
  }[];
  updatedAt: string;
  createdAt: string;
}

interface DetailedConversation {
  id: string;
  vehicle?: any;
  traveler: any;
  owner: any;
  booking?: any;
  messages: {
    id: string;
    content: string;
    createdAt: string;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      avatarUrl?: string | null;
    };
  }[];
}

export default function AdminConversationsAudit() {
  const [conversations, setConversations] = useState<AdminConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState({
    totalConversations: 0,
    totalMessages: 0,
  });

  const [inspectingConvId, setInspectingConvId] = useState<string | null>(null);
  const [detailedConv, setDetailedConv] = useState<DetailedConversation | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('q', searchTerm.trim());

      const res = await fetch(`/api/admin/conversations?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar conversaciones');

      setConversations(data.conversations || []);
      if (data.metrics) setMetrics(data.metrics);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadConversations();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const openInspector = async (convId: string) => {
    setInspectingConvId(convId);
    setLoadingDetail(true);
    setDetailedConv(null);
    try {
      const res = await fetch(`/api/admin/conversations?conversationId=${encodeURIComponent(convId)}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo cargar el detalle del chat');
      setDetailedConv(data.conversation);
    } catch (err: any) {
      alert(err.message || 'Error al cargar transcripción');
      setInspectingConvId(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeInspector = () => {
    setInspectingConvId(null);
    setDetailedConv(null);
  };

  return (
    <div className="space-y-6">
      {/* CABECERA & MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#E9E1D2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B726E] uppercase tracking-wider">Total Chats</span>
            <MessageSquare className="w-5 h-5 text-[#16B8AA]" />
          </div>
          <h3 className="text-2xl font-black text-[#13322E] mt-2">{metrics.totalConversations}</h3>
          <p className="text-[11px] text-[#6B726E] mt-1">Hilos entre viajeros y propietarios</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E9E1D2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B726E] uppercase tracking-wider">Total Mensajes</span>
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-[#13322E] mt-2">{metrics.totalMessages}</h3>
          <p className="text-[11px] text-[#6B726E] mt-1">Mensajes filtrados y seguros en base de datos</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#FAF7F0] border border-[#E9E1D2] shadow-xs flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#16B8AA]" />
            <span className="text-xs font-bold text-[#13322E]">Auditoría de Mediación</span>
          </div>
          <p className="text-[11px] text-[#6B726E] leading-relaxed">
            Puedes inspeccionar cualquier conversación para resolver disputas, revisar consultas previas al alquiler o verificar acuerdos entre usuarios.
          </p>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTRADO */}
      <div className="p-4 bg-white rounded-3xl border border-[#E9E1D2] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por viajero, propietario, email o camper..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#FAF7F0] rounded-2xl border border-[#E9E1D2] text-xs font-medium text-[#13322E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
          />
        </div>

        <button
          type="button"
          onClick={loadConversations}
          className="px-4 py-2.5 rounded-2xl bg-white border border-[#E9E1D2] hover:bg-[#FAF7F0] text-xs font-bold text-[#13322E] flex items-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* ERROR FEEDBACK */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TABLA DE CONVERSACIONES */}
      <div className="bg-white rounded-3xl border border-[#E9E1D2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F0] border-b border-[#E9E1D2] text-[#6B726E] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Vehículo</th>
                <th className="py-3.5 px-4">Viajero</th>
                <th className="py-3.5 px-4">Propietario</th>
                <th className="py-3.5 px-4">Último Mensaje</th>
                <th className="py-3.5 px-4 text-center">Mensajes</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D2]/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B726E]">
                    <RefreshCw className="w-6 h-6 text-[#16B8AA] animate-spin mx-auto mb-2" />
                    Cargando conversaciones...
                  </td>
                </tr>
              ) : conversations.length > 0 ? (
                conversations.map((c) => {
                  const photoUrl = c.vehicle?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=300';
                  const lastMsg = c.messages?.[0];
                  const msgCount = c._count?.messages ?? (c.messages?.length || 0);

                  return (
                    <tr key={c.id} className="hover:bg-[#FAF7F0]/50 transition-colors">
                      {/* VEHÍCULO */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={photoUrl}
                            alt={c.vehicle?.title || 'Camper'}
                            className="w-10 h-10 rounded-xl object-cover border border-[#E9E1D2] shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#13322E] truncate max-w-[180px]">
                              {c.vehicle?.title || 'Camper'}
                            </h4>
                            <span className="text-[10px] text-[#6B726E] block font-medium">
                              {c.vehicle?.island || 'Canarias'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* VIAJERO */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-0">
                          <p className="font-bold text-[#13322E] truncate max-w-[150px]">
                            {c.traveler?.firstName} {c.traveler?.lastName}
                          </p>
                          <p className="text-[10px] text-[#6B726E] truncate max-w-[150px]">
                            {c.traveler?.email}
                          </p>
                        </div>
                      </td>

                      {/* PROPIETARIO */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-0">
                          <p className="font-bold text-[#13322E] truncate max-w-[150px]">
                            {c.owner?.firstName} {c.owner?.lastName}
                          </p>
                          <p className="text-[10px] text-[#6B726E] truncate max-w-[150px]">
                            {c.owner?.email}
                          </p>
                        </div>
                      </td>

                      {/* ÚLTIMO MENSAJE */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {lastMsg ? (
                          <div>
                            <p className="text-xs text-[#13322E] truncate font-medium">
                              {lastMsg.content}
                            </p>
                            <span className="text-[10px] text-[#6B726E]">
                              {new Date(lastMsg.createdAt).toLocaleString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#6B726E] italic">Sin mensajes</span>
                        )}
                      </td>

                      {/* CANTIDAD DE MENSAJES */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#E9E1D2] text-[11px] font-bold text-[#13322E]">
                          {msgCount}
                        </span>
                      </td>

                      {/* ACCIÓN INSPECCIONAR */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openInspector(c.id)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#16B8AA] hover:bg-[#0F766E] text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspeccionar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B726E]">
                    No se encontraron conversaciones con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE INSPECCIÓN COMPLETA DE CONVERSACIÓN */}
      {inspectingConvId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E9E1D2] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            {/* CABECERA MODAL */}
            <div className="p-5 border-b border-[#E9E1D2] bg-[#FAF7F0] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#16B8AA] text-white flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#13322E]">
                    Auditoría de Conversación
                  </h3>
                  <p className="text-xs text-[#6B726E]">
                    ID: <code className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#E9E1D2]">{inspectingConvId}</code>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeInspector}
                className="p-2 text-slate-400 hover:text-[#13322E] rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENIDO MODAL */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingDetail ? (
                <div className="py-16 text-center text-[#6B726E]">
                  <RefreshCw className="w-6 h-6 text-[#16B8AA] animate-spin mx-auto mb-2" />
                  Cargando transcripción completa...
                </div>
              ) : detailedConv ? (
                <>
                  {/* RESUMEN DE PARTICIPANTES Y CAMPER */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2] text-xs">
                    {/* CAMPER */}
                    <div className="space-y-1">
                      <span className="font-bold text-[#16B8AA] uppercase text-[10px] tracking-wider block">Camper</span>
                      <h4 className="font-bold text-[#13322E] truncate">{detailedConv.vehicle?.title || 'Vehículo'}</h4>
                      <p className="text-[#6B726E] text-[11px]">{detailedConv.vehicle?.island} · {detailedConv.vehicle?.basePricePerDay}€/día</p>
                      {detailedConv.vehicle?.slug && (
                        <Link
                          href={`/camper/${detailedConv.vehicle.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16B8AA] hover:underline mt-1"
                        >
                          <span>Ver anuncio</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    {/* VIAJERO */}
                    <div className="space-y-1">
                      <span className="font-bold text-[#16B8AA] uppercase text-[10px] tracking-wider block">Viajero</span>
                      <p className="font-bold text-[#13322E]">{detailedConv.traveler?.firstName} {detailedConv.traveler?.lastName}</p>
                      <p className="text-[#6B726E] text-[11px] truncate">{detailedConv.traveler?.email}</p>
                      {detailedConv.traveler?.phone && <p className="text-[#6B726E] text-[11px]">📞 {detailedConv.traveler.phone}</p>}
                    </div>

                    {/* PROPIETARIO */}
                    <div className="space-y-1">
                      <span className="font-bold text-[#16B8AA] uppercase text-[10px] tracking-wider block">Propietario</span>
                      <p className="font-bold text-[#13322E]">{detailedConv.owner?.firstName} {detailedConv.owner?.lastName}</p>
                      <p className="text-[#6B726E] text-[11px] truncate">{detailedConv.owner?.email}</p>
                      {detailedConv.owner?.phone && <p className="text-[#6B726E] text-[11px]">📞 {detailedConv.owner.phone}</p>}
                    </div>
                  </div>

                  {/* TRANSCRIPCIÓN CRONOLÓGICA */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#6B726E]">
                      Transcripción del Historial ({detailedConv.messages.length} mensajes)
                    </h4>

                    {detailedConv.messages.length > 0 ? (
                      <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-[#E9E1D2]">
                        {detailedConv.messages.map((m) => {
                          const isTraveler = m.sender.id === detailedConv.traveler?.id;
                          return (
                            <div
                              key={m.id}
                              className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                                isTraveler
                                  ? 'bg-white border-[#E9E1D2] mr-8'
                                  : 'bg-[#F4F9F8] border-[#16B8AA]/30 ml-8'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-[#13322E]">
                                    {m.sender.firstName} {m.sender.lastName}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                      isTraveler ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {isTraveler ? 'Viajero' : 'Propietario'}
                                  </span>
                                </div>
                                <span className="text-[10px] text-[#6B726E]">
                                  {new Date(m.createdAt).toLocaleString('es-ES')}
                                </span>
                              </div>
                              <p className="text-[#13322E] whitespace-pre-wrap leading-relaxed">
                                {m.content}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-center text-xs text-[#6B726E] py-8">
                        No hay mensajes registrados en esta conversación.
                      </p>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            {/* PIE MODAL */}
            <div className="p-4 border-t border-[#E9E1D2] bg-[#FAF7F0] flex justify-end">
              <button
                type="button"
                onClick={closeInspector}
                className="px-5 py-2.5 rounded-full bg-[#13322E] hover:bg-[#0F766E] text-white font-bold text-xs transition-all cursor-pointer"
              >
                Cerrar Auditoría
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
