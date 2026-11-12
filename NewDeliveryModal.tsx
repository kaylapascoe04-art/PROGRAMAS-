import React, { useState } from 'react';
import { useInventory } from '../../../context/InventoryContext';
import { useAuth } from '../../../context/AuthContext';
import {
  X,
  Plus,
  Wrench,
  HardHat,
  Boxes,
  Calendar,
  User,
  Shield,
  AlertCircle,
  Users,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { ItemCondition, Assignment, DeliverySupervisor } from '../../../types/inventory';

interface NewDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeliveryCreated?: (assignment: Assignment) => void;
}

export const NewDeliveryModal: React.FC<NewDeliveryModalProps> = ({
  isOpen,
  onClose,
  onDeliveryCreated,
}) => {
  const {
    items,
    workers,
    projects,
    activeProjectId,
    config,
    createAssignment,
    setSelectedAssignmentForAct,
    setActiveTab,
  } = useInventory();

  const { currentUser } = useAuth();

  // Pick first active worker
  const activeWorkers = workers.filter((w) => w.status !== 'inactivo');
  const defaultWorker = activeWorkers[0] || workers[0];

  const [selectedWorkerId, setSelectedWorkerId] = useState(defaultWorker?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    if (activeProjectId !== 'all') return activeProjectId;
    return defaultWorker?.projectId || projects[0]?.id || '';
  });
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [requiresReturn, setRequiresReturn] = useState<boolean>(() => items[0]?.requiresReturn ?? true);
  const [deliveryDate, setDeliveryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + (items[0]?.defaultLoanDays || 7));
    return d.toISOString().split('T')[0];
  });
  const [condition, setCondition] = useState<ItemCondition>('bueno');
  const [notes, setNotes] = useState('');

  // 3 Responsables de Entrega (Almacén, SST/HSE, Operaciones)
  const [resp1Name, setResp1Name] = useState(currentUser?.name || config.supervisor1Name || config.supervisorName || 'Ing. Rodrigo Cárdenas');
  const [resp1Role, setResp1Role] = useState(currentUser?.role || config.supervisor1Role || config.supervisorRole || 'Jefe de Almacén');

  const [includeResp2, setIncludeResp2] = useState(true);
  const [resp2Name, setResp2Name] = useState(config.supervisor2Name || 'Lic. Marcela Ríos Soto');
  const [resp2Role, setResp2Role] = useState(config.supervisor2Role || 'Supervisora de Seguridad y Salud (SST / HSE)');

  const [includeResp3, setIncludeResp3] = useState(true);
  const [resp3Name, setResp3Name] = useState(config.supervisor3Name || 'Ing. Carlos Mendoza');
  const [resp3Role, setResp3Role] = useState(config.supervisor3Role || 'Jefe de Operaciones y Residente de Obra');

  if (!isOpen) return null;

  const selectedItem = items.find((it) => it.id === selectedItemId);
  const selectedWorker = workers.find((w) => w.id === selectedWorkerId);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleWorkerChange = (workerId: string) => {
    setSelectedWorkerId(workerId);
    const worker = workers.find((w) => w.id === workerId);
    if (worker?.projectId) {
      setSelectedProjectId(worker.projectId);
    }
  };

  // When changing item, adjust default due date and requiresReturn setting
  const handleItemChange = (itemId: string) => {
    setSelectedItemId(itemId);
    const item = items.find((i) => i.id === itemId);
    if (item) {
      setRequiresReturn(item.requiresReturn);
      const d = new Date();
      d.setDate(d.getDate() + item.defaultLoanDays);
      setDueDate(d.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedWorker) return;

    if (selectedWorker.status === 'inactivo') {
      alert(`El colaborador ${selectedWorker.name} se encuentra marcado como INACTIVO en el sistema. Debe activarlo primero desde el padrón de personal para poder asignarle herramientas o EPP.`);
      return;
    }

    if (selectedItem.status === 'inactivo') {
      alert(`El ítem ${selectedItem.name} se encuentra INACTIVO / fuera de servicio en el catálogo.`);
      return;
    }

    if (selectedItem.stockAvailable < quantity) {
      alert(`Stock insuficiente: sólo quedan ${selectedItem.stockAvailable} unidades disponibles en almacén.`);
      return;
    }

    // Build list of up to 3 responsibles
    const deliverySupervisors: DeliverySupervisor[] = [
      { name: resp1Name.trim(), role: resp1Role.trim(), email: config.supervisor1Email },
    ];
    if (includeResp2 && resp2Name.trim()) {
      deliverySupervisors.push({
        name: resp2Name.trim(),
        role: resp2Role.trim(),
        email: config.supervisor2Email,
      });
    }
    if (includeResp3 && resp3Name.trim()) {
      deliverySupervisors.push({
        name: resp3Name.trim(),
        role: resp3Role.trim(),
        email: config.supervisor3Email,
      });
    }

    const created = createAssignment({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      itemCode: selectedItem.code,
      itemCategory: selectedItem.category,
      workerId: selectedWorker.id,
      workerName: selectedWorker.name,
      workerDni: selectedWorker.dni,
      workerDepartment: selectedWorker.department,
      workerRole: selectedWorker.jobTitle,
      projectId: selectedProjectId || selectedWorker.projectId || undefined,
      projectName: selectedProject?.name || selectedWorker.projectName || 'Obra / Proyecto General',
      quantity,
      deliveryDate,
      dueDate,
      requiresReturn,
      deliveryType: requiresReturn ? 'prestamo_retornable' : 'dotacion_definitiva',
      conditionOnDelivery: condition,
      supervisor: resp1Name.trim(),
      supervisors: deliverySupervisors,
      notes: notes.trim(),
      signedReceipt: true,
    });

    setSelectedAssignmentForAct(created);
    if (onDeliveryCreated) onDeliveryCreated(created);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Nueva Entrega de Herramienta, EPP o Equipo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Registra la custodia y genera el acta de recepción con control de vencimiento y asignación de obra
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Worker Selector */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Colaborador Receptor
              </label>
              {selectedWorker && selectedWorker.status === 'inactivo' && (
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Colaborador Inactivo
                </span>
              )}
            </div>
            <select
              value={selectedWorkerId}
              onChange={(e) => handleWorkerChange(e.target.value)}
              className={`mt-1 w-full rounded-lg border p-2.5 text-xs text-slate-900 dark:text-white ${
                selectedWorker?.status === 'inactivo'
                  ? 'border-rose-400 bg-rose-50/50 dark:border-rose-800 dark:bg-rose-950/30'
                  : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              {workers.map((w) => {
                const isInactive = w.status === 'inactivo';
                return (
                  <option key={w.id} value={w.id} className={isInactive ? 'text-slate-400' : ''}>
                    {isInactive ? '🚫 [INACTIVO] ' : '✅ '}
                    {w.name} — {w.jobTitle} ({w.department}) [DNI: {w.dni}]
                  </option>
                );
              })}
            </select>
          </div>

          {/* Project / Obra Selector */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 dark:border-indigo-950/60 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-indigo-950 dark:text-indigo-200">
                Proyecto / Frente de Obra de Destino
              </label>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                Custodia por Centro de Costo
              </span>
            </div>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full rounded-lg border border-indigo-200 bg-white p-2 text-xs font-semibold text-slate-900 dark:border-indigo-800 dark:bg-slate-800 dark:text-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name} ({p.location})
                </option>
              ))}
            </select>
            {selectedProject && (
              <p className="mt-1.5 text-[11px] text-indigo-700/80 dark:text-indigo-300">
                Residente: <span className="font-semibold">{selectedProject.manager || 'No asignado'}</span> · Ubicación: <span className="font-semibold">{selectedProject.location}</span>
              </p>
            )}
          </div>

          {/* Item Selector with Live Stock & Inactive State */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Ítem a Entregar (Herramienta / EPP / Equipo)
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => handleItemChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {items.map((it) => {
                const isInactive = it.status === 'inactivo';
                return (
                  <option
                    key={it.id}
                    value={it.id}
                    disabled={isInactive || it.stockAvailable <= 0}
                  >
                    {isInactive ? '🚫 [INACTIVO] ' : ''}
                    [{it.code}] {it.name} — Disp: {it.stockAvailable} de {it.stockTotal} ({it.category.toUpperCase()})
                  </option>
                );
              })}
            </select>
            {selectedItem && (
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <span>Ubicación: {selectedItem.location}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {selectedItem.stockAvailable} unidades disponibles
                </span>
                {selectedItem.status === 'inactivo' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-rose-600 font-bold">Ítem Inactivo</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Selector de Modalidad: ¿Requiere Devolución? */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">
              ¿Requiere Devolución al Almacén? (Configuración por Entrega)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRequiresReturn(true)}
                className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition-all ${
                  requiresReturn
                    ? 'border-indigo-600 bg-white font-semibold shadow-2xs text-indigo-950 dark:border-indigo-400 dark:bg-slate-800 dark:text-white'
                    : 'border-slate-200 bg-transparent text-slate-600 hover:bg-white/60 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    requiresReturn
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {requiresReturn && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    SÍ — Préstamo con Devolución
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Para herramientas o equipos que deben retornar al almacén. Activa alertas si se vence el plazo.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRequiresReturn(false)}
                className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition-all ${
                  !requiresReturn
                    ? 'border-emerald-600 bg-white font-semibold shadow-2xs text-emerald-950 dark:border-emerald-400 dark:bg-slate-800 dark:text-white'
                    : 'border-slate-200 bg-transparent text-slate-600 hover:bg-white/60 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    !requiresReturn
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {!requiresReturn && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    NO — Dotación Definitiva
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Para botas de seguridad, cinta métrica, guantes o cascos de uso personal. No exige devolución.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quantity & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                max={selectedItem?.stockAvailable || 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Condición Físico-Mecánica
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="nuevo">Nuevo a estrenar</option>
                <option value="bueno">Buen estado / Operativo</option>
                <option value="regular">Regular con desgaste admisible</option>
              </select>
            </div>
          </div>

          {/* Dates: Delivery Date & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Fecha de Entrega
              </label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                {requiresReturn
                  ? 'Fecha Límite de Devolución al Almacén'
                  : 'Fecha de Reposición / Recambio Programado'}
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">
                {requiresReturn
                  ? 'Dispara alerta roja si la herramienta no es devuelta en esta fecha.'
                  : 'Para programar la siguiente dotación de reposición del colaborador.'}
              </span>
            </div>
          </div>

          {/* 3 Responsables de la Entrega */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-700">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Responsables de la Entrega y Firmantes (Hasta 3)
              </span>
              <span className="text-[10px] text-slate-400">Aparecerán en el Acta Oficial</span>
            </div>

            {/* Responsable 1 (Almacén / Emisor Principal) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">1</span>
                  Responsable 1: Almacén / Emisor Principal (Obligatorio)
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Firma activa</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={resp1Name}
                  onChange={(e) => setResp1Name(e.target.value)}
                  placeholder="Nombre del Supervisor"
                  className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="text"
                  required
                  value={resp1Role}
                  onChange={(e) => setResp1Role(e.target.value)}
                  placeholder="Cargo (ej: Jefe de Almacén)"
                  className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Responsable 2 (Seguridad y Salud SST / HSE) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeResp2}
                    onChange={(e) => setIncludeResp2(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">2</span>
                  Responsable 2: Seguridad y Salud (SST / HSE)
                </label>
                <span className="text-[10px] text-slate-400">
                  {includeResp2 ? 'Firma requerida' : 'Omitido'}
                </span>
              </div>
              {includeResp2 && (
                <div className="grid grid-cols-2 gap-2 pl-5">
                  <input
                    type="text"
                    required={includeResp2}
                    value={resp2Name}
                    onChange={(e) => setResp2Name(e.target.value)}
                    placeholder="Nombre del Supervisor SST"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="text"
                    required={includeResp2}
                    value={resp2Role}
                    onChange={(e) => setResp2Role(e.target.value)}
                    placeholder="Cargo (ej: Supervisora SST / HSE)"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Responsable 3 (Jefatura de Área / Operaciones) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeResp3}
                    onChange={(e) => setIncludeResp3(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">3</span>
                  Responsable 3: Jefatura de Área / Obra
                </label>
                <span className="text-[10px] text-slate-400">
                  {includeResp3 ? 'Firma requerida' : 'Omitido'}
                </span>
              </div>
              {includeResp3 && (
                <div className="grid grid-cols-2 gap-2 pl-5">
                  <input
                    type="text"
                    required={includeResp3}
                    value={resp3Name}
                    onChange={(e) => setResp3Name(e.target.value)}
                    placeholder="Nombre del Jefe de Obra/Área"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="text"
                    required={includeResp3}
                    value={resp3Role}
                    onChange={(e) => setResp3Role(e.target.value)}
                    placeholder="Cargo (ej: Jefe de Operaciones)"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Observaciones / Frente de Obra
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Para montaje de tolvas en sector norte..."
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-xs hover:bg-indigo-700"
            >
              Emitir Entrega y Acta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
