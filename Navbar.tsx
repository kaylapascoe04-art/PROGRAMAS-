import React, { useState, useRef, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import { PlatformLogo } from '../common/PlatformLogo';
import {
  Wrench,
  ShieldAlert,
  HardHat,
  Users,
  FileCheck,
  Settings,
  Plus,
  Sun,
  Moon,
  AlertTriangle,
  Boxes,
  Menu,
  X,
  LogOut,
  ChevronDown,
  User,
  Check,
  FolderKanban,
  Building2,
} from 'lucide-react';
import { InventoryTab } from '../../types/inventory';

interface NavbarProps {
  onOpenNewDelivery: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewDelivery,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const {
    config,
    updateConfig,
    activeTab,
    setActiveTab,
    overdueCount,
    upcomingCount,
    projects,
    activeProjectId,
    setActiveProjectId,
    companies,
    activeCompanyId,
    setActiveCompanyId,
  } = useInventory();

  const { currentUser, logout, switchUser, availableAccounts } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalAlerts = overdueCount + upcomingCount;

  const navLinks: { id: InventoryTab; label: string; icon: typeof Wrench; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Panel General', icon: HardHat },
    { id: 'projects', label: 'Proyectos & Obras', icon: FolderKanban },
    { id: 'assignments', label: 'Entregas & Préstamos', icon: FileCheck },
    { id: 'inventory', label: 'Inventario Maestro', icon: Boxes },
    { id: 'workers', label: 'Colaboradores', icon: Users },
    {
      id: 'alerts',
      label: 'Alertas de Vencimiento',
      icon: ShieldAlert,
      badge: totalAlerts,
      badgeColor: overdueCount > 0 ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white',
    },
    { id: 'acts', label: 'Actas de Entrega', icon: FileCheck },
    { id: 'companies', label: 'Empresas & Accesos', icon: Building2 },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md md:px-6 dark:border-slate-800 dark:bg-slate-900/95">
      {/* Zone 1: Single text element wordmark with brand icon/custom logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menú de navegación"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 xl:hidden dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <a
          href="#dashboard"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('dashboard');
          }}
          className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 dark:text-white"
        >
          <PlatformLogo config={config} size="md" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-none text-slate-900 dark:text-white">
              {config.platformTitle || 'Control Herramientas & EPP'}
            </span>
            <span className="text-[11px] font-normal text-slate-500 leading-tight dark:text-slate-400 hidden sm:inline">
              {config.companyName}
            </span>
          </div>
        </a>
      </div>

      {/* Zone 2: Navigation Links (single-line, clean unboxed with subtle hover) */}
      <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-400">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'text-indigo-600 font-semibold dark:text-indigo-400'
                  : 'hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>{link.label}</span>
              {typeof link.badge === 'number' && link.badge > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold tabular-nums ${link.badgeColor}`}
                >
                  {link.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Functional Actions cluster */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Global Company Multi-Tenant Selector */}
        <div className="hidden md:flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-medium">Empresa:</span>
          <select
            value={activeCompanyId}
            onChange={(e) => setActiveCompanyId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white max-w-[160px] truncate"
            title="Seleccionar empresa activa (aislamiento de inventario, colaboradores y actas)"
          >
            <option value="all">🌐 Todas las empresas</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                🏢 {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Global Project Focus Selector */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-medium">Obra:</span>
          <select
            value={activeProjectId}
            onChange={(e) => setActiveProjectId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white max-w-[150px] truncate"
            title="Filtrar vista por proyecto / obra activa"
          >
            <option value="all">Todas las obras ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Expiration Alert Indicator */}
        {totalAlerts > 0 && (
          <button
            onClick={() => setActiveTab('alerts')}
            title={`${overdueCount} entregas vencidas y ${upcomingCount} por vencer`}
            className={`hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              overdueCount > 0
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="font-mono tabular-nums">
              {overdueCount > 0 ? `${overdueCount} Vencidas` : `${upcomingCount} Por vencer`}
            </span>
          </button>
        )}

        {/* Theme Dark/Light Switch */}
        <button
          onClick={() => updateConfig({ darkMode: !config.darkMode })}
          aria-label="Cambiar modo oscuro / claro"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {config.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Primary CTA: Nueva Entrega */}
        <button
          onClick={onOpenNewDelivery}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nueva Entrega</span>
        </button>

        {/* User Profile & Account Dropdown */}
        {currentUser && (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 sm:pr-2.5 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-bold text-white ${
                  currentUser.avatarBg || 'bg-indigo-600'
                }`}
              >
                {currentUser.name
                  .split(' ')
                  .map((w) => w[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 text-xs shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                {/* Current User Info */}
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {currentUser.email}
                  </div>
                  <div className="mt-1 inline-block rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {currentUser.role}
                  </div>
                </div>

                {/* Switch Supervisor Accounts */}
                <div className="pt-2">
                  <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cambiar de Supervisor
                  </div>
                  <div className="space-y-1">
                    {availableAccounts.map((acc) => {
                      const isSelected = acc.id === currentUser.id;
                      return (
                        <button
                          key={acc.id}
                          onClick={() => {
                            switchUser(acc.id);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-lg p-2 text-left transition-colors ${
                            isSelected
                              ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white'
                              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="truncate pr-1">
                            <div className="text-xs truncate">{acc.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{acc.email}</div>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Logout Action */}
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 rounded-lg p-2 text-rose-600 hover:bg-rose-50 transition-colors dark:text-rose-400 dark:hover:bg-rose-950/30"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
