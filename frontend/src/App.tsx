import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './components/common/Notification';
import { AuthProvider } from './context/AuthContext';
import { ModelProvider, useModel } from './context/ModelContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { ModelSettingsModal } from './components/settings/ModelSettingsModal';
import { ContactModal } from './components/modals/ContactModal';
import { TermsModal } from './components/modals/TermsModal';
import { PrivacyModal } from './components/modals/PrivacyModal';
import { DocsModal } from './components/modals/DocsModal';
import { AboutModal } from './components/modals/AboutModal';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { SmartListingWriter } from './components/tools/SmartListingWriter';
import { InvoiceStudio } from './components/tools/InvoiceStudio';
import { ReceiptOrganizer } from './components/tools/ReceiptOrganizer';
import { MarketingCopyWriter } from './components/tools/MarketingCopyWriter';
import { BusinessEmailWriter } from './components/tools/BusinessEmailWriter';
import { SavedProjectsView } from './components/projects/SavedProjectsView';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const { openConfigModal } = useModel();

  // Content Modals
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Sync hash routes with modal views
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#about') setIsAboutOpen(true);
      else if (hash === '#contact') setIsContactOpen(true);
      else if (hash === '#privacy') setIsPrivacyOpen(true);
      else if (hash === '#terms') setIsTermsOpen(true);
      else if (hash === '#docs') setIsDocsOpen(true);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={(view) => setCurrentView(view)} />;
      case 'listing':
        return <SmartListingWriter />;
      case 'invoices':
        return <InvoiceStudio />;
      case 'receipts':
        return <ReceiptOrganizer />;
      case 'marketing':
        return <MarketingCopyWriter />;
      case 'email':
        return <BusinessEmailWriter />;
      case 'projects':
        return <SavedProjectsView />;
      case 'landing':
      default:
        return (
          <LandingPage
            onExploreTools={() => setCurrentView('dashboard')}
            onOpenTool={(tool) => setCurrentView(tool)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {renderCurrentView()}
      </main>

      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenModelConfig={openConfigModal}
      />

      {/* Global Modals */}
      <AuthModal />
      <ModelSettingsModal />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <ModelProvider>
            <MainApp />
          </ModelProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
