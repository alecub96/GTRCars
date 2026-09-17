'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import SupercarConfiguratorHero from '@/components/SupercarConfiguratorHero';
import SupercarGrid from '@/components/SupercarGrid';
import OwnerBanner from '@/components/OwnerBanner';
import Footer from '@/components/Footer';

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

      {/* 5. FOOTER OFICIAL GTR CARS */}
      <Footer />
    </div>
  );
}
