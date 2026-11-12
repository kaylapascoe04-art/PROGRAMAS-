import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth, UserRole } from '../../context/AuthContext';
import { PlatformLogo } from '../common/PlatformLogo';
import { Company } from '../../types/inventory';
import {
  Building2,
  Users,
  ShieldCheck,
  Plus,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  User,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Info,
  DollarSign,
  Sparkles,
  Search,
  Check,
  X,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export const CompaniesManager: React.FC = () => {
  const {
    companies,
    activeCompanyId,
    setActiveCompanyId,
    addCompany,
    updateCompany,
    deleteCompany,
    exportBackupJSON,
    importBackupJSON,
  } = useInventory();

  const {
    currentUser,
    availableAccounts,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetUserPassword,
    switchUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'companies' | 'users' | 'free_guide'>('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');

  // Modals
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [passwordResetUserId, setPasswordResetUserId] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New/Edit Company Form State
  const [companyForm, setCompanyForm] = useState({
    code: '',
    taxId: '',
    name: '',
    facilityName: '',
    logoPreset: 'shield' as 'shield' | 'helmet' | 'crane' | 'gear' | 'custom',
    logoUrl: '',
    phone: '',
    address: '',
    supervisor1Name: '',
    supervisor1Role: '',
    supervisor1Email: '',
    supervisor2Name: '',
    supervisor2Role: '',
    supervisor2Email: '',
    supervisor3Name: '',
    supervisor3Role: '',
    supervisor3Email: '',
  });

  // New User Form State
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'almacen' as UserRole,
    roleTitle: 'Jefe de Almacén y Control de Herramientas',
    department: 'Logística & Suministros',
    companyId: activeCompanyId !== 'all' ? activeCompanyId : 'comp-atlas',
    phone: '',
  });

  const openNewCompanyModal = () => {
    setEditingCompany(null);
    setCompanyForm({
      code: '',
      taxId: '',
      name: '',
      facilityName: 'Almacén Central',
      logoPreset: 'shield',
      logoUrl: '',
      phone: '',
      address: '',
      supervisor1Name: 'Encargado de Almacén',
      supervisor1Role: 'Jefe de Pañol y Suministros',
      supervisor1Email: 'almacen@empresa.com',
      supervisor2Name: 'Prevencionista SST',
      supervisor2Role: 'Supervisión de Seguridad y Salud (HSE)',
      supervisor2Email: 'sst@empresa.com',
      supervisor3Name: 'Jefe de Obra',
      supervisor3Role: 'Residente / Jefatura de Operaciones',
      supervisor3Email: 'operaciones@empresa.com',
    });
    setFormFeedback(null);
    setIsCompanyModalOpen(true);
  };

  const openEditCompanyModal = (comp: Company) => {
    setEditingCompany(comp);
    setCompanyForm({
      code: comp.code,
      taxId: comp.taxId,
      name: comp.name,
      facilityName: comp.facilityName,
      logoPreset: comp.logoPreset || 'shield',
      logoUrl: comp.logoUrl || '',
      phone: comp.phone || '',
      address: comp.address || '',
      supervisor1Name: comp.supervisor1Name,
      supervisor1Role: comp.supervisor1Role,
      supervisor1Email: comp.supervisor1Email || '',
      supervisor2Name: comp.supervisor2Name,
      supervisor2Role: comp.supervisor2Role,
      supervisor2Email: comp.supervisor2Email || '',
      supervisor3Name: comp.supervisor3Name,
      supervisor3Role: comp.supervisor3Role,
      supervisor3Email: comp.supervisor3Email || '',
    });
    setFormFeedback(null);
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name.trim()) {
      setFormFeedback({ type: 'error', message: 'El nombre de la empresa es obligatorio.' });
      return;
    }

    if (editingCompany) {
      updateCompany(editingCompany.id, {
        code: companyForm.code.trim().toUpperCase() || 'EMP',
        taxId: companyForm.taxId.trim(),
        name: companyForm.name.trim(),
        facilityName: companyForm.facilityName.trim() || 'Almacén Central',
        logoPreset: companyForm.logoPreset,
        logoUrl: companyForm.logoUrl.trim(),
        phone: companyForm.phone.trim(),
        address: companyForm.address.trim(),
        supervisor1Name: companyForm.supervisor1Name.trim(),
        supervisor1Role: companyForm.supervisor1Role.trim(),
        supervisor1Email: companyForm.supervisor1Email.trim(),
        supervisor2Name: companyForm.supervisor2Name.trim(),
        supervisor2Role: companyForm.supervisor2Role.trim(),
        supervisor2Email: companyForm.supervisor2Email.trim(),
        supervisor3Name: companyForm.supervisor3Name.trim(),
        supervisor3Role: companyForm.supervisor3Role.trim(),
        supervisor3Email: companyForm.supervisor3Email.trim(),
      });
    } else {
      addCompany({
        code: companyForm.code.trim().toUpperCase() || 'EMP',
        taxId: companyForm.taxId.trim(),
        name: companyForm.name.trim(),
        facilityName: companyForm.facilityName.trim() || 'Almacén Central',
        logoPreset: companyForm.logoPreset,
        logoUrl: companyForm.logoUrl.trim(),
        phone: companyForm.phone.trim(),
        address: companyForm.address.trim(),
        supervisor1Name: companyForm.supervisor1Name.trim(),
        supervisor1Role: companyForm.supervisor1Role.trim(),
        supervisor1Email: companyForm.supervisor1Email.trim(),
        supervisor2Name: companyForm.supervisor2Name.trim(),
        supervisor2Role: companyForm.supervisor2Role.trim(),
        supervisor2Email: companyForm.supervisor2Email.trim(),
        supervisor3Name: companyForm.supervisor3Name.trim(),
        supervisor3Role: companyForm.supervisor3Role.trim(),
        supervisor3Email: companyForm.supervisor3Email.trim(),
        status: 'activa',
      });
    }

    setIsCompanyModalOpen(false);
  };

  const openNewUserModal = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'almacen',
      roleTitle: 'Jefe de Almacén y Control de Herramientas',
      department: 'Logística & Suministros',
      companyId: activeCompanyId !== 'all' ? activeCompanyId : (companies[0]?.id || 'comp-atlas'),
      phone: '',
    });
    setFormFeedback(null);
    setIsUserModalOpen(true);
  };

  const handleRoleChangeInForm = (newRole: UserRole) => {
    let defaultTitle = 'Supervisor de Área';
    let defaultDept = 'Operaciones';

    switch (newRole) {
      case 'superadmin':
        defaultTitle = 'Super Administrador Multiempresa';
        defaultDept = 'Dirección Corporativa';
        break;
      case 'admin':
        defaultTitle = 'Administrador de Empresa';
        defaultDept = 'Gerencia de Operaciones';
        break;
      case 'almacen':
        defaultTitle = 'Jefe de Almacén y Despacho';
        defaultDept = 'Logística & Suministros';
        break;
      case 'sst':
        defaultTitle = 'Supervisora de Seguridad y Salud (SST / HSE)';
        defaultDept = 'Prevención de Riesgos Laborales';
        break;
      case 'operaciones':
        defaultTitle = 'Jefe de Operaciones / Residente de Obra';
        defaultDept = 'Construcción y Montaje';
        break;
      case 'consulta':
        defaultTitle = 'Lector / Auditor de Custodia';
        defaultDept = 'Auditoría / Campo';
        break;
    }

    setUserForm((prev) => ({
      ...prev,
      role: newRole,
      roleTitle: defaultTitle,
      department: defaultDept,
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    const targetCompany = companies.find((c) => c.id === userForm.companyId);
    const companyName = userForm.companyId === 'all' ? 'Todas las Empresas' : (targetCompany?.name || 'Empresa General');

    const result = await createUser({
      name: userForm.name.trim(),
      email: userForm.email.trim(),
      password: userForm.password,
      role: userForm.role,
      roleTitle: userForm.roleTitle.trim(),
      department: userForm.department.trim(),
      companyId: userForm.companyId,
      companyName,
      phone: userForm.phone.trim(),
    });

    if (result.success) {
      setIsUserModalOpen(false);
    } else {
      setFormFeedback({ type: 'error', message: result.error || 'Error al crear el usuario' });
    }
  };

  const handleSavePasswordReset = (userId: string) => {
    if (!newPasswordInput || newPasswordInput.length < 5) {
      alert('La contraseña debe tener al menos 5 caracteres.');
      return;
    }
    resetUserPassword(userId, newPasswordInput);
    setPasswordResetUserId(null);
    setNewPasswordInput('');
    alert('Contraseña actualizada exitosamente.');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
            🟣 Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[11px] font-semibold dark:bg-indigo-950/60 dark:text-indigo-300">
            🔵 Admin Empresa
          </span>
        );
      case 'almacen':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-[11px] font-semibold dark:bg-blue-950/60 dark:text-blue-300">
            📦 Almacén / Pañol
          </span>
        );
      case 'sst':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-semibold dark:bg-emerald-950/60 dark:text-emerald-300">
            🦺 SST / HSE
          </span>
        );
      case 'operaciones':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-100 text-amber-800 px-2 py-0.5 text-[11px] font-semibold dark:bg-amber-950/60 dark:text-amber-300">
            🏗️ Operaciones / Obra
          </span>
        );
      case 'consulta':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-medium dark:bg-slate-800 dark:text-slate-300">
            👁️ Consulta
          </span>
        );
    }
  };

  const filteredUsers = availableAccounts.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    const matchesCompany = selectedCompanyFilter === 'all' || u.companyId === selectedCompanyFilter;

    return matchesSearch && matchesRole && matchesCompany;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Free $0 Commitment */}
      <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                Arquitectura Multiempresa & Accesos 100% Gratuita (Costo $0)
              </h2>
              <span className="rounded-full bg-emerald-600 px-2 py-0.2 font-mono text-[10px] font-bold text-white">
                SIN COSTO DE SERVIDOR
              </span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              Registra múltiples empresas clientes y crea usuarios con correos y contraseñas independientes. Todos los datos, actas y catálogos funcionan de forma autónoma sin suscripciones mensuales.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('free_guide')}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <Info className="h-3.5 w-3.5 text-emerald-600" />
          <span>¿Cómo funciona gratis?</span>
        </button>
      </div>

      {/* Navigation Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gestión de Empresas & Control de Accesos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aislamiento de inventario por empresa, personalización de firmas y asignación de credenciales por rol
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'companies' ? (
            <button
              onClick={openNewCompanyModal}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Empresa</span>
            </button>
          ) : activeTab === 'users' ? (
            <button
              onClick={openNewUserModal}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Nuevo Usuario con Contraseña</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'companies'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Empresas Registradas ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Usuarios y Credenciales ({availableAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('free_guide')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'free_guide'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Guía de Gratuidad & Seguridad</span>
        </button>
      </div>

      {/* TAB 1: EMPRESAS REGISTRADAS */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {companies.map((comp) => {
              const isActive = activeCompanyId === comp.id;
              const companyUsersCount = availableAccounts.filter((u) => u.companyId === comp.id).length;

              return (
                <div
                  key={comp.id}
                  className={`flex flex-col justify-between rounded-xl border p-5 transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Header: Code & Active Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black tracking-wider text-indigo-600 dark:text-indigo-400">
                          {comp.code}
                        </span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {comp.taxId || 'RUT/CIF no reg.'}
                        </span>
                      </div>

                      {isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                          <CheckCircle2 className="h-3 w-3" />
                          EMPRESA ACTIVA EN PANTALLA
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveCompanyId(comp.id)}
                          className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          Conmutar aquí
                        </button>
                      )}
                    </div>

                    {/* Company Identity */}
                    <div className="mt-3 flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 font-bold text-indigo-600 text-sm">
                        {comp.code.slice(0, 3)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {comp.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {comp.facilityName}
                        </p>
                      </div>
                    </div>

                    {/* 3 Official Delivery Supervisors */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                        Firmantes Oficiales en Actas (3 Responsables)
                      </span>

                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">1. Almacén:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                            {comp.supervisor1Name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">2. SST / HSE:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                            {comp.supervisor2Name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">3. Operaciones:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                            {comp.supervisor3Name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {companyUsersCount} usuarios con acceso
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditCompanyModal(comp)}
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        title="Editar datos de empresa y supervisores"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      {companies.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Confirma eliminar la empresa "${comp.name}"?`)) {
                              deleteCompany(comp.id);
                            }
                          }}
                          className="rounded p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                          title="Eliminar empresa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: USUARIOS Y CREDENCIALES (RBAC) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar usuario por nombre, correo, cargo o empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Role filter */}
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">Todos los roles</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin Empresa</option>
                <option value="almacen">Almacén / Pañol</option>
                <option value="sst">SST / HSE</option>
                <option value="operaciones">Operaciones / Obra</option>
                <option value="consulta">Lector / Consulta</option>
              </select>

              {/* Company filter */}
              <select
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">Todas las empresas</option>
                <option value="all">Consorcio Global (all)</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                    <th className="py-3 px-4">Usuario / Colaborador</th>
                    <th className="py-3 px-4">Correo Electrónico (Login)</th>
                    <th className="py-3 px-3">Rol & Permisos</th>
                    <th className="py-3 px-4">Empresa Asignada</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((user) => {
                    const isCurrent = currentUser?.id === user.id;

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50 ${
                          isCurrent ? 'bg-indigo-50/20 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shrink-0 ${user.avatarBg || 'bg-indigo-600'}`}
                            >
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isCurrent && (
                                  <span className="rounded bg-indigo-100 text-indigo-700 px-1.5 py-0.2 text-[9px] font-bold dark:bg-indigo-950 dark:text-indigo-300">
                                    TÚ
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {user.roleTitle || user.department}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                          {user.email}
                        </td>

                        <td className="py-3.5 px-3">
                          {getRoleBadge(user.role)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {user.companyName || user.companyId}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            title="Clic para cambiar estado activo/inactivo"
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors cursor-pointer ${
                              user.status !== 'inactivo'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {user.status !== 'inactivo' ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Conmutar a este usuario */}
                            <button
                              onClick={() => switchUser(user.id)}
                              title="Probar plataforma iniciando sesión como este usuario"
                              className="rounded px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                            >
                              Cambiar a este usuario
                            </button>

                            {/* Cambiar contraseña */}
                            <button
                              onClick={() => {
                                setPasswordResetUserId(user.id);
                                setNewPasswordInput('');
                              }}
                              title="Cambiar contraseña"
                              className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                              <KeyRound className="h-4 w-4" />
                            </button>

                            {/* Eliminar usuario */}
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar usuario ${user.name}?`)) {
                                  deleteUser(user.id);
                                }
                              }}
                              className="rounded p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GUÍA DE CERO COSTO ($0 DE POR VIDA) */}
      {activeTab === 'free_guide' && (
        <div className="space-y-6 max-w-4xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span>¿Cómo funciona esta solución para que sea 100% gratuita y sin costo alguno?</span>
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Muchas empresas de software cobran suscripciones mensuales caras por usuario o por empresa conectada. Esta plataforma fue diseñada con una **arquitectura ligera y autónoma** para que puedas operarla sin pagar ni un solo dólar:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  1. Almacenamiento Local (Local Database)
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Todas las empresas, herramientas, préstamos, fotos de actas y usuarios se guardan en el navegador de tu computadora. <strong>Cero costo mensual de servidor de base de datos.</strong>
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  2. Respaldos Portátiles en JSON
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ¿Necesitas pasar los datos a otra computadora o compartir con otro colega? Con 1 clic en <strong>Exportar Respaldo JSON</strong> descargas todo el sistema y lo importas en cualquier equipo sin pagar servidores.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  3. Nivel Gratuito de Google (Free Tier)
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Si más adelante deseas sincronizar en tiempo real entre múltiples celulares u obras remotas, Google Cloud ofrece Firebase con <strong>1GB de base de datos gratis y 50.000 lecturas diarias sin costo</strong>.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  Exportar copia de seguridad de todas las empresas:
                </span>
                <p className="text-[11px] text-slate-400">
                  Genera un archivo .json con todas las empresas, usuarios, inventarios y actas.
                </p>
              </div>

              <button
                onClick={exportBackupJSON}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
              >
                <span>Descargar Respaldo JSON Completo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NUEVA / EDITAR EMPRESA */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                <span>{editingCompany ? 'Editar Empresa' : 'Registrar Nueva Empresa (Gratis)'}</span>
              </h3>
              <button
                onClick={() => setIsCompanyModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="mt-4 space-y-4 text-xs">
              {formFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium ${
                    formFeedback.type === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {formFeedback.message}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Razón Social / Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Constructora & Montajes del Norte SpA"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Código Breve *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: NORTE"
                    maxLength={10}
                    value={companyForm.code}
                    onChange={(e) => setCompanyForm({ ...companyForm, code: e.target.value.toUpperCase() })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    RUT / NIF / CIF / RFC
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 76.543.210-K"
                    value={companyForm.taxId}
                    onChange={(e) => setCompanyForm({ ...companyForm, taxId: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre del Almacén o Planta
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Bodega Central de Herramientas"
                    value={companyForm.facilityName}
                    onChange={(e) => setCompanyForm({ ...companyForm, facilityName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Logo Preset */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ícono / Logo Identificador
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'shield', label: '🛡️ Escudo SST' },
                    { id: 'helmet', label: '🦺 Casco de Seguridad' },
                    { id: 'crane', label: '🏗️ Grúa / Construcción' },
                    { id: 'gear', label: '⚙️ Engranaje Industrial' },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setCompanyForm({ ...companyForm, logoPreset: p.id as any })}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        companyForm.logoPreset === p.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Supervisors of this company */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs text-slate-900 dark:text-white block mb-2">
                  Los 3 Responsables Oficiales para las Actas de esta Empresa
                </span>

                <div className="space-y-3">
                  {/* Supervisor 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 dark:bg-slate-800/40">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">1. Responsable Almacén (Nombre)</label>
                      <input
                        type="text"
                        required
                        value={companyForm.supervisor1Name}
                        onChange={(e) => setCompanyForm({ ...companyForm, supervisor1Name: e.target.value })}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Cargo / Título</label>
                      <input
                        type="text"
                        required
                        value={companyForm.supervisor1Role}
                        onChange={(e) => setCompanyForm({ ...companyForm, supervisor1Role: e.target.value })}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Supervisor 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 dark:bg-slate-800/40">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">2. Responsable SST / HSE (Nombre)</label>
                      <input
                        type="text"
                        required
                        value={companyForm.supervisor2Name}
                        onChange={(e) => setCompanyForm({ ...companyForm, supervisor2Name: e.target.value })}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Cargo / Título</label>
                      <input
                        type="text"
                        required
                        value={companyForm.supervisor2Role}
                        onChange={(e) => setCompanyForm({ ...companyForm, supervisor2Role: e.target.value })}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Supervisor 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 dark:bg-slate-800/40">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">3. Jefatura Operaciones / Obra</label>
                      <input
                        type="text"
                        required
                        value={companyForm.supervisor3Name}
                        onChange={(e) => setCompanyForm({ ...companyForm, supervisor3Name: e.target.value })}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Cargo / Título</label>
                      <input
                        type="text"
                        required
                        value={companyForm.supervisor3Role}
                        onChange={(e) => setCompanyForm({ ...companyForm, supervisor3Role: e.target.value })}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                >
                  {editingCompany ? 'Guardar Cambios' : 'Registrar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO USUARIO CON CONTRASEÑA */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-indigo-600" />
                <span>Nuevo Usuario & Credenciales</span>
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5 text-xs">
              {formFeedback && (
                <div className="p-3 rounded-lg text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
                  {formFeedback.message}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo del Usuario *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ing. Laura Benítez"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico (Acceso) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@empresa.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contraseña de Ingreso *
                </label>
                <input
                  type="password"
                  required
                  minLength={5}
                  placeholder="Mínimo 5 caracteres"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Empresa Asignada *
                  </label>
                  <select
                    value={userForm.companyId}
                    onChange={(e) => setUserForm({ ...userForm, companyId: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="all">Todas (Consorcio Global)</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rol en la Plataforma *
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => handleRoleChangeInForm(e.target.value as UserRole)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-semibold"
                  >
                    <option value="almacen">Almacén / Pañol</option>
                    <option value="sst">Supervisor SST / HSE</option>
                    <option value="operaciones">Jefe Operaciones / Obra</option>
                    <option value="admin">Admin de Empresa</option>
                    <option value="superadmin">Super Admin Global</option>
                    <option value="consulta">Lector / Consulta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título del Cargo a Mostrar en Actas
                </label>
                <input
                  type="text"
                  value={userForm.roleTitle}
                  onChange={(e) => setUserForm({ ...userForm, roleTitle: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {passwordResetUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-indigo-600" />
              <span>Restablecer Contraseña de Usuario</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa la nueva contraseña para este usuario.
            </p>

            <div className="mt-4 space-y-3">
              <input
                type="password"
                placeholder="Nueva contraseña (mín 5 caracteres)"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setPasswordResetUserId(null)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSavePasswordReset(passwordResetUserId)}
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Guardar Contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
