import React, { useState } from 'react';
import { useInventory } from '../../../context/InventoryContext';
import {
  X,
  Wrench,
  HardHat,
  Boxes,
  RotateCcw,
  AlertOctagon,
  Printer,
  Download,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Worker, Assignment } from '../../../types/inventory';
import { exportDeliveryActToPdf } from '../../../utils/pdfExport';

interface WorkerCustodyModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReturnModal: (assignment: Assignment) => void;
  onViewAct: (assignment: Assignment) => void;
}

export const WorkerCustodyModal: React.FC<WorkerCustodyModalProps> = ({
  worker,
  isOpen,
  onClose,
  onOpenReturnModal,
  onViewAct,
}) => {
  const { assignments, config } = useInventory();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isOpen || !worker) return null;

  const handleDownloadPdf = async (a: Assignment) => {
    try {
      setDownloadingId(a.id);
      await exportDeliveryActToPdf({
        assignment: a,
        config,
        preferVector: true,
      });
    } catch (err) {
      console.error('Error downloading act PDF:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const activeWorkerAssignments = assignments.filter(
    (a) => a.workerId === worker.id && a.status !== 'devuelto'
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ficha Individual de Custodia y Dotación
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {worker.name} — {worker.jobTitle} ({worker.department}) [DNI: {worker.dni}]
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto space-y-3">
          {activeWorkerAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-400">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Sin elementos en custodia actualmente
              </span>
              <span>El colaborador no tiene herramientas ni EPP pendientes de devolución.</span>
            </div>
          ) : (
            activeWorkerAssignments.map((a) => {
              const isOverdue = a.status === 'vencido';
              return (
                <div
                  key={a.id}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-xs ${
                    isOverdue
                      ? 'border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20'
                      : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {a.itemCategory === 'herramienta' ? (
                        <Wrench className="h-4 w-4 text-indigo-500" />
                      ) : (
                        <HardHat className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{a.itemName}</span>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${
                            a.requiresReturn
                              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {a.requiresReturn ? 'Retornable' : 'Dotación'}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span className="font-mono">{a.itemCode}</span>
                        <span aria-hidden="true">·</span>
                        <span>Entregado: {a.deliveryDate}</span>
                        <span aria-hidden="true">·</span>
                        <span className={`font-mono font-bold ${isOverdue ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                          {a.requiresReturn ? 'Límite:' : 'Recambio:'} {a.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewAct(a)}
                      title="Ver Acta"
                      className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenReturnModal(a);
                      }}
                      className={`rounded-lg px-3 py-1.5 font-semibold text-white shadow-xs transition-colors ${
                        a.requiresReturn
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-600'
                      }`}
                    >
                      {a.requiresReturn ? 'Devolver' : 'Recambio'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
