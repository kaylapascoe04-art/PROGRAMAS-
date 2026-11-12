import React, { useState, useRef } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Printer,
  FileCheck,
  Building,
  User,
  Shield,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  Loader2,
  FileText,
  Check,
  Sparkles,
} from 'lucide-react';
import { Assignment } from '../../types/inventory';
import { PlatformLogo } from '../common/PlatformLogo';
import { exportDeliveryActToPdf } from '../../utils/pdfExport';

interface DeliveryActViewerProps {
  onBack?: () => void;
  initialAssignment?: Assignment | null;
}

export const DeliveryActViewer: React.FC<DeliveryActViewerProps> = ({
  onBack,
  initialAssignment,
}) => {
  const {
    assignments,
    config,
    workers,
    selectedAssignmentForAct,
    setSelectedAssignmentForAct,
  } = useInventory();

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const actSheetRef = useRef<HTMLDivElement>(null);

  const currentAssignment = selectedAssignmentForAct || initialAssignment || assignments[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async (preferVector: boolean = false) => {
    if (!currentAssignment) return;
    try {
      setIsExportingPdf(true);
      setPdfSuccessMessage(null);
      const result = await exportDeliveryActToPdf({
        assignment: currentAssignment,
        config,
        element: actSheetRef.current,
        preferVector,
      });
      setPdfSuccessMessage(`Acta exportada exitosamente: ${result.filename}`);
      setTimeout(() => setPdfSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setPdfSuccessMessage('Error al exportar el archivo PDF. Intente con la versión vectorial.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Not visible in print) */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between print:hidden">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Acta Oficial de Entrega y Recepción
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Documento legal de custodia y responsabilidad para entrega de herramientas, EPP y equipos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Entrega */}
          <select
            value={currentAssignment?.id}
            onChange={(e) => {
              const found = assignments.find((a) => a.id === e.target.value);
              if (found) setSelectedAssignmentForAct(found);
            }}
            className="rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} - {a.workerName} ({a.itemName})
              </option>
            ))}
          </select>

          {/* Botón Principal: Descargar PDF con jsPDF */}
          <button
            onClick={() => handleExportPdf(false)}
            disabled={isExportingPdf || !currentAssignment}
            title="Descargar documento en formato PDF de alta resolución con jsPDF"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isExportingPdf ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isExportingPdf ? 'Exportando PDF...' : 'Descargar PDF (jsPDF)'}</span>
          </button>

          {/* Botón Alternativo: PDF Vectorial Ultraligero */}
          <button
            onClick={() => handleExportPdf(true)}
            disabled={isExportingPdf || !currentAssignment}
            title="Genera un archivo PDF 100% vectorial, con texto seleccionable y peso ultraligero"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <FileText className="h-4 w-4 text-indigo-500" />
            <span>PDF Vectorial</span>
          </button>

          {/* Botón Imprimir Navegador */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {pdfSuccessMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 print:hidden animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{pdfSuccessMessage}</span>
          </div>
          <button
            onClick={() => setPdfSuccessMessage(null)}
            className="rounded p-1 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
          >
            &times;
          </button>
        </div>
      )}

      {/* Printable Sheet (Standard A4 / Letter Document format) */}
      <div
        ref={actSheetRef}
        id="delivery-act-sheet"
        className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm print:m-0 print:max-w-none print:border-none print:p-4 print:shadow-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 dark:border-slate-700">
          <div className="flex items-start gap-3.5">
            <PlatformLogo config={config} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Seguridad y Salud en el Trabajo (SST / HSE)
                </span>
              </div>
              <h2 className="mt-0.5 text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                ACTA DE ENTREGA Y CUSTODIA DE EQUIPOS, EPP Y HERRAMIENTAS
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {config.companyName} — {config.facilityName}
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs shrink-0 pl-2">
            <div className="font-bold text-slate-900 dark:text-white">
              FOLIO: {currentAssignment?.id}
            </div>
            <div className="text-slate-500">Fecha: {currentAssignment?.deliveryDate}</div>
          </div>
        </div>

        {/* Worker Details Grid */}
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/40">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 uppercase text-[11px] tracking-wider">
            1. Datos del Colaborador Receptor
          </h3>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Nombre Completo:</span>{' '}
              <strong className="text-slate-900 dark:text-white">{currentAssignment?.workerName}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">DNI / Documento:</span>{' '}
              <strong className="font-mono text-slate-900 dark:text-white">{currentAssignment?.workerDni}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Área / Departamento:</span>{' '}
              <span className="text-slate-900 dark:text-white">{currentAssignment?.workerDepartment}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Puesto / Cargo:</span>{' '}
              <span className="text-slate-900 dark:text-white">{currentAssignment?.workerRole}</span>
            </div>
            <div className="col-span-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Proyecto / Frente de Obra Asignado:</span>{' '}
                <strong className="text-indigo-700 dark:text-indigo-400 font-semibold">
                  {currentAssignment?.projectName || 'Base Central / Taller'}
                </strong>
              </div>
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60">
                {currentAssignment?.projectId || 'PRJ-BASE'}
              </span>
            </div>
          </div>
        </div>

        {/* Item Details Table */}
        <div className="mt-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 uppercase text-[11px] tracking-wider">
            2. Detalle del Elemento o Herramienta Entregada
          </h3>

          <table className="w-full text-left border-collapse border border-slate-200 dark:border-slate-800 text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800">Código</th>
                <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800">Descripción del Ítem</th>
                <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800">Modalidad</th>
                <th className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-800 text-center">Cant.</th>
                <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800">Condición Entrega</th>
                <th className="py-2.5 px-3 text-right">
                  {currentAssignment?.requiresReturn ? 'Límite Devolución' : 'Vigencia / Recambio'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-mono font-bold border-r border-slate-200 dark:border-slate-800">
                  {currentAssignment?.itemCode}
                </td>
                <td className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">{currentAssignment?.itemName}</div>
                  <div className="text-[11px] text-slate-500 capitalize">{currentAssignment?.itemCategory}</div>
                </td>
                <td className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800">
                  {currentAssignment?.requiresReturn ? (
                    <span className="font-semibold text-blue-700 dark:text-blue-400">
                      🔄 Préstamo Retornable
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      📦 Dotación Definitiva (Sin devolución de fin de turno)
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-2 font-mono text-center border-r border-slate-200 dark:border-slate-800">
                  {currentAssignment?.quantity}
                </td>
                <td className="py-2.5 px-3 capitalize border-r border-slate-200 dark:border-slate-800">
                  {currentAssignment?.conditionOnDelivery}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-right tabular-nums">
                  {currentAssignment?.dueDate}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legal Clauses & Commitment */}
        <div className="mt-6 rounded-lg border border-slate-200 p-4 text-[11px] leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 uppercase text-[10px] tracking-wider">
            3. Cláusulas de Custodia y Obligaciones del Colaborador
          </h4>
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>
              El colaborador declara haber recibido el ítem detallado en óptimas condiciones de funcionamiento, limpio y apto para su uso seguro.
            </li>
            <li>
              Se compromete a utilizar la herramienta o equipo de protección personal (EPP) exclusivamente en las actividades laborales asignadas por la empresa.
            </li>
            <li>
              Es responsabilidad del colaborador realizar la inspección previa a cada jornada y reportar cualquier anomalía o daño al supervisor inmediato.
            </li>
            <li>
              {currentAssignment?.requiresReturn ? (
                <span>
                  <strong>Régimen de Préstamo Retornable:</strong> Al ser una herramienta o equipo bajo custodia temporal, el trabajador se obliga formalmente a reintegrarlo físicamente al almacén en la fecha límite estipulada (<strong>{currentAssignment?.dueDate}</strong>) o inmediatamente al término de la labor asignada.
                </span>
              ) : (
                <span>
                  <strong>Régimen de Dotación Definitiva:</strong> Al tratarse de un elemento de dotación personal (ej. botas de seguridad, guantes o herramientas manuales de asignación permanente como cinta métrica), no requiere ser devuelto al almacén al finalizar la jornada. Permanece en custodia del trabajador durante su ciclo de vida útil laboral, programándose su recambio oficial para el <strong>{currentAssignment?.dueDate}</strong> conforme a la política interna de HSE.
                </span>
              )}
            </li>
            <li>
              En caso de extravío, deterioro por negligencia o uso indebido, se aplicará el procedimiento disciplinario interno correspondiente.
            </li>
          </ol>
        </div>

        {/* Observations */}
        {currentAssignment?.notes && (
          <div className="mt-4 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Observaciones especiales: </span>
            <span className="text-slate-600 dark:text-slate-400">{currentAssignment.notes}</span>
          </div>
        )}

        {/* Signatures Block: Worker + Up to 3 Supervisors */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-6">
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-[10px] tracking-wider text-center">
            4. Firmas de Conformidad, Custodia y Validación de Entrega
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2 text-center">
            {/* 1. Firma del Colaborador Receptor */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[170px] border-t-2 border-slate-900 dark:border-slate-600 pt-2">
                <div className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                  {currentAssignment?.workerName}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  DNI: {currentAssignment?.workerDni}
                </div>
                <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                  1. TRABAJADOR RECEPTOR
                </div>
              </div>
            </div>

            {/* 2. Responsable 1 (Almacén) */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[170px] border-t-2 border-slate-900 dark:border-slate-600 pt-2">
                <div className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                  {currentAssignment?.supervisors?.[0]?.name || currentAssignment?.supervisor || config.supervisor1Name || config.supervisorName}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {currentAssignment?.supervisors?.[0]?.role || config.supervisor1Role || config.supervisorRole}
                </div>
                <div className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-tight">
                  2. SUPERVISOR ALMACÉN
                </div>
              </div>
            </div>

            {/* 3. Responsable 2 (SST / HSE) */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[170px] border-t-2 border-slate-900 dark:border-slate-600 pt-2">
                <div className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                  {currentAssignment?.supervisors?.[1]?.name || config.supervisor2Name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {currentAssignment?.supervisors?.[1]?.role || config.supervisor2Role}
                </div>
                <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-tight">
                  3. SUPERVISIÓN SST / HSE
                </div>
              </div>
            </div>

            {/* 4. Responsable 3 (Jefatura de Operaciones / Obra) */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[170px] border-t-2 border-slate-900 dark:border-slate-600 pt-2">
                <div className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                  {currentAssignment?.supervisors?.[2]?.name || config.supervisor3Name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {currentAssignment?.supervisors?.[2]?.role || config.supervisor3Role}
                </div>
                <div className="text-[9px] font-bold text-amber-600 dark:text-amber-400 mt-1 uppercase tracking-tight">
                  4. JEFATURA DE ÁREA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
