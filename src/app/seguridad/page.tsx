import React from 'react';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Lock, CheckCircle2, FileText, AlertCircle, Sparkles } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E9E1D2] shadow-xl space-y-8">
          
          <div className="border-b border-[#E9E1D2] pb-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#D97706]">
              NORMATIVA DE COBERTURAS Y FIANZAS
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13322E] mt-1">
              Seguro del Vehículo & Gestión de Fianzas
            </h1>
            <p className="text-xs text-[#6B726E] font-medium mt-2">
              Transparencia y seguridad para el alquiler de campers entre particulares en Canarias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SEGURO CONTRATADO POR EL PROPIETARIO */}
            <div className="p-6 rounded-3xl bg-[#F4F9F8] border border-[#E9E1D2] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#16B8AA] text-white flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-[#13322E]">Seguro de la Camper</h3>
              <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
                Cada propietario mantiene el <strong>seguro propio contratado en su vehículo</strong> para la cobertura durante el alquiler. Este seguro cubre los daños estructurales y la asistencia en carretera en las Islas Canarias según las condiciones de la póliza de la camper.
              </p>
            </div>

            {/* FIANZA DE COBERTURA */}
            <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-[#13322E]">Fianza de Garantía</h3>
              <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                La <strong>fianza del alquiler</strong> estipulada por el propietario (ej. 600€ - 1.000€) se retiene preventivamente para cubrir de forma directa cualquier pequeño desperfecto, franquicia o gasto que no quede cubierto por la póliza del seguro.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E9E1D2] space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#13322E] flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-[#16B8AA]" />
              <span>Devolución de la Fianza</span>
            </h4>
            <p className="text-xs text-[#6B726E] leading-relaxed font-medium">
              Al finalizar el viaje, si el <strong>Check-out digital</strong> confirma que la camper se devuelve en el mismo estado en el que se entregó (kilometraje, combustible y limpieza), la fianza se desbloquea de forma automática sin ningún tipo de retención.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
