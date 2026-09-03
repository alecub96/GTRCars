'use client';

import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const pretty = (value: string) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Seleccionar';

function Month({ month, startDate, endDate, blocked, onSelect }: { month: Date; startDate: string; endDate: string; blocked: { startDate: string; endDate: string }[]; onSelect: (value: string) => void }) {
  const offset = (month.getDay() + 6) % 7;
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, index) => index + 1)];
  
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const unavailable = (value: string) => blocked.some((range) => value >= range.startDate.slice(0, 10) && value < range.endDate.slice(0, 10));
  
  return (
    <div className="min-w-0 flex-1">
      <h4 className="mb-4 text-center font-serif text-lg font-bold capitalize">
        {month.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
      </h4>
      <div className="grid grid-cols-7 gap-1">
        {WEEK.map((day) => (
          <span key={day} className="pb-2 text-center text-[10px] font-black text-[#94A3B8]">
            {day}
          </span>
        ))}
        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;
          const cellDate = new Date(month.getFullYear(), month.getMonth(), day);
          const value = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;
          const isBlocked = unavailable(value);
          const disabled = value < today || isBlocked;
          const selected = value === startDate || value === endDate;
          const inRange = Boolean(startDate && endDate && value > startDate && value < endDate);
          return (
            <button
              type="button"
              key={value}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(value);
              }}
              className={`relative aspect-square rounded-full text-xs font-bold transition-all ${
                selected
                  ? 'z-10 bg-[#16B8AA] text-white shadow-md ring-4 ring-[#16B8AA]/25 scale-105 font-black'
                  : inRange
                  ? 'bg-[#16B8AA]/25 text-[#13322E] font-extrabold border border-[#16B8AA]/40 rounded-full'
                  : isBlocked
                  ? 'cursor-not-allowed bg-amber-100 text-amber-800 line-through'
                  : disabled
                  ? 'cursor-not-allowed opacity-30 line-through'
                  : 'text-[#13322E] hover:bg-[#16B8AA] hover:text-white cursor-pointer'
              }`}
              title={isBlocked ? 'No disponible' : undefined}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangeCalendar({
  startDate,
  endDate,
  onChange,
  blocked = [],
  variant = 'popover',
}: {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  blocked?: { startDate: string; endDate: string }[];
  variant?: 'inline' | 'popover';
}) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquea el scroll de la página de fondo cuando el modal está abierto
  useEffect(() => {
    if (open && variant === 'popover') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [open, variant]);

  const select = (value: string) => {
    if (!startDate || endDate || value <= startDate) {
      onChange(value, '');
    } else {
      onChange(startDate, value);
    }
  };

  const calculatedNights = Boolean(startDate && endDate)
    ? Math.max(0, Math.round((new Date(`${endDate}T00:00:00`).getTime() - new Date(`${startDate}T00:00:00`).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Contenido puro del calendario
  const calendarContent = (
    <div className="w-full text-[#13322E]">
      <div className="mb-5 flex items-center justify-between border-b border-[#E9E1D2] pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#16B8AA]">Selecciona Fechas</span>
          <p className="text-xs text-[#6B726E] font-medium">Elige días de entrega y devolución de tu camper</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Mes anterior"
            onClick={(e) => {
              e.stopPropagation();
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
            }}
            className="rounded-full border border-[#E9E1D2] p-2 hover:bg-[#F7F6F2] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Mes siguiente"
            onClick={(e) => {
              e.stopPropagation();
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
            }}
            className="rounded-full border border-[#E9E1D2] p-2 hover:bg-[#F7F6F2] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {variant === 'popover' && (
            <button
              type="button"
              aria-label="Cerrar calendario"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="ml-1 rounded-full p-2 hover:bg-[#F7F6F2] text-[#6B726E] hover:text-[#13322E] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <Month month={month} startDate={startDate} endDate={endDate} blocked={blocked} onSelect={select} />
        <div className="hidden flex-1 md:block">
          <Month month={new Date(month.getFullYear(), month.getMonth() + 1, 1)} startDate={startDate} endDate={endDate} blocked={blocked} onSelect={select} />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#F7F6F2] p-4 border border-[#E9E1D2]">
        <div className="flex items-center gap-4 text-xs font-medium">
          <div>
            <small className="block text-[#6B726E] font-bold text-[10px] uppercase tracking-wider">Entrega</small>
            <strong className="text-sm font-serif text-[#13322E]">{pretty(startDate)}</strong>
          </div>
          <span className="text-[#16B8AA] font-bold">→</span>
          <div>
            <small className="block text-[#6B726E] font-bold text-[10px] uppercase tracking-wider">Devolución</small>
            <strong className="text-sm font-serif text-[#13322E]">{pretty(endDate)}</strong>
          </div>
          {calculatedNights > 0 && (
            <span className="bg-[#16B8AA]/10 text-[#16B8AA] border border-[#16B8AA]/30 px-3 py-1 rounded-full font-black text-xs">
              {calculatedNights} {calculatedNights === 1 ? 'noche' : 'noches'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('', '');
              }}
              className="text-xs font-bold text-[#6B726E] hover:text-[#13322E] hover:underline cursor-pointer"
            >
              Borrar fechas
            </button>
          )}
          {variant === 'popover' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="bg-[#16B8AA] hover:bg-[#0F766E] text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Aplicar Fechas
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Variante inline: se dibuja dentro del contenedor donde se coloque (por ejemplo panel de propietario)
  if (variant === 'inline') {
    return (
      <div className="w-full rounded-2xl border border-[#E9E1D2] bg-white p-5 shadow-sm">
        {calendarContent}
      </div>
    );
  }

  // Variante popover: botón disparador y modal mediante Portal
  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex w-full items-center space-x-3 text-left cursor-pointer p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2] hover:border-[#16B8AA] hover:bg-white transition-all shadow-sm group"
      >
        <CalendarDays className="h-5 w-5 shrink-0 text-[#16B8AA] group-hover:scale-110 transition-transform" />
        <div className="grid flex-1 grid-cols-2 gap-2 min-w-0">
          <div className="truncate">
            <small className="block text-[9px] font-black uppercase tracking-wider text-[#6B726E]">Entrega</small>
            <strong className="text-xs sm:text-sm font-extrabold text-[#13322E] truncate block">
              {pretty(startDate)}
            </strong>
          </div>
          <div className="truncate">
            <small className="block text-[9px] font-black uppercase tracking-wider text-[#6B726E]">Devolución</small>
            <strong className="text-xs sm:text-sm font-extrabold text-[#13322E] truncate block">
              {pretty(endDate)}
            </strong>
          </div>
        </div>
      </button>

      {open && mounted && createPortal(
        <div
          tabIndex={-1}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative z-[1000000] w-[min(740px,calc(100vw-32px))] max-h-[90vh] overflow-y-auto rounded-[32px] border border-[#E9E1D2] bg-white p-5 sm:p-7 text-[#13322E] shadow-2xl animate-soft-appear"
            onClick={(e) => e.stopPropagation()}
          >
            {calendarContent}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
