import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  FolderKanban,
  Plus,
  Search,
  MapPin,
  Building,
  UserCheck,
  Wrench,
  AlertOctagon,
  Clock,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Users,
  CheckCircle2,
  HardHat,
  ArrowRightLeft,
} from 'lucide-react';
import { Project, Worker } from '../../types/inventory';

interface ProjectsManagerProps {
  onNavigateToWorkersWithProject?: (projectId: string) => void;
  onNavigateToAssignmentsWithProject?: (projectId: string) => void;
  onOpenNewDeliveryForProject?: (projectId: string) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  onNavigateToWorkersWithProject,
  onNavigateToAssignmentsWithProject,
  onOpenNewDeliveryForProject,
}) => {
  const {
    projects,
    workers,
    assignments,
    addProject,
    updateProject,
    deleteProject,
    setActiveTab,
    assignWorkerToProject,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'pausado' | 'completado'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Rotation / Worker assignment modal
  const [transferModalProject, setTransferModalProject] = useState<Project | null>(null);
  const [selectedWorkerToTransfer, setSelectedWorkerToTransfer] = useState<string>('');

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formManager, setFormManager] = useState('');
  const [formStatus, setFormStatus] = useState<'activo' | 'pausado' | 'completado'>('activo');
  const [formStartDate, setFormStartDate] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const openCreateModal = () => {
    setEditingProject(null);
    setFormCode(`PRJ-0${projects.length + 1}`);
    setFormName('');
    setFormLocation('Frente de Trabajo / Obra');
    setFormClient('');
    setFormManager('Ing. Carlos Mendoza');
    setFormStatus('activo');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormCode(project.code);
    setFormName(project.name);
    setFormLocation(project.location);
    setFormClient(project.client || '');
    setFormManager(project.manager || '');
    setFormStatus(project.status);
    setFormStartDate(project.startDate || '');
    setFormDescription(project.description || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) return;

    if (editingProject) {
      updateProject(editingProject.id, {
        code: formCode.trim(),
        name: formName.trim(),
        location: formLocation.trim(),
        client: formClient.trim() || undefined,
        manager: formManager.trim() || undefined,
        status: formStatus,
        startDate: formStartDate.trim() || undefined,
        description: formDescription.trim() || undefined,
      });
    } else {
      addProject({
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        location: formLocation.trim(),
        client: formClient.trim() || undefined,
        manager: formManager.trim() || undefined,
        status: formStatus,
        startDate: formStartDate.trim() || new Date().toISOString().split('T')[0],
        description: formDescription.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferModalProject || !selectedWorkerToTransfer) return;
    assignWorkerToProject(selectedWorkerToTransfer, transferModalProject.id);
    setSelectedWorkerToTransfer('');
    setTransferModalProject(null);
  };

  // Filtered list
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.manager && p.manager.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate project metrics
  const activeProjectsCount = projects.filter((p) => p.status === 'activo').length;
  const totalAssignedTools = assignments.filter((a) => a.status !== 'devuelto').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Gestión de Proyectos, Obras y Frentes de Trabajo
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Administra la asignación de colaboradores rotativos y controla la custodia de herramientas por centro de trabajo
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Nuevo Proyecto</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Proyectos Registrados
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {projects.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeProjectsCount} en ejecución</span> · {projects.length - activeProjectsCount} cerrados/pausados
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Colaboradores en Proyectos
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {workers.filter((w) => w.status === 'activo').length}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Personal operativo habilitado para asignación cruzada
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Herramientas & EPP en Obra
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {totalAssignedTools}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Ítems activos bajo custodia en todos los frentes
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Movilidad de Personal
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {workers.filter((w) => (w.assignedProjects?.length || 0) > 1).length}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Colaboradores rotando en más de 1 proyecto
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, nombre de obra, cliente o residente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Todos ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter('activo')}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              statusFilter === 'activo'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Activos ({projects.filter((p) => p.status === 'activo').length})
          </button>
          <button
            onClick={() => setStatusFilter('pausado')}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              statusFilter === 'pausado'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Pausados ({projects.filter((p) => p.status === 'pausado').length})
          </button>
          <button
            onClick={() => setStatusFilter('completado')}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              statusFilter === 'completado'
                ? 'bg-slate-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Completados ({projects.filter((p) => p.status === 'completado').length})
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => {
          // Calculate workers assigned to this project
          const assignedWorkers = workers.filter(
            (w) => w.projectId === project.id || (w.assignedProjects && w.assignedProjects.includes(project.id))
          );
          // Calculate active assignments in this project
          const projectAssignments = assignments.filter(
            (a) => a.projectId === project.id && a.status !== 'devuelto'
          );
          const overdueInProject = projectAssignments.filter((a) => a.status === 'vencido');
          const hasOverdue = overdueInProject.length > 0;

          return (
            <div
              key={project.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all hover:shadow-xs ${
                hasOverdue
                  ? 'border-rose-200 bg-rose-50/15 dark:border-rose-900/40 dark:bg-rose-950/10'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900/60">
                      {project.code}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        project.status === 'activo'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : project.status === 'pausado'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          project.status === 'activo'
                            ? 'bg-emerald-500'
                            : project.status === 'pausado'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span className="capitalize">{project.status}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(project)}
                      title="Editar Proyecto"
                      className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      title="Eliminar Proyecto"
                      className="rounded p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Project Title & Client */}
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                  {project.name}
                </h3>

                {project.client && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Cliente: {project.client}</span>
                  </div>
                )}

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{project.location}</span>
                </div>

                {project.manager && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <HardHat className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Residente: {project.manager}</span>
                  </div>
                )}

                {project.description && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Overdue Warning Badge */}
                {hasOverdue && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                    <AlertOctagon className="h-3.5 w-3.5 shrink-0" />
                    <span>{overdueInProject.length} entrega(s) con devolución vencida en esta obra</span>
                  </div>
                )}
              </div>

              {/* Metrics & Actions Footer */}
              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Users className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="font-semibold">{assignedWorkers.length}</span>
                    <span className="text-slate-500 text-[11px]">colaboradores</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Wrench className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="font-semibold">{projectAssignments.length}</span>
                    <span className="text-slate-500 text-[11px]">en custodia</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1 text-xs pt-1 border-t border-slate-50 dark:border-slate-800/60">
                  {/* Asignar Colaborador a este proyecto */}
                  <button
                    onClick={() => setTransferModalProject(project)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
                  >
                    <ArrowRightLeft className="h-3 w-3" />
                    <span>Transferir / Asignar Personal</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {onNavigateToWorkersWithProject && (
                      <button
                        onClick={() => onNavigateToWorkersWithProject(project.id)}
                        className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        title="Ver colaboradores de esta obra"
                      >
                        Ver Personal ({assignedWorkers.length})
                      </button>
                    )}
                    {onNavigateToAssignmentsWithProject && (
                      <button
                        onClick={() => onNavigateToAssignmentsWithProject(project.id)}
                        className="text-[11px] font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white"
                        title="Ver herramientas de esta obra"
                      >
                        Ver Custodia ({projectAssignments.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create or Edit Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingProject ? 'Editar Proyecto / Frente de Obra' : 'Registrar Nuevo Proyecto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Código del Proyecto / Obra
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="Ej: PRJ-NORTE-01"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Estado Operativo
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="activo">Activo / En Ejecución</option>
                    <option value="pausado">Pausado / En Espera</option>
                    <option value="completado">Completado / Finalizado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nombre del Proyecto / Obra
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Torre Residencial Costanera, Línea 2 Metro..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Cliente / Contratante
                  </label>
                  <input
                    type="text"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="Ej: Consorcio Vial, Inmobiliaria..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Ingeniero Residente / Responsable
                  </label>
                  <input
                    type="text"
                    value={formManager}
                    onChange={(e) => setFormManager(e.target.value)}
                    placeholder="Ej: Ing. Carlos Mendoza"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Ubicación Física / Frente de Trabajo
                </label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Ej: Sector Norte - Km 18, Parcela 4B"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Descripción y Alcance de Trabajos
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalle de actividades, fases o requerimientos particulares..."
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
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-xs hover:bg-indigo-700"
                >
                  {editingProject ? 'Guardar Cambios' : 'Registrar Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Transfer / Assign Worker to Project */}
      {transferModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Asignar Personal a {transferModalProject.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Selecciona a un colaborador para incorporarlo a este frente de obra
                </p>
              </div>
              <button
                onClick={() => setTransferModalProject(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Seleccionar Colaborador del Padrón
                </label>
                <select
                  required
                  value={selectedWorkerToTransfer}
                  onChange={(e) => setSelectedWorkerToTransfer(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">-- Elige un colaborador --</option>
                  {workers
                    .filter((w) => w.status === 'activo')
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.jobTitle}) — Actual: {w.projectName || 'Sin proyecto'}
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  El colaborador quedará habilitado para recibir herramientas y EPP con cargo a este proyecto.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransferModalProject(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!selectedWorkerToTransfer}
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50"
                >
                  Confirmar Asignación a Obra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
