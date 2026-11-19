'use client';

import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Upload,
  Lock,
  Sparkles,
  Award,
  Camera,
  RotateCcw,
  ScanFace,
  X,
} from 'lucide-react';

export default function IdentityVerificationPage() {
  const [documentType, setDocumentType] = useState('DNI_NIE');
  const [documentNumber, setDocumentNumber] = useState('');
  const [fileFront, setFileFront] = useState<File | null>(null);
  const [fileBack, setFileBack] = useState<File | null>(null);
  const [fileLicense, setFileLicense] = useState<File | null>(null);
  const [fileSelfie, setFileSelfie] = useState<File | null>(null);

  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string | null>(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fallbackSelfieInputRef = useRef<HTMLInputElement | null>(null);

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

  // Generar vista previa del anverso del documento para comparativa lado a lado con el selfie
  useEffect(() => {
    if (!fileFront || !fileFront.type.startsWith('image/')) {
      setFrontPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(fileFront);
    setFrontPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [fileFront]);

  // Limpiar cámara al desmontar
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
    setCameraStarting(false);
  };

  const startLiveCamera = async () => {
    setCameraError('');
    setError('');
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Tu navegador no permite acceso directo a cámara WebRTC. Pulsa para abrir la cámara frontal del dispositivo.');
      fallbackSelfieInputRef.current?.click();
      return;
    }

    setCameraStarting(true);
    setCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraStarting(false);
    } catch (err: any) {
      console.warn('Error opening live camera:', err);
      stopCameraStream();
      setCameraError(
        'No se pudo acceder a la cámara web (permiso denegado o cámara ocupada). Activa el permiso de cámara en la barra de direcciones o usa el botón de captura frontal.'
      );
    }
  };

  const captureFacialSelfie = () => {
    const video = videoRef.current;
    if (!video) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Espejar horizontalmente para que coincida con la vista natural de cámara frontal
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const capturedFile = new File([blob], `verificacion-facial-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        if (selfiePreviewUrl) URL.revokeObjectURL(selfiePreviewUrl);
        const preview = URL.createObjectURL(blob);
        setFileSelfie(capturedFile);
        setSelfiePreviewUrl(preview);
        stopCameraStream();
      },
      'image/jpeg',
      0.92
    );
  };

  const handleFallbackSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (selfiePreviewUrl) URL.revokeObjectURL(selfiePreviewUrl);
    const preview = URL.createObjectURL(file);
    setFileSelfie(file);
    setSelfiePreviewUrl(preview);
    setCameraError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileFront || !fileBack || !fileLicense) {
      setError(
        'Por favor adjunta los 3 documentos requeridos (Anverso DNI/Pasaporte, Reverso y Permiso de Conducir Clase B).'
      );
      return;
    }
    if (!fileSelfie) {
      setError(
        'Es obligatorio realizar la foto de verificación facial de frente con la cámara para confirmar que eres el titular del documento.'
      );
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
    data.set('fileSelfie', fileSelfie);

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
              <ScanFace className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-black text-[10px] font-mono tracking-widest uppercase mb-2 border border-gray-200 font-bold">
              <Sparkles className="w-3 h-3 text-black" />
              BIOMETRÍA FACIAL &amp; HOMOLOGACIÓN // PILOTO VIP GTR CARS
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1 font-sans">
              Verificación Facial &amp; Documental
            </h1>
            <p className="text-xs text-gray-600 font-sans mt-2 max-w-lg mx-auto leading-relaxed">
              Sube tu documento de identidad, permiso de conducir y realiza una captura facial de frente con tu cámara para certificar que eres el titular legítimo.
            </p>
          </div>

          {verificationStatus === 'VERIFIED' ? (
            <div className="text-center py-10 space-y-4 font-mono">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black uppercase text-black font-sans">
                Identidad Biométrica &amp; Carné Verificados
              </h2>
              <p className="text-xs text-gray-600 font-sans max-w-md mx-auto">
                Tu rostro y documentación oficial han sido verificados y certificados para el alquiler de cualquier superdeportivo del catálogo GTR Cars.
              </p>
            </div>
          ) : verificationStatus === 'PENDING' || submitted ? (
            <div className="text-center py-10 space-y-4 font-mono">
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto text-black">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black uppercase text-black font-sans">
                Verificación Facial y Documental en Revisión
              </h2>
              <p className="text-xs text-gray-600 font-sans max-w-md mx-auto">
                Tu captura facial en vivo y tus documentos están custodiados con cifrado AES-256. El equipo de Administración validará la coincidencia biométrica en menos de 15 minutos.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7 font-mono">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 flex items-start space-x-3">
                <Lock className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <p className="font-sans leading-relaxed text-xs">
                  Tus documentos y captura facial se cifran de extremo a extremo y se utilizan exclusivamente para cotejar que la persona que reserva coincide con el documento oficial presentado.
                </p>
              </div>

              {/* PASO 1: DATOS DEL DOCUMENTO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Tipo de Documento Oficial
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs font-bold bg-white text-black focus:border-black outline-none cursor-pointer"
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
                    className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black text-xs font-sans focus:border-black outline-none"
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
                    className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black text-xs font-sans focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Antigüedad Carné de Conducir
                  </label>
                  <select
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs font-bold bg-white text-black focus:border-black outline-none cursor-pointer"
                  >
                    <option value="2-3">+2 años (Requisito mínimo)</option>
                    <option value="3-5">+3 a 5 años</option>
                    <option value="5+">+5 años (Conductor experimentado)</option>
                  </select>
                </div>
              </div>

              {/* PASO 2: SUBIDA DE DOCUMENTOS */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black">
                  1. Fotografías de tu Documentación Oficial (JPG, PNG o PDF)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* ANVERSO DNI */}
                  <label
                    className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
                      fileFront ? 'border-black bg-gray-50' : 'border-gray-300 bg-white hover:border-black'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileFront(e.target.files?.[0] || null)}
                    />
                    {fileFront ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-black mb-1.5" />
                        <span className="text-xs font-bold text-black truncate max-w-[150px] font-sans">
                          {fileFront.name}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-0.5">
                          {(fileFront.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-500 mb-1.5" />
                        <span className="block text-xs font-bold text-black font-sans">
                          Anverso DNI / Pasaporte
                        </span>
                        <span className="block text-[10px] text-gray-500 mt-0.5">
                          Cara frontal con foto
                        </span>
                      </>
                    )}
                  </label>

                  {/* REVERSO DNI */}
                  <label
                    className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
                      fileBack ? 'border-black bg-gray-50' : 'border-gray-300 bg-white hover:border-black'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileBack(e.target.files?.[0] || null)}
                    />
                    {fileBack ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-black mb-1.5" />
                        <span className="text-xs font-bold text-black truncate max-w-[150px] font-sans">
                          {fileBack.name}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-0.5">
                          {(fileBack.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-500 mb-1.5" />
                        <span className="block text-xs font-bold text-black font-sans">
                          Reverso DNI
                        </span>
                        <span className="block text-[10px] text-gray-500 mt-0.5">
                          Fotografía dorsal
                        </span>
                      </>
                    )}
                  </label>

                  {/* PERMISO DE CONDUCIR */}
                  <label
                    className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
                      fileLicense ? 'border-black bg-gray-50' : 'border-gray-300 bg-white hover:border-black'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => setFileLicense(e.target.files?.[0] || null)}
                    />
                    {fileLicense ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-black mb-1.5" />
                        <span className="text-xs font-bold text-black truncate max-w-[150px] font-sans">
                          {fileLicense.name}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-0.5">
                          {(fileLicense.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <Award className="w-6 h-6 text-gray-500 mb-1.5" />
                        <span className="block text-xs font-bold text-black font-sans">
                          Permiso de Conducir
                        </span>
                        <span className="block text-[10px] text-gray-500 mt-0.5">
                          Carné Clase B vigente
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* PASO 3: VERIFICACIÓN FACIAL EN VIVO CON CÁMARA */}
              <div className="rounded-3xl border-2 border-black bg-gray-50 p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-black bg-white border border-gray-300 px-2.5 py-0.5 rounded-full mb-1.5">
                      <ScanFace className="w-3.5 h-3.5 text-black" />
                      <span>PRUEBA DE VIDA &amp; COINCIDENCIA FACIAL</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black uppercase text-black font-sans">
                      2. Verificación Facial en Vivo (Foto de Frente)
                    </h2>
                    <p className="text-xs text-gray-600 font-sans mt-0.5">
                      Abre la cámara para hacerte una foto de frente en este momento y confirmar que eres la misma persona que figura en el documento de identidad.
                    </p>
                  </div>

                  {!cameraOpen && (
                    <button
                      type="button"
                      onClick={startLiveCamera}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-black hover:bg-neutral-800 text-white px-5 py-3 text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer shrink-0"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{fileSelfie ? 'Repetir Foto con Cámara' : 'Abrir Cámara Ahora'}</span>
                    </button>
                  )}
                </div>

                {/* Input oculto de respaldo para cámara frontal nativa en móviles sin WebRTC */}
                <input
                  ref={fallbackSelfieInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  capture="user"
                  className="hidden"
                  onChange={handleFallbackSelfieChange}
                />

                {cameraError && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2 font-sans">
                    <p className="font-bold">{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => fallbackSelfieInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-black text-white px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Abrir Cámara Frontal del Dispositivo</span>
                    </button>
                  </div>
                )}

                {/* VISOR DE CÁMARA EN DIRECTO CON GUÍA BIOMÉTRICA */}
                {cameraOpen && (
                  <div className="space-y-4">
                    <div className="relative mx-auto max-w-md aspect-4/3 rounded-2xl overflow-hidden bg-black border-2 border-black shadow-xl">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover -scale-x-100"
                      />

                      {/* ÓVALO DE ENCUADRE BIOMÉTRICO FACIAL */}
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                        <div className="w-44 h-56 sm:w-48 sm:h-60 rounded-full border-2 border-dashed border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
                        <span className="mt-3 px-3 py-1 rounded-full bg-black/80 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                          Encuadra tu rostro de frente dentro del óvalo
                        </span>
                      </div>

                      {cameraStarting && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-white text-xs font-mono font-bold">
                          Iniciando cámara frontal…
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={captureFacialSelfie}
                        className="inline-flex items-center gap-2 rounded-full bg-black hover:bg-neutral-800 text-white px-7 py-3.5 text-xs font-black uppercase tracking-widest shadow-lg cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capturar Foto de Frente</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCameraStream}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-black px-5 py-3.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* VISTA PREVIA DE COMPARACIÓN: DOCUMENTO vs CAPTURA FACIAL EN VIVO */}
                {selfiePreviewUrl && !cameraOpen && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Captura Facial Lista para Cotejo Biométrico
                      </span>
                      <button
                        type="button"
                        onClick={startLiveCamera}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-black hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Repetir foto</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-gray-500 block">
                          Tu Captura Facial en Vivo (Selfie)
                        </span>
                        <img
                          src={selfiePreviewUrl}
                          alt="Captura facial de frente"
                          className="w-full h-44 object-cover rounded-xl border border-gray-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-gray-500 block">
                          Documento de Identidad Adjunto
                        </span>
                        {frontPreviewUrl ? (
                          <img
                            src={frontPreviewUrl}
                            alt="Anverso del documento de identidad"
                            className="w-full h-44 object-cover rounded-xl border border-gray-200"
                          />
                        ) : (
                          <div className="w-full h-44 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center p-4 text-center text-xs text-gray-500 font-sans">
                            {fileFront
                              ? `Documento adjunto: ${fileFront.name}`
                              : 'Sube el Anverso de tu DNI/Pasaporte arriba para comparar ambos'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                {loading
                  ? 'CIFRANDO Y ENVIANDO VERIFICACIÓN...'
                  : 'ENVIAR DOCUMENTOS Y VERIFICACIÓN FACIAL'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
