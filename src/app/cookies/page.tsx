import React from 'react';
import Navbar from '@/components/Navbar';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-[#E9E1D2] shadow-sm space-y-6">
          <h1 className="font-serif text-3xl font-bold">Política de Cookies</h1>
          <p className="text-xs text-[#6B726E] leading-relaxed">
            Utilizamos cookies propias y de terceros estrictamente necesarias para la autenticación y gestión de reservas en la plataforma...
          </p>
        </div>
      </main>
    </div>
  );
}
