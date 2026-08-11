import React from 'react';
import Navbar from '@/components/Navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-[#E9E1D2] shadow-sm space-y-6">
          <h1 className="font-serif text-3xl font-bold">Política de Privacidad y Protección de Datos (RGPD)</h1>
          <p className="text-xs text-[#6B726E] leading-relaxed">
            De conformidad con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales en España...
          </p>
        </div>
      </main>
    </div>
  );
}
