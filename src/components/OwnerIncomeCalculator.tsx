'use client';

import { useMemo, useState } from 'react';

export default function OwnerIncomeCalculator() {
  const [dailyRate, setDailyRate] = useState(90);
  const [availableDays, setAvailableDays] = useState(15);
  const [occupancy, setOccupancy] = useState(70);

  const result = useMemo(() => {
    const bookedDays = Math.max(0, availableDays) * Math.min(100, Math.max(0, occupancy)) / 100;
    const gross = Math.round(dailyRate * bookedDays * 100) / 100;
    const fee = Math.round(gross * 0.097 * 100) / 100;
    return { bookedDays: Math.round(bookedDays * 10) / 10, gross, fee, net: Math.round((gross - fee) * 100) / 100 };
  }, [dailyRate, availableDays, occupancy]);

  const comparison = [
    { name: 'Vaneando', rate: 9.7, featured: true },
    { name: 'Plataforma generalista', rate: 20, featured: false },
    { name: 'Marketplace especializado', rate: 25, featured: false },
  ];

  return (
    <section aria-labelledby="calculadora-ingresos" className="rounded-3xl bg-[#13322E] p-6 text-white shadow-xl sm:p-9">
      <div className="max-w-2xl">
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#F2CC8F]">Calculadora orientativa</span>
        <h2 id="calculadora-ingresos" className="mt-2 font-serif text-3xl font-bold">¿Cuánto podría generar tu camper?</h2>
        <p className="mt-2 text-sm leading-6 text-white/75">Haz una estimación rápida con tu precio, los días que quieres abrir y una ocupación prudente. No es una promesa de ingresos: depende de la demanda, temporada, vehículo y disponibilidad.</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <label className="text-sm font-bold">Precio por día (€)<input type="number" min="10" value={dailyRate} onChange={(e) => setDailyRate(Number(e.target.value) || 0)} className="mt-2 w-full rounded-xl border-0 bg-white p-3 text-[#13322E]" /></label>
        <label className="text-sm font-bold">Días disponibles<input type="number" min="0" max="365" value={availableDays} onChange={(e) => setAvailableDays(Number(e.target.value) || 0)} className="mt-2 w-full rounded-xl border-0 bg-white p-3 text-[#13322E]" /></label>
        <label className="text-sm font-bold">Ocupación estimada (%)<input type="number" min="0" max="100" value={occupancy} onChange={(e) => setOccupancy(Number(e.target.value) || 0)} className="mt-2 w-full rounded-xl border-0 bg-white p-3 text-[#13322E]" /></label>
      </div>
      <div className="mt-8 grid gap-3 rounded-2xl bg-white/10 p-5 sm:grid-cols-4">
        <div><span className="block text-xs text-white/65">Días reservados</span><strong className="text-xl">{result.bookedDays}</strong></div>
        <div><span className="block text-xs text-white/65">Ingresos brutos</span><strong className="text-xl">{result.gross.toFixed(2)} €</strong></div>
        <div><span className="block text-xs text-white/65">Comisión Vaneando (9,7%)</span><strong className="text-xl">-{result.fee.toFixed(2)} €</strong></div>
        <div><span className="block text-xs text-[#F2CC8F]">Neto estimado</span><strong className="text-2xl text-[#F2CC8F]">{result.net.toFixed(2)} €</strong></div>
      </div>
      <div className="mt-8 rounded-2xl bg-white p-5 text-[#13322E] sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#16B8AA]">Compara tu neto</span>
            <h3 className="mt-1 font-serif text-2xl font-bold">¿Qué recibirías con otras plataformas?</h3>
          </div>
          <span className="text-xs font-medium text-[#6B726E]">Sobre {result.gross.toFixed(2)} € brutos</span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {comparison.map((platform) => {
            const fee = Math.round(result.gross * platform.rate) / 100;
            const net = Math.round((result.gross - fee) * 100) / 100;
            return (
              <div key={platform.name} className={`rounded-xl border p-4 ${platform.featured ? 'border-[#16B8AA] bg-[#F0FDFA]' : 'border-[#E9E1D2] bg-[#FAF7F0]'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black">{platform.name}</span>
                  {platform.featured && <span className="rounded-full bg-[#16B8AA] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white">Tu opción</span>}
                </div>
                <p className="mt-3 text-xs text-[#6B726E]">Comisión orientativa: {platform.rate}%</p>
                <strong className="mt-1 block text-xl">{net.toFixed(2)} € <span className="text-xs font-medium text-[#6B726E]">netos</span></strong>
                {!platform.featured && <p className="mt-2 text-[11px] font-bold text-[#D97706]">-{(result.net - net).toFixed(2)} € frente a Vaneando</p>}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] leading-5 text-[#6B726E]">Comparativa orientativa para ayudarte a visualizar el impacto de las comisiones. Las tarifas de cada plataforma pueden cambiar según el mercado, el tipo de anuncio y las condiciones de la reserva.</p>
      </div>
    </section>
  );
}
