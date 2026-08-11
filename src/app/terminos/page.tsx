import React from 'react';
import Navbar from '@/components/Navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-[#E9E1D2] shadow-sm space-y-6">
          <h1 className="font-serif text-3xl font-bold">Términos y Condiciones del Alquiler</h1>
          
          <div className="space-y-4 text-xs text-[#6B726E] leading-relaxed font-medium">
            <h3 className="font-serif text-lg font-bold text-[#13322E]">1. Coberturas de Seguro y Responsabilidad del Vehículo</h3>
            <p>
              El seguro del vehículo alquilado es gestionado de manera directa e individual por el <strong>propietario del vehículo</strong> a través de la póliza de seguro contratada sobre la furgoneta o autocaravana. El propietario garantiza que el vehículo cuenta con el seguro obligatorio de circulación en vigor en las Islas Canarias.
            </p>

            <h3 className="font-serif text-lg font-bold text-[#13322E]">2. Fianza de Cobertura y Franquicias</h3>
            <p>
              El viajero autoriza la retención temporal del importe de la <strong>fianza fijada por el propietario</strong> para responder ante cualquier daño, desperfecto interior o exterior, falta de combustible o exceso de kilometraje que no quede cubierto por la póliza de seguro contratada para el vehículo. La fianza será devuelta tras la firma conforme del Acta de Check-out.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
