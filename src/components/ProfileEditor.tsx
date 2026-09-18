'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  Save, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  FileCheck, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Gauge,
  KeyRound,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function ProfileEditor({ user }: { user: any }) {
  const [current, setCurrent] = useState(user);
  const [preview, setPreview] = useState(user.avatarUrl || '/default-avatar.svg');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isOwner = user.role === 'OWNER';
  const isVerified = user.verification === 'VERIFIED';
  const isPendingVerification = user.verification === 'PENDING';

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMessage('');

    try {
      const form = new FormData();
      form.set('firstName', current.firstName || '');
      form.set('lastName', current.lastName || '');
      form.set('phone', current.phone || '');
      form.set('address', current.address || '');
      if (isOwner) {
        form.set('iban', current.iban || '');
        form.set('bankHolder', current.bankHolder || '');
      }
      if (file) form.set('avatar', file);

      const response = await fetch('/api/profile', { method: 'POST', body: form });
      const data = await response.json();

      if (response.ok) {
        setMessage('Perfil actualizado con éxito');
        setCurrent({ ...current, ...data.user });
      } else {
        setErrorMessage(data.error || 'No se pudieron guardar los cambios');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* FORMULARIO PRINCIPAL MINIMALISTA */}
      <form onSubmit={submit} className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-xs">
        {/* CABECERA RESUMEN DE USUARIO */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-gray-100">
          <label className="group relative mx-auto h-28 w-28 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-gray-50 border border-gray-200 hover:border-black transition-all shadow-xs sm:mx-0">
            <img
              src={preview || '/default-avatar.svg'}
              alt="Avatar"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.svg';
              }}
            />
            <span className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100 text-white">
              <Camera className="h-5 w-5 mb-1" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Cambiar</span>
            </span>
            <input
              type="file"
              accept="image/*,.heic,.heif"
              className="hidden"
              onChange={(event) => {
                const selected = event.target.files?.[0];
                if (selected) {
                  setFile(selected);
                  setPreview(URL.createObjectURL(selected));
                }
              }}
            />
          </label>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-black text-[10px] font-mono font-black uppercase tracking-widest mb-2">
              {isOwner ? (
                <>
                  <KeyRound className="w-3 h-3 text-black" />
                  <span>Propietario de Superdeportivos</span>
                </>
              ) : (
                <>
                  <Gauge className="w-3 h-3 text-black" />
                  <span>Piloto VIP Certificado</span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-black text-black uppercase tracking-tight font-sans">
              {current.firstName} {current.lastName}
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{current.email}</p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Identidad Verificada</span>
              </span>
            ) : isPendingVerification ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Verificación en Revisión</span>
              </span>
            ) : (
              <Link
                href="/verificacion"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-mono font-bold transition-all shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verificar Identidad</span>
              </Link>
            )}
          </div>
        </div>

        {/* SECCIÓN DE DATOS PERSONALES */}
        <div className="py-8 border-b border-gray-100">
          <h3 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
            <span>01. Información Personal</span>
          </h3>

          <div className="grid gap-5 sm:grid-cols-2 font-mono">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">
              Nombre
              <input
                required
                value={current.firstName || ''}
                onChange={(e) => setCurrent({ ...current, firstName: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-sans text-black focus:bg-white focus:border-black focus:outline-none transition-all"
              />
            </label>

            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">
              Apellidos
              <input
                required
                value={current.lastName || ''}
                onChange={(e) => setCurrent({ ...current, lastName: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-sans text-black focus:bg-white focus:border-black focus:outline-none transition-all"
              />
            </label>

            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">
              Teléfono Directo
              <div className="relative mt-2">
                <input
                  value={current.phone || ''}
                  onChange={(e) => setCurrent({ ...current, phone: e.target.value })}
                  placeholder="+34 600 000 000"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-sans text-black placeholder:text-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                />
              </div>
            </label>

            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">
              Correo Electrónico
              <div className="relative mt-2">
                <input
                  disabled
                  value={current.email || ''}
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm font-sans text-gray-500 cursor-not-allowed"
                />
                <span className="absolute right-3 top-3 text-[10px] text-gray-400 font-mono">Protegido</span>
              </div>
            </label>

            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block sm:col-span-2">
              Ciudad / Residencia Fiscal
              <input
                value={current.address || ''}
                onChange={(e) => setCurrent({ ...current, address: e.target.value })}
                placeholder="Ej. Madrid / Santa Cruz de Tenerife / Barcelona"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-sans text-black placeholder:text-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
              />
            </label>
          </div>
        </div>

        {/* SECCIÓN ESPECÍFICA PARA PROPIETARIO: DATOS DE COBRO Y TRANSFERENCIA */}
        {isOwner ? (
          <div className="py-8 border-b border-gray-100">
            <h3 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-black" />
              <span>02. Liquidaciones y Cuenta Bancaria (SEPA)</span>
            </h3>
            <p className="text-xs text-gray-500 font-sans mb-5">
              Tus ingresos por cada alquiler completado se transfieren automáticamente a esta cuenta sin comisiones de intermediación.
            </p>

            <div className="grid gap-5 sm:grid-cols-2 font-mono">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">
                Titular de la Cuenta
                <input
                  value={current.bankHolder || ''}
                  onChange={(e) => setCurrent({ ...current, bankHolder: e.target.value })}
                  placeholder="Nombre o Razón Social exacta"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-sans text-black placeholder:text-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                />
              </label>

              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">
                Código IBAN
                <input
                  value={current.iban || ''}
                  onChange={(e) => setCurrent({ ...current, iban: e.target.value })}
                  placeholder="ES00 0000 0000 0000 0000 0000"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-sans text-black uppercase placeholder:text-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                />
              </label>
            </div>
          </div>
        ) : (
          /* SECCIÓN ESPECÍFICA PARA PILOTO VIP: LICENCIA DE CONDUCCIÓN Y SEGURO */
          <div className="py-8 border-b border-gray-100">
            <h3 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-black" />
              <span>02. Credenciales y Permiso de Conducir</span>
            </h3>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-black font-sans">
                  Permiso Clase B (Vigor para Superdeportivos)
                </p>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  {isVerified
                    ? 'Tu permiso de conducir está validado para entrega inmediata sin fianza adicional.'
                    : 'Sube tu documento y permiso de conducir para desbloquear la reserva exprés.'}
                </p>
              </div>
              <Link
                href="/verificacion"
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-black text-xs font-mono font-bold hover:border-black transition-all shrink-0 inline-flex items-center gap-1.5"
              >
                <span>{isVerified ? 'Ver Documentos' : 'Completar Verificación'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* FEEDBACK DE ESTADO */}
        {message && (
          <p className="mt-5 flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {message}
          </p>
        )}

        {errorMessage && (
          <p className="mt-5 flex items-center gap-2 text-xs font-mono font-bold text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMessage}
          </p>
        )}

        {/* BOTÓN GUARDAR MINIMALISTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-xs text-gray-400 font-mono">
            Tus datos se encuentran encriptados según estándar de la plataforma.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 text-xs font-mono font-black uppercase tracking-widest text-white hover:bg-neutral-800 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Guardando...' : 'Guardar Perfil'}
          </button>
        </div>
      </form>

      {/* ACCESOS RÁPIDOS ADICIONALES MINIMALISTAS SEGÚN ROL */}
      <div className="grid gap-4 sm:grid-cols-2 font-mono">
        {isOwner ? (
          <>
            <Link
              href="/propietario"
              className="group p-5 rounded-2xl border border-gray-200 bg-white hover:border-black transition-all flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-black">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black font-sans">Garaje & Vehículos</h4>
                  <p className="text-xs text-gray-500 font-sans">Gestiona tu flota y tarifas por día</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
            </Link>

            <Link
              href="/publicar-coche"
              className="group p-5 rounded-2xl border border-gray-200 bg-white hover:border-black transition-all flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black font-sans">+ Añadir Superdeportivo</h4>
                  <p className="text-xs text-gray-500 font-sans">Publica un nuevo vehículo en el catálogo</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/cuenta"
              className="group p-5 rounded-2xl border border-gray-200 bg-white hover:border-black transition-all flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-black">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black font-sans">Mis Reservas Activas</h4>
                  <p className="text-xs text-gray-500 font-sans">Consulta tus experiencias y vehículos contratados</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
            </Link>

            <Link
              href="/buscar"
              className="group p-5 rounded-2xl border border-gray-200 bg-white hover:border-black transition-all flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black font-sans">Explorar Catálogo</h4>
                  <p className="text-xs text-gray-500 font-sans">Ferrari, Porsche, McLaren y Lamborghini</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
