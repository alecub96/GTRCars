'use client';

import { useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { MessageSquare, Send } from 'lucide-react';

export default function SupportPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const loadConversations = useCallback(async () => {
    const response = await fetch('/api/support/messages');
    if (response.status === 401) { window.location.href = '/'; return; }
    const data = await response.json();
    setConversations(data.conversations || []);
    setActiveId((current) => current || data.conversations?.[0]?.id || null);
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    const response = await fetch(`/api/support/messages?conversationId=${id}`);
    const data = await response.json();
    if (response.ok) setMessages(data.messages || []);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me').then((response) => response.json()).then((data) => setCurrentUser(data.user));
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    loadMessages(activeId);
    const interval = setInterval(() => loadMessages(activeId), 3000);
    return () => clearInterval(interval);
  }, [activeId, loadMessages]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/support/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: activeId, content }),
    });
    const data = await response.json();
    if (!response.ok) { setError(data.error || 'No se pudo enviar'); return; }
    setContent('');
    setActiveId(data.conversationId);
    await loadConversations();
    await loadMessages(data.conversationId);
  }

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#16B8AA]">Soporte vaneando.</span>
          <h1 className="font-serif text-3xl font-bold">{isAdmin ? 'Conversaciones con usuarios' : 'Habla con nuestro equipo'}</h1>
        </div>
        <div className="grid h-[650px] grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-3">
          {isAdmin && (
            <aside className="overflow-y-auto border-r border-slate-200 bg-slate-50 p-4">
              <h2 className="mb-3 font-bold">Usuarios</h2>
              {conversations.map((conversation) => (
                <button key={conversation.id} onClick={() => setActiveId(conversation.id)} className={`mb-2 w-full rounded-2xl border p-3 text-left ${activeId === conversation.id ? 'border-[#16B8AA] bg-white' : 'border-transparent'}`}>
                  <strong className="block text-sm">{conversation.user.firstName} {conversation.user.lastName}</strong>
                  <span className="block truncate text-xs text-slate-500">{conversation.user.email}</span>
                  {conversation._count?.messages > 0 && <span className="mt-1 inline-block rounded-full bg-[#16B8AA] px-2 py-0.5 text-[10px] font-bold text-white">{conversation._count.messages} nuevos</span>}
                </button>
              ))}
            </aside>
          )}
          <section className={`flex flex-col ${isAdmin ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <div className="flex-1 space-y-3 overflow-y-auto p-6">
              {messages.length === 0 && <p className="text-center text-sm text-slate-500">{isAdmin && !activeId ? 'Selecciona una conversación.' : 'Escribe tu primer mensaje y el equipo administrador podrá responderte.'}</p>}
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender.id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl p-3 text-sm ${message.sender.id === currentUser?.id ? 'bg-[#13322E] text-white' : 'bg-[#F4F9F8] text-[#13322E]'}`}>
                    <strong className="mb-1 block text-[10px] uppercase tracking-wider opacity-70">{message.sender.role === 'ADMIN' ? 'Equipo vaneando.' : `${message.sender.firstName} ${message.sender.lastName}`}</strong>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            {error && <p className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700">{error}</p>}
            {(!isAdmin || activeId) && (
              <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-4">
                <input value={content} onChange={(event) => setContent(event.target.value)} required placeholder="Escribe tu mensaje..." className="flex-1 rounded-xl border border-slate-200 px-4 py-3" />
                <button className="rounded-xl bg-[#16B8AA] p-3 text-white" aria-label="Enviar mensaje"><Send className="h-5 w-5" /></button>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
