'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import { MessageSquare, Send, ShieldCheck, Mail, Phone, Clock, User, Sparkles, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#16B8AA]">
              Centro de Ayuda & Atención al Cliente
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13322E] mt-1">
              {isAdmin ? 'Panel de Soporte con Usuarios' : 'Habla con el equipo de vaneando.'}
            </h1>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-emerald-800 text-xs font-bold w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Soporte activo en Canarias (8:00 - 22:00)</span>
          </div>
        </div>

        {/* SI EL USUARIO NO ESTÁ AUTENTICADO */}
        {!isAuthLoading && !currentUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 rounded-3xl border border-[#E9E1D2] bg-white p-8 sm:p-10 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#13322E] mb-2">
                  Inicia sesión para abrir un ticket de chat
                </h2>
                <p className="text-sm text-[#6B726E] leading-relaxed mb-6">
                  Para poder asociar tu consulta a tus reservas, contrato o furgoneta y responderte con la mayor rapidez, identifícate en la plataforma.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('open-auth-modal', {
                      detail: {
                        mode: 'login',
                        subtitle: 'Inicia sesión o regístrate para chatear con el equipo de soporte.',
                      },
                    })
                  )
                }
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Acceder / Crear Cuenta para Chatear</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm">
                <Mail className="w-5 h-5 text-[#16B8AA] mb-2" />
                <h3 className="text-sm font-bold text-[#13322E]">Correo Electrónico</h3>
                <p className="text-xs text-[#6B726E] mt-0.5">soporte@vaneando.com</p>
              </div>
              <div className="rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm">
                <Clock className="w-5 h-5 text-[#16B8AA] mb-2" />
                <h3 className="text-sm font-bold text-[#13322E]">Tiempo de respuesta</h3>
                <p className="text-xs text-[#6B726E] mt-0.5">Menos de 15 minutos en horario diurno</p>
              </div>
              <div className="rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#16B8AA] mb-2" />
                <h3 className="text-sm font-bold text-[#13322E]">Emergencias en ruta</h3>
                <p className="text-xs text-[#6B726E] mt-0.5">Asistencia telefónica 24/7 en tu contrato</p>
              </div>
            </div>
          </div>
        )}

        {/* CHAT DE SOPORTE PARA USUARIOS AUTENTICADOS */}
        {currentUser && (
          <div className="grid h-[620px] grid-cols-1 overflow-hidden rounded-3xl border border-[#E9E1D2] bg-white shadow-xl md:grid-cols-3">
            {isAdmin && (
              <aside className="overflow-y-auto border-r border-[#E9E1D2] bg-[#FAF7F0] p-4">
                <h2 className="mb-3 font-bold text-sm text-[#13322E] flex items-center justify-between">
                  <span>Conversaciones activas</span>
                  <span className="text-xs bg-[#16B8AA] text-white px-2 py-0.5 rounded-full font-bold">
                    {conversations.length}
                  </span>
                </h2>
                {conversations.length === 0 ? (
                  <p className="text-xs text-[#6B726E] p-3 text-center">No hay tickets abiertos.</p>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setActiveId(conversation.id)}
                      className={`mb-2 w-full rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                        activeId === conversation.id
                          ? 'border-[#16B8AA] bg-white shadow-sm ring-2 ring-[#16B8AA]/10'
                          : 'border-transparent hover:bg-white/60'
                      }`}
                    >
                      <strong className="block text-sm text-[#13322E]">
                        {conversation.user.firstName} {conversation.user.lastName}
                      </strong>
                      <span className="block truncate text-xs text-[#6B726E]">
                        {conversation.user.email}
                      </span>
                      {conversation._count?.messages > 0 && (
                        <span className="mt-1 inline-block rounded-full bg-[#16B8AA] px-2 py-0.5 text-[10px] font-bold text-white">
                          {conversation._count.messages} nuevos
                        </span>
                      )}
                    </button>
                  ))
                )}
              </aside>
            )}

            <section className={`flex flex-col ${isAdmin ? 'md:col-span-2' : 'md:col-span-3'}`}>
              <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="text-center py-16 px-4">
                    <MessageSquare className="w-10 h-10 text-[#16B8AA] mx-auto mb-3 opacity-60" />
                    <p className="text-sm font-bold text-[#13322E]">
                      {isAdmin && !activeId
                        ? 'Selecciona una conversación de la lista.'
                        : '¡Hola! Escribe tu consulta abajo.'}
                    </p>
                    <p className="text-xs text-[#6B726E] mt-1 max-w-sm mx-auto">
                      Un agente de Vaneando te responderá de inmediato.
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
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-sm shadow-sm ${
                        message.system
                          ? 'border border-[#16B8AA]/30 bg-[#F4F9F8] text-center text-[#13322E] text-xs font-medium'
                          : message.sender?.id === currentUser?.id
                          ? 'bg-[#13322E] text-white rounded-br-none'
                          : 'bg-[#FAF7F0] border border-[#E9E1D2] text-[#13322E] rounded-bl-none'
                      }`}
                    >
                      <strong className="mb-1 block text-[10px] uppercase tracking-wider opacity-70">
                        {message.system
                          ? 'Asistente Vaneando'
                          : message.sender?.role === 'ADMIN'
                          ? 'Equipo Vaneando'
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
                <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {(!isAdmin || activeId) && (
                <form onSubmit={send} className="flex gap-2 border-t border-[#E9E1D2] p-3 sm:p-4 bg-white">
                  <input
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    required
                    disabled={sending}
                    placeholder="Escribe tu mensaje al equipo de soporte..."
                    className="flex-1 rounded-xl border border-[#E9E1D2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#16B8AA] disabled:bg-slate-50"
                  />
                  <button
                    type="submit"
                    disabled={sending || !content.trim()}
                    className="rounded-xl bg-[#16B8AA] hover:bg-[#0F766E] disabled:bg-slate-300 px-5 py-3 text-white transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
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
    </div>
  );
}
