'use client';

import React, { useEffect, useState } from 'react';
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
  const [verificationStatus, setVerificationStatus] = useState<string>('UNVERIFIED');

  useEffect(() => {
    fetch('/api/verification').then((response) => response.json()).then((data) => {
      if (data.verification) setVerificationStatus(data.verification);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileFront || !fileBack) {
      setError('Por favor selecciona ambos archivos (Anverso y Reverso)');
      return;
    }
    setLoading(true);
    setError('');

    const data = new FormData();
    data.set('documentType', documentType);
    data.set('documentNumber', documentNumber);
    data.set('drivingLicense', drivingLicense);
    data.set('licenseExpDate', licenseExpDate);
    data.set('fileFront', fileFront);
    data.set('fileBack', fileBack);

    try {
      const response = await fetch('/api/verification', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron enviar los documentos');
      setSubmitted(true);
      setVerificationStatus('PENDING');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-[#E9E1D2] shadow-xl space-y-8">
          <div className="text-center border-b border-[#E9E1D2] pb-6">
            <div className="w-12 h-12 rounded-full bg-[#16B8AA]/10 text-[#16B8AA] flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#D97706]">
              Verificación Obligatoria de Identidad
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#13322E] mt-1">
              Verifica tu Cuenta de Conductor
            </h1>
            <p className="text-xs text-[#6B726E] font-medium mt-2">
              Cumplimiento con la normativa legal de alquiler de vehículos sin conductor en España
            </p>
          </div>

          {verificationStatus === 'VERIFIED' ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-2xl font-bold">Identidad verificada</h3>
              <p className="text-xs text-[#6B726E]">Tu documentación fue revisada y aprobada por el equipo administrador.</p>
            </div>
          ) : verificationStatus === 'PENDING' || submitted ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#16B8AA] mx-auto" />
              <h3 className="font-serif text-2xl font-bold">Documentación enviada correctamente</h3>
              <p className="text-xs text-[#6B726E] max-w-md mx-auto">Tus archivos están guardados y disponibles únicamente para ti y para los administradores. El estado se actualizará cuando sean revisados.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="p-4 bg-[#F4F9F8] rounded-2xl border border-[#E9E1D2] text-xs text-[#13322E] flex items-start space-x-3">
                <Lock className="w-5 h-5 text-[#16B8AA] shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  Tus documentos son encriptados y almacenados en servidores seguros. Nunca serán visibles públicamente para otros usuarios.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-2">
                  Tipo de Documento de Identidad
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm font-bold bg-[#F8FAFC]"
                >
                  <option value="DNI_NIE">DNI / NIE (España)</option>
                  <option value="PASSPORT">Pasaporte Internacional</option>
                  <option value="EU_ID">Documento de Identidad UE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                  Número de Documento (DNI/NIE/Pasaporte)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 12345678Z"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                    Nº Carnet de Conducir
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. B-12345678"
                    value={drivingLicense}
                    onChange={(e) => setDrivingLicense(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E] mb-1">
                    Fecha Expiración Permiso
                  </label>
                  <input
                    type="date"
                    required
                    value={licenseExpDate}
                    onChange={(e) => setLicenseExpDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E9E1D2] text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-[#6B726E]">
                  Adjuntar Documentos en Foto / PDF
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <label className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${fileFront ? 'border-[#16B8AA] bg-[#F0FDFA]' : 'border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9]'}`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileFront(e.target.files?.[0] || null)}
                    />
                    {fileFront ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-[#16B8AA] mb-2" />
                        <span className="text-xs font-bold text-[#13322E] truncate max-w-[200px]">{fileFront.name}</span>
                        <span className="text-[10px] text-[#6B726E] mt-0.5">{(fileFront.size / 1024 / 1024).toFixed(2)} MB · Clic para cambiar</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-[#16B8AA] mb-2" />
                        <span className="block text-xs font-bold text-[#13322E]">Anverso DNI / Permiso</span>
                        <span className="block text-[10px] text-[#6B726E] mt-1">Formatos JPG, PNG o PDF (Máx. 5 MB)</span>
                      </>
                    )}
                  </label>

                  <label className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${fileBack ? 'border-[#16B8AA] bg-[#F0FDFA]' : 'border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9]'}`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileBack(e.target.files?.[0] || null)}
                    />
                    {fileBack ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-[#16B8AA] mb-2" />
                        <span className="text-xs font-bold text-[#13322E] truncate max-w-[200px]">{fileBack.name}</span>
                        <span className="text-[10px] text-[#6B726E] mt-0.5">{(fileBack.size / 1024 / 1024).toFixed(2)} MB · Clic para cambiar</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-[#16B8AA] mb-2" />
                        <span className="block text-xs font-bold text-[#13322E]">Reverso Documento</span>
                        <span className="block text-[10px] text-[#6B726E] mt-1">Formatos JPG, PNG o PDF (Máx. 5 MB)</span>
                      </>
                    )}
                  </label>

                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-[#16B8AA] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-md disabled:bg-slate-300"
              >
                {loading ? 'ENVIANDO DOCUMENTOS...' : 'ENVIAR DOCUMENTOS A VERIFICACIÓN'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
