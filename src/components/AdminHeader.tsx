'use client';

import Link from 'next/link';
import { LayoutDashboard, LogOut, ShieldCheck, UserRound } from 'lucide-react';

export default function AdminHeader() {
  async function logout() {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    window.location.assign('/admin');
  }

  return (
    <header className="border-b border-[#244842] bg-[#13322E] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16B8AA] text-white"><ShieldCheck className="h-5 w-5" /></span>
          <span><strong className="block font-serif text-xl">vaneando.</strong><small className="block text-[9px] font-black uppercase tracking-[.2em] text-[#7DE3DA]">Administración</small></span>
        </Link>
        <nav className="flex items-center gap-2 text-xs font-bold">
          <Link href="/admin" className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5"><LayoutDashboard className="h-4 w-4" /> Panel</Link>
          <Link href="/perfil" className="flex items-center gap-2 rounded-full px-4 py-2.5 hover:bg-white/10"><UserRound className="h-4 w-4" /> Perfil</Link>
          <button type="button" onClick={() => void logout()} className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[#FFB8B8] hover:bg-white/10"><LogOut className="h-4 w-4" /> Salir</button>
        </nav>
      </div>
    </header>
  );
}
