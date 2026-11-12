import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Search,
  Plus,
  Users,
  Phone,
  Mail,
  Briefcase,
  AlertOctagon,
  Wrench,
  HardHat,
  X,
  FileCheck,
  Edit2,
  Trash2,
  FolderKanban,
  ArrowRightLeft,
} from 'lucide-react';
import { Worker, Assignment, Project } from '../../types/inventory';

interface WorkersRosterProps {
  onViewWorkerAssignments: (worker: Worker) => void;
}

export const WorkersRoster: React.FC<WorkersRosterProps> = ({ onViewWorkerAssignments }) => {
  const {
    workers,
    assignments,
    projects,
    activeProjectId,
    addWorker,
    updateWorker,
    deleteWorker,
    assignWorkerToProject,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>(
    activeProjectId !== 'all' ? activeProjectId : 'all'
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  // Quick Reassign Project modal state
  const [reassignWorker, setReassignWorker] = useState<Worker | null>(null);
  const [targetProjectId, setTargetProjectId] = useState<string>('');

  // Form State
  const [formName, setFormName] = useState('');
  const [formDni, setFormDni] = useState('');
  const [formDept, setFormDept] = useState('Mantenimiento');
  const [formJobTitle, setFormJobTitle] = useState('Técnico Mecánico');
  const [formPhone, setFormPhone] = useState('+34 600 000 000');
  const [formEmail, setFormEmail] = useState('');
  const [formLocation, setFormLocation] = useState('Planta Central');
  const [formStatus, setFormStatus] = useState<'activo' | 'inactivo'>('activo');
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || '');
  const [formAssignedProjects, setFormAssignedProjects] = useState<string[]>([projects[0]?.id || '']);

  const openCreateModal = () => {
    setEditingWorker(null);
    setFormName('');
    setFormDni('');
    setFormDept('Mantenimiento Electromecánico');
    setFormJobTitle('Técnico Especialista');
    setFormPhone('+34 611 223 344');
    setFormEmail('');
    setFormLocation('Planta Central');
    setFormStatus('activo');
    const defaultProjId = activeProjectId !== 'all' ? activeProjectId : (projects[0]?.id || '');
    setFormProjectId(defaultProjId);
    setFormAssignedProjects([defaultProjId]);
    setIsModalOpen(true);
  };

  const openEditModal = (worker: Worker) => {
    setEditingWorker(worker);
    setFormName(worker.name);
    setFormDni(worker.dni);
    setFormDept(worker.department);
    setFormJobTitle(worker.jobTitle);
    setFormPhone(worker.phone);
    setFormEmail(worker.email);
    setFormLocation(worker.location);
    setFormStatus(worker.status);
    const projId = worker.projectId || projects[0]?.id || '';
    setFormProjectId(projId);
    setFormAssignedProjects(worker.assignedProjects || [projId]);
    setIsModalOpen(true);
  };

  const toggleWorkerStatus = (worker: Worker) => {
    const nextStatus = worker.status === 'activo' ? 'inactivo' : 'activo';
    updateWorker(worker.id, { status: nextStatus });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDni.trim()) return;

    const projObj = projects.find((p) => p.id === formProjectId);
    const assigned = Array.from(new Set([...formAssignedProjects, formProjectId]));

    if (editingWorker) {
      updateWorker(editingWorker.id, {
        name: formName.trim(),
        dni: formDni.trim(),
        department: formDept.trim(),
        jobTitle: formJobTitle.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        location: formLocation.trim(),
        status: formStatus,
        projectId: formProjectId,
        projectName: projObj?.name || 'Obra Principal',
        assignedProjects: assigned,
      });
    } else {
      addWorker({
        name: formName.trim(),
        dni: formDni.trim(),
        department: formDept.trim(),
        jobTitle: formJobTitle.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@empresa.com`,
        status: formStatus,
        location: formLocation.trim(),
        projectId: formProjectId,
        projectName: projObj?.name || 'Obra Principal',
        assignedProjects: assigned,
      });
    }

    setIsModalOpen(false);
  };

  const handleQuickReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignWorker || !targetProjectId) return;
    assignWorkerToProject(reassignWorker.id, targetProjectId);
    setReassignWorker(null);
  };

  const departments = Array.from(new Set(workers.map((w) => w.department)));

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.dni.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.projectName && w.projectName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'all' || w.department === selectedDept;
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchesProject =
      selectedProjectFilter === 'all' ||
      w.projectId === selectedProjectFilter ||
      (w.assignedProjects && w.assignedProjects.includes(selectedProjectFilter));

    return matchesSearch && matchesDept && matchesStatus && matchesProject;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Padrón de Colaboradores y Personal en Campo
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control individual de dotación de EPP entregado y herramientas bajo custodia
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Colaborador</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI, cargo o departamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Todos ({workers.length})
            </button>
            <button
              onClick={() => setStatusFilter('activo')}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                statusFilter === 'activo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Activos ({workers.filter((w) => w.status === 'activo').length})
            </button>
            <button
              onClick={() => setStatusFilter('inactivo')}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                statusFilter === 'inactivo'
                  ? 'bg-slate-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Inactivos ({workers.filter((w) => w.status === 'inactivo').length})
            </button>
          </div>

          <div className="flex items-center gap-1.5 pl-1">
            <span className="text-slate-500 text-[11px]">Área:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">Todas ({workers.length})</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 pl-1">
            <span className="text-slate-500 text-[11px]">Obra:</span>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 max-w-[170px] truncate"
            >
              <option value="all">Todas las obras</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWorkers.map((worker) => {
          const workerAssignments = assignments.filter(
            (a) => a.workerId === worker.id && a.status !== 'devuelto'
          );
          const overdueAssignments = workerAssignments.filter((a) => a.status === 'vencido');
          const hasOverdue = overdueAssignments.length > 0;
          const isInactive = worker.status === 'inactivo';

          const toolCount = workerAssignments.filter((a) => a.itemCategory === 'herramienta').length;
          const eppCount = workerAssignments.filter((a) => a.itemCategory === 'epp').length;

          return (
            <div
              key={worker.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all hover:shadow-xs ${
                isInactive
                  ? 'border-slate-300 bg-slate-50/70 opacity-80 dark:border-slate-800 dark:bg-slate-900/60'
                  : hasOverdue
                  ? 'border-rose-300 bg-rose-50/20 dark:border-rose-900/50 dark:bg-rose-950/10'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-xs ${
                        isInactive
                          ? 'bg-slate-400 text-white dark:bg-slate-700'
                          : 'bg-slate-900 text-white dark:bg-slate-800'
                      }`}
                    >
                      {worker.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {worker.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {worker.jobTitle}
                      </p>
                    </div>
                  </div>

                  {/* Status Toggle Badge */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleWorkerStatus(worker)}
                      title={`Haz clic para ${isInactive ? 'activar' : 'inactivar'} colaborador`}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                        isInactive
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:hover:bg-emerald-900/80'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isInactive ? 'bg-slate-400' : 'bg-emerald-500'
                        }`}
                      />
                      <span>{isInactive ? 'Inactivo' : 'Activo'}</span>
                    </button>

                    {hasOverdue && (
                      <span className="flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-mono">
                        <AlertOctagon className="h-3 w-3" />
                        {overdueAssignments.length} VENCIDAS
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
                  {/* Obra / Proyecto Asignado */}
                  <div className="flex items-center justify-between gap-1 rounded-lg bg-slate-50 p-1.5 dark:bg-slate-800/60">
                    <div className="flex items-center gap-1.5 truncate">
                      <FolderKanban className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {worker.projectName || 'Sin obra asignada'}
                      </span>
                    </div>
                    {worker.assignedProjects && worker.assignedProjects.length > 1 && (
                      <span
                        title={`Asignado a: ${worker.assignedProjects
                          .map((pId) => projects.find((p) => p.id === pId)?.name || pId)
                          .join(', ')}`}
                        className="rounded bg-indigo-100/70 px-1.5 py-0.2 font-mono text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 shrink-0"
                      >
                        +{worker.assignedProjects.length - 1} obras
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{worker.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-500">DNI: {worker.dni}</span>
                  </div>
                  {worker.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px]">{worker.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Custody summary & Actions */}
              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Wrench className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{toolCount} herramientas</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <HardHat className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{eppCount} EPPs</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onViewWorkerAssignments(worker)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>Ver Ficha Custodia</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setReassignWorker(worker);
                        setTargetProjectId(worker.projectId || projects[0]?.id || '');
                      }}
                      className="rounded p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="Reasignar / Transferir de obra"
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => openEditModal(worker)}
                      className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      title="Editar"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteWorker(worker.id)}
                      className="rounded p-1 text-slate-400 hover:text-rose-600"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add or Edit Worker */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingWorker ? 'Editar Colaborador' : 'Registrar Colaborador en Padrón'}
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
                  placeholder="Ej: Alberto Castro Ortiz"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    DNI / Documento de Identidad
                  </label>
                  <input
                    type="text"
                    required
                    value={formDni}
                    onChange={(e) => setFormDni(e.target.value)}
                    placeholder="47.112.980-X"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Teléfono Móvil
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Departamento / Área
                  </label>
                  <input
                    type="text"
                    required
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    placeholder="Mantenimiento, Obras, Calidad..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Cargo / Puesto
                  </label>
                  <input
                    type="text"
                    required
                    value={formJobTitle}
                    onChange={(e) => setFormJobTitle(e.target.value)}
                    placeholder="Técnico Soldador, Operario..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="alberto@empresa.com"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Ubicación habitual / Frente de trabajo
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Planta Principal / Nave 2"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Asignación de Proyecto / Obra */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 dark:border-indigo-950/60 dark:bg-indigo-950/20">
                <label className="block font-semibold text-indigo-950 dark:text-indigo-200">
                  Proyecto / Obra Principal Asignada
                </label>
                <select
                  value={formProjectId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setFormProjectId(newId);
                    if (!formAssignedProjects.includes(newId)) {
                      setFormAssignedProjects([...formAssignedProjects, newId]);
                    }
                  }}
                  className="mt-1 w-full rounded-lg border border-indigo-200 bg-white p-2 text-xs font-semibold text-slate-900 dark:border-indigo-800 dark:bg-slate-800 dark:text-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>

                <div className="mt-2.5">
                  <span className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Proyectos Adicionales Habilitados (Personal Rotativo / Multi-obra):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-28 overflow-y-auto pt-0.5">
                    {projects.map((p) => {
                      const isChecked = formAssignedProjects.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormAssignedProjects([...formAssignedProjects, p.id]);
                              } else {
                                if (p.id === formProjectId) return;
                                setFormAssignedProjects(formAssignedProjects.filter((id) => id !== p.id));
                              }
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="truncate">{p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Estado en Planta / Padrón
                </label>
                <div className="mt-1 flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 p-2.5 flex-1 dark:border-slate-700 has-checked:border-emerald-500 has-checked:bg-emerald-50/30 dark:has-checked:bg-emerald-950/20">
                    <input
                      type="radio"
                      name="workerStatus"
                      value="activo"
                      checked={formStatus === 'activo'}
                      onChange={() => setFormStatus('activo')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Activo</span>
                      <p className="text-[10px] text-slate-500">Habilitado para recibir EPP y herramientas</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 p-2.5 flex-1 dark:border-slate-700 has-checked:border-slate-500 has-checked:bg-slate-100/50 dark:has-checked:bg-slate-800">
                    <input
                      type="radio"
                      name="workerStatus"
                      value="inactivo"
                      checked={formStatus === 'inactivo'}
                      onChange={() => setFormStatus('inactivo')}
                      className="text-slate-600 focus:ring-slate-500"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Inactivo</span>
                      <p className="text-[10px] text-slate-500">Bloqueado para nuevas entregas</p>
                    </div>
                  </label>
                </div>
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
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-xs hover:bg-indigo-700"
                >
                  {editingWorker ? 'Guardar Cambios' : 'Registrar Colaborador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Reassign Modal */}
      {reassignWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Transferir de Obra / Proyecto
                </h3>
                <p className="text-xs text-slate-500">
                  {reassignWorker.name} ({reassignWorker.jobTitle})
                </p>
              </div>
              <button
                onClick={() => setReassignWorker(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleQuickReassign} className="mt-4 space-y-4 text-xs">
              <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400">
                <span className="text-[11px]">Obra actual: </span>
                <strong className="text-slate-900 dark:text-white">{reassignWorker.projectName || 'Sin obra'}</strong>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Seleccionar Nueva Obra / Proyecto de Destino
                </label>
                <select
                  required
                  value={targetProjectId}
                  onChange={(e) => setTargetProjectId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.name} ({p.location})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  El colaborador mantendrá sus herramientas asignadas y las nuevas entregas se computarán a la nueva obra.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setReassignWorker(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-xs hover:bg-indigo-700"
                >
                  Confirmar Transferencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
