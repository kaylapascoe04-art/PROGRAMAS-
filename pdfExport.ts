import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Assignment, WarehouseConfig } from '../types/inventory';

export interface ExportPdfOptions {
  assignment: Assignment;
  config: WarehouseConfig;
  element?: HTMLElement | null;
  preferVector?: boolean;
}

/**
 * Cleanly format and sanitize filename for PDF download
 */
export function getPdfFilename(assignment: Assignment): string {
  const cleanId = assignment.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanWorker = assignment.workerName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 20);
  return `Acta_Entrega_${cleanId}_${cleanWorker}.pdf`;
}

/**
 * Generates an ultra-crisp vector PDF directly using jsPDF primitive instructions
 * guarantees 100% vector text, tiny file size, and works independently of screen rendering.
 */
export function generateVectorPdf(assignment: Assignment, config: WarehouseConfig): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // Document metadata
  doc.setProperties({
    title: `Acta de Entrega ${assignment.id} - ${assignment.workerName}`,
    subject: `Acta Oficial de Custodia y Entrega de ${assignment.itemName}`,
    author: config.companyName || 'Plataforma Web Modular Aura',
    creator: 'jsPDF Inventory Engine',
  });

  // Top decorative bar
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(margin, cursorY, contentWidth, 2, 'F');
  cursorY += 6;

  // Header: Company & Folio
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(config.companyName.toUpperCase() || 'EMPRESA INDUSTRIAL', margin, cursorY);

  // Right-aligned Folio & Date box
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text(`FOLIO: ${assignment.id}`, pageWidth - margin, cursorY, { align: 'right' });

  cursorY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(config.facilityName || 'Planta Principal / Almacén Central', margin, cursorY);
  doc.text(`Fecha Entrega: ${assignment.deliveryDate}`, pageWidth - margin, cursorY, { align: 'right' });

  cursorY += 6;

  // Main Document Title
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(margin, cursorY, contentWidth, 12, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    'ACTA OFICIAL DE ENTREGA Y CUSTODIA DE EQUIPOS, EPP Y HERRAMIENTAS',
    pageWidth / 2,
    cursorY + 5.5,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'DEPARTAMENTO DE SEGURIDAD Y SALUD EN EL TRABAJO (SST / HSE) & GESTIÓN DE ALMACÉN',
    pageWidth / 2,
    cursorY + 9.5,
    { align: 'center' }
  );

  cursorY += 16;

  // SECTION 1: DATOS DEL COLABORADOR RECEPTOR
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, cursorY, contentWidth, 29, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. DATOS DEL COLABORADOR RECEPTOR', margin + 3, cursorY + 4.5);

  const col1X = margin + 3;
  const col2X = margin + contentWidth / 2 + 2;
  const row1Y = cursorY + 10.5;
  const row2Y = cursorY + 16.5;
  const row3Y = cursorY + 22.5;

  // Row 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Nombre Completo:', col1X, row1Y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(assignment.workerName, col1X + 28, row1Y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('DNI / Identificación:', col2X, row1Y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(assignment.workerDni, col2X + 30, row1Y);

  // Row 2
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Departamento / Área:', col1X, row2Y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(assignment.workerDepartment, col1X + 28, row2Y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Puesto / Cargo:', col2X, row2Y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(assignment.workerRole, col2X + 30, row2Y);

  // Row 3: Proyecto / Frente de Obra
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Proyecto / Frente de Obra:', col1X, row3Y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text(assignment.projectName || 'Base Central / Taller', col1X + 38, row3Y);

  if (assignment.projectId) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Código: ${assignment.projectId}`, col2X, row3Y);
  }

  cursorY += 33;

  // SECTION 2: DETALLE DEL ELEMENTO ENTREGADO
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. DETALLE DEL ELEMENTO, EPP O HERRAMIENTA ASIGNADA', margin, cursorY);
  cursorY += 3;

  // Table Header
  const tableX = margin;
  const tableW = contentWidth;
  const thHeight = 6.5;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(tableX, cursorY, tableW, thHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  const colCodeW = 24;
  const colDescW = 60;
  const colModW = 38;
  const colCantW = 14;
  const colCondW = 20;
  const colDateW = tableW - (colCodeW + colDescW + colModW + colCantW + colCondW);

  let cX = tableX + 2;
  doc.text('CÓDIGO', cX, cursorY + 4.5);
  cX += colCodeW;
  doc.text('DESCRIPCIÓN', cX, cursorY + 4.5);
  cX += colDescW;
  doc.text('MODALIDAD', cX, cursorY + 4.5);
  cX += colModW;
  doc.text('CANT.', cX, cursorY + 4.5);
  cX += colCantW;
  doc.text('ESTADO', cX, cursorY + 4.5);
  cX += colCondW;
  doc.text(assignment.requiresReturn ? 'FECHA LÍMITE' : 'PRÓXIMO RECAMBIO', cX, cursorY + 4.5);

  cursorY += thHeight;

  // Table Body Row
  const trHeight = 11;
  doc.setFillColor(255, 255, 255);
  doc.rect(tableX, cursorY, tableW, trHeight, 'FD');

  cX = tableX + 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(assignment.itemCode, cX, cursorY + 5);

  cX += colCodeW;
  doc.text(assignment.itemName.substring(0, 32), cX, cursorY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(assignment.itemCategory.toUpperCase(), cX, cursorY + 8.5);

  cX += colModW;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  if (assignment.requiresReturn) {
    doc.setTextColor(67, 56, 202); // indigo
    doc.text('PRÉSTAMO RETORNABLE', cX, cursorY + 6);
  } else {
    doc.setTextColor(16, 149, 193); // emerald/teal
    doc.text('DOTACIÓN DEFINITIVA', cX, cursorY + 6);
  }

  cX += colCantW;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(String(assignment.quantity), cX + 2, cursorY + 6);

  cX += colCondW;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(assignment.conditionOnDelivery.toUpperCase(), cX, cursorY + 6);

  cX += colCondW;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28); // red/accent
  doc.text(assignment.dueDate, cX, cursorY + 6);

  cursorY += trHeight + 5;

  // SECTION 3: CLÁUSULAS LEGALES Y DE CUSTODIA
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, contentWidth, 68, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. CLÁUSULAS DE CUSTODIA, OBLIGACIONES Y POLÍTICA SST / HSE', margin + 3, cursorY + 4.5);

  let clauseY = cursorY + 9;
  const clauseMargin = margin + 4;
  const clauseWidth = contentWidth - 8;

  const clauses = [
    '1. El colaborador declara haber recibido el ítem en óptimas condiciones operativas, de higiene y con sus dispositivos de seguridad completos, comprometiéndose a su uso exclusivo en las actividades laborales asignadas.',
    '2. Es obligación del trabajador inspeccionar visualmente el equipo antes de cada uso y reportar de manera inmediata a su supervisor cualquier desperfecto, desgaste anómalo o falla de seguridad detectada.',
    assignment.requiresReturn
      ? `3. RÉGIMEN DE PRÉSTAMO RETORNABLE: Al constituir una herramienta o equipo de uso temporal bajo custodia, el trabajador se obliga formalmente a devolverlo físicamente al almacén en la fecha límite estipulada (${assignment.dueDate}) o al término de la tarea asignada.`
      : `3. RÉGIMEN DE DOTACIÓN DEFINITIVA: Al ser un elemento de protección personal intransferible o herramienta menor de asignación directa (ej. botas, casco, cinta métrica), no requiere ser devuelta al fin de turno; permanece en custodia permanente programándose su recambio oficial para el ${assignment.dueDate}.`,
    '4. Queda terminantemente prohibido alterar, modificar, transferir a terceros o dar un uso ajeno a los procedimientos de trabajo seguro a cualquier herramienta o equipo entregado bajo la presente acta.',
    '5. En caso de pérdida, extravío o daño atribuible a negligencia comprobada, la empresa procederá según el reglamento interno de trabajo y las normativas vigentes en seguridad laboral.',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);

  clauses.forEach((c) => {
    const lines = doc.splitTextToSize(c, clauseWidth);
    doc.text(lines, clauseMargin, clauseY);
    clauseY += lines.length * 3.1 + 1.5;
  });

  cursorY += 72;

  // Observaciones especiales si existen
  if (assignment.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Observaciones especiales:', margin, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const noteLines = doc.splitTextToSize(assignment.notes, contentWidth - 35);
    doc.text(noteLines, margin + 35, cursorY);
    cursorY += noteLines.length * 3.5 + 4;
  } else {
    cursorY += 2;
  }

  // SECTION 4: FIRMAS DE CONFORMIDAD (4 RESPONSABLES)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    '4. FIRMAS DE CONFORMIDAD, CUSTODIA Y VALIDACIÓN DE ENTREGA',
    pageWidth / 2,
    cursorY + 3,
    { align: 'center' }
  );

  cursorY += 16;

  // 4 Signatures columns
  const sigColWidth = contentWidth / 4;
  const sigLineW = sigColWidth - 6;

  // Signer 1: Worker
  const s1X = margin + 3;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(s1X, cursorY, s1X + sigLineW, cursorY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(assignment.workerName.substring(0, 22), s1X + sigLineW / 2, cursorY + 3.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`DNI: ${assignment.workerDni}`, s1X + sigLineW / 2, cursorY + 6.5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. TRABAJADOR RECEPTOR', s1X + sigLineW / 2, cursorY + 10, { align: 'center' });

  // Signer 2: Warehouse Supervisor
  const s2X = margin + sigColWidth + 3;
  const sup1Name =
    assignment.supervisors?.[0]?.name ||
    assignment.supervisor ||
    config.supervisor1Name ||
    config.supervisorName ||
    'Ing. Rodrigo Cárdenas';
  const sup1Role =
    assignment.supervisors?.[0]?.role ||
    config.supervisor1Role ||
    config.supervisorRole ||
    'Jefe de Almacén General';

  doc.line(s2X, cursorY, s2X + sigLineW, cursorY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(sup1Name.substring(0, 22), s2X + sigLineW / 2, cursorY + 3.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(sup1Role.substring(0, 24), s2X + sigLineW / 2, cursorY + 6.5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(67, 56, 202); // indigo
  doc.text('2. SUPERVISOR ALMACÉN', s2X + sigLineW / 2, cursorY + 10, { align: 'center' });

  // Signer 3: SST / HSE Supervisor
  const s3X = margin + sigColWidth * 2 + 3;
  const sup2Name =
    assignment.supervisors?.[1]?.name ||
    config.supervisor2Name ||
    'Lic. Marcela Ríos Soto';
  const sup2Role =
    assignment.supervisors?.[1]?.role ||
    config.supervisor2Role ||
    'Coordinadora SST / HSE';

  doc.line(s3X, cursorY, s3X + sigLineW, cursorY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(sup2Name.substring(0, 22), s3X + sigLineW / 2, cursorY + 3.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(sup2Role.substring(0, 24), s3X + sigLineW / 2, cursorY + 6.5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 149, 193); // emerald/teal
  doc.text('3. SUPERVISIÓN SST / HSE', s3X + sigLineW / 2, cursorY + 10, { align: 'center' });

  // Signer 4: Area / Operations Lead
  const s4X = margin + sigColWidth * 3 + 3;
  const sup3Name =
    assignment.supervisors?.[2]?.name ||
    config.supervisor3Name ||
    'Ing. Carlos Mendoza';
  const sup3Role =
    assignment.supervisors?.[2]?.role ||
    config.supervisor3Role ||
    'Jefe de Operaciones / Obra';

  doc.line(s4X, cursorY, s4X + sigLineW, cursorY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(sup3Name.substring(0, 22), s4X + sigLineW / 2, cursorY + 3.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(sup3Role.substring(0, 24), s4X + sigLineW / 2, cursorY + 6.5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6); // amber
  doc.text('4. JEFATURA DE ÁREA', s4X + sigLineW / 2, cursorY + 10, { align: 'center' });

  // Bottom Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Documento digital oficial emitido mediante jsPDF · Folio ${assignment.id} · Generado el ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
    pageWidth / 2,
    pageHeight - 8.5,
    { align: 'center' }
  );

  return doc;
}

/**
 * Main export function:
 * Exports the delivery act to PDF.
 * If an HTML element is provided, it tries high-resolution HTML capture using html2canvas + jsPDF
 * to preserve full logo branding and exact screen fonts.
 * If the element capture is not available or fails, it falls back seamlessly to the vector jsPDF generator.
 */
export async function exportDeliveryActToPdf({
  assignment,
  config,
  element,
  preferVector = false,
}: ExportPdfOptions): Promise<{ success: boolean; filename: string }> {
  const filename = getPdfFilename(assignment);

  // If user explicitly asks for vector or no DOM element is present:
  if (preferVector || !element) {
    const doc = generateVectorPdf(assignment, config);
    doc.save(filename);
    return { success: true, filename };
  }

  try {
    // Attempt high-DPI canvas capture of the rendered sheet
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 8;
    const printW = pageWidth - margin * 2;
    const printH = (canvas.height * printW) / canvas.width;

    // Single page fit if within bounds
    if (printH <= pageHeight - margin * 2) {
      pdf.addImage(imgData, 'JPEG', margin, margin, printW, printH, undefined, 'FAST');
    } else {
      // Scale to fit single page neatly
      const maxH = pageHeight - margin * 2;
      const scaleDown = maxH / printH;
      const scaledW = printW * scaleDown;
      const centeredX = margin + (printW - scaledW) / 2;
      pdf.addImage(imgData, 'JPEG', centeredX, margin, scaledW, maxH, undefined, 'FAST');
    }

    pdf.setProperties({
      title: `Acta de Entrega ${assignment.id}`,
      author: config.companyName || 'Plataforma Web Modular Aura',
      creator: 'jsPDF Delivery Engine',
    });

    pdf.save(filename);
    return { success: true, filename };
  } catch (err) {
    console.warn('html2canvas capture had an issue, falling back to pure vector jsPDF:', err);
    // Bulletproof fallback to pure vector jsPDF
    const doc = generateVectorPdf(assignment, config);
    doc.save(filename);
    return { success: true, filename };
  }
}
