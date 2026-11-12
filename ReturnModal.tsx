import React, { useState } from 'react';
import { useInventory } from '../../../context/InventoryContext';
import {
  X,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import { Assignment, ItemCondition } from '../../../types/inventory';

interface ReturnModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  assignment,
  isOpen,
  onClose,
}) => {
  const { registerReturn } = useInventory();

  const [condition, setCondition] = useState<ItemCondition>('bueno');
  const [incidentReport, setIncidentReport] = useState('');

  if (!isOpen || !assignment) return null;

  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    registerReturn(assignment.id, condition, incidentReport);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {assignment.requiresReturn
                ? 'Registrar Devolución en Almacén'
                : 'Registrar Recambio / Cierre de Dotación'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Folio: {assignment.id} · {assignment.itemCode}
              {!assignment.requiresReturn && ' · Modalidad Dotación (Sin retorno al stock)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleReturn} className="mt-4 space-y-4 text-xs">
          {/* Summary Box */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="font-bold text-slate-900 dark:text-white">
              {assignment.itemName}
            </div>
            <div className="mt-1 text-slate-600 dark:text-slate-400">
              Entregado a: <strong className="text-slate-800 dark:text-slate-200">{assignment.workerName}</strong> ({assignment.workerDepartment})
            </div>
            <div className="mt-1 font-mono text-[11px] text-slate-500">
              Fecha de Entrega: {assignment.deliveryDate} · {assignment.requiresReturn ? `Límite: ${assignment.dueDate}` : `Recambio programado: ${assignment.dueDate}`}
            </div>
            {!assignment.requiresReturn && (
              <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-200 dark:border-amber-900/40">
                ℹ️ <strong>Nota:</strong> Este ítem fue entregado como dotación definitiva (no retorna al stock disponible). Registrar esta acción cierra el ciclo de vida del ítem para permitir una nueva entrega o dotación de recambio.
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              {assignment.requiresReturn ? 'Condición al Devolver' : 'Estado al Cierre de Dotación'}
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ItemCondition)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {assignment.requiresReturn ? (
                <>
                  <option value="bueno">✅ Bueno / Operativo (Reintegro directo al stock)</option>
                  <option value="desgastado_normal">⚠️ Desgaste normal por trabajo</option>
                  <option value="danado">❌ Averiado / Dañado (Pasa a taller de mantenimiento)</option>
                  <option value="perdido">🚫 Pérdida / Extravío (Baja de inventario)</option>
                </>
              ) : (
                <>
                  <option value="desgastado_normal">⚠️ Desgaste por uso cumplido (Baja y recambio por vigencia)</option>
                  <option value="danado">❌ Daño prematuro / Inoperativo (Baja anticipada)</option>
                  <option value="bueno">✅ Buen estado (Cierre voluntario / Fin de contrato)</option>
                  <option value="perdido">🚫 Extraviado</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Informe de Incidencias o Estado (Opcional)
            </label>
            <textarea
              rows={3}
              value={incidentReport}
              onChange={(e) => setIncidentReport(e.target.value)}
              placeholder={
                assignment.requiresReturn
                  ? 'Detalla si hubo roturas, cambio de brocas, inspección visual, etc...'
                  : 'Detalla motivo del recambio, inspección visual de la suela/cinta, etc...'
              }
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
              className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow-xs hover:bg-emerald-700"
            >
              {assignment.requiresReturn ? 'Confirmar Retorno a Almacén' : 'Confirmar Cierre / Recambio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
