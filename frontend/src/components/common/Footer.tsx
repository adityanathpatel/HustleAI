import React from 'react';
import {
  Zap,
  ShieldCheck,
  Heart,
  GitBranch,
  Lock,
  BookOpen,
  Mail,
  ExternalLink,
  FileText,
  HelpCircle,
  Cpu
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  TwitterXIcon,
  InstagramIcon
} from './SocialIcons';

interface FooterProps {
  onNavigate?: (view: string) => void;
  onOpenAbout?: () => void;
  onOpenDocs?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenContact?: () => void;
  onOpenModelConfig?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAbout,
  onOpenDocs,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenModelConfig
}) => {
  const socials = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/aditya.dhanus',
      icon: InstagramIcon,
      hoverClass: 'hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/40'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/adityanathpatel',
      icon: LinkedinIcon,
      hoverClass: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40'
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/adityadhanus',
      icon: TwitterXIcon,
      hoverClass: 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/adityanathpatel',
      icon: GithubIcon,
      hoverClass: 'hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/40'
    }
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Creator Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-electric-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Zap className="w-4 h-4 fill-white stroke-none" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                HustleAI
              </span>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              "Your AI. Your Business. Your Rules." — The open-source AI platform empowering solo founders, freelancers, and small shopkeepers.
            </p>

            {/* Creator Badge */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800/80 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Made by <strong>Aditya Nath Patel</strong></span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Open-source architect & developer building privacy-first tools for small business owners.
              </p>
              {/* Creator Social Pills */}
              <div className="flex items-center gap-1 pt-1">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      aria-label={s.name}
                      className={`p-1.5 rounded-lg text-slate-500 dark:text-slate-400 transition-colors ${s.hoverClass}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Local Inference Compatible
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              Business Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate?.('listing')}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  Smart Listing Writer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('invoices')}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  Invoice Studio & PDF Export
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('receipts')}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  Receipt OCR Organizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('marketing')}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  Marketing Copy Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('email')}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  Business Email Writer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('projects')}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  Saved Projects Library
                </button>
              </li>
            </ul>
          </div>

          {/* Open-Source AI Column */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              Open-Source AI & Privacy
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Local Model Support (Ollama)</span>
              </li>
              <li><span>Llama 3.2 3B (Fast & Low RAM)</span></li>
              <li><span>Mistral 7B & Phi-3 Mini</span></li>
              <li><span>Air-Gapped Offline Execution</span></li>
              <li><span>Zero Cloud Document Leakage</span></li>
              <li>
                <button
                  onClick={onOpenModelConfig}
                  className="inline-flex items-center gap-1 text-brand-600 dark:text-electric-400 font-semibold hover:underline mt-1"
                >
                  <Cpu className="w-3 h-3" />
                  Configure Local Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Legal Column */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              Platform & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  About HustleAI
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDocs}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  Documentation & Setup
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  Privacy Policy & Data Sovereignty
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  Terms of Service (MIT)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors text-left"
                >
                  Contact Aditya Nath Patel
                </button>
              </li>
              <li className="pt-1">
                <a
                  href="https://github.com/adityanathpatel/HustleAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-600 dark:text-electric-400 font-semibold hover:underline"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-500">
          <p>
            © {new Date().getFullYear()} <strong>HustleAI</strong>. Open-Source AI for Independent Businesses. MIT Licensed.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> by <strong>Aditya Nath Patel</strong>
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com/aditya.dhanus"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-600 transition-colors"
                title="Instagram"
              >
                Instagram
              </a>
              <span>•</span>
              <a
                href="https://linkedin.com/in/adityanathpatel"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
                title="LinkedIn"
              >
                LinkedIn
              </a>
              <span>•</span>
              <a
                href="https://x.com/adityadhanus"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
                title="X (Twitter)"
              >
                X
              </a>
              <span>•</span>
              <a
                href="https://github.com/adityanathpatel"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-600 transition-colors"
                title="GitHub"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
