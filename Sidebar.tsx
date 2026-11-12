import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { getAccentClasses } from '../../utils/theme';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { ActiveModule } from '../../types/platform';
import { PLATFORM_PRESETS } from '../../data/initialData';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    config,
    activeModule,
    setActiveModule,
    members,
    currentRole,
  } = usePlatform();

  const accent = getAccentClasses(config.accentColor);
  const activePreset = PLATFORM_PRESETS.find((p) => p.id === config.preset) || PLATFORM_PRESETS[0];
  const currentUser = members.find((m) => m.role === currentRole) || members[0];

  const navItems: { id: ActiveModule; label: string; icon: typeof LayoutDashboard; enabled: boolean }[] = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard, enabled: config.enabledModules.dashboard },
    { id: 'projects', label: 'Tareas & Proyectos', icon: CheckSquare, enabled: config.enabledModules.projects },
    { id: 'docs', label: 'Base de Documentos', icon: FileText, enabled: config.enabledModules.docs },
    { id: 'members', label: 'Directorio de Equipo', icon: Users, enabled: config.enabledModules.members },
    { id: 'analytics', label: 'Analíticas & Reportes', icon: BarChart3, enabled: config.enabledModules.analytics },
    { id: 'settings', label: 'Configuración de Plataforma', icon: Settings, enabled: config.enabledModules.settings },
  ];

  const handleNavClick = (mod: ActiveModule) => {
    setActiveModule(mod);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Brand Lockup */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-sm shadow-sm ${accent.bgPrimary}`}>
              {config.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {config.name}
              </span>
              <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                {config.organization}
              </span>
            </div>
          </div>
        </div>

        {/* Preset Badge banner */}
        <div className="px-4 pt-4 pb-2">
          <div
            onClick={() => handleNavClick('settings')}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 text-xs cursor-pointer hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Sparkles className={`h-4 w-4 shrink-0 ${accent.textPrimary}`} />
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                  Plantilla Activa
                </span>
                <span className="truncate font-medium text-slate-900 dark:text-white">
                  {activePreset.name.split(' ')[0]}
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Módulos Principales
          </div>
          {navItems
            .filter((item) => item.enabled)
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? `${accent.bgLight} ${accent.textPrimary} font-semibold`
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? accent.textPrimary : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
        </div>

        {/* Footer User Profile Widget */}
        <div className="border-t border-slate-200 p-3.5 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white font-medium text-xs ${currentUser.avatarBg}`}>
                {currentUser.avatarInitials}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                  {currentUser.name}
                </span>
                <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {currentUser.roleLabel}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('settings')}
              title="Ajustes de Plataforma"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
