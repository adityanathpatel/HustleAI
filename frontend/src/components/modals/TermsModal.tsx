import React from 'react';
import { Modal } from '../common/Modal';
import { FileText, Shield, Scale, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service" maxWidth="3xl">
      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {/* Header Summary */}
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-navy-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <Scale className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              HustleAI Open Platform Terms of Service
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Last updated: October 2026 • Governed under the permissive MIT Open Source License.
            </p>
          </div>
        </div>

        {/* Section 1: Overview */}
        <div className="space-y-2">
          <h5 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-[10px]">1</span>
            Acceptance & Open Source License
          </h5>
          <p>
            By accessing or using <strong>HustleAI</strong>, you agree to these Terms of Service. HustleAI's application source code is distributed under the <strong>MIT License</strong>. You are permitted to run, modify, fork, and self-host the platform locally or for commercial business operations in compliance with applicable law.
          </p>
        </div>

        {/* Section 2: Ownership of AI Generations */}
        <div className="space-y-2">
          <h5 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-[10px]">2</span>
            Ownership of Generated Content
          </h5>
          <p>
            <strong>You own 100% of all content generated with HustleAI.</strong> This includes marketplace product descriptions, customer email quotations, social media copy, and invoices created through your account. HustleAI claims zero copyright, royalty, or commercial rights over your business materials.
          </p>
        </div>

        {/* Section 3: Financial Calculations & Invoices */}
        <div className="space-y-2">
          <h5 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-[10px]">3</span>
            Invoicing & Mathematical Determinism
          </h5>
          <p>
            HustleAI uses deterministic math algorithms (not probabilistic LLM math) to calculate subtotals, discounts, and percentage taxes. However, tax compliance laws (such as GST, VAT, or local sales tax) vary by jurisdiction. You are solely responsible for ensuring that the tax rates and billing terms entered into your invoices conform to your local tax authorities.
          </p>
        </div>

        {/* Section 4: Privacy & Air-Gapped Local Inference */}
        <div className="space-y-2">
          <h5 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-[10px]">4</span>
            Data Privacy & Local Execution
          </h5>
          <p>
            When operating in <strong>Local Mode</strong>, HustleAI executes prompts through your on-device inference server (such as Ollama or our air-gapped heuristic rule engine). Receipt uploads and invoice records remain strictly on your local disk. If you explicitly choose <strong>Remote Mode</strong>, prompts are transmitted directly to your configured API endpoint.
          </p>
        </div>

        {/* Section 5: Responsible Usage */}
        <div className="space-y-2">
          <h5 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-[10px]">5</span>
            Acceptable Business Use
          </h5>
          <p>
            You agree not to use HustleAI for generating spam, deceptive or fraudulent marketplace listings, non-consensual automated marketing blasts, or forged financial records.
          </p>
        </div>

        {/* Section 6: Limitation of Liability */}
        <div className="space-y-2">
          <h5 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-[10px]">6</span>
            Disclaimer of Warranties
          </h5>
          <p className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Maintained by Aditya Nath Patel & HustleAI Contributors</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </Modal>
  );
};
