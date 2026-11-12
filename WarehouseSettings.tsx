import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PlatformLogo } from '../common/PlatformLogo';
import {
  Settings,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertTriangle,
  Building,
  User,
  Users,
  Image,
  Sparkles,
  Link,
  Trash2,
} from 'lucide-react';

export const WarehouseSettings: React.FC = () => {
  const {
    config,
    updateConfig,
    exportBackupJSON,
    importBackupJSON,
    resetAllData,
  } = useInventory();

  // Company and general
  const [platformTitle, setPlatformTitle] = useState(config.platformTitle || 'Control Herramientas & EPP');
  const [companyName, setCompanyName] = useState(config.companyName);
  const [facilityName, setFacilityName] = useState(config.facilityName);
  const [warningDaysThreshold, setWarningDaysThreshold] = useState(config.warningDaysThreshold);
  const [defaultLoanDaysTools, setDefaultLoanDaysTools] = useState(config.defaultLoanDaysTools);

  // Logo settings
  const [logoPreset, setLogoPreset] = useState<'shield' | 'helmet' | 'crane' | 'gear' | 'custom'>(
    config.logoPreset || 'shield'
  );
  const [logoUrl, setLogoUrl] = useState(config.logoUrl || '');

  // 3 Official Delivery Supervisors
  const [supervisor1Name, setSupervisor1Name] = useState(config.supervisor1Name || config.supervisorName || 'Ing. Rodrigo Cárdenas');
  const [supervisor1Role, setSupervisor1Role] = useState(config.supervisor1Role || config.supervisorRole || 'Jefe de Almacén y Control de Herramientas');
  const [supervisor1Email, setSupervisor1Email] = useState(config.supervisor1Email || 'almacen@empresa.com');

  const [supervisor2Name, setSupervisor2Name] = useState(config.supervisor2Name || 'Lic. Marcela Ríos Soto');
  const [supervisor2Role, setSupervisor2Role] = useState(config.supervisor2Role || 'Supervisora de Seguridad y Salud (SST / HSE)');
  const [supervisor2Email, setSupervisor2Email] = useState(config.supervisor2Email || 'sst@empresa.com');

  const [supervisor3Name, setSupervisor3Name] = useState(config.supervisor3Name || 'Ing. Carlos Mendoza');
  const [supervisor3Role, setSupervisor3Role] = useState(config.supervisor3Role || 'Jefe de Operaciones y Residente de Obra');
  const [supervisor3Email, setSupervisor3Email] = useState(config.supervisor3Email || 'operaciones@empresa.com');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoUrl(dataUrl);
      setLogoPreset('custom');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      platformTitle: platformTitle.trim() || 'Control Herramientas & EPP',
      companyName: companyName.trim() || 'Constructora Atlas S.A.',
      facilityName: facilityName.trim() || 'Almacén Central',
      supervisorName: supervisor1Name.trim(),
      supervisorRole: supervisor1Role.trim(),
      supervisor1Name: supervisor1Name.trim(),
      supervisor1Role: supervisor1Role.trim(),
      supervisor1Email: supervisor1Email.trim(),
      supervisor2Name: supervisor2Name.trim(),
      supervisor2Role: supervisor2Role.trim(),
      supervisor2Email: supervisor2Email.trim(),
      supervisor3Name: supervisor3Name.trim(),
      supervisor3Role: supervisor3Role.trim(),
      supervisor3Email: supervisor3Email.trim(),
      logoPreset,
      logoUrl: logoUrl.trim(),
      warningDaysThreshold: Number(warningDaysThreshold) || 3,
      defaultLoanDaysTools: Number(defaultLoanDaysTools) || 7,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupJSON(content);
      if (success) {
        setImportStatus('Copia de seguridad restaurada correctamente.');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Error: Archivo de respaldo no válido.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const previewConfig = {
    ...config,
    companyName: companyName || config.companyName,
    facilityName: facilityName || config.facilityName,
    logoUrl,
    logoPreset,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Configuración del Sistema de Almacén y Custodia
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personaliza el logo corporativo, los tres responsables oficiales de entrega y los plazos de vencimiento
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. Personalización del Logo e Identidad Visual */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Personalización del Logo e Identidad Corporativa
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Visible en barra superior, login y actas</span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Live Preview Card */}
            <div className="md:col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Vista Previa del Logo
              </span>
              <div className="mt-3 flex justify-center">
                <PlatformLogo config={previewConfig} size="xl" />
              </div>
              <div className="mt-3 font-bold text-slate-900 dark:text-white text-xs truncate">
                {companyName || config.companyName}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {facilityName || config.facilityName}
              </div>

              {logoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoUrl('');
                    setLogoPreset('shield');
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Quitar logo subido</span>
                </button>
              )}
            </div>

            {/* Logo Options */}
            <div className="md:col-span-8 space-y-4">
              {/* Presets */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Seleccionar Logo Industrial Predefinido
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'shield', label: '🛡️ Seguridad SST' },
                    { id: 'helmet', label: '👷 Casco de Obra' },
                    { id: 'crane', label: '🏗️ Ingeniería' },
                    { id: 'gear', label: '⚙️ Logística' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setLogoPreset(p.id as any);
                        setLogoUrl('');
                      }}
                      className={`p-2 rounded-lg border text-xs font-semibold text-center transition-all ${
                        logoPreset === p.id && !logoUrl
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/40 dark:text-indigo-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload or URL */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subir Imagen de Logo Propio (PNG, SVG, JPG máx 2MB)
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <Upload className="h-4 w-4" />
                    <span>Seleccionar Archivo de Imagen...</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    O pegar URL web del logo
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Link className="h-3.5 w-3.5" />
                    </div>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => {
                        setLogoUrl(e.target.value);
                        setLogoPreset('custom');
                      }}
                      placeholder="https://ejemplo.com/logo-empresa.png"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Tres Responsables Oficiales para la Entrega */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Tres Responsables Oficiales para las Entregas y Actas
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Preconfigurados en cada acta oficial</span>
          </div>

          <div className="mt-4 space-y-4">
            {/* Responsable 1 */}
            <div className="rounded-lg border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">1</span>
                <span>Responsable 1: Almacén / Emisor Principal</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-500">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={supervisor1Name}
                    onChange={(e) => setSupervisor1Name(e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500">Cargo / Función</label>
                  <input
                    type="text"
                    required
                    value={supervisor1Role}
                    onChange={(e) => setSupervisor1Role(e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500">Correo Electrónico</label>
                  <input
                    type="email"
                    value={supervisor1Email}
                    onChange={(e) => setSupervisor1Email(e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Responsable 2 */}
            <div className="rounded-lg border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">2</span>
                <span>Responsable 2: Seguridad y Salud en el Trabajo (SST / HSE)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-500">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={supervisor2Name}
                    onChange={(e) => setSupervisor2Name(e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500">Cargo / Función</label>
                  <input
                    type="text"
                    required
                    value={supervisor2Role}
                    onChange={(e) => setSupervisor2Role(e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500">Correo Electrónico</label>
                  <input
                    type="email"
                    value={supervisor2Email}
                    onChange={(e) => setSupervisor2Email(e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Responsable 3 */}
            <div className="rounded-lg border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">3</span>
                <span>Responsable 3: Jefatura de Área / Operaciones en Campo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-500">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={supervisor3Name}
                    onChange={(e) => setSupervisor3Name(e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500">Cargo / Función</label>
                  <input
                    type="text"
                    required
                    value={supervisor3Role}
                    onChange={(e) => setSupervisor3Role(e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500">Correo Electrónico</label>
                  <input
                    type="email"
                    value={supervisor3Email}
                    onChange={(e) => setSupervisor3Email(e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Parámetros de Alerta y Datos de Instalación */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Datos Institucionales y Parámetros Operativos
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Nombre de la Plataforma / Aplicación (Encabezado y Marca)
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Control Herramientas & EPP o Portal de Custodia Industrial"
                value={platformTitle}
                onChange={(e) => setPlatformTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Este nombre aparece en la barra superior junto al logo corporativo.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Razón Social / Empresa Activa
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nombre del Almacén o Planta Operativa
                </label>
                <input
                  type="text"
                  required
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Días de Anticipación para Alerta Amarilla
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={warningDaysThreshold}
                onChange={(e) => setWarningDaysThreshold(parseInt(e.target.value) || 3)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Alerta &quot;Por Vencer&quot; cuando falten estos días para el retorno o recambio.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Plazo por Defecto de Préstamo de Herramientas (días)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                required
                value={defaultLoanDaysTools}
                onChange={(e) => setDefaultLoanDaysTools(parseInt(e.target.value) || 7)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Días sugeridos automáticamente al generar una nueva entrega.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <Check className="h-4 w-4" /> Parámetros y logo actualizados con éxito
              </span>
            ) : <span />}

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      </form>

      {/* 4. Publicación y Despliegue en la Nube (100% Gratis) */}
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white p-6 dark:border-indigo-900/50 dark:from-indigo-950/20 dark:to-slate-900 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-100 dark:border-indigo-900/40">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Publicación y Despliegue Web ($0 Costo)
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Publica tu sistema en internet para usarlo con tu equipo y clientes sin pagar un solo centavo.
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            100% GRATUITO
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Opción 1: Netlify Drop */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-xs">Opción Más Rápida: Netlify Drop</span>
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                2 Minutos
              </span>
            </div>
            <p className="mt-1 text-slate-500 text-[11px]">
              Descarga la versión compilada ya lista. Solo arrastras el archivo a Netlify y tu página estará en vivo al instante.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/dist_listo.zip"
                download="dist_listo.zip"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Descargar Web Lista (.zip)</span>
              </a>
              <a
                href="https://app.netlify.com/drop"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Link className="h-3.5 w-3.5" />
                <span>Abrir Netlify Drop</span>
              </a>
            </div>
          </div>

          {/* Opción 2: Subir a GitHub */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-xs">Para tu Repositorio GitHub</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                GitHub Pages
              </span>
            </div>
            <p className="mt-1 text-slate-500 text-[11px]">
              Descarga el código fuente completo del proyecto para subirlo a tu repositorio <code className="font-mono text-indigo-600">PROGRAMAS-</code>.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/codigo_fuente.zip"
                download="codigo_fuente.zip"
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Descargar Código Fuente (.zip)</span>
              </a>
              <a
                href="https://github.com/kaylapascoe04-art/PROGRAMAS-/upload/main"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Subir a mi GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Copias de Seguridad */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 text-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Copias de Seguridad y Respaldo
        </h3>

        {importStatus && (
          <div className="mt-3 rounded-lg bg-indigo-50 p-2.5 text-xs text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
            {importStatus}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white">Exportar Respaldo JSON</h4>
            <p className="mt-1 text-slate-500 text-[11px]">
              Descarga la base de datos completa de entregas, inventario y personal.
            </p>
            <button
              onClick={exportBackupJSON}
              className="mt-3 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Descargar JSON</span>
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white">Restaurar Copia</h4>
            <p className="mt-1 text-slate-500 text-[11px]">
              Carga un archivo de respaldo JSON generado previamente.
            </p>
            <label className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Upload className="h-3.5 w-3.5" />
              <span>Importar JSON</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>

          <div className="rounded-lg border border-rose-200 bg-rose-50/20 p-4 dark:border-rose-950/40">
            <h4 className="font-bold text-rose-700 dark:text-rose-400">Restablecer Datos de Demostración</h4>
            <p className="mt-1 text-rose-600/80 text-[11px]">
              Borra los cambios y reinicia con los datos de ejemplo del almacén.
            </p>
            <button
              onClick={() => {
                if (window.confirm('¿Deseas reiniciar los datos a su estado inicial?')) {
                  resetAllData();
                }
              }}
              className="mt-3 flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reiniciar Datos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
