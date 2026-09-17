'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Camera,
  UploadCloud,
  Check,
  AlertTriangle,
  Lock,
  X,
  Gauge,
  Droplets,
  Fuel,
  Sparkles,
  Layers,
  HelpCircle,
  Eye,
  RotateCcw,
  Ban,
  Download,
} from 'lucide-react';
import { generateContractPDF } from '@/lib/pdf-contract';

interface ContractViewerProps {
  booking: any;
  viewerRole: 'TRAVELER' | 'OWNER' | 'ADMIN';
  onSigned?: () => void;
}

interface InspectionPhoto {
  tag: string;
  label: string;
  url: string;
  notes?: string;
}

const DEFAULT_PHOTO_SLOTS = [
  { tag: 'FRONT', label: 'Frontal y Parabrisas' },
  { tag: 'REAR', label: 'Parte Trasera y Matrícula' },
  { tag: 'LEFT_LOW', label: 'Lateral Izquierdo Bajo' },
  { tag: 'LEFT_HIGH', label: 'Lateral Izquierdo Alto' },
  { tag: 'RIGHT_LOW', label: 'Lateral Derecho Bajo' },
  { tag: 'RIGHT_HIGH', label: 'Lateral Derecho Alto' },
  { tag: 'INTERIOR_CAMPER', label: 'Interior y Camperización (Cocina/Cama)' },
  { tag: 'DASHBOARD', label: 'Cuadro de Mandos / Cuentakilómetros' },
];

export default function DigitalContractViewer({
  booking,
  viewerRole,
  onSigned,
}: ContractViewerProps) {
  const [activeTab, setActiveTab] = useState<'inspection' | 'view' | 'sign'>('inspection');
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('type');
  const [typedName, setTypedName] = useState('');
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [checks, setChecks] = useState({
    terms: false,
    deposit: false,
    truthful: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Estado de la Ficha de Comprobación (Inspección)
  const existingCheckIn = booking.checkIn || {};
  const [odometer, setOdometer] = useState<string>(
    existingCheckIn.odometer ? String(existingCheckIn.odometer) : '85000'
  );
  const [fuelLevel, setFuelLevel] = useState<string>(existingCheckIn.fuelLevel || 'FULL');
  const [waterLevel, setWaterLevel] = useState<string>(existingCheckIn.waterLevel || 'FULL');
  const [cleanliness, setCleanliness] = useState<string>(existingCheckIn.cleanliness || 'EXCELLENT');
  const [notes, setNotes] = useState<string>(existingCheckIn.notes || '');
  
  const [inspectionChecks, setInspectionChecks] = useState({
    exteriorBody: true,
    lights: true,
    tires: true,
    interiorFurniture: true,
    kitchenGas: true,
    waterPump: true,
    fridge: true,
    auxBattery: true,
  });

  const [photos, setPhotos] = useState<InspectionPhoto[]>(() => {
    if (existingCheckIn.photos && Array.isArray(existingCheckIn.photos) && existingCheckIn.photos.length > 0) {
      return existingCheckIn.photos.map((p: any) => ({
        tag: p.tag,
        label: DEFAULT_PHOTO_SLOTS.find((s) => s.tag === p.tag)?.label || p.tag,
        url: p.url,
      }));
    }
    return [
      {
        tag: 'FRONT',
        label: 'Frontal y Parabrisas',
        url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop&q=80',
      },
      {
        tag: 'INTERIOR_CAMPER',
        label: 'Interior y Camperización',
        url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80',
      },
    ];
  });

  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [savingInspection, setSavingInspection] = useState(false);
  const [inspectionSaved, setInspectionSaved] = useState(Boolean(booking.checkIn));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const contract = booking.contract || {};
  const travelerSigned = !!contract.signedByTraveler;
  const ownerSigned = !!contract.signedByOwner;
  const fullySigned = travelerSigned && ownerSigned;
  const mySignatureDone =
    viewerRole === 'OWNER' ? ownerSigned : viewerRole === 'TRAVELER' ? travelerSigned : true;

  // Manejo de Canvas para dibujar firma
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#13322E';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setDrawnSignature(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnSignature(null);
  };

  // Subida de fotografías de comprobación
  const handlePhotoUpload = (tag: string, label: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlot(tag);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setPhotos((prev) => {
        const filtered = prev.filter((p) => p.tag !== tag);
        return [...filtered, { tag, label, url: base64Url }];
      });
      setUploadingSlot(null);
    };
    reader.readAsDataURL(file);
  };

  // Guardar Ficha de Comprobación
  const handleSaveInspection = async () => {
    setSavingInspection(true);
    setError('');
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-inspection',
          odometer: Number(odometer) || 0,
          fuelLevel,
          waterLevel,
          cleanliness,
          notes,
          photos,
          inspectionChecks,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al guardar la comprobación');
      
      setInspectionSaved(true);
      setActiveTab('view');
    } catch (err: any) {
      setError(err.message || 'No se pudo guardar la comprobación');
    } finally {
      setSavingInspection(false);
    }
  };

  const handleSign = async () => {
    setError('');
    if (!checks.terms || !checks.deposit || !checks.truthful) {
      setError('Debes marcar todas las casillas de aceptación legal.');
      return;
    }

    const finalSignature = signatureType === 'draw' ? drawnSignature : typedName.trim();
    if (!finalSignature) {
      setError('Por favor escribe tu nombre completo o dibuja tu firma.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sign-contract',
          signature: finalSignature,
          acceptedTerms: checks.terms,
          acceptedPrivacy: checks.truthful,
          acceptedDeposit: checks.deposit,
          inspectionData: {
            odometer,
            fuelLevel,
            waterLevel,
            cleanliness,
            notes,
            photos,
            inspectionChecks,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar la firma digital');
      }

      setSuccess(true);
      if (onSigned) onSigned();
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const dateFormatted = (dStr: string) =>
    new Date(dStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  let snapshot: any = {};
  try {
    if (contract.termsSnapshot) snapshot = JSON.parse(contract.termsSnapshot);
  } catch (_) {}
  const isContractCancelled = Boolean(snapshot.contractCancelled);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [contractCancelReason, setContractCancelReason] = useState('');
  const [contractActionLoading, setContractActionLoading] = useState(false);

  const handleCancelContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractCancelReason.trim()) return;

    setContractActionLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel-contract',
          reason: contractCancelReason.trim(),
        }),
      });

      const data = await res.json();
      setContractActionLoading(false);

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo cancelar el contrato');
      }

      setShowCancelModal(false);
      setContractCancelReason('');
      if (onSigned) onSigned();
    } catch (err: any) {
      setContractActionLoading(false);
      setError(err.message || 'Error cancelando el contrato');
    }
  };

  const handleRedoContract = async () => {
    setContractActionLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'redo-contract',
        }),
      });

      const data = await res.json();
      setContractActionLoading(false);

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo regenerar el contrato');
      }

      if (onSigned) onSigned();
    } catch (err: any) {
      setContractActionLoading(false);
      setError(err.message || 'Error rehaciendo el contrato');
    }
  };

  const handleDownloadPDF = () => {
    try {
      const pdf = generateContractPDF({
        contractCode: booking.code || 'GTR-CONTRATO',
        date: new Date().toLocaleDateString('es-ES'),
        owner: {
          fullName: `${booking.owner?.firstName || 'Propietario'} ${booking.owner?.lastName || ''}`.trim(),
          dni: booking.owner?.dni || 'Verificado en GTR Cars',
          email: booking.owner?.email || '',
          phone: booking.owner?.phone || '',
          address: booking.owner?.address || '',
          signature: contract.ownerSignature || (ownerSigned ? contract.signedByOwner : null),
          signedAt: contract.signedAtOwner ? new Date(contract.signedAtOwner).toLocaleString('es-ES') : null,
        },
        traveler: {
          fullName: `${booking.traveler?.firstName || 'Arrendatario'} ${booking.traveler?.lastName || ''}`.trim(),
          dni: booking.traveler?.dni || 'Verificado en GTR Cars',
          email: booking.traveler?.email || '',
          phone: booking.traveler?.phone || '',
          address: booking.traveler?.address || '',
          drivingLicense: 'Permiso B Verificado',
          signature: contract.travelerSignature || (travelerSigned ? contract.signedByTraveler : null),
          signedAt: contract.signedAtTraveler ? new Date(contract.signedAtTraveler).toLocaleString('es-ES') : null,
        },
        vehicle: {
          brand: booking.vehicle?.brand || 'Supercar',
          model: booking.vehicle?.model || booking.vehicle?.title || 'GT',
          plate: booking.vehicle?.plate || 'GTR-VIP',
          year: booking.vehicle?.year || 2024,
          hp: booking.vehicle?.hp || '',
          pickupLocation: `${booking.vehicle?.municipality || ''}, ${booking.vehicle?.island || ''}`.trim(),
          returnLocation: `${booking.vehicle?.municipality || ''}, ${booking.vehicle?.island || ''}`.trim(),
        },
        rental: {
          pickupDate: dateFormatted(booking.pickupDate),
          pickupTime: booking.pickupTime || '10:00',
          returnDate: dateFormatted(booking.returnDate),
          returnTime: booking.returnTime || '20:00',
          totalAmount: booking.totalAmount || 0,
          depositAmount: booking.depositAmount || 0,
          includedKmPerDay: booking.vehicle?.includedKmPerDay || 150,
          extraKmPrice: booking.vehicle?.extraKmPrice || 3.50,
        },
        inspection: {
          odometer,
          fuelLevel: fuelLevel === 'FULL' ? '100% Lleno' : fuelLevel,
          cleanliness: cleanliness === 'EXCELLENT' ? 'Excelente' : cleanliness,
          notes,
        },
      });

      pdf.save(`Contrato_GTR_Cars_${booking.code || 'reserva'}.pdf`);
    } catch (e: any) {
      console.error('Error generando PDF:', e);
      alert('Error generando el archivo PDF: ' + (e?.message || 'Revisa los datos'));
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* CABECERA Y ACCIONES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D2]">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#16B8AA] mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Validez Jurídica eIDAS UE 910/2014 & Acta Digital</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#13322E] tracking-tight">
            Ficha de Comprobación y Contrato Digital
          </h2>
          <p className="text-xs text-[#6B726E] font-medium mt-1">
            Código de reserva: <strong className="text-[#16B8AA] font-mono">{booking.code}</strong> • Vehículo: <strong className="text-[#13322E]">{booking.vehicle?.title}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewerRole === 'OWNER' && !isContractCancelled && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-red-200 bg-red-50 text-xs font-bold text-red-700 hover:bg-red-100 transition-all cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancelar Contrato</span>
            </button>
          )}

          {viewerRole === 'OWNER' && isContractCancelled && (
            <button
              type="button"
              disabled={contractActionLoading}
              onClick={handleRedoContract}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] text-xs font-bold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rehacer Contrato</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-xs font-bold text-white transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Contrato PDF</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-xs font-bold text-black hover:bg-black hover:text-white transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* BANNER DE CONTRATO CANCELADO */}
      {isContractCancelled && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Este contrato digital ha sido cancelado para actualización</span>
          </div>
          {snapshot.cancelledReason && (
            <p className="text-xs text-amber-800">
              <strong>Motivo indicado:</strong> &ldquo;{snapshot.cancelledReason}&rdquo;
            </p>
          )}
          <p className="text-xs text-[#6B726E]">
            {viewerRole === 'OWNER'
              ? 'Puedes pulsar "Rehacer Contrato" para generar la nueva versión y enviarla al cliente.'
              : 'El propietario está actualizando los datos del contrato. En cuanto esté disponible podrás firmarlo nuevamente.'}
          </p>
        </div>
      )}

      {/* MODAL DE CANCELACIÓN DE CONTRATO */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#13322E]/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleCancelContract} className="w-full max-w-lg rounded-[32px] bg-white p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-[.2em]">Acción Legal</span>
                <h3 className="font-serif text-2xl font-bold text-[#13322E]">Cancelar Contrato Digital</h3>
              </div>
            </div>

            <p className="text-xs text-[#6B726E] leading-relaxed">
              Al cancelar este contrato, se anulan las firmas emitidas y se enviará un correo automático a <strong>{booking.traveler?.firstName || 'el viajero'}</strong>. Podrás regenerarlo inmediatamente con el botón &ldquo;Rehacer Contrato&rdquo;.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#13322E] mb-1.5">
                Motivo de la cancelación del contrato *
              </label>
              <textarea
                required
                rows={3}
                value={contractCancelReason}
                onChange={(e) => setContractCancelReason(e.target.value)}
                placeholder="Ej. Cambio de conductor principal, modificación de fianza o actualización de equipamiento."
                className="w-full rounded-2xl border border-[#E9E1D2] p-3 text-xs bg-[#FAF7F0] focus:bg-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-full border border-[#E9E1D2] px-5 py-2.5 text-xs font-bold cursor-pointer"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={contractActionLoading}
                className="rounded-full bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-black text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                {contractActionLoading ? 'Cancelando...' : 'Confirmar Cancelación'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PESTAÑAS PRINCIPALES */}
      <div className="flex border-b border-[#E9E1D2] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('inspection')}
          className={`py-3 px-5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'inspection'
              ? 'border-[#16B8AA] text-[#16B8AA]'
              : 'border-transparent text-[#6B726E] hover:text-[#13322E]'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>1. Ficha de Comprobación y Fotos</span>
        </button>

        <button
          onClick={() => setActiveTab('view')}
          className={`py-3 px-5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'view'
              ? 'border-[#16B8AA] text-[#16B8AA]'
              : 'border-transparent text-[#6B726E] hover:text-[#13322E]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Contrato Oficial + Fotos Adjuntas</span>
        </button>

        {!mySignatureDone && (
          <button
            onClick={() => setActiveTab('sign')}
            className={`py-3 px-5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'sign'
                ? 'border-[#16B8AA] text-[#16B8AA]'
                : 'border-transparent text-[#6B726E] hover:text-[#13322E]'
            }`}
          >
            <span>3. Firmar Contrato ({viewerRole === 'OWNER' ? 'Propietario' : 'Viajero'})</span>
          </button>
        )}
      </div>

      {/* PESTAÑA 1: FICHA DE COMPROBACIÓN DEL VEHÍCULO Y SUBIDA DE FOTOS */}
      {activeTab === 'inspection' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E9E1D2] space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#16B8AA]">
                  ACTA DE INSPECCIÓN DIGITAL
                </span>
                <h3 className="text-xl font-bold text-[#13322E] mt-1">
                  Comprobación del Estado del Vehículo y Camperización
                </h3>
                <p className="text-xs text-[#6B726E] mt-1">
                  Registra el kilometraje, niveles y fotografías de todos los ángulos del vehículo antes del inicio del viaje. Estas imágenes quedan incorporadas formalmente al contrato y sirven de prueba vinculante ante cualquier incidencia o devolución de fianza.
                </p>
              </div>
            </div>

            {/* PARÁMETROS BÁSICOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-[#E9E1D2]">
              <div>
                <label className="block text-[10px] font-black uppercase text-[#6B726E] mb-1">
                  Kilometraje Actual (km)
                </label>
                <div className="flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-[#16B8AA]" />
                  <input
                    type="number"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-lg border border-[#E9E1D2] focus:ring-1 focus:ring-[#16B8AA] outline-none"
                    placeholder="85000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#6B726E] mb-1">
                  Nivel de Combustible
                </label>
                <div className="flex items-center space-x-2">
                  <Fuel className="w-4 h-4 text-[#16B8AA]" />
                  <select
                    value={fuelLevel}
                    onChange={(e) => setFuelLevel(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-lg border border-[#E9E1D2] focus:ring-1 focus:ring-[#16B8AA] outline-none bg-white"
                  >
                    <option value="FULL">Lleno (100%)</option>
                    <option value="3/4">3/4 Depósito</option>
                    <option value="1/2">1/2 Depósito</option>
                    <option value="1/4">1/4 Depósito</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#6B726E] mb-1">
                  Depósito Agua Limpia
                </label>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-[#16B8AA]" />
                  <select
                    value={waterLevel}
                    onChange={(e) => setWaterLevel(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-lg border border-[#E9E1D2] focus:ring-1 focus:ring-[#16B8AA] outline-none bg-white"
                  >
                    <option value="FULL">Lleno (100%)</option>
                    <option value="1/2">50%</option>
                    <option value="EMPTY">Vacío</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#6B726E] mb-1">
                  Estado de Limpieza
                </label>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#16B8AA]" />
                  <select
                    value={cleanliness}
                    onChange={(e) => setCleanliness(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-lg border border-[#E9E1D2] focus:ring-1 focus:ring-[#16B8AA] outline-none bg-white"
                  >
                    <option value="EXCELLENT">Excelente / Impecable</option>
                    <option value="GOOD">Bueno</option>
                    <option value="FAIR">Aceptable</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CHECKLIST DE COMPONENTES */}
            <div className="bg-white p-4 rounded-xl border border-[#E9E1D2] space-y-3">
              <span className="text-[10px] font-black uppercase text-[#16B8AA] tracking-wider block">
                Comprobación de Elementos y Camperización
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-[#13322E]">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.exteriorBody}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, exteriorBody: e.target.checked })}
                    className="rounded text-[#16B8AA] focus:ring-0"
                  />
                  <span>Chapa / Pintura</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.lights}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, lights: e.target.checked })}
                    className="rounded text-[#16B8AA] focus:ring-0"
                  />
                  <span>Luces y Faros</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.tires}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, tires: e.target.checked })}
                    className="rounded text-[#16B8AA] focus:ring-0"
                  />
                  <span>Neumáticos</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.interiorFurniture}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, interiorFurniture: e.target.checked })}
                    className="rounded text-[#16B8AA] focus:ring-0"
                  />
                  <span>Mobiliario y Cama</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.kitchenGas}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, kitchenGas: e.target.checked })}
                    className="rounded text-[#16B8AA] focus:ring-0"
                  />
                  <span>Cocina y Gas</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.fridge}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, fridge: e.target.checked })}
                    className="rounded text-[#16B8AA] focus:ring-0"
                  />
                  <span>Nevera</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.waterPump}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, waterPump: e.target.checked })}
                    className="rounded text-[#16B8AA] focus:ring-0"
                  />
                  <span>Bomba de Agua / Grifo</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.auxBattery}
                    onChange={(e) => setInspectionChecks({ ...inspectionChecks, auxBattery: e.target.checked })}
                    className="rounded text-[#16B8AA] focus:ring-0"
                  />
                  <span>Batería Auxiliar / 12V</span>
                </label>
              </div>
            </div>

            {/* SUBIDA DE FOTOGRAFÍAS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#16B8AA] tracking-wider">
                  Fotografías de Estado Obligatorias (Evidencias de Entrega)
                </span>
                <span className="text-[10px] text-[#6B726E] font-medium">
                  {photos.length} fotos adjuntas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {DEFAULT_PHOTO_SLOTS.map((slot) => {
                  const uploaded = photos.find((p) => p.tag === slot.tag);
                  return (
                    <div
                      key={slot.tag}
                      className="bg-white rounded-2xl p-3 border border-[#E9E1D2] flex flex-col justify-between space-y-2 relative overflow-hidden"
                    >
                      <span className="text-[10px] font-bold text-[#13322E] line-clamp-1">
                        {slot.label}
                      </span>

                      {uploaded ? (
                        <div className="relative group">
                          <img
                            src={uploaded.url}
                            alt={slot.label}
                            className="w-full h-28 object-cover rounded-xl border border-[#E9E1D2]"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <label className="cursor-pointer bg-white text-[#13322E] text-[10px] font-bold px-3 py-1.5 rounded-full shadow">
                              Cambiar foto
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handlePhotoUpload(slot.tag, slot.label, e)}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="h-28 border-2 border-dashed border-[#E9E1D2] rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-[#16B8AA] transition-colors bg-[#FAF7F0]/50">
                          <Camera className="w-6 h-6 text-[#16B8AA] mb-1" />
                          <span className="text-[10px] font-bold text-[#13322E]">Subir foto</span>
                          <span className="text-[8px] text-[#6B726E]">Cámara o galería</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(slot.tag, slot.label, e)}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* OBSERVACIONES ADICIONALES */}
            <div>
              <label className="block text-[10px] font-black uppercase text-[#6B726E] mb-1">
                Observaciones o Desperfectos Previos Notificados
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ejemplo: Pequeño arañazo en aleta trasera derecha de 2cm. Todo el menaje de cocina completo y revisado."
                className="w-full p-3 text-xs rounded-xl border border-[#E9E1D2] bg-white focus:ring-1 focus:ring-[#16B8AA] outline-none font-medium"
              />
            </div>

            {/* BOTÓN GUARDAR COMPROBACIÓN */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-[10px] text-[#6B726E]">
                Al guardar, la ficha y las fotos se integrarán automáticamente como el <strong>ANEXO I</strong> del contrato digital.
              </p>
              <button
                type="button"
                disabled={savingInspection}
                onClick={handleSaveInspection}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full bg-[#16B8AA] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0F766E] transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{savingInspection ? 'Guardando...' : 'Guardar y Adjuntar al Contrato'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: DOCUMENTO COMPLETO DEL CONTRATO (CON ANEXO DE FOTOS E IMPRIMIBLE) */}
      {activeTab === 'view' && (
        <div className="space-y-6 printable-contract">
          <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#E9E1D2] font-sans text-xs text-[#13322E] space-y-6 leading-relaxed">
            
            {/* ENCABEZADO FORMAL DEL DOCUMENTO */}
            <div className="text-center border-b border-[#E9E1D2] pb-6 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#16B8AA]">
                CONTRATO PARTICULAR DE ARRENDAMIENTO DE VEHÍCULO SIN CONDUCTOR
              </span>
              <h3 className="text-xl font-bold text-[#13322E]">
                CONTRATO PRIVADO ENTRE PARTICULARES
              </h3>
              <p className="text-[11px] text-[#6B726E]">
                El presente contrato se celebra de forma directa y exclusiva entre las partes particulares abajo firmantes.
              </p>
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[10px] text-amber-900 font-medium text-center">
                <strong>Aviso legal:</strong> GTR Cars actúa únicamente como intermediario tecnológico para facilitar la puesta en contacto y la firma digital. GTR Cars no es propietario del vehículo, no es parte del contrato de alquiler ni asume responsabilidades derivadas del uso, seguro o fianza acordada entre las partes.
              </div>
            </div>

            {/* PARTES CONTRATANTES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-[#E9E1D2]">
              <div>
                <strong className="block text-[10px] uppercase font-black text-[#16B8AA] mb-1">
                  PARTE ARRENDADORA (PROPIETARIO)
                </strong>
                <p className="font-bold text-[#13322E]">{booking.owner?.firstName} {booking.owner?.lastName}</p>
                <p className="text-[#6B726E] text-[11px]">Email: {booking.owner?.email}</p>
                <p className="text-[#6B726E] text-[11px]">Verificación Vaneando: {booking.owner?.verification === 'VERIFIED' ? 'Identidad Oficial Confirmada' : 'Registrado'}</p>
              </div>

              <div>
                <strong className="block text-[10px] uppercase font-black text-[#16B8AA] mb-1">
                  PARTE ARRENDATARIA (VIAJERO / CONDUCTOR)
                </strong>
                <p className="font-bold text-[#13322E]">{booking.traveler?.firstName} {booking.traveler?.lastName}</p>
                <p className="text-[#6B726E] text-[11px]">Email: {booking.traveler?.email}</p>
                <p className="text-[#6B726E] text-[11px]">Permiso B válido y verificado</p>
              </div>
            </div>

            {/* DATOS DEL VEHÍCULO Y RESERVA */}
            <div className="bg-white p-4 rounded-xl border border-[#E9E1D2] space-y-2">
              <strong className="block text-[10px] uppercase font-black text-[#16B8AA]">
                OBJETO DEL CONTRATO Y DATOS DEL VEHÍCULO
              </strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div>
                  <span className="text-[#6B726E] block">Vehículo:</span>
                  <strong className="text-[#13322E]">{booking.vehicle?.title || 'Camper'}</strong>
                </div>
                <div>
                  <span className="text-[#6B726E] block">Ubicación:</span>
                  <strong className="text-[#13322E]">{booking.vehicle?.municipality || ''}, {booking.vehicle?.island || ''}</strong>
                </div>
                <div>
                  <span className="text-[#6B726E] block">Inicio alquiler:</span>
                  <strong className="text-[#13322E]">{dateFormatted(booking.pickupDate)} ({booking.pickupTime})</strong>
                </div>
                <div>
                  <span className="text-[#6B726E] block">Fin alquiler:</span>
                  <strong className="text-[#13322E]">{dateFormatted(booking.returnDate)} ({booking.returnTime})</strong>
                </div>
              </div>
            </div>

            {/* CLÁUSULAS Y ESTIPULACIONES LEGALES */}
            <div className="space-y-4 text-justify">
              <div>
                <strong className="block text-[#13322E] mb-1">PRIMERA. Objeto y uso exclusivo.</strong>
                <p className="text-[#52605B]">
                  El Arrendador cede en alquiler sin conductor el vehículo indicado al Arrendatario durante el periodo estipulado. El Arrendatario destinará el vehículo exclusivamente a transporte particular turístico en la Comunidad Autónoma de Canarias. Queda prohibida la subarrendación, cesión a terceros no autorizados o uso comercial sin permiso.
                </p>
              </div>

              <div>
                <strong className="block text-[#13322E] mb-1">SEGUNDA. Precio, fianza y liquidación.</strong>
                <p className="text-[#52605B]">
                  El precio total del alquiler asciende a <strong>{booking.totalAmount} €</strong>. La fianza fijada en <strong>{booking.depositAmount} €</strong> se gestiona y liquida directamente entre el Arrendatario (viajero) y el Arrendador (propietario particular). La fianza responde de eventuales daños menores, falta de combustible, limpieza deficiente o kilometraje excedido. El pago neto del alquiler se transfiere al propietario en un plazo de 7 días hábiles tras finalizar el viaje.
                </p>
              </div>

              <div>
                <strong className="block text-[#13322E] mb-1">TERCERA. Seguro del vehículo y coberturas.</strong>
                <p className="text-[#52605B]">
                  El vehículo cuenta con la póliza de seguro contratada por su propietario particular. En caso de que el Arrendatario desee coberturas adicionales o un seguro específico de viaje, deberá contratarlo por su cuenta de forma independiente.
                </p>
              </div>

              <div>
                <strong className="block text-[#13322E] mb-1">CUARTA. Kilometraje y combustible.</strong>
                <p className="text-[#52605B]">
                  Se incluye un límite de <strong>{booking.vehicle?.includedKmPerDay || 0} km/día</strong>. El exceso se abonará a razón de <strong>{booking.vehicle?.extraKmPrice || 0} € por km adicional</strong>. El vehículo se devolverá con el mismo nivel de combustible acreditado en el Check-in digital.
                </p>
              </div>

              <div>
                <strong className="block text-[#13322E] mb-1">QUINTA. Naturaleza del contrato e intermediación.</strong>
                <p className="text-[#52605B]">
                  Las partes reconocen expresamente que el presente contrato se celebra única y exclusivamente entre el Arrendador particular y el Arrendatario particular. La plataforma Vaneando actúa como mero intermediario tecnológico de comunicación y gestión sin ostentar la condición de parte arrendadora, propietaria o aseguradora.
                </p>
              </div>

              <div>
                <strong className="block text-[#13322E] mb-1">SEXTA. Ley aplicable y firma eIDAS.</strong>
                <p className="text-[#52605B]">
                  Este contrato se rige por el Código Civil español y la normativa mercantil aplicable. Las firmas electrónicas quedan registradas con sello temporal, IP y hash criptográfico con plena validez legal conforme al Reglamento eIDAS (UE Nº 910/2014).
                </p>
              </div>
            </div>

            {/* ANEXO I: ACTA DE COMPROBACIÓN FOTOGRÁFICA Y ESTADO DEL VEHÍCULO */}
            <div className="pt-6 border-t-2 border-[#E9E1D2] space-y-4 bg-white p-5 rounded-2xl border border-[#E9E1D2]">
              <div className="text-center border-b border-[#E9E1D2] pb-3">
                <span className="text-[10px] font-black uppercase text-[#16B8AA] tracking-widest">
                  DOCUMENTO ANEXO AL CONTRATO
                </span>
                <h4 className="text-base font-bold text-[#13322E]">
                  ANEXO I: ACTA DE COMPROBACIÓN FOTOGRÁFICA Y ESTADO DEL VEHÍCULO
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] bg-[#FAF7F0] p-3 rounded-xl">
                <div>
                  <span className="text-[#6B726E] block">Kilometraje Inicial:</span>
                  <strong>{odometer} km</strong>
                </div>
                <div>
                  <span className="text-[#6B726E] block">Combustible Entrega:</span>
                  <strong>{fuelLevel === 'FULL' ? '100% (Lleno)' : fuelLevel}</strong>
                </div>
                <div>
                  <span className="text-[#6B726E] block">Depósito Agua:</span>
                  <strong>{waterLevel === 'FULL' ? '100% (Lleno)' : waterLevel}</strong>
                </div>
                <div>
                  <span className="text-[#6B726E] block">Limpieza:</span>
                  <strong>{cleanliness === 'EXCELLENT' ? 'Excelente' : cleanliness}</strong>
                </div>
              </div>

              {notes && (
                <div className="p-3 bg-[#FAF7F0] rounded-xl text-[11px]">
                  <strong className="text-[#13322E] block mb-1">Observaciones registradas en entrega:</strong>
                  <p className="text-[#52605B] italic">{notes}</p>
                </div>
              )}

              {/* GALERÍA DE FOTOS ADJUNTAS AL CONTRATO */}
              <div className="space-y-2 pt-2">
                <strong className="block text-[11px] uppercase font-black text-[#13322E]">
                  Fotografías de Evidencia Adjuntadas ({photos.length} imágenes registradas):
                </strong>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <img
                        src={p.url}
                        alt={p.label}
                        className="w-full h-24 object-cover rounded-lg border border-[#E9E1D2]"
                      />
                      <span className="text-[9px] font-bold text-[#13322E] block truncate">
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN DE REGISTRO DE FIRMAS AL PIE */}
            <div className="pt-6 border-t border-[#E9E1D2] grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 rounded-xl border border-[#E9E1D2]">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-[#16B8AA]">FIRMA Y CONFORMIDAD DEL VIAJERO</span>
                {travelerSigned ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <p className="font-bold text-emerald-900">{contract.signedByTraveler}</p>
                    <p className="text-[9px] text-emerald-700 font-mono">Sello temporal: {contract.signedAtTraveler ? new Date(contract.signedAtTraveler).toLocaleString() : 'Registrado'}</p>
                  </div>
                ) : (
                  <p className="text-xs text-amber-800 font-bold bg-amber-50 p-3 rounded-xl border border-amber-200">Pendiente de firma</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-[#16B8AA]">FIRMA Y CONFORMIDAD DEL PROPIETARIO</span>
                {ownerSigned ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <p className="font-bold text-emerald-900">{contract.signedByOwner}</p>
                    <p className="text-[9px] text-emerald-700 font-mono">Sello temporal: {contract.signedAtOwner ? new Date(contract.signedAtOwner).toLocaleString() : 'Registrado'}</p>
                  </div>
                ) : (
                  <p className="text-xs text-amber-800 font-bold bg-amber-50 p-3 rounded-xl border border-amber-200">Pendiente de firma</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PESTAÑA 3: FORMULARIO DE FIRMA DIGITAL CON CANVAS Y CHECKBOXES */}
      {activeTab === 'sign' && !mySignatureDone && (
        <div className="space-y-6 bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#E9E1D2]">
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#13322E]">
              Proceso de Firma Electrónica como {viewerRole === 'OWNER' ? 'Propietario' : 'Viajero'}
            </h3>
            <p className="text-xs text-[#6B726E] font-medium">
              Por favor, confirma las cláusulas del alquiler y la Ficha de Comprobación adjunta antes de realizar tu firma.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>¡Tu firma digital ha sido registrada con éxito!</span>
            </div>
          )}

          {/* CASILLAS DE VERIFICACIÓN */}
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E9E1D2]">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.terms}
                onChange={(e) => setChecks({ ...checks, terms: e.target.checked })}
                className="mt-0.5 rounded text-[#16B8AA] focus:ring-0"
              />
              <span className="text-xs text-[#13322E]">
                He leído y acepto el contrato de alquiler privado entre particulares y la Ficha de Comprobación Fotográfica del vehículo (Anexo I).
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.deposit}
                onChange={(e) => setChecks({ ...checks, deposit: e.target.checked })}
                className="mt-0.5 rounded text-[#16B8AA] focus:ring-0"
              />
              <span className="text-xs text-[#13322E]">
                Reconozco que la fianza de <strong>{booking.depositAmount} €</strong> se gestiona directamente entre el viajero y el propietario.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.truthful}
                onChange={(e) => setChecks({ ...checks, truthful: e.target.checked })}
                className="mt-0.5 rounded text-[#16B8AA] focus:ring-0"
              />
              <span className="text-xs text-[#13322E]">
                Confirmo la veracidad de los datos aportados y la validez legal de mi firma eIDAS.
              </span>
            </label>
          </div>

          {/* SELECTOR DE MÉTODO DE FIRMA: DIBUJAR O ESCRIBIR */}
          <div className="bg-white p-5 rounded-2xl border border-[#E9E1D2] space-y-4">
            <div className="flex items-center space-x-4 border-b border-[#E9E1D2] pb-3">
              <button
                type="button"
                onClick={() => setSignatureType('type')}
                className={`text-xs font-bold pb-1 cursor-pointer transition-colors ${
                  signatureType === 'type'
                    ? 'text-[#16B8AA] border-b-2 border-[#16B8AA]'
                    : 'text-[#6B726E] hover:text-[#13322E]'
                }`}
              >
                Escribir Nombre Completo
              </button>
              <button
                type="button"
                onClick={() => setSignatureType('draw')}
                className={`text-xs font-bold pb-1 cursor-pointer transition-colors ${
                  signatureType === 'draw'
                    ? 'text-[#16B8AA] border-b-2 border-[#16B8AA]'
                    : 'text-[#6B726E] hover:text-[#13322E]'
                }`}
              >
                Dibujar Trazo / Firma
              </button>
            </div>

            {signatureType === 'type' ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#13322E]">
                  Escribe tu nombre y apellidos tal y como aparecen en tu DNI / Pasaporte:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Alejandro González Barranco"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[#E9E1D2] text-sm font-serif font-bold text-[#13322E] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#13322E]">
                    Dibuja tu firma en el recuadro con el dedo o ratón:
                  </label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[10px] text-red-600 font-bold hover:underline"
                  >
                    Borrar firma
                  </button>
                </div>
                <div className="border border-dashed border-[#16B8AA]/40 bg-[#FAF7F0] rounded-xl overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-[150px] cursor-crosshair touch-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* BOTÓN DE FIRMA */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              disabled={loading || success}
              onClick={handleSign}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-[#16B8AA] text-white text-xs font-black uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Registrando firma...' : 'Firmar y Validar Contrato'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
