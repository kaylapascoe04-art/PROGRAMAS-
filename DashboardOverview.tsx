import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Wrench,
  HardHat,
  Boxes,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  ShieldCheck,
  FileSpreadsheet,
  AlertOctagon,
  RefreshCw,
  FolderKanban,
  MapPin,
  Users,
} from 'lucide-react';
import { Assignment } from '../../types/inventory';

interface DashboardOverviewProps {
  onOpenNewDelivery: () => void;
  onOpenReturnModal: (assignment: Assignment) => void;
  onOpenExtendModal: (assignment: Assignment) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenNewDelivery,
  onOpenReturnModal,
  onOpenExtendModal,
}) => {
  const {
    config,
    assignments,
    items,
    workers,
    projects,
    activeProjectId,
    setActiveProjectId,
    alerts,
    overdueCount,
    replacementDueCount,
    upcomingCount,
    setActiveTab,
    exportAssignmentsCSV,
  } = useInventory();

  // Active items calculations
  const activeAssignments = assignments.filter((a) => a.status !== 'devuelto' && a.status !== 'baja');
  const activeTools = activeAssignments.filter((a) => a.itemCategory === 'herramienta');
  const activeEpp = activeAssignments.filter((a) => a.itemCategory === 'epp');
  const activeEquipment = activeAssignments.filter((a) => a.itemCategory === 'equipo');

  // Stock totals
  const totalStockItems = items.reduce((acc, it) => acc + it.stockTotal, 0);
  const totalAvailable = items.reduce((acc, it) => acc + it.stockAvailable, 0);
  const totalInMaintenance = items.reduce((acc, it) => acc + it.stockMaintenance, 0);

  // SVG Chart data: category distribution
  const chartCategories = [
    { name: 'Herramientas', count: activeTools.length, color: '#4f46e5' },
    { name: 'EPP / Protección', count: activeEpp.length, color: '#059669' },
    { name: 'Equipos Especiales', count: activeEquipment.length, color: '#d97706' },
  ];
  const maxCategoryCount = Math.max(...chartCategories.map((c) => c.count), 1);

  // Project distribution metrics
  const projectStats = projects.map((p) => {
    const projectWorkers = workers.filter(
      (w) => w.projectId === p.id || (w.assignedProjects && w.assignedProjects.includes(p.id))
    );
    const projectAssignments = assignments.filter(
      (a) => a.projectId === p.id && a.status !== 'devuelto' && a.status !== 'baja'
    );
    const projectOverdue = projectAssignments.filter((a) => a.status === 'vencido');
    return {
      project: p,
      workerCount: projectWorkers.length,
      assignmentCount: projectAssignments.length,
      overdueCount: projectOverdue.length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Critical Overdue Alert Banner */}
      {(overdueCount > 0 || replacementDueCount > 0) && (
        <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50/90 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-rose-900/60 dark:bg-rose-950/30">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white shadow-xs">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                Atención: {overdueCount > 0 && `${overdueCount} herramienta(s) con devolución vencida`}
                {overdueCount > 0 && replacementDueCount > 0 && ' y '}
                {replacementDueCount > 0 && `${replacementDueCount} dotación/EPP con reposición vencida`}
              </h2>
              <p className="text-xs text-rose-800 dark:text-rose-300">
                Supervisa el retorno inmediato de herramientas prestadas o programa el recambio periódico de botas de seguridad y dotaciones de campo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('alerts')}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-xs"
            >
              <span>Gestionar Alertas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Facility Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{config.companyName}</span>
            <span aria-hidden="true">·</span>
            <span>{config.facilityName}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Control de Entregas y Custodia
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Supervisión continua de herramientas en préstamo, dotación obligatoria de EPP y alertas automáticas por vencimiento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportAssignmentsCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
            <span>Exportar Registro</span>
          </button>
          <button
            onClick={onOpenNewDelivery}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Asignación</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* 1. Herramientas Prestadas */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Herramientas en Préstamo</span>
            <Wrench className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
            {activeTools.length}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            En poder de colaboradores
          </p>
        </div>

        {/* 2. Devoluciones Vencidas */}
        <div className={`rounded-xl border p-5 ${
          overdueCount > 0
            ? 'border-rose-300 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20'
            : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span>Devoluciones Vencidas</span>
            <AlertOctagon className="h-4 w-4" />
          </div>
          <div className="mt-3 font-mono text-3xl font-bold tracking-tight text-rose-600 tabular-nums dark:text-rose-400">
            {overdueCount}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Herramientas no devueltas
          </p>
        </div>

        {/* 3. Reposiciones Pendientes */}
        <div className={`rounded-xl border p-5 ${
          replacementDueCount > 0
            ? 'border-amber-300 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/20'
            : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
            <span>Reposición Vencida</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="mt-3 font-mono text-3xl font-bold tracking-tight text-amber-700 tabular-nums dark:text-amber-400">
            {replacementDueCount}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Botas / Dotación a renovar
          </p>
        </div>

        {/* 4. Próximas a Vencer */}
        <div className={`rounded-xl border p-5 ${
          upcomingCount > 0
            ? 'border-blue-300 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20'
            : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Por Vencer en 48-72h</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="mt-3 font-mono text-3xl font-bold tracking-tight text-blue-600 tabular-nums dark:text-blue-400">
            {upcomingCount}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Plazo preventivo de alerta
          </p>
        </div>

        {/* 5. Stock en Almacén */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Stock Disponible</span>
            <Boxes className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
            {totalAvailable}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
            De {totalStockItems} unidades totales
          </p>
        </div>
      </div>

      {/* Main Grid: Priority Overdue Alerts + Distribution Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Immediate Expiration Alerts Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Alertas Inmediatas de Vencimiento y Retorno</span>
                {alerts.length > 0 && (
                  <span className="rounded-md bg-rose-100 text-rose-700 px-2 py-0.5 text-[11px] font-mono font-bold dark:bg-rose-950/60 dark:text-rose-300">
                    {alerts.length} casos
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Préstamos con plazo expirado o fecha próxima de recambio obligatorio
              </p>
            </div>

            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 text-center text-xs text-slate-400 dark:border-slate-800">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 mb-1" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Todas las entregas se encuentran al día
                </span>
                <span>No hay herramientas vencidas ni pendientes de recambio crítico.</span>
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => {
                const isOverdue = alert.severity === 'vencido';
                const originalAssignment = assignments.find((a) => a.id === alert.assignmentId);

                return (
                  <div
                    key={alert.id}
                    className={`flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between transition-colors ${
                      isOverdue
                        ? 'border-rose-200 bg-rose-50/50 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/20'
                        : 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20'
                    }`}
                  >
                    <div className="flex-1 overflow-hidden pr-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs font-bold tabular-nums ${
                            isOverdue
                              ? alert.requiresReturn
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-amber-700 dark:text-amber-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {alert.requiresReturn
                            ? isOverdue
                              ? `⚠️ VENCIDO (${Math.abs(alert.daysDiff)}d)`
                              : `⏳ Vence en ${alert.daysDiff}d`
                            : isOverdue
                            ? `📦 REPOSICIÓN VENCIDA (${Math.abs(alert.daysDiff)}d)`
                            : `📦 Recambio en ${alert.daysDiff}d`}
                        </span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="font-mono text-[11px] text-slate-500">{alert.itemCode}</span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {alert.requiresReturn ? 'Retornable' : 'Dotación'}
                        </span>
                      </div>

                      <h4 className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white truncate">
                        {alert.itemName}
                      </h4>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{alert.workerName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{alert.workerDepartment}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {alert.requiresReturn ? 'Retorno:' : 'Recambio:'} {alert.dueDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
                      {originalAssignment && (
                        <>
                          <button
                            onClick={() => onOpenReturnModal(originalAssignment)}
                            className="rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs"
                          >
                            {alert.requiresReturn ? 'Registrar Retorno' : 'Registrar Recambio'}
                          </button>
                          <button
                            onClick={() => onOpenExtendModal(originalAssignment)}
                            className="rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
                          >
                            {alert.requiresReturn ? 'Prórroga' : 'Extender'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Assignments by Category & Quick Shortcuts */}
        <div className="space-y-6 lg:col-span-4">
          {/* Category distribution */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ítems en Campo por Categoría
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribución de material actualmente entregado
            </p>

            <div className="mt-4 space-y-3.5">
              {chartCategories.map((cat) => {
                const pct = Math.round((cat.count / maxCategoryCount) * 100);
                return (
                  <div key={cat.name} className="text-xs">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>{cat.name}</span>
                      <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                        {cat.count} unidades
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Mantenimiento en taller:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {totalInMaintenance} equipos
              </span>
            </div>
          </div>

          {/* Quick Access Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Acciones Frecuentes
            </h3>

            <div className="mt-3 space-y-2">
              <button
                onClick={onOpenNewDelivery}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-left font-semibold text-slate-800 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Nueva Entrega con Acta
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('assignments')}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-left font-semibold text-slate-800 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Registrar Devolución
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('acts')}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-left font-semibold text-slate-800 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Generar Acta Oficial Imprimible
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Distribution Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Custodia y Dotación por Proyecto / Frente de Obra</span>
              <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-mono font-bold dark:bg-slate-800 dark:text-slate-300">
                {projects.length} frentes activos
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitoreo del personal rotativo y equipos asignados por cada proyecto de la empresa
            </p>
          </div>

          <button
            onClick={() => setActiveTab('projects')}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors cursor-pointer"
          >
            <span>Gestionar Proyectos & Obras</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projectStats.map(({ project: p, workerCount, assignmentCount, overdueCount }) => (
            <div
              key={p.id}
              onClick={() => {
                setActiveProjectId(p.id);
                setActiveTab('assignments');
              }}
              title={`Clic para ver entregas asignadas a ${p.name}`}
              className="group relative cursor-pointer rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {p.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {p.name}
                  </h4>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    p.status === 'activo'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {p.status === 'activo' ? 'Activo' : p.status}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate">{p.location}</span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium font-mono">{workerCount} personal</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Wrench className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium font-mono">{assignmentCount} en uso</span>
                </div>
                {overdueCount > 0 ? (
                  <span className="rounded bg-rose-100 text-rose-700 px-1.5 py-0.5 text-[10px] font-mono font-bold dark:bg-rose-950/60 dark:text-rose-300">
                    {overdueCount} vencidos
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Al día
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
