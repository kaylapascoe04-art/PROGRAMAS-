import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'superadmin' | 'admin' | 'almacen' | 'sst' | 'operaciones' | 'consulta';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  companyId: string; // 'comp-atlas', 'comp-vanguardia', 'comp-ecobuild', o 'all'
  companyName?: string;
  avatarBg: string;
  phone?: string;
  status: 'activo' | 'inactivo';
}

export interface StoredUserAccount extends AuthUser {
  passwordHash: string;
}

export interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    roleTitle?: string;
    department?: string;
    companyId?: string;
    companyName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  availableAccounts: AuthUser[];
  createUser: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    roleTitle: string;
    department: string;
    companyId: string;
    companyName?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateUser: (id: string, updates: Partial<AuthUser & { password?: string }>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string, newPassword: string) => void;
}

const DEFAULT_ACCOUNTS: StoredUserAccount[] = [
  {
    id: 'usr-admin-owner',
    name: 'Kayla Pascoe',
    email: 'kaylapascoe04@gmail.com',
    passwordHash: 'admin123',
    role: 'superadmin',
    roleTitle: 'Super Administradora Principal',
    department: 'Dirección General & Proyectos',
    companyId: 'all',
    companyName: 'Todas las Empresas (Multi-Tenant)',
    avatarBg: 'bg-indigo-600',
    phone: '+34 600 000 000',
    status: 'activo',
  },
  {
    id: 'usr-super',
    name: 'Admin Consorcio / Global',
    email: 'superadmin@plataforma.com',
    passwordHash: 'super123',
    role: 'superadmin',
    roleTitle: 'Super Administrador Multiempresa',
    department: 'Dirección Corporativa',
    companyId: 'all',
    companyName: 'Todas las Empresas (Multi-Tenant)',
    avatarBg: 'bg-slate-900',
    phone: '+34 900 123 456',
    status: 'activo',
  },
  {
    id: 'usr-01',
    name: 'Ing. Rodrigo Cárdenas',
    email: 'almacen@empresa.com',
    passwordHash: 'almacen123',
    role: 'almacen',
    roleTitle: 'Jefe de Almacén y Control de Herramientas',
    department: 'Logística & Suministros',
    companyId: 'comp-atlas',
    companyName: 'Constructora e Ingeniería Atlas S.A.',
    avatarBg: 'bg-indigo-600',
    phone: '+34 612 345 678',
    status: 'activo',
  },
  {
    id: 'usr-02',
    name: 'Lic. Marcela Ríos Soto',
    email: 'sst@empresa.com',
    passwordHash: 'sst123',
    role: 'sst',
    roleTitle: 'Supervisora de Seguridad y Salud (SST / HSE)',
    department: 'Prevención de Riesgos Laborales',
    companyId: 'comp-atlas',
    companyName: 'Constructora e Ingeniería Atlas S.A.',
    avatarBg: 'bg-emerald-600',
    phone: '+34 689 901 234',
    status: 'activo',
  },
  {
    id: 'usr-03',
    name: 'Ing. Carlos Mendoza',
    email: 'operaciones@empresa.com',
    passwordHash: 'admin123',
    role: 'operaciones',
    roleTitle: 'Jefe de Operaciones y Residente de Obra',
    department: 'Construcción y Montaje',
    companyId: 'comp-atlas',
    companyName: 'Constructora e Ingeniería Atlas S.A.',
    avatarBg: 'bg-amber-600',
    phone: '+34 670 554 321',
    status: 'activo',
  },
  {
    id: 'usr-04',
    name: 'Téc. Lucía Gutiérrez Peña',
    email: 'almacen@vanguardia.com',
    passwordHash: 'vanguardia123',
    role: 'almacen',
    roleTitle: 'Encargada General de Pañol',
    department: 'Operaciones & Suministros',
    companyId: 'comp-vanguardia',
    companyName: 'Ingeniería & Montajes Vanguardia SpA',
    avatarBg: 'bg-cyan-600',
    phone: '+56 9 7654 3210',
    status: 'activo',
  },
  {
    id: 'usr-05',
    name: 'Ing. Roberto Santana Díaz',
    email: 'admin@vanguardia.com',
    passwordHash: 'admin123',
    role: 'admin',
    roleTitle: 'Administrador de Empresa',
    department: 'Gerencia de Operaciones',
    companyId: 'comp-vanguardia',
    companyName: 'Ingeniería & Montajes Vanguardia SpA',
    avatarBg: 'bg-violet-600',
    phone: '+56 9 8765 4321',
    status: 'activo',
  },
];

const AUTH_STORAGE_KEY = 'warehouse_auth_current_user_v2';
const ACCOUNTS_STORAGE_KEY = 'warehouse_auth_accounts_v2';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<StoredUserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback to defaults
    }
    return DEFAULT_ACCOUNTS;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_ACCOUNTS[0]; // Superadmin by default for preview, can switch anytime
  });

  // Sync accounts to localStorage
  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 250));

    const normalizedEmail = email.trim().toLowerCase();
    const found = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

    if (!found) {
      return { success: false, error: 'No existe una cuenta registrada con este correo electrónico.' };
    }

    if (found.status === 'inactivo') {
      return { success: false, error: 'Esta cuenta ha sido desactivada por el administrador. Contacte a soporte.' };
    }

    if (found.passwordHash !== password) {
      return { success: false, error: 'Contraseña incorrecta. Por favor verifique sus credenciales.' };
    }

    const { passwordHash, ...userProfile } = found;
    setCurrentUser(userProfile);
    return { success: true };
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    roleTitle?: string;
    department?: string;
    companyId?: string;
    companyName?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 250));

    const normalizedEmail = data.email.trim().toLowerCase();
    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      return { success: false, error: 'Por favor ingrese un correo electrónico válido.' };
    }

    if (data.password.length < 5) {
      return { success: false, error: 'La contraseña debe contener al menos 5 caracteres.' };
    }

    const exists = accounts.some((a) => a.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return { success: false, error: 'Ya existe una cuenta con este correo electrónico.' };
    }

    const bgColors = ['bg-indigo-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-blue-600', 'bg-rose-600'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newUser: StoredUserAccount = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: normalizedEmail,
      passwordHash: data.password,
      role: data.role || 'almacen',
      roleTitle: data.roleTitle || 'Supervisor de Almacén',
      department: data.department || 'Operaciones',
      companyId: data.companyId || 'comp-atlas',
      companyName: data.companyName || 'Constructora e Ingeniería Atlas S.A.',
      avatarBg: randomBg,
      status: 'activo',
    };

    setAccounts((prev) => [...prev, newUser]);
    const { passwordHash, ...userProfile } = newUser;
    setCurrentUser(userProfile);
    return { success: true };
  };

  const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    roleTitle: string;
    department: string;
    companyId: string;
    companyName?: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = data.email.trim().toLowerCase();
    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      return { success: false, error: 'El correo electrónico no tiene un formato válido.' };
    }

    if (data.password.length < 5) {
      return { success: false, error: 'La contraseña debe tener al menos 5 caracteres.' };
    }

    const exists = accounts.some((a) => a.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return { success: false, error: 'Ya existe un usuario con este correo electrónico.' };
    }

    const bgColors = ['bg-indigo-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-blue-600', 'bg-rose-600'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newUser: StoredUserAccount = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: normalizedEmail,
      passwordHash: data.password,
      role: data.role,
      roleTitle: data.roleTitle.trim(),
      department: data.department.trim(),
      companyId: data.companyId,
      companyName: data.companyName,
      phone: data.phone?.trim(),
      avatarBg: randomBg,
      status: 'activo',
    };

    setAccounts((prev) => [...prev, newUser]);
    return { success: true };
  };

  const updateUser = (id: string, updates: Partial<AuthUser & { password?: string }>) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const updated = { ...acc, ...updates };
          if (updates.password) {
            updated.passwordHash = updates.password;
          }
          return updated;
        }
        return acc;
      })
    );

    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteUser = (id: string) => {
    if (currentUser?.id === id) {
      alert('No puede eliminar la cuenta con la que ha iniciado sesión actualmente.');
      return;
    }
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const newStatus = acc.status === 'activo' ? 'inactivo' : 'activo';
          return { ...acc, status: newStatus };
        }
        return acc;
      })
    );
  };

  const resetUserPassword = (id: string, newPassword: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          return { ...acc, passwordHash: newPassword };
        }
        return acc;
      })
    );
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const found = accounts.find((a) => a.id === userId);
    if (found) {
      const { passwordHash, ...userProfile } = found;
      setCurrentUser(userProfile);
    }
  };

  const availableAccounts: AuthUser[] = accounts.map(({ passwordHash, ...user }) => user);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchUser,
        availableAccounts,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        resetUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
