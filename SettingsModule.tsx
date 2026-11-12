import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { getAccentClasses } from '../../utils/theme';
import {
  Settings,
  Sparkles,
  Palette,
  Layers,
  Database,
  Download,
  Upload,
  RotateCcw,
  Check,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { AccentColor, PresetType } from '../../types/platform';
import { PLATFORM_PRESETS } from '../../data/initialData';

export const SettingsModule: React.FC = () => {
  const {
    config,
    updateConfig,
    applyPreset,
    exportDataJSON,
    importDataJSON,
    resetAllDefaults,
  } = usePlatform();

  const accent = getAccentClasses(config.accentColor);

  // Local state for platform metadata form
  const [name, setName] = useState(config.name);
  const [organization, setOrganization] = useState(config.organization);
  const [tagline, setTagline] = useState(config.tagline);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const colors: { id: AccentColor; label: string; class: string }[] = [
    { id: 'indigo', label: 'Índigo Real', class: 'bg-indigo-600' },
    { id: 'emerald', label: 'Esmeralda', class: 'bg-emerald-600' },
    { id: 'violet', label: 'Violeta', class: 'bg-violet-600' },
    { id: 'amber', label: 'Ámbar Cálido', class: 'bg-amber-600' },
    { id: 'blue', label: 'Azul Océano', class: 'bg-blue-600' },
    { id: 'rose', label: 'Rosa Rubí', class: 'bg-rose-600' },
  ];

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      name: name.trim() || 'Aura Workspace',
      organization: organization.trim() || 'Organización',
      tagline: tagline.trim() || 'Centro de operaciones',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleToggleModule = (key: keyof typeof config.enabledModules) => {
    updateConfig({
      enabledModules: {
        ...config.enabledModules,
        [key]: !config.enabledModules[key],
      },
    });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        setImportStatus('Datos importados con éxito. Recargando plataforma...');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Error: Formato de archivo JSON inválido');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Configuración y Personalización de Plataforma
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personaliza la identidad visual, activa módulos y administra copias de seguridad de datos
        </p>
      </div>

      {/* Section 1: Presets & Templates */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Plantillas Prediseñadas de Plataforma
          </h2>
        </div>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          Selecciona una plantilla para adaptar la identidad y propósito del sistema con 1 clic:
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PLATFORM_PRESETS.map((preset) => {
            const isSelected = config.preset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => {
                  applyPreset(preset.id);
                  setName(preset.sampleConfig.name || name);
                  setOrganization(preset.sampleConfig.organization || organization);
                  setTagline(preset.sampleConfig.tagline || tagline);
                }}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs dark:border-indigo-400 dark:bg-indigo-950/30'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                      {preset.badge}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {preset.name}
                    </h3>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  {preset.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Brand Identity */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Settings className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Identidad de Marca y Textos
          </h2>
        </div>

        <form onSubmit={handleSaveBrand} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Nombre de la Plataforma
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Organización o Empresa
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Lema o Propósito Operativo
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <Check className="h-4 w-4" /> Cambios guardados correctamente
              </span>
            ) : <span />}

            <button
              type="submit"
              className={`rounded-lg px-4 py-2 font-semibold text-white shadow-sm transition-colors ${accent.bgPrimary} ${accent.bgHover}`}
            >
              Actualizar Identidad
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: Accent Color Palette */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Palette className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Color de Acento de la Interfaz
          </h2>
        </div>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          Aplica un matiz visual coherente en botones principales, estados activos y gráficas:
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {colors.map((c) => {
            const isSelected = config.accentColor === c.id;
            return (
              <button
                key={c.id}
                onClick={() => updateConfig({ accentColor: c.id })}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left text-xs transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-slate-100 font-bold dark:border-white dark:bg-slate-800'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className={`h-4 w-4 rounded-full ${c.class} shadow-2xs shrink-0`} />
                <span className="truncate text-slate-900 dark:text-white">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 4: Module Toggles */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Layers className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Módulos Visibles en la Plataforma
          </h2>
        </div>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          Activa o desactiva secciones según las necesidades de tu equipo:
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { key: 'dashboard', label: 'Panel de Control General', desc: 'Métricas, gráficas y estado general' },
            { key: 'projects', label: 'Gestión de Tareas (Kanban)', desc: 'Tablero interactivo y flujo de trabajo' },
            { key: 'docs', label: 'Base de Documentos & Wiki', desc: 'Editor y archivo de especificaciones' },
            { key: 'members', label: 'Directorio de Miembros', desc: 'Administración de usuarios y roles' },
            { key: 'analytics', label: 'Métricas y Analíticas', desc: 'Gráficos de rendimiento y descargas CSV' },
          ].map((mod) => {
            const isEnabled = config.enabledModules[mod.key as keyof typeof config.enabledModules];
            return (
              <div
                key={mod.key}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3.5 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {mod.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {mod.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleModule(mod.key as keyof typeof config.enabledModules)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    isEnabled ? accent.bgPrimary : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                      isEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: Data Backup & Reset */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Database className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Copias de Seguridad y Respaldo de Datos
          </h2>
        </div>

        {importStatus && (
          <div className="mt-3 rounded-lg bg-indigo-50 p-2.5 text-xs text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
            {importStatus}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Descargar Respaldo JSON
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Guarda tus tareas, documentos, miembros y ajustes en un archivo seguro.
            </p>
            <button
              onClick={exportDataJSON}
              className="mt-3 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar JSON</span>
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Restaurar desde Respaldo
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Carga un archivo de respaldo JSON previamente descargado.
            </p>
            <label className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Upload className="h-3.5 w-3.5" />
              <span>Cargar JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          <div className="rounded-lg border border-rose-200 bg-rose-50/30 p-4 dark:border-rose-950/60 dark:bg-rose-950/10">
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">
              Restablecer Valores Iniciales
            </h4>
            <p className="mt-1 text-[11px] text-rose-600/80 dark:text-rose-400/70">
              Borra los cambios locales y restaura la base de datos de ejemplo.
            </p>
            <button
              onClick={() => {
                if (window.confirm('¿Deseas restablecer todos los datos a sus valores iniciales?')) {
                  resetAllDefaults();
                }
              }}
              className="mt-3 flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
