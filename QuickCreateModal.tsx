import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { getAccentClasses } from '../../utils/theme';
import {
  X,
  CheckSquare,
  FileText,
  UserPlus,
  Check,
} from 'lucide-react';
import { TaskPriority, TaskStatus, UserRole } from '../../types/platform';

export const QuickCreateModal: React.FC = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    config,
    members,
    currentRole,
    addTask,
    addDoc,
    addMember,
    setActiveModule,
  } = usePlatform();

  const accent = getAccentClasses(config.accentColor);
  const [tab, setTab] = useState<'task' | 'doc' | 'member'>('task');

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('backlog');
  const [taskAssignee, setTaskAssignee] = useState(members[0]?.id || '');

  // Doc form
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('General');
  const [docSummary, setDocSummary] = useState('');
  const [docContent, setDocContent] = useState('');

  // Member form
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<UserRole>('contributor');
  const [memberDept, setMemberDept] = useState('Operaciones');

  if (!isQuickActionOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle.trim(),
      description: taskDescription.trim() || 'Sin descripción detallada.',
      priority: taskPriority,
      status: taskStatus,
      assigneeId: taskAssignee,
      dueDate: '25 Nov 2026',
      tags: ['Prioritario'],
      category: 'General',
    });
    setIsQuickActionOpen(false);
    setActiveModule('projects');
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    const author = members.find((m) => m.role === currentRole) || members[0];
    addDoc({
      title: docTitle.trim(),
      category: docCategory.trim() || 'General',
      summary: docSummary.trim() || 'Resumen del documento.',
      content: docContent.trim() || `# ${docTitle}\n\nContenido del documento.`,
      authorId: author.id,
      authorName: author.name,
      readTimeMinutes: 2,
    });
    setIsQuickActionOpen(false);
    setActiveModule('docs');
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;
    const initials = memberName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    addMember({
      name: memberName.trim(),
      email: memberEmail.trim(),
      role: memberRole,
      roleLabel: memberRole === 'admin' ? 'Administrador' : memberRole === 'manager' ? 'Líder' : 'Especialista',
      department: memberDept.trim() || 'General',
      status: 'Activo',
      avatarInitials: initials,
      avatarBg: 'bg-indigo-600',
    });
    setIsQuickActionOpen(false);
    setActiveModule('members');
  };

  return (
    <div
      onClick={() => setIsQuickActionOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Nuevo Registro Rápido
          </h3>
          <button
            onClick={() => setIsQuickActionOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="mt-4 flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800 text-xs">
          <button
            onClick={() => setTab('task')}
            className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors ${
              tab === 'task'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Tarea</span>
          </button>
          <button
            onClick={() => setTab('doc')}
            className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors ${
              tab === 'doc'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Documento</span>
          </button>
          <button
            onClick={() => setTab('member')}
            className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors ${
              tab === 'member'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Miembro</span>
          </button>
        </div>

        {/* Tab 1: Task Form */}
        {tab === 'task' && (
          <form onSubmit={handleCreateTask} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Título de la tarea
              </label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Ej: Implementar pasarela de cobros..."
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Descripción
              </label>
              <textarea
                rows={2}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Detalle breve de la actividad..."
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Prioridad
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
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
                  Asignado
                </label>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsQuickActionOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`rounded-lg px-4 py-2 font-semibold text-white shadow-sm ${accent.bgPrimary} ${accent.bgHover}`}
              >
                Crear Tarea
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Doc Form */}
        {tab === 'doc' && (
          <form onSubmit={handleCreateDoc} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Título del Documento
              </label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Ej: Manual de Procedimientos Operativos..."
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Categoría
                </label>
                <input
                  type="text"
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Resumen Ejecutivo
                </label>
                <input
                  type="text"
                  value={docSummary}
                  onChange={(e) => setDocSummary(e.target.value)}
                  placeholder="Finalidad del documento..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Contenido Inicial
              </label>
              <textarea
                rows={3}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="Escribe el borrador del documento..."
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsQuickActionOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`rounded-lg px-4 py-2 font-semibold text-white shadow-sm ${accent.bgPrimary} ${accent.bgHover}`}
              >
                Crear Documento
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Member Form */}
        {tab === 'member' && (
          <form onSubmit={handleCreateMember} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Nombre y Apellidos
              </label>
              <input
                type="text"
                required
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Ej: Daniel Vega"
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
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="daniel@empresa.com"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Rol de Acceso
                </label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value as UserRole)}
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
                  Departamento / Área
                </label>
                <input
                  type="text"
                  value={memberDept}
                  onChange={(e) => setMemberDept(e.target.value)}
                  placeholder="Tecnología, Ventas..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsQuickActionOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`rounded-lg px-4 py-2 font-semibold text-white shadow-sm ${accent.bgPrimary} ${accent.bgHover}`}
              >
                Registrar Miembro
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
