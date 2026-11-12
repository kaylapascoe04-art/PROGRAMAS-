import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { getAccentClasses } from '../../utils/theme';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  FileText,
  Users,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { PLATFORM_PRESETS } from '../../data/initialData';
import { TaskStatus } from '../../types/platform';

export const DashboardModule: React.FC = () => {
  const {
    config,
    metrics,
    tasks,
    activity,
    members,
    moveTaskStatus,
    setActiveModule,
    setIsQuickActionOpen,
    applyPreset,
  } = usePlatform();

  const accent = getAccentClasses(config.accentColor);
  const [chartPeriod, setChartPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; label: string } | null>(null);

  // Chart data points based on selected period
  const chartDatasets = {
    '7d': [
      { label: 'Lun', val: 24 },
      { label: 'Mar', val: 32 },
      { label: 'Mié', val: 28 },
      { label: 'Jue', val: 46 },
      { label: 'Vie', val: 40 },
      { label: 'Sáb', val: 18 },
      { label: 'Dom', val: 12 },
    ],
    '30d': [
      { label: 'Sem 1', val: 120 },
      { label: 'Sem 2', val: 145 },
      { label: 'Sem 3', val: 180 },
      { label: 'Sem 4', val: 210 },
    ],
    '90d': [
      { label: 'Ago', val: 430 },
      { label: 'Sep', val: 560 },
      { label: 'Oct', val: 680 },
      { label: 'Nov', val: 790 },
    ],
  };

  const activePoints = chartDatasets[chartPeriod];
  const maxVal = Math.max(...activePoints.map((p) => p.val)) * 1.15;
  const chartWidth = 560;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  // Compute SVG polyline coordinates
  const pointsString = activePoints
    .map((p, i) => {
      const x = paddingX + (i / (activePoints.length - 1)) * (chartWidth - paddingX * 2);
      const y = chartHeight - paddingY - (p.val / maxVal) * (chartHeight - paddingY * 2);
      return `${x},${y}`;
    })
    .join(' ');

  // Urgent and active tasks
  const activeTasks = tasks.filter((t) => t.status === 'in_progress' || t.status === 'review');

  const getStatusLabel = (s: TaskStatus) => {
    switch (s) {
      case 'in_progress':
        return 'En Curso';
      case 'review':
        return 'En Revisión';
      case 'done':
        return 'Completado';
      case 'backlog':
      default:
        return 'Por Iniciar';
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Welcome Banner */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{config.organization}</span>
            <span aria-hidden="true">·</span>
            <span>Centro de Operaciones</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {config.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {config.tagline}
          </p>
        </div>

        {/* Quick primary actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsQuickActionOpen(true)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors ${accent.bgPrimary} ${accent.bgHover}`}
          >
            <Plus className="h-4 w-4" />
            <span>Crear Registro</span>
          </button>
          <button
            onClick={() => setActiveModule('projects')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <CheckSquare className="h-4 w-4 text-slate-500" />
            <span>Ver Tablero</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium truncate">{metric.label}</span>
              <div
                className={`flex items-center gap-1 font-mono text-xs font-medium tabular-nums ${
                  metric.isPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {metric.isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span>{metric.delta}</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="font-mono text-2xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
                {metric.value}
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {metric.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & Priority Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Interactive Performance / Activity Trend Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Rendimiento y Volumen Operativo
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Entregas, resolución de actividades y transacciones procesadas
              </p>
            </div>

            {/* Segmented Period Tabs */}
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    chartPeriod === period
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {period === '7d' ? '7 Días' : period === '30d' ? '30 Días' : '3 Meses'}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative mt-4 h-52 w-full flex items-center justify-center overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-full w-full overflow-visible"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.33, 0.66, 1].map((pct, idx) => {
                const y = paddingY + pct * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Chart Line */}
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-600 dark:text-indigo-400"
                points={pointsString}
              />

              {/* Chart Data Points */}
              {activePoints.map((p, i) => {
                const x = paddingX + (i / (activePoints.length - 1)) * (chartWidth - paddingX * 2);
                const y = chartHeight - paddingY - (p.val / maxVal) * (chartHeight - paddingY * 2);
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      className="fill-white stroke-indigo-600 dark:fill-slate-900 dark:stroke-indigo-400 cursor-pointer transition-transform hover:scale-150"
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredPoint({ x, y, val: p.val, label: p.label })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <text
                      x={x}
                      y={chartHeight - 4}
                      textAnchor="middle"
                      className="fill-slate-400 text-[10px] font-mono"
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip on hover */}
            {hoveredPoint && (
              <div
                className="pointer-events-none absolute rounded-md border border-slate-200 bg-slate-900 px-2.5 py-1 text-xs text-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
                style={{
                  left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                  top: `${hoveredPoint.y - 30}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span className="font-semibold">{hoveredPoint.label}:</span>{' '}
                <span className="font-mono tabular-nums">{hoveredPoint.val} unidades</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              Tasa de finalización proyectada en ciclo actual
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
              Objetivo: 95% alcanzado
            </span>
          </div>
        </div>

        {/* Sprint / Priority Tasks Checklist */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tareas Prioritarias
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeTasks.length} en curso o revisión
                </span>
              </div>
              <button
                onClick={() => setActiveModule('projects')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
              >
                Ver todo <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {activeTasks.slice(0, 4).map((task) => {
                const assignee = members.find((m) => m.id === task.assigneeId);
                return (
                  <div
                    key={task.id}
                    className="flex flex-col gap-1.5 rounded-lg border border-slate-100 p-2.5 bg-slate-50/50 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {task.title}
                      </span>
                      <button
                        onClick={() => moveTaskStatus(task.id, 'done')}
                        title="Marcar como completada"
                        className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>{getStatusLabel(task.status)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{task.dueDate}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{assignee?.name || 'Asignado'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsQuickActionOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Añadir Tarea Rápida</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline & Platform Template Switcher */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity Log */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Registro de Actividad Reciente
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Actualizado en tiempo real
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {activity.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 font-mono text-[11px] font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                  {act.user.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong className="font-semibold text-slate-900 dark:text-white">
                      {act.user}
                    </strong>{' '}
                    {act.action}{' '}
                    <span className="font-medium text-slate-900 dark:text-white">
                      {act.target}
                    </span>
                  </p>
                  <span className="font-mono text-[10px] text-slate-500 tabular-nums">
                    {act.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Platform Template Presets Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Plantillas de Plataforma
            </h3>
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Transforma la plataforma al instante con 1 clic para ajustarla a tu caso de uso:
          </p>

          <div className="mt-3 space-y-2">
            {PLATFORM_PRESETS.map((preset) => {
              const isCurrent = config.preset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`flex w-full items-center justify-between rounded-lg p-2.5 text-left text-xs transition-colors border ${
                    isCurrent
                      ? 'border-indigo-500/60 bg-indigo-50/50 dark:border-indigo-500/40 dark:bg-indigo-950/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex flex-col overflow-hidden pr-2">
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {preset.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {preset.badge}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="font-mono text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                      Activa
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
