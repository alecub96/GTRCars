'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, UserCheck, CheckCircle2, AlertCircle, Upload, Lock, Sparkles, Award } from 'lucide-react';

export default function IdentityVerificationPage() {
  const [documentType, setDocumentType] = useState('DNI_NIE');
  const [documentNumber, setDocumentNumber] = useState('');
  const [fileFront, setFileFront] = useState<File | null>(null);
  const [fileBack, setFileBack] = useState<File | null>(null);
  const [fileLicense, setFileLicense] = useState<File | null>(null);
  const [licenseExpDate, setLicenseExpDate] = useState('');
  const [yearsExperience, setYearsExperience] = useState('5+');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('UNVERIFIED');

  useEffect(() => {
    fetch('/api/verification')
      .then((response) => response.json())
      .then((data) => {
        if (data.verification) setVerificationStatus(data.verification);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileFront || !fileBack || !fileLicense) {
      setError('Por favor adjunta los 3 archivos requeridos (Anverso DNI/Pasaporte, Reverso y Permiso de Conducir Clase B)');
      return;
    }
    setLoading(true);
    setError('');

    const data = new FormData();
    data.set('documentType', documentType);
    data.set('documentNumber', documentNumber);
    data.set('licenseExpDate', licenseExpDate);
    data.set('yearsExperience', yearsExperience);
    data.set('fileFront', fileFront);
    data.set('fileBack', fileBack);
    data.set('fileLicense', fileLicense);

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
    <div className="min-h-screen bg-[#FBFBFB] text-black selection:bg-black selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xs space-y-8">
          {/* CABECERA */}
          <div className="text-center border-b border-gray-100 pb-8">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-black text-[10px] font-mono tracking-widest uppercase mb-2 border border-gray-200 font-bold">
              <Sparkles className="w-3 h-3 text-black" />
              PROTOCOLO DE HOMOLOGACIÓN // PILOTO VIP GTRCARS
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1 font-sans">
              Verificación de Carné &amp; Identidad
            </h1>
            <p className="text-xs text-gray-500 font-sans mt-2 max-w-lg mx-auto">
              Validación oficial del permiso de conducir para la póliza de cobertura y entrega directa sin fianza adicional.
            </p>
          </div>

          {verificationStatus === 'VERIFIED' ? (
            <div className="text-center py-10 space-y-4 font-mono">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black uppercase text-black font-sans">
                Carné Homologado &amp; Verificado
              </h3>
              <p className="text-xs text-gray-500 font-sans max-w-md mx-auto">
                Tu documentación ha sido revisada y certificada para pilotaje de cualquier superdeportivo del catálogo.
              </p>
            </div>
          ) : verificationStatus === 'PENDING' || submitted ? (
            <div className="text-center py-10 space-y-4 font-mono">
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto text-black">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black uppercase text-black font-sans">
                Documentación en Proceso de Homologación
              </h3>
              <p className="text-xs text-gray-500 font-sans max-w-md mx-auto">
                Tus archivos están custodiados con cifrado seguro. El equipo de Concierge validará tu permiso en menos de 15 minutos.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-mono">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 flex items-start space-x-3">
                <Lock className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <p className="font-sans leading-relaxed text-xs">
                  Tus documentos se transmiten con encriptación SSL y se destinan exclusivamente a la validación con la aseguradora de la flota.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Tipo de Documento Oficial
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs font-bold bg-white text-black focus:border-black outline-none cursor-pointer"
                  >
                    <option value="DNI_NIE">DNI / NIE (España)</option>
                    <option value="PASSPORT">Pasaporte Internacional</option>
                    <option value="EU_ID">Documento de Identidad UE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 12345678Z"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black text-xs font-sans focus:border-black outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Caducidad del Carné de Conducir
                  </label>
                  <input
                    type="date"
                    required
                    value={licenseExpDate}
                    onChange={(e) => setLicenseExpDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black text-xs font-sans focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Antigüedad Carné de Conducir
                  </label>
                  <select
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs font-bold bg-white text-black focus:border-black outline-none cursor-pointer"
                  >
                    <option value="2-3">+2 años (Requisito mínimo)</option>
                    <option value="3-5">+3 a 5 años</option>
                    <option value="5+">+5 años (Conductor experimentado)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  Archivos de Documentación (JPG, PNG o PDF)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* ANVERSO DNI */}
                  <label className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${fileFront ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-black'}`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileFront(e.target.files?.[0] || null)}
                    />
                    {fileFront ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-black mb-1.5" />
                        <span className="text-xs font-bold text-black truncate max-w-[150px] font-sans">{fileFront.name}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{(fileFront.size / 1024 / 1024).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mb-1.5" />
                        <span className="block text-xs font-bold text-black font-sans">Anverso DNI / Pasaporte</span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">Fotografía frontal</span>
                      </>
                    )}
                  </label>

                  {/* REVERSO DNI */}
                  <label className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${fileBack ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-black'}`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileBack(e.target.files?.[0] || null)}
                    />
                    {fileBack ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-black mb-1.5" />
                        <span className="text-xs font-bold text-black truncate max-w-[150px] font-sans">{fileBack.name}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{(fileBack.size / 1024 / 1024).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mb-1.5" />
                        <span className="block text-xs font-bold text-black font-sans">Reverso DNI</span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">Fotografía dorsal</span>
                      </>
                    )}
                  </label>

                  {/* PERMISO DE CONDUCIR */}
                  <label className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${fileLicense ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-black'}`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileLicense(e.target.files?.[0] || null)}
                    />
                    {fileLicense ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-black mb-1.5" />
                        <span className="text-xs font-bold text-black truncate max-w-[150px] font-sans">{fileLicense.name}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{(fileLicense.size / 1024 / 1024).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-6 h-6 text-gray-400 mb-1.5" />
                        <span className="block text-xs font-bold text-black font-sans">Permiso de Conducir</span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">Carné Clase B</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-black text-white hover:bg-neutral-800 font-mono font-black text-xs uppercase tracking-widest transition-all shadow-md disabled:opacity-40 cursor-pointer"
              >
                {loading ? 'ENVIANDO A HOMOLOGACIÓN...' : 'HOMOLOGAR CONDUCTOR EN EL VAULT'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
