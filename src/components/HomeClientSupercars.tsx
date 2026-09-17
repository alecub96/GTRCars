'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SupercarConfiguratorHero from '@/components/SupercarConfiguratorHero';
import SupercarGrid from '@/components/SupercarGrid';
import OwnerBanner from '@/components/OwnerBanner';
import { ShieldCheck, Lock, Award, HeartHandshake, PhoneCall } from 'lucide-react';

export default function HomeClientSupercars() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans antialiased selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      {/* NAVBAR */}
      <Navbar />

      {/* 1. HERO CONFIGURADOR INTERACTIVO ESTILO LAMBORGHINI */}
      <SupercarConfiguratorHero />

      {/* 2. BARRA DE CONFIANZA & SEGURIDAD P2P */}
      <section className="bg-[#0A0A0A] border-y border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6 text-xs font-mono text-white/70">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-white font-bold">CONTRATOS DIGITALES eIDAS</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-white font-bold">FIANZA BANCARIA CUSTODIADA</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-white font-bold">CONDUCTORES VERIFICADOS CON BIOMETRÍA</span>
          </div>
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-white font-bold">CONSERJERÍA VIP 24/7</span>
          </div>
        </div>
      </section>

      {/* 3. COLECCIÓN DE SUPERDEPORTIVOS DISPONIBLES */}
      <SupercarGrid />

      {/* 4. BANNER PROPIETARIOS */}
      <OwnerBanner />

      {/* 5. FOOTER PREMIUM */}
      <footer className="bg-[#030303] text-white/60 pt-16 pb-12 border-t border-white/10 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-sm bg-[#D4AF37] text-black font-black flex items-center justify-center text-xs">
                GT
              </div>
              <span className="font-black text-white text-base tracking-widest">GTCARS.COM</span>
            </div>
            <p className="text-[11px] leading-relaxed text-white/40">
              La plataforma exclusiva de alquiler entre particulares para superdeportivos, deportivos de circuito e hypercars.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">MARCAS EN EL VAULT</h4>
            <ul className="space-y-2 text-white/50">
              <li>Lamborghini (Revuelto, Huracán STO, Urus)</li>
              <li>Ferrari (SF90, 296 GTB, 812 Superfast)</li>
              <li>Porsche (911 GT3 RS, GT4 RS, Turbo S)</li>
              <li>McLaren (765LT, Artura, 720S)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">PROPIETARIOS & GARANTÍAS</h4>
            <ul className="space-y-2 text-white/50">
              <li><Link href="/publicar-camper" className="hover:text-[#D4AF37]">Publicar mi Superdeportivo</Link></li>
              <li><Link href="/seguridad" className="hover:text-[#D4AF37]">Protocolo de Fianza y Daños</Link></li>
              <li><Link href="/verificacion" className="hover:text-[#D4AF37]">Verificación de Identidad</Link></li>
              <li><Link href="/contacto" className="hover:text-[#D4AF37]">Contacto Directo Conserjería</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">CIUDADES & ENTREGAS</h4>
            <ul className="space-y-2 text-white/50">
              <li>Madrid & Circuitos Centrales</li>
              <li>Barcelona & Costa Brava</li>
              <li>Marbella & Puerto Banús</li>
              <li>Islas Canarias (Tenerife / Gran Canaria)</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
          <p>© 2026 GTCars Vault Inc. — Alquiler P2P de Superdeportivos.</p>
          <div className="flex space-x-4">
            <Link href="/terminos" className="hover:text-white">Términos</Link>
            <Link href="/privacidad" className="hover:text-white">Privacidad</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
