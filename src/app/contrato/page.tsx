'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  FileText,
  ShieldCheck,
  Download,
  PenTool,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Car,
  Calendar,
  CreditCard,
  Info,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { generateContractPDF, ContractPDFData } from '@/lib/pdf-contract';

export default function GeneradorContratoPage() {
  // Estado del Formulario
  const [formData, setFormData] = useState({
    contractCode: `GTR-${Math.floor(100000 + Math.random() * 900000)}`,
    // Propietario (Arrendador)
    ownerName: '',
    ownerDni: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerAddress: '',
    // Conductor (Arrendatario)
    travelerName: '',
    travelerDni: '',
    travelerEmail: '',
    travelerPhone: '',
    travelerDrivingLicense: '',
    // Vehículo
    carBrand: 'Porsche',
    carModel: '911 GT3 RS',
    carPlate: '',
    carYear: '2024',
    carHp: '525',
    pickupLocation: 'Madrid / La Moraleja',
    returnLocation: 'Madrid / La Moraleja',
    // Condiciones
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '10:00',
    returnDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    returnTime: '20:00',
    totalPrice: '2850',
    depositAmount: '3000',
    kmIncluded: '150',
    extraKmPrice: '3.50',
    // Inspección / Entrega
    odometer: '12400',
    fuelLevel: '100% Lleno',
    cleanliness: 'Excelente / Detailing',
    notes: 'Vehículo revisado sin desperfectos visibles en carrocería ni llantas.',
  });

  // Estado de Firmas
  const [activeSigner, setActiveSigner] = useState<'owner' | 'traveler'>('traveler');
  const [ownerSignature, setOwnerSignature] = useState<string | null>(null);
  const [travelerSignature, setTravelerSignature] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnCurrent, setHasDrawnCurrent] = useState(false);

  // Aceptaciones Legales
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [acceptedIntermediary, setAcceptedIntermediary] = useState(false);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Inicializar Canvas
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
  };

  useEffect(() => {
    setupCanvas();
  }, [activeSigner]);

  // Manejo de eventos táctiles y de ratón en el Canvas
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else if ('clientX' in e) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
    return { x: 0, y: 0 };
  };

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawnCurrent(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleStopDraw = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (activeSigner === 'traveler') {
      setTravelerSignature(dataUrl);
    } else {
      setOwnerSignature(dataUrl);
    }
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnCurrent(false);
    if (activeSigner === 'traveler') {
      setTravelerSignature(null);
    } else {
      setOwnerSignature(null);
    }
  };

  // Generación y Descarga del PDF Oficial
  const handleDownloadPDF = () => {
    if (!travelerSignature && !ownerSignature) {
      alert('Por favor, realiza al menos la firma de una de las partes con el dedo o ratón antes de descargar el contrato.');
      return;
    }

    try {
      const pdfData: ContractPDFData = {
        contractCode: formData.contractCode,
        date: new Date().toLocaleDateString('es-ES'),
        owner: {
          fullName: formData.ownerName || 'Parte Arrendadora (Propietario)',
          dni: formData.ownerDni || 'Verificado',
          email: formData.ownerEmail || 'contacto@propietario.es',
          phone: formData.ownerPhone || 'Teléfono verificado',
          address: formData.ownerAddress || 'España',
          signature: ownerSignature,
          signedAt: ownerSignature ? new Date().toLocaleString('es-ES') : null,
        },
        traveler: {
          fullName: formData.travelerName || 'Parte Arrendataria (Conductor)',
          dni: formData.travelerDni || 'Verificado',
          email: formData.travelerEmail || 'conductor@cliente.com',
          phone: formData.travelerPhone || 'Teléfono verificado',
          drivingLicense: formData.travelerDrivingLicense || 'Permiso B Válido',
          signature: travelerSignature,
          signedAt: travelerSignature ? new Date().toLocaleString('es-ES') : null,
        },
        vehicle: {
          brand: formData.carBrand,
          model: formData.carModel,
          plate: formData.carPlate || 'Sin Matrícula Especificada',
          year: formData.carYear,
          hp: formData.carHp,
          pickupLocation: formData.pickupLocation,
          returnLocation: formData.returnLocation,
        },
        rental: {
          pickupDate: formData.pickupDate,
          pickupTime: formData.pickupTime,
          returnDate: formData.returnDate,
          returnTime: formData.returnTime,
          totalAmount: formData.totalPrice || '0',
          depositAmount: formData.depositAmount || '0',
          includedKmPerDay: formData.kmIncluded,
          extraKmPrice: formData.extraKmPrice,
        },
        inspection: {
          odometer: formData.odometer,
          fuelLevel: formData.fuelLevel,
          cleanliness: formData.cleanliness,
          notes: formData.notes,
        },
      };

      const doc = generateContractPDF(pdfData);
      doc.save(`Contrato_${formData.contractCode}_${formData.carBrand}_${formData.carModel}.pdf`);
    } catch (err: any) {
      console.error('Error generando contrato:', err);
      alert('Hubo un error al generar el PDF: ' + (err?.message || 'Error desconocido'));
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white flex flex-col">
      <Navbar />

      {/* CABECERA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-600 font-bold">
              GENERADOR JURÍDICO DIGITAL // VALIDEZ eIDAS UE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black font-sans">
            Generador de Contrato Digital
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-mono max-w-3xl leading-relaxed">
            Acuerdo privado de arrendamiento directo entre particulares. Rellena los datos, firma cómodamente con el dedo desde tu dispositivo móvil y descarga el contrato oficial en PDF de alta resolución.
          </p>

          {/* BADGE INTERMEDIARIO CLARO */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block uppercase tracking-wider text-[11px]">
                Aviso de Intermediación Tecnológica:
              </strong>
              <p className="text-xs text-amber-800 font-sans mt-0.5 leading-relaxed">
                Este contrato vincula exclusivamente a las dos partes particulares (Arrendador y Arrendatario). <strong>GTR Cars actúa únicamente como plataforma tecnológica intermediaria</strong> facilitadora del canal, la custodia documental y el soporte de firma digital, sin asumir responsabilidad sobre el vehículo, seguro, custodia o fianza acordada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO Y SUITE DE FIRMA */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* BLOQUE 1: PARTES CONTRATANTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ARRENDADOR (PROPIETARIO) */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <UserCheck className="w-5 h-5 text-black" />
              <h2 className="font-black text-sm uppercase tracking-wider font-mono text-black">
                1. Datos del Propietario (Arrendador)
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Nombre Completo o Razón Social *</label>
                <input
                  type="text"
                  placeholder="Ej: Carlos Mendoza Santana"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-sans font-bold focus:border-black outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">DNI / NIE / CIF *</label>
                  <input
                    type="text"
                    placeholder="12345678Z"
                    value={formData.ownerDni}
                    onChange={(e) => setFormData({ ...formData, ownerDni: e.target.value })}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Teléfono Móvil *</label>
                  <input
                    type="tel"
                    placeholder="+34 600 000 000"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email de Contacto *</label>
                <input
                  type="email"
                  placeholder="propietario@email.com"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Domicilio / Residencia</label>
                <input
                  type="text"
                  placeholder="Calle, Ciudad, Provincia"
                  value={formData.ownerAddress}
                  onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                />
              </div>
            </div>
          </div>

          {/* ARRENDATARIO (CONDUCTOR) */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <UserCheck className="w-5 h-5 text-black" />
              <h2 className="font-black text-sm uppercase tracking-wider font-mono text-black">
                2. Datos del Conductor (Arrendatario)
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Nombre Completo del Conductor *</label>
                <input
                  type="text"
                  placeholder="Ej: Alejandro González Ramos"
                  value={formData.travelerName}
                  onChange={(e) => setFormData({ ...formData, travelerName: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-sans font-bold focus:border-black outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">DNI / Pasaporte *</label>
                  <input
                    type="text"
                    placeholder="87654321X"
                    value={formData.travelerDni}
                    onChange={(e) => setFormData({ ...formData, travelerDni: e.target.value })}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Teléfono Móvil *</label>
                  <input
                    type="tel"
                    placeholder="+34 611 111 111"
                    value={formData.travelerPhone}
                    onChange={(e) => setFormData({ ...formData, travelerPhone: e.target.value })}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email *</label>
                  <input
                    type="email"
                    placeholder="conductor@email.com"
                    value={formData.travelerEmail}
                    onChange={(e) => setFormData({ ...formData, travelerEmail: e.target.value })}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Permiso Conducir B *</label>
                  <input
                    type="text"
                    placeholder="Nº Licencia / Válido"
                    value={formData.travelerDrivingLicense}
                    onChange={(e) => setFormData({ ...formData, travelerDrivingLicense: e.target.value })}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Referencia del Contrato</label>
                <input
                  type="text"
                  disabled
                  value={formData.contractCode}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE 2: VEHÍCULO Y CONDICIONES ECONÓMICAS */}
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
            <Car className="w-5 h-5 text-black" />
            <h2 className="font-black text-sm uppercase tracking-wider font-mono text-black">
              3. Especificaciones del Superdeportivo & Tarifas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Marca</label>
              <input
                type="text"
                value={formData.carBrand}
                onChange={(e) => setFormData({ ...formData, carBrand: e.target.value })}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-bold focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Modelo Completo</label>
              <input
                type="text"
                value={formData.carModel}
                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-bold focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Matrícula</label>
              <input
                type="text"
                placeholder="Ej: 1234-XYZ"
                value={formData.carPlate}
                onChange={(e) => setFormData({ ...formData, carPlate: e.target.value })}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-bold focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Potencia (CV) / Año</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="CV"
                  value={formData.carHp}
                  onChange={(e) => setFormData({ ...formData, carHp: e.target.value })}
                  className="p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                />
                <input
                  type="text"
                  placeholder="Año"
                  value={formData.carYear}
                  onChange={(e) => setFormData({ ...formData, carYear: e.target.value })}
                  className="p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Fecha & Hora Recogida</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  className="p-3 bg-white border border-gray-300 rounded-xl text-black text-[11px] focus:border-black outline-none"
                />
                <input
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                  className="p-3 bg-white border border-gray-300 rounded-xl text-black text-[11px] focus:border-black outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Fecha & Hora Devolución</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className="p-3 bg-white border border-gray-300 rounded-xl text-black text-[11px] focus:border-black outline-none"
                />
                <input
                  type="time"
                  value={formData.returnTime}
                  onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                  className="p-3 bg-white border border-gray-300 rounded-xl text-black text-[11px] focus:border-black outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Precio Total (€)</label>
              <input
                type="number"
                value={formData.totalPrice}
                onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-bold focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Fianza en Garantía (€)</label>
              <input
                type="number"
                value={formData.depositAmount}
                onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black font-bold focus:border-black outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Lugar de Entrega / Base VIP</label>
              <input
                type="text"
                placeholder="Ej: Aeropuerto de Gran Canaria (LPA) / Terminal VIP"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Límite Km / Exceso (€/km)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Km diarios (ej: 150)"
                  value={formData.kmIncluded}
                  onChange={(e) => setFormData({ ...formData, kmIncluded: e.target.value })}
                  className="p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                />
                <input
                  type="text"
                  placeholder="€ por km extra (ej: 3.50)"
                  value={formData.extraKmPrice}
                  onChange={(e) => setFormData({ ...formData, extraKmPrice: e.target.value })}
                  className="p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE 3: INSPECCIÓN DE ENTREGA */}
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <ClipboardList className="w-5 h-5 text-black" />
            <h2 className="font-black text-sm uppercase tracking-wider font-mono text-black">
              4. Acta de Comprobación y Telemetría de Entrega
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Odómetro Inicial (km)</label>
              <input
                type="text"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Nivel de Carburante</label>
              <input
                type="text"
                value={formData.fuelLevel}
                onChange={(e) => setFormData({ ...formData, fuelLevel: e.target.value })}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Estado de Limpieza</label>
              <input
                type="text"
                value={formData.cleanliness}
                onChange={(e) => setFormData({ ...formData, cleanliness: e.target.value })}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Observaciones / Desperfectos previos</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-black focus:border-black outline-none font-sans"
              />
            </div>
          </div>
        </div>

        {/* BLOQUE 4: FIRMA DIGITAL CON EL DEDO (TOUCH-OPTIMIZED CANVAS) */}
        <div className="bg-gray-50 border-2 border-black rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>eIDAS Compliance · Pantalla Táctil Móvil Habilitada</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-sans">
                5. Firma Digital con el Dedo o Ratón
              </h2>
            </div>

            {/* SELECTOR DE QUIÉN FIRMA */}
            <div className="flex items-center bg-gray-200 p-1 rounded-2xl font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveSigner('traveler');
                  handleClearSignature();
                }}
                className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  activeSigner === 'traveler'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                Firma Conductor
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSigner('owner');
                  handleClearSignature();
                }}
                className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  activeSigner === 'owner'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                Firma Propietario
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-gray-800 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-black" />
                Dibuja la firma del {activeSigner === 'traveler' ? 'Conductor / Arrendatario' : 'Propietario / Arrendador'}:
              </span>
              <button
                type="button"
                onClick={handleClearSignature}
                className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Borrar trazo
              </button>
            </div>

            {/* CANVAS INTERACTIVO CON TOUCH-NONE */}
            <div className="relative border-2 border-dashed border-gray-300 hover:border-black transition-colors rounded-2xl bg-white overflow-hidden shadow-inner touch-none">
              <canvas
                ref={canvasRef}
                width={800}
                height={220}
                onMouseDown={handleStartDraw}
                onMouseMove={handleDraw}
                onMouseUp={handleStopDraw}
                onMouseLeave={handleStopDraw}
                onTouchStart={handleStartDraw}
                onTouchMove={handleDraw}
                onTouchEnd={handleStopDraw}
                className="w-full h-44 sm:h-52 cursor-crosshair touch-none select-none block"
              />
              <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] font-mono text-gray-400">
                Arrastra tu dedo o ratón dentro del recuadro
              </div>
            </div>

            {/* ESTADO DE FIRMAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                travelerSignature ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-gray-200 text-gray-500'
              }`}>
                <span className="font-bold">Firma del Conductor:</span>
                <span className="text-[10px] uppercase font-black">
                  {travelerSignature ? '✓ Registrada con éxito' : 'Pendiente'}
                </span>
              </div>

              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                ownerSignature ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-gray-200 text-gray-500'
              }`}>
                <span className="font-bold">Firma del Propietario:</span>
                <span className="text-[10px] uppercase font-black">
                  {ownerSignature ? '✓ Registrada con éxito' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>

          {/* CASILLAS DE CONSENTIMIENTO */}
          <div className="space-y-3 pt-4 border-t border-gray-200 font-sans text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedLegal}
                onChange={(e) => setAcceptedLegal(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span className="text-gray-700 leading-snug">
                Declaramos que todos los datos consignados son verídicos, conocemos las especificaciones de potencia del superdeportivo y otorgamos plena validez legal a las firmas manuscritas electrónicas emitidas.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedIntermediary}
                onChange={(e) => setAcceptedIntermediary(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span className="text-gray-700 leading-snug">
                <strong>Reconocemos expresamente que GTR Cars actúa únicamente como intermediario tecnológico</strong> y que la responsabilidad material, contractual, fianza y seguro corresponde exclusivamente a las partes firmantes del presente acuerdo privado.
              </span>
            </label>
          </div>

          {/* BOTÓN PRINCIPAL DE DESCARGA PDF */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-mono">
              El PDF incluirá todas las cláusulas oficiales, datos de ambas partes, especificaciones y las firmas registradas.
            </p>

            <button
              type="button"
              disabled={!acceptedLegal || !acceptedIntermediary}
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>DESCARGAR CONTRATO PDF (OFICIAL)</span>
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
