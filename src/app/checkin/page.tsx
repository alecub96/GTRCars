'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ClipboardCheck, Camera, Check, ShieldAlert, FileSignature } from 'lucide-react';

export default function CheckInDigitalPage() {
  const [odometer, setOdometer] = useState(124500);
  const [fuelLevel, setFuelLevel] = useState('FULL');
  const [waterLevel, setWaterLevel] = useState('FULL');
  const [cleanliness, setCleanliness] = useState('EXCELLENT');
  const [notes, setNotes] = useState('');
  const [signed, setSigned] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-[#E9E1D2] shadow-xl space-y-8">
          <div className="text-center border-b border-[#E9E1D2] pb-6">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#D97706]">
              Registro Inmutable Digital
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#13322E] mt-1">
              Check-in / Acta de Entrega del Vehículo
            </h1>
            <p className="text-xs text-[#6B726E] font-medium mt-2">
              Registro del estado de la camper previo al inicio del alquiler
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                  Kilometraje Actual (Cuentakilómetros)
                </label>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm font-bold text-[#16B8AA]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                  Nivel de Combustible
                </label>
                <select
                  value={fuelLevel}
                  onChange={(e) => setFuelLevel(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm font-bold"
                >
                  <option value="FULL">Lleno (1/1)</option>
                  <option value="3/4">3/4 Depósito</option>
                  <option value="1/2">1/2 Depósito</option>
                  <option value="1/4">1/4 Depósito</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                  Nivel Tanque de Agua Limpia
                </label>
                <select
                  value={waterLevel}
                  onChange={(e) => setWaterLevel(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm font-bold"
                >
                  <option value="FULL">Lleno (100L)</option>
                  <option value="1/2">50L (1/2)</option>
                  <option value="EMPTY">Vacío</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                  Estado de Limpieza
                </label>
                <select
                  value={cleanliness}
                  onChange={(e) => setCleanliness(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm font-bold"
                >
                  <option value="EXCELLENT">Excelente (Higienizado)</option>
                  <option value="GOOD">Bueno</option>
                  <option value="FAIR">Aceptable</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-2">
                Fotografías Obligatorias de Entrega (Frontal, Trasera, Cuadro de Mandos)
              </label>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC]">
                  <Camera className="w-6 h-6 mx-auto text-[#16B8AA] mb-1" />
                  <span className="text-[10px] font-bold block">Frontal Camper</span>
                </div>
                <div className="p-4 rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC]">
                  <Camera className="w-6 h-6 mx-auto text-[#16B8AA] mb-1" />
                  <span className="text-[10px] font-bold block">Cuadro / Km</span>
                </div>
                <div className="p-4 rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC]">
                  <Camera className="w-6 h-6 mx-auto text-[#16B8AA] mb-1" />
                  <span className="text-[10px] font-bold block">Interior / Cocina</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                Observaciones o Daños Previos Existentes
              </label>
              <textarea
                rows={3}
                placeholder="Indicar si existe algún arañazo o raya previa en la carrocería..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm"
              />
            </div>

            {!signed ? (
              <button
                onClick={() => setSigned(true)}
                className="w-full py-4 rounded-full bg-[#16B8AA] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-md"
              >
                FIRMAR Y REGISTRAR ENTRADA DEL VEHÍCULO
              </button>
            ) : (
              <div className="p-4 bg-green-50 text-green-800 rounded-2xl text-xs font-bold border border-green-200 text-center">
                ✓ Check-in verificado e inmutable firmado electrónicamente por ambas partes
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
