import React from 'react';
import { Modal } from '../common/Modal';
import { ShieldCheck, Lock, EyeOff, Server, HardDrive, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy & Data Sovereignty" maxWidth="3xl">
      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {/* Core Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
              Your AI. Your Business. Your Rules.
            </h4>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
              HustleAI is architected from the ground up to protect your trade secrets, customer invoices, and financial records from cloud data harvesting.
            </p>
          </div>
        </div>

        {/* Pillar 1: Local Inference */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <HardDrive className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            1. 100% Local Inference by Default
          </div>
          <p>
            When using HustleAI with local open-weight models (like Llama 3.2 via Ollama) or our built-in offline rule engine, <strong>every token and prompt is processed strictly on your computer's CPU/GPU</strong>. No text, financial totals, or receipt images are ever transmitted to any external server.
          </p>
        </div>

        {/* Pillar 2: Zero Telemetry */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <EyeOff className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            2. Zero Telemetry & No Behavioral Tracking
          </div>
          <p>
            HustleAI does not use third-party analytics trackers, advertising cookies, session recording scripts, or behavioral telemetry pixels. Your business revenue, invoice counts, client email addresses, and generated listings remain strictly confidential to your session.
          </p>
        </div>

        {/* Pillar 3: Remote Mode Transparency */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Server className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            3. Explicit Opt-In for Remote AI
          </div>
          <p>
            If you explicitly connect a cloud endpoint (such as OpenRouter, vLLM, or private server in Settings), HustleAI displays a clear badge indicating that data is leaving the device. <strong>HustleAI never silently falls back to remote cloud endpoints</strong> when local models are unavailable.
          </p>
        </div>

        {/* Pillar 4: Local Storage Sovereignty */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Lock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            4. On-Device Storage & Easy Deletion
          </div>
          <p>
            Your saved projects, invoice drafts, and receipt records reside in your local SQLite database (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-800 font-mono text-[10px]">hustleai.db</code>) and <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-800 font-mono text-[10px]">backend/uploads</code> directory. You can delete individual projects with one click or clear the database at any time.
          </p>
        </div>

        {/* Summary Table */}
        <div className="pt-2">
          <table className="w-full text-[11px] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 dark:bg-navy-950 text-slate-800 dark:text-slate-200 font-semibold">
              <tr>
                <th className="p-2.5 text-left">Data Category</th>
                <th className="p-2.5 text-left">Where It Lives</th>
                <th className="p-2.5 text-left">Cloud Shared?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="p-2.5 font-medium">Customer Invoices & Items</td>
                <td className="p-2.5 text-slate-500">Your Local SQLite DB</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">Never</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Receipt Photos & OCR Scans</td>
                <td className="p-2.5 text-slate-500">Local <code className="text-[10px]">/uploads</code> folder</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">Never</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">AI Generation Prompts</td>
                <td className="p-2.5 text-slate-500">Local Memory / Ollama Server</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">Never in Local Mode</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Passwords & Credentials</td>
                <td className="p-2.5 text-slate-500">Argon2/Bcrypt Salted Hashes</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">Never</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Authored by Aditya Nath Patel • Fully Audited for Privacy</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </Modal>
  );
};
