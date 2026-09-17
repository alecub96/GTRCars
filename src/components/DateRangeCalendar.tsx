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
    <div className="min-w-0 flex-1 font-mono">
      <h4 className="mb-4 text-center font-bold text-sm text-black capitalize tracking-wider">
        {month.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
      </h4>
      <div className="grid grid-cols-7 gap-1">
        {WEEK.map((day) => (
          <span key={day} className="pb-2 text-center text-[10px] font-bold text-gray-400">
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
              className={`relative aspect-square rounded-xl text-xs font-bold transition-all ${
                selected
                  ? 'z-10 bg-black text-white shadow-md scale-105 font-black'
                  : inRange
                  ? 'bg-gray-100 text-black font-bold border border-gray-200 rounded-xl'
                  : isBlocked
                  ? 'cursor-not-allowed bg-red-50 text-red-300 line-through'
                  : disabled
                  ? 'cursor-not-allowed text-gray-300 line-through'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer'
              }`}
              title={isBlocked ? 'Fecha reservada' : undefined}
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
    <div className="w-full text-black font-mono">
      <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[.18em] text-gray-500">Selección de Fechas</span>
          <p className="text-xs text-gray-500 font-normal">Días de entrega y devolución en el Garaje</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Mes anterior"
            onClick={(e) => {
              e.stopPropagation();
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
            }}
            className="rounded-xl border border-gray-200 p-2 hover:bg-gray-100 text-gray-600 hover:text-black transition-colors cursor-pointer"
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
            className="rounded-xl border border-gray-200 p-2 hover:bg-gray-100 text-gray-600 hover:text-black transition-colors cursor-pointer"
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
              className="ml-1 rounded-xl p-2 hover:bg-gray-100 text-gray-400 hover:text-black transition-colors cursor-pointer"
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

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4 border border-gray-200">
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <small className="block text-gray-400 font-bold text-[10px] uppercase tracking-wider">Entrega</small>
            <strong className="text-sm font-bold text-black">{pretty(startDate)}</strong>
          </div>
          <span className="text-gray-400 font-bold">→</span>
          <div>
            <small className="block text-gray-400 font-bold text-[10px] uppercase tracking-wider">Devolución</small>
            <strong className="text-sm font-bold text-black">{pretty(endDate)}</strong>
          </div>
          {calculatedNights > 0 && (
            <span className="bg-black text-white px-3 py-1 rounded-full font-bold text-xs">
              {calculatedNights} {calculatedNights === 1 ? 'día de conducción' : 'días de conducción'}
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
              className="text-xs font-bold text-gray-500 hover:text-black hover:underline cursor-pointer"
            >
              Limpiar
            </button>
          )}
          {variant === 'popover' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:bg-gray-800 transition-all cursor-pointer"
            >
              Confirmar Fechas
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Variante inline
  if (variant === 'inline') {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
        {calendarContent}
      </div>
    );
  }

  // Variante popover
  return (
    <div className="relative w-full font-mono">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex w-full items-center space-x-3 text-left cursor-pointer p-3.5 rounded-xl bg-white border border-gray-200 hover:border-black transition-all shadow-xs group"
      >
        <CalendarDays className="h-5 w-5 shrink-0 text-black group-hover:scale-110 transition-transform" />
        <div className="grid flex-1 grid-cols-2 gap-2 min-w-0">
          <div className="truncate">
            <small className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">Entrega</small>
            <strong className="text-xs sm:text-sm font-bold text-black truncate block">
              {pretty(startDate)}
            </strong>
          </div>
          <div className="truncate">
            <small className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">Devolución</small>
            <strong className="text-xs sm:text-sm font-bold text-black truncate block">
              {pretty(endDate)}
            </strong>
          </div>
        </div>
      </button>

      {open && mounted && createPortal(
        <div
          tabIndex={-1}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative z-[1000000] w-[min(740px,calc(100vw-32px))] max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 sm:p-7 text-black shadow-2xl animate-soft-appear"
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
