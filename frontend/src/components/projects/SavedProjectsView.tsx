import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Search,
  Tag,
  Trash2,
  Copy,
  Check,
  Star,
  ExternalLink,
  ShoppingBag,
  FileText,
  Receipt,
  Megaphone,
  Mail,
  Calendar
} from 'lucide-react';
import { api } from '../../services/api';
import { SavedProject } from '../../types';
import { useNotification } from '../common/Notification';

export const SavedProjectsView: React.FC = () => {
  const { notify } = useNotification();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);
  const [copied, setCopied] = useState(false);

  const loadProjects = async () => {
    try {
      const data = await api.projects.list(filterType === 'all' ? undefined : filterType);
      setProjects(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [filterType]);

  const handleDelete = async (id: number) => {
    try {
      await api.projects.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      if (selectedProject?.id === id) setSelectedProject(null);
      notify('Project deleted', 'info');
    } catch (err: any) {
      notify(err.message || 'Failed to delete project', 'error');
    }
  };

  const handleToggleFavorite = async (p: SavedProject) => {
    try {
      const updated = await api.projects.update(p.id, { is_favorite: !p.is_favorite });
      setProjects(prev => prev.map(item => (item.id === p.id ? updated : item)));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || (p.tags && p.tags.toLowerCase().includes(q));
  });

  const getToolIcon = (type: string) => {
    switch (type) {
      case 'listing': return <ShoppingBag className="w-4 h-4 text-brand-600" />;
      case 'invoice': return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'receipt': return <Receipt className="w-4 h-4 text-amber-600" />;
      case 'marketing': return <Megaphone className="w-4 h-4 text-violet-600" />;
      case 'email': return <Mail className="w-4 h-4 text-indigo-600" />;
      default: return <FolderKanban className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    notify('Content copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Saved Projects & Business Assets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse and retrieve your generated listings, marketing drafts, emails, and invoices.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects by title or tag..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {['all', 'listing', 'invoice', 'receipt', 'marketing', 'email'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl capitalize transition-all shrink-0 ${
              filterType === type
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {type === 'all' ? 'All Projects' : type}
          </button>
        ))}
      </div>

      {/* Projects Grid & Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading saved items...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No saved projects found matching your filter. Use any tool and click "Save Project" to store items here.
            </div>
          ) : (
            filteredProjects.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={`p-4 rounded-2xl bg-white dark:bg-navy-900 border transition-all cursor-pointer ${
                  selectedProject?.id === p.id
                    ? 'border-brand-500 ring-2 ring-brand-500/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 mt-0.5">
                      {getToolIcon(p.tool_type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="capitalize font-medium text-brand-600 dark:text-brand-400">
                          {p.tool_type}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleFavorite(p);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      <Star className={`w-4 h-4 ${p.is_favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(p.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {p.tags && (
                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    {p.tags.split(',').map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-6">
          {selectedProject ? (
            <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Content Preview
                </span>
                <button
                  onClick={() => handleCopyContent(selectedProject.content)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 hover:bg-brand-100 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Content'}
                </button>
              </div>

              <div>
                <h2 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">
                  {selectedProject.title}
                </h2>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[480px] overflow-y-auto text-slate-800 dark:text-slate-200">
                  {selectedProject.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40 dark:bg-navy-950/20">
              <FolderKanban className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Select any saved project from the list to preview and export
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
