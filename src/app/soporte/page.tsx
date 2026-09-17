'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageSquare, Send, ShieldCheck, Mail, Phone, Clock, User, Sparkles, AlertCircle, Headphones } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/support/messages', { cache: 'no-store' });
      if (response.status === 401) {
        return;
      }
      const data = await response.json();
      setConversations(data.conversations || []);
      setActiveId((current) => current || data.conversations?.[0]?.id || null);
    } catch (err) {
      console.error('Error cargando conversaciones:', err);
    }
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/support/messages?conversationId=${id}`, { cache: 'no-store' });
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error cargando mensajes:', err);
    }
  }, []);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data.user || null);
        if (data.user) {
          void loadConversations();
        }
      })
      .catch(() => setCurrentUser(null))
      .finally(() => setIsAuthLoading(false));
  }, [loadConversations]);

  useEffect(() => {
    if (!activeId) return;
    void loadMessages(activeId);
    const interval = setInterval(() => loadMessages(activeId), 3500);
    return () => clearInterval(interval);
  }, [activeId, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim() || sending) return;
    setError('');
    setSending(true);

    try {
      const response = await fetch('/api/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeId, content: content.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
        return;
      }
      setContent('');
      setActiveId(data.conversationId);
      await loadConversations();
      await loadMessages(data.conversationId);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setSending(false);
    }
  }

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 sm:py-12 w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase mb-2">
              <Headphones className="w-3.5 h-3.5" />
              CONSERJERÍA VIP GTR CARS
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              {isAdmin ? 'Panel de Soporte con Usuarios' : 'Canal Privado con Conserjería VIP'}
            </h1>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-mono font-bold w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>Conserjería activa 24/7 en Canarias</span>
          </div>
        </div>

        {/* SI EL USUARIO NO ESTÁ AUTENTICADO */}
        {!isAuthLoading && !currentUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-[#0f0f12] p-8 sm:p-10 shadow-2xl flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-white mb-2">
                  Inicia sesión para abrir un canal con Conserjería
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-mono leading-relaxed">
                  Para poder asociar tu consulta a tu reserva de superdeportivo, fianza o custodia en el Vault, identifícate en la plataforma.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('open-auth-modal', {
                      detail: {
                        mode: 'login',
                        subtitle: 'Inicia sesión para chatear con el equipo de Conserjería VIP.',
                      },
                    })
                  )
                }
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] hover:brightness-110 text-black text-xs font-mono font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Acceder a mi Cuenta VIP</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#0f0f12] p-6 shadow-xl space-y-1">
                <Mail className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h3 className="text-sm font-mono font-bold text-white">Correo VIP</h3>
                <p className="text-xs font-mono text-neutral-400">vip@gtrcars.vip</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#0f0f12] p-6 shadow-xl space-y-1">
                <Clock className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h3 className="text-sm font-mono font-bold text-white">Tiempo de respuesta</h3>
                <p className="text-xs font-mono text-neutral-400">Menos de 15 minutos (24/7)</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#0f0f12] p-6 shadow-xl space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h3 className="text-sm font-mono font-bold text-white">Emergencias en ruta</h3>
                <p className="text-xs font-mono text-neutral-400">Asistencia de plataforma baja 24/7</p>
              </div>
            </div>
          </div>
        )}

        {/* CHAT DE SOPORTE PARA USUARIOS AUTENTICADOS */}
        {currentUser && (
          <div className="grid h-[620px] grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f12] shadow-2xl md:grid-cols-3">
            {isAdmin && (
              <aside className="overflow-y-auto border-r border-white/10 bg-black/60 p-4">
                <h2 className="mb-3 font-mono font-bold text-sm text-white flex items-center justify-between">
                  <span>Conversaciones activas</span>
                  <span className="text-xs bg-[#D4AF37] text-black px-2 py-0.5 rounded-full font-bold">
                    {conversations.length}
                  </span>
                </h2>
                {conversations.length === 0 ? (
                  <p className="text-xs font-mono text-neutral-400 p-3 text-center">No hay tickets abiertos.</p>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setActiveId(conversation.id)}
                      className={`mb-2 w-full rounded-2xl border p-3 text-left transition-all cursor-pointer font-mono ${
                        activeId === conversation.id
                          ? 'border-[#D4AF37] bg-neutral-900 shadow-md ring-1 ring-[#D4AF37]'
                          : 'border-white/5 hover:bg-neutral-900/60 text-neutral-400'
                      }`}
                    >
                      <strong className="block text-sm text-white">
                        {conversation.user.firstName} {conversation.user.lastName}
                      </strong>
                      <span className="block truncate text-xs text-neutral-400">
                        {conversation.user.email}
                      </span>
                      {conversation._count?.messages > 0 && (
                        <span className="mt-1 inline-block rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-bold text-black">
                          {conversation._count.messages} nuevos
                        </span>
                      )}
                    </button>
                  ))
                )}
              </aside>
            )}

            <section className={`flex flex-col ${isAdmin ? 'md:col-span-2' : 'md:col-span-3'}`}>
              <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-black/40">
                {messages.length === 0 && (
                  <div className="text-center py-16 px-4">
                    <MessageSquare className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-60" />
                    <p className="text-sm font-mono font-bold text-white">
                      {isAdmin && !activeId
                        ? 'Selecciona una conversación de la lista.'
                        : '¡Hola! Escribe tu consulta al equipo de Conserjería VIP.'}
                    </p>
                    <p className="text-xs font-mono text-neutral-400 mt-1 max-w-sm mx-auto">
                      Un agente de GTR Cars te responderá de inmediato.
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.system
                        ? 'justify-center'
                        : message.sender?.id === currentUser?.id
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-md font-mono ${
                        message.system
                          ? 'border border-[#D4AF37]/30 bg-neutral-900 text-center text-white'
                          : message.sender?.id === currentUser?.id
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black font-semibold rounded-br-none'
                          : 'bg-neutral-900 border border-white/10 text-white rounded-bl-none'
                      }`}
                    >
                      <strong className="mb-1 block text-[10px] uppercase tracking-wider opacity-70">
                        {message.system
                          ? 'Sistema GTR Cars'
                          : message.sender?.role === 'ADMIN'
                          ? 'Conserjería VIP'
                          : `${message.sender?.firstName || ''} ${message.sender?.lastName || ''}`}
                      </strong>
                      <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                      <span className="block text-[9px] text-right mt-1 opacity-60">
                        {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {error && (
                <div className="border-t border-red-500/30 bg-red-950/40 px-4 py-2 text-xs font-mono text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {(!isAdmin || activeId) && (
                <form onSubmit={send} className="flex gap-2 border-t border-white/10 p-3 sm:p-4 bg-[#0f0f12]">
                  <input
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    required
                    disabled={sending}
                    placeholder="Escribe tu mensaje a Conserjería VIP..."
                    className="flex-1 rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-[#D4AF37] disabled:bg-neutral-800"
                  />
                  <button
                    type="submit"
                    disabled={sending || !content.trim()}
                    className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] hover:brightness-110 disabled:opacity-40 px-5 py-3 text-black transition-all shadow-md cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Enviar mensaje"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
