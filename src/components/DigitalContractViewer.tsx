'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  CheckCircle2,
  Printer,
  Download,
  PenTool,
  ShieldCheck,
  Calendar,
  User,
  Car,
  DollarSign,
  AlertTriangle,
  Lock,
  X,
} from 'lucide-react';

interface ContractViewerProps {
  booking: any;
  viewerRole: 'TRAVELER' | 'OWNER' | 'ADMIN';
  onSigned?: () => void;
}

export default function DigitalContractViewer({
  booking,
  viewerRole,
  onSigned,
}: ContractViewerProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'sign'>('view');
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

  return (
    <div className="bg-white rounded-3xl border border-[#E9E1D2] shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* CABECERA Y ESTADO DE LAS FIRMAS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D2]">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#16B8AA] mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Validez Jurídica eIDAS UE 910/2014</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#13322E] tracking-tight">
            Contrato Digital de Alquiler de Vehículo Camper
          </h2>
          <p className="text-xs text-[#6B726E] font-medium mt-1">
            Código de reserva: <strong className="text-[#16B8AA] font-mono">{booking.code}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-[#E9E1D2] bg-[#FAF7F0] text-xs font-bold text-[#13322E] hover:bg-[#13322E] hover:text-white transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* TARJETAS DE ESTADO DE FIRMAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ESTADO VIAJERO */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            travelerSigned
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider">Firma del Viajero</span>
            {travelerSigned ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[9px] font-black uppercase">
                ✅ FIRMADO
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[9px] font-black uppercase">
                ⏳ PENDIENTE
              </span>
            )}
          </div>
          <p className="text-xs font-bold mt-2">
            {booking.traveler?.firstName} {booking.traveler?.lastName}
          </p>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            {travelerSigned ? `Firmado digitalmente el ${contract.signedAtTraveler ? dateFormatted(contract.signedAtTraveler) : 'fecha registrada'}` : 'Pendiente de aceptar y firmar'}
          </p>
        </div>

        {/* ESTADO PROPIETARIO */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            ownerSigned
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider">Firma del Propietario</span>
            {ownerSigned ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[9px] font-black uppercase">
                ✅ FIRMADO
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[9px] font-black uppercase">
                ⏳ PENDIENTE
              </span>
            )}
          </div>
          <p className="text-xs font-bold mt-2">
            {booking.owner?.firstName} {booking.owner?.lastName}
          </p>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            {ownerSigned ? `Firmado digitalmente el ${contract.signedAtOwner ? dateFormatted(contract.signedAtOwner) : 'fecha registrada'}` : 'Pendiente de aceptar y firmar'}
          </p>
        </div>
      </div>

      {/* PESTAÑAS: LEER CONTRATO / FIRMAR */}
      <div className="flex border-b border-[#E9E1D2]">
        <button
          onClick={() => setActiveTab('view')}
          className={`py-3 px-6 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'view'
              ? 'border-[#16B8AA] text-[#16B8AA]'
              : 'border-transparent text-[#6B726E] hover:text-[#13322E]'
          }`}
        >
          Documento Completo del Contrato
        </button>
        {!mySignatureDone && (
          <button
            onClick={() => setActiveTab('sign')}
            className={`py-3 px-6 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'sign'
                ? 'border-[#16B8AA] text-[#16B8AA]'
                : 'border-transparent text-[#6B726E] hover:text-[#13322E]'
            }`}
          >
            ✍️ Firmar Contrato Ahora ({viewerRole === 'OWNER' ? 'Propietario' : 'Viajero'})
          </button>
        )}
      </div>

      {/* VISTA 1: TEXTO OFICIAL DEL CONTRATO (IMPRIMIBLE) */}
      {activeTab === 'view' && (
        <div className="space-y-6 printable-contract">
          <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#E9E1D2] font-sans text-xs text-[#13322E] space-y-6 leading-relaxed max-h-[500px] overflow-y-auto">
            
            {/* ENCABEZADO FORMAL DEL DOCUMENTO */}
            <div className="text-center border-b border-[#E9E1D2] pb-6 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#16B8AA]">
                CONTRATO DE ARRENDAMIENTO DE VEHÍCULO SIN CONDUCTOR
              </span>
              <h3 className="text-xl font-bold text-[#13322E]">
                CONTRATO PARTICULAR DE ALQUILER DE FURGONETA CAMPER / AUTOCARAVANA
              </h3>
              <p className="text-[11px] text-[#6B726E]">
                Expedido y registrado electrónicamente en la plataforma Vaneando (Canarias, España)
              </p>
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
                  El precio total del alquiler asciende a <strong>{booking.totalAmount} €</strong>. La fianza fijada en <strong>{booking.depositAmount} €</strong> se bloquea temporalmente en custodia segura de Stripe sin abonarse al propietario. La fianza responde de daños menores, falta de combustible, limpieza deficiente o kilometraje excedido. La transferencia del saldo neto al propietario se realiza en un plazo de 7 días hábiles tras finalizar el viaje.
                </p>
              </div>

              <div>
                <strong className="block text-[#13322E] mb-1">TERCERA. Kilometraje y combustible.</strong>
                <p className="text-[#52605B]">
                  Se incluye un límite de <strong>{booking.vehicle?.includedKmPerDay || 0} km/día</strong>. El exceso se abonará a razón de <strong>{booking.vehicle?.extraKmPrice || 0} € por km adicional</strong>. El vehículo se devolverá con el mismo nivel de combustible acreditado en el Check-in digital.
                </p>
              </div>

              <div>
                <strong className="block text-[#13322E] mb-1">CUARTA. Inspección y Actas Digitales.</strong>
                <p className="text-[#52605B]">
                  Ambas partes se obligan a cumplimentar las Actas Digitales de Check-in (entrega) y Check-out (devolución) registrando fotografías del estado exterior, interior, panel de mando e inventario de accesorios.
                </p>
              </div>

              <div>
                <strong className="block text-[#13322E] mb-1">QUINTA. Ley aplicable y firma eIDAS.</strong>
                <p className="text-[#52605B]">
                  Este contrato se rige por la Ley 16/1987 de Ordenación de Transportes Terrestres y el Código Civil español. Las firmas electrónicas quedan registradas con sello temporal, IP y hash criptográfico con plena validez legal conforme al Reglamento eIDAS (UE Nº 910/2014).
                </p>
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

      {/* VISTA 2: FORMULARIO DE FIRMA DIGITAL CON CANVAS Y CHECKBOXES */}
      {activeTab === 'sign' && !mySignatureDone && (
        <div className="space-y-6 bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#E9E1D2]">
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#13322E]">
              Proceso de Firma Electrónica como {viewerRole === 'OWNER' ? 'Propietario' : 'Viajero'}
            </h3>
            <p className="text-xs text-[#6B726E] font-medium">
              Por favor, confirma las cláusulas del alquiler y realiza tu firma a continuación.
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
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#16B8AA] focus:ring-[#16B8AA]"
              />
              <span className="text-xs font-medium text-[#13322E]">
                He leído y acepto íntegramente las cláusulas del Contrato Digital de Alquiler y las normas del vehículo.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.deposit}
                onChange={(e) => setChecks({ ...checks, deposit: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#16B8AA] focus:ring-[#16B8AA]"
              />
              <span className="text-xs font-medium text-[#13322E]">
                Comprendo la retención de la fianza de <strong>{booking.depositAmount} €</strong> y las condiciones de liquidación en 7 días hábiles tras finalizar el viaje.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.truthful}
                onChange={(e) => setChecks({ ...checks, truthful: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#16B8AA] focus:ring-[#16B8AA]"
              />
              <span className="text-xs font-medium text-[#13322E]">
                Declaro bajo mi responsabilidad que la información proporcionada y la documentación son veraces y en regla.
              </span>
            </label>
          </div>

          {/* MÉTODOS DE FIRMA: DIBUJAR O ESCRIBIR */}
          <div className="bg-white p-5 rounded-2xl border border-[#E9E1D2] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E1D2] pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#13322E]">
                Elige tu método de firma
              </span>
              <div className="flex items-center space-x-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSignatureType('type')}
                  className={`px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                    signatureType === 'type'
                      ? 'bg-[#13322E] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Nombre Completo
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureType('draw')}
                  className={`px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                    signatureType === 'draw'
                      ? 'bg-[#13322E] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Dibujar en Pantalla
                </button>
              </div>
            </div>

            {signatureType === 'type' ? (
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  Escribe tu Nombre y Apellidos completos como firma jurídica
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder={
                    viewerRole === 'OWNER'
                      ? `${booking.owner?.firstName || ''} ${booking.owner?.lastName || ''}`
                      : `${booking.traveler?.firstName || ''} ${booking.traveler?.lastName || ''}`
                  }
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-base font-serif font-bold focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black uppercase text-slate-500">
                    Dibuja tu firma con el ratón o con el dedo en móvil
                  </label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Borrar y repetir
                  </button>
                </div>
                <div className="border-2 border-dashed border-[#16B8AA]/40 rounded-2xl bg-slate-50 p-2 overflow-hidden touch-none">
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-40 bg-white rounded-xl cursor-crosshair"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSign}
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#13322E] hover:bg-[#254842] text-white text-xs font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <PenTool className="w-4 h-4 text-[#16B8AA]" />
            <span>{loading ? 'Registrando firma...' : `Firmar Contrato como ${viewerRole === 'OWNER' ? 'Propietario' : 'Viajero'}`}</span>
          </button>
        </div>
      )}

    </div>
  );
}
