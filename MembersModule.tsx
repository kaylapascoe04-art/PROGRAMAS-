import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { getAccentClasses } from '../../utils/theme';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Trash2,
  Edit2,
  LayoutGrid,
  List,
  X,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/platform';

export const MembersModule: React.FC = () => {
  const {
    config,
    members,
    addMember,
    updateMember,
    deleteMember,
    tasks,
  } = usePlatform();

  const accent = getAccentClasses(config.accentColor);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<UserProfile | null>(null);

  // Form
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('contributor');
  const [formRoleLabel, setFormRoleLabel] = useState('Desarrollador');
  const [formDepartment, setFormDepartment] = useState('Ingeniería');
  const [formStatus, setFormStatus] = useState<'Activo' | 'Ausente' | 'Pendiente'>('Activo');
  const [formPhone, setFormPhone] = useState('+34 600 000 000');

  const openCreateModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormEmail('');
    setFormRole('contributor');
    setFormRoleLabel('Especialista');
    setFormDepartment('Operaciones');
    setFormStatus('Activo');
    setFormPhone('+34 611 223 344');
    setIsModalOpen(true);
  };

  const openEditModal = (member: UserProfile) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormEmail(member.email);
    setFormRole(member.role);
    setFormRoleLabel(member.roleLabel);
    setFormDepartment(member.department);
    setFormStatus(member.status);
    setFormPhone(member.phone || '+34 611 223 344');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const initials = formName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const colors = [
      'bg-indigo-600',
      'bg-emerald-600',
      'bg-violet-600',
      'bg-amber-600',
      'bg-rose-600',
      'bg-blue-600',
    ];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];

    if (editingMember) {
      updateMember(editingMember.id, {
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        roleLabel: formRoleLabel.trim(),
        department: formDepartment.trim(),
        status: formStatus,
        phone: formPhone.trim(),
        avatarInitials: initials,
      });
    } else {
      addMember({
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        roleLabel: formRoleLabel.trim(),
        department: formDepartment.trim(),
        status: formStatus,
        phone: formPhone.trim(),
        avatarInitials: initials,
        avatarBg: randomBg,
      });
    }

    setIsModalOpen(false);
  };

  const filteredMembers = members.filter((m) => {
    const matchesQuery =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.roleLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Activo':
        return 'text-emerald-600 dark:text-emerald-400 font-semibold';
      case 'Ausente':
        return 'text-amber-600 dark:text-amber-400 font-medium';
      case 'Pendiente':
      default:
        return 'text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Directorio de Miembros y Clientes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Administración de usuarios, roles de acceso y asignación de áreas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-1.5 text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-md p-1.5 text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors ${accent.bgPrimary} ${accent.bgHover}`}
          >
            <Plus className="h-4 w-4" />
            <span>Registrar Miembro</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o área..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 text-[11px] pr-1">Estado:</span>
          {['all', 'Activo', 'Ausente', 'Pendiente'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {st === 'all' ? 'Todos' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Members Directory Views */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredMembers.map((member) => {
            const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
            return (
              <div
                key={member.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white shadow-xs ${member.avatarBg}`}
                      >
                        {member.avatarInitials}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {member.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {member.roleLabel}
                        </p>
                      </div>
                    </div>

                    <span className={`font-mono text-xs ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
                    <div className="flex items-center gap-2 truncate">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.department}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-mono text-[11px]">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-[11px]">{member.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                    {memberTasks.length} {memberTasks.length === 1 ? 'tarea asignada' : 'tareas asignadas'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(member)}
                      className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      title="Editar"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMember(member.id)}
                      className="rounded p-1 text-slate-400 hover:text-rose-600"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <th className="py-3 px-4">Miembro</th>
                <th className="py-3 px-3">Rol & Cargo</th>
                <th className="py-3 px-3">Departamento</th>
                <th className="py-3 px-3">Contacto</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-7 w-7 rounded-lg text-white font-bold text-xs flex items-center justify-center ${member.avatarBg}`}>
                        {member.avatarInitials}
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {member.name}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    {member.roleLabel}
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                    {member.department}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {member.email}
                  </td>
                  <td className="py-3 px-3">
                    <span className={getStatusColor(member.status)}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(member)}
                        className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="rounded p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingMember ? 'Editar Miembro' : 'Registrar Nuevo Miembro'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Gabriel Martínez"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="gabriel@aura.io"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Nivel de Rol
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="admin">Administrador</option>
                    <option value="manager">Gestor</option>
                    <option value="contributor">Colaborador</option>
                    <option value="guest">Invitado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Cargo / Título
                  </label>
                  <input
                    type="text"
                    value={formRoleLabel}
                    onChange={(e) => setFormRoleLabel(e.target.value)}
                    placeholder="Líder Técnico, Diseñador..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder="Ingeniería, Finanzas..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Estado
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Activo' | 'Ausente' | 'Pendiente')}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Ausente">Ausente</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`rounded-lg px-4 py-2 font-semibold text-white ${accent.bgPrimary} ${accent.bgHover}`}
                >
                  {editingMember ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
