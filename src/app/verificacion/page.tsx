'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, UserCheck, CheckCircle2, AlertCircle, Upload, Lock, Sparkles } from 'lucide-react';

export default function IdentityVerificationPage() {
  const [documentType, setDocumentType] = useState('DNI_NIE');
  const [documentNumber, setDocumentNumber] = useState('');
  const [fileFront, setFileFront] = useState<File | null>(null);
  const [fileBack, setFileBack] = useState<File | null>(null);
  const [fileLicense, setFileLicense] = useState<File | null>(null);
  const [licenseExpDate, setLicenseExpDate] = useState('');
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
      setError('Por favor adjunta los 3 archivos requeridos (Anverso DNI/Pasaporte, Reverso y Permiso de Conducir)');
      return;
    }
    setLoading(true);
    setError('');

    const data = new FormData();
    data.set('documentType', documentType);
    data.set('documentNumber', documentNumber);
    data.set('licenseExpDate', licenseExpDate);
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
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="bg-[#0f0f12] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl space-y-8">
          <div className="text-center border-b border-white/10 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#D4AF37]/30">
              <Sparkles className="w-3 h-3" />
              PROTOCOLO DE HOMOLOGACIÓN CONDUCTOR VIP
            </div>
            <h1 className="font-serif text-3xl font-bold text-white mt-1">
              Verificación de Identidad y Carné de Conducir
            </h1>
            <p className="text-xs text-neutral-400 font-mono mt-2">
              Validamos la vigencia del permiso de conducción para el seguro de flota de superdeportivos.
            </p>
          </div>

          {verificationStatus === 'VERIFIED' ? (
            <div className="text-center py-8 space-y-4 font-mono">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-white">Identidad y Permiso Homologados</h3>
              <p className="text-xs text-neutral-400">Tu documentación fue revisada y autorizada por la dirección de GTR Cars.</p>
            </div>
          ) : verificationStatus === 'PENDING' || submitted ? (
            <div className="text-center py-8 space-y-4 font-mono">
              <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-white">Documentación enviada a revisión</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">Tus archivos están custodiados con cifrado AES-256. El equipo de Concierge validará la documentación en menos de 15 minutos.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-mono">
              <div className="p-4 bg-neutral-900 rounded-2xl border border-white/10 text-xs text-neutral-300 flex items-start space-x-3">
                <Lock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Tus documentos son encriptados y almacenados bajo estrictos acuerdos de no divulgación. Nunca son compartidos públicamente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    Tipo de Documento
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-white/15 text-sm font-bold bg-neutral-900 text-white focus:border-[#D4AF37] outline-none cursor-pointer"
                  >
                    <option value="DNI_NIE">DNI / NIE (España)</option>
                    <option value="PASSPORT">Pasaporte Internacional</option>
                    <option value="EU_ID">Documento de Identidad UE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 12345678Z"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full p-3 rounded-xl border border-white/15 bg-neutral-900 text-white text-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Fecha Expiración Permiso de Conducir
                </label>
                <input
                  type="date"
                  required
                  value={licenseExpDate}
                  onChange={(e) => setLicenseExpDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-white/15 bg-neutral-900 text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider text-neutral-400">
                  Fotografías de Documentos (JPG, PNG o PDF)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* ANVERSO DNI */}
                  <label className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${fileFront ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/15 bg-neutral-900/60 hover:border-white/30'}`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileFront(e.target.files?.[0] || null)}
                    />
                    {fileFront ? (
                      <>
                        <CheckCircle2 className="w-7 h-7 text-[#D4AF37] mb-1.5" />
                        <span className="text-xs font-bold text-white truncate max-w-[150px]">{fileFront.name}</span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">{(fileFront.size / 1024 / 1024).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-[#D4AF37] mb-1.5" />
                        <span className="block text-xs font-bold text-white">Anverso DNI / Pasaporte</span>
                        <span className="block text-[10px] text-neutral-400 mt-0.5">Foto Anverso</span>
                      </>
                    )}
                  </label>

                  {/* REVERSO DNI */}
                  <label className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${fileBack ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/15 bg-neutral-900/60 hover:border-white/30'}`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileBack(e.target.files?.[0] || null)}
                    />
                    {fileBack ? (
                      <>
                        <CheckCircle2 className="w-7 h-7 text-[#D4AF37] mb-1.5" />
                        <span className="text-xs font-bold text-white truncate max-w-[150px]">{fileBack.name}</span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">{(fileBack.size / 1024 / 1024).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-[#D4AF37] mb-1.5" />
                        <span className="block text-xs font-bold text-white">Reverso Documento</span>
                        <span className="block text-[10px] text-neutral-400 mt-0.5">Foto Reverso</span>
                      </>
                    )}
                  </label>

                  {/* CARNÉ DE CONDUCIR */}
                  <label className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${fileLicense ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/15 bg-neutral-900/60 hover:border-white/30'}`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileLicense(e.target.files?.[0] || null)}
                    />
                    {fileLicense ? (
                      <>
                        <CheckCircle2 className="w-7 h-7 text-[#D4AF37] mb-1.5" />
                        <span className="text-xs font-bold text-white truncate max-w-[150px]">{fileLicense.name}</span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">{(fileLicense.size / 1024 / 1024).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-[#D4AF37] mb-1.5" />
                        <span className="block text-xs font-bold text-white">Permiso de Conducir</span>
                        <span className="block text-[10px] text-neutral-400 mt-0.5">Foto Permiso</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs font-bold text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg disabled:opacity-40 cursor-pointer"
              >
                {loading ? 'ENVIANDO A VALIDACIÓN...' : 'HOMOLOGAR DOCUMENTACIÓN EN EL VAULT'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
