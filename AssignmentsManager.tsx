import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Search,
  Plus,
  FileCheck,
  RotateCcw,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Filter,
  FileSpreadsheet,
  Clock,
  Printer,
  Download,
  Loader2,
  X,
  AlertOctagon,
} from 'lucide-react';
import { Assignment, ItemCategory, AssignmentStatus, ItemCondition } from '../../types/inventory';
import { exportDeliveryActToPdf } from '../../utils/pdfExport';

interface AssignmentsManagerProps {
  onOpenNewDelivery: () => void;
  onOpenReturnModal: (assignment: Assignment) => void;
  onOpenExtendModal: (assignment: Assignment) => void;
  onViewAct: (assignment: Assignment) => void;
}

export const AssignmentsManager: React.FC<AssignmentsManagerProps> = ({
  onOpenNewDelivery,
  onOpenReturnModal,
  onOpenExtendModal,
  onViewAct,
}) => {
  const {
    assignments,
    config,
    projects,
    activeProjectId,
    setActiveProjectId,
    exportAssignmentsCSV,
  } = useInventory();

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ItemCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AssignmentStatus>('all');
  const [modalityFilter, setModalityFilter] = useState<'all' | 'retornable' | 'definitiva'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const handleQuickPdfDownload = async (a: Assignment) => {
    try {
      setDownloadingId(a.id);
      await exportDeliveryActToPdf({
        assignment: a,
        config,
        preferVector: true, // fast, crisp, standalone vector PDF
      });
    } catch (err) {
      console.error('Error downloading PDF:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.workerDni.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.workerDepartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.projectName && a.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || a.itemCategory === categoryFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesModality =
      modalityFilter === 'all' ||
      (modalityFilter === 'retornable' ? a.requiresReturn : !a.requiresReturn);
    const matchesProject =
      projectFilter === 'all' || a.projectId === projectFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesModality && matchesProject;
  });

  const getStatusBadge = (a: Assignment) => {
    if (a.status === 'devuelto') {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          {a.requiresReturn ? 'Devuelto' : 'Recambiado / Baja'}
        </span>
      );
    }

    if (!a.requiresReturn) {
      if (a.status === 'vencido') {
        return (
          <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            Reposición Vencida
          </span>
        );
      }
      if (a.status === 'proximo_vencer') {
        return (
          <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            Recambio Próximo
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Dotación Vigente
        </span>
      );
    }

    // Para ítems con requiresReturn = true
    switch (a.status) {
      case 'vencido':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
            <AlertOctagon className="h-3.5 w-3.5" />
            Devolución Atrasada
          </span>
        );
      case 'proximo_vencer':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            Por Vencer
          </span>
        );
      case 'activo':
      default:
        return (
          <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
            En Uso / Al Día
          </span>
        );
    }
  };

  const calculateDaysRemaining = (a: Assignment) => {
    if (a.returnDate) {
      return a.requiresReturn ? 'Devuelto' : 'Cerrado';
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(a.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">
          {a.requiresReturn ? `Vencido (${Math.abs(diffDays)}d)` : `Vigencia vencida (${Math.abs(diffDays)}d)`}
        </span>
      );
    }
    if (diffDays === 0) {
      return (
        <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
          {a.requiresReturn ? 'Devolver Hoy' : 'Recambio Hoy'}
        </span>
      );
    }
    if (diffDays <= config.warningDaysThreshold) {
      return (
        <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
          {diffDays}d {a.requiresReturn ? 'para retorno' : 'para recambio'}
        </span>
      );
    }
    return (
      <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
        {diffDays}d restantes
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Registro de Entregas, Préstamos y Devoluciones
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control de custodia de herramientas, dotación de EPP y equipos asignados al personal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAssignmentsCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onOpenNewDelivery}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Entrega</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por colaborador, DNI, herramienta, EPP o código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg dark:bg-slate-800">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'herramienta', label: 'Herramientas' },
              { id: 'epp', label: 'EPP' },
              { id: 'equipo', label: 'Equipos' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Modality Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg dark:bg-slate-800">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'retornable', label: '🔄 Retornables' },
              { id: 'definitiva', label: '📦 Dotación' },
            ].map((mod) => (
              <button
                key={mod.id}
                onClick={() => setModalityFilter(mod.id as any)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  modalityFilter === mod.id
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {mod.label}
              </button>
            ))}
          </div>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">🏗️ Todos los proyectos / obras</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Todos los estados</option>
            <option value="vencido">⚠️ Vencidos (Alerta roja)</option>
            <option value="proximo_vencer">⏳ Por Vencer (Alerta amarilla)</option>
            <option value="activo">✅ Activos / Al día</option>
            <option value="devuelto">📦 Devueltos / Cerrados</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <th className="py-3 px-4">Folio / Código</th>
                <th className="py-3 px-4">Ítem Entregado</th>
                <th className="py-3 px-3">Modalidad</th>
                <th className="py-3 px-4">Colaborador / Frente de Obra</th>
                <th className="py-3 px-3">Fecha Entrega</th>
                <th className="py-3 px-3">Fecha Límite / Vencimiento</th>
                <th className="py-3 px-3">Plazo</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-slate-400">
                    No se encontraron entregas con los filtros especificados.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((a) => {
                  const isReturned = a.status === 'devuelto';
                  return (
                    <tr
                      key={a.id}
                      className={`hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50 ${
                        a.status === 'vencido'
                          ? 'bg-rose-50/30 dark:bg-rose-950/10'
                          : a.status === 'proximo_vencer'
                          ? 'bg-amber-50/20 dark:bg-amber-950/10'
                          : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {a.id}
                        </span>
                        <div className="font-mono text-[11px] text-slate-400">
                          {a.itemCode}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {a.itemName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="capitalize">{a.itemCategory}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{a.quantity} unid.</span>
                          <span aria-hidden="true">·</span>
                          <span>Estado: {a.conditionOnDelivery}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        {a.requiresReturn ? (
                          <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                            🔄 Retornable
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            📦 Dotación Definitiva
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {a.workerName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-mono">{a.workerDni}</span>
                          <span aria-hidden="true">·</span>
                          <span>{a.workerDepartment}</span>
                        </div>
                        {a.projectName && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                              <span className="text-[10px]">🏗️</span>
                              <span className="truncate max-w-[170px]">{a.projectName}</span>
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-400">
                        {a.deliveryDate}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`font-mono text-[11px] tabular-nums font-semibold ${
                            a.status === 'vencido'
                              ? 'text-rose-600 dark:text-rose-400'
                              : a.status === 'proximo_vencer'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {a.dueDate}
                        </span>
                        {a.returnDate && (
                          <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                            {a.requiresReturn ? `Devuelto: ${a.returnDate}` : `Cerrado: ${a.returnDate}`}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        {calculateDaysRemaining(a)}
                      </td>

                      <td className="py-3.5 px-3">
                        {getStatusBadge(a)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón Descargar PDF Directo */}
                          <button
                            onClick={() => handleQuickPdfDownload(a)}
                            disabled={downloadingId === a.id}
                            title="Descargar Acta Oficial en PDF (jsPDF)"
                            className="rounded p-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40 transition-colors disabled:opacity-50"
                          >
                            {downloadingId === a.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </button>

                          {/* Botón Ver Acta Oficial */}
                          <button
                            onClick={() => onViewAct(a)}
                            title="Ver Acta Oficial de Entrega"
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                          >
                            <Printer className="h-4 w-4" />
                          </button>

                          {/* Botón Devolución o Recambio/Baja */}
                          {!isReturned && (
                            <button
                              onClick={() => onOpenReturnModal(a)}
                              title={
                                a.requiresReturn
                                  ? 'Registrar Devolución física al almacén'
                                  : 'Registrar Recambio de Dotación / Baja por Desgaste'
                              }
                              className={`rounded px-2 py-1 text-xs font-semibold border transition-colors ${
                                a.requiresReturn
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                              }`}
                            >
                              {a.requiresReturn ? 'Devolver' : 'Recambio'}
                            </button>
                          )}

                          {/* Botón Extender Plazo */}
                          {!isReturned && (
                            <button
                              onClick={() => onOpenExtendModal(a)}
                              title={
                                a.requiresReturn
                                  ? 'Extender fecha límite de devolución'
                                  : 'Extender fecha programada de recambio'
                              }
                              className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              Prórroga
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
