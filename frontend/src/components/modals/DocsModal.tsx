import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import {
  BookOpen,
  Terminal,
  Cpu,
  ShoppingBag,
  FileText,
  Receipt,
  Megaphone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useNotification } from '../common/Notification';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const DocsModal: React.FC<DocsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'quickstart'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { notify } = useNotification();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    notify('Command copied to clipboard!', 'success');
  };

  const tabs = [
    { id: 'quickstart', label: '🚀 Quickstart', icon: Terminal },
    { id: 'models', label: '🧠 Local AI Setup', icon: Cpu },
    { id: 'tools', label: '🛠️ Business Tools', icon: ShoppingBag },
    { id: 'privacy', label: '🛡️ Air-Gapped Mode', icon: ShieldCheck }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="HustleAI Documentation & User Guide" maxWidth="4xl">
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 overflow-x-auto text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
          {/* TAB 1: QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Getting Started with HustleAI in Under 60 Seconds
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  HustleAI runs locally on Windows, macOS, and Linux with full air-gapped data sovereignty.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Option A: One-Click Launchers
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50 space-y-1.5">
                    <div className="font-bold text-slate-900 dark:text-white">Windows (Powershell / CMD)</div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-navy-900 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                      <code>.\run_dev.bat</code>
                      <button onClick={() => handleCopyCode('.\\run_dev.bat')} className="text-slate-400 hover:text-brand-500">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50 space-y-1.5">
                    <div className="font-bold text-slate-900 dark:text-white">macOS / Linux (Bash)</div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-navy-900 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                      <code>./run_dev.sh</code>
                      <button onClick={() => handleCopyCode('./run_dev.sh')} className="text-slate-400 hover:text-brand-500">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider pt-2">
                  Option B: Docker Compose
                </h5>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50 space-y-2">
                  <p>Deploy backend, frontend, and optional Ollama container in one isolated stack:</p>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-navy-900 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    <code>docker-compose up --build</code>
                    <button onClick={() => handleCopyCode('docker-compose up --build')} className="text-slate-400 hover:text-brand-500">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOCAL AI MODELS */}
          {activeTab === 'models' && (
            <div className="space-y-4">
              <p>
                HustleAI connects seamlessly to local inference runtimes like <strong>Ollama</strong> running at <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-800 font-mono text-[11px]">http://localhost:11434</code>.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">1. Recommended Model: Llama 3.2 (3B)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Fast & Low RAM (~4GB)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Ideal for everyday product listing copy, emails, and social media captions.</p>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-navy-900 font-mono text-[11px]">
                    <code>ollama run llama3.2:3b</code>
                    <button onClick={() => handleCopyCode('ollama run llama3.2:3b')} className="text-slate-400 hover:text-brand-500">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">2. Long Form / Complex Copy: Mistral 7B</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">Apache 2.0 (~8GB RAM)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Excels at detailed quotations, brand storytelling, and complex campaign structures.</p>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-navy-900 font-mono text-[11px]">
                    <code>ollama run mistral:7b</code>
                    <button onClick={() => handleCopyCode('ollama run mistral:7b')} className="text-slate-400 hover:text-brand-500">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">3. Lightweight Reasoning: Phi-3 Mini (3.8B)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">MIT (~3GB VRAM)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Optimized for lightweight laptops and compact devices with strict memory budgets.</p>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-navy-900 font-mono text-[11px]">
                    <code>ollama run phi3:mini</code>
                    <button onClick={() => handleCopyCode('ollama run phi3:mini')} className="text-slate-400 hover:text-brand-500">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOOLS BREAKDOWN */}
          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <ShoppingBag className="w-4 h-4 text-brand-600" />
                  Smart Listing Writer
                </div>
                <p className="text-[11px] text-slate-500">
                  Select target marketplace (Amazon, Etsy, Shopify, eBay, Local Shop). Generates high-converting title, 4 benefit bullets, call-to-action, and indexed SEO keywords.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Invoice Studio & PDF Export
                </div>
                <p className="text-[11px] text-slate-500">
                  Deterministic math calculation with subtotal, discount caps, and percentage taxes. Instant download of branded, vector ReportLab PDF documents.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Receipt className="w-4 h-4 text-amber-600" />
                  Receipt OCR Organizer
                </div>
                <p className="text-[11px] text-slate-500">
                  Drag and drop receipt images. OCR heuristics extract store names, dates, amounts, and tax. Low-confidence fields are flagged with uncertainty badges for review.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Megaphone className="w-4 h-4 text-pink-600" />
                  Marketing Copywriter
                </div>
                <p className="text-[11px] text-slate-500">
                  Bilingual English and Hindi prompt generation for Instagram captions, WhatsApp promotional broadcasts, and festival campaigns with hashtag sets.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: AIR-GAPPED PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/50">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Testing Air-Gapped Mode
              </div>
              <p>
                To verify that HustleAI operates with 100% data sovereignty:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs">
                <li>Make sure Ollama is running locally (<code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-navy-900">http://localhost:11434</code>).</li>
                <li>Turn off your computer's Wi-Fi or disconnect your ethernet cable.</li>
                <li>Open HustleAI at <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-navy-900">http://127.0.0.1:5173</code>.</li>
                <li>Generate a product listing or compile a PDF invoice. Everything executes completely offline with zero packet leakage.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>HustleAI Documentation • Created by Aditya Nath Patel</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </Modal>
  );
};
