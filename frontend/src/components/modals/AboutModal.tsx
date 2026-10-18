import React from 'react';
import { Modal } from '../common/Modal';
import {
  Zap,
  Heart,
  ShieldCheck,
  Code2,
  ExternalLink,
  Sparkles,
  GitBranch
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  TwitterXIcon,
  InstagramIcon
} from '../common/SocialIcons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenContact }) => {
  const socials = [
    { name: 'Instagram', handle: '@aditya.dhanus', url: 'https://instagram.com/aditya.dhanus', icon: InstagramIcon },
    { name: 'LinkedIn', handle: 'adityanathpatel', url: 'https://linkedin.com/in/adityanathpatel', icon: LinkedinIcon },
    { name: 'X (Twitter)', handle: '@adityadhanus', url: 'https://x.com/adityadhanus', icon: TwitterXIcon },
    { name: 'GitHub', handle: 'adityanathpatel', url: 'https://github.com/adityanathpatel', icon: GithubIcon }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About HustleAI" maxWidth="2xl">
      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {/* Hero Tagline */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-600 via-indigo-600 to-electric-500 text-white space-y-2 text-center shadow-lg shadow-brand-500/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md mb-1">
            <Zap className="w-6 h-6 fill-white stroke-none" />
          </div>
          <h3 className="text-xl font-black tracking-tight">HustleAI</h3>
          <p className="text-xs font-medium text-brand-100 max-w-md mx-auto">
            "Your AI. Your Business. Your Rules." — An open-source, privacy-first business assistant built for solo entrepreneurs, freelancers, and shopkeepers.
          </p>
        </div>

        {/* The Why */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            💡 The Mission Behind HustleAI
          </h4>
          <p>
            Independent creators, marketplace sellers, and neighborhood shopkeepers spend hours every week on mundane administrative overhead: writing multi-platform product descriptions, calculating tax-compliant invoices, sorting crumpled receipt photos, and drafting customer quotations.
          </p>
          <p>
            Proprietary SaaS platforms charge expensive monthly subscriptions and harvest your sensitive business data. <strong>HustleAI changes that</strong> by coupling local open-weight AI (Llama 3.2, Mistral, Phi-3 via Ollama) with deterministic financial mathematics to give you enterprise-grade tooling with 100% data sovereignty.
          </p>
        </div>

        {/* Creator Info */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-navy-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Created & Designed By</span>
              <h5 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                Aditya Nath Patel
              </h5>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              Open-Source Creator
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Passionate full-stack developer and AI systems architect dedicated to democratizing advanced AI workflows for independent hustlers and small businesses worldwide.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 hover:border-brand-400 transition-colors flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{s.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
            Built with Modern Open Technology
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {[
              'React 19',
              'FastAPI (Python)',
              'Tailwind CSS',
              'ReportLab PDF',
              'Ollama & Llama 3.2',
              'Pillow & Tesseract OCR',
              'SQLite & PostgreSQL',
              'Docker Multi-Stage'
            ].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <a
            href="https://github.com/adityanathpatel/HustleAI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-electric-400 hover:underline"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Star on GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            {onOpenContact && (
              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
              >
                Contact Aditya
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
