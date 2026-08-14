'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { DollarSign, Landmark, CreditCard, Clock, ShieldCheck, ArrowUpRight, Receipt, FileText, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

const DEFAULT_FINANCE = {
  gross: 0,
  platformFees: 0,
  net: 0,
  pending: 0,
};

export default function OwnerFinancePage() {
  const [finance, setFinance] = useState<any>(DEFAULT_FINANCE);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/owner/analytics').then((res) => res.json()),
      fetch('/api/bookings').then((res) => res.json()),
    ])
      .then(([analyticsData, bookingsData]) => {
        if (analyticsData?.finance) {
          setFinance(analyticsData.finance);
        }
        if (bookingsData?.bookings && Array.isArray(bookingsData.bookings)) {
          setBookings(bookingsData.bookings);
        }
      })
      .catch((err) => {
        console.warn('Finance data fetch warning:', err);
        setErrorMsg('Mostrando panel contable preparado.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* CABECERA DE FINANZAS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#16B8AA]">
              Contabilidad del Propietario
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#13322E] mt-1">
              Finanzas y Cobros
            </h1>
            <p className="mt-2 text-sm text-[#6B726E] font-medium">
              Gestión transparente de ingresos, comisiones aplicadas y transferencias a tu IBAN bancario.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/api/stripe/connect"
              className="inline-flex items-center space-x-2 bg-[#13322E] hover:bg-[#254842] text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md transition-all"
            >
              <Landmark className="w-4 h-4 text-[#16B8AA]" />
              <span>Configurar Cuenta Bancaria (IBAN)</span>
            </Link>
          </div>
        </div>

        {/* 1. TARJETAS FINANCIERAS PRINCIPALES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B726E] mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider">Volumen Cobrado</span>
              <DollarSign className="w-4 h-4 text-[#16B8AA]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#13322E]">
                {loading ? '0.00 €' : `${Number(finance.gross || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-[#6B726E] font-medium mt-1">Total pagado por viajeros</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B726E] mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider">Comisión Plataforma</span>
              <Receipt className="w-4 h-4 text-[#16B8AA]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#13322E]">
                {loading ? '0.00 €' : `${Number(finance.platformFees || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-[#6B726E] font-medium mt-1">Gestión y seguro Vaneando</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B726E] mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider">Neto a Transferir</span>
              <Landmark className="w-4 h-4 text-[#16B8AA]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#16B8AA]">
                {loading ? '0.00 €' : `${Number(finance.net || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-[#6B726E] font-medium mt-1">Liquidación a tu banco</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B726E] mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider">Pendiente / Próximos</span>
              <Clock className="w-4 h-4 text-[#D97706]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#D97706]">
                {loading ? '0.00 €' : `${Number(finance.pending || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-[#6B726E] font-medium mt-1">Solicitudes y pendientes</span>
            </div>
          </div>
        </div>

        {/* 2. HISTORIAL Y DESGLOSE DE TRANSACCIONES Y RESERVAS */}
        <div className="bg-white rounded-3xl border border-[#E9E1D2] p-6 shadow-sm mb-10">
          <div className="flex items-center justify-between pb-4 border-b border-[#E9E1D2] mb-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-[#16B8AA]" />
              <h2 className="font-serif text-2xl font-bold text-[#13322E]">Historial de Reservas y Cobros</h2>
            </div>
            <span className="text-xs font-bold text-[#6B726E]">
              {bookings.length} {bookings.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-[#6B726E]">Cargando transacciones...</div>
          ) : bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E9E1D2] text-[10px] font-black uppercase tracking-wider text-[#6B726E]">
                    <th className="py-3 px-2">Código</th>
                    <th className="py-3 px-2">Camper</th>
                    <th className="py-3 px-2">Viajero</th>
                    <th className="py-3 px-2">Fechas</th>
                    <th className="py-3 px-2">Estado</th>
                    <th className="py-3 px-2 text-right">Neto Propietario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E1D2]/60 text-xs font-medium">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-[#16B8AA]">{booking.code}</td>
                      <td className="py-3 px-2 font-bold text-[#13322E]">{booking.vehicle?.title || 'Camper'}</td>
                      <td className="py-3 px-2 text-[#6B726E]">
                        {booking.traveler?.firstName} {booking.traveler?.lastName}
                      </td>
                      <td className="py-3 px-2 text-[#6B726E]">
                        {new Date(booking.pickupDate || booking.createdAt).toLocaleDateString('es-ES')} -{' '}
                        {new Date(booking.returnDate || booking.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            booking.status === 'CONFIRMED' || booking.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : booking.status === 'REQUESTED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-serif text-sm font-bold text-[#13322E]">
                        {Number(booking.ownerPayout || 0).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-[#6B726E]">
              <FileText className="w-10 h-10 text-[#16B8AA] mx-auto mb-3 opacity-60" />
              <p className="font-bold text-[#13322E]">Aún no tienes historial de cobros o reservas pagadas.</p>
              <p className="text-xs mt-1">
                Cuando recibas y confirmes tu primera reserva, verás aquí el desglose detallado de cada importe pagado y tu ganancia neta.
              </p>
            </div>
          )}
        </div>

        {/* 3. PANEL INFORMATIVO DE SEGURIDAD FINANCIERA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#16B8AA]" />
              <h3 className="font-serif text-xl font-bold text-[#13322E]">Garantía de Cobro y Transferencia</h3>
            </div>
            <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
              Vaneando retiene de forma segura el importe de la reserva y lo transfiere automáticamente a tu cuenta bancaria (IBAN) <strong>24 horas después de la entrega de llaves (check-in)</strong> del vehículo.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <Building2 className="w-5 h-5 text-[#16B8AA]" />
              <h3 className="font-serif text-xl font-bold text-[#13322E]">Fiscalidad e IGIC (Canarias)</h3>
            </div>
            <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
              Todos los cobros calculados incluyen los impuestos e IGIC correspondiente según la normativa de la Comunidad Autónoma de Canarias. Los recibos de alquiler se generan automáticamente.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
