'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Camera,
  Check,
  AlertTriangle,
  Gauge,
  Fuel,
  Sparkles,
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
  { tag: 'FRONT', label: 'Frontal, Splitter y Ópticas' },
  { tag: 'REAR', label: 'Difusor Trasero, Alerón y Escape' },
  { tag: 'LEFT_WHEELS', label: 'Llantas y Neumáticos Lado Izquierdo' },
  { tag: 'RIGHT_WHEELS', label: 'Llantas y Neumáticos Lado Derecho' },
  { tag: 'LEFT_BODY', label: 'Carrocería / Puertas Lado Izquierdo' },
  { tag: 'RIGHT_BODY', label: 'Carrocería / Puertas Lado Derecho' },
  { tag: 'INTERIOR_COCKPIT', label: 'Cockpit, Asientos y Consola Central' },
  { tag: 'DASHBOARD', label: 'Cuadro de Mandos / Cuentakilómetros y Modos' },
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

  const existingCheckIn = booking.checkIn || {};
  const [odometer, setOdometer] = useState<string>(
    existingCheckIn.odometer ? String(existingCheckIn.odometer) : '12500'
  );
  const [fuelLevel, setFuelLevel] = useState<string>(existingCheckIn.fuelLevel || 'FULL');
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
        label: 'Frontal, Splitter y Ópticas',
        url: '/supercars/ferrari-488/ferrari-488-front.jpg',
      },
      {
        tag: 'LEFT_BODY',
        label: 'Carrocería / Puertas Lado Izquierdo',
        url: '/supercars/ferrari-488/ferrari-488-side.jpg',
      },
    ];
  });

  const [, setUploadingSlot] = useState<string | null>(null);
  const [savingInspection, setSavingInspection] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const contract = booking.contract || {};
  const travelerSigned = !!contract.signedByTraveler;
  const ownerSigned = !!contract.signedByOwner;
  const mySignatureDone =
    viewerRole === 'OWNER' ? ownerSigned : viewerRole === 'TRAVELER' ? travelerSigned : true;

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
    ctx.strokeStyle = '#0A0A0A';
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
          waterLevel: 'FULL',
          cleanliness,
          notes,
          photos,
          inspectionChecks,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al guardar la comprobación');

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
            waterLevel: 'FULL',
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
          extraKmPrice: booking.vehicle?.extraKmPrice || 3.5,
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
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 text-black font-sans">
      {/* CABECERA Y ACCIONES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gray-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span>Validez Jurídica eIDAS UE 910/2014 &amp; Acta Digital</span>
          </div>
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">
            Ficha de Comprobación y Contrato Digital
          </h2>
          <p className="text-xs text-gray-600 font-mono mt-1">
            Expediente: <strong className="text-black">{booking.code}</strong> • Unidad:{' '}
            <strong className="text-black">{booking.vehicle?.title}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
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
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-xs font-bold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
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
            <span>Descargar PDF</span>
          </button>

          <button
            type="button"
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
          <p className="text-xs text-gray-600">
            {viewerRole === 'OWNER'
              ? 'Puedes pulsar "Rehacer Contrato" para generar la nueva versión y enviarla al cliente.'
              : 'El propietario está actualizando los datos del contrato. En cuanto esté disponible podrás firmarlo nuevamente.'}
          </p>
        </div>
      )}

      {/* MODAL DE CANCELACIÓN DE CONTRATO */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleCancelContract}
            className="w-full max-w-lg rounded-3xl bg-white border border-gray-200 p-7 shadow-2xl space-y-4 text-black"
          >
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[.2em]">Acción Legal</span>
                <h3 className="text-2xl font-black uppercase text-black">Cancelar Contrato Digital</h3>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Al cancelar este contrato, se anulan las firmas emitidas y se enviará un correo automático a{' '}
              <strong>{booking.traveler?.firstName || 'el conductor'}</strong>. Podrás regenerarlo inmediatamente.
            </p>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                Motivo de la cancelación del contrato *
              </label>
              <textarea
                required
                rows={3}
                value={contractCancelReason}
                onChange={(e) => setContractCancelReason(e.target.value)}
                placeholder="Ej. Cambio de conductor principal, modificación de fechas o actualización de fianza."
                className="w-full rounded-2xl border border-gray-300 p-3 text-xs bg-gray-50 focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 font-mono">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-bold cursor-pointer"
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
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('inspection')}
          className={`py-3 px-5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'inspection'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>1. Acta Técnica &amp; Fotos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('view')}
          className={`py-3 px-5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'view'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Contrato Oficial + Anexo I</span>
        </button>

        {!mySignatureDone && (
          <button
            type="button"
            onClick={() => setActiveTab('sign')}
            className={`py-3 px-5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'sign'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <span>3. Firmar Contrato ({viewerRole === 'OWNER' ? 'Propietario' : 'Conductor'})</span>
          </button>
        )}
      </div>

      {/* PESTAÑA 1: FICHA DE COMPROBACIÓN DEL SUPERDEPORTIVO */}
      {activeTab === 'inspection' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">
                ACTA DE INSPECCIÓN DIGITAL // PRE-ENTREGA
              </span>
              <h3 className="text-xl font-black uppercase text-black mt-1">
                Comprobación Técnica del Superdeportivo
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Registra el kilometraje, nivel de combustible y fotografías de los 8 puntos críticos antes de la entrega de llaves. Estas imágenes quedan incorporadas formalmente al contrato (Anexo I).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-200 font-mono">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                  Kilometraje Actual (km)
                </label>
                <div className="flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-black" />
                  <input
                    type="number"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-lg border border-gray-300 focus:border-black outline-none"
                    placeholder="12500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                  Nivel de Combustible / Batería
                </label>
                <div className="flex items-center space-x-2">
                  <Fuel className="w-4 h-4 text-black" />
                  <select
                    value={fuelLevel}
                    onChange={(e) => setFuelLevel(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-lg border border-gray-300 focus:border-black outline-none bg-white"
                  >
                    <option value="FULL">Lleno (100%)</option>
                    <option value="3/4">3/4 Depósito</option>
                    <option value="1/2">1/2 Depósito</option>
                    <option value="1/4">1/4 Depósito</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                  Estado de Detallado
                </label>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-black" />
                  <select
                    value={cleanliness}
                    onChange={(e) => setCleanliness(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-lg border border-gray-300 focus:border-black outline-none bg-white"
                  >
                    <option value="EXCELLENT">Detallado Concours / Impecable</option>
                    <option value="GOOD">Óptimo</option>
                    <option value="FAIR">Correcto</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CHECKLIST DE COMPONENTES DE SUPERDEPORTIVO */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 font-mono">
              <span className="text-[10px] font-black uppercase text-black tracking-wider block">
                Comprobación de Elementos y Telemetría del Superdeportivo
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-black">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.exteriorBody}
                    onChange={(e) =>
                      setInspectionChecks({ ...inspectionChecks, exteriorBody: e.target.checked })
                    }
                    className="rounded text-black focus:ring-0"
                  />
                  <span>Carrocería / Fibra Carbono</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.lights}
                    onChange={(e) =>
                      setInspectionChecks({ ...inspectionChecks, lights: e.target.checked })
                    }
                    className="rounded text-black focus:ring-0"
                  />
                  <span>Splitter &amp; Difusor Activo</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.tires}
                    onChange={(e) =>
                      setInspectionChecks({ ...inspectionChecks, tires: e.target.checked })
                    }
                    className="rounded text-black focus:ring-0"
                  />
                  <span>Llantas &amp; Neumáticos Michelin</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.interiorFurniture}
                    onChange={(e) =>
                      setInspectionChecks({
                        ...inspectionChecks,
                        interiorFurniture: e.target.checked,
                      })
                    }
                    className="rounded text-black focus:ring-0"
                  />
                  <span>Frenos Carbono-Cerámicos</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.kitchenGas}
                    onChange={(e) =>
                      setInspectionChecks({ ...inspectionChecks, kitchenGas: e.target.checked })
                    }
                    className="rounded text-black focus:ring-0"
                  />
                  <span>Cockpit &amp; Alcántara</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspectionChecks.fridge}
                    onChange={(e) =>
                      setInspectionChecks({ ...inspectionChecks, fridge: e.target.checked })
                    }
                    className="rounded text-black focus:ring-0"
                  />
                  <span>Launch Control &amp; Modos Race</span>
                </label>
              </div>
            </div>

            {/* SUBIDA DE FOTOGRAFÍAS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-[10px] font-black uppercase text-black tracking-wider">
                  Fotografías de Estado Obligatorias (Evidencias de Entrega)
                </span>
                <span className="text-[10px] text-gray-600 font-bold">
                  {photos.length} fotos adjuntas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {DEFAULT_PHOTO_SLOTS.map((slot) => {
                  const uploaded = photos.find((p) => p.tag === slot.tag);
                  return (
                    <div
                      key={slot.tag}
                      className="bg-white rounded-2xl p-3 border border-gray-200 flex flex-col justify-between space-y-2 relative overflow-hidden"
                    >
                      <span className="text-[10px] font-bold text-black line-clamp-1">
                        {slot.label}
                      </span>

                      {uploaded ? (
                        <div className="relative group">
                          <img
                            src={uploaded.url}
                            alt={slot.label}
                            className="w-full h-28 object-cover rounded-xl border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <label className="cursor-pointer bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow">
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
                        <label className="h-28 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-black transition-colors bg-gray-50">
                          <Camera className="w-6 h-6 text-black mb-1" />
                          <span className="text-[10px] font-bold text-black">Subir foto</span>
                          <span className="text-[8px] text-gray-500">Cámara o galería</span>
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

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-gray-600 mb-1">
                Observaciones o Marcas Previas Notificadas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ejemplo: Neumáticos y frenos carbono-cerámicos en perfecto estado."
                className="w-full p-3 text-xs rounded-xl border border-gray-300 bg-white focus:border-black outline-none font-medium"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 font-mono">
              <p className="text-[10px] text-gray-600">
                Al guardar, el acta técnica y las fotos se integrarán como el <strong>ANEXO I</strong> del contrato digital.
              </p>
              <button
                type="button"
                disabled={savingInspection}
                onClick={handleSaveInspection}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{savingInspection ? 'Guardando...' : 'Guardar y Adjuntar al Contrato'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: DOCUMENTO COMPLETO DEL CONTRATO */}
      {activeTab === 'view' && (
        <div className="space-y-6 printable-contract">
          <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 font-sans text-xs text-black space-y-6 leading-relaxed">
            <div className="text-center border-b border-gray-200 pb-6 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">
                CONTRATO DE ARRENDAMIENTO DE SUPERDEPORTIVO SIN CONDUCTOR
              </span>
              <h3 className="text-xl font-black uppercase text-black">
                CONTRATO DIGITAL VINCULANTE — GTR CARS
              </h3>
              <p className="text-[11px] text-gray-600">
                El presente contrato se celebra con plena validez jurídica conforme al Reglamento Europeo eIDAS (UE 910/2014).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-200">
              <div>
                <strong className="block text-[10px] font-mono uppercase font-black text-gray-500 mb-1">
                  PARTE ARRENDADORA (PROPIETARIO)
                </strong>
                <p className="font-bold text-black">
                  {booking.owner?.firstName} {booking.owner?.lastName}
                </p>
                <p className="text-gray-600 text-[11px]">Email: {booking.owner?.email}</p>
                <p className="text-gray-600 text-[11px]">
                  Verificación GTR Cars:{' '}
                  {booking.owner?.verification === 'VERIFIED'
                    ? 'Identidad Oficial Confirmada'
                    : 'Registrado'}
                </p>
              </div>

              <div>
                <strong className="block text-[10px] font-mono uppercase font-black text-gray-500 mb-1">
                  PARTE ARRENDATARIA (PILOTO / CONDUCTOR)
                </strong>
                <p className="font-bold text-black">
                  {booking.traveler?.firstName} {booking.traveler?.lastName}
                </p>
                <p className="text-gray-600 text-[11px]">Email: {booking.traveler?.email}</p>
                <p className="text-gray-600 text-[11px]">Licencia de conducción válida y verificada</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
              <strong className="block text-[10px] font-mono uppercase font-black text-gray-500">
                OBJETO DEL CONTRATO Y UNIDAD ASIGNADA
              </strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div>
                  <span className="text-gray-500 block">Superdeportivo:</span>
                  <strong className="text-black">{booking.vehicle?.title || 'Superdeportivo'}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Base de Entrega:</span>
                  <strong className="text-black">
                    {booking.vehicle?.municipality || ''}, {booking.vehicle?.island || ''}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Entrega de Llaves:</span>
                  <strong className="text-black">
                    {dateFormatted(booking.pickupDate)} ({booking.pickupTime})
                  </strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Devolución:</span>
                  <strong className="text-black">
                    {dateFormatted(booking.returnDate)} ({booking.returnTime})
                  </strong>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-justify text-gray-700">
              <div>
                <strong className="block text-black mb-1">PRIMERA. Objeto y uso autorizado.</strong>
                <p>
                  El Arrendador cede en alquiler sin conductor el superdeportivo indicado al Arrendatario durante el periodo estipulado. Queda estrictamente prohibida la subarrendación, cesión a conductores no registrados en el contrato o participación en competiciones no autorizadas.
                </p>
              </div>

              <div>
                <strong className="block text-black mb-1">SEGUNDA. Tarifa, fianza y liquidación.</strong>
                <p>
                  El importe total del alquiler asciende a <strong>{booking.totalAmount} €</strong>. La fianza de garantía fijada en <strong>{booking.depositAmount} €</strong> responde de eventuales daños en carrocería/llantas, combustible o kilometraje excedido, reembolsándose tras la verificación de devolución sin incidencias.
                </p>
              </div>

              <div>
                <strong className="block text-black mb-1">TERCERA. Kilometraje y combustible.</strong>
                <p>
                  Se incluye un límite de <strong>{booking.vehicle?.includedKmPerDay || 150} km/día</strong>. El exceso se liquidará a razón de <strong>{booking.vehicle?.extraKmPrice || 3.5} € por km adicional</strong>. El vehículo se devolverá con el mismo nivel de combustible (Gasolina 98 octanos o carga eléctrica) acreditado en el Anexo I.
                </p>
              </div>

              <div>
                <strong className="block text-black mb-1">CUARTA. Ley aplicable y firma eIDAS.</strong>
                <p>
                  Este contrato se rige por la legislación española y las firmas electrónicas quedan registradas con sello temporal y validez jurídica conforme al Reglamento eIDAS (UE Nº 910/2014).
                </p>
              </div>
            </div>

            {/* ANEXO I */}
            <div className="pt-6 border-t-2 border-gray-200 space-y-4 bg-white p-5 rounded-2xl border border-gray-200">
              <div className="text-center border-b border-gray-200 pb-3">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-widest">
                  DOCUMENTO ANEXO AL CONTRATO
                </span>
                <h4 className="text-base font-black uppercase text-black">
                  ANEXO I: ACTA DE COMPROBACIÓN FOTOGRÁFICA Y TELEMETRÍA
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] bg-gray-50 p-3 rounded-xl font-mono">
                <div>
                  <span className="text-gray-500 block">Kilometraje Inicial:</span>
                  <strong>{odometer} km</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Combustible / Carga:</span>
                  <strong>{fuelLevel === 'FULL' ? '100% (Lleno)' : fuelLevel}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Estado Detallado:</span>
                  <strong>{cleanliness === 'EXCELLENT' ? 'Excelente' : cleanliness}</strong>
                </div>
              </div>

              {notes && (
                <div className="p-3 bg-gray-50 rounded-xl text-[11px]">
                  <strong className="text-black block mb-1">Observaciones en entrega:</strong>
                  <p className="text-gray-700 italic">{notes}</p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <strong className="block text-[11px] font-mono uppercase font-black text-black">
                  Fotografías de Evidencia ({photos.length} imágenes registradas):
                </strong>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <img
                        src={p.url}
                        alt={p.label}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <span className="text-[9px] font-bold text-black block truncate">
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FIRMAS */}
            <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 rounded-xl border border-gray-200">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-black uppercase text-gray-500">
                  FIRMA Y CONFORMIDAD DEL CONDUCTOR
                </span>
                {travelerSigned ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <p className="font-bold text-emerald-900">{contract.signedByTraveler}</p>
                    <p className="text-[9px] text-emerald-700 font-mono">
                      Sello temporal:{' '}
                      {contract.signedAtTraveler
                        ? new Date(contract.signedAtTraveler).toLocaleString()
                        : 'Registrado'}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-amber-800 font-bold bg-amber-50 p-3 rounded-xl border border-amber-200">
                    Pendiente de firma
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-black uppercase text-gray-500">
                  FIRMA Y CONFORMIDAD DEL PROPIETARIO
                </span>
                {ownerSigned ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <p className="font-bold text-emerald-900">{contract.signedByOwner}</p>
                    <p className="text-[9px] text-emerald-700 font-mono">
                      Sello temporal:{' '}
                      {contract.signedAtOwner
                        ? new Date(contract.signedAtOwner).toLocaleString()
                        : 'Registrado'}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-amber-800 font-bold bg-amber-50 p-3 rounded-xl border border-amber-200">
                    Pendiente de firma
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: FORMULARIO DE FIRMA DIGITAL */}
      {activeTab === 'sign' && !mySignatureDone && (
        <div className="space-y-6 bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase text-black">
              Firma Electrónica eIDAS como {viewerRole === 'OWNER' ? 'Propietario' : 'Conductor'}
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Confirma las cláusulas del contrato y el Acta Técnica (Anexo I) antes de registrar tu firma.
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

          <div className="space-y-3 bg-white p-5 rounded-2xl border border-gray-200">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.terms}
                onChange={(e) => setChecks({ ...checks, terms: e.target.checked })}
                className="mt-0.5 rounded text-black focus:ring-0"
              />
              <span className="text-xs text-black">
                He leído y acepto el contrato de arrendamiento y el Acta Técnica Fotográfica del vehículo (Anexo I).
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.deposit}
                onChange={(e) => setChecks({ ...checks, deposit: e.target.checked })}
                className="mt-0.5 rounded text-black focus:ring-0"
              />
              <span className="text-xs text-black">
                Acepto las condiciones de la fianza reembolsable de <strong>{booking.depositAmount} €</strong>.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.truthful}
                onChange={(e) => setChecks({ ...checks, truthful: e.target.checked })}
                className="mt-0.5 rounded text-black focus:ring-0"
              />
              <span className="text-xs text-black">
                Confirmo la veracidad de mis datos y la plena validez legal de mi firma electrónica eIDAS.
              </span>
            </label>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
            <div className="flex items-center space-x-4 border-b border-gray-200 pb-3 font-mono">
              <button
                type="button"
                onClick={() => setSignatureType('type')}
                className={`text-xs font-bold pb-1 cursor-pointer transition-colors ${
                  signatureType === 'type'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Escribir Nombre Completo
              </button>
              <button
                type="button"
                onClick={() => setSignatureType('draw')}
                className={`text-xs font-bold pb-1 cursor-pointer transition-colors ${
                  signatureType === 'draw'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Dibujar Firma Manuscrita
              </button>
            </div>

            {signatureType === 'type' ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-black">
                  Escribe tu nombre y apellidos tal como figuran en tu DNI / Pasaporte:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Alejandro Mendoza"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-300 text-sm font-bold text-black focus:outline-none focus:border-black"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-black">
                    Dibuja tu firma en el recuadro:
                  </label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[10px] text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    Borrar firma
                  </button>
                </div>
                <div className="border border-dashed border-gray-400 bg-gray-50 rounded-xl overflow-hidden">
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

          <div className="flex items-center justify-end space-x-3 pt-2 font-mono">
            <button
              type="button"
              disabled={loading || success}
              onClick={handleSign}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-md cursor-pointer disabled:opacity-50"
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
