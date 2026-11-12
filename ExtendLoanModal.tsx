import React, { useState } from 'react';
import { useInventory } from '../../../context/InventoryContext';
import {
  X,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Assignment } from '../../../types/inventory';

interface ExtendLoanModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExtendLoanModal: React.FC<ExtendLoanModalProps> = ({
  assignment,
  isOpen,
  onClose,
}) => {
  const { extendLoan } = useInventory();

  const [newDueDate, setNewDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [reason, setReason] = useState('');

  if (!isOpen || !assignment) return null;

  const handleExtend = (e: React.FormEvent) => {
    e.preventDefault();
    extendLoan(assignment.id, newDueDate, reason.trim());
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
                ? 'Conceder Prórroga / Extensión de Plazo'
                : 'Extender Vigencia de Dotación / Recambio'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Folio: {assignment.id} · {assignment.itemName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleExtend} className="mt-4 space-y-4 text-xs">
          {/* Summary Box */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>{assignment.requiresReturn ? 'Fecha límite de retorno:' : 'Fecha de recambio prevista:'}</span>
              <strong className="font-mono text-rose-600 dark:text-rose-400">{assignment.dueDate}</strong>
            </div>
            <div className="mt-1 text-slate-600 dark:text-slate-400">
              Colaborador: <strong className="text-slate-800 dark:text-slate-200">{assignment.workerName}</strong>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              {assignment.requiresReturn
                ? 'Nueva Fecha Límite de Devolución al Almacén'
                : 'Nueva Fecha Programada para Recambio'}
            </label>
            <input
              type="date"
              required
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Motivo de la Extensión
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                assignment.requiresReturn
                  ? 'Ej: Continuación de montaje en frente de obra...'
                  : 'Ej: Elemento en excelente estado, prolongación de vida útil...'
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
              className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-xs hover:bg-indigo-700"
            >
              Confirmar Extensión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
