'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ShieldCheck, UserCheck, FileText, CheckCircle2, AlertCircle, Upload, Lock } from 'lucide-react';

export default function IdentityVerificationPage() {
  const [documentType, setDocumentType] = useState('DNI_NIE');
  const [documentNumber, setDocumentNumber] = useState('');
  const [fileFront, setFileFront] = useState<File | null>(null);
  const [fileBack, setFileBack] = useState<File | null>(null);
  const [drivingLicense, setDrivingLicense] = useState('');
  const [licenseExpDate, setLicenseExpDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = new FormData(e.currentTarget);
    data.set('documentType', documentType);
    data.set('documentNumber', documentNumber);
    data.set('drivingLicense', drivingLicense);
    data.set('licenseExpDate', licenseExpDate);
    try {
      const response = await fetch('/api/verification', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron enviar los documentos');
      setSubmitted(true);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-xl space-y-8">
          <div className="text-center border-b border-[#E2E8F0] pb-6">
            <div className="w-12 h-12 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#D97706]">
              Verificación Obligatoria de Identidad
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#0F172A] mt-1">
              Verifica tu Cuenta de Conductor
            </h1>
            <p className="text-xs text-[#64748B] font-medium mt-2">
              Cumplimiento con la normativa legal de alquiler de vehículos sin conductor en España
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="p-4 bg-[#F4F9F8] rounded-2xl border border-[#E2E8F0] text-xs text-[#0F172A] flex items-start space-x-3">
                <Lock className="w-5 h-5 text-[#14B8A6] shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  Tus documentos son encriptados y almacenados en servidores seguros. Nunca serán visibles públicamente para otros usuarios.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-2">
                  Tipo de Documento de Identidad
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] text-sm font-bold bg-[#F8FAFC]"
                >
                  <option value="DNI_NIE">DNI / NIE (España)</option>
                  <option value="PASSPORT">Pasaporte Internacional</option>
                  <option value="EU_ID">Documento de Identidad UE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1">
                  Número de Documento (DNI/NIE/Pasaporte)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 12345678Z"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1">
                    Nº Carnet de Conducir
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. B-12345678"
                    value={drivingLicense}
                    onChange={(e) => setDrivingLicense(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1">
                    Fecha Expiración Permiso
                  </label>
                  <input
                    type="date"
                    required
                    value={licenseExpDate}
                    onChange={(e) => setLicenseExpDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-[#64748B]">
                  Adjuntar Documentos en Foto / PDF
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border-2 border-dashed border-[#CBD5E1] text-center bg-[#F8FAFC]">
                    <Upload className="w-6 h-6 mx-auto text-[#14B8A6] mb-2" />
                    <span className="block text-xs font-bold text-[#0F172A]">Anverso DNI / Permiso</span>
                    <input name="fileFront" type="file" accept="image/jpeg,image/png,application/pdf" required className="mt-2 text-[10px] text-[#64748B]" />
                  </div>
                  <div className="p-4 rounded-2xl border-2 border-dashed border-[#CBD5E1] text-center bg-[#F8FAFC]">
                    <Upload className="w-6 h-6 mx-auto text-[#14B8A6] mb-2" />
                    <span className="block text-xs font-bold text-[#0F172A]">Reverso Documento</span>
                    <input name="fileBack" type="file" accept="image/jpeg,image/png,application/pdf" required className="mt-2 text-[10px] text-[#64748B]" />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm font-bold text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-[#14B8A6] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-md"
              >
                ENVIAR DOCUMENTOS A VERIFICACIÓN
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#14B8A6] mx-auto" />
              <h3 className="font-serif text-2xl font-bold">Documentación Enviada Correctamente</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Nuestro equipo legal está revisando tus documentos. Recibirás la confirmación de validación en tu correo en menos de 2 horas.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
