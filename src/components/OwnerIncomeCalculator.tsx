'use client';

import { useMemo, useState } from 'react';

export default function OwnerIncomeCalculator() {
  const [dailyRate, setDailyRate] = useState(1250);
  const [availableDays, setAvailableDays] = useState(10);
  const [occupancy, setOccupancy] = useState(65);

  const result = useMemo(() => {
    const bookedDays = (Math.max(0, availableDays) * Math.min(100, Math.max(0, occupancy))) / 100;
    const gross = Math.round(dailyRate * bookedDays * 100) / 100;
    const fee = Math.round(gross * 0.097 * 100) / 100;
    return {
      bookedDays: Math.round(bookedDays * 10) / 10,
      gross,
      fee,
      net: Math.round((gross - fee) * 100) / 100,
    };
  }, [dailyRate, availableDays, occupancy]);

  const comparison = [
    { name: 'GTR Cars Vault', rate: 9.7, featured: true },
    { name: 'Agencia Tradicional', rate: 25, featured: false },
    { name: 'Broker Externo', rate: 30, featured: false },
  ];

  return (
    <section
      aria-labelledby="calculadora-ingresos"
      className="rounded-3xl bg-neutral-950 p-6 text-white shadow-xl sm:p-9 border border-neutral-800 font-sans"
    >
      <div className="max-w-2xl">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-gray-400">
          SIMULADOR DE RENDIMIENTO // PROPIETARIOS
        </span>
        <h2 id="calculadora-ingresos" className="mt-2 text-2xl sm:text-3xl font-black uppercase tracking-tight">
          ¿Cuánto puede generar tu superdeportivo?
        </h2>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-300">
          Calcula el retorno mensual estimado según tu tarifa diaria y los días que decidas habilitar tu unidad en el Garaje GTR Cars.
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3 font-mono text-xs">
        <label className="font-bold text-gray-200">
          Tarifa diaria (€/día)
          <input
            type="number"
            min="200"
            value={dailyRate}
            onChange={(e) => setDailyRate(Number(e.target.value) || 0)}
            className="mt-2 w-full rounded-xl border border-neutral-700 bg-white p-3 text-black font-black"
          />
        </label>
        <label className="font-bold text-gray-200">
          Días disponibles al mes
          <input
            type="number"
            min="0"
            max="31"
            value={availableDays}
            onChange={(e) => setAvailableDays(Number(e.target.value) || 0)}
            className="mt-2 w-full rounded-xl border border-neutral-700 bg-white p-3 text-black font-black"
          />
        </label>
        <label className="font-bold text-gray-200">
          Ocupación estimada (%)
          <input
            type="number"
            min="0"
            max="100"
            value={occupancy}
            onChange={(e) => setOccupancy(Number(e.target.value) || 0)}
            className="mt-2 w-full rounded-xl border border-neutral-700 bg-white p-3 text-black font-black"
          />
        </label>
      </div>
      <div className="mt-8 grid gap-3 rounded-2xl bg-white/10 p-5 sm:grid-cols-4 font-mono">
        <div>
          <span className="block text-[11px] text-gray-300 uppercase">Jornadas alquiladas</span>
          <strong className="text-xl text-white">{result.bookedDays} días</strong>
        </div>
        <div>
          <span className="block text-[11px] text-gray-300 uppercase">Facturación bruta</span>
          <strong className="text-xl text-white">{result.gross.toFixed(0)} €</strong>
        </div>
        <div>
          <span className="block text-[11px] text-gray-300 uppercase">Gestión GTR Cars (9,7%)</span>
          <strong className="text-xl text-gray-300">-{result.fee.toFixed(0)} €</strong>
        </div>
        <div>
          <span className="block text-[11px] text-emerald-400 uppercase font-bold">Liquidación neta</span>
          <strong className="text-2xl text-emerald-400 font-black">{result.net.toFixed(0)} €</strong>
        </div>
      </div>
      <div className="mt-8 rounded-2xl bg-white p-5 text-black sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">
              COMPARATIVA DE LIQUIDACIÓN
            </span>
            <h3 className="mt-1 text-xl font-black uppercase tracking-tight">
              Liquidación neta frente a intermediarios tradicionales
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-gray-600">
            Sobre {result.gross.toFixed(0)} € brutos
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3 font-mono">
          {comparison.map((platform) => {
            const fee = Math.round(result.gross * platform.rate) / 100;
            const net = Math.round((result.gross - fee) * 100) / 100;
            return (
              <div
                key={platform.name}
                className={`rounded-xl border p-4 ${
                  platform.featured ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase">{platform.name}</span>
                  {platform.featured && (
                    <span className="rounded-full bg-black px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                      GTR Cars
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs text-gray-600">Comisión: {platform.rate}%</p>
                <strong className="mt-1 block text-xl font-black text-black">
                  {net.toFixed(0)} € <span className="text-xs font-normal text-gray-500">netos</span>
                </strong>
                {!platform.featured && (
                  <p className="mt-2 text-[11px] font-bold text-red-600">
                    -{(result.net - net).toFixed(0)} € frente a GTR Cars
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
