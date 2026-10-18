import React from 'react';
import {
  Zap,
  ShieldCheck,
  ShieldAlert,
  Moon,
  Sun,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  FileText,
  Receipt as ReceiptIcon,
  ShoppingBag,
  Megaphone,
  Mail,
  FolderKanban,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useModel } from '../../context/ModelContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenDocs?: () => void;
  onOpenContact?: () => void;
  onOpenAbout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenDocs,
  onOpenContact,
  onOpenAbout
}) => {
  const { user, logout, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { status, openConfigModal } = useModel();

  const isLanding = currentView === 'landing';
  const isLocal = status?.active_mode === 'local';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-electric-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-white stroke-none" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-brand-800 to-brand-600 dark:from-white dark:via-brand-200 dark:to-electric-400 bg-clip-text text-transparent">
                HustleAI
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                Open AI
              </span>
            </div>
          </button>

          {/* Navigation links */}
          {isLanding ? (
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="#features" className="hover:text-brand-600 dark:hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-white transition-colors">How It Works</a>
              <a href="#open-ai" className="hover:text-brand-600 dark:hover:text-white transition-colors">Open AI & Privacy</a>
              <a href="#pricing" className="hover:text-brand-600 dark:hover:text-white transition-colors">Pricing</a>
              {onOpenDocs && (
                <button
                  onClick={onOpenDocs}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Docs
                </button>
              )}
              {onOpenContact && (
                <button
                  onClick={onOpenContact}
                  className="hover:text-brand-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              )}
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('listing')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  currentView === 'listing'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Listings
              </button>
              <button
                onClick={() => setCurrentView('invoices')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  currentView === 'invoices'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                Invoices
              </button>
              <button
                onClick={() => setCurrentView('receipts')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  currentView === 'receipts'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ReceiptIcon className="w-4 h-4" />
                Receipts
              </button>
              <button
                onClick={() => setCurrentView('marketing')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  currentView === 'marketing'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                Marketing
              </button>
              <button
                onClick={() => setCurrentView('email')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  currentView === 'email'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Mail className="w-4 h-4" />
                Emails
              </button>
              <button
                onClick={() => setCurrentView('projects')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  currentView === 'projects'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                Projects
              </button>
            </nav>
          )}
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-3">
          {/* Privacy & Model Status Badge */}
          <button
            onClick={openConfigModal}
            title="Configure AI Model & Privacy Mode"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isLocal
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
            }`}
          >
            {isLocal ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            )}
            <span className="hidden sm:inline">
              {isLocal ? 'Local Air-Gapped' : 'Remote API'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
          </button>

          {/* Docs / Guide Button */}
          {onOpenDocs && (
            <button
              onClick={onOpenDocs}
              title="Documentation & Guides"
              aria-label="Documentation"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth / Workspace Navigation */}
          {user ? (
            <div className="flex items-center gap-2">
              {isLanding && (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
                >
                  Go to App
                </button>
              )}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {user.full_name || 'Founder'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {user.business_name || 'Solo Venture'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isLanding ? (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-sm shadow-brand-500/20 hover:shadow-md transition-all"
                  >
                    Get Started Free
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCurrentView('landing')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Landing Page
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
