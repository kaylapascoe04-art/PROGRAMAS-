import React, { useState, useRef, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { getAccentClasses } from '../../utils/theme';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Shield,
  UserCheck,
  Briefcase,
  Layers,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../../types/platform';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const {
    config,
    updateConfig,
    activeModule,
    setActiveModule,
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsSearchOpen,
    setIsQuickActionOpen,
  } = usePlatform();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const accent = getAccentClasses(config.accentColor);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesList: { id: UserRole; label: string; icon: typeof Shield }[] = [
    { id: 'admin', label: 'Administrador (Total)', icon: Shield },
    { id: 'manager', label: 'Gestor de Proyectos', icon: Briefcase },
    { id: 'contributor', label: 'Colaborador', icon: UserCheck },
    { id: 'guest', label: 'Invitado / Auditor', icon: Layers },
  ];

  const currentRoleLabel = rolesList.find((r) => r.id === currentRole)?.label || 'Usuario';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md md:px-6 dark:border-slate-800 dark:bg-slate-900/95">
      {/* Zone 1: Mobile toggle & Brand Title wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Alternar menú lateral"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <a
          href="#dashboard"
          onClick={(e) => {
            e.preventDefault();
            setActiveModule('dashboard');
          }}
          className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 dark:text-white"
        >
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-white font-black text-sm shadow-sm ${accent.bgPrimary}`}>
            {config.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white hidden sm:inline">
            {config.name}
          </span>
        </a>
      </div>

      {/* Zone 2: Navigation Links / Breadcrumb trail */}
      <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-400">
        <button
          onClick={() => setActiveModule('dashboard')}
          className={`transition-colors whitespace-nowrap shrink-0 ${activeModule === 'dashboard' ? 'text-slate-950 font-semibold dark:text-white' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
          Panel General
        </button>
        {config.enabledModules.projects && (
          <button
            onClick={() => setActiveModule('projects')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeModule === 'projects' ? 'text-slate-950 font-semibold dark:text-white' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Tareas
          </button>
        )}
        {config.enabledModules.docs && (
          <button
            onClick={() => setActiveModule('docs')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeModule === 'docs' ? 'text-slate-950 font-semibold dark:text-white' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Documentos
          </button>
        )}
        {config.enabledModules.members && (
          <button
            onClick={() => setActiveModule('members')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeModule === 'members' ? 'text-slate-950 font-semibold dark:text-white' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Miembros
          </button>
        )}
        {config.enabledModules.analytics && (
          <button
            onClick={() => setActiveModule('analytics')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeModule === 'analytics' ? 'text-slate-950 font-semibold dark:text-white' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Analíticas
          </button>
        )}
      </nav>

      {/* Zone 3: Functional Actions cluster */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-700"
          title="Buscar en la plataforma (Cmd+K)"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden sm:inline">Buscar...</span>
          <kbd className="hidden lg:inline-flex items-center rounded border border-slate-300 px-1.5 font-mono text-[10px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((v) => !v)}
            aria-label="Notificaciones"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${accent.bgPrimary}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${accent.bgPrimary}`} />
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Notificaciones ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Marcar leídas
                  </button>
                )}
              </div>
              <div className="mt-2 max-h-72 space-y-2 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">No hay notificaciones</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`cursor-pointer rounded-lg p-2.5 transition-colors ${
                        n.read
                          ? 'bg-slate-50/60 dark:bg-slate-800/40'
                          : 'bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                          {n.title}
                        </h4>
                        <span className="font-mono text-[10px] text-slate-500 tabular-nums">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Dark/Light Switch */}
        <button
          onClick={() => updateConfig({ darkMode: !config.darkMode })}
          aria-label="Cambiar tema claro / oscuro"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {config.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Role Switcher Popover */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleOpen((v) => !v)}
            aria-label="Cambiar rol de usuario"
            className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Shield className="h-3.5 w-3.5 text-slate-500" />
            <span className="max-w-[110px] truncate">{currentRoleLabel.split(' ')[0]}</span>
          </button>

          {isRoleOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                Cambiar Rol de Vista
              </div>
              <div className="mt-1 space-y-1">
                {rolesList.map((r) => {
                  const Icon = r.icon;
                  const isSelected = r.id === currentRole;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setCurrentRole(r.id);
                        setIsRoleOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-slate-500" />
                        <span>{r.label}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setIsQuickActionOpen(true)}
          className={`flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-medium text-white shadow-sm transition-colors whitespace-nowrap shrink-0 ${accent.bgPrimary} ${accent.bgHover}`}
        >
          <Plus className="h-4 w-4" />
          <span className="font-semibold">Nuevo Registro</span>
        </button>
      </div>
    </header>
  );
};
