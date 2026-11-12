import React, { useState, useEffect, useRef } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Search,
  CheckSquare,
  FileText,
  Users,
  X,
  ArrowRight,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    tasks,
    docs,
    members,
    setActiveModule,
    setActiveDocId,
  } = usePlatform();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const matchedTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );

  const matchedDocs = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.summary.toLowerCase().includes(query.toLowerCase()) ||
      d.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase()) ||
      m.department.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = matchedTasks.length + matchedDocs.length + matchedMembers.length;

  const handleSelectTask = () => {
    setActiveModule('projects');
    setIsSearchOpen(false);
  };

  const handleSelectDoc = (docId: string) => {
    setActiveDocId(docId);
    setActiveModule('docs');
    setIsSearchOpen(false);
  };

  const handleSelectMember = () => {
    setActiveModule('members');
    setIsSearchOpen(false);
  };

  return (
    <div
      onClick={() => setIsSearchOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/50 p-4 pt-20 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tareas, documentos, miembros o departamentos..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden dark:text-white"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex rounded border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {totalResults === 0 && query.trim() !== '' ? (
            <p className="py-8 text-center text-xs text-slate-500">
              No se encontraron coincidencias para &quot;{query}&quot;
            </p>
          ) : null}

          {/* Tasks Section */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <CheckSquare className="h-3.5 w-3.5" />
                <span>Tareas ({matchedTasks.length})</span>
              </div>
              <div className="space-y-1">
                {matchedTasks.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    onClick={handleSelectTask}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-800 text-xs transition-colors"
                  >
                    <div className="overflow-hidden pr-2">
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {t.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {t.description}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Docs Section */}
          {matchedDocs.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <FileText className="h-3.5 w-3.5" />
                <span>Documentos ({matchedDocs.length})</span>
              </div>
              <div className="space-y-1">
                {matchedDocs.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelectDoc(d.id)}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-800 text-xs transition-colors"
                  >
                    <div className="overflow-hidden pr-2">
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {d.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {d.summary}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members Section */}
          {matchedMembers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Users className="h-3.5 w-3.5" />
                <span>Miembros ({matchedMembers.length})</span>
              </div>
              <div className="space-y-1">
                {matchedMembers.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    onClick={handleSelectMember}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-800 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <div className={`h-6 w-6 rounded-md text-[10px] font-bold text-white flex items-center justify-center shrink-0 ${m.avatarBg}`}>
                        {m.avatarInitials}
                      </div>
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {m.name}
                        </span>
                        <span className="text-slate-500 ml-1.5 text-[11px]">
                          ({m.department})
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
