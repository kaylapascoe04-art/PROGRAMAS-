import {
  PlatformConfig,
  UserProfile,
  Task,
  DocumentItem,
  MetricItem,
  ActivityLog,
  PlatformNotification,
  PresetType
} from '../types/platform';

export const DEFAULT_CONFIG: PlatformConfig = {
  name: 'Aura Workspace',
  organization: 'Aura Technologies',
  tagline: 'Centro unificado de operaciones, proyectos y conocimiento',
  preset: 'saas',
  accentColor: 'indigo',
  darkMode: false,
  enabledModules: {
    dashboard: true,
    projects: true,
    docs: true,
    members: true,
    analytics: true,
    settings: true,
  },
};

export const INITIAL_MEMBERS: UserProfile[] = [
  {
    id: 'u-1',
    name: 'Elena Morales',
    email: 'elena.morales@aura.io',
    role: 'admin',
    roleLabel: 'Administradora General',
    department: 'Dirección Técnica',
    status: 'Activo',
    avatarInitials: 'EM',
    avatarBg: 'bg-indigo-600',
    joinedDate: '15 Ene 2025',
    phone: '+34 612 345 678',
  },
  {
    id: 'u-2',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@aura.io',
    role: 'manager',
    roleLabel: 'Líder de Producto',
    department: 'Gestión de Proyectos',
    status: 'Activo',
    avatarInitials: 'CM',
    avatarBg: 'bg-emerald-600',
    joinedDate: '02 Feb 2025',
    phone: '+34 622 456 789',
  },
  {
    id: 'u-3',
    name: 'Sofía Herrera',
    email: 'sofia.herrera@aura.io',
    role: 'contributor',
    roleLabel: 'Desarrolladora Senior',
    department: 'Ingeniería Frontend',
    status: 'Activo',
    avatarInitials: 'SH',
    avatarBg: 'bg-violet-600',
    joinedDate: '10 Mar 2025',
    phone: '+34 633 567 890',
  },
  {
    id: 'u-4',
    name: 'Mateo Valenzuela',
    email: 'mateo.v@aura.io',
    role: 'contributor',
    roleLabel: 'Diseñador UI/UX',
    department: 'Diseño de Producto',
    status: 'Ausente',
    avatarInitials: 'MV',
    avatarBg: 'bg-amber-600',
    joinedDate: '22 Abr 2025',
    phone: '+34 644 678 901',
  },
  {
    id: 'u-5',
    name: 'Lucía Navarro',
    email: 'lucia.navarro@aura.io',
    role: 'guest',
    roleLabel: 'Consultora Externa',
    department: 'Auditoría & Calidad',
    status: 'Pendiente',
    avatarInitials: 'LN',
    avatarBg: 'bg-rose-600',
    joinedDate: '01 May 2025',
    phone: '+34 655 789 012',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-101',
    title: 'Migración a arquitectura de microservicios v2',
    description: 'Desacoplar el servicio de facturación y balanceo de carga para optimizar tiempos de respuesta por debajo de 80ms.',
    status: 'in_progress',
    priority: 'urgent',
    assigneeId: 'u-3',
    dueDate: '15 Nov 2026',
    tags: ['Arquitectura', 'Backend', 'Prioritario'],
    commentsCount: 6,
    category: 'Infraestructura',
    createdAt: '01 Nov 2026',
  },
  {
    id: 'tsk-102',
    title: 'Rediseño del flujo de registro y bienvenida de clientes',
    description: 'Simplificar el proceso de onboarding reduciendo los pasos requeridos de 6 a 3 pantallas guiadas.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'u-4',
    dueDate: '20 Nov 2026',
    tags: ['Diseño UX', 'Onboarding', 'Conversión'],
    commentsCount: 4,
    category: 'Experiencia de Usuario',
    createdAt: '03 Nov 2026',
  },
  {
    id: 'tsk-103',
    title: 'Auditoría de accesibilidad y cumplimiento WCAG AA',
    description: 'Verificar contraste en componentes oscuros, navegación completa por teclado y etiquetas semánticas.',
    status: 'review',
    priority: 'medium',
    assigneeId: 'u-5',
    dueDate: '12 Nov 2026',
    tags: ['Accesibilidad', 'QA', 'Frontend'],
    commentsCount: 3,
    category: 'Calidad',
    createdAt: '28 Oct 2026',
  },
  {
    id: 'tsk-104',
    title: 'Implementación del módulo de exportación de métricas a CSV',
    description: 'Permitir a los administradores descargar reportes consolidados mensuales en formato delimitado por comas.',
    status: 'done',
    priority: 'medium',
    assigneeId: 'u-1',
    dueDate: '05 Nov 2026',
    tags: ['Analíticas', 'Exportación', 'Reporting'],
    commentsCount: 2,
    category: 'Datos',
    createdAt: '25 Oct 2026',
  },
  {
    id: 'tsk-105',
    title: 'Configuración de webhooks para pasarelas de pago',
    description: 'Garantizar el reintento automático y firma criptográfica ante eventos de cobro fallido o cancelación.',
    status: 'backlog',
    priority: 'high',
    assigneeId: 'u-2',
    dueDate: '25 Nov 2026',
    tags: ['Finanzas', 'Integraciones', 'API'],
    commentsCount: 1,
    category: 'Operaciones',
    createdAt: '06 Nov 2026',
  },
  {
    id: 'tsk-106',
    title: 'Actualización de la guía de estilos de componentes y tokens',
    description: 'Estandarizar escala tipográfica, paleta de colores neutrales y radios de borde para el equipo de diseño.',
    status: 'backlog',
    priority: 'low',
    assigneeId: 'u-4',
    dueDate: '30 Nov 2026',
    tags: ['Sistema de Diseño', 'UI', 'Documentación'],
    commentsCount: 0,
    category: 'Diseño de Producto',
    createdAt: '07 Nov 2026',
  },
];

export const INITIAL_DOCS: DocumentItem[] = [
  {
    id: 'doc-01',
    title: 'Guía de Estructura y Funcionamiento de la Plataforma',
    category: 'Arquitectura',
    summary: 'Directrices técnicas y operativas sobre los módulos que componen la plataforma web Aura.',
    content: `# Guía de Estructura y Funcionamiento

Bienvenido a la plataforma web modular. Este entorno fue diseñado para centralizar la gestión operativa, la colaboración de equipos y el análisis estratégico en una interfaz de alto rendimiento.

## 1. Módulos del Sistema
- **Panel General (Dashboard)**: Métricas consolidadas, tendencias temporales y resumen de actividad diaria.
- **Gestión de Tareas (Kanban & Lista)**: Seguimiento de ciclo de vida de actividades con asignación de prioridades.
- **Base de Documentos (Wiki)**: Redacción colaborativa y archivo estructurado de políticas y especificaciones.
- **Directorio de Usuarios**: Administración de roles, estados y permisos de acceso para miembros y clientes.
- **Analíticas**: Indicadores cuantitativos y exportación de datos en formato abierto.

## 2. Recomendaciones de Uso
1. Mantener las tareas actualizadas con su estado correspondiente para reflejar el avance real.
2. Registrar la documentación técnica dentro de la base de conocimiento para evitar silos de información.
3. Consultar las analíticas periódicamente para detectar cuellos de botella en la entrega.`,
    authorId: 'u-1',
    authorName: 'Elena Morales',
    updatedAt: '08 Nov 2026',
    readTimeMinutes: 3,
    isPinned: true,
  },
  {
    id: 'doc-02',
    title: 'Protocolo de Seguridad y Privacidad de Datos',
    category: 'Normativas',
    summary: 'Procedimientos obligatorios para el manejo de información sensible y control de credenciales.',
    content: `# Protocolo de Seguridad y Privacidad

El presente documento establece las normas mandatorias para todo el personal con acceso a datos de la plataforma.

## Medidas Principales
- **Autenticación Fuerte**: Se recomienda el uso de contraseñas de al menos 14 caracteres con rotación semestral.
- **Principio de Menor Privilegio**: A los nuevos colaboradores se les asignará el rol de Contribuidor o Invitado hasta que su responsable solicite elevación de privilegios.
- **Copias de Seguridad**: La base de datos realiza respaldos incrementales cada 24 horas y copias completas semanales.`,
    authorId: 'u-2',
    authorName: 'Carlos Mendoza',
    updatedAt: '04 Nov 2026',
    readTimeMinutes: 4,
    isPinned: true,
  },
  {
    id: 'doc-03',
    title: 'Manual de Onboarding para Nuevos Integrantes',
    category: 'Recursos Humanos',
    summary: 'Pasos iniciales para la integración de colaboradores técnicos y operativos en el equipo.',
    content: `# Manual de Onboarding para Nuevos Integrantes

¡Bienvenido al equipo! Este manual resume lo que necesitas para tu primera semana en la organización.

### Primer Día
- Configura tu perfil en el Directorio de Miembros.
- Revisa las guías de arquitectura y estándares de codificación.
- Preséntate en la reunión matutina de sincronización.

### Primera Semana
- Familiarízate con el tablero de tareas asignado a tu departamento.
- Completa tu primera tarea de inducción guiada por tu mentor.`,
    authorId: 'u-2',
    authorName: 'Carlos Mendoza',
    updatedAt: '01 Nov 2026',
    readTimeMinutes: 2,
    isPinned: false,
  },
];

export const INITIAL_METRICS: MetricItem[] = [
  {
    id: 'm-1',
    label: 'Usuarios Activos del Mes',
    value: '14,820',
    delta: '+12.4%',
    isPositive: true,
    period: 'vs. mes anterior',
    description: 'Miembros con al menos 1 sesión en los últimos 30 días.',
  },
  {
    id: 'm-2',
    label: 'Tasa de Eficiencia de Tareas',
    value: '91.8%',
    delta: '+4.2%',
    isPositive: true,
    period: 'vs. ciclo anterior',
    description: 'Porcentaje de entregas completadas antes del plazo.',
  },
  {
    id: 'm-3',
    label: 'Tiempo Promedio de Respuesta',
    value: '1.4h',
    delta: '-18.5%',
    isPositive: true,
    period: 'vs. promedio anual',
    description: 'Tiempo transcurrido desde creación hasta primera acción.',
  },
  {
    id: 'm-4',
    label: 'Índice de Retención Global',
    value: '96.3%',
    delta: '+1.1%',
    isPositive: true,
    period: 'vs. trimestre anterior',
    description: 'Clientes y miembros que mantienen actividad continua.',
  },
];

export const INITIAL_ACTIVITY: ActivityLog[] = [
  {
    id: 'act-1',
    user: 'Elena Morales',
    action: 'actualizó la configuración general de',
    target: 'Plataforma Web Modular Aura',
    timestamp: 'Hace 12 minutos',
    category: 'system',
  },
  {
    id: 'act-2',
    user: 'Sofía Herrera',
    action: 'marcó como completada la tarea',
    target: 'Módulo de exportación de métricas a CSV',
    timestamp: 'Hace 45 minutos',
    category: 'task',
  },
  {
    id: 'act-3',
    user: 'Carlos Mendoza',
    action: 'publicó un nuevo documento',
    target: 'Protocolo de Seguridad y Privacidad de Datos',
    timestamp: 'Hace 2 horas',
    category: 'doc',
  },
  {
    id: 'act-4',
    user: 'Mateo Valenzuela',
    action: 'modificó el diseño de',
    target: 'Flujo de registro y bienvenida',
    timestamp: 'Hace 4 horas',
    category: 'task',
  },
  {
    id: 'act-5',
    user: 'Lucía Navarro',
    action: 'se incorporó como',
    target: 'Consultora Externa en Auditoría',
    timestamp: 'Hace 1 día',
    category: 'member',
  },
];

export const INITIAL_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'notif-1',
    title: 'Actualización de Sistema',
    message: 'La plataforma se encuentra en su versión estable con todos los módulos operativos.',
    timestamp: 'Hace 15 min',
    read: false,
    type: 'success',
  },
  {
    id: 'notif-2',
    title: 'Revisión Pendiente',
    message: 'Sofía Herrera solicitó revisión en la auditoría de accesibilidad WCAG AA.',
    timestamp: 'Hace 2 horas',
    read: false,
    type: 'info',
  },
  {
    id: 'notif-3',
    title: 'Próxima Entrega',
    message: 'La tarea de migración a arquitectura v2 vence en 6 días.',
    timestamp: 'Hace 1 día',
    read: true,
    type: 'alert',
  },
];

export interface PresetInfo {
  id: PresetType;
  name: string;
  badge: string;
  description: string;
  accent: string;
  sampleConfig: Partial<PlatformConfig>;
}

export const PLATFORM_PRESETS: PresetInfo[] = [
  {
    id: 'saas',
    name: 'SaaS & Gestión de Proyectos',
    badge: 'Espacio de Trabajo',
    description: 'Ideal para empresas de software, agencias y equipos ágiles con seguimiento de sprints y proyectos.',
    accent: 'indigo',
    sampleConfig: {
      name: 'Aura SaaS Workspace',
      organization: 'Aura Software Labs',
      tagline: 'Centro de control de producto, desarrollo y entrega ágil',
      accentColor: 'indigo',
    },
  },
  {
    id: 'edu',
    name: 'Campus Virtual & Academia',
    badge: 'Educación & Cursos',
    description: 'Orientado a instituciones educativas, formadores y academias para gestionar programas, guías y estudiantes.',
    accent: 'emerald',
    sampleConfig: {
      name: 'Aura Campus Digital',
      organization: 'Instituto de Innovación Digital',
      tagline: 'Portal de formación, lecciones y comunidad académica',
      accentColor: 'emerald',
    },
  },
  {
    id: 'ecommerce',
    name: 'Comercio & Operaciones de Ventas',
    badge: 'E-commerce & Retail',
    description: 'Diseñado para tiendas online y negocios de retail con control de inventarios, pedidos y clientes.',
    accent: 'amber',
    sampleConfig: {
      name: 'Aura Commerce Hub',
      organization: 'Vanguard Retail Group',
      tagline: 'Panel de control de pedidos, catálogo y rendimiento comercial',
      accentColor: 'amber',
    },
  },
  {
    id: 'corporate',
    name: 'Intranet Corporativa',
    badge: 'Empresarial & Operativo',
    description: 'Especial para grandes corporaciones, departamentos internos, recursos humanos y gestión documental.',
    accent: 'blue',
    sampleConfig: {
      name: 'Portal Corporativo Nexus',
      organization: 'Corporación Global Nexus',
      tagline: 'Portal del empleado, directrices corporativas y directorio institucional',
      accentColor: 'blue',
    },
  },
];
