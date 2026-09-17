import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <footer className="bg-gray-100 text-gray-700 border-t border-gray-200 font-mono text-xs">
      {/* SILUETAS VECTORIALES DE SUPERDEPORTIVOS */}
      <div className="border-b border-gray-200 bg-gray-50 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6 opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-black font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            GTR Vault Engineering
          </div>
          <div className="flex items-center gap-8 sm:gap-12 overflow-x-auto py-1">
            <div className="flex flex-col items-center gap-1 text-gray-600 hover:text-black transition-colors font-bold">
              <HypercarSilhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Hypercar V12</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-600 hover:text-black transition-colors font-bold">
              <SupercarV8Silhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Berlinetta V8</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-600 hover:text-black transition-colors font-bold">
              <TrackGTSilhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Track GT3 RS</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-600 hover:text-black transition-colors font-bold">
              <GranTurismoSilhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Gran Turismo</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-600 hover:text-black transition-colors font-bold">
              <SpyderSilhouette className="w-16 h-7 text-current" />
              <span className="text-[8px] uppercase tracking-wider">Spyder Open-Air</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-600 hover:text-black transition-colors font-bold">
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
            <Link href="/" className="inline-block">
              <Image
                src="/brand/logo-primary.png"
                alt="GTR Cars - Peer-to-Peer Sports Car Rental"
                width={200}
                height={50}
                className="h-11 w-auto object-contain"
                unoptimized
              />
            </Link>
            <p className="text-[11px] font-sans font-semibold tracking-wider text-black uppercase">
              Drive a higher standard — Exceptional cars. Extraordinary people.
            </p>
            <p className="text-gray-600 text-xs leading-relaxed max-w-sm font-medium">
              Plataforma internacional peer-to-peer de alquiler de superdeportivos, hypercars y vehículos de altas prestaciones. Entrega VIP personalizada en Madrid, Barcelona, Gran Canaria, Tenerife y Londres.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-gray-600 font-bold">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
                Madrid · Barcelona · Canarias · London
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-black" />
                concierge@gtrcars.es
              </span>
            </div>
          </div>

          {/* COLUMNA 2: SUPERDEPORTIVOS */}
          <div className="space-y-3">
            <h4 className="text-black font-black uppercase tracking-wider text-[11px]">
              Flota Vault
            </h4>
            <ul className="space-y-2 text-gray-600 font-medium text-xs">
              <li>
                <Link href="/#flota" className="hover:text-black transition-colors">
                  Porsche 911 GT3 RS
                </Link>
              </li>
              <li>
                <Link href="/#flota" className="hover:text-black transition-colors">
                  Ferrari 296 GTB &amp; SF90
                </Link>
              </li>
              <li>
                <Link href="/#flota" className="hover:text-black transition-colors">
                  Lamborghini Revuelto &amp; STO
                </Link>
              </li>
              <li>
                <Link href="/#flota" className="hover:text-black transition-colors">
                  McLaren 765LT
                </Link>
              </li>
              <li>
                <Link href="/#flota" className="hover:text-black transition-colors">
                  Aston Martin DBS
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: RUTAS & BLOG */}
          <div className="space-y-3">
            <h4 className="text-black font-black uppercase tracking-wider text-[11px]">
              Blog &amp; Rutas VIP
            </h4>
            <ul className="space-y-2 text-gray-600 font-medium text-xs">
              <li>
                <Link href="/blog" className="hover:text-black transition-colors">
                  Todos los Artículos
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/alquiler-deportivos-gran-canaria-rutas-guia-completa"
                  className="hover:text-black transition-colors"
                >
                  Rutas Gran Canaria
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/alquiler-superdeportivos-tenerife-teide-lujo"
                  className="hover:text-black transition-colors"
                >
                  Ascensión Teide Tenerife
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/requisitos-fianza-seguro-alquiler-superdeportivos-canarias"
                  className="hover:text-black transition-colors"
                >
                  Fianzas y Requisitos
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/gtr-cars-club-vault-propietarios-superdeportivos-canarias"
                  className="hover:text-black transition-colors"
                >
                  Monetizar Superdeportivo
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: LEGAL & EMPRESA */}
          <div className="space-y-3">
            <h4 className="text-black font-black uppercase tracking-wider text-[11px]">
              Legal &amp; Privacidad
            </h4>
            <ul className="space-y-2 text-gray-600 font-medium text-xs">
              <li>
                <Link href="/sobre-nosotros" className="hover:text-black transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-black transition-colors">
                  Contacto Concierge
                </Link>
              </li>
              <li>
                <Link href="/contrato" className="hover:text-black transition-colors font-bold text-black">
                  Generador de Contrato Digital
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-black transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-black transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-black transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 font-medium text-[11px]">
          <p>© 2026 GTR Cars // International Supercar Club. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>Gran Canaria (LPA)</span>
            <span>•</span>
            <span>Tenerife (TFS/TFN)</span>
            <span>•</span>
            <span>Madrid (MAD)</span>
            <span>•</span>
            <span>Barcelona (BCN)</span>
            <span>•</span>
            <span>London (LHR)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
