'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SupercarConfiguratorHero from '@/components/SupercarConfiguratorHero';
import SupercarGrid from '@/components/SupercarGrid';
import OwnerBanner from '@/components/OwnerBanner';

export default function HomeClientSupercars() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white overflow-x-hidden">
      {/* NAVBAR */}
      <Navbar />

      {/* 1. HERO CONFIGURATOR INTERACTIVO ESTILO PORSCHE BLANCO MINIMALISTA */}
      <SupercarConfiguratorHero />

      {/* 2. COLECCIÓN DE SUPERDEPORTIVOS DISPONIBLES */}
      <SupercarGrid />

      {/* 4. BANNER PROPIETARIOS */}
      <OwnerBanner />

      {/* 5. FOOTER PREMIUM */}
      <footer className="bg-[#030303] text-white/60 pt-16 pb-12 border-t border-white/10 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-sm bg-white text-black font-black flex items-center justify-center text-xs">
                GT
              </div>
              <span className="font-black text-white text-base tracking-widest">GTRCARS.ES</span>
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
              <li><Link href="/publicar-camper" className="hover:text-white">Publicar mi Superdeportivo</Link></li>
              <li><Link href="/seguridad" className="hover:text-white">Protocolo de Fianza y Daños</Link></li>
              <li><Link href="/verificacion" className="hover:text-white">Verificación de Identidad</Link></li>
              <li><Link href="/contacto" className="hover:text-white">Contacto Directo Conserjería</Link></li>
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
          <p>© 2026 GTRCars.es — Alquiler P2P de Superdeportivos.</p>
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
