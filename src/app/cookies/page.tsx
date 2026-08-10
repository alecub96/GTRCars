import React from 'react';
import Navbar from '@/components/Navbar';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm space-y-6">
          <h1 className="font-serif text-3xl font-bold">Política de Cookies</h1>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Utilizamos cookies propias y de terceros estrictamente necesarias para la autenticación y gestión de reservas en la plataforma...
          </p>
        </div>
      </main>
    </div>
  );
}
