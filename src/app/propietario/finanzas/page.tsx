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
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col font-sans">
      <Navbar />
      {showBankSetup && <StripeConnectOnboarding onClose={() => setShowBankSetup(false)} />}

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* CABECERA DE FINANZAS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-black text-[10px] font-mono tracking-widest uppercase mb-2 border border-gray-200 font-bold">
              <Sparkles className="w-3 h-3 text-black" />
              CONTABILIDAD &amp; LIQUIDACIONES DEL GARAJE
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-black font-sans mt-1">
              Finanzas y Liquidaciones
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 font-mono">
              Cobro del 100% íntegro de tu tarifa fijada (0% comisión a propietarios). Transferencias directas automáticas a tu IBAN.
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
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-4">
              <span className="text-[10px] uppercase tracking-wider font-bold">Volumen Facturado</span>
              <DollarSign className="w-4 h-4 text-black" />
            </div>
            <div>
              <strong className="text-3xl sm:text-4xl text-black font-black font-sans">
                {loading ? '0.00 €' : `${Number(finance.gross || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-gray-500 mt-1">Total abonado por clientes VIP</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-4">
              <span className="text-[10px] uppercase tracking-wider font-bold">Comisión Propietario</span>
              <Receipt className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <strong className="text-3xl sm:text-4xl text-emerald-600 font-black font-sans">
                0.00 € (0%)
              </strong>
              <span className="block text-[11px] text-gray-500 mt-1">El propietario no paga nada</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-black shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-black mb-4">
              <span className="text-[10px] uppercase tracking-wider font-bold">Neto Propietario (100%)</span>
              <Landmark className="w-4 h-4 text-black" />
            </div>
            <div>
              <strong className="text-3xl sm:text-4xl text-black font-black font-sans">
                {loading ? '0.00 €' : `${Number(finance.net || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-gray-500 mt-1">Liquidación bancaria directa a tu IBAN</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-4">
              <span className="text-[10px] uppercase tracking-wider font-bold">Pendiente / Próximos</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <strong className="text-3xl sm:text-4xl text-amber-600 font-black font-sans">
                {loading ? '0.00 €' : `${Number(finance.pending || 0).toFixed(2)} €`}
              </strong>
              <span className="block text-[11px] text-gray-500 mt-1">Reservas en curso</span>
            </div>
          </div>
        </div>

        {/* 2. HISTORIAL Y DESGLOSE DE TRANSACCIONES Y RESERVAS */}
        <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6 shadow-sm mb-10 font-mono">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-black" />
              <h2 className="text-2xl font-black uppercase text-black font-sans">Historial de Reservas y Liquidaciones</h2>
            </div>
            <span className="text-xs text-gray-500 font-bold">
              {bookings.length} {bookings.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">Cargando transacciones...</div>
          ) : bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    <th className="py-3 px-2">Código</th>
                    <th className="py-3 px-2">Superdeportivo</th>
                    <th className="py-3 px-2">Cliente VIP</th>
                    <th className="py-3 px-2">Fechas</th>
                    <th className="py-3 px-2">Estado</th>
                    <th className="py-3 px-2 text-right">Neto Propietario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-100 transition-colors">
                      <td className="py-3 px-2 text-black font-bold">{booking.code}</td>
                      <td className="py-3 px-2 font-bold text-black">{booking.vehicle?.title || 'Superdeportivo'}</td>
                      <td className="py-3 px-2 text-gray-600">
                        {booking.traveler?.firstName} {booking.traveler?.lastName}
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {new Date(booking.pickupDate || booking.createdAt).toLocaleDateString('es-ES')} -{' '}
                        {new Date(booking.returnDate || booking.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            booking.status === 'CONFIRMED' || booking.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : booking.status === 'REQUESTED'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-gray-100 text-gray-600 border-gray-300'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-sm font-bold text-black">
                        {Number(booking.ownerPayout || 0).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-gray-500 space-y-2">
              <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3 opacity-60" />
              <p className="font-bold text-black">Aún no tienes historial de cobros o reservas pagadas.</p>
              <p className="text-xs text-gray-500">
                Cuando recibas y confirmes tu primera reserva, verás aquí el desglose detallado de cada liquidación neta (100% de tu tarifa sin comisiones).
              </p>
            </div>
          )}
        </div>

        {/* 3. PANEL INFORMATIVO DE SEGURIDAD FINANCIERA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex items-center space-x-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-black" />
              <h3 className="text-lg font-black uppercase text-black font-sans">Garantía de Liquidación Bancaria</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              GTR Cars custodia de forma segura el importe de la reserva y transfiere el 100% de los fondos acordados directamente a tu cuenta bancaria (IBAN) tras la entrega del vehículo.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex items-center space-x-3 mb-3">
              <Building2 className="w-5 h-5 text-black" />
              <h3 className="text-lg font-black uppercase text-black font-sans">0% Comisión a Propietarios</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              El servicio de gestión de la plataforma (9,7%) es abonado exclusivamente por el cliente que alquila. Tú recibes íntegramente la tarifa diaria que hayas establecido.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
