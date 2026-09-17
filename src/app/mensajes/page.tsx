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
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8 font-mono">
        
        {/* AVISO DE MENSAJERÍA PROTEGIDA VAULT */}
        <div className={`bg-[#0f0f12] text-white p-3.5 sm:p-4 rounded-2xl mb-3 sm:mb-6 items-center justify-between gap-3 text-xs font-mono border border-white/10 shadow-lg ${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <span className="text-white/80 font-sans text-xs">
              <strong className="text-white font-mono uppercase tracking-wider">Canal Oficial GT Cars // Vault Escrow:</strong> Mantén las conversaciones dentro de la plataforma para proteger tu reserva, telemetría y fianza en custodia.
            </span>
          </div>
          <span className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 self-start sm:self-auto">
            SSL 256-BIT ENCRIPTADO
          </span>
        </div>

        {/* CONTENEDOR PRINCIPAL DEL CHAT */}
        <div className="bg-[#0f0f12] rounded-3xl border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100dvh-80px)] sm:h-[750px]">
          
          {/* COLUMNA IZQUIERDA: BANDEJA DE CONVERSACIONES */}
          <div
            className={`md:col-span-5 lg:col-span-4 border-r border-white/10 bg-[#0a0a0d] flex flex-col h-full ${
              mobileView === 'chat' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* CABECERA BANDEJA */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>Mensajería ({conversations.length})</span>
                </h1>
                <button
                  type="button"
                  onClick={() => fetchConversations(activeConvId)}
                  className="p-2 text-white/40 hover:text-[#D4AF37] transition-colors rounded-xl hover:bg-white/5 cursor-pointer"
                  title="Actualizar mensajes"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* BUSCADOR */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar por superdeportivo o piloto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/[0.03] rounded-xl border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            {/* LISTA DE HILOS */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="p-8 text-center text-xs text-white/40 space-y-2">
                  <RefreshCw className="w-5 h-5 text-[#D4AF37] animate-spin mx-auto" />
                  <p>Cargando hilos seguros...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((c) => {
                  const isActive = c.id === activeConvId;
                  const other = getOtherParticipant(c);
                  const lastMsg = c.messages[0];
                  const photoUrl = c.vehicle?.photos?.[0]?.url || '/supercars/lambo-revuelto.jpg';

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectConversation(c.id)}
                      className={`w-full p-3 rounded-2xl text-left transition-all flex items-start space-x-3 border cursor-pointer ${
                        isActive
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.1)] ring-1 ring-[#D4AF37]/30'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      {/* FOTO MINIATURA */}
                      <div className="relative shrink-0">
                        <img
                          src={photoUrl}
                          alt={c.vehicle?.title || 'Supercar'}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10"
                        />
                        <img
                          src={other?.avatarUrl || '/default-avatar.svg'}
                          alt={other?.firstName || 'Usuario'}
                          className="w-5 h-5 rounded-full object-cover border border-[#D4AF37]/50 absolute -bottom-1 -right-1 shadow-xs"
                        />
                      </div>

                      {/* TEXTOS Y DETALLES */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-bold text-xs text-white truncate max-w-[150px] font-sans">
                            {other?.firstName} {other?.lastName}
                          </h4>
                          {lastMsg && (
                            <span className="text-[10px] text-white/40 shrink-0">
                              {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] font-bold text-[#D4AF37] truncate">
                          {c.vehicle?.title || 'Consulta de Superdeportivo'}
                        </p>

                        <p className="text-[11px] text-white/50 truncate font-sans mt-1">
                          {lastMsg ? lastMsg.content : 'Sin mensajes todavía'}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 text-white/40 flex items-center justify-center mx-auto border border-white/10">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Sin conversaciones activas</p>
                  <p className="text-[11px] text-white/40 max-w-xs mx-auto font-sans">
                    Cuando consultes sobre una unidad en el Vault o un conductor contacte sobre tu superdeportivo, aparecerá aquí.
                  </p>
                  <Link
                    href="/buscar"
                    className="inline-block mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black text-xs font-bold uppercase tracking-wider"
                  >
                    Explorar Vault
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: SALA DE CHAT ACTIVA */}
          <div
            className={`md:col-span-7 lg:col-span-8 flex flex-col justify-between h-full bg-[#0f0f12] ${
              mobileView === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConversation ? (
              <>
                {/* 1. CABECERA DEL CHAT */}
                <div className="p-3 sm:p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileView('list')}
                      className="md:hidden p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Volver a la lista"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <img
                      src={otherUser?.avatarUrl || '/default-avatar.svg'}
                      alt={otherUser?.firstName || 'Usuario'}
                      className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/50 shadow-md shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-sm text-white truncate font-sans">
                          {otherUser?.firstName} {otherUser?.lastName}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Conectado
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 truncate font-mono">
                        {activeConversation.vehicle ? `${activeConversation.vehicle.title} (${activeConversation.vehicle.island})` : 'Canal Vault'}
                      </p>
                    </div>
                  </div>

                  {/* ACCESO DIRECTO A LA FICHA DEL VEHÍCULO */}
                  {activeConversation.vehicle && (
                    <Link
                      href={`/camper/${activeConversation.vehicle.slug || activeConversation.vehicle.id}`}
                      target="_blank"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs shrink-0"
                    >
                      <span>Ver Ficha</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* 2. TARJETA RESUMEN FLOTANTE */}
                {activeConversation.vehicle && (
                  <div className="bg-white/[0.03] border-b border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center space-x-2 truncate">
                      <Car className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span className="font-bold truncate">{activeConversation.vehicle.title}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/60 font-mono">{activeConversation.vehicle.island}</span>
                    </div>
                    <span className="font-bold text-[#D4AF37] shrink-0 ml-2">
                      {activeConversation.vehicle.basePricePerDay}€ / día
                    </span>
                  </div>
                )}

                {/* 3. HISTORIAL DE MENSAJES (BURBUJAS DARK LUXURY) */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-black/40">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin" />
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
                              className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-xs shrink-0 mb-1"
                            />
                          )}

                          <div
                            className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 text-xs shadow-md leading-relaxed ${
                              isMine
                                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black font-medium rounded-br-xs'
                                : 'bg-[#18181c] border border-white/10 text-white rounded-bl-xs'
                            }`}
                          >
                            {!isMine && (
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1 font-mono">
                                {m.sender?.firstName}
                              </span>
                            )}

                            <p className="whitespace-pre-wrap font-sans text-xs">{m.content}</p>

                            <div
                              className={`flex items-center justify-end space-x-1 text-[9px] mt-2 font-mono ${
                                isMine ? 'text-black/70' : 'text-white/40'
                              }`}
                            >
                              <span>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMine && <CheckCheck className="w-3.5 h-3.5 text-black" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center space-y-2 text-white/50 my-auto">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto border border-[#D4AF37]/20">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-white uppercase tracking-wider">Inicia el protocolo de contacto</h4>
                      <p className="text-xs max-w-sm mx-auto font-sans">
                        Consulta detalles sobre la telemetría, punto de entrega VIP o extras para esta unidad.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 4. ADVERTENCIA */}
                {warningMsg && (
                  <div className="px-4 py-2.5 bg-red-950/80 text-red-300 text-xs font-mono border-t border-red-500/30 flex items-center space-x-2 animate-fade-in">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{warningMsg}</span>
                  </div>
                )}

                {/* 5. FORMULARIO DE ENVÍO */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-white/10 bg-[#0f0f12] flex items-center space-x-2 shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-4 shadow-xl"
                >
                  <input
                    type="text"
                    required
                    placeholder={`Escribe un mensaje seguro a ${otherUser?.firstName || 'el propietario'}...`}
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    disabled={sending}
                    className="flex-1 px-4 py-3 bg-white/[0.04] rounded-xl border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] font-sans"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputContent.trim()}
                    className="p-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] hover:brightness-110 disabled:opacity-40 text-black font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
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
                <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#D4AF37]">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Bandeja Segura GT Cars</h3>
                <p className="text-xs text-white/50 max-w-sm leading-relaxed font-sans">
                  Selecciona una conversación del listado izquierdo para chatear en directo con el piloto o propietario.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
