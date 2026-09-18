'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Car,
  Compass,
} from 'lucide-react';
import { analytics } from '@/lib/analytics';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tipo de cuenta: 'TRAVELER' (Piloto de alquiler) o 'OWNER' (Propietario de vehículos)
  const initialRoleParam = searchParams.get('rol') || searchParams.get('tipo') || searchParams.get('role');
  const [role, setRole] = useState<'TRAVELER' | 'OWNER'>(
    initialRoleParam === 'propietario' || initialRoleParam === 'OWNER' ? 'OWNER' : 'TRAVELER'
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    analytics.track(role === 'OWNER' ? 'owner_registration_start' : 'registration_start');
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones del servicio.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al registrar la cuenta.');
      }

      analytics.track(role === 'OWNER' ? 'owner_registration_success' : 'registration_success');
      analytics.conversion('conversion', { conversion_type: 'registration' });

      // Redirigir según el tipo de cuenta creada
      if (role === 'OWNER') {
        window.location.href = '/propietario?bienvenido=true';
      } else {
        // Si tenía una reserva pendiente en sessionStorage, continuar con ella
        if (typeof window !== 'undefined') {
          const pendingStr = sessionStorage.getItem('pending_booking');
          if (pendingStr) {
            try {
              const pending = JSON.parse(pendingStr);
              sessionStorage.removeItem('pending_booking');
              const bookRes = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pending),
              });
              const bookData = await bookRes.json();
              if (bookRes.ok && bookData?.booking?.id) {
                window.location.href = `/reserva/${bookData.booking.id}`;
                return;
              }
            } catch (err) {
              console.error('Error auto-procesando reserva:', err);
            }
          }
        }
        window.location.href = '/cuenta?bienvenido=true';
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const openLoginModal = () => {
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-8 font-sans">
      {/* CABECERA */}
      <div className="text-center space-y-3 border-b border-gray-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-black text-[10px] font-mono tracking-widest uppercase font-bold">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          GTR CARS // REGISTRO OFICIAL
        </div>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black font-sans">
          Crear Nueva Cuenta
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-mono">
          Selecciona cómo deseas operar en la plataforma peer-to-peer de vehículos exclusivos
        </p>
      </div>

      {/* SELECTOR VISUAL DE ROL: PROPIETARIO VS PILOTO */}
      <div className="space-y-3 font-mono">
        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-600">
          Tipo de Cuenta
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* OPCIÓN 1: PILOTO DE ALQUILER */}
          <button
            type="button"
            onClick={() => {
              setRole('TRAVELER');
              setError('');
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              role === 'TRAVELER'
                ? 'border-black bg-gray-50 text-black ring-1 ring-black shadow-sm'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-black'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${role === 'TRAVELER' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Compass className="w-5 h-5" />
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${role === 'TRAVELER' ? 'bg-black' : 'bg-gray-200'}`} />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-black">
                Piloto de Alquiler
              </span>
              <span className="block text-[11px] text-gray-500 mt-1 font-sans">
                Para alquilar y conducir superdeportivos, firmar contratos digitales y gestionar reservas VIP.
              </span>
            </div>
          </button>

          {/* OPCIÓN 2: PROPIETARIO */}
          <button
            type="button"
            onClick={() => {
              setRole('OWNER');
              setError('');
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              role === 'OWNER'
                ? 'border-black bg-gray-50 text-black ring-1 ring-black shadow-sm'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-black'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${role === 'OWNER' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Car className="w-5 h-5" />
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${role === 'OWNER' ? 'bg-black' : 'bg-gray-200'}`} />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-black">
                Propietario
              </span>
              <span className="block text-[11px] text-gray-500 mt-1 font-sans">
                Para anunciar tu vehículo, gestionar calendario, establecer precios y recibir pagos directos.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* BENEFICIOS DEL ROL SELECCIONADO */}
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 font-mono text-xs text-gray-700 space-y-2">
        <div className="flex items-center gap-2 font-bold uppercase text-black text-[11px]">
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>{role === 'OWNER' ? 'Garantías para Propietarios' : 'Ventajas para Pilotos VIP'}</span>
        </div>
        <ul className="space-y-1.5 text-[11px] text-gray-600 font-sans">
          {role === 'OWNER' ? (
            <>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                <span>0% de comisión: cobras el 100% íntegro de la tarifa que fijes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Fianza y depósito retenido por seguridad antes de la entrega</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Generador automático de contratos de arrendamiento con firma en pantalla</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Acceso directo a la flota más exclusiva sin intermediarios opacos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Contrato digital legal descargable en PDF al instante</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Soporte prioritario y entrega personalizada en bases VIP</span>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-mono border border-red-200 flex items-start space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* FORMULARIO DE REGISTRO */}
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Carlos"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm font-sans text-black focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 mb-1">
              Apellidos
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Mendoza"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm font-sans text-black focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            placeholder="tu.email@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm font-sans text-black focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 mb-1">
            Contraseña (Mínimo 8 caracteres)
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm font-sans text-black focus:outline-none focus:border-black"
          />
        </div>

        {/* TÉRMINOS Y CONDICIONES */}
        <label className="flex items-start space-x-3 pt-1 text-[11px] font-sans text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 accent-black text-black"
          />
          <span>
            Acepto los{' '}
            <Link href="/terminos" className="text-black font-bold underline hover:text-gray-600">
              términos de servicio
            </Link>{' '}
            y la{' '}
            <Link href="/privacidad" className="text-black font-bold underline hover:text-gray-600">
              política de privacidad
            </Link>{' '}
            de GTR Cars.
          </span>
        </label>

        {/* BOTÓN SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
        >
          <span>
            {loading
              ? 'CREANDO CUENTA...'
              : role === 'OWNER'
              ? 'REGISTRARME COMO PROPIETARIO'
              : 'REGISTRARME COMO PILOTO VIP'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* ENLACE PARA INICIAR SESIÓN */}
      <div className="text-center pt-2 font-mono text-xs text-gray-500 border-t border-gray-100">
        ¿Ya tienes una cuenta registrada?{' '}
        <button
          type="button"
          onClick={openLoginModal}
          className="font-bold text-black hover:underline cursor-pointer ml-1"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col selection:bg-black selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 sm:py-16 w-full flex items-center justify-center">
        <Suspense fallback={<div className="font-mono text-xs text-center">Cargando formulario de registro...</div>}>
          <RegisterFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
