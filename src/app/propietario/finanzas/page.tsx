'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { DollarSign, Landmark, CreditCard, Clock, ShieldCheck, ArrowUpRight, Receipt, FileText, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import StripeConnectOnboarding from '@/components/StripeConnectOnboarding';

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
  const [showBankSetup, setShowBankSetup] = useState(false);

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
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black flex flex-col">
      <Navbar />
      {showBankSetup && <StripeConnectOnboarding onClose={() => setShowBankSetup(false)} />}

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* CABECERA DE FINANZAS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#D4AF37]/30">
              <Sparkles className="w-3 h-3" />
              CONTABILIDAD &amp; LIQUIDACIONES DEL VAULT
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-1">
              Finanzas y Liquidaciones
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-mono">
              Gestión transparente de ingresos brutos, comisión de custodia (10%) y transferencias directas a tu IBAN.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setShowBankSetup(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              <Landmark className="w-4 h-4" />
              <span>Configurar Cuenta Bancaria (IBAN)</span>
            </button>
          </div>
        </div>

        {/* 1. TARJETAS FINANCIERAS PRINCIPALES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 font-mono">
          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-4">
              <span className="text-[10px] uppercase tracking-wider">Volumen Facturado</span>
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-white">
                {loading ? '0.00 €' : `${Number(finance.gross || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-neutral-400 mt-1">Total abonado por clientes VIP</span>
            </div>
          </div>

          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-4">
              <span className="text-[10px] uppercase tracking-wider">Custodia y Gestión</span>
              <Receipt className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-white">
                {loading ? '0.00 €' : `${Number(finance.platformFees || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-neutral-400 mt-1">Gestión de plataforma (10%)</span>
            </div>
          </div>

          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between bg-gradient-to-br from-neutral-900 to-black">
            <div className="flex items-center justify-between text-[#D4AF37] mb-4">
              <span className="text-[10px] uppercase tracking-wider font-bold">Neto Propietario</span>
              <Landmark className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-[#D4AF37]">
                {loading ? '0.00 €' : `${Number(finance.net || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-neutral-400 mt-1">Liquidación bancaria directa</span>
            </div>
          </div>

          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-4">
              <span className="text-[10px] uppercase tracking-wider">Pendiente / Próximos</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <strong className="font-serif text-3xl sm:text-4xl text-amber-400">
                {loading ? '0.00 €' : `${Number(finance.pending || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-neutral-400 mt-1">Reservas en curso</span>
            </div>
          </div>
        </div>

        {/* 2. HISTORIAL Y DESGLOSE DE TRANSACCIONES Y RESERVAS */}
        <div className="bg-[#0f0f12] rounded-3xl border border-white/10 p-6 shadow-xl mb-10 font-mono">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-2xl font-bold text-white">Historial de Reservas y Liquidaciones</h2>
            </div>
            <span className="text-xs text-neutral-400">
              {bookings.length} {bookings.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-neutral-400">Cargando transacciones...</div>
          ) : bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-neutral-400">
                    <th className="py-3 px-2">Código</th>
                    <th className="py-3 px-2">Superdeportivo</th>
                    <th className="py-3 px-2">Cliente VIP</th>
                    <th className="py-3 px-2">Fechas</th>
                    <th className="py-3 px-2">Estado</th>
                    <th className="py-3 px-2 text-right">Neto Propietario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-neutral-900/60 transition-colors">
                      <td className="py-3 px-2 text-[#D4AF37] font-bold">{booking.code}</td>
                      <td className="py-3 px-2 font-bold text-white">{booking.vehicle?.title || 'Superdeportivo'}</td>
                      <td className="py-3 px-2 text-neutral-400">
                        {booking.traveler?.firstName} {booking.traveler?.lastName}
                      </td>
                      <td className="py-3 px-2 text-neutral-400">
                        {new Date(booking.pickupDate || booking.createdAt).toLocaleDateString('es-ES')} -{' '}
                        {new Date(booking.returnDate || booking.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            booking.status === 'CONFIRMED' || booking.status === 'COMPLETED'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                              : booking.status === 'REQUESTED'
                              ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                              : 'bg-neutral-900 text-neutral-400 border-white/10'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-serif text-sm font-bold text-[#D4AF37]">
                        {Number(booking.ownerPayout || 0).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-neutral-400 space-y-2">
              <FileText className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-60" />
              <p className="font-bold text-white">Aún no tienes historial de cobros o reservas pagadas.</p>
              <p className="text-xs text-neutral-400">
                Cuando recibas y confirmes tu primera reserva, verás aquí el desglose detallado de cada liquidación neta.
              </p>
            </div>
          )}
        </div>

        {/* 3. PANEL INFORMATIVO DE SEGURIDAD FINANCIERA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-white/10 shadow-xl space-y-2">
            <div className="flex items-center space-x-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif text-xl font-bold text-white">Garantía de Liquidación Bancaria</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              GTR Cars custodia de forma segura el importe de la reserva y transfiere los fondos netos a tu cuenta bancaria (IBAN) tras la finalización del alquiler con total trazabilidad.
            </p>
          </div>

          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-white/10 shadow-xl space-y-2">
            <div className="flex items-center space-x-3 mb-3">
              <Building2 className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif text-xl font-bold text-white">Fiscalidad e IGIC (Canarias)</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Todas las facturas y liquidaciones se emiten conforme a la normativa fiscal y régimen de IGIC de la Comunidad Autónoma de Canarias.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
