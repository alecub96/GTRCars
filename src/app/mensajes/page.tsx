'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  ShieldAlert,
  Lock,
  ArrowLeft,
  Search,
  ExternalLink,
  MapPin,
  Car,
  Clock,
  CheckCheck,
  RefreshCw,
  Info,
} from 'lucide-react';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

interface VehicleSummary {
  id: string;
  title: string;
  slug: string;
  island: string;
  municipality?: string;
  basePricePerDay: number;
  photos: { url: string }[];
}

interface ConversationItem {
  id: string;
  vehicle?: VehicleSummary;
  traveler: Participant;
  owner: Participant;
  booking?: {
    id: string;
    code: string;
    status: string;
    startDate: string;
    returnDate: string;
  } | null;
  messages: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    read?: boolean;
  }[];
  updatedAt: string;
}

interface MessageItem {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: Participant;
  read?: boolean;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [inputContent, setInputContent] = useState('');
  const [warningMsg, setWarningMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = useCallback(
    async (targetConvId?: string | null, vehicleId?: string | null, recipientId?: string | null, bookingId?: string | null) => {
      try {
        const params = new URLSearchParams();
        if (targetConvId) params.set('conversationId', targetConvId);
        if (vehicleId) params.set('vehicleId', vehicleId);
        if (recipientId) params.set('recipientId', recipientId);
        if (bookingId) params.set('bookingId', bookingId);

        const res = await fetch(`/api/messages?${params.toString()}`);
        const data = await res.json();

        if (data.currentUser) {
          setCurrentUser(data.currentUser);
        }

        if (Array.isArray(data.conversations)) {
          setConversations(data.conversations);

          const autoSelectId = data.requestedConversationId || targetConvId;
          if (autoSelectId) {
            setActiveConvId(autoSelectId);
            setMobileView('chat');
          } else if (data.conversations.length > 0) {
            setActiveConvId((current) => current || data.conversations[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchMessages = useCallback(async (convId: string, isSilent = false) => {
    if (!isSilent) setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?conversationId=${encodeURIComponent(convId)}`);
      const data = await res.json();
      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      if (!isSilent) setLoadingMessages(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const convId = searchParams.get('conversationId');
    const vehicleId = searchParams.get('vehicleId');
    const recipientId = searchParams.get('recipientId');
    const bookingId = searchParams.get('bookingId');

    void fetchConversations(convId, vehicleId, recipientId, bookingId);
  }, [fetchConversations]);

  // Carga de mensajes de la conversación activa y polling silencioso cada 4 segundos
  useEffect(() => {
    if (!activeConvId) return;

    void fetchMessages(activeConvId);
    const interval = setInterval(() => {
      void fetchMessages(activeConvId, true);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeConvId, fetchMessages]);

  // Auto-scroll al recibir mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectConversation = (convId: string) => {
    setActiveConvId(convId);
    setMobileView('chat');
    setWarningMsg('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !activeConvId || sending) return;

    const contentToSend = inputContent.trim();
    setWarningMsg('');
    setSending(true);

    // Actualización optimista local
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: MessageItem = {
      id: tempId,
      content: contentToSend,
      createdAt: new Date().toISOString(),
      senderId: currentUser?.id || 'me',
      sender: {
        id: currentUser?.id || 'me',
        firstName: currentUser?.firstName || 'Yo',
        lastName: currentUser?.lastName || '',
        avatarUrl: currentUser?.avatarUrl || '/default-avatar.svg',
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputContent('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: contentToSend,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setWarningMsg(data.error || 'No se pudo enviar el mensaje');
        // Revertir optimismo
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setInputContent(contentToSend);
        return;
      }

      await fetchMessages(activeConvId, true);
      void fetchConversations(activeConvId);
    } catch (err: any) {
      setWarningMsg('Error de conexión al enviar el mensaje');
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInputContent(contentToSend);
    } finally {
      setSending(false);
    }
  };

  // Conversación seleccionada actual
  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // Obtener el interlocutor de la conversación
  const getOtherParticipant = (conv?: ConversationItem) => {
    if (!conv || !currentUser) return conv?.owner || conv?.traveler;
    return conv.traveler.id === currentUser.id ? conv.owner : conv.traveler;
  };

  const otherUser = getOtherParticipant(activeConversation);

  // Filtrado de conversaciones
  const filteredConversations = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    const vehicleTitle = c.vehicle?.title || '';
    const otherName = `${other?.firstName || ''} ${other?.lastName || ''}`.toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    return vehicleTitle.toLowerCase().includes(query) || otherName.includes(query);
  });

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8">
        
        {/* AVISO DE MENSAJERÍA PROTEGIDA (Oculto en móvil cuando se está dentro de un chat para maximizar espacio vertical) */}
        <div className={`bg-[#13322E] text-white p-3.5 sm:p-4 rounded-2xl mb-3 sm:mb-6 items-center justify-between gap-3 text-xs font-medium shadow-sm ${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-[#16B8AA] shrink-0" />
            <span>
              <strong>Mensajería Oficial Vaneando:</strong> Mantén siempre las conversaciones dentro de la plataforma para proteger tu reserva, contrato y fianza con cobertura completa.
            </span>
          </div>
          <span className="bg-white/10 text-[#F2CC8F] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 self-start sm:self-auto">
            🛡️ Canal Encriptado
          </span>
        </div>

        {/* CONTENEDOR PRINCIPAL DEL CHAT (Adaptable en móvil con 100dvh para no quedar bajo la barra del navegador) */}
        <div className="bg-white rounded-3xl border border-[#E9E1D2] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100dvh-80px)] sm:h-[750px]">
          
          {/* COLUMNA IZQUIERDA: BANDEJA DE CONVERSACIONES (Oculta en móvil si está en vista 'chat') */}
          <div
            className={`md:col-span-5 lg:col-span-4 border-r border-[#E9E1D2] bg-[#FBFBFA] flex flex-col h-full ${
              mobileView === 'chat' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* CABECERA BANDEJA */}
            <div className="p-4 border-b border-[#E9E1D2]">
              <div className="flex items-center justify-between mb-3">
                <h1 className="font-serif text-xl font-bold text-[#13322E] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#16B8AA]" />
                  <span>Mensajes ({conversations.length})</span>
                </h1>
                <button
                  type="button"
                  onClick={() => fetchConversations(activeConvId)}
                  className="p-2 text-slate-400 hover:text-[#16B8AA] transition-colors rounded-full hover:bg-slate-100 cursor-pointer"
                  title="Actualizar mensajes"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* BUSCADOR */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por camper o persona..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#E9E1D2] text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                />
              </div>
            </div>

            {/* LISTA DE HILOS */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="p-8 text-center text-xs text-[#6B726E] space-y-2">
                  <RefreshCw className="w-5 h-5 text-[#16B8AA] animate-spin mx-auto" />
                  <p>Cargando conversaciones...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((c) => {
                  const isActive = c.id === activeConvId;
                  const other = getOtherParticipant(c);
                  const lastMsg = c.messages[0];
                  const photoUrl = c.vehicle?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400';

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectConversation(c.id)}
                      className={`w-full p-3 rounded-2xl text-left transition-all flex items-start space-x-3 border cursor-pointer ${
                        isActive
                          ? 'bg-[#F4F9F8] border-[#16B8AA] shadow-sm ring-1 ring-[#16B8AA]'
                          : 'bg-white border-[#E9E1D2]/70 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* FOTO MINIATURA DE LA CAMPER */}
                      <div className="relative shrink-0">
                        <img
                          src={photoUrl}
                          alt={c.vehicle?.title || 'Camper'}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E9E1D2]"
                        />
                        <img
                          src={other?.avatarUrl || '/default-avatar.svg'}
                          alt={other?.firstName || 'Usuario'}
                          className="w-5 h-5 rounded-full object-cover border-2 border-white absolute -bottom-1 -right-1 shadow-xs"
                        />
                      </div>

                      {/* TEXTOS Y DETALLES */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-bold text-xs text-[#13322E] truncate max-w-[150px]">
                            {other?.firstName} {other?.lastName}
                          </h4>
                          {lastMsg && (
                            <span className="text-[10px] text-[#6B726E] shrink-0 font-medium">
                              {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] font-bold text-[#16B8AA] truncate">
                          🚐 {c.vehicle?.title || 'Consulta de camper'}
                        </p>

                        <p className="text-[11px] text-[#6B726E] truncate font-normal mt-1">
                          {lastMsg ? lastMsg.content : 'Sin mensajes todavía'}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-[#6B726E] flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-[#13322E]">No hay conversaciones</p>
                  <p className="text-[11px] text-[#6B726E] max-w-xs mx-auto">
                    Cuando contactes al propietario de un anuncio o un viajero te pregunte sobre tu vehículo, la conversación aparecerá aquí.
                  </p>
                  <Link
                    href="/buscar"
                    className="inline-block mt-2 px-4 py-2 rounded-full bg-[#16B8AA] text-white text-xs font-black uppercase tracking-wider"
                  >
                    Explorar Campers
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: SALA DE CHAT ACTIVA (Visible en móvil si está en vista 'chat') */}
          <div
            className={`md:col-span-7 lg:col-span-8 flex flex-col justify-between h-full bg-white ${
              mobileView === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConversation ? (
              <>
                {/* 1. CABECERA DEL CHAT CON CONTEXTO DEL VEHÍCULO Y DEL INTERLOCUTOR */}
                <div className="p-3 sm:p-4 border-b border-[#E9E1D2] bg-[#FAF7F0] flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* BOTÓN VOLVER EN MÓVIL */}
                    <button
                      type="button"
                      onClick={() => setMobileView('list')}
                      className="md:hidden p-1.5 rounded-full text-[#13322E] hover:bg-slate-200 transition-colors"
                      aria-label="Volver a la lista"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* AVATAR INTERLOCUTOR */}
                    <img
                      src={otherUser?.avatarUrl || '/default-avatar.svg'}
                      alt={otherUser?.firstName || 'Usuario'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-serif font-bold text-sm text-[#13322E] truncate">
                          {otherUser?.firstName} {otherUser?.lastName}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Activo
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B726E] truncate">
                        {activeConversation.vehicle ? `${activeConversation.vehicle.title} (${activeConversation.vehicle.island})` : 'Chat oficial'}
                      </p>
                    </div>
                  </div>

                  {/* ACCESO DIRECTO A LA FICHA DEL VEHÍCULO */}
                  {activeConversation.vehicle && (
                    <Link
                      href={`/camper/${activeConversation.vehicle.slug || activeConversation.vehicle.id}`}
                      target="_blank"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#16B8AA] bg-white hover:bg-[#16B8AA] hover:text-white text-[#16B8AA] text-[11px] font-black uppercase tracking-wider transition-all shadow-xs shrink-0"
                    >
                      <span>Ver Camper</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* 2. TARJETA RESUMEN FLOTANTE DEL VEHÍCULO EN EL CHAT */}
                {activeConversation.vehicle && (
                  <div className="bg-[#F4F9F8] border-b border-[#E9E1D2] px-4 py-2 flex items-center justify-between text-xs text-[#13322E]">
                    <div className="flex items-center space-x-2 truncate">
                      <Car className="w-4 h-4 text-[#16B8AA] shrink-0" />
                      <span className="font-bold truncate">{activeConversation.vehicle.title}</span>
                      <span>•</span>
                      <span className="text-[#6B726E] font-medium">{activeConversation.vehicle.island}</span>
                    </div>
                    <span className="font-extrabold text-[#16B8AA] shrink-0 ml-2">
                      {activeConversation.vehicle.basePricePerDay}€ / día
                    </span>
                  </div>
                )}

                {/* 3. HISTORIAL DE MENSAJES (BURBUJAS) */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-gradient-to-b from-slate-50/40 to-white">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <RefreshCw className="w-6 h-6 text-[#16B8AA] animate-spin" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((m) => {
                      const isMine = m.senderId === currentUser?.id || m.senderId === 'me';
                      return (
                        <div
                          key={m.id}
                          className={`flex items-end space-x-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMine && (
                            <img
                              src={m.sender?.avatarUrl || '/default-avatar.svg'}
                              alt={m.sender?.firstName || 'Usuario'}
                              className="w-7 h-7 rounded-full object-cover border border-white shadow-xs shrink-0 mb-1"
                            />
                          )}

                          <div
                            className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                              isMine
                                ? 'bg-[#16B8AA] text-white rounded-br-xs'
                                : 'bg-[#FAF7F0] border border-[#E9E1D2] text-[#13322E] rounded-bl-xs'
                            }`}
                          >
                            {!isMine && (
                              <span className="block text-[10px] font-black uppercase text-[#16B8AA] mb-1">
                                {m.sender?.firstName}
                              </span>
                            )}

                            <p className="font-medium whitespace-pre-wrap">{m.content}</p>

                            <div
                              className={`flex items-center justify-end space-x-1 text-[9px] mt-1.5 ${
                                isMine ? 'text-white/80' : 'text-[#6B726E]'
                              }`}
                            >
                              <span>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMine && <CheckCheck className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center space-y-2 text-[#6B726E] my-auto">
                      <div className="w-12 h-12 rounded-full bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center mx-auto">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#13322E]">¡Inicia la conversación!</h4>
                      <p className="text-xs max-w-sm mx-auto">
                        Escribe tus dudas sobre disponibilidad, puntos de recogida en {activeConversation.vehicle?.island || 'Canarias'}, o cualquier detalle de la camper.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 4. ADVERTENCIA EN CASO DE DETECCIÓN DE FRAUDE / BYPASS */}
                {warningMsg && (
                  <div className="px-4 py-2.5 bg-red-50 text-red-800 text-xs font-bold border-t border-red-200 flex items-center space-x-2 animate-fade-in">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{warningMsg}</span>
                  </div>
                )}

                {/* 5. FORMULARIO DE ENVÍO DE MENSAJE */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-[#E9E1D2] bg-white flex items-center space-x-2 shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-4 shadow-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder={`Escribe un mensaje a ${otherUser?.firstName || 'el propietario'}...`}
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    disabled={sending}
                    className="flex-1 px-4 py-3 bg-[#FAF7F0] rounded-2xl border border-[#E9E1D2] text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16B8AA] focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputContent.trim()}
                    className="p-3 rounded-2xl bg-[#16B8AA] hover:bg-[#0F766E] disabled:opacity-50 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
                    aria-label="Enviar mensaje"
                  >
                    {sending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-[#FAF7F0] border border-[#E9E1D2] flex items-center justify-center text-[#16B8AA]">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#13322E]">Tus Mensajes en Vaneando</h3>
                <p className="text-xs text-[#6B726E] max-w-sm leading-relaxed font-medium">
                  Selecciona una conversación del listado izquierdo para chatear en directo con el viajero o propietario.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
