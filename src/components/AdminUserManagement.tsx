'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Users,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  RefreshCw,
  X,
  Lock,
  Phone,
  Mail,
  Car,
  Calendar,
  KeyRound,
  Image as ImageIcon,
  BadgeAlert,
  Upload,
  Camera,
  RotateCcw,
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: 'TRAVELER' | 'OWNER' | 'ADMIN';
  verification: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  _count?: {
    vehicles: number;
    bookingsAsTraveler: number;
    bookingsAsOwner: number;
  };
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedVerification, setSelectedVerification] = useState<string>('ALL');
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    travelersCount: 0,
    ownersCount: 0,
    verifiedCount: 0,
  });

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'TRAVELER' as 'TRAVELER' | 'OWNER' | 'ADMIN',
    verification: 'UNVERIFIED' as 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED',
    avatarUrl: '',
    newPassword: '',
    iban: '',
    bankHolder: '',
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (selectedRole !== 'ALL') params.set('role', selectedRole);
      if (selectedVerification !== 'ALL') params.set('verification', selectedVerification);

      const res = await fetch(`/api/admin/users?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar usuarios');

      setUsers(data.users || []);
      if (data.metrics) setMetrics(data.metrics);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error al cargar la lista de usuarios' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedRole, selectedVerification]);

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role,
      verification: user.verification,
      avatarUrl: user.avatarUrl || '/default-avatar.svg',
      newPassword: '',
      iban: '',
      bankHolder: '',
    });
    setModalFeedback(null);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setModalFeedback(null);
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setModalFeedback(null);

    try {
      const formData = new FormData();
      formData.set('avatar', file);

      const res = await fetch('/api/admin/users/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir la imagen');

      setEditForm((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
      setModalFeedback({ type: 'success', message: 'Foto cargada correctamente. Pulsa «Guardar Cambios» para confirmar.' });
    } catch (err: any) {
      setModalFeedback({ type: 'error', message: err.message || 'No se pudo subir la foto' });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setProcessingId(editingUser.id);
    setModalFeedback(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          phone: editForm.phone,
          role: editForm.role,
          verification: editForm.verification,
          avatarUrl: editForm.avatarUrl,
          newPassword: editForm.newPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo actualizar el perfil');

      // Actualizar estado local de usuarios de inmediato
      if (data.user) {
        setUsers((prev) =>
          prev.map((u) => (u.id === data.user.id ? { ...u, ...data.user } : u))
        );
      }

      setFeedback({ type: 'success', message: data.message || 'Perfil actualizado con éxito' });
      closeEditModal();
      await loadUsers();
    } catch (err: any) {
      setModalFeedback({ type: 'error', message: err.message || 'Error al guardar cambios' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la cuenta de ${user.firstName} ${user.lastName} (${user.email})? Esta acción no se puede deshacer.`)) {
      return;
    }

    setProcessingId(user.id);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo eliminar la cuenta');

      setFeedback({ type: 'success', message: data.message || 'Cuenta eliminada con éxito' });
      await loadUsers();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error al eliminar usuario' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-sm mb-10">
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E9E1D2] pb-5 mb-6 gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#16B8AA]">
            Base de Usuarios & Clientes
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#13322E]">Gestión de Perfiles y Clientes</h2>
          <p className="text-xs text-[#6B726E] mt-0.5 font-medium">
            Edita datos personales, sube fotos de perfil, corrige emails, cambia contraseñas o actualiza estados de verificación directamente.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center space-x-2 rounded-full border border-[#E9E1D2] px-4 py-2 text-xs font-bold text-[#13322E] hover:bg-[#FAF7F0] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-[#16B8AA] ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* METRICAS DE USUARIOS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E9E1D2]">
          <span className="text-[10px] font-black uppercase text-[#6B726E] block">Total Clientes</span>
          <span className="text-2xl font-black text-[#13322E]">{metrics.totalUsers}</span>
        </div>
        <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200">
          <span className="text-[10px] font-black uppercase text-sky-800 block">Viajeros</span>
          <span className="text-2xl font-black text-sky-900">{metrics.travelersCount}</span>
        </div>
        <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200">
          <span className="text-[10px] font-black uppercase text-teal-800 block">Propietarios</span>
          <span className="text-2xl font-black text-teal-900">{metrics.ownersCount}</span>
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
          <span className="text-[10px] font-black uppercase text-emerald-800 block">DNI Verificados</span>
          <span className="text-2xl font-black text-emerald-900">{metrics.verifiedCount}</span>
        </div>
      </div>

      {/* ALERTA FEEDBACK GENERAL */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 border animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* BUSCADOR Y FILTROS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#6B726E]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono o ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E9E1D2] text-xs font-medium text-[#13322E] bg-white placeholder-[#6B726E]/60 focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            aria-label="Filtrar por rol de usuario"
            className="px-3 py-2.5 rounded-2xl border border-[#E9E1D2] text-xs font-bold text-[#13322E] bg-white focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
          >
            <option value="ALL">Todos los roles</option>
            <option value="TRAVELER">Viajeros</option>
            <option value="OWNER">Propietarios</option>
            <option value="ADMIN">Administradores</option>
          </select>

          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            aria-label="Filtrar por estado de verificación"
            className="px-3 py-2.5 rounded-2xl border border-[#E9E1D2] text-xs font-bold text-[#13322E] bg-white focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
          >
            <option value="ALL">Cualquier verificación</option>
            <option value="VERIFIED">✅ Verificados</option>
            <option value="PENDING">⏳ Pendientes DNI</option>
            <option value="UNVERIFIED">Sin verificar</option>
            <option value="REJECTED">❌ Rechazados</option>
          </select>
        </div>
      </div>

      {/* LISTA DE USUARIOS */}
      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#6B726E]">
          <RefreshCw className="w-6 h-6 mx-auto mb-2 text-[#16B8AA] animate-spin" />
          Cargando clientes...
        </div>
      ) : users.length === 0 ? (
        <div className="py-10 text-center rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2]">
          <Users className="w-8 h-8 text-[#16B8AA] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#13322E]">No se encontraron clientes con esos filtros.</p>
          <p className="text-xs text-[#6B726E] mt-1 font-medium">Prueba a cambiar el término de búsqueda.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="space-y-3">
            {users.map((u) => {
              const isOwner = u.role === 'OWNER';
              const isAdmin = u.role === 'ADMIN';

              return (
                <div
                  key={u.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border border-[#E9E1D2] bg-[#FAF7F0]/40 hover:bg-white hover:shadow-md transition-all gap-4"
                >
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={u.avatarUrl || '/default-avatar.svg'}
                      alt={`${u.firstName} ${u.lastName}`}
                      className="w-12 h-12 rounded-full object-cover border border-[#E9E1D2] bg-white shrink-0 shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.svg';
                      }}
                    />

                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h4 className="font-bold text-sm text-[#13322E]">
                          {u.firstName} {u.lastName}
                        </h4>

                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                            isAdmin
                              ? 'bg-purple-100 text-purple-900 border-purple-200'
                              : isOwner
                              ? 'bg-teal-100 text-teal-900 border-teal-200'
                              : 'bg-sky-100 text-sky-900 border-sky-200'
                          }`}
                        >
                          {isAdmin ? 'Administrador' : isOwner ? 'Propietario' : 'Viajero'}
                        </span>

                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                            u.verification === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                              : u.verification === 'PENDING'
                              ? 'bg-amber-100 text-amber-900 border-amber-200'
                              : u.verification === 'REJECTED'
                              ? 'bg-red-100 text-red-900 border-red-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {u.verification === 'VERIFIED'
                            ? '✅ DNI Verificado'
                            : u.verification === 'PENDING'
                            ? '⏳ DNI Pendiente'
                            : u.verification === 'REJECTED'
                            ? '❌ Rechazado'
                            : 'Sin DNI'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B726E] mt-1 font-medium">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-[#16B8AA]" />
                          <span>{u.email}</span>
                        </span>
                        {u.phone && (
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-[#16B8AA]" />
                            <span>{u.phone}</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          ID: {u.id.slice(0, 8)}... • Reg: {new Date(u.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>

                      {u._count && (
                        <div className="flex items-center space-x-3 text-[11px] text-[#13322E] font-bold mt-1.5">
                          {u._count.vehicles > 0 && (
                            <span className="text-[#16B8AA]">{u._count.vehicles} campers publicadas</span>
                          )}
                          {u._count.bookingsAsTraveler > 0 && (
                            <span>{u._count.bookingsAsTraveler} reservas hechas</span>
                          )}
                          {u._count.bookingsAsOwner > 0 && (
                            <span>{u._count.bookingsAsOwner} alquileres gestionados</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => openEditModal(u)}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-[#E9E1D2] bg-white text-xs font-bold text-[#13322E] hover:bg-[#13322E] hover:text-white transition-all shadow-xs cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#16B8AA]" />
                      <span>Editar Perfil</span>
                    </button>

                    <button
                      type="button"
                      disabled={processingId === u.id}
                      onClick={() => handleDeleteUser(u)}
                      title="Eliminar usuario"
                      className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN DE PERFIL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#E9E1D2] max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeEditModal}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* CABECERA MODAL */}
            <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-[#E9E1D2]">
              <div className="relative group">
                <img
                  src={editForm.avatarUrl || '/default-avatar.svg'}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#16B8AA] shadow-md bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.svg';
                  }}
                />
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA]">
                  Editor Administrador
                </span>
                <h3 className="text-xl font-bold text-[#13322E]">
                  Modificar Perfil de {editingUser.firstName} {editingUser.lastName}
                </h3>
                <p className="text-xs text-[#6B726E]">ID: {editingUser.id}</p>
              </div>
            </div>

            {/* ALERTA MODAL FEEDBACK */}
            {modalFeedback && (
              <div
                className={`mb-4 p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 border animate-in fade-in ${
                  modalFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                {modalFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{modalFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* CAMBIO DE FOTO DE PERFIL */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2] space-y-2.5">
                <label className="block text-xs font-bold text-[#13322E]">
                  Foto de Perfil del Usuario
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,.heic,.heif"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isUploadingAvatar}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#13322E] hover:bg-[#16B8AA] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingAvatar ? 'Subiendo foto...' : 'Subir foto desde este dispositivo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditForm((prev) => ({ ...prev, avatarUrl: '/default-avatar.svg' }));
                      setModalFeedback({ type: 'success', message: 'Restablecido al avatar genérico. Pulsa «Guardar Cambios».' });
                    }}
                    className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-bold text-[#6B726E] hover:text-[#13322E] border border-[#E9E1D2] bg-white rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-[#16B8AA]" />
                    <span>Avatar Genérico</span>
                  </button>
                </div>

                <div className="pt-1">
                  <input
                    type="text"
                    value={editForm.avatarUrl}
                    onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                    placeholder="O pega una URL de imagen: https://..."
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E9E1D2] text-[11px] font-medium text-[#13322E] bg-white focus:outline-none focus:ring-1 focus:ring-[#16B8AA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#13322E] mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9E1D2] text-xs font-medium text-[#13322E] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#13322E] mb-1">Apellidos</label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9E1D2] text-xs font-medium text-[#13322E] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#13322E] mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9E1D2] text-xs font-medium text-[#13322E] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#13322E] mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+34 600 000 000"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9E1D2] text-xs font-medium text-[#13322E] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#13322E] mb-1">Rol de Usuario</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9E1D2] text-xs font-bold text-[#13322E] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  >
                    <option value="TRAVELER">Viajero</option>
                    <option value="OWNER">Propietario</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#13322E] mb-1">Estado de Verificación DNI</label>
                  <select
                    value={editForm.verification}
                    onChange={(e) => setEditForm({ ...editForm, verification: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9E1D2] text-xs font-bold text-[#13322E] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                  >
                    <option value="UNVERIFIED">Sin verificar</option>
                    <option value="PENDING">⏳ Pendiente de revisión</option>
                    <option value="VERIFIED">✅ Verificado (Aprobado)</option>
                    <option value="REJECTED">❌ Rechazado</option>
                  </select>
                </div>
              </div>

              {/* CAMBIAR CONTRASEÑA */}
              <div className="pt-3 border-t border-[#E9E1D2]">
                <label className="block text-xs font-bold text-[#13322E] mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Asignar Nueva Contraseña (Opcional)</span>
                </label>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  placeholder="Dejar en blanco para mantener la contraseña actual"
                  minLength={8}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E9E1D2] text-xs font-medium text-[#13322E] focus:outline-none focus:ring-2 focus:ring-[#16B8AA]"
                />
                <p className="text-[10px] text-[#6B726E] mt-1">
                  Si el cliente no puede acceder, escribe aquí una nueva clave provisional de al menos 8 caracteres.
                </p>
              </div>

              {/* BOTONES ACCION */}
              <div className="flex items-center justify-end space-x-3 pt-5 border-t border-[#E9E1D2]">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-5 py-2.5 rounded-full border border-[#E9E1D2] text-xs font-bold text-[#13322E] hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processingId !== null || isUploadingAvatar}
                  className="px-6 py-2.5 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {processingId !== null ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Cambios</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
