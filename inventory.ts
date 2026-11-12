export type ItemCategory = 'herramienta' | 'epp' | 'equipo';

export type ItemCondition = 'nuevo' | 'bueno' | 'regular' | 'danado' | 'desgastado_normal' | 'perdido';

export type AssignmentStatus = 'activo' | 'proximo_vencer' | 'vencido' | 'devuelto' | 'baja';

export interface Company {
  id: string;               // Ej: "comp-atlas", "comp-consorcio"
  code: string;             // Ej: "ATLAS", "INSMON"
  taxId: string;            // RUT, CIF, NIF o RFC
  name: string;             // Nombre comercial o razón social
  facilityName: string;     // Planta, almacén o sede principal
  logoUrl?: string;         // Data URL o enlace
  logoPreset?: 'shield' | 'helmet' | 'crane' | 'gear' | 'custom';
  supervisor1Name: string;  // Resp 1: Almacén
  supervisor1Role: string;
  supervisor1Email?: string;
  supervisor2Name: string;  // Resp 2: SST / HSE
  supervisor2Role: string;
  supervisor2Email?: string;
  supervisor3Name: string;  // Resp 3: Operaciones / Obra
  supervisor3Role: string;
  supervisor3Email?: string;
  status: 'activa' | 'inactiva';
  createdAt: string;
  phone?: string;
  address?: string;
}

export interface InventoryItem {
  id: string;
  companyId?: string;       // Empresa propietaria
  code: string;
  name: string;
  category: ItemCategory;
  subcategory: string;
  brand: string;
  model: string;
  serialNumber?: string;
  stockTotal: number;
  stockAvailable: number;
  stockAssigned: number;
  stockMaintenance: number;
  lifespanMonths?: number;
  defaultLoanDays: number;
  location: string;
  requiresReturn: boolean;
  notes?: string;
  status?: 'activo' | 'inactivo';
}

export type DeliveryType = 'prestamo_retornable' | 'dotacion_definitiva';

export interface DeliverySupervisor {
  id?: string;
  name: string;
  role: string;
  email?: string;
}

export interface Assignment {
  id: string;
  companyId?: string;       // Empresa que asigna
  itemId: string;
  itemName: string;
  itemCode: string;
  itemCategory: ItemCategory;
  workerId: string;
  workerName: string;
  workerDni: string;
  workerDepartment: string;
  workerRole: string;
  quantity: number;
  deliveryDate: string; // YYYY-MM-DD
  dueDate: string;      // YYYY-MM-DD (fecha esperada de retorno o fecha de reposición programada)
  returnDate?: string;  // YYYY-MM-DD
  status: AssignmentStatus;
  requiresReturn: boolean; // true: Préstamo con devolución obligatoria; false: Dotación permanente/consumible (botas, cinta métrica, etc.)
  deliveryType: DeliveryType;
  conditionOnDelivery: ItemCondition;
  conditionOnReturn?: ItemCondition;
  supervisor: string; // Responsable principal (Almacén)
  supervisors?: DeliverySupervisor[]; // Hasta 3 responsables asignados a la entrega
  notes: string;
  signedReceipt: boolean;
  incidentReport?: string;
  projectId?: string;        // ID del Proyecto / Obra donde se destina el ítem
  projectName?: string;      // Nombre del Proyecto para consulta rápida y actas
}

export interface Project {
  id: string;
  companyId?: string;        // Empresa a la que pertenece el proyecto
  code: string;              // Ej: PRJ-01, OBRA-NORTE
  name: string;              // Ej: Torre Corporativa Atlas
  location: string;          // Ej: Sector Norte / Polígono 4
  client?: string;           // Ej: Consorcio Inmobiliario
  status: 'activo' | 'pausado' | 'completado';
  manager?: string;          // Residente de Obra / Supervisor
  startDate?: string;
  description?: string;
}

export interface Worker {
  id: string;
  companyId?: string;        // Empresa empleadora
  name: string;
  dni: string;
  department: string;
  jobTitle: string;
  phone: string;
  email: string;
  status: 'activo' | 'inactivo';
  location: string;
  joinedDate: string;
  projectId?: string;        // Proyecto actual / principal asignado
  projectName?: string;      // Nombre del proyecto actual
  assignedProjects?: string[]; // Lista de IDs de proyectos en los que participa
}

export type AlertType = 'devolucion_vencida' | 'reposicion_vencida' | 'devolucion_proxima' | 'reposicion_proxima';

export interface AlertNotification {
  id: string;
  assignmentId: string;
  itemCategory: ItemCategory;
  itemName: string;
  itemCode: string;
  workerName: string;
  workerDepartment: string;
  dueDate: string;
  daysDiff: number; // < 0 vencido, >= 0 días restantes
  severity: 'vencido' | 'por_vencer' | 'al_dia';
  status: AssignmentStatus;
  requiresReturn: boolean;
  alertType: AlertType;
}

export interface WarehouseConfig {
  companyId?: string;
  platformTitle?: string;  // Nombre personalizado de la plataforma (ej: "Control Herramientas & EPP")
  companyName: string;
  facilityName: string;
  supervisorName: string; // Supervisor 1 (Almacén)
  supervisorRole: string;
  // Tres responsables oficiales configurados en la organización
  supervisor1Name: string; // Responsable 1: Almacén / Despacho
  supervisor1Role: string;
  supervisor1Email?: string;
  supervisor2Name: string; // Responsable 2: Seguridad y Salud (SST / HSE)
  supervisor2Role: string;
  supervisor2Email?: string;
  supervisor3Name: string; // Responsable 3: Jefatura de Área / Operaciones
  supervisor3Role: string;
  supervisor3Email?: string;
  // Personalización del Logo
  logoUrl?: string; // Data URL o URL externa
  logoPreset?: 'shield' | 'helmet' | 'crane' | 'gear' | 'custom';
  warningDaysThreshold: number; // Días antes de vencimiento para disparar alerta amarilla (ej: 3 días)
  defaultLoanDaysTools: number;
  defaultLifespanEppDays: number;
  autoAlertNotifications: boolean;
  darkMode: boolean;
}

export type InventoryTab = 'dashboard' | 'assignments' | 'inventory' | 'workers' | 'projects' | 'alerts' | 'acts' | 'companies' | 'settings';


