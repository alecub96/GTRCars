'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Clock, FileCheck } from 'lucide-react';

const gold = '#D4AF37';
const border = 'rgba(255, 255, 255, 0.1)';

function Email({ title, intro, children, button }: { title: string; intro: string; children: React.ReactNode; button: string }) {
  return (
    <article className="overflow-hidden rounded-3xl border bg-[#0f0f12] shadow-2xl" style={{ borderColor: border }}>
      <header className="px-6 py-8 text-center text-white bg-black border-b border-white/10">
        <div className="font-mono text-2xl font-black tracking-widest text-[#D4AF37]">GTR<span className="text-white">CARS</span></div>
        <div className="mt-2 text-[10px] font-mono tracking-[.25em] text-white/50">CANARY HYPERCAR VAULT</div>
      </header>
      <div className="space-y-5 p-6 font-mono">
        <h2 className="text-lg font-bold text-white uppercase">{title}</h2>
        <p className="text-xs leading-6 text-white/60">{intro}</p>
        <div className="rounded-2xl border p-4 text-xs leading-7 bg-white/[0.02]" style={{ borderColor: border }}>{children}</div>
        <button className="rounded-xl px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#D4AF37] hover:brightness-110">{button}</button>
      </div>
      <footer className="border-t px-6 py-4 text-center text-[10px] font-mono text-white/40" style={{ borderColor: border }}>gtrcars.es · Entorno Seguro de Demostración</footer>
    </article>
  );
}

function Payment({ state, children, button }: { state: string; children: React.ReactNode; button: string }) {
  return (
    <article className="rounded-3xl border bg-[#0f0f12] p-6 shadow-2xl font-mono" style={{ borderColor: border }}>
      <h2 className="text-lg font-bold text-white uppercase">{state}</h2>
      <p className="mt-2 text-xs text-white/50">Porsche 911 GT3 RS · 10/09/2026 - 15/09/2026</p>
      {children}
      <button className="mt-6 w-full rounded-xl px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#D4AF37] hover:brightness-110">{button}</button>
      <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-white/40">
        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Pago seguro con custodia bancaria Stripe VIP</span>
      </div>
    </article>
  );
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <Navbar />
      <main className="px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-mono font-bold uppercase tracking-[.25em] text-[#D4AF37]">Entorno de Demostración</p>
          <h1 className="mt-2 font-mono text-3xl sm:text-4xl font-black uppercase text-white">Previsualizaciones GTR Cars</h1>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-6 text-white/60 font-mono">Notificaciones y pasarelas de pago del sistema de custodia con datos simulados.</p>

          <h2 className="mb-5 mt-10 font-mono text-2xl font-bold uppercase text-[#D4AF37]">Notificaciones de Protocolo</h2>
          <section className="grid gap-6 lg:grid-cols-3">
            <Email title="Solicitud de Reserva VIP" intro="Un piloto verificado solicita pilotar tu superdeportivo." button="Gestionar Reserva">
              <b>Piloto:</b> Alejandro VIP<br/>
              <b>Vehículo:</b> Porsche 911 GT3 RS Weissach<br/>
              <b>Fechas:</b> 10/09/2026 - 15/09/2026<br/>
              <b>Código de Protocolo:</b> GTR-911-GC
            </Email>
            <Email title="Reserva Instantánea Confirmada" intro="Reserva confirmada. El vehículo queda bloqueado en el calendario." button="Ver Detalles">
              <b>Vehículo:</b> Ferrari 296 GTB Assetto<br/>
              <b>Estado:</b> Confirmado y Custodiado<br/>
              <b>Código:</b> GTR-296-TF
            </Email>
            <Email title="Liquidación de Jornada" intro="El depósito y liquidación han sido procesados satisfactoriamente." button="Descargar Liquidación">
              <b>Alquiler: 3.500,00 €</b><br/>
              Gestión Custodia: 175,00 €<br/>
              IGIC: 245,00 €<br/>
              <strong className="text-base text-[#D4AF37]">Total Liquidado: 3.920,00 €</strong>
            </Email>
          </section>

          <h2 className="mb-5 mt-12 font-mono text-2xl font-bold uppercase text-[#D4AF37]">Pasarela y Estados de Custodia</h2>
          <section className="grid gap-6 lg:grid-cols-3">
            <Payment state="Formulario de Pago Seguro" button="Autorizar Fianza y Reserva">
              <label className="mt-6 block text-xs font-mono uppercase text-white/60">
                Número de Tarjeta Black / Platinum
                <input className="mt-2 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none font-mono" placeholder="4242 •••• •••• 4242" />
              </label>
              <div className="mt-4 grid grid-cols-2 gap-3 font-mono">
                <input className="rounded-xl border border-white/10 bg-black/60 p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none" placeholder="MM/AA" />
                <input className="rounded-xl border border-white/10 bg-black/60 p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none" placeholder="CVC" />
              </div>
            </Payment>

            <Payment state="Custodia Pendiente" button="Completar Autorización">
              <div className="my-12 text-center">
                <Clock className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 animate-pulse" />
                <p className="mt-4 text-xs text-white/70">El contrato inteligente está firmado. Completa la autorización para desbloquear el superdeportivo.</p>
              </div>
            </Payment>

            <Payment state="Custodia Aprobada" button="Ver Telemetría y Acceso">
              <div className="my-12 text-center">
                <FileCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="mt-4 text-xs text-white/70">Reserva y fianza confirmadas en bóveda digital. Todo listo para la entrega VIP.</p>
              </div>
            </Payment>
          </section>
        </div>
      </main>
    </div>
  );
}
