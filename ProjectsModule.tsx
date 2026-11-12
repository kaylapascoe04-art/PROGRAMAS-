import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { getAccentClasses } from '../../utils/theme';
import {
  Plus,
  Search,
  Kanban,
  List,
  Clock,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit2,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types/platform';

export const ProjectsModule: React.FC = () => {
  const {
    config,
    tasks,
    members,
    addTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
    exportCSV,
  } = usePlatform();

  const accent = getAccentClasses(config.accentColor);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium');
  const [formStatus, setFormStatus] = useState<TaskStatus>('backlog');
  const [formAssignee, setFormAssignee] = useState(members[0]?.id || '');
  const [formDueDate, setFormDueDate] = useState('');
  const [formCategory, setFormCategory] = useState('Desarrollo');
  const [formTags, setFormTags] = useState('Frontend, Prioritario');

  const openCreateModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormPriority('medium');
    setFormStatus('backlog');
    setFormAssignee(members[0]?.id || '');
    setFormDueDate('25 Nov 2026');
    setFormCategory('General');
    setFormTags('Operaciones');
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormAssignee(task.assigneeId);
    setFormDueDate(task.dueDate);
    setFormCategory(task.category);
    setFormTags(task.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingTask) {
      updateTask(editingTask.id, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        priority: formPriority,
        status: formStatus,
        assigneeId: formAssignee,
        dueDate: formDueDate,
        category: formCategory,
        tags: tagsArray,
      });
    } else {
      addTask({
        title: formTitle.trim(),
        description: formDescription.trim(),
        priority: formPriority,
        status: formStatus,
        assigneeId: formAssignee,
        dueDate: formDueDate,
        category: formCategory,
        tags: tagsArray,
      });
    }

    setIsModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority =
      selectedPriority === 'all' || t.priority === selectedPriority;

    const matchesAssignee =
      selectedAssignee === 'all' || t.assigneeId === selectedAssignee;

    return matchesQuery && matchesPriority && matchesAssignee;
  });

  const columns: { id: TaskStatus; label: string; count: number }[] = [
    { id: 'backlog', label: 'Por Iniciar', count: filteredTasks.filter((t) => t.status === 'backlog').length },
    { id: 'in_progress', label: 'En Curso', count: filteredTasks.filter((t) => t.status === 'in_progress').length },
    { id: 'review', label: 'En Revisión', count: filteredTasks.filter((t) => t.status === 'review').length },
    { id: 'done', label: 'Completado', count: filteredTasks.filter((t) => t.status === 'done').length },
  ];

  const getPriorityLabel = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
      default:
        return 'Baja';
    }
  };

  const getPriorityTextColor = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return 'text-rose-600 dark:text-rose-400 font-semibold';
      case 'high':
        return 'text-amber-600 dark:text-amber-400 font-medium';
      case 'medium':
        return 'text-indigo-600 dark:text-indigo-400 font-medium';
      case 'low':
      default:
        return 'text-slate-500 dark:text-slate-400';
    }
  };

  const nextStatusMap: Record<TaskStatus, TaskStatus | null> = {
    backlog: 'in_progress',
    in_progress: 'review',
    review: 'done',
    done: null,
  };

  const prevStatusMap: Record<TaskStatus, TaskStatus | null> = {
    backlog: null,
    in_progress: 'backlog',
    review: 'in_progress',
    done: 'review',
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gestión de Tareas y Proyectos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control de flujo de trabajo, responsabilidades y cronogramas de entrega
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Tablero</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Lista</span>
            </button>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Exportar CSV
          </button>

          <button
            onClick={openCreateModal}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors ${accent.bgPrimary} ${accent.bgHover}`}
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, tag o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority filter buttons */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 text-[11px] pr-1">Prioridad:</span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'urgent', label: 'Urgente' },
              { id: 'high', label: 'Alta' },
              { id: 'medium', label: 'Media' },
              { id: 'low', label: 'Baja' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPriority(p.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedPriority === p.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Assignee Filter dropdown */}
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 py-1 px-2.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Todos los asignados</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Kanban or List */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {col.label}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                      ({col.count})
                    </span>
                  </div>
                  <button
                    onClick={openCreateModal}
                    title="Añadir en esta columna"
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Column Cards */}
                <div className="mt-3 flex-1 space-y-3 min-h-[300px]">
                  {colTasks.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 text-center text-xs text-slate-400 dark:border-slate-800">
                      <span>Sin tareas en esta etapa</span>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const assignee = members.find((m) => m.id === task.assigneeId);
                      const nextStatus = nextStatusMap[task.status];
                      const prevStatus = prevStatusMap[task.status];

                      return (
                        <div
                          key={task.id}
                          className="group relative flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                        >
                          <div>
                            {/* Metadata Header: Priority & Category */}
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                              <span className={getPriorityTextColor(task.priority)}>
                                {getPriorityLabel(task.priority)}
                              </span>
                              <span className="font-mono text-[11px]">{task.category}</span>
                            </div>

                            {/* Title */}
                            <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-white leading-snug">
                              {task.title}
                            </h4>

                            {/* Description */}
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                              {task.description}
                            </p>

                            {/* Tags as clean unboxed text with bullets */}
                            {task.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                {task.tags.map((tag, i) => (
                                  <React.Fragment key={tag}>
                                    <span>#{tag}</span>
                                    {i < task.tags.length - 1 && <span aria-hidden="true">·</span>}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Footer with Assignee, Due Date, and Actions */}
                          <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              {assignee ? (
                                <div
                                  title={assignee.name}
                                  className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white ${assignee.avatarBg}`}
                                >
                                  {assignee.avatarInitials}
                                </div>
                              ) : (
                                <div className="h-6 w-6 rounded-md bg-slate-200 text-center text-[10px] leading-6 dark:bg-slate-800">
                                  ?
                                </div>
                              )}
                              <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                                {task.dueDate}
                              </span>
                            </div>

                            {/* Move and Edit Buttons */}
                            <div className="flex items-center gap-1">
                              {prevStatus && (
                                <button
                                  onClick={() => moveTaskStatus(task.id, prevStatus)}
                                  title="Retroceder estado"
                                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                                >
                                  <ArrowLeft className="h-3 w-3" />
                                </button>
                              )}
                              {nextStatus && (
                                <button
                                  onClick={() => moveTaskStatus(task.id, nextStatus)}
                                  title="Avanzar estado"
                                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                                >
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={() => openEditModal(task)}
                                title="Editar"
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                title="Eliminar"
                                className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <th className="py-3 px-4">Tarea</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3">Prioridad</th>
                <th className="py-3 px-3">Responsable</th>
                <th className="py-3 px-3">Fecha Límite</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No se encontraron tareas con los filtros actuales
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const assignee = members.find((m) => m.id === task.assigneeId);
                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {task.description}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={task.status}
                          onChange={(e) => moveTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="rounded border border-slate-200 bg-white py-1 px-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <option value="backlog">Por Iniciar</option>
                          <option value="in_progress">En Curso</option>
                          <option value="review">En Revisión</option>
                          <option value="done">Completado</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <span className={getPriorityTextColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {assignee && (
                            <div className={`h-5 w-5 rounded-md text-[9px] font-bold text-white flex items-center justify-center ${assignee.avatarBg}`}>
                              {assignee.avatarInitials}
                            </div>
                          )}
                          <span className="text-slate-700 dark:text-slate-300">
                            {assignee?.name || 'Sin asignar'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] tabular-nums text-slate-500">
                        {task.dueDate}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(task)}
                            className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="rounded p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create or Edit Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Título de la tarea
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej: Optimizar rendimiento del motor de búsqueda..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Descripción y alcance
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalla los requisitos y objetivos de esta actividad..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Prioridad
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Estado inicial
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="backlog">Por Iniciar</option>
                    <option value="in_progress">En Curso</option>
                    <option value="review">En Revisión</option>
                    <option value="done">Completado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Asignado a
                  </label>
                  <select
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Fecha Límite
                  </label>
                  <input
                    type="text"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    placeholder="Ej: 28 Nov 2026"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Ej: Backend, Diseño, Legal..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Etiquetas (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Sprint 4, QA, Clientes"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`rounded-lg px-4 py-2 font-semibold text-white shadow-sm transition-colors ${accent.bgPrimary} ${accent.bgHover}`}
                >
                  {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
