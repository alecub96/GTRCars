'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const week = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function DateRangeCalendar({ startDate, endDate, onChange, blocked = [] }: { startDate: string; endDate: string; onChange: (start: string, end: string) => void; blocked?: { startDate: string; endDate: string }[] }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const firstOffset = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(firstOffset).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
  const today = iso(new Date());
  const unavailable = (value: string) => blocked.some((range) => value >= range.startDate.slice(0, 10) && value < range.endDate.slice(0, 10));
  const select = (value: string) => {
    if (value < today || unavailable(value)) return;
    if (!startDate || endDate || value <= startDate) onChange(value, '');
    else onChange(startDate, value);
  };

  return <div className="rounded-2xl border border-[#E9E1D2] bg-white p-4 shadow-sm">
    <div className="mb-4 flex items-center justify-between"><button type="button" aria-label="Mes anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-full p-2 hover:bg-[#F7F6F2]"><ChevronLeft className="h-4 w-4" /></button><strong className="capitalize">{month.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</strong><button type="button" aria-label="Mes siguiente" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-full p-2 hover:bg-[#F7F6F2]"><ChevronRight className="h-4 w-4" /></button></div>
    <div className="grid grid-cols-7 gap-1">{week.map((day) => <span key={day} className="pb-2 text-center text-[10px] font-bold text-[#6B726E]">{day}</span>)}{cells.map((day, index) => {
      if (!day) return <span key={`empty-${index}`} />;
      const value = iso(new Date(month.getFullYear(), month.getMonth(), day));
      const disabled = value < today || unavailable(value);
      const inRange = startDate && endDate && value > startDate && value < endDate;
      const selected = value === startDate || value === endDate;
      return <button type="button" key={value} disabled={disabled} onClick={() => select(value)} className={`aspect-square rounded-xl text-xs transition ${selected ? 'bg-[#13322E] font-bold text-white' : inRange ? 'bg-[#CCFBF1] text-[#13322E]' : disabled ? 'cursor-not-allowed text-slate-300 line-through' : 'hover:bg-[#F0FDFA]'}`}>{day}</button>;
    })}</div>
    <p className="mt-3 text-center text-[11px] text-[#6B726E]">{startDate ? endDate ? `${startDate} → ${endDate}` : 'Selecciona ahora la devolución' : 'Selecciona la fecha de entrega'}</p>
  </div>;
}
