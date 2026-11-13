import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SkipToContent } from './SkipToContent';
import { ScrollProgress } from './ScrollProgress';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileDrawer } from './MobileDrawer';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { MobileActionBar } from './MobileActionBar';
import { BackToTop } from './BackToTop';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { StatutoryChecklistModal } from '../common/StatutoryChecklistModal';
import { FirmAssistantWidget } from '../assistant/FirmAssistantWidget';

export const PublicLayout: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F1EBDD] text-[#35271F] font-sans selection:bg-[#294B39] selection:text-[#F1EBDD] relative overflow-x-hidden w-full max-w-full pb-16 md:pb-0">
      <SkipToContent />
      <ScrollProgress />
      <Navbar onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />
      <main id="main-content" tabIndex={-1} className="flex-grow outline-none focus:outline-none">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
      <FloatingWhatsApp />
      <MobileActionBar onOpenChecklist={() => setIsChecklistOpen(true)} />
      <StatutoryChecklistModal isOpen={isChecklistOpen} onClose={() => setIsChecklistOpen(false)} />
      <BackToTop />
      <FirmAssistantWidget />
    </div>
  );
};

export default PublicLayout;
