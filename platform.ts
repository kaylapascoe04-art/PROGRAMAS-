export type UserRole = 'admin' | 'manager' | 'contributor' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  department: string;
  status: 'Activo' | 'Ausente' | 'Pendiente';
  avatarInitials: string;
  avatarBg: string;
  joinedDate: string;
  phone?: string;
}

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  tags: string[];
  commentsCount: number;
  category: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  authorId: string;
  authorName: string;
  updatedAt: string;
  readTimeMinutes: number;
  isPinned?: boolean;
}

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  isPositive: boolean;
  period: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  category: 'task' | 'doc' | 'member' | 'system';
}

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export type PresetType = 'saas' | 'edu' | 'ecommerce' | 'corporate';

export type AccentColor = 'indigo' | 'emerald' | 'violet' | 'amber' | 'blue' | 'rose';

export interface EnabledModules {
  dashboard: boolean;
  projects: boolean;
  docs: boolean;
  members: boolean;
  analytics: boolean;
  settings: boolean;
}

export interface PlatformConfig {
  name: string;
  organization: string;
  tagline: string;
  preset: PresetType;
  accentColor: AccentColor;
  darkMode: boolean;
  enabledModules: EnabledModules;
}

export type ActiveModule = 'dashboard' | 'projects' | 'docs' | 'members' | 'analytics' | 'settings';
