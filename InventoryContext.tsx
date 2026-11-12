import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  InventoryItem,
  Worker,
  Assignment,
  WarehouseConfig,
  InventoryTab,
  AlertNotification,
  AssignmentStatus,
  ItemCondition,
  Project,
  Company,
} from '../types/inventory';
import {
  DEFAULT_WAREHOUSE_CONFIG,
  INITIAL_ITEMS,
  INITIAL_WORKERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_PROJECTS,
  INITIAL_COMPANIES,
} from '../data/inventorySeed';

interface InventoryContextType {
  // Companies / Multi-Tenant
  companies: Company[];
  activeCompanyId: string | 'all';
  setActiveCompanyId: (id: string | 'all') => void;
  activeCompany: Company;
  addCompany: (comp: Omit<Company, 'id' | 'createdAt'>) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // State (filtered by activeCompanyId for strict tenant isolation)
  items: InventoryItem[];
  workers: Worker[];
  assignments: Assignment[];
  projects: Project[];
  allProjects: Project[]; // All projects across companies for superadmin reference
  activeProjectId: string | 'all';
  setActiveProjectId: (id: string | 'all') => void;
  config: WarehouseConfig;
  activeTab: InventoryTab;
  setActiveTab: (tab: InventoryTab) => void;
  selectedAssignmentForAct: Assignment | null;
  setSelectedAssignmentForAct: (assignment: Assignment | null) => void;

  // Alerts
  alerts: AlertNotification[];
  overdueCount: number;
  replacementDueCount: number;
  upcomingCount: number;

  // Assignment Actions
  createAssignment: (data: Omit<Assignment, 'id' | 'status'>) => Assignment;
  registerReturn: (
    assignmentId: string,
    conditionOnReturn: ItemCondition,
    incidentReport?: string
  ) => void;
  extendLoan: (assignmentId: string, newDueDate: string, reason?: string) => void;
  deleteAssignment: (id: string) => void;

  // Catalog / Inventory Actions
  addItem: (item: Omit<InventoryItem, 'id' | 'stockAvailable' | 'stockAssigned' | 'stockMaintenance'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;

  // Worker Actions
  addWorker: (worker: Omit<Worker, 'id' | 'joinedDate'>) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  assignWorkerToProject: (workerId: string, projectId: string) => void;

  // Project Actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Global Config & Backup
  updateConfig: (updates: Partial<WarehouseConfig>) => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonStr: string) => boolean;
  resetAllData: () => void;
  exportAssignmentsCSV: () => void;
}

const STORAGE_KEY = 'control_herramientas_epp_v2';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Companies state
  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_companies`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_COMPANIES;
  });

  const [activeCompanyId, setActiveCompanyIdState] = useState<string | 'all'>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_active_company_id`);
      return saved || 'comp-atlas';
    } catch {
      return 'comp-atlas';
    }
  });

  const activeCompany: Company = useMemo(() => {
    const found = companies.find((c) => c.id === activeCompanyId);
    return found || companies[0] || INITIAL_COMPANIES[0];
  }, [companies, activeCompanyId]);

  // 2. Global config state (synced with active company)
  const [config, setConfig] = useState<WarehouseConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_config`);
      return saved ? { ...DEFAULT_WAREHOUSE_CONFIG, ...JSON.parse(saved) } : DEFAULT_WAREHOUSE_CONFIG;
    } catch {
      return DEFAULT_WAREHOUSE_CONFIG;
    }
  });

  // When active company changes, synchronize the official company profile, supervisors and logo
  const setActiveCompanyId = (id: string | 'all') => {
    setActiveCompanyIdState(id);
    localStorage.setItem(`${STORAGE_KEY}_active_company_id`, id);

    if (id !== 'all') {
      const targetCompany = companies.find((c) => c.id === id);
      if (targetCompany) {
        setConfig((prev) => ({
          ...prev,
          companyId: targetCompany.id,
          companyName: targetCompany.name,
          facilityName: targetCompany.facilityName,
          logoPreset: targetCompany.logoPreset || 'shield',
          logoUrl: targetCompany.logoUrl || '',
          supervisor1Name: targetCompany.supervisor1Name,
          supervisor1Role: targetCompany.supervisor1Role,
          supervisor1Email: targetCompany.supervisor1Email,
          supervisor2Name: targetCompany.supervisor2Name,
          supervisor2Role: targetCompany.supervisor2Role,
          supervisor2Email: targetCompany.supervisor2Email,
          supervisor3Name: targetCompany.supervisor3Name,
          supervisor3Role: targetCompany.supervisor3Role,
          supervisor3Email: targetCompany.supervisor3Email,
        }));
      }
    }
  };

  const [activeTab, setActiveTab] = useState<InventoryTab>('dashboard');
  const [selectedAssignmentForAct, setSelectedAssignmentForAct] = useState<Assignment | null>(null);

  // 3. Raw master datasets (with companyId)
  const [allItems, setAllItems] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_items`);
      return saved ? JSON.parse(saved) : INITIAL_ITEMS.map((it) => ({ ...it, companyId: it.companyId || 'comp-atlas' }));
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [allWorkers, setAllWorkers] = useState<Worker[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_workers`);
      return saved ? JSON.parse(saved) : INITIAL_WORKERS.map((w) => ({ ...w, companyId: w.companyId || 'comp-atlas' }));
    } catch {
      return INITIAL_WORKERS;
    }
  });

  const [allAssignments, setAllAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS.map((a) => ({ ...a, companyId: a.companyId || 'comp-atlas' }));
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [allProjects, setAllProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS.map((p) => ({ ...p, companyId: p.companyId || 'comp-atlas' }));
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [activeProjectId, setActiveProjectId] = useState<string | 'all'>('all');

  // Dark mode synchronization
  useEffect(() => {
    const root = document.documentElement;
    if (config.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [config.darkMode]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_companies`, JSON.stringify(companies));
      localStorage.setItem(`${STORAGE_KEY}_config`, JSON.stringify(config));
      localStorage.setItem(`${STORAGE_KEY}_items`, JSON.stringify(allItems));
      localStorage.setItem(`${STORAGE_KEY}_workers`, JSON.stringify(allWorkers));
      localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(allAssignments));
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(allProjects));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [companies, config, allItems, allWorkers, allAssignments, allProjects]);

  // Dynamic status evaluation: compare due date with today
  const evaluatedAssignments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allAssignments.map((a) => {
      const requiresReturn = a.requiresReturn ?? true;
      const deliveryType = a.deliveryType ?? (requiresReturn ? 'prestamo_retornable' : 'dotacion_definitiva');

      if (a.status === 'devuelto' || a.status === 'baja') {
        return {
          ...a,
          requiresReturn,
          deliveryType,
        };
      }
      const due = new Date(a.dueDate);
      due.setHours(0, 0, 0, 0);

      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      let computedStatus: AssignmentStatus = 'activo';
      if (diffDays < 0) {
        computedStatus = 'vencido';
      } else if (diffDays <= config.warningDaysThreshold) {
        computedStatus = 'proximo_vencer';
      }

      return {
        ...a,
        status: computedStatus,
        requiresReturn,
        deliveryType,
      };
    });
  }, [allAssignments, config.warningDaysThreshold]);

  // 4. Strict Tenant Isolation: Filtered sets by activeCompanyId
  const items = useMemo(() => {
    if (activeCompanyId === 'all') return allItems;
    return allItems.filter((it) => it.companyId === activeCompanyId || !it.companyId);
  }, [allItems, activeCompanyId]);

  const workers = useMemo(() => {
    if (activeCompanyId === 'all') return allWorkers;
    return allWorkers.filter((w) => w.companyId === activeCompanyId || !w.companyId);
  }, [allWorkers, activeCompanyId]);

  const assignments = useMemo(() => {
    if (activeCompanyId === 'all') return evaluatedAssignments;
    return evaluatedAssignments.filter((a) => a.companyId === activeCompanyId || !a.companyId);
  }, [evaluatedAssignments, activeCompanyId]);

  const projects = useMemo(() => {
    if (activeCompanyId === 'all') return allProjects;
    return allProjects.filter((p) => p.companyId === activeCompanyId || !p.companyId);
  }, [allProjects, activeCompanyId]);

  // Compute Alerts for current filtered assignments
  const alerts: AlertNotification[] = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const list: AlertNotification[] = [];

    assignments.forEach((a) => {
      if (a.status === 'devuelto' || a.status === 'baja') return;

      const due = new Date(a.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      const isOverdue = diffDays < 0;
      const isUpcoming = diffDays >= 0 && diffDays <= config.warningDaysThreshold;

      if (isOverdue || isUpcoming) {
        list.push({
          id: `alt-${a.id}`,
          assignmentId: a.id,
          itemCategory: a.itemCategory,
          itemName: a.itemName,
          itemCode: a.itemCode,
          workerName: a.workerName,
          workerDepartment: a.workerDepartment,
          dueDate: a.dueDate,
          daysDiff: diffDays,
          severity: isOverdue ? 'vencido' : 'por_vencer',
          status: a.status,
          requiresReturn: a.requiresReturn,
          alertType: a.requiresReturn
            ? isOverdue
              ? 'devolucion_vencida'
              : 'devolucion_proxima'
            : isOverdue
            ? 'reposicion_vencida'
            : 'reposicion_proxima',
        });
      }
    });

    return list.sort((a, b) => a.daysDiff - b.daysDiff);
  }, [assignments, config.warningDaysThreshold]);

  const overdueCount = alerts.filter(
    (al) => al.alertType === 'devolucion_vencida'
  ).length;

  const replacementDueCount = alerts.filter(
    (al) => al.alertType === 'reposicion_vencida'
  ).length;

  const upcomingCount = alerts.filter(
    (al) => al.alertType === 'devolucion_proxima' || al.alertType === 'reposicion_proxima'
  ).length;

  // Multi-Company Actions
  const addCompany = (compData: Omit<Company, 'id' | 'createdAt'>): Company => {
    const cleanCode = (compData.code || 'EMP').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newCompany: Company = {
      ...compData,
      id: `comp-${Date.now().toString().slice(-4)}`,
      code: cleanCode,
      createdAt: new Date().toISOString().split('T')[0],
      status: compData.status || 'activa',
    };

    setCompanies((prev) => [...prev, newCompany]);
    setActiveCompanyId(newCompany.id);
    return newCompany;
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    if (activeCompanyId === id) {
      setConfig((prev) => ({
        ...prev,
        companyName: updates.name || prev.companyName,
        facilityName: updates.facilityName || prev.facilityName,
        logoPreset: updates.logoPreset || prev.logoPreset,
        logoUrl: updates.logoUrl !== undefined ? updates.logoUrl : prev.logoUrl,
        supervisor1Name: updates.supervisor1Name || prev.supervisor1Name,
        supervisor1Role: updates.supervisor1Role || prev.supervisor1Role,
        supervisor1Email: updates.supervisor1Email || prev.supervisor1Email,
        supervisor2Name: updates.supervisor2Name || prev.supervisor2Name,
        supervisor2Role: updates.supervisor2Role || prev.supervisor2Role,
        supervisor2Email: updates.supervisor2Email || prev.supervisor2Email,
        supervisor3Name: updates.supervisor3Name || prev.supervisor3Name,
        supervisor3Role: updates.supervisor3Role || prev.supervisor3Role,
        supervisor3Email: updates.supervisor3Email || prev.supervisor3Email,
      }));
    }
  };

  const deleteCompany = (id: string) => {
    if (companies.length <= 1) {
      alert('Debe existir al menos una empresa registrada en la plataforma.');
      return;
    }
    const remaining = companies.filter((c) => c.id !== id);
    setCompanies(remaining);
    if (activeCompanyId === id) {
      setActiveCompanyId(remaining[0].id);
    }
  };

  // Assignment Actions
  const createAssignment = (data: Omit<Assignment, 'id' | 'status'>): Assignment => {
    const targetCompId = data.companyId || (activeCompanyId !== 'all' ? activeCompanyId : 'comp-atlas');
    const newAssignment: Assignment = {
      ...data,
      companyId: targetCompId,
      id: `ENT-${new Date().getFullYear()}-${(allAssignments.length + 101).toString().padStart(3, '0')}`,
      status: 'activo',
    };

    // Auto-decrement available stock
    setAllItems((prev) =>
      prev.map((it) => {
        if (it.id === data.itemId) {
          const newAvail = Math.max(0, it.stockAvailable - data.quantity);
          const newAssigned = it.stockAssigned + data.quantity;
          return {
            ...it,
            stockAvailable: newAvail,
            stockAssigned: newAssigned,
          };
        }
        return it;
      })
    );

    setAllAssignments((prev) => [newAssignment, ...prev]);
    return newAssignment;
  };

  const registerReturn = (
    assignmentId: string,
    conditionOnReturn: ItemCondition,
    incidentReport?: string
  ) => {
    const assignment = allAssignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    const todayStr = new Date().toISOString().split('T')[0];

    // Increment available stock
    setAllItems((prev) =>
      prev.map((it) => {
        if (it.id === assignment.itemId) {
          const isDamaged = conditionOnReturn === 'danado';
          const newAvail = isDamaged ? it.stockAvailable : it.stockAvailable + assignment.quantity;
          const newMaint = isDamaged ? it.stockMaintenance + assignment.quantity : it.stockMaintenance;
          const newAssigned = Math.max(0, it.stockAssigned - assignment.quantity);

          return {
            ...it,
            stockAvailable: newAvail,
            stockAssigned: newAssigned,
            stockMaintenance: newMaint,
          };
        }
        return it;
      })
    );

    setAllAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status: 'devuelto',
            returnDate: todayStr,
            conditionOnReturn,
            incidentReport: incidentReport || a.incidentReport,
          };
        }
        return a;
      })
    );
  };

  const extendLoan = (assignmentId: string, newDueDate: string, reason?: string) => {
    setAllAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          const updatedNotes = reason ? `${a.notes} | Prórroga: ${reason}` : a.notes;
          return {
            ...a,
            dueDate: newDueDate,
            notes: updatedNotes,
          };
        }
        return a;
      })
    );
  };

  const deleteAssignment = (id: string) => {
    setAllAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  // Inventory Item Actions
  const addItem = (itemData: Omit<InventoryItem, 'id' | 'stockAvailable' | 'stockAssigned' | 'stockMaintenance'>) => {
    const targetCompId = itemData.companyId || (activeCompanyId !== 'all' ? activeCompanyId : 'comp-atlas');
    const newItem: InventoryItem = {
      ...itemData,
      companyId: targetCompId,
      id: `item-${Date.now().toString().slice(-4)}`,
      stockAvailable: itemData.stockTotal,
      stockAssigned: 0,
      stockMaintenance: 0,
    };
    setAllItems((prev) => [newItem, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setAllItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const updated = { ...it, ...updates };
          if (updates.stockTotal !== undefined && updates.stockAvailable === undefined) {
            updated.stockAvailable = Math.max(0, updates.stockTotal - updated.stockAssigned - updated.stockMaintenance);
          }
          return updated;
        }
        return it;
      })
    );
  };

  const deleteItem = (id: string) => {
    setAllItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Worker Actions
  const addWorker = (workerData: Omit<Worker, 'id' | 'joinedDate'>) => {
    const targetCompId = workerData.companyId || (activeCompanyId !== 'all' ? activeCompanyId : 'comp-atlas');
    const newWorker: Worker = {
      ...workerData,
      companyId: targetCompId,
      id: `wrk-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setAllWorkers((prev) => [newWorker, ...prev]);
  };

  const updateWorker = (id: string, updates: Partial<Worker>) => {
    setAllWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const deleteWorker = (id: string) => {
    setAllWorkers((prev) => prev.filter((w) => w.id !== id));
  };

  const assignWorkerToProject = (workerId: string, projectId: string) => {
    const proj = allProjects.find((p) => p.id === projectId);
    if (!proj) return;
    setAllWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w;
        const currentAssigned = w.assignedProjects || [];
        const nextAssigned = currentAssigned.includes(projectId)
          ? currentAssigned
          : [...currentAssigned, projectId];
        return {
          ...w,
          projectId,
          projectName: proj.name,
          assignedProjects: nextAssigned,
        };
      })
    );
  };

  // Project Actions
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const targetCompId = projectData.companyId || (activeCompanyId !== 'all' ? activeCompanyId : 'comp-atlas');
    const newProject: Project = {
      ...projectData,
      companyId: targetCompId,
      id: `prj-${Date.now().toString().slice(-4)}`,
    };
    setAllProjects((prev) => [newProject, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setAllProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates };
        if (updates.name && updates.name !== p.name) {
          setAllWorkers((wList) =>
            wList.map((w) => (w.projectId === id ? { ...w, projectName: updates.name } : w))
          );
          setAllAssignments((aList) =>
            aList.map((a) => (a.projectId === id ? { ...a, projectName: updates.name } : a))
          );
        }
        return updated;
      })
    );
  };

  const deleteProject = (id: string) => {
    setAllProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateConfig = (updates: Partial<WarehouseConfig>) => {
    setConfig((prev) => {
      const merged = { ...prev, ...updates };
      // Also update active company representation if companyName or supervisors change
      if (activeCompanyId !== 'all') {
        setCompanies((cList) =>
          cList.map((c) => {
            if (c.id === activeCompanyId) {
              return {
                ...c,
                name: updates.companyName || c.name,
                facilityName: updates.facilityName || c.facilityName,
                logoPreset: updates.logoPreset || c.logoPreset,
                logoUrl: updates.logoUrl !== undefined ? updates.logoUrl : c.logoUrl,
                supervisor1Name: updates.supervisor1Name || c.supervisor1Name,
                supervisor1Role: updates.supervisor1Role || c.supervisor1Role,
                supervisor1Email: updates.supervisor1Email || c.supervisor1Email,
                supervisor2Name: updates.supervisor2Name || c.supervisor2Name,
                supervisor2Role: updates.supervisor2Role || c.supervisor2Role,
                supervisor2Email: updates.supervisor2Email || c.supervisor2Email,
                supervisor3Name: updates.supervisor3Name || c.supervisor3Name,
                supervisor3Role: updates.supervisor3Role || c.supervisor3Role,
                supervisor3Email: updates.supervisor3Email || c.supervisor3Email,
              };
            }
            return c;
          })
        );
      }
      return merged;
    });
  };

  const exportBackupJSON = () => {
    const data = {
      version: '2.0-multi-company',
      exportDate: new Date().toISOString(),
      activeCompanyId,
      companies,
      config,
      items: allItems,
      workers: allWorkers,
      projects: allProjects,
      assignments: evaluatedAssignments,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo-multiempresa-epp-herramientas-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.companies) && data.companies.length > 0) {
        setCompanies(data.companies);
      }
      if (data.activeCompanyId) {
        setActiveCompanyId(data.activeCompanyId);
      }
      if (data.config) setConfig(data.config);
      if (Array.isArray(data.items)) setAllItems(data.items);
      if (Array.isArray(data.workers)) setAllWorkers(data.workers);
      if (Array.isArray(data.projects)) setAllProjects(data.projects);
      if (Array.isArray(data.assignments)) setAllAssignments(data.assignments);
      return true;
    } catch {
      return false;
    }
  };

  const resetAllData = () => {
    setCompanies(INITIAL_COMPANIES);
    setActiveCompanyId('comp-atlas');
    setConfig(DEFAULT_WAREHOUSE_CONFIG);
    setAllItems(INITIAL_ITEMS);
    setAllWorkers(INITIAL_WORKERS);
    setAllProjects(INITIAL_PROJECTS);
    setAllAssignments(INITIAL_ASSIGNMENTS);
    localStorage.removeItem(`${STORAGE_KEY}_companies`);
    localStorage.removeItem(`${STORAGE_KEY}_active_company_id`);
    localStorage.removeItem(`${STORAGE_KEY}_config`);
    localStorage.removeItem(`${STORAGE_KEY}_items`);
    localStorage.removeItem(`${STORAGE_KEY}_workers`);
    localStorage.removeItem(`${STORAGE_KEY}_projects`);
    localStorage.removeItem(`${STORAGE_KEY}_assignments`);
  };

  const exportAssignmentsCSV = () => {
    const headers = [
      'Folio Entrega',
      'Proyecto / Obra',
      'Modalidad',
      'Categoría',
      'Código Ítem',
      'Nombre Ítem',
      'Cantidad',
      'Colaborador',
      'DNI',
      'Departamento',
      'Fecha Entrega',
      'Fecha Vencimiento/Devolución',
      'Fecha Devolución Real',
      'Estado',
      'Condición Entrega',
      'Condición Devolución',
      'Supervisor Responsable',
      'Notas',
    ];

    const rows = assignments.map((a) => [
      `"${a.id}"`,
      `"${(a.projectName || 'Sin Proyecto Asignado').replace(/"/g, '""')}"`,
      `"${a.requiresReturn ? 'Préstamo con Devolución' : 'Dotación Permanente (Sin Devolución)'}"`,
      `"${a.itemCategory}"`,
      `"${a.itemCode}"`,
      `"${a.itemName.replace(/"/g, '""')}"`,
      a.quantity,
      `"${a.workerName.replace(/"/g, '""')}"`,
      `"${a.workerDni}"`,
      `"${a.workerDepartment}"`,
      `"${a.deliveryDate}"`,
      `"${a.dueDate}"`,
      `"${a.returnDate || ''}"`,
      `"${a.status}"`,
      `"${a.conditionOnDelivery}"`,
      `"${a.conditionOnReturn || ''}"`,
      `"${a.supervisor}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registro-entregas-epp-herramientas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <InventoryContext.Provider
      value={{
        companies,
        activeCompanyId,
        setActiveCompanyId,
        activeCompany,
        addCompany,
        updateCompany,
        deleteCompany,
        items,
        workers,
        assignments,
        projects,
        allProjects,
        activeProjectId,
        setActiveProjectId,
        config,
        activeTab,
        setActiveTab,
        selectedAssignmentForAct,
        setSelectedAssignmentForAct,
        alerts,
        overdueCount,
        replacementDueCount,
        upcomingCount,
        createAssignment,
        registerReturn,
        extendLoan,
        deleteAssignment,
        addItem,
        updateItem,
        deleteItem,
        addWorker,
        updateWorker,
        deleteWorker,
        assignWorkerToProject,
        addProject,
        updateProject,
        deleteProject,
        updateConfig,
        exportBackupJSON,
        importBackupJSON,
        resetAllData,
        exportAssignmentsCSV,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
