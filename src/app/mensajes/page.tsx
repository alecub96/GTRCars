'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { MessageSquare, Send, ShieldAlert, Lock, User, RefreshCw } from 'lucide-react';

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [warningMsg, setWarningMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  // POLLING AUTOMÁTICO CADA 2 SEGUNDOS PARA SIMULAR WEBSOCKET / CHAT EN TIEMPO REAL
  useEffect(() => {
    if (!activeConvId) return;

    fetchMessages(activeConvId);

    const interval = setInterval(() => {
      fetchMessagesSilently(activeConvId);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeConvId]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !activeConvId) {
          setActiveConvId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessagesSilently = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      // Silencioso sin refrescar UI agresivo
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !activeConvId) return;

    setWarningMsg('');
    setSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: inputContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setWarningMsg(data.error || 'Mensaje no permitido');
        return;
      }

      setInputContent('');
      fetchMessages(activeConvId);
      fetchConversations();
    } catch (err: any) {
      setWarningMsg('Error al enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* BANNER INFORMATIVO DE TIEMPO REAL Y BLINDAJE DE MENSAJERÍA */}
        <div className="bg-[#13322E] text-white p-4 rounded-3xl mb-6 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3 text-xs font-medium">
            <Lock className="w-5 h-5 text-[#16B8AA] shrink-0" />
            <span>
              <strong>Chat en Directo Protegido:</strong> Los mensajes se reciben en tiempo real. Por tu seguridad, no está permitido compartir datos de contacto externos (teléfonos, emails o webs de terceros).
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest bg-[#16B8AA]/20 text-[#16B8AA] px-3 py-1 rounded-full border border-[#16B8AA]/30">
            <span className="w-2 h-2 rounded-full bg-[#16B8AA] animate-pulse" />
            <span>En directo 2s</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E9E1D2] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[650px]">
          
          {/* LISTA DE CONVERSACIONES */}
          <div className="border-r border-[#E9E1D2] bg-[#F8FAFC] p-4 overflow-y-auto">
            <h2 className="font-serif text-xl font-bold mb-4 px-2">Conversaciones</h2>
            {conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((c) => {
                  const isActive = c.id === activeConvId;
                  const lastMsg = c.messages[0]?.content || 'Sin mensajes';
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveConvId(c.id)}
                      className={`w-full p-3 rounded-2xl text-left transition-all flex items-start space-x-3 border ${
                        isActive
                          ? 'bg-white border-[#16B8AA] shadow-sm ring-1 ring-[#16B8AA]'
                          : 'bg-transparent border-transparent hover:bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center font-bold text-xs shrink-0">
                        {c.vehicle?.title ? c.vehicle.title[0] : 'C'}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-serif text-sm font-bold text-[#13322E] truncate">
                          {c.vehicle?.title || 'Consulta Camper'}
                        </h4>
                        <p className="text-[11px] text-[#6B726E] truncate font-medium mt-0.5">
                          {lastMsg}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#6B726E]">
                No tienes conversaciones activas aún.
              </div>
            )}
          </div>

          {/* CHAT DE MENSAJES EN DIRECTO */}
          <div className="md:col-span-2 flex flex-col justify-between h-full bg-white">
            {activeConvId ? (
              <>
                {/* CABECERA CHAT CON INDICADOR PULSANTE DE TIEMPO REAL */}
                <div className="p-4 border-b border-[#E9E1D2] bg-[#F8FAFC] flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#13322E]">
                    <MessageSquare className="w-4 h-4 text-[#16B8AA]" />
                    <span>Chat Protegido Canarias</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase text-emerald-600">En Vivo</span>
                  </div>
                </div>

                {/* MENSAJES */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  {messages.map((m) => (
                    <div key={m.id} className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-[#6B726E]">
                        <span>{m.sender.firstName} {m.sender.lastName}</span>
                        <span>•</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#F4F9F8] border border-[#E9E1D2] text-xs text-[#13322E] max-w-md font-medium leading-relaxed shadow-sm">
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* AVISO DE ADVERTENCIA DE BLINDAJE EN TIEMPO REAL */}
                {warningMsg && (
                  <div className="px-6 py-2 bg-red-50 text-red-700 text-xs font-bold border-t border-red-200 flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{warningMsg}</span>
                  </div>
                )}

                {/* CAMPO DE ENTRADA DE MENSAJES */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E9E1D2] flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="Escribe tu mensaje en directo sobre la camper..."
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    className="flex-1 p-3 rounded-xl border border-[#E9E1D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="p-3 rounded-xl bg-[#16B8AA] text-white hover:bg-[#0F766E] transition-all font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-[#6B726E]">
                Selecciona una conversación para chatear en directo.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
