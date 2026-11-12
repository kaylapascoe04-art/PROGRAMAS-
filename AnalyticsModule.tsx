import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { getAccentClasses } from '../../utils/theme';
import {
  BarChart3,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  const {
    config,
    tasks,
    members,
    metrics,
    exportCSV,
  } = usePlatform();

  const accent = getAccentClasses(config.accentColor);
  const [selectedRange, setSelectedRange] = useState<'month' | 'quarter' | 'year'>('month');

  // Compute status distributions
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewTasks = tasks.filter((t) => t.status === 'review').length;
  const backlogTasks = tasks.filter((t) => t.status === 'backlog').length;

  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Breakdown by priority
  const priorityStats = [
    { label: 'Urgente', count: tasks.filter((t) => t.priority === 'urgent').length, color: 'bg-rose-500' },
    { label: 'Alta', count: tasks.filter((t) => t.priority === 'high').length, color: 'bg-amber-500' },
    { label: 'Media', count: tasks.filter((t) => t.priority === 'medium').length, color: 'bg-indigo-500' },
    { label: 'Baja', count: tasks.filter((t) => t.priority === 'low').length, color: 'bg-slate-400' },
  ];

  // Breakdown by category
  const categories = Array.from(new Set(tasks.map((t) => t.category)));
  const categoryStats = categories.map((cat) => ({
    name: cat,
    count: tasks.filter((t) => t.category === cat).length,
  }));

  // Weekly throughput simulation data for SVG bar chart
  const weeklyVelocity = [
    { week: 'Semana 1', completed: 14, target: 16 },
    { week: 'Semana 2', completed: 22, target: 20 },
    { week: 'Semana 3', completed: 18, target: 18 },
    { week: 'Semana 4', completed: 26, target: 24 },
  ];

  const maxVelocity = 30;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Métricas, Analíticas & Rendimiento
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Seguimiento cuantitativo de productividad, carga de trabajo y tiempos de ciclo
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-xs dark:border-slate-800 dark:bg-slate-900">
            {(['month', 'quarter', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedRange === range
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {range === 'month' ? 'Este Mes' : range === 'quarter' ? 'Trimestre' : 'Año'}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors ${accent.bgPrimary} ${accent.bgHover}`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Descargar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Tasa de Cumplimiento
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
              {completionRate}%
            </span>
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              +5.4%
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${accent.bgPrimary}`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="mt-2 block text-[11px] text-slate-400">
            {doneTasks} de {totalTasks} tareas finalizadas
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Tareas en Progreso
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
              {inProgressTasks + reviewTasks}
            </span>
            <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">
              Activas ahora
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {inProgressTasks} en curso · {reviewTasks} en revisión
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Colaboradores Asignados
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
              {members.length}
            </span>
            <span className="font-mono text-xs text-slate-500">Miembros</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            100% de la plantilla con actividades vinculadas
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Tiempo Medio de Resolución
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
              3.2
            </span>
            <span className="text-xs text-slate-500">días hábiles</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            -0.8 días respecto a la media del último trimestre
          </p>
        </div>
      </div>

      {/* Main Grid: Bar Chart + Category Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* SVG Workload Velocity Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Velocidad Semanal de Entrega vs. Objetivo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparativa de unidades cerradas por ciclo semanal
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-sm bg-indigo-600 dark:bg-indigo-400" />
                Completadas
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2.5 w-2.5 rounded-sm bg-slate-200 dark:bg-slate-700" />
                Meta
              </span>
            </div>
          </div>

          <div className="mt-6 flex h-56 items-end justify-between gap-4 px-4 pt-4">
            {weeklyVelocity.map((item, idx) => {
              const compHeightPct = (item.completed / maxVelocity) * 100;
              const targetHeightPct = (item.target / maxVelocity) * 100;

              return (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                  <div className="flex items-end gap-1.5 w-full justify-center h-44">
                    {/* Completed Bar */}
                    <div
                      style={{ height: `${compHeightPct}%` }}
                      className={`w-8 rounded-t-md transition-all ${accent.bgPrimary}`}
                    />
                    {/* Target Bar */}
                    <div
                      style={{ height: `${targetHeightPct}%` }}
                      className="w-8 rounded-t-md bg-slate-200 dark:bg-slate-700 transition-all"
                    />
                  </div>

                  <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                    {item.week}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Rendimiento del equipo en el ciclo: <strong className="text-slate-800 dark:text-slate-200">106% sobre la meta proyectada</strong>.
          </div>
        </div>

        {/* Priority & Category Breakdown */}
        <div className="space-y-6 lg:col-span-4">
          {/* Priority Distribution */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Distribución por Prioridad
            </h3>
            <div className="mt-4 space-y-3">
              {priorityStats.map((p) => {
                const pct = totalTasks > 0 ? Math.round((p.count / totalTasks) * 100) : 0;
                return (
                  <div key={p.label} className="text-xs">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>{p.label}</span>
                      <span className="font-mono tabular-nums text-slate-500">
                        {p.count} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full ${p.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Categorías Activas
            </h3>
            <div className="mt-3 space-y-2">
              {categoryStats.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800 last:border-none"
                >
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {cat.name}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                    {cat.count} {cat.count === 1 ? 'tarea' : 'tareas'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
