import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  FileText,
  Receipt,
  Megaphone,
  Mail,
  FolderKanban,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Sparkles,
  Clock,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useModel } from '../../context/ModelContext';

interface DashboardViewProps {
  onNavigate: (tool: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { status, openConfigModal } = useModel();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await api.dashboard.getStats();
        setData(stats);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const isLocal = status?.active_mode === 'local';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-navy-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-electric-400" />
              <span>Workspace Ready • {user?.business_name || 'Solo Venture'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Founder'}! 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Run your business without the busywork. Automate listings, invoices, receipts, and client marketing with open-source AI tailored to your rules.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate('listing')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-electric-500 to-brand-500 hover:from-electric-600 hover:to-brand-600 text-white font-bold text-xs shadow-lg shadow-electric-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Create Something New
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-electric-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Model & Privacy Status Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isLocal ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
          }`}>
            {isLocal ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                AI Engine: {status?.privacy_badge || 'Local Air-Gapped Mode'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {status?.status_message || 'Running 100% on-device. Zero business data leaves this machine.'}
            </p>
          </div>
        </div>

        <button
          onClick={openConfigModal}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
        >
          Configure Model & Endpoints
        </button>
      </div>

      {/* Usage Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Invoiced</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              ${data?.stats?.total_invoiced_amount?.toFixed(2) || '0.00'}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              {data?.stats?.total_invoices || 0} Bills
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tracked Expenses</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              ${data?.stats?.total_expenses_tracked?.toFixed(2) || '0.00'}
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
              {data?.stats?.total_receipts || 0} Scans
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Saved Assets</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {data?.stats?.saved_projects || 0}
            </span>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full">
              Projects
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">AI Generations</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {data?.stats?.total_generations || 0}
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
              Processed
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Business Assistant Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Listing Writer */}
          <div
            onClick={() => onNavigate('listing')}
            className="group p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Smart Listings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                SEO-optimized titles, bullets, & copy for Amazon, Etsy, & Shopify.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
              Launch Tool <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* 2. Invoice Studio */}
          <div
            onClick={() => onNavigate('invoices')}
            className="group p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Invoice Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Automated tax calculations, client bills, and professional PDF export.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              Create Invoice <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* 3. Receipt Organizer */}
          <div
            onClick={() => onNavigate('receipts')}
            className="group p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Receipts OCR
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Scan expense images, extract merchant & dates, and track deductions.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              Scan Receipt <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* 4. Marketing Copy */}
          <div
            onClick={() => onNavigate('marketing')}
            className="group p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Marketing Copy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Instagram captions, WhatsApp broadcast deals, & festival promos in English & Hindi.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
              Draft Post <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* 5. Business Email */}
          <div
            onClick={() => onNavigate('email')}
            className="group p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Business Emails
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Quotations, payment reminders, order notifications, and customer care.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              Write Email <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Projects & Generation Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Recent Saved Projects
            </h3>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View All
            </button>
          </div>

          {data?.recent_projects && data.recent_projects.length > 0 ? (
            <div className="space-y-2">
              {data.recent_projects.map(p => (
                <div
                  key={p.id}
                  onClick={() => onNavigate('projects')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800/80 hover:border-brand-300 dark:hover:border-brand-700 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {p.tool_type} • Saved {p.updated_at}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No saved projects yet. Generate your first listing or invoice to save it here.
            </div>
          )}
        </div>

        {/* AI Generation Audit Trail */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              AI Inference Audit Log
            </h3>
            <span className="text-[11px] text-slate-400">Transparent execution</span>
          </div>

          {data?.recent_history && data.recent_history.length > 0 ? (
            <div className="space-y-2">
              {data.recent_history.map(h => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-xs">
                      {h.prompt_summary}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{h.created_at}</span>
                      <span>•</span>
                      <span>{h.model_name}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    h.is_local
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {h.is_local ? 'Local' : 'Remote'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent AI generations logged yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
