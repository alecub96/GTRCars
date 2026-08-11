'use client';

import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

const WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const pretty = (value: string) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Seleccionar';

function Month({ month, startDate, endDate, blocked, onSelect }: { month: Date; startDate: string; endDate: string; blocked: { startDate: string; endDate: string }[]; onSelect: (value: string) => void }) {
  const offset = (month.getDay() + 6) % 7;
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, index) => index + 1)];
  const today = iso(new Date());
  const unavailable = (value: string) => blocked.some((range) => value >= range.startDate.slice(0, 10) && value < range.endDate.slice(0, 10));
  return <div className="min-w-0 flex-1"><h4 className="mb-4 text-center font-serif text-lg font-bold capitalize">{month.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h4><div className="grid grid-cols-7 gap-1">{WEEK.map((day) => <span key={day} className="pb-2 text-center text-[10px] font-black text-[#94A3B8]">{day}</span>)}{cells.map((day, index) => {
    if (!day) return <span key={`empty-${index}`} />;
    const value = iso(new Date(month.getFullYear(), month.getMonth(), day));
    const isBlocked = unavailable(value);
    const disabled = value < today || isBlocked;
    const selected = value === startDate || value === endDate;
    const inRange = Boolean(startDate && endDate && value > startDate && value < endDate);
    return <button type="button" key={value} disabled={disabled} onClick={() => onSelect(value)} className={`relative aspect-square rounded-full text-xs font-bold transition-all ${selected ? 'z-10 bg-[#16B8AA] text-white shadow-md ring-4 ring-[#16B8AA]/15' : inRange ? 'rounded-none bg-[#CCFBF1] text-[#13322E]' : isBlocked ? 'cursor-not-allowed bg-amber-100 text-amber-800 line-through' : disabled ? 'cursor-not-allowed text-slate-300 line-through' : 'text-[#13322E] hover:bg-[#F0FDFA] hover:text-[#0F766E]'}`} title={isBlocked ? 'No disponible' : undefined}>{day}</button>;
  })}</div></div>;
}

export default function DateRangeCalendar({ startDate, endDate, onChange, blocked = [], variant = 'inline' }: { startDate: string; endDate: string; onChange: (start: string, end: string) => void; blocked?: { startDate: string; endDate: string }[]; variant?: 'inline' | 'popover' }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [open, setOpen] = useState(false);
  const select = (value: string) => {
    if (!startDate || endDate || value <= startDate) onChange(value, '');
    else { onChange(startDate, value); if (variant === 'popover') setTimeout(() => setOpen(false), 180); }
  };
  const calendar = <div className={`${variant === 'popover' ? 'absolute left-1/2 top-[calc(100%+12px)] z-[100] w-[min(760px,calc(100vw-32px))] -translate-x-1/2 shadow-2xl' : 'w-full shadow-sm'} rounded-[28px] border border-[#E9E1D2] bg-white p-5 text-[#13322E]`}>
    <div className="mb-5 flex items-center justify-between border-b border-[#E9E1D2] pb-4"><div><span className="text-[10px] font-black uppercase tracking-[.18em] text-[#16B8AA]">Elige tu viaje</span><p className="text-xs text-[#6B726E]">Selecciona entrega y devolución</p></div><div className="flex gap-1"><button type="button" aria-label="Mes anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-full border border-[#E9E1D2] p-2 hover:bg-[#F7F6F2]"><ChevronLeft className="h-4 w-4" /></button><button type="button" aria-label="Mes siguiente" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-full border border-[#E9E1D2] p-2 hover:bg-[#F7F6F2]"><ChevronRight className="h-4 w-4" /></button>{variant === 'popover' && <button type="button" aria-label="Cerrar calendario" onClick={() => setOpen(false)} className="ml-1 rounded-full p-2 hover:bg-[#F7F6F2]"><X className="h-4 w-4" /></button>}</div></div>
    <div className="flex gap-8"><Month month={month} startDate={startDate} endDate={endDate} blocked={blocked} onSelect={select} /><div className="hidden flex-1 md:block"><Month month={new Date(month.getFullYear(), month.getMonth() + 1, 1)} startDate={startDate} endDate={endDate} blocked={blocked} onSelect={select} /></div></div>
    <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#F7F6F2] p-3"><div className="flex items-center gap-3 text-xs"><span><small className="block text-[#6B726E]">Entrega</small><strong>{pretty(startDate)}</strong></span><span className="text-[#16B8AA]">→</span><span><small className="block text-[#6B726E]">Devolución</small><strong>{pretty(endDate)}</strong></span></div>{(startDate || endDate) && <button type="button" onClick={() => onChange('', '')} className="text-xs font-bold text-[#0F766E]">Borrar fechas</button>}</div>
  </div>;
  if (variant === 'inline') return calendar;
  return <div className="relative w-full"><button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 text-left"><CalendarDays className="h-5 w-5 shrink-0 text-[#16B8AA]" /><div className="grid flex-1 grid-cols-2 gap-3"><span><small className="block text-[9px] font-black uppercase tracking-wider text-[#94A3B8]">Salida</small><strong className="text-xs">{pretty(startDate)}</strong></span><span><small className="block text-[9px] font-black uppercase tracking-wider text-[#94A3B8]">Devolución</small><strong className="text-xs">{pretty(endDate)}</strong></span></div></button>{open && calendar}</div>;
}
