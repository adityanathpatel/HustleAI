import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './components/common/Notification';
import { AuthProvider } from './context/AuthContext';
import { ModelProvider } from './context/ModelContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { ModelSettingsModal } from './components/settings/ModelSettingsModal';
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
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {renderCurrentView()}
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <ModelSettingsModal />
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
