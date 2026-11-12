import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PlatformConfig,
  UserProfile,
  Task,
  DocumentItem,
  MetricItem,
  ActivityLog,
  PlatformNotification,
  ActiveModule,
  UserRole,
  PresetType,
  AccentColor,
  TaskStatus,
} from '../types/platform';
import {
  DEFAULT_CONFIG,
  INITIAL_MEMBERS,
  INITIAL_TASKS,
  INITIAL_DOCS,
  INITIAL_METRICS,
  INITIAL_ACTIVITY,
  INITIAL_NOTIFICATIONS,
  PLATFORM_PRESETS,
} from '../data/initialData';

interface PlatformContextType {
  config: PlatformConfig;
  updateConfig: (newConfig: Partial<PlatformConfig>) => void;
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Data
  members: UserProfile[];
  tasks: Task[];
  docs: DocumentItem[];
  metrics: MetricItem[];
  activity: ActivityLog[];
  notifications: PlatformNotification[];
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'commentsCount'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => void;
  
  // Document operations
  activeDocId: string | null;
  setActiveDocId: (id: string | null) => void;
  addDoc: (doc: Omit<DocumentItem, 'id' | 'updatedAt'>) => string;
  updateDoc: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDoc: (id: string) => void;
  
  // Member operations
  addMember: (member: Omit<UserProfile, 'id' | 'joinedDate'>) => void;
  updateMember: (id: string, updates: Partial<UserProfile>) => void;
  deleteMember: (id: string) => void;
  
  // Notification operations
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Global search modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Quick action modal
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;

  // Preset switch
  applyPreset: (presetId: PresetType) => void;
  
  // Backup & Restore
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  resetAllDefaults: () => void;
  exportCSV: () => void;
}

const STORAGE_PREFIX = 'aura_platform_';

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Config state
  const [config, setConfig] = useState<PlatformConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}config`);
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  // Members
  const [members, setMembers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}members`);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}tasks`);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Docs
  const [docs, setDocs] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}docs`);
      return saved ? JSON.parse(saved) : INITIAL_DOCS;
    } catch {
      return INITIAL_DOCS;
    }
  });
  const [activeDocId, setActiveDocId] = useState<string | null>(INITIAL_DOCS[0]?.id || null);

  // Metrics & Activity & Notifications
  const [metrics] = useState<MetricItem[]>(INITIAL_METRICS);
  const [activity, setActivity] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}activity`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY;
    } catch {
      return INITIAL_ACTIVITY;
    }
  });

  const [notifications, setNotifications] = useState<PlatformNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // Apply dark mode to HTML document class
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
      localStorage.setItem(`${STORAGE_PREFIX}config`, JSON.stringify(config));
    } catch (e) {
      console.warn('LocalStorage full or unavailable', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}tasks`, JSON.stringify(tasks));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}docs`, JSON.stringify(docs));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [docs]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}members`, JSON.stringify(members));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}activity`, JSON.stringify(activity));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [activity]);

  // Keyboard shortcut for Cmd/Ctrl + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateConfig = (newConfig: Partial<PlatformConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const logActivity = (action: string, target: string, category: 'task' | 'doc' | 'member' | 'system') => {
    const currentMember = members.find((m) => m.role === currentRole) || members[0];
    const newEntry: ActivityLog = {
      id: `act-${Date.now()}`,
      user: currentMember.name,
      action,
      target,
      timestamp: 'Ahora mismo',
      category,
    };
    setActivity((prev) => [newEntry, ...prev.slice(0, 19)]);
  };

  // Task operations
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'commentsCount'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      commentsCount: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
    logActivity('creó la tarea', newTask.title, 'task');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    const existing = tasks.find((t) => t.id === id);
    if (existing) {
      logActivity('actualizó la tarea', existing.title, 'task');
    }
  };

  const deleteTask = (id: string) => {
    const existing = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (existing) {
      logActivity('eliminó la tarea', existing.title, 'task');
    }
  };

  const moveTaskStatus = (id: string, newStatus: TaskStatus) => {
    const statusLabels: Record<TaskStatus, string> = {
      backlog: 'Por Iniciar',
      in_progress: 'En Curso',
      review: 'En Revisión',
      done: 'Completado',
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    const existing = tasks.find((t) => t.id === id);
    if (existing) {
      logActivity(`movió a "${statusLabels[newStatus]}"`, existing.title, 'task');
    }
  };

  // Document operations
  const addDoc = (docData: Omit<DocumentItem, 'id' | 'updatedAt'>): string => {
    const newId = `doc-${Date.now().toString().slice(-4)}`;
    const newDoc: DocumentItem = {
      ...docData,
      id: newId,
      updatedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setDocs((prev) => [newDoc, ...prev]);
    setActiveDocId(newId);
    logActivity('redactó el documento', newDoc.title, 'doc');
    return newId;
  };

  const updateDoc = (id: string, updates: Partial<DocumentItem>) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              ...updates,
              updatedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : d
      )
    );
    const existing = docs.find((d) => d.id === id);
    if (existing) {
      logActivity('editó el documento', existing.title, 'doc');
    }
  };

  const deleteDoc = (id: string) => {
    const existing = docs.find((d) => d.id === id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
    if (activeDocId === id) {
      const remaining = docs.filter((d) => d.id !== id);
      setActiveDocId(remaining[0]?.id || null);
    }
    if (existing) {
      logActivity('eliminó el documento', existing.title, 'doc');
    }
  };

  // Member operations
  const addMember = (memberData: Omit<UserProfile, 'id' | 'joinedDate'>) => {
    const newMember: UserProfile = {
      ...memberData,
      id: `u-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setMembers((prev) => [...prev, newMember]);
    logActivity('registró al miembro', newMember.name, 'member');
  };

  const updateMember = (id: string, updates: Partial<UserProfile>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    const existing = members.find((m) => m.id === id);
    if (existing) {
      logActivity('actualizó el perfil de', existing.name, 'member');
    }
  };

  const deleteMember = (id: string) => {
    const existing = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (existing) {
      logActivity('dio de baja a', existing.name, 'member');
    }
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Preset switcher
  const applyPreset = (presetId: PresetType) => {
    const preset = PLATFORM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setConfig((prev) => ({
      ...prev,
      preset: presetId,
      name: preset.sampleConfig.name || prev.name,
      organization: preset.sampleConfig.organization || prev.organization,
      tagline: preset.sampleConfig.tagline || prev.tagline,
      accentColor: (preset.sampleConfig.accentColor as AccentColor) || prev.accentColor,
    }));

    logActivity(`cambió la plantilla de plataforma a "${preset.name}"`, preset.sampleConfig.organization || '', 'system');
  };

  // Export & Import
  const exportDataJSON = () => {
    const exportObject = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      config,
      tasks,
      docs,
      members,
      activity,
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-plataforma-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.config) setConfig(data.config);
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (Array.isArray(data.docs)) {
        setDocs(data.docs);
        setActiveDocId(data.docs[0]?.id || null);
      }
      if (Array.isArray(data.members)) setMembers(data.members);
      if (Array.isArray(data.activity)) setActivity(data.activity);
      logActivity('restauró un respaldo de datos JSON', 'Plataforma Aura', 'system');
      return true;
    } catch (err) {
      console.error('Error importando datos JSON', err);
      return false;
    }
  };

  const resetAllDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    setTasks(INITIAL_TASKS);
    setDocs(INITIAL_DOCS);
    setActiveDocId(INITIAL_DOCS[0]?.id || null);
    setMembers(INITIAL_MEMBERS);
    setActivity(INITIAL_ACTIVITY);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Título', 'Estado', 'Prioridad', 'Asignado', 'Fecha Límite', 'Categoría'];
    const rows = tasks.map((t) => {
      const assignee = members.find((m) => m.id === t.assigneeId)?.name || 'Sin asignar';
      return [
        `"${t.id}"`,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.status}"`,
        `"${t.priority}"`,
        `"${assignee}"`,
        `"${t.dueDate}"`,
        `"${t.category}"`,
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-tareas-reporte-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PlatformContext.Provider
      value={{
        config,
        updateConfig,
        activeModule,
        setActiveModule,
        currentRole,
        setCurrentRole,
        members,
        tasks,
        docs,
        metrics,
        activity,
        notifications,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        activeDocId,
        setActiveDocId,
        addDoc,
        updateDoc,
        deleteDoc,
        addMember,
        updateMember,
        deleteMember,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isSearchOpen,
        setIsSearchOpen,
        isQuickActionOpen,
        setIsQuickActionOpen,
        applyPreset,
        exportDataJSON,
        importDataJSON,
        resetAllDefaults,
        exportCSV,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
