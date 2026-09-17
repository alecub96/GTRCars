import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, MapPin, Mail, PhoneCall } from 'lucide-react';
import {
  HypercarSilhouette,
  SupercarV8Silhouette,
  TrackGTSilhouette,
  GranTurismoSilhouette,
  SpyderSilhouette,
  SuperSUVSilhouette,
} from '@/components/SupercarIcons';

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-white/70 border-t border-white/10 font-mono text-xs">
      {/* SILUETAS VECTORIALES DE SUPERDEPORTIVOS */}
      <div className="border-b border-white/5 bg-black/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            GTR Vault Engineering
          </div>
          <div className="flex items-center gap-8 sm:gap-12 overflow-x-auto py-1">
            <div className="flex flex-col items-center gap-1 text-neutral-400 hover:text-[#D4AF37] transition-colors">
              <HypercarSilhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Hypercar V12</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-neutral-400 hover:text-[#D4AF37] transition-colors">
              <SupercarV8Silhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Berlinetta V8</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-neutral-400 hover:text-[#D4AF37] transition-colors">
              <TrackGTSilhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Track GT3 RS</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-neutral-400 hover:text-[#D4AF37] transition-colors">
              <GranTurismoSilhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Gran Turismo</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-neutral-400 hover:text-[#D4AF37] transition-colors">
              <SpyderSilhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Spyder Open-Air</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-neutral-400 hover:text-[#D4AF37] transition-colors">
              <SuperSUVSilhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Super SUV</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* COLUMNA 1: BRAND */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-2">
              <span className="font-serif text-xl font-bold tracking-wider text-white">
                GTR <span className="text-[#D4AF37]">CARS</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[9px] uppercase tracking-widest border border-[#D4AF37]/30">
                VAULT CANARIAS
              </span>
            </Link>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Plataforma de intermediación y alquiler de superdeportivos, hypercars y vehículos de altas prestaciones en las Islas Canarias. Entrega VIP en Gran Canaria y Tenerife.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-neutral-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                Gran Canaria · Tenerife
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                vip@gtrcars.vip
              </span>
            </div>
          </div>

          {/* COLUMNA 2: SUPERDEPORTIVOS */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] text-[#D4AF37]">
              Flota Vault
            </h4>
            <ul className="space-y-2 text-neutral-400 text-xs">
              <li>
                <Link href="/#flota" className="hover:text-white transition-colors">
                  Porsche 911 GT3 RS
                </Link>
              </li>
              <li>
                <Link href="/#flota" className="hover:text-white transition-colors">
                  Ferrari 296 GTB &amp; SF90
                </Link>
              </li>
              <li>
                <Link href="/#flota" className="hover:text-white transition-colors">
                  Lamborghini Revuelto &amp; STO
                </Link>
              </li>
              <li>
                <Link href="/#flota" className="hover:text-white transition-colors">
                  McLaren 765LT
                </Link>
              </li>
              <li>
                <Link href="/#flota" className="hover:text-white transition-colors">
                  Aston Martin DBS
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: RUTAS & BLOG */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] text-[#D4AF37]">
              Blog &amp; Rutas VIP
            </h4>
            <ul className="space-y-2 text-neutral-400 text-xs">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Todos los Artículos
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/alquiler-deportivos-gran-canaria-rutas-guia-completa"
                  className="hover:text-white transition-colors"
                >
                  Rutas Gran Canaria
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/alquiler-superdeportivos-tenerife-teide-lujo"
                  className="hover:text-white transition-colors"
                >
                  Ascensión Teide Tenerife
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/requisitos-fianza-seguro-alquiler-superdeportivos-canarias"
                  className="hover:text-white transition-colors"
                >
                  Fianzas y Requisitos
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/gtr-cars-club-vault-propietarios-superdeportivos-canarias"
                  className="hover:text-white transition-colors"
                >
                  Monetizar Superdeportivo
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: LEGAL & EMPRESA */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] text-[#D4AF37]">
              Legal &amp; Privacidad
            </h4>
            <ul className="space-y-2 text-neutral-400 text-xs">
              <li>
                <Link href="/sobre-nosotros" className="hover:text-white transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto Concierge
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <p>© 2026 GTR Cars // Canary Hypercar Vault. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-4">
            <span>Gran Canaria (LPA)</span>
            <span>•</span>
            <span>Tenerife Sur (TFS)</span>
            <span>•</span>
            <span>Costa Adeje</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
