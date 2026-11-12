import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Navbar } from './components/inventory/Navbar';
import { DashboardOverview } from './components/inventory/DashboardOverview';
import { AssignmentsManager } from './components/inventory/AssignmentsManager';
import { InventoryCatalog } from './components/inventory/InventoryCatalog';
import { WorkersRoster } from './components/inventory/WorkersRoster';
import { AlertsCenter } from './components/inventory/AlertsCenter';
import { DeliveryActViewer } from './components/inventory/DeliveryActViewer';
import { WarehouseSettings } from './components/inventory/WarehouseSettings';
import { LoginScreen } from './components/auth/LoginScreen';
import { NewDeliveryModal } from './components/inventory/modals/NewDeliveryModal';
import { ReturnModal } from './components/inventory/modals/ReturnModal';
import { ExtendLoanModal } from './components/inventory/modals/ExtendLoanModal';
import { WorkerCustodyModal } from './components/inventory/modals/WorkerCustodyModal';
import { ProjectsManager } from './components/inventory/ProjectsManager';
import { CompaniesManager } from './components/inventory/CompaniesManager';
import { Assignment, Worker, InventoryTab } from './types/inventory';
import {
  HardHat,
  FileCheck,
  Boxes,
  Users,
  ShieldAlert,
  Printer,
  Settings,
  FolderKanban,
  Building2,
  X,
} from 'lucide-react';

const WarehouseApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    activeTab,
    setActiveTab,
    setSelectedAssignmentForAct,
    overdueCount,
    upcomingCount,
    setActiveProjectId,
  } = useInventory();

  // If not authenticated, display login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Modals state
  const [isNewDeliveryOpen, setIsNewDeliveryOpen] = useState(false);
  const [returnAssignment, setReturnAssignment] = useState<Assignment | null>(null);
  const [extendAssignment, setExtendAssignment] = useState<Assignment | null>(null);
  const [custodyWorker, setCustodyWorker] = useState<Worker | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenReturnModal = (assignment: Assignment) => {
    setReturnAssignment(assignment);
  };

  const handleOpenExtendModal = (assignment: Assignment) => {
    setExtendAssignment(assignment);
  };

  const handleViewAct = (assignment: Assignment) => {
    setSelectedAssignmentForAct(assignment);
    setActiveTab('acts');
  };

  const handleViewWorkerAssignments = (worker: Worker) => {
    setCustodyWorker(worker);
  };

  const totalAlerts = overdueCount + upcomingCount;

  const mobileNavLinks: { id: InventoryTab; label: string; icon: typeof HardHat; badge?: number }[] = [
    { id: 'dashboard', label: 'Panel General', icon: HardHat },
    { id: 'projects', label: 'Proyectos & Obras', icon: FolderKanban },
    { id: 'assignments', label: 'Entregas & Préstamos', icon: FileCheck },
    { id: 'inventory', label: 'Inventario Maestro', icon: Boxes },
    { id: 'workers', label: 'Colaboradores', icon: Users },
    { id: 'alerts', label: 'Alertas de Vencimiento', icon: ShieldAlert, badge: totalAlerts },
    { id: 'acts', label: 'Actas de Entrega', icon: Printer },
    { id: 'companies', label: 'Empresas & Accesos', icon: Building2 },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navbar */}
      <Navbar
        onOpenNewDelivery={() => setIsNewDeliveryOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs xl:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-72 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Menú de Almacén</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="pt-2 space-y-1">
              {mobileNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-950/40 dark:text-indigo-400'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </div>
                    {typeof link.badge === 'number' && link.badge > 0 && (
                      <span className="rounded-full bg-rose-600 px-1.5 py-0.2 font-mono text-[10px] font-bold text-white">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            onOpenNewDelivery={() => setIsNewDeliveryOpen(true)}
            onOpenReturnModal={handleOpenReturnModal}
            onOpenExtendModal={handleOpenExtendModal}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsManager
            onNavigateToWorkersWithProject={(projId) => {
              setActiveProjectId(projId);
              setActiveTab('workers');
            }}
            onNavigateToAssignmentsWithProject={(projId) => {
              setActiveProjectId(projId);
              setActiveTab('assignments');
            }}
            onOpenNewDeliveryForProject={(projId) => {
              setActiveProjectId(projId);
              setIsNewDeliveryOpen(true);
            }}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsManager
            onOpenNewDelivery={() => setIsNewDeliveryOpen(true)}
            onOpenReturnModal={handleOpenReturnModal}
            onOpenExtendModal={handleOpenExtendModal}
            onViewAct={handleViewAct}
          />
        )}

        {activeTab === 'inventory' && <InventoryCatalog />}

        {activeTab === 'workers' && (
          <WorkersRoster onViewWorkerAssignments={handleViewWorkerAssignments} />
        )}

        {activeTab === 'alerts' && (
          <AlertsCenter
            onOpenReturnModal={handleOpenReturnModal}
            onOpenExtendModal={handleOpenExtendModal}
            onViewAct={handleViewAct}
          />
        )}

        {activeTab === 'acts' && <DeliveryActViewer />}

        {activeTab === 'companies' && <CompaniesManager />}

        {activeTab === 'settings' && <WarehouseSettings />}
      </main>

      {/* Overlays / Modals */}
      <NewDeliveryModal
        isOpen={isNewDeliveryOpen}
        onClose={() => setIsNewDeliveryOpen(false)}
        onDeliveryCreated={handleViewAct}
      />

      <ReturnModal
        isOpen={!!returnAssignment}
        assignment={returnAssignment}
        onClose={() => setReturnAssignment(null)}
      />

      <ExtendLoanModal
        isOpen={!!extendAssignment}
        assignment={extendAssignment}
        onClose={() => setExtendAssignment(null)}
      />

      <WorkerCustodyModal
        isOpen={!!custodyWorker}
        worker={custodyWorker}
        onClose={() => setCustodyWorker(null)}
        onOpenReturnModal={handleOpenReturnModal}
        onViewAct={handleViewAct}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <WarehouseApp />
      </InventoryProvider>
    </AuthProvider>
  );
}
