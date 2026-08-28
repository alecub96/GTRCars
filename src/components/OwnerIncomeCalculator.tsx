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
    </section>
  );
}
