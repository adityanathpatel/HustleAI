import React from 'react';
import { Zap, ShieldCheck, Heart, GitBranch, Lock, BookOpen } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenDocs?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenDocs }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-electric-500 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white stroke-none" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">HustleAI</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              "Your AI. Your Business. Your Rules." — The open-source AI platform built for solo founders, shopkeepers, and freelancers.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Local Inference Compatible
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Tools
            </h4>
            <ul className="space-y-2">
              <li><span className="hover:text-brand-600 dark:hover:text-white transition-colors cursor-pointer">Smart Listing Writer</span></li>
              <li><span className="hover:text-brand-600 dark:hover:text-white transition-colors cursor-pointer">Invoice Studio & PDF</span></li>
              <li><span className="hover:text-brand-600 dark:hover:text-white transition-colors cursor-pointer">Receipt OCR Organizer</span></li>
              <li><span className="hover:text-brand-600 dark:hover:text-white transition-colors cursor-pointer">Marketing Copy Generator</span></li>
              <li><span className="hover:text-brand-600 dark:hover:text-white transition-colors cursor-pointer">Business Email Writer</span></li>
            </ul>
          </div>

          {/* Open Source AI & Privacy */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Open-Source AI
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-slate-400" /> <span>Local Model Support (Ollama)</span></li>
              <li><span>Llama 3.2, Mistral, Phi-3</span></li>
              <li><span>Air-Gapped Offline Execution</span></li>
              <li><span>Zero Cloud Document Leakage</span></li>
              <li><span>Configurable Endpoints</span></li>
            </ul>
          </div>

          {/* Compliance & Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-brand-600 dark:hover:text-white transition-colors">About HustleAI</a></li>
              <li><a href="#docs" className="hover:text-brand-600 dark:hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#privacy" className="hover:text-brand-600 dark:hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-brand-600 dark:hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#contact" className="hover:text-brand-600 dark:hover:text-white transition-colors">Contact Support</a></li>
              <li>
                <a
                  href="https://github.com/hustleai/hustleai"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-brand-600 dark:text-electric-400 hover:underline"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} HustleAI. Open-Source AI for Independent Businesses. MIT Licensed.</p>
          <p className="flex items-center gap-1">
            Empowering freelancers & shopkeepers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};
