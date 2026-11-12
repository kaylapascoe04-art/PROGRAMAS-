import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { getAccentClasses } from '../../utils/theme';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Download,
  Printer,
  Edit3,
  Check,
  BookOpen,
  Bold,
  Italic,
  Heading,
  List,
  Code,
  Quote,
} from 'lucide-react';
import { DocumentItem } from '../../types/platform';

export const DocsModule: React.FC = () => {
  const {
    config,
    docs,
    activeDocId,
    setActiveDocId,
    addDoc,
    updateDoc,
    deleteDoc,
    members,
    currentRole,
  } = usePlatform();

  const accent = getAccentClasses(config.accentColor);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);

  // Active doc
  const currentDoc = docs.find((d) => d.id === activeDocId) || docs[0];

  // Editable form state for active doc
  const [editTitle, setEditTitle] = useState(currentDoc?.title || '');
  const [editCategory, setEditCategory] = useState(currentDoc?.category || 'General');
  const [editSummary, setEditSummary] = useState(currentDoc?.summary || '');
  const [editContent, setEditContent] = useState(currentDoc?.content || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize edit buffer when activeDocId changes
  const selectDocument = (doc: DocumentItem) => {
    setActiveDocId(doc.id);
    setEditTitle(doc.title);
    setEditCategory(doc.category);
    setEditSummary(doc.summary);
    setEditContent(doc.content);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!currentDoc) return;
    updateDoc(currentDoc.id, {
      title: editTitle,
      category: editCategory,
      summary: editSummary,
      content: editContent,
      readTimeMinutes: Math.max(1, Math.ceil(editContent.split(/\s+/).length / 200)),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    setIsEditing(false);
  };

  const handleCreateNewDoc = () => {
    const author = members.find((m) => m.role === currentRole) || members[0];
    const newId = addDoc({
      title: 'Nuevo Documento sin título',
      category: 'General',
      summary: 'Breve resumen del propósito de este documento...',
      content: `# Nuevo Documento\n\nEscribe aquí las pautas, minutas o notas correspondientes.\n\n## Objetivos\n- Punto 1\n- Punto 2`,
      authorId: author.id,
      authorName: author.name,
      readTimeMinutes: 1,
      isPinned: false,
    });
    setEditTitle('Nuevo Documento sin título');
    setEditCategory('General');
    setEditSummary('Breve resumen del propósito de este documento...');
    setEditContent(`# Nuevo Documento\n\nEscribe aquí las pautas...`);
    setIsEditing(true);
  };

  const handleExportMarkdown = () => {
    if (!currentDoc) return;
    const blob = new Blob([currentDoc.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDoc.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const insertSnippet = (prefix: string, suffix: string = '') => {
    setEditContent((prev) => `${prev}\n${prefix}Texto${suffix}\n`);
  };

  const categories = Array.from(new Set(docs.map((d) => d.category)));

  const filteredDocs = docs.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Base de Documentos y Conocimiento
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Artículos wiki, manuales operativos, políticas y minutas de trabajo
          </p>
        </div>

        <button
          onClick={handleCreateNewDoc}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors ${accent.bgPrimary} ${accent.bgHover}`}
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Documento</span>
        </button>
      </div>

      {/* Main Grid: Sidebar List + Content Viewer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Documents Directory */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="mt-3 flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Todos ({docs.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Document list */}
          <div className="mt-3 divide-y divide-slate-100 max-h-[520px] overflow-y-auto dark:divide-slate-800/80">
            {filteredDocs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No se encontraron documentos
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = currentDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => selectDocument(doc)}
                    className={`cursor-pointer rounded-lg p-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/70 border-l-2 border-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {doc.title}
                      </div>
                      {doc.isPinned && (
                        <Pin className="h-3 w-3 text-amber-500 shrink-0 fill-amber-500" />
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {doc.summary}
                    </p>
                    <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-slate-400">
                      <span>{doc.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{doc.updatedAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Document Viewer & Editor */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          {currentDoc ? (
            <div>
              {/* Doc Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {currentDoc.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Por {currentDoc.authorName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{currentDoc.readTimeMinutes} min de lectura</span>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${accent.bgPrimary} ${accent.bgHover}`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Guardar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Editar</span>
                    </button>
                  )}

                  <button
                    onClick={handleExportMarkdown}
                    title="Descargar Markdown"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={handlePrint}
                    title="Imprimir documento"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Printer className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => deleteDoc(currentDoc.id)}
                    title="Eliminar documento"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:hover:bg-rose-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {saveSuccess && (
                <div className="mt-3 rounded-lg bg-emerald-50 p-2 text-xs text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                  Documento guardado con éxito
                </div>
              )}

              {/* Editing Mode */}
              {isEditing ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Título
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Categoría
                      </label>
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Resumen corto
                      </label>
                      <input
                        type="text"
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => insertSnippet('## ')}
                      title="Título"
                      className="rounded p-1 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Heading className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('**', '**')}
                      title="Negrita"
                      className="rounded p-1 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('*', '*')}
                      title="Cursiva"
                      className="rounded p-1 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('- ')}
                      title="Lista"
                      className="rounded p-1 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('```\n', '\n```')}
                      title="Bloque de código"
                      className="rounded p-1 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Code className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('> ')}
                      title="Cita"
                      className="rounded p-1 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Quote className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Contenido (Markdown soportado)
                    </label>
                    <textarea
                      rows={14}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className={`rounded-lg px-4 py-1.5 text-xs font-semibold text-white ${accent.bgPrimary} ${accent.bgHover}`}
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              ) : (
                /* Read View */
                <article className="mt-5 prose prose-slate max-w-none dark:prose-invert">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {currentDoc.title}
                  </h2>

                  <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs italic text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                    {currentDoc.summary}
                  </div>

                  {/* Render content paragraphs & headers cleanly */}
                  <div className="mt-6 space-y-4 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                    {currentDoc.content.split('\n\n').map((block, idx) => {
                      if (block.startsWith('# ')) {
                        return (
                          <h1 key={idx} className="text-xl font-bold text-slate-900 dark:text-white pt-2">
                            {block.replace('# ', '')}
                          </h1>
                        );
                      }
                      if (block.startsWith('## ')) {
                        return (
                          <h2 key={idx} className="text-base font-bold text-slate-900 dark:text-white pt-2 border-b border-slate-100 pb-1 dark:border-slate-800">
                            {block.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (block.startsWith('### ')) {
                        return (
                          <h3 key={idx} className="text-sm font-semibold text-slate-900 dark:text-white pt-1">
                            {block.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (block.startsWith('- ')) {
                        const items = block.split('\n');
                        return (
                          <ul key={idx} className="list-disc pl-5 space-y-1">
                            {items.map((it, i) => (
                              <li key={i}>{it.replace('- ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={idx}>{block}</p>;
                    })}
                  </div>
                </article>
              )}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center text-xs text-slate-400">
              <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
              <span>Selecciona un documento para visualizar su contenido</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
