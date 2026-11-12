import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  AlertTriangle,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Phone,
  RotateCcw,
  Calendar,
  Filter,
  Wrench,
  HardHat,
  Boxes,
  Printer,
} from 'lucide-react';
import { Assignment } from '../../types/inventory';

interface AlertsCenterProps {
  onOpenReturnModal: (assignment: Assignment) => void;
  onOpenExtendModal: (assignment: Assignment) => void;
  onViewAct: (assignment: Assignment) => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({
  onOpenReturnModal,
  onOpenExtendModal,
  onViewAct,
}) => {
  const {
    alerts,
    assignments,
    workers,
    overdueCount,
    replacementDueCount,
    upcomingCount,
    config,
  } = useInventory();

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'vencido' | 'por_vencer'>('all');
  const [filterModality, setFilterModality] = useState<'all' | 'retornable' | 'dotacion'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'herramienta' | 'epp' | 'equipo'>('all');

  const filteredAlerts = alerts.filter((a) => {
    const matchesSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
    const matchesCategory = filterCategory === 'all' || a.itemCategory === filterCategory;
    const matchesModality =
      filterModality === 'all' ||
      (filterModality === 'retornable' ? a.requiresReturn : !a.requiresReturn);
    return matchesSeverity && matchesCategory && matchesModality;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Centro de Alertas de Vencimiento y Custodia</span>
          {(overdueCount > 0 || replacementDueCount > 0) && (
            <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-mono font-bold text-white tabular-nums">
              {overdueCount + replacementDueCount} Vencidas
            </span>
          )}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Supervisión diferenciada: Retorno de herramientas prestadas al almacén vs. Reposición programada de dotación definitiva (botas de seguridad, cintas métricas, EPP)
        </p>
      </div>

      {/* Alert Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Retorno de Herramientas */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-900/60 dark:bg-rose-950/20">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300">
            <span>Retornos Atrasados</span>
            <AlertOctagon className="h-4 w-4" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-rose-700 dark:text-rose-300 tabular-nums">
            {overdueCount}
          </div>
          <p className="mt-1 text-xs text-rose-800/80 dark:text-rose-400">
            Herramientas prestadas que no han vuelto al almacén a tiempo.
          </p>
        </div>

        {/* Reposición de Dotación */}
        <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
            <span>Reposición Vencida</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-amber-800 dark:text-amber-300 tabular-nums">
            {replacementDueCount}
          </div>
          <p className="mt-1 text-xs text-amber-900/80 dark:text-amber-400">
            Botas, cintas métricas o EPP cuya vida útil ha caducado.
          </p>
        </div>

        {/* Próximas a Vencer */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
          <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
            <span>Próximas (48-72h)</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-blue-700 dark:text-blue-300 tabular-nums">
            {upcomingCount}
          </div>
          <p className="mt-1 text-xs text-blue-800/80 dark:text-blue-400">
            Préstamos o dotaciones cerca de su fecha programada.
          </p>
        </div>

        {/* Umbral */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Umbral Preventivo</span>
            <Calendar className="h-4 w-4" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {config.warningDaysThreshold} días
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Días de aviso previo antes del vencimiento.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              filterSeverity === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Todas ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('vencido')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              filterSeverity === 'vencido'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            Vencidas ({overdueCount + replacementDueCount})
          </button>
          <button
            onClick={() => setFilterSeverity('por_vencer')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              filterSeverity === 'por_vencer'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300'
            }`}
          >
            Por Vencer ({upcomingCount})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Modalidad Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg dark:bg-slate-800">
            {[
              { id: 'all', label: 'Todo' },
              { id: 'retornable', label: '🔄 Retornos' },
              { id: 'dotacion', label: '📦 Reposiciones' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setFilterModality(m.id as any)}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  filterModality === m.id
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-slate-50 py-1 px-2.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Todas las categorías</option>
            <option value="herramienta">Herramientas</option>
            <option value="epp">EPP</option>
            <option value="equipo">Equipos</option>
          </select>
        </div>
      </div>

      {/* Alerts Detailed List */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs dark:border-slate-800 dark:bg-slate-900">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              No hay alertas activas en esta sección
            </h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400 max-w-sm">
              Todas las herramientas y dotaciones se encuentran dentro de su cronograma de validez operativa.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isOverdue = alert.severity === 'vencido';
            const originalAssignment = assignments.find((a) => a.id === alert.assignmentId);
            const worker = workers.find((w) => w.name === alert.workerName);

            return (
              <div
                key={alert.id}
                className={`flex flex-col gap-4 rounded-xl border p-5 transition-shadow hover:shadow-xs lg:flex-row lg:items-center lg:justify-between ${
                  isOverdue
                    ? alert.requiresReturn
                      ? 'border-rose-300 bg-white dark:border-rose-900/60 dark:bg-slate-900'
                      : 'border-amber-300 bg-white dark:border-amber-900/60 dark:bg-slate-900'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      isOverdue
                        ? alert.requiresReturn
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}
                  >
                    {alert.itemCategory === 'herramienta' ? (
                      <Wrench className="h-5 w-5" />
                    ) : alert.itemCategory === 'epp' ? (
                      <HardHat className="h-5 w-5" />
                    ) : (
                      <Boxes className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
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
                            ? `⚠️ RETORNO ATRASADO hace ${Math.abs(alert.daysDiff)} días`
                            : `⏳ Devolución en ${alert.daysDiff} días`
                          : isOverdue
                          ? `📦 REPOSICIÓN VENCIDA hace ${Math.abs(alert.daysDiff)} días`
                          : `📦 Recambio en ${alert.daysDiff} días`}
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="font-mono text-xs text-slate-500 font-bold">{alert.itemCode}</span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs text-slate-400 capitalize">{alert.itemCategory}</span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          alert.requiresReturn
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {alert.requiresReturn ? 'Retornable al almacén' : 'Dotación Definitiva (Sin devolución)'}
                      </span>
                    </div>

                    <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {alert.itemName}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {alert.workerName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{alert.workerDepartment}</span>
                      {worker?.phone && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                            <Phone className="h-3 w-3" />
                            {worker.phone}
                          </span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {alert.requiresReturn ? 'Límite Retorno:' : 'Fecha Recambio:'} {alert.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  {originalAssignment && (
                    <>
                      <button
                        onClick={() => onViewAct(originalAssignment)}
                        title="Ver Acta de Entrega"
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <Printer className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onOpenReturnModal(originalAssignment)}
                        className={`rounded-lg px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors ${
                          alert.requiresReturn
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-600'
                        }`}
                      >
                        {alert.requiresReturn ? 'Registrar Retorno' : 'Registrar Recambio'}
                      </button>

                      <button
                        onClick={() => onOpenExtendModal(originalAssignment)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {alert.requiresReturn ? 'Conceder Prórroga' : 'Extender Vigencia'}
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
  );
};
