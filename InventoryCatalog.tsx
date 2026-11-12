import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Search,
  Plus,
  Wrench,
  HardHat,
  Boxes,
  Edit2,
  Trash2,
  MapPin,
  X,
  AlertCircle,
} from 'lucide-react';
import { InventoryItem, ItemCategory } from '../../types/inventory';

export const InventoryCatalog: React.FC = () => {
  const {
    items,
    addItem,
    updateItem,
    deleteItem,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ItemCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ItemCategory>('herramienta');
  const [formSubcategory, setFormSubcategory] = useState('Eléctricas');
  const [formCode, setFormCode] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formSerial, setFormSerial] = useState('');
  const [formStockTotal, setFormStockTotal] = useState(10);
  const [formLocation, setFormLocation] = useState('Almacén General / Estante A-1');
  const [formLoanDays, setFormLoanDays] = useState(7);
  const [formRequiresReturn, setFormRequiresReturn] = useState(true);
  const [formStatus, setFormStatus] = useState<'activo' | 'inactivo'>('activo');
  const [formNotes, setFormNotes] = useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('herramienta');
    setFormSubcategory('Eléctricas');
    setFormCode(`HER-${Math.floor(100 + Math.random() * 900)}`);
    setFormBrand('');
    setFormModel('');
    setFormSerial('');
    setFormStockTotal(5);
    setFormLocation('Almacén Principal / Estante B-02');
    setFormLoanDays(7);
    setFormRequiresReturn(true);
    setFormStatus('activo');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormSubcategory(item.subcategory);
    setFormCode(item.code);
    setFormBrand(item.brand);
    setFormModel(item.model);
    setFormSerial(item.serialNumber || '');
    setFormStockTotal(item.stockTotal);
    setFormLocation(item.location);
    setFormLoanDays(item.defaultLoanDays);
    setFormRequiresReturn(item.requiresReturn);
    setFormStatus(item.status || 'activo');
    setFormNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const toggleItemStatus = (item: InventoryItem) => {
    const nextStatus = item.status === 'inactivo' ? 'activo' : 'inactivo';
    updateItem(item.id, { status: nextStatus });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    if (editingItem) {
      updateItem(editingItem.id, {
        name: formName.trim(),
        category: formCategory,
        subcategory: formSubcategory.trim(),
        code: formCode.trim(),
        brand: formBrand.trim(),
        model: formModel.trim(),
        serialNumber: formSerial.trim() || undefined,
        stockTotal: Number(formStockTotal) || 1,
        location: formLocation.trim(),
        defaultLoanDays: Number(formLoanDays) || 7,
        requiresReturn: formRequiresReturn,
        status: formStatus,
        notes: formNotes.trim() || undefined,
      });
    } else {
      addItem({
        name: formName.trim(),
        category: formCategory,
        subcategory: formSubcategory.trim(),
        code: formCode.trim(),
        brand: formBrand.trim(),
        model: formModel.trim(),
        serialNumber: formSerial.trim() || undefined,
        stockTotal: Number(formStockTotal) || 1,
        location: formLocation.trim(),
        defaultLoanDays: Number(formLoanDays) || 7,
        requiresReturn: formRequiresReturn,
        status: formStatus,
        notes: formNotes.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const filteredItems = items.filter((it) => {
    const matchesSearch =
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (it.serialNumber && it.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || it.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || (it.status || 'activo') === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Catálogo Maestro de Inventario
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control de existencias de herramientas manuales y eléctricas, EPP reglamentario y equipos
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Ítem</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, descripción, marca o serie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Todos ({items.length})
            </button>
            <button
              onClick={() => setStatusFilter('activo')}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                statusFilter === 'activo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Activos ({items.filter((i) => i.status !== 'inactivo').length})
            </button>
            <button
              onClick={() => setStatusFilter('inactivo')}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                statusFilter === 'inactivo'
                  ? 'bg-slate-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Inactivos ({items.filter((i) => i.status === 'inactivo').length})
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg dark:bg-slate-800 text-xs">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'herramienta', label: 'Herramientas' },
              { id: 'epp', label: 'EPP' },
              { id: 'equipo', label: 'Equipos' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Ítem / Especificación</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">Modalidad</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-center">Total</th>
                <th className="py-3 px-3 text-center">Disponible</th>
                <th className="py-3 px-3 text-center">En Campo</th>
                <th className="py-3 px-3 text-center">Taller</th>
                <th className="py-3 px-3">Ubicación</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-xs text-slate-400">
                    No hay ítems registrados bajo estos criterios.
                  </td>
                </tr>
              ) : (
                filteredItems.map((it) => {
                  const isInactive = it.status === 'inactivo';
                  return (
                    <tr
                      key={it.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isInactive ? 'opacity-70 bg-slate-50/60 dark:bg-slate-800/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {it.code}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {it.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>{it.brand} {it.model}</span>
                          {it.serialNumber && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">S/N: {it.serialNumber}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 capitalize text-slate-600 dark:text-slate-300">
                        <div>{it.category}</div>
                        <div className="text-[11px] text-slate-400">{it.subcategory}</div>
                      </td>

                      <td className="py-3 px-3">
                        {it.requiresReturn ? (
                          <span className="font-mono text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                            Retornable
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Dotación (Sin retorno)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleItemStatus(it)}
                          title={`Haz clic para ${isInactive ? 'activar' : 'inactivar'} ítem`}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                            isInactive
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:hover:bg-emerald-900/80'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isInactive ? 'bg-slate-400' : 'bg-emerald-500'
                            }`}
                          />
                          <span>{isInactive ? 'Inactivo' : 'Activo'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        {it.stockTotal}
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {it.stockAvailable}
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {it.stockAssigned}
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                        {it.stockMaintenance}
                      </td>

                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{it.location}</span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(it)}
                            title="Editar"
                            className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteItem(it.id)}
                            title="Eliminar"
                            className="rounded p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create or Edit Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingItem ? 'Editar Ítem de Inventario' : 'Registrar Nuevo Ítem en Catálogo'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nombre del Ítem / Descripción
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Sierra Circular 7-1/4, Arnés 4 Argollas..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Categoría
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ItemCategory)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="herramienta">Herramienta</option>
                    <option value="epp">EPP (Protección Personal)</option>
                    <option value="equipo">Equipo Especializado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Subcategoría
                  </label>
                  <input
                    type="text"
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    placeholder="Eléctricas, Manuales, Calzado, Alturas..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Código Interno
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="HER-055"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Bosch, 3M, DeWalt..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="GKS 190"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    N° de Serie (si aplica)
                  </label>
                  <input
                    type="text"
                    value={formSerial}
                    onChange={(e) => setFormSerial(e.target.value)}
                    placeholder="SN-1928401"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Stock Total
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formStockTotal}
                    onChange={(e) => setFormStockTotal(parseInt(e.target.value) || 1)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Plazo sugerido (días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formLoanDays}
                    onChange={(e) => setFormLoanDays(parseInt(e.target.value) || 7)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Ubicación en Almacén
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Estante A-01 / Nivel 2"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Configuración de Retorno: ¿Requiere Devolución? */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Modalidad de Entrega en Almacén
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormRequiresReturn(true)}
                    className={`flex items-start gap-2 rounded-lg border p-2 text-left transition-all ${
                      formRequiresReturn
                        ? 'border-indigo-600 bg-white font-semibold shadow-2xs text-indigo-950 dark:border-indigo-400 dark:bg-slate-800 dark:text-white'
                        : 'border-slate-200 bg-transparent text-slate-600 hover:bg-white/60 dark:border-slate-700 dark:text-slate-400'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                        formRequiresReturn
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {formRequiresReturn && <span className="h-1 w-1 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">Retornable (Préstamo)</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Exige devolución (taladros, rotomartillos, equipos).
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormRequiresReturn(false)}
                    className={`flex items-start gap-2 rounded-lg border p-2 text-left transition-all ${
                      !formRequiresReturn
                        ? 'border-emerald-600 bg-white font-semibold shadow-2xs text-emerald-950 dark:border-emerald-400 dark:bg-slate-800 dark:text-white'
                        : 'border-slate-200 bg-transparent text-slate-600 hover:bg-white/60 dark:border-slate-700 dark:text-slate-400'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                        !formRequiresReturn
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {!formRequiresReturn && <span className="h-1 w-1 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">Dotación Definitiva (Sin Retorno)</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        No requiere devolución (botas, cinta métrica, consumibles).
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Estado de Actividad del Ítem */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Estado Operativo del Ítem / Herramienta
                </label>
                <div className="mt-1 flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 p-2.5 flex-1 dark:border-slate-700 has-checked:border-emerald-500 has-checked:bg-emerald-50/30 dark:has-checked:bg-emerald-950/20">
                    <input
                      type="radio"
                      name="itemStatus"
                      value="activo"
                      checked={formStatus === 'activo'}
                      onChange={() => setFormStatus('activo')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Activo</span>
                      <p className="text-[10px] text-slate-500">Habilitado para asignación y entregas</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 p-2.5 flex-1 dark:border-slate-700 has-checked:border-slate-500 has-checked:bg-slate-100/50 dark:has-checked:bg-slate-800">
                    <input
                      type="radio"
                      name="itemStatus"
                      value="inactivo"
                      checked={formStatus === 'inactivo'}
                      onChange={() => setFormStatus('inactivo')}
                      className="text-slate-600 focus:ring-slate-500"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Inactivo</span>
                      <p className="text-[10px] text-slate-500">Baja temporal o fuera de circulación</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-xs hover:bg-indigo-700"
                >
                  {editingItem ? 'Guardar Cambios' : 'Registrar en Catálogo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
